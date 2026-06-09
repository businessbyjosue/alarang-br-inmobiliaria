"use client";

import { useEffect, useState } from "react";

interface ToastProps {
  mensaje: string;
  tipo?: "exito" | "error";
  onClose: () => void;
}

export default function Toast({ mensaje, tipo = "exito", onClose }: ToastProps) {
  const [visible, setVisible] = useState(false);

  // Entrada animada y auto-cierre a los 3s
  useEffect(() => {
    const show = setTimeout(() => setVisible(true), 10);
    const hide = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300); // espera a que salga antes de desmontar
    }, 3000);
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
  }, [onClose]);

  const esExito = tipo === "exito";

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-sm font-medium transition-all duration-300
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}
        ${esExito ? "bg-[#1a1a2e] text-white" : "bg-red-600 text-white"}`}
    >
      {esExito ? <CheckIcon /> : <XCircleIcon />}
      {mensaje}
    </div>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0 text-[#4FA8D5]" fill="none" stroke="currentColor" strokeWidth="2.5">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function XCircleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  );
}
