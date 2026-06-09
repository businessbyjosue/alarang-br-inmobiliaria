-- Esquema real (referencia). Ejecutar en el SQL Editor de Supabase.

create table propiedades (
  id              uuid primary key default gen_random_uuid(),
  codigo          text,
  titulo          text not null,
  descripcion     text not null,
  tipo_operacion  text not null check (tipo_operacion in ('renta', 'venta')),
  tipo_propiedad  text,
  precio          numeric not null,
  moneda          text not null default 'MXN',
  ciudad          text not null,
  estado          text,
  colonia         text,
  direccion       text,
  recamaras       int,
  banos           numeric,
  estacionamientos int,
  area_m2         numeric,
  publicado       boolean not null default true,
  created_at      timestamptz default now()
);

create table propiedad_imagenes (
  id            uuid primary key default gen_random_uuid(),
  propiedad_id  uuid not null references propiedades(id) on delete cascade,
  ruta_storage  text not null,
  texto_alt     text,
  orden         int not null default 0,
  es_portada    boolean not null default false,
  created_at    timestamptz default now()
);

create index on propiedad_imagenes(propiedad_id);
create index on propiedades(publicado, tipo_operacion, ciudad);

-- Storage bucket: 'propiedades' (public read, write para admin)
