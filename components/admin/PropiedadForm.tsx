"use client";

import { useTransition, useState, useCallback } from "react";
import { Propiedad } from "@/lib/types";
import Toast from "./Toast";

interface Props {
  propiedad?: Propiedad;
  action: (fd: FormData) => Promise<void>;
  submitLabel: string;
}

export default function PropiedadForm({ propiedad, action, submitLabel }: Props) {
  const [pending, start] = useTransition();
  const [error, setError] = useState("");
  const [guardado, setGuardado] = useState(false);
  const [mostrarToast, setMostrarToast] = useState(false);

  const cerrarToast = useCallback(() => setMostrarToast(false), []);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setGuardado(false);
    const fd = new FormData(e.currentTarget);
    start(async () => {
      try {
        await action(fd);
        // Feedback doble: estado del botón + toast
        setGuardado(true);
        setMostrarToast(true);
        setTimeout(() => setGuardado(false), 2500);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Error al guardar");
      }
    });
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">

        {/* Datos principales */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <Label>Título</Label>
            <Input name="titulo" defaultValue={propiedad?.titulo} required />
          </div>

          <div>
            <Label>Código (opcional)</Label>
            <Input name="codigo" defaultValue={propiedad?.codigo ?? ""} placeholder="Ej. ALR-001" />
          </div>

          <div>
            <Label>Tipo de propiedad</Label>
            <select name="tipo_propiedad" defaultValue={propiedad?.tipo_propiedad ?? "casa"} className={selectCls}>
              <option value="casa">Casa</option>
              <option value="departamento">Departamento</option>
              <option value="terreno">Terreno</option>
              <option value="local">Local comercial</option>
              <option value="oficina">Oficina</option>
              <option value="otro">Otro</option>
            </select>
          </div>

          <div>
            <Label>Operación</Label>
            <select name="tipo_operacion" defaultValue={propiedad?.tipo_operacion ?? "renta"} className={selectCls}>
              <option value="renta">Renta</option>
              <option value="venta">Venta</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Precio</Label>
              <Input name="precio" type="number" min="0" step="any" defaultValue={propiedad?.precio} required />
            </div>
            <div>
              <Label>Moneda</Label>
              <select name="moneda" defaultValue={propiedad?.moneda ?? "MXN"} className={selectCls}>
                <option value="MXN">MXN</option>
                <option value="USD">USD</option>
              </select>
            </div>
          </div>
        </div>

        {/* Ubicación */}
        <div>
          <SectionTitle>Ubicación</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Ciudad</Label>
              <Input name="ciudad" defaultValue={propiedad?.ciudad} required />
            </div>
            <div>
              <Label>Estado</Label>
              <Input name="estado" defaultValue={propiedad?.estado ?? ""} />
            </div>
            <div>
              <Label>Colonia</Label>
              <Input name="colonia" defaultValue={propiedad?.colonia ?? ""} />
            </div>
            <div>
              <Label>Dirección (opcional)</Label>
              <Input name="direccion" defaultValue={propiedad?.direccion ?? ""} />
            </div>
          </div>
        </div>

        {/* Características */}
        <div>
          <SectionTitle>Características</SectionTitle>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <Label>Recámaras</Label>
              <Input name="recamaras" type="number" min="0" defaultValue={propiedad?.recamaras ?? ""} />
            </div>
            <div>
              <Label>Baños</Label>
              <Input name="banos" type="number" min="0" step="any" defaultValue={propiedad?.banos ?? ""} />
            </div>
            <div>
              <Label>Estac.</Label>
              <Input name="estacionamientos" type="number" min="0" defaultValue={propiedad?.estacionamientos ?? ""} />
            </div>
            <div>
              <Label>Área m²</Label>
              <Input name="area_m2" type="number" min="0" step="any" defaultValue={propiedad?.area_m2 ?? ""} />
            </div>
          </div>
        </div>

        {/* Descripción */}
        <div>
          <Label>Descripción</Label>
          <textarea
            name="descripcion"
            defaultValue={propiedad?.descripcion}
            required
            rows={5}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4FA8D5] resize-none"
          />
        </div>

        {/* Publicar */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="publicado"
            name="publicado"
            defaultChecked={propiedad?.publicado ?? true}
            className="w-4 h-4 accent-[#4FA8D5]"
          />
          <label htmlFor="publicado" className="text-sm font-medium text-gray-700">
            Publicar propiedad (visible en el sitio)
          </label>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl">
            <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </div>
        )}

        {/* Submit */}
        <div>
          <button
            type="submit"
            disabled={pending}
            className={`inline-flex items-center gap-2 font-semibold px-6 py-2.5 rounded-full text-sm transition-all duration-200 disabled:opacity-60
              ${guardado
                ? "bg-green-500 text-white"
                : "bg-[#4FA8D5] hover:bg-[#3a95c2] text-white"}`}
          >
            {pending && <SpinnerIcon />}
            {pending ? "Guardando…" : guardado ? "✓ Guardado" : submitLabel}
          </button>
        </div>
      </form>

      {/* Toast */}
      {mostrarToast && (
        <Toast mensaje="Cambios guardados correctamente" tipo="exito" onClose={cerrarToast} />
      )}
    </>
  );
}

/* ── Sub-componentes ── */

const selectCls =
  "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4FA8D5] bg-white";

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[11px] font-bold tracking-widest uppercase text-gray-400 mb-3">{children}</h3>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[12px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">{children}</p>
  );
}

function Input({ ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4FA8D5]"
    />
  );
}

function SpinnerIcon() {
  return (
    <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );
}
