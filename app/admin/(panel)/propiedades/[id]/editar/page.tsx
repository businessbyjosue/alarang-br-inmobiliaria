import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { verifySession } from "@/lib/auth";
import { createServerClient } from "@/lib/supabase-server";
import { actualizarPropiedad } from "@/app/admin/actions";
import PropiedadForm from "@/components/admin/PropiedadForm";
import ImagenesManager from "@/components/admin/ImagenesManager";
import { Propiedad, PropiedadImagen } from "@/lib/types";

export default async function EditarPropiedadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const ok = await verifySession();
  if (!ok) redirect("/admin/login");

  const { id } = await params;
  const sb = createServerClient();

  const [{ data: prop }, { data: imgs }] = await Promise.all([
    sb.from("propiedades").select("*").eq("id", id).single(),
    sb.from("propiedad_imagenes").select("*").eq("propiedad_id", id).order("orden"),
  ]);

  if (!prop) notFound();

  const propiedad = prop as Propiedad;
  const imagenes = (imgs ?? []) as PropiedadImagen[];

  const action = actualizarPropiedad.bind(null, id);

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin" className="text-[13px] text-gray-400 hover:text-[#1a1a2e] transition-colors">
          ← Volver
        </Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-lg font-bold text-[#1a1a2e] truncate">{propiedad.titulo}</h1>
      </div>

      {/* Datos */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-5">
        <h2 className="text-[11px] font-bold tracking-widest uppercase text-gray-400 mb-5">Datos</h2>
        <PropiedadForm
          propiedad={propiedad}
          action={action}
          submitLabel="Guardar cambios"
        />
      </div>

      {/* Imágenes */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-[11px] font-bold tracking-widest uppercase text-gray-400 mb-5">Imágenes</h2>
        <ImagenesManager propiedadId={id} imagenes={imagenes} />
      </div>
    </div>
  );
}
