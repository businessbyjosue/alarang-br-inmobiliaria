-- 002 — Código automático de propiedades
--
-- Problema: `propiedades.codigo` es NOT NULL pero no tenía DEFAULT ni trigger,
-- así que un INSERT sin código fallaba con 23502.
--
-- Solución: una secuencia de Postgres genera el código. Es atómica, por lo que
-- dos altas simultáneas nunca reciben el mismo valor.
--
-- No destructiva: no borra datos, columnas ni políticas. Solo añade la
-- secuencia, el DEFAULT y (si faltara) la restricción UNIQUE.
-- Ejecutar en el SQL Editor de Supabase.

begin;

-- 1. Secuencia dedicada al código.
create sequence if not exists propiedades_codigo_seq as bigint;

-- 2. Arranca por encima del código numérico más alto ya existente, para no
--    chocar con las propiedades actuales (formato en uso: 5 dígitos).
--    Si la tabla estuviera vacía, el primer código será 10000.
select setval(
  'propiedades_codigo_seq',
  greatest(
    coalesce((select max(codigo::bigint) from propiedades where codigo ~ '^\d+$'), 0),
    9999
  )
);

-- 3. La base asigna el código cuando el INSERT no lo trae.
alter table propiedades
  alter column codigo set default lpad(nextval('propiedades_codigo_seq')::text, 5, '0');

-- 4. La secuencia pertenece a la columna (se limpia sola si la columna se va).
alter sequence propiedades_codigo_seq owned by propiedades.codigo;

-- 5. UNIQUE sobre `codigo`. La base de producción ya lo tiene; este bloque lo
--    añade solo si falta, para que otros entornos queden iguales.
do $$
begin
  if not exists (
    select 1
    from pg_index i
    join pg_class c on c.oid = i.indrelid
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public'
      and c.relname = 'propiedades'
      and i.indisunique
      and i.indnkeyatts = 1
      and (
        select a.attname
        from pg_attribute a
        where a.attrelid = c.oid and a.attnum = i.indkey[0]
      ) = 'codigo'
  ) then
    alter table propiedades add constraint propiedades_codigo_key unique (codigo);
  end if;
end $$;

commit;
