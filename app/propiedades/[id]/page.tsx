import { notFound } from "next/navigation";
import Link from "next/link";
import { JSX } from "react";
import { createServerClient } from "@/lib/supabase-server";
import { Propiedad } from "@/lib/types";
import { formatPrecio, buildWhatsAppUrl } from "@/lib/utils";
import Galeria from "@/components/Galeria";
import DescripcionExpandible from "@/components/DescripcionExpandible";

export const revalidate = 60;

const FACEBOOK = "https://www.facebook.com/share/1B6n82QjaY/?mibextid=wwXIfr";

export default async function PropiedadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sb = createServerClient();
  const { data } = await sb
    .from("propiedades")
    .select("*, propiedad_imagenes(*)")
    .eq("id", id)
    .eq("publicado", true)
    .single();

  if (!data) notFound();
  const propiedad = data as Propiedad;

  const precio = formatPrecio(propiedad.precio, propiedad.tipo_operacion, propiedad.moneda);
  const waUrl = buildWhatsAppUrl(propiedad.titulo, precio);
  const imagenes = [...(propiedad.propiedad_imagenes ?? [])].sort((a, b) => a.orden - b.orden);
  const ubicacion = [propiedad.colonia, propiedad.ciudad, propiedad.estado].filter(Boolean).join(", ");

  type Carac = { label: string; value: number; icon: JSX.Element };
  const caracteristicas: Carac[] = [
    propiedad.recamaras != null        ? { label: "Recámaras", value: propiedad.recamaras,        icon: <BedIcon /> }  : null,
    propiedad.banos != null            ? { label: "Baños",     value: propiedad.banos,            icon: <BathIcon /> } : null,
    propiedad.estacionamientos != null ? { label: "Estac.",    value: propiedad.estacionamientos, icon: <CarIcon /> }  : null,
    propiedad.area_m2 != null          ? { label: "m²",        value: propiedad.area_m2,          icon: <AreaIcon /> } : null,
  ].filter((c): c is Carac => c !== null);

  return (
    <main className="max-w-5xl mx-auto px-5 sm:px-8 py-10">

      {/* Volver */}
      <Link href="/#propiedades"
        className="inline-flex items-center gap-2 text-[13px] text-gray-400 hover:text-[#1a1a2e] transition-colors mb-8">
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Todas las propiedades
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

        {/* Galería */}
        <div className="lg:col-span-3">
          <Galeria imagenes={imagenes} titulo={propiedad.titulo} />
        </div>

        {/* Info */}
        <div className="lg:col-span-2 flex flex-col gap-5">

          {/* Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-[10px] font-bold tracking-[0.18em] uppercase px-3 py-1 rounded-full
              ${propiedad.tipo_operacion === "renta" ? "bg-[#4FA8D5] text-white" : "bg-[#1a1a2e] text-white"}`}>
              {propiedad.tipo_operacion}
            </span>
            {propiedad.tipo_propiedad && (
              <span className="text-[10px] font-semibold tracking-wide uppercase px-3 py-1 rounded-full bg-gray-100 text-gray-500 capitalize">
                {propiedad.tipo_propiedad}
              </span>
            )}
          </div>

          {/* Título, ubicación y precio */}
          <div className="flex flex-col gap-1.5">
            <h1 className="text-2xl sm:text-[1.65rem] font-bold text-[#1a1a2e] leading-snug">
              {propiedad.titulo}
            </h1>
            {ubicacion && (
              <p className="flex items-center gap-1.5 text-[13px] text-gray-400">
                <PinIcon />
                {ubicacion}
              </p>
            )}
            <p className="text-[2rem] font-bold text-[#4FA8D5] leading-tight mt-1">{precio}</p>
          </div>

          {/* Características */}
          {caracteristicas.length > 0 && (
            <div className="grid grid-cols-2 gap-3 border-t border-gray-100 pt-5">
              {caracteristicas.map((c) => (
                <div key={c.label}
                  className="flex items-center gap-2.5 bg-gray-50 rounded-xl px-3 py-2.5">
                  <span className="text-[#4FA8D5]">{c.icon}</span>
                  <div>
                    <div className="text-[15px] font-bold text-[#1a1a2e] leading-none">{c.value}</div>
                    <div className="text-[11px] text-gray-400 mt-0.5">{c.label}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Descripción expandible */}
          <DescripcionExpandible texto={propiedad.descripcion} />

          {/* CTAs */}
          <div className="border-t border-gray-100 pt-5 flex flex-col gap-2.5">
            <a href={waUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-semibold py-3.5 rounded-full text-sm transition-colors">
              <WhatsAppIcon />
              Consultar por WhatsApp
            </a>
            <a href={FACEBOOK} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 border border-[#1877F2]/30 text-[#1877F2] hover:bg-[#1877F2] hover:text-white font-semibold py-3 rounded-full text-sm transition-all">
              <FacebookIcon />
              Ver en Facebook
            </a>
            <p className="text-center text-[11px] text-gray-400 tracking-wide pt-1">
              Respuesta el mismo día · Sin compromiso
            </p>
          </div>

        </div>
      </div>
    </main>
  );
}

/* ── Iconos ── */

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2C8.69 2 6 4.69 6 8c0 4.5 6 12 6 12s6-7.5 6-12c0-3.31-2.69-6-6-6z" />
      <circle cx="12" cy="8" r="2" />
    </svg>
  );
}

function BedIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 12V7a1 1 0 011-1h16a1 1 0 011 1v5" />
      <path d="M3 12h18v5H3z" />
      <path d="M3 17v2m18-2v2" />
      <rect x="7" y="9" width="4" height="3" rx="0.5" />
      <rect x="13" y="9" width="4" height="3" rx="0.5" />
    </svg>
  );
}

function BathIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 12h16v3a4 4 0 01-4 4H8a4 4 0 01-4-4v-3z" />
      <path d="M6 12V5a2 2 0 012-2h1a1 1 0 011 1v1" />
    </svg>
  );
}

function CarIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M5 11l1.5-4.5h11L19 11" />
      <rect x="3" y="11" width="18" height="7" rx="1" />
      <circle cx="7.5" cy="18" r="1.5" />
      <circle cx="16.5" cy="18" r="1.5" />
    </svg>
  );
}

function AreaIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="18" height="18" rx="1" />
      <path d="M3 9h18M9 3v18" strokeDasharray="2 2" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.887v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
    </svg>
  );
}
