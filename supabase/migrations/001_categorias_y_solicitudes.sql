-- Migración 001 — Categorías (terreno) + Solicitudes "Vende tu propiedad"
-- Ejecutar en el SQL Editor de Supabase. Es aditiva: no borra ni cambia datos existentes.

-- ── 1. Categoría "terreno" ──────────────────────────────────
-- Se reutiliza la columna existente tipo_operacion como categoría,
-- ampliando el CHECK de ('renta','venta') a ('renta','venta','terreno').
alter table propiedades
  drop constraint if exists propiedades_tipo_operacion_check;

alter table propiedades
  add constraint propiedades_tipo_operacion_check
  check (tipo_operacion in ('renta', 'venta', 'terreno'));

-- ── 2. Solicitudes de "Vende tu propiedad" ──────────────────
create table if not exists solicitudes_propiedad (
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

create index if not exists solicitudes_propiedad_created_idx
  on solicitudes_propiedad (created_at desc);

-- La tabla solo se escribe/lee desde el servidor con service_role,
-- así que RLS queda activo sin políticas públicas.
alter table solicitudes_propiedad enable row level security;
