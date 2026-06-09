export type TipoOperacion = "renta" | "venta";
export type Moneda = "MXN" | "USD";

export interface PropiedadImagen {
  id: string;
  propiedad_id: string;
  ruta_storage: string;
  texto_alt: string | null;
  orden: number;
  es_portada: boolean;
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
