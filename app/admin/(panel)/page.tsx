import { redirect } from "next/navigation";
import Link from "next/link";
import { verifySession } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase-server";
import { Propiedad } from "@/lib/types";
import { formatPrecio, categoriaLabel } from "@/lib/utils";
import TogglePublicado from "@/components/admin/TogglePublicado";
import EliminarPropiedad from "@/components/admin/EliminarPropiedad";

export default async function AdminPage() {
  const ok = await verifySession();
  if (!ok) redirect("/admin/login");

  // Cliente admin: el panel debe ver también las propiedades sin publicar, que
  // RLS oculta al cliente anon (solo expone `publicado = true`). La sesión ya
  // se verificó arriba.
  const sb = createAdminClient();
  const { data: propiedades } = await sb
    .from("propiedades")
    .select("*")
    .order("created_at", { ascending: false });

  const lista = (propiedades ?? []) as Propiedad[];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-[#1B2A45]">Propiedades</h1>
          <p className="text-sm text-gray-400">{lista.length} en total</p>
        </div>
        <Link href="/admin/propiedades/nueva"
          className="bg-[#B08D57] hover:bg-[#96784A] text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors">
          + Nueva
        </Link>
      </div>

      {lista.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center text-gray-400 text-sm">
          No hay propiedades. <Link href="/admin/propiedades/nueva" className="text-[#B08D57] underline">Crea la primera.</Link>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {lista.map((p) => (
            <div key={p.id}
              className="bg-white rounded-xl px-5 py-4 flex items-center gap-4 shadow-sm border border-gray-100">

              {/* Indicador publicado */}
              <span className={`w-2 h-2 rounded-full shrink-0 ${p.publicado ? "bg-green-400" : "bg-gray-300"}`} />

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-[#1B2A45] truncate">{p.titulo}</p>
                <p className="text-[12px] text-gray-400">
                  {[p.colonia, p.ciudad].filter(Boolean).join(", ")} · {categoriaLabel(p.tipo_operacion)} · {formatPrecio(p.precio, p.tipo_operacion, p.moneda)}
                </p>
              </div>

              {/* Acciones */}
              <div className="flex items-center gap-3 shrink-0">
                <TogglePublicado id={p.id} publicado={p.publicado} />
                <Link href={`/admin/propiedades/${p.id}/editar`}
                  className="text-[12px] font-medium text-[#B08D57] hover:underline">
                  Editar
                </Link>
                <EliminarPropiedad id={p.id} titulo={p.titulo} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
