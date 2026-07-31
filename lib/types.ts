// Categoría de la propiedad. Se reutiliza el campo existente `tipo_operacion`
// en vez de añadir una columna nueva: 'terreno' se suma como tercera categoría.
export type TipoOperacion = "renta" | "venta" | "terreno";
export type Moneda = "MXN" | "USD";

export const CATEGORIAS: { value: TipoOperacion; label: string; plural: string }[] = [
  { value: "venta", label: "Venta", plural: "En venta" },
  { value: "renta", label: "Renta", plural: "En renta" },
  { value: "terreno", label: "Terreno", plural: "Terrenos" },
];

export interface PropiedadImagen {
  id: string;
  propiedad_id: string;
  ruta_storage: string;
  texto_alt: string | null;
  orden: number;
  es_portada: boolean;
  created_at: string;
}

export interface SolicitudPropiedad {
  id: string;
  nombre: string;
  telefono: string;
  email: string | null;
  tipo_propiedad: string;
  tipo_operacion: TipoOperacion;
  precio_deseado: number | null;
  moneda: Moneda;
  ubicacion: string;
  recamaras: number | null;
  banos: number | null;
  area_m2: number | null;
  descripcion: string;
  comentarios: string | null;
  atendida: boolean;
  created_at: string;
}

export interface Propiedad {
  id: string;
  codigo: string | null;
  titulo: string;
  descripcion: string;
  tipo_operacion: TipoOperacion;
  tipo_propiedad: string | null;
  precio: number;
  moneda: Moneda;
  ciudad: string;
  estado: string | null;
  colonia: string | null;
  direccion: string | null;
  recamaras: number | null;
  banos: number | null;
  estacionamientos: number | null;
  area_m2: number | null;
  publicado: boolean;
  created_at: string;
  propiedad_imagenes?: PropiedadImagen[];
}
