"use client";

import { useState, useTransition, useRef } from "react";
import Image from "next/image";
import { PropiedadImagen } from "@/lib/types";
import { imagenUrl } from "@/lib/utils";
import { subirImagen, eliminarImagen, setPortada, reordenarImagenes } from "@/app/admin/actions";

export default function ImagenesManager({
  propiedadId,
  imagenes: inicial,
}: {
  propiedadId: string;
  imagenes: PropiedadImagen[];
}) {
  const [imagenes, setImagenes] = useState(
    [...inicial].sort((a, b) => a.orden - b.orden)
  );
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [pending, start] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true);
    setError("");

    try {
      for (const file of files) {
        // Subida + insert del lado servidor (service_role, sin RLS)
        const fd = new FormData();
        fd.append("file", file);
        const nueva = await subirImagen(propiedadId, fd);

        setImagenes((prev) => [
          ...prev,
          {
            id: nueva.id,
            propiedad_id: propiedadId,
            ruta_storage: nueva.ruta_storage,
            texto_alt: null,
            orden: nueva.orden,
            es_portada: nueva.es_portada,
            created_at: new Date().toISOString(),
          },
        ]);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al subir imagen");
    }

    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  function handleEliminar(img: PropiedadImagen) {
    if (!confirm("¿Eliminar esta imagen?")) return;
    start(async () => {
      await eliminarImagen(img.id, propiedadId, img.ruta_storage);
      setImagenes((prev) => prev.filter((i) => i.id !== img.id));
    });
  }

  function handlePortada(img: PropiedadImagen) {
    start(async () => {
      await setPortada(img.id, propiedadId);
      setImagenes((prev) =>
        prev.map((i) => ({ ...i, es_portada: i.id === img.id }))
      );
    });
  }

  async function mover(index: number, dir: -1 | 1) {
    const nuevo = [...imagenes];
    const target = index + dir;
    if (target < 0 || target >= nuevo.length) return;
    [nuevo[index], nuevo[target]] = [nuevo[target], nuevo[index]];
    const conOrden = nuevo.map((img, i) => ({ ...img, orden: i }));
    setImagenes(conOrden);
    start(() =>
      reordenarImagenes(
        conOrden.map(({ id, orden }) => ({ id, orden })),
        propiedadId
      )
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Upload */}
      <div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleUpload}
          id="upload-img"
        />
        <label htmlFor="upload-img"
          className={`inline-flex items-center gap-2 cursor-pointer border-2 border-dashed border-gray-200 hover:border-[#4FA8D5] rounded-xl px-5 py-3 text-sm text-gray-500 hover:text-[#4FA8D5] transition-colors ${uploading ? "opacity-60 pointer-events-none" : ""}`}>
          <UploadIcon />
          {uploading ? "Subiendo..." : "Subir imágenes"}
        </label>
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>

      {/* Lista */}
      {imagenes.length === 0 ? (
        <p className="text-sm text-gray-400">Sin imágenes todavía.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {imagenes.map((img, i) => (
            <div key={img.id}
              className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl px-3 py-2">

              {/* Miniatura */}
              <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                <Image src={imagenUrl(img.ruta_storage)} alt={img.texto_alt ?? ""} fill sizes="56px" className="object-cover" />
              </div>

              {/* Portada badge */}
              <div className="flex-1 min-w-0">
                {img.es_portada && (
                  <span className="text-[10px] font-bold tracking-widest uppercase text-[#4FA8D5] bg-[#4FA8D5]/10 px-2 py-0.5 rounded-full">
                    Portada
                  </span>
                )}
                <p className="text-[11px] text-gray-400 truncate mt-0.5">Orden {i + 1}</p>
              </div>

              {/* Acciones */}
              <div className="flex items-center gap-1 shrink-0">
                {/* Subir / bajar */}
                <IconBtn onClick={() => mover(i, -1)} disabled={i === 0 || pending} title="Subir">▲</IconBtn>
                <IconBtn onClick={() => mover(i, 1)} disabled={i === imagenes.length - 1 || pending} title="Bajar">▼</IconBtn>

                {/* Portada */}
                {!img.es_portada && (
                  <button onClick={() => handlePortada(img)} disabled={pending}
                    className="text-[11px] text-gray-400 hover:text-[#4FA8D5] px-2 py-1 rounded transition-colors disabled:opacity-50">
                    Portada
                  </button>
                )}

                {/* Eliminar */}
                <button onClick={() => handleEliminar(img)} disabled={pending}
                  className="text-[11px] text-red-400 hover:text-red-600 px-2 py-1 rounded transition-colors disabled:opacity-50">
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function IconBtn({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button {...props}
      className="w-7 h-7 flex items-center justify-center text-[11px] text-gray-400 hover:text-[#1a1a2e] rounded disabled:opacity-30 transition-colors">
      {children}
    </button>
  );
}

function UploadIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}
