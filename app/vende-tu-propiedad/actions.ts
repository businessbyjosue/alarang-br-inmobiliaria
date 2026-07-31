"use server";

import { createAdminClient } from "@/lib/supabase-server";
import { enviarEmail } from "@/lib/email";
import { enviarWhatsApp } from "@/lib/whatsapp";
import { CATEGORIAS, TipoOperacion } from "@/lib/types";

function texto(fd: FormData, campo: string): string {
  return String(fd.get(campo) ?? "").trim();
}
function textoONull(fd: FormData, campo: string): string | null {
  const v = texto(fd, campo);
  return v === "" ? null : v;
}
function numeroONull(fd: FormData, campo: string): number | null {
  const v = texto(fd, campo);
  if (v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export type ResultadoSolicitud = {
  ok: boolean;
  mensaje: string;
  /** false cuando se guardó pero el correo no salió (falta configuración). */
  emailEnviado?: boolean;
};

export async function enviarSolicitud(fd: FormData): Promise<ResultadoSolicitud> {
  const nombre = texto(fd, "nombre");
  const telefono = texto(fd, "telefono");
  const ubicacion = texto(fd, "ubicacion");
  const descripcion = texto(fd, "descripcion");
  const tipoPropiedad = texto(fd, "tipo_propiedad");
  const tipoOperacion = texto(fd, "tipo_operacion") as TipoOperacion;

  // Validación mínima en servidor (el navegador ya valida con required).
  if (!nombre || !telefono || !ubicacion || !descripcion || !tipoPropiedad) {
    return { ok: false, mensaje: "Faltan datos obligatorios. Revisa el formulario." };
  }
  if (!CATEGORIAS.some((c) => c.value === tipoOperacion)) {
    return { ok: false, mensaje: "Selecciona una categoría válida." };
  }

  const solicitud = {
    nombre,
    telefono,
    email: textoONull(fd, "email"),
    tipo_propiedad: tipoPropiedad,
    tipo_operacion: tipoOperacion,
    precio_deseado: numeroONull(fd, "precio_deseado"),
    moneda: texto(fd, "moneda") || "MXN",
    ubicacion,
    recamaras: numeroONull(fd, "recamaras"),
    banos: numeroONull(fd, "banos"),
    area_m2: numeroONull(fd, "area_m2"),
    descripcion,
    comentarios: textoONull(fd, "comentarios"),
  };

  // 1. Guardar en base de datos (fuente de verdad; si el correo falla, no se pierde).
  const sb = createAdminClient();
  const { error } = await sb.from("solicitudes_propiedad").insert(solicitud);
  if (error) {
    console.error("[solicitud] Error al guardar", error);
    return { ok: false, mensaje: "No pudimos registrar tu solicitud. Inténtalo de nuevo o escríbenos por WhatsApp." };
  }

  // 2. Notificar por correo al administrador.
  const emailEnviado = await enviarEmail({
    asunto: `Nueva solicitud: ${tipoPropiedad} en ${ubicacion} — ${nombre}`,
    html: plantillaEmail(solicitud),
    responderA: solicitud.email,
  });

  // 3. Canal WhatsApp: preparado, aún sin proveedor (devuelve false y no bloquea).
  await enviarWhatsApp(`Nueva solicitud de ${nombre} (${telefono}) — ${tipoPropiedad} en ${ubicacion}`);

  return {
    ok: true,
    mensaje: "¡Solicitud enviada! Te contactamos muy pronto.",
    emailEnviado,
  };
}

function fila(etiqueta: string, valor: string | number | null): string {
  if (valor === null || valor === "") return "";
  return `<tr>
    <td style="padding:8px 14px;background:#F3F1EC;font-size:13px;color:#5A5F68;white-space:nowrap;">${etiqueta}</td>
    <td style="padding:8px 14px;font-size:14px;color:#20242C;font-weight:600;">${valor}</td>
  </tr>`;
}

function plantillaEmail(s: {
  nombre: string;
  telefono: string;
  email: string | null;
  tipo_propiedad: string;
  tipo_operacion: string;
  precio_deseado: number | null;
  moneda: string;
  ubicacion: string;
  recamaras: number | null;
  banos: number | null;
  area_m2: number | null;
  descripcion: string;
  comentarios: string | null;
}): string {
  const categoria = CATEGORIAS.find((c) => c.value === s.tipo_operacion)?.label ?? s.tipo_operacion;
  const precio =
    s.precio_deseado != null
      ? new Intl.NumberFormat("es-MX", {
          style: "currency",
          currency: s.moneda === "USD" ? "USD" : "MXN",
          maximumFractionDigits: 0,
        }).format(s.precio_deseado)
      : null;
  const wa = `https://wa.me/${s.telefono.replace(/\D/g, "")}`;

  return `<div style="font-family:Arial,Helvetica,sans-serif;background:#F3F1EC;padding:28px;">
  <div style="max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #E4E0D6;">
    <div style="background:#1B2A45;padding:22px 26px;">
      <div style="color:#B08D57;font-size:11px;letter-spacing:.22em;text-transform:uppercase;font-weight:bold;">Alarang B.R.</div>
      <div style="color:#ffffff;font-size:20px;font-weight:bold;margin-top:6px;">Nueva solicitud de propiedad</div>
    </div>

    <div style="padding:24px 26px;">
      <table style="width:100%;border-collapse:collapse;">
        ${fila("Nombre", s.nombre)}
        ${fila("Teléfono", `${s.telefono} &nbsp;·&nbsp; <a href="${wa}" style="color:#B08D57;">WhatsApp</a>`)}
        ${fila("Correo", s.email ? `<a href="mailto:${s.email}" style="color:#B08D57;">${s.email}</a>` : null)}
        ${fila("Categoría", categoria)}
        ${fila("Tipo de propiedad", s.tipo_propiedad)}
        ${fila("Precio deseado", precio)}
        ${fila("Ubicación", s.ubicacion)}
        ${fila("Recámaras", s.recamaras)}
        ${fila("Baños", s.banos)}
        ${fila("Metros cuadrados", s.area_m2 != null ? `${s.area_m2} m²` : null)}
      </table>

      <div style="margin-top:22px;">
        <div style="font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#8A8E96;font-weight:bold;margin-bottom:6px;">Descripción</div>
        <div style="font-size:14px;color:#20242C;line-height:1.6;white-space:pre-wrap;">${s.descripcion}</div>
      </div>

      ${
        s.comentarios
          ? `<div style="margin-top:20px;">
        <div style="font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#8A8E96;font-weight:bold;margin-bottom:6px;">Comentarios adicionales</div>
        <div style="font-size:14px;color:#20242C;line-height:1.6;white-space:pre-wrap;">${s.comentarios}</div>
      </div>`
          : ""
      }
    </div>

    <div style="background:#F3F1EC;padding:14px 26px;font-size:12px;color:#8A8E96;">
      Enviado desde el formulario "Vende tu propiedad" del sitio web.
    </div>
  </div>
</div>`;
}
