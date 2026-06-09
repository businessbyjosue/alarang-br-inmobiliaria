"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminNav() {
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "logout" }),
    });
    router.push("/admin/login");
  }

  return (
    <header className="h-12 bg-[#1a1a2e] flex items-center justify-between px-5 sm:px-8 shrink-0">
      <div className="flex items-center gap-6">
        <Link href="/admin" className="flex items-baseline gap-2">
          <span className="text-[13px] font-bold tracking-widest text-white uppercase">Alarang</span>
          <span className="text-[9px] font-medium tracking-[0.2em] text-[#4FA8D5] uppercase">Admin</span>
        </Link>
        <Link href="/admin/propiedades/nueva"
          className="text-[12px] font-medium text-white/60 hover:text-white transition-colors">
          + Nueva propiedad
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <Link href="/" target="_blank"
          className="text-[12px] text-white/40 hover:text-white/70 transition-colors">
          Ver sitio
        </Link>
        <button onClick={logout}
          className="text-[12px] text-white/40 hover:text-white/70 transition-colors">
          Cerrar sesión
        </button>
      </div>
    </header>
  );
}
