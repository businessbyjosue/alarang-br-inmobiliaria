"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/admin");
    } else {
      const data = await res.json();
      setError(data.error || "Error al iniciar sesión");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F6F8]">
      <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-6">
          <span className="text-[14px] font-bold tracking-[0.15em] text-[#1a1a2e] uppercase">Alarang</span>
          <span className="w-px h-3.5 bg-[#4FA8D5]/40" />
          <span className="text-[10px] font-semibold tracking-[0.3em] text-[#4FA8D5] uppercase">B.R.</span>
        </div>
        <p className="text-[13px] text-gray-400 mb-8 tracking-wide">Panel de administración</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4FA8D5]"
            required
            autoFocus
          />
          {error && (
            <p className="text-red-500 text-[13px] flex items-center gap-1.5">
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="bg-[#4FA8D5] hover:bg-[#3a95c2] text-white font-semibold rounded-full py-3 text-sm transition-colors disabled:opacity-60 mt-1"
          >
            {loading ? "Entrando…" : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
