"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase-server";
import { verifySession } from "@/lib/auth";
import { BUCKET } from "@/lib/utils";

// ── Guard de seguridad ─────────────────────────────────────
// Como el cliente admin usa service_role (bypassa RLS), TODA action
// debe verificar primero la sesión admin.
async function requireAdmin() {
  const ok = await verifySession();
  if (!ok) throw new Error("No autorizado");
}

// Traduce errores de Postgres a mensajes claros
function mensajeError(error: { code?: string; message: string }): string {
  if (error.code === "23505") {
    if (error.message.includes("codigo")) return "Ya existe una propiedad con ese código. Usa uno distinto.";
    return "Ya existe un registro con ese valor único.";
  }
  return error.message;
}

// ── Helpers ────────────────────────────────────────────────
function numOrNull(v: FormDataEntryValue | null): number | null {
  if (v === null || v === "") return null;
  return Number(v);
}
function strOrNull(v: FormDataEntryValue | null): string | null {
  if (v === null || v === "") return null;
  return String(v);
}
function camposDesdeForm(fd: FormData) {
  return {
    codigo: strOrNull(fd.get("codigo")),
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

// ── Propiedad ──────────────────────────────────────────────

export async function crearPropiedad(fd: FormData) {
  await requireAdmin();
  const sb = createAdminClient();
  const campos = camposDesdeForm(fd);

  const { data, error } = await sb
    .from("propiedades")
    .insert(campos)
    .select("id")
    .single();

  if (error) throw new Error(mensajeError(error));
  revalidatePath("/admin");
  redirect(`/admin/propiedades/${data.id}/editar`);
}

export async function actualizarPropiedad(id: string, fd: FormData) {
  await requireAdmin();
  const sb = createAdminClient();
  const campos = camposDesdeForm(fd);

  const { error } = await sb
    .from("propiedades")
    .update(campos)
    .eq("id", id);

  if (error) throw new Error(mensajeError(error));
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
