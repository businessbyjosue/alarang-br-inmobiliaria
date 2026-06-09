"use client";

import { useState } from "react";
import Image from "next/image";
import { PropiedadImagen } from "@/lib/types";
import { imagenUrl } from "@/lib/utils";

export default function Galeria({ imagenes, titulo }: { imagenes: PropiedadImagen[]; titulo: string }) {
  const [activa, setActiva] = useState(0);

  if (imagenes.length === 0) {
    return (
      <div className="aspect-[4/3] rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
        Sin imágenes
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Imagen principal */}
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100">
        <Image
          src={imagenUrl(imagenes[activa].ruta_storage)}
          alt={imagenes[activa].texto_alt ?? `${titulo} — imagen ${activa + 1}`}
          fill
          sizes="(max-width: 1024px) 100vw, 60vw"
          className="object-cover transition-opacity duration-300"
          priority={activa === 0}
        />

        {/* Navegación flechas */}
        {imagenes.length > 1 && (
          <>
            <button onClick={() => setActiva((a) => (a - 1 + imagenes.length) % imagenes.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 transition-colors">
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button onClick={() => setActiva((a) => (a + 1) % imagenes.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 transition-colors">
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>

            {/* Contador */}
            <span className="absolute bottom-3 right-3 bg-black/50 text-white text-[11px] font-medium px-2.5 py-1 rounded-full">
              {activa + 1} / {imagenes.length}
            </span>
          </>
        )}
      </div>

      {/* Miniaturas */}
      {imagenes.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {imagenes.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setActiva(i)}
              className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all
                ${i === activa ? "border-[#4FA8D5]" : "border-transparent opacity-60 hover:opacity-90"}`}>
              <Image src={imagenUrl(img.ruta_storage)} alt="" fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
