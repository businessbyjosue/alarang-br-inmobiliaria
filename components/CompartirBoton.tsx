"use client";

import { useState } from "react";

export default function CompartirBoton({ id, titulo }: { id: string; titulo: string }) {
  const [copiado, setCopiado] = useState(false);

  async function compartir() {
    const url = `${window.location.origin}/propiedades/${id}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: titulo, url });
      } catch {
        // El usuario canceló el diálogo de compartir.
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      // Portapapeles no disponible.
    }
  }

  return (
    <button
      type="button"
      onClick={compartir}
      aria-label="Compartir propiedad"
      className="flex items-center gap-1.5 text-[12px] font-semibold text-[#1B2A45] border border-[#1B2A45]/20 hover:bg-[#1B2A45] hover:text-white hover:border-[#1B2A45] px-3.5 py-1.5 rounded-sm transition-all duration-200"
    >
      <ShareIcon />
      {copiado ? "Enlace copiado" : "Compartir"}
    </button>
  );
}

function ShareIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" />
    </svg>
  );
}
