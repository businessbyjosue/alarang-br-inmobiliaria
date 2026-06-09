"use client";

import { useTransition } from "react";
import { eliminarPropiedad } from "@/app/admin/actions";

export default function EliminarPropiedad({ id, titulo }: { id: string; titulo: string }) {
  const [pending, start] = useTransition();

  function handleClick() {
    if (!confirm(`¿Eliminar "${titulo}"?\n\nEsta acción eliminará también todas las imágenes y no se puede deshacer.`)) return;
    start(() => eliminarPropiedad(id));
  }

  return (
    <button
      disabled={pending}
      onClick={handleClick}
      className="inline-flex items-center gap-1.5 text-[12px] font-medium text-red-400 hover:text-red-600 transition-colors disabled:opacity-50"
    >
      {pending ? (
        <>
          <svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
          Eliminando…
        </>
      ) : (
        "Eliminar"
      )}
    </button>
  );
}
