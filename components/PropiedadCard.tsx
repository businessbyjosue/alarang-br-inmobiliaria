import Image from "next/image";
import Link from "next/link";
import { Propiedad } from "@/lib/types";
import { formatPrecio, getPortada, buildWhatsAppUrl } from "@/lib/utils";

export default function PropiedadCard({ p }: { p: Propiedad }) {
  const portada = getPortada(p.propiedad_imagenes);
  const precio = formatPrecio(p.precio, p.tipo_operacion, p.moneda);
  const waUrl = buildWhatsAppUrl(p.titulo, precio);
  const ubicacion = [p.colonia, p.ciudad].filter(Boolean).join(", ");

  const caracteristicas = [
    p.recamaras != null   ? { icon: <BedIcon />,     value: p.recamaras,     label: "rec." }    : null,
    p.banos != null       ? { icon: <BathIcon />,    value: p.banos,         label: "baños" }   : null,
    p.area_m2 != null     ? { icon: <AreaIcon />,    value: p.area_m2,       label: "m²" }      : null,
  ].filter(Boolean) as { icon: React.ReactNode; value: number; label: string }[];

  return (
    <article className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-[0_8px_32px_rgba(0,0,0,0.09)] transition-all duration-300 flex flex-col">

      {/* Imagen */}
      <Link href={`/propiedades/${p.id}`} className="relative block aspect-[4/3] overflow-hidden bg-gray-100">
        <Image
          src={portada}
          alt={p.titulo}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-[1.04] transition-transform duration-500 ease-out"
        />

        {/* Gradiente inferior para legibilidad del badge */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-1.5">
          <span className={`text-[10px] font-bold tracking-[0.18em] uppercase px-3 py-1 rounded-full backdrop-blur-sm
            ${p.tipo_operacion === "renta"
              ? "bg-[#4FA8D5] text-white"
              : "bg-[#1a1a2e] text-white"}`}>
            {p.tipo_operacion}
          </span>
          {p.tipo_propiedad && (
            <span className="text-[10px] font-semibold tracking-wide uppercase px-3 py-1 rounded-full bg-white/85 backdrop-blur-sm text-gray-600 capitalize">
              {p.tipo_propiedad}
            </span>
          )}
        </div>
      </Link>

      {/* Cuerpo */}
      <div className="flex flex-col flex-1 px-5 pt-4 pb-5 gap-3">

        {/* Ubicación + título */}
        <div>
          {ubicacion && (
            <p className="text-[11px] font-medium tracking-[0.12em] text-gray-400 uppercase mb-1.5 flex items-center gap-1">
              <PinIcon />
              {ubicacion}
            </p>
          )}
          <Link href={`/propiedades/${p.id}`}>
            <h3 className="text-[15px] font-semibold text-[#1a1a2e] leading-snug hover:text-[#4FA8D5] transition-colors line-clamp-2">
              {p.titulo}
            </h3>
          </Link>
        </div>

        {/* Características */}
        {caracteristicas.length > 0 && (
          <div className="flex items-center gap-4 pt-1">
            {caracteristicas.map((c, i) => (
              <div key={i} className="flex items-center gap-1.5 text-gray-500">
                <span className="text-gray-400">{c.icon}</span>
                <span className="text-[12px] font-medium text-[#1a1a2e]">{c.value}</span>
                <span className="text-[11px] text-gray-400">{c.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Divisor */}
        <div className="border-t border-gray-100 mt-auto pt-3 flex items-center justify-between">
          <span className="text-[17px] font-bold text-[#1a1a2e] tracking-tight">{precio}</span>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[12px] font-semibold text-[#25D366] border border-[#25D366]/25 hover:bg-[#25D366] hover:text-white hover:border-[#25D366] px-3.5 py-1.5 rounded-full transition-all duration-200"
          >
            <WhatsAppIcon />
            WhatsApp
          </a>
        </div>
      </div>
    </article>
  );
}

/* ── Iconos ── */

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2C8.69 2 6 4.69 6 8c0 4.5 6 12 6 12s6-7.5 6-12c0-3.31-2.69-6-6-6z" />
      <circle cx="12" cy="8" r="2" />
    </svg>
  );
}

function BedIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.8">
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
    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 12h16v3a4 4 0 01-4 4H8a4 4 0 01-4-4v-3z" />
      <path d="M6 12V5a2 2 0 012-2h1a1 1 0 011 1v1" />
    </svg>
  );
}

function AreaIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="18" height="18" rx="1" />
      <path d="M3 9h18M9 3v18" strokeDasharray="2 2" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}
