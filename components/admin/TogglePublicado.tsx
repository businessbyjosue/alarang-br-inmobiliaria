"use client";

import { useTransition } from "react";
import { togglePublicado } from "@/app/admin/actions";

export default function TogglePublicado({ id, publicado }: { id: string; publicado: boolean }) {
  const [pending, start] = useTransition();

  return (
    <button
      disabled={pending}
      onClick={() => start(() => togglePublicado(id, !publicado))}
      className={`text-[11px] font-semibold px-3 py-1 rounded-full border transition-colors disabled:opacity-50
        ${publicado
          ? "border-green-200 text-green-600 hover:bg-green-50"
          : "border-gray-200 text-gray-400 hover:bg-gray-50"}`}>
      {publicado ? "Publicada" : "Oculta"}
    </button>
  );
}
