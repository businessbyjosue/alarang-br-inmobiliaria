-- Esquema real (referencia). Ejecutar en el SQL Editor de Supabase.

-- La secuencia del código va antes de la tabla (ver migrations/002).
create sequence if not exists propiedades_codigo_seq as bigint;

create table propiedades (
  id              uuid primary key default gen_random_uuid(),
  -- NOT NULL + UNIQUE. La base asigna el código con la secuencia si el INSERT
  -- no lo trae. Formato en uso: número de 5 dígitos.
  codigo          text not null unique
                  default lpad(nextval('propiedades_codigo_seq')::text, 5, '0'),
  titulo          text not null,
  descripcion     text,
  tipo_operacion  text not null check (tipo_operacion in ('renta', 'venta', 'terreno')),
  tipo_propiedad  text not null,
  precio          numeric not null default 0,
  moneda          text not null default 'MXN',
  ciudad          text,
  estado          text,
  colonia         text,
  direccion       text,
  recamaras       int default 0,
  banos           numeric default 0,
  estacionamientos int default 0,
  area_m2         numeric,
  publicado       boolean not null default true,
  created_at      timestamptz default now()
);

alter sequence propiedades_codigo_seq owned by propiedades.codigo;

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

-- Solicitudes del formulario "Vende tu propiedad" (ver migrations/001)
create table solicitudes_propiedad (
  id              uuid primary key default gen_random_uuid(),
  nombre          text not null,
  telefono        text not null,
  email           text,
  tipo_propiedad  text not null,
  tipo_operacion  text not null check (tipo_operacion in ('renta', 'venta', 'terreno')),
  precio_deseado  numeric,
  moneda          text not null default 'MXN',
  ubicacion       text not null,
  recamaras       int,
  banos           numeric,
  area_m2         numeric,
  descripcion     text not null,
  comentarios     text,
  atendida        boolean not null default false,
  created_at      timestamptz default now()
);

-- Storage bucket: 'propiedades' (public read, write para admin)
