-- 003 — Cierra la escritura anónima (RLS)
--
-- Problema: las tablas `propiedades` y `propiedad_imagenes` tenían una política
-- "Escritura anon para admin" con:
--     for all to public using (true) with check (true)
--
-- Las políticas permisivas se combinan con OR, así que esa política anulaba a
-- las restrictivas: cualquiera con NEXT_PUBLIC_SUPABASE_ANON_KEY (que viaja en
-- el bundle del navegador, es pública por diseño) podía INSERT, UPDATE y
-- DELETE. Verificado contra la base: las tres operaciones respondían 2xx.
--
-- La app no necesita esa política: todas las escrituras pasan por Server
-- Actions con SUPABASE_SERVICE_ROLE_KEY, que bypasea RLS por completo.
--
-- No destructiva: no toca datos, columnas ni tablas, y no desactiva RLS.
-- Solo elimina las dos políticas permisivas.
-- Ejecutar en el SQL Editor de Supabase.

begin;

-- `if exists` para que la migración sea repetible sin error.
drop policy if exists "Escritura anon para admin" on public.propiedades;
drop policy if exists "Escritura anon para admin" on public.propiedad_imagenes;

commit;

-- Tras esta migración, para los roles anon/authenticated queda:
--
--   propiedades
--     SELECT  → solo las publicadas  ("Lectura pública de propiedades publicadas")
--     INSERT/UPDATE/DELETE → denegado
--
--   propiedad_imagenes
--     SELECT  → permitido            ("Lectura pública propiedad_imagenes")
--     INSERT/UPDATE/DELETE → denegado
--
--   solicitudes_propiedad
--     RLS activo y sin políticas → denegado todo (los leads no son legibles
--     por el público; el formulario inserta vía service_role)
--
-- El panel admin sigue funcionando porque usa service_role del lado servidor.
