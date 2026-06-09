import { redirect } from "next/navigation";
import Link from "next/link";
import { verifySession } from "@/lib/auth";
import { crearPropiedad } from "@/app/admin/actions";
import PropiedadForm from "@/components/admin/PropiedadForm";

export default async function NuevaPropiedadPage() {
  const ok = await verifySession();
  if (!ok) redirect("/admin/login");

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin" className="text-[13px] text-gray-400 hover:text-[#1a1a2e] transition-colors">
          ← Volver
        </Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-lg font-bold text-[#1a1a2e]">Nueva propiedad</h1>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <PropiedadForm action={crearPropiedad} submitLabel="Crear propiedad" />
      </div>

      <div className="mt-4 flex items-start gap-2.5 bg-[#4FA8D5]/8 border border-[#4FA8D5]/20 rounded-xl px-4 py-3">
        <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#4FA8D5] shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <p className="text-[12px] text-[#3a95c2] leading-relaxed">
          Después de crear la propiedad podrás subir las imágenes desde la página de edición.
        </p>
      </div>
    </div>
  );
}
