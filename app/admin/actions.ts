"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase-server";
import { verifySession } from "@/lib/auth";
import { BUCKET } from "@/lib/utils";
import { normalizarCodigo, esCodigoValido, siguienteCodigo } from "@/lib/codigo";

// ── Guard de seguridad ─────────────────────────────────────
// Como el cliente admin usa service_role (bypassa RLS), TODA action
// debe verificar primero la sesión admin.
async function requireAdmin() {
  const ok = await verifySession();
  if (!ok) throw new Error("No autorizado");
}

type ErrorPg = { code?: string; message: string };

// Colisión de clave única sobre `codigo`.
function esColisionCodigo(error: ErrorPg): boolean {
  return error.code === "23505" && error.message.includes("codigo");
}

// La base rechazó el insert por `codigo` nulo: la migración 002 (DEFAULT con
// secuencia) todavía no está aplicada en este entorno.
function faltaCodigo(error: ErrorPg): boolean {
  return error.code === "23502" && error.message.includes('"codigo"');
}

// Traduce errores de Postgres a mensajes claros. El detalle crudo se registra
// en el servidor; a la interfaz solo sale un mensaje seguro.
function mensajeError(error: ErrorPg, contexto: string): string {
  console.error(`[admin/${contexto}] Supabase ${error.code ?? "sin-codigo"}: ${error.message}`);

  if (error.code === "23505") {
    if (esColisionCodigo(error)) return "Ya existe una propiedad con ese código. Usa uno distinto.";
    return "Ya existe un registro con ese valor único.";
  }
  if (error.code === "23502") {
    return "Faltan datos obligatorios de la propiedad. Revisa el formulario.";
  }
  return "No se pudo guardar la propiedad. Inténtalo de nuevo.";
}

// ── Helpers ────────────────────────────────────────────────
// Un 0 llega como "0" (no como ""), así que se conserva como 0 y no se
// convierte en null: "0 estacionamientos" es un dato válido.
function numOrNull(v: FormDataEntryValue | null): number | null {
  if (v === null || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}
function strOrNull(v: FormDataEntryValue | null): string | null {
  if (v === null || v === "") return null;
  return String(v);
}
// `codigo` queda fuera a propósito: crear y editar lo tratan distinto
// (al crear se genera si falta; al editar se conserva el existente).
function camposDesdeForm(fd: FormData) {
  return {
    titulo: String(fd.get("titulo")),
    descripcion: String(fd.get("descripcion")),
    tipo_operacion: String(fd.get("tipo_operacion")),
    tipo_propiedad: strOrNull(fd.get("tipo_propiedad")),
    precio: Number(fd.get("precio")),
    moneda: String(fd.get("moneda")),
    ciudad: String(fd.get("ciudad")),
    estado: strOrNull(fd.get("estado")),
    colonia: strOrNull(fd.get("colonia")),
    direccion: strOrNull(fd.get("direccion")),
    recamaras: numOrNull(fd.get("recamaras")),
    banos: numOrNull(fd.get("banos")),
    estacionamientos: numOrNull(fd.get("estacionamientos")),
    area_m2: numOrNull(fd.get("area_m2")),
    publicado: fd.get("publicado") === "on",
  };
}

type Campos = ReturnType<typeof camposDesdeForm>;

// Campos NOT NULL de la tabla `propiedades`, con su etiqueta en el formulario.
const OBLIGATORIOS: [keyof Campos, string][] = [
  ["titulo", "el título"],
  ["tipo_operacion", "la categoría"],
  ["tipo_propiedad", "el tipo de propiedad"],
  ["moneda", "la moneda"],
];

// Devuelve un mensaje para el administrador, o null si los datos sirven.
function validarCampos(campos: Campos): string | null {
  for (const [campo, etiqueta] of OBLIGATORIOS) {
    if (!campos[campo]) return `Falta ${etiqueta}.`;
  }
  if (!Number.isFinite(campos.precio)) return "El precio debe ser un número válido.";
  if (campos.precio < 0) return "El precio no puede ser negativo.";
  return null;
}

// ── Propiedad ──────────────────────────────────────────────

const MAX_INTENTOS_CODIGO = 5;

type FilaNueva = Campos & { codigo?: string };
type Resultado = { id: string; error: null } | { id: null; error: ErrorPg };

// Inserta y devuelve el id, o el error de Postgres si falló.
async function insertar(
  sb: ReturnType<typeof createAdminClient>,
  fila: FilaNueva
): Promise<Resultado> {
  const { data, error } = await sb.from("propiedades").insert(fila).select("id").single();
  if (error) return { id: null, error };
  return { id: data.id as string, error: null };
}

// Respaldo para entornos sin la migración 002: genera el código desde el
// servidor a partir del mayor existente y reintenta si otra alta se adelantó.
// El UNIQUE de `codigo` es lo que impide duplicados; el reintento solo evita
// que el administrador vea un error por una carrera.
async function insertarGenerandoCodigo(
  sb: ReturnType<typeof createAdminClient>,
  campos: Campos
): Promise<string> {
  const { data, error } = await sb.from("propiedades").select("codigo");
  if (error) {
    console.error(`[admin/crear] No se pudieron leer los códigos existentes: ${error.message}`);
    throw new Error("No se pudo generar el código de la propiedad. Inténtalo de nuevo.");
  }
  const usados = (data ?? []).map((fila) => fila.codigo);

  for (let intento = 0; intento < MAX_INTENTOS_CODIGO; intento++) {
    const codigo = siguienteCodigo(usados, intento);
    // Red de seguridad: nunca se envía un código vacío o nulo al insert.
    if (!esCodigoValido(codigo)) {
      throw new Error("El código de la propiedad no puede quedar vacío.");
    }

    const res = await insertar(sb, { ...campos, codigo });
    if (!res.error) return res.id;
    if (!esColisionCodigo(res.error)) throw new Error(mensajeError(res.error, "crear"));
  }

  throw new Error("No se pudo generar un código disponible. Inténtalo de nuevo.");
}

export async function crearPropiedad(fd: FormData) {
  await requireAdmin();
  const sb = createAdminClient();
  const campos = camposDesdeForm(fd);

  const invalido = validarCampos(campos);
  if (invalido) throw new Error(invalido);

  const codigoManual = normalizarCodigo(fd.get("codigo"));
  let id: string;

  if (codigoManual !== null) {
    // El administrador escribió un código: manda el suyo.
    const res = await insertar(sb, { ...campos, codigo: codigoManual });
    if (res.error) throw new Error(mensajeError(res.error, "crear"));
    id = res.id;
  } else {
    // Sin código: se omite del insert para que lo asigne el DEFAULT de la base
    // (secuencia, migración 002). Es atómico, así que dos altas simultáneas
    // nunca reciben el mismo valor.
    const res = await insertar(sb, campos);
    if (!res.error) {
      id = res.id;
    } else if (faltaCodigo(res.error)) {
      id = await insertarGenerandoCodigo(sb, campos);
    } else {
      throw new Error(mensajeError(res.error, "crear"));
    }
  }

  revalidatePath("/");
  revalidatePath("/admin");
  redirect(`/admin/propiedades/${id}/editar`);
}

export async function actualizarPropiedad(id: string, fd: FormData) {
  await requireAdmin();
  const sb = createAdminClient();
  const campos = camposDesdeForm(fd);

  const invalido = validarCampos(campos);
  if (invalido) throw new Error(invalido);

  // Si el campo llega vacío no se toca: la propiedad conserva su código actual.
  const codigo = normalizarCodigo(fd.get("codigo"));
  const cambios = codigo === null ? campos : { ...campos, codigo };

  const { error } = await sb
    .from("propiedades")
    .update(cambios)
    .eq("id", id);

  if (error) throw new Error(mensajeError(error, "actualizar"));
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath(`/propiedades/${id}`);
}

export async function eliminarPropiedad(id: string) {
  await requireAdmin();
  const sb = createAdminClient();

  // Borrar archivos del Storage antes de eliminar la propiedad
  const { data: imgs } = await sb
    .from("propiedad_imagenes")
    .select("ruta_storage")
    .eq("propiedad_id", id);
  if (imgs && imgs.length > 0) {
    await sb.storage.from(BUCKET).remove(imgs.map((i) => i.ruta_storage));
  }

  const { error } = await sb.from("propiedades").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function togglePublicado(id: string, publicado: boolean) {
  await requireAdmin();
  const sb = createAdminClient();
  const { error } = await sb.from("propiedades").update({ publicado }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
  revalidatePath(`/propiedades/${id}`);
}

// ── Imágenes ───────────────────────────────────────────────

// Sube el archivo al Storage E inserta el registro, todo del lado servidor
// con service_role. Devuelve los datos de la imagen creada.
export async function subirImagen(propiedadId: string, fd: FormData) {
  await requireAdmin();
  const sb = createAdminClient();

  const file = fd.get("file");
  if (!(file instanceof File)) throw new Error("Archivo inválido");

  const ext = file.name.split(".").pop();
  const path = `${propiedadId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  // 1. Subir al Storage
  const { error: upErr } = await sb.storage.from(BUCKET).upload(path, file, {
    upsert: false,
    contentType: file.type || undefined,
  });
  if (upErr) throw new Error(`Storage: ${upErr.message}`);

  // 2. Calcular orden (cuántas imágenes ya tiene)
  const { count } = await sb
    .from("propiedad_imagenes")
    .select("*", { count: "exact", head: true })
    .eq("propiedad_id", propiedadId);
  const orden = count ?? 0;
  const esPortada = orden === 0;

  // 3. Insertar registro
  const { data, error } = await sb
    .from("propiedad_imagenes")
    .insert({
      propiedad_id: propiedadId,
      ruta_storage: path,
      texto_alt: null,
      orden,
      es_portada: esPortada,
    })
    .select("id")
    .single();

  if (error) {
    // Si falla el insert, limpiamos el archivo huérfano
    await sb.storage.from(BUCKET).remove([path]);
    throw new Error(error.message);
  }

  revalidatePath(`/admin/propiedades/${propiedadId}/editar`);
  revalidatePath(`/propiedades/${propiedadId}`);

  return { id: data.id as string, ruta_storage: path, orden, es_portada: esPortada };
}

export async function eliminarImagen(imagenId: string, propiedadId: string, rutaStorage: string) {
  await requireAdmin();
  const sb = createAdminClient();

  // Borrar archivo del Storage (no crítico si falla)
  if (rutaStorage) await sb.storage.from(BUCKET).remove([rutaStorage]);

  const { error } = await sb.from("propiedad_imagenes").delete().eq("id", imagenId);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/propiedades/${propiedadId}/editar`);
  revalidatePath(`/propiedades/${propiedadId}`);
}

export async function setPortada(imagenId: string, propiedadId: string) {
  await requireAdmin();
  const sb = createAdminClient();
  await sb.from("propiedad_imagenes").update({ es_portada: false }).eq("propiedad_id", propiedadId);
  const { error } = await sb.from("propiedad_imagenes").update({ es_portada: true }).eq("id", imagenId);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/propiedades/${propiedadId}/editar`);
  revalidatePath(`/propiedades/${propiedadId}`);
}

export async function reordenarImagenes(
  updates: { id: string; orden: number }[],
  propiedadId: string
) {
  await requireAdmin();
  const sb = createAdminClient();
  await Promise.all(
    updates.map(({ id, orden }) =>
      sb.from("propiedad_imagenes").update({ orden }).eq("id", id)
    )
  );
  revalidatePath(`/admin/propiedades/${propiedadId}/editar`);
  revalidatePath(`/propiedades/${propiedadId}`);
}
