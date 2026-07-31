"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { CATEGORIAS } from "@/lib/types";

// Los filtros viven en la URL (?categoria=&zona=&min=&max=) para que la página
// siga siendo un Server Component y el resultado sea compartible.
export default function Filtros({ zonas }: { zonas: string[] }) {
  const router = useRouter();
  const params = useSearchParams();

  const categoria = params.get("categoria") ?? "";
  const zona = params.get("zona") ?? "";
  const min = params.get("min") ?? "";
  const max = params.get("max") ?? "";
  const hayFiltros = Boolean(categoria || zona || min || max);

  const setParam = useCallback(
    (clave: string, valor: string) => {
      const next = new URLSearchParams(params.toString());
      if (valor) next.set(clave, valor);
      else next.delete(clave);
      router.replace(`/?${next.toString()}#propiedades`, { scroll: false });
    },
    [params, router]
  );

  return (
    <div className="bg-[#F3F1EC] border border-[#E4E0D6] rounded-sm p-4 sm:p-5 mb-8">
      {/* Categorías */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <Chip activo={categoria === ""} onClick={() => setParam("categoria", "")}>
          Todas
        </Chip>
        {CATEGORIAS.map((c) => (
          <Chip key={c.value} activo={categoria === c.value} onClick={() => setParam("categoria", c.value)}>
            {c.plural}
          </Chip>
        ))}
      </div>

      {/* Zona y precio */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <Etiqueta>Zona</Etiqueta>
          <select value={zona} onChange={(e) => setParam("zona", e.target.value)} className={campoCls}>
            <option value="">Todas las zonas</option>
            {zonas.map((z) => (
              <option key={z} value={z}>{z}</option>
            ))}
          </select>
        </div>
        <div>
          <Etiqueta>Precio mínimo</Etiqueta>
          <input
            type="number"
            min="0"
            inputMode="numeric"
            placeholder="Sin mínimo"
            defaultValue={min}
            onBlur={(e) => setParam("min", e.target.value)}
            className={campoCls}
          />
        </div>
        <div>
          <Etiqueta>Precio máximo</Etiqueta>
          <input
            type="number"
            min="0"
            inputMode="numeric"
            placeholder="Sin máximo"
            defaultValue={max}
            onBlur={(e) => setParam("max", e.target.value)}
            className={campoCls}
          />
        </div>
      </div>

      {hayFiltros && (
        <button
          onClick={() => router.replace("/#propiedades", { scroll: false })}
          className="mt-3 text-[12px] font-semibold text-[#B08D57] hover:text-[#96784A] transition-colors"
        >
          Limpiar filtros
        </button>
      )}
    </div>
  );
}

const campoCls =
  "w-full bg-white border border-[#E4E0D6] rounded-sm px-3 py-2.5 text-sm text-[#1B2A45] focus:outline-none focus:border-[#B08D57] focus:ring-1 focus:ring-[#B08D57]";

function Etiqueta({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-500 mb-1.5">{children}</p>
  );
}

function Chip({
  activo,
  onClick,
  children,
}: {
  activo: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`font-display text-[11px] font-bold uppercase tracking-[0.12em] px-4 py-2 rounded-sm transition-colors ${
        activo
          ? "bg-[#1B2A45] text-white"
          : "bg-white text-gray-500 border border-[#E4E0D6] hover:border-[#B08D57] hover:text-[#1B2A45]"
      }`}
    >
      {children}
    </button>
  );
}
