"use client";

import { useState, useTransition } from "react";
import { CATEGORIAS } from "@/lib/types";
import { enviarSolicitud, ResultadoSolicitud } from "@/app/vende-tu-propiedad/actions";

const WHATSAPP = "https://wa.me/527712026857";

export default function VenderForm() {
  const [pending, start] = useTransition();
  const [resultado, setResultado] = useState<ResultadoSolicitud | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setResultado(null);
    start(async () => {
      try {
        const r = await enviarSolicitud(fd);
        setResultado(r);
        if (r.ok) window.scrollTo({ top: 0, behavior: "smooth" });
      } catch {
        setResultado({ ok: false, mensaje: "Ocurrió un error al enviar. Inténtalo de nuevo." });
      }
    });
  }

  if (resultado?.ok) {
    return (
      <div className="bg-white border border-[#E4E0D6] rounded-sm p-10 text-center">
        <div className="w-14 h-14 rounded-full bg-[#B08D57]/10 flex items-center justify-center mx-auto mb-5">
          <svg viewBox="0 0 24 24" className="w-7 h-7 text-[#B08D57]" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h2 className="font-display text-xl font-extrabold text-[#1B2A45] mb-2">
          Solicitud recibida
        </h2>
        <p className="text-[14px] text-gray-500 leading-relaxed max-w-sm mx-auto mb-6">
          Gracias por confiar en Alarang B.R. Revisamos los datos de tu propiedad y
          te contactamos por teléfono o WhatsApp lo antes posible.
        </p>
        <a
          href={WHATSAPP}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block font-display text-[12px] font-bold uppercase tracking-[0.12em] bg-[#25D366] hover:bg-[#1ebe5d] text-white px-7 py-3.5 rounded-sm transition-colors"
        >
          Escribirnos por WhatsApp
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-[#E4E0D6] rounded-sm p-6 sm:p-8 flex flex-col gap-7">

      {/* Contacto */}
      <div>
        <Seccion>Tus datos de contacto</Seccion>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Campo etiqueta="Nombre completo" requerido>
            <input name="nombre" required autoComplete="name" placeholder="Ej. María López" className={inputCls} />
          </Campo>
          <Campo etiqueta="Teléfono / WhatsApp" requerido>
            <input name="telefono" required type="tel" inputMode="tel" autoComplete="tel" placeholder="Ej. 771 202 6857" className={inputCls} />
          </Campo>
          <div className="sm:col-span-2">
            <Campo etiqueta="Correo electrónico" ayuda="Opcional — te enviamos la confirmación por aquí.">
              <input name="email" type="email" autoComplete="email" placeholder="tucorreo@ejemplo.com" className={inputCls} />
            </Campo>
          </div>
        </div>
      </div>

      {/* Propiedad */}
      <div>
        <Seccion>Sobre tu propiedad</Seccion>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Campo etiqueta="Tipo de propiedad" requerido>
            <select name="tipo_propiedad" required defaultValue="casa" className={inputCls}>
              <option value="casa">Casa</option>
              <option value="departamento">Departamento</option>
              <option value="terreno">Terreno</option>
              <option value="local">Local comercial</option>
              <option value="oficina">Oficina</option>
              <option value="otro">Otro</option>
            </select>
          </Campo>

          <Campo etiqueta="Categoría" requerido>
            <select name="tipo_operacion" required defaultValue="venta" className={inputCls}>
              {CATEGORIAS.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </Campo>

          <Campo etiqueta="Precio deseado" ayuda="Si no lo tienes definido, déjalo vacío.">
            <div className="flex gap-2">
              <input name="precio_deseado" type="number" min="0" step="any" inputMode="numeric" placeholder="Ej. 1500000" className={inputCls} />
              <select name="moneda" defaultValue="MXN" className={`${inputCls} w-24 shrink-0`}>
                <option value="MXN">MXN</option>
                <option value="USD">USD</option>
              </select>
            </div>
          </Campo>

          <Campo etiqueta="Ubicación" requerido ayuda="Colonia y ciudad.">
            <input name="ubicacion" required placeholder="Ej. Centro, Pachuca, Hidalgo" className={inputCls} />
          </Campo>
        </div>
      </div>

      {/* Características */}
      <div>
        <Seccion>Características (opcional)</Seccion>
        <div className="grid grid-cols-3 gap-4">
          <Campo etiqueta="Recámaras">
            <input name="recamaras" type="number" min="0" inputMode="numeric" placeholder="—" className={inputCls} />
          </Campo>
          <Campo etiqueta="Baños">
            <input name="banos" type="number" min="0" step="any" inputMode="decimal" placeholder="—" className={inputCls} />
          </Campo>
          <Campo etiqueta="Metros²">
            <input name="area_m2" type="number" min="0" step="any" inputMode="decimal" placeholder="—" className={inputCls} />
          </Campo>
        </div>
      </div>

      {/* Descripción */}
      <div>
        <Seccion>Cuéntanos más</Seccion>
        <div className="flex flex-col gap-4">
          <Campo etiqueta="Descripción breve" requerido>
            <textarea
              name="descripcion"
              required
              rows={4}
              placeholder="Estado de la propiedad, servicios, antigüedad, por qué la vendes o rentas…"
              className={`${inputCls} resize-none`}
            />
          </Campo>
          <Campo etiqueta="Comentarios adicionales">
            <textarea
              name="comentarios"
              rows={3}
              placeholder="Horarios para contactarte, urgencia, documentos disponibles…"
              className={`${inputCls} resize-none`}
            />
          </Campo>
        </div>
      </div>

      {resultado && !resultado.ok && (
        <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-sm">
          {resultado.mensaje}
        </div>
      )}

      <div className="flex flex-col gap-3 border-t border-[#E4E0D6] pt-6">
        <button
          type="submit"
          disabled={pending}
          className="font-display inline-flex items-center justify-center gap-2 text-[12px] font-bold uppercase tracking-[0.14em] bg-[#1B2A45] hover:bg-[#B08D57] text-white px-8 py-4 rounded-sm transition-colors disabled:opacity-60"
        >
          {pending && <Spinner />}
          {pending ? "Enviando…" : "Enviar solicitud"}
        </button>
        <p className="text-[12px] text-gray-500 text-center leading-relaxed">
          Sin costo ni compromiso. Usamos tus datos únicamente para contactarte
          sobre esta propiedad.
        </p>
      </div>
    </form>
  );
}

/* ── Sub-componentes ── */

const inputCls =
  "w-full bg-white border border-[#E4E0D6] rounded-sm px-3.5 py-3 text-sm text-[#1B2A45] placeholder:text-gray-400 focus:outline-none focus:border-[#B08D57] focus:ring-1 focus:ring-[#B08D57] transition-colors";

function Seccion({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-display text-[11px] font-bold uppercase tracking-[0.2em] text-[#B08D57] mb-4">
      {children}
    </h2>
  );
}

function Campo({
  etiqueta,
  requerido,
  ayuda,
  children,
}: {
  etiqueta: string;
  requerido?: boolean;
  ayuda?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-[12px] font-semibold text-[#1B2A45] mb-1.5">
        {etiqueta}
        {requerido && <span className="text-[#B08D57] ml-0.5">*</span>}
      </span>
      {children}
      {ayuda && <span className="block text-[11px] text-gray-400 mt-1.5">{ayuda}</span>}
    </label>
  );
}

function Spinner() {
  return (
    <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );
}
