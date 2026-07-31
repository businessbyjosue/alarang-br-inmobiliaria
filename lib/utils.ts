import { supabase } from "./supabase";
import { PropiedadImagen, TipoOperacion, Moneda, CATEGORIAS } from "./types";

export const BUCKET = "Propiedades";

// Convierte una ruta de storage en URL pública. Si ya es URL, la deja igual.
export function imagenUrl(ruta?: string | null): string {
  if (!ruta) return "/placeholder.svg";
  if (ruta.startsWith("http")) return ruta;
  return supabase.storage.from(BUCKET).getPublicUrl(ruta).data.publicUrl;
}

export function formatPrecio(
  precio: number,
  tipoOperacion: TipoOperacion,
  moneda: Moneda = "MXN"
): string {
  const formatted = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: moneda,
    maximumFractionDigits: 0,
  }).format(precio);
  return tipoOperacion === "renta" ? `${formatted}/mes` : formatted;
}

export function getPortada(imagenes?: PropiedadImagen[]): string {
  if (!imagenes || imagenes.length === 0) return "/placeholder.svg";
  const portada = imagenes.find((i) => i.es_portada);
  const ruta = portada
    ? portada.ruta_storage
    : [...imagenes].sort((a, b) => a.orden - b.orden)[0].ruta_storage;
  return imagenUrl(ruta);
}

export function categoriaLabel(tipoOperacion: TipoOperacion): string {
  return CATEGORIAS.find((c) => c.value === tipoOperacion)?.label ?? tipoOperacion;
}

// Badge de categoría: bronce para renta, marino para venta, carbón para terreno.
export function categoriaBadgeCls(tipoOperacion: TipoOperacion): string {
  if (tipoOperacion === "renta") return "bg-[#B08D57] text-white";
  if (tipoOperacion === "terreno") return "bg-[#20242C] text-white";
  return "bg-[#1B2A45] text-white";
}

// Mapa sin API key: Google Maps en modo embed a partir del texto de ubicación.
export function mapaQuery(partes: (string | null | undefined)[]): string | null {
  const q = partes.filter(Boolean).join(", ").trim();
  return q.length > 0 ? q : null;
}

export function mapaEmbedUrl(query: string): string {
  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&z=14&output=embed`;
}

export function mapaLinkUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export function buildWhatsAppUrl(titulo: string, precio: string): string {
  const msg = encodeURIComponent(
    `Hola, me interesa la propiedad: ${titulo} (${precio}). ¿Podría darme más información?`
  );
  return `https://wa.me/527712026857?text=${msg}`;
}
