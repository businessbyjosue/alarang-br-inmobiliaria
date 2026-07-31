"use client";

import { useState } from "react";

const LIMITE = 280; // caracteres antes de truncar

export default function DescripcionExpandible({ texto }: { texto: string }) {
  const [expandida, setExpandida] = useState(false);
  const necesitaTruncar = texto.length > LIMITE;
  const textoVisible = necesitaTruncar && !expandida ? texto.slice(0, LIMITE).trimEnd() + "…" : texto;

  return (
    <div className="border-t border-gray-100 pt-6">
      <p className="text-gray-600 text-[14px] leading-relaxed">{textoVisible}</p>
      {necesitaTruncar && (
        <button
          onClick={() => setExpandida((v) => !v)}
          className="mt-2 text-[13px] font-medium text-[#B08D57] hover:text-[#96784A] transition-colors"
        >
          {expandida ? "Ver menos ↑" : "Ver más ↓"}
        </button>
      )}
    </div>
  );
}
