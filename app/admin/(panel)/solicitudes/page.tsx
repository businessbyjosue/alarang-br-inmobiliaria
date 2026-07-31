import { redirect } from "next/navigation";
import { verifySession } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase-server";
import { SolicitudPropiedad } from "@/lib/types";
import { categoriaLabel } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function SolicitudesPage() {
  const ok = await verifySession();
  if (!ok) redirect("/admin/login");

  // La tabla tiene RLS sin políticas públicas: se lee con service_role.
  const sb = createAdminClient();
  const { data } = await sb
    .from("solicitudes_propiedad")
    .select("*")
    .order("created_at", { ascending: false });

  const solicitudes = (data ?? []) as SolicitudPropiedad[];

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-xl font-extrabold text-[#1B2A45]">Solicitudes recibidas</h1>
        <p className="text-sm text-gray-500">
          {solicitudes.length} del formulario &ldquo;Vende tu propiedad&rdquo;
        </p>
      </div>

      {solicitudes.length === 0 ? (
        <div className="bg-white rounded-sm border border-[#E4E0D6] p-12 text-center text-gray-400 text-sm">
          Aún no hay solicitudes.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {solicitudes.map((s) => (
            <article key={s.id} className="bg-white rounded-sm border border-[#E4E0D6] p-5">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="font-display text-[10px] font-bold uppercase tracking-[0.15em] bg-[#1B2A45] text-white px-2.5 py-1 rounded-sm">
                  {categoriaLabel(s.tipo_operacion)}
                </span>
                <span className="text-[11px] uppercase tracking-wide text-gray-500 capitalize">
                  {s.tipo_propiedad}
                </span>
                <span className="text-[11px] text-gray-400 ml-auto">
                  {new Date(s.created_at).toLocaleDateString("es-MX", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>

              <h2 className="text-[15px] font-semibold text-[#1B2A45]">{s.nombre}</h2>
              <p className="text-[13px] text-gray-500 mb-3">{s.ubicacion}</p>

              <div className="flex flex-wrap gap-x-5 gap-y-1 text-[12px] text-gray-600 mb-3">
                <a
                  href={`https://wa.me/${s.telefono.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[#25D366] hover:underline"
                >
                  {s.telefono}
                </a>
                {s.email && (
                  <a href={`mailto:${s.email}`} className="text-[#B08D57] hover:underline">
                    {s.email}
                  </a>
                )}
                {s.precio_deseado != null && (
                  <span>
                    Precio deseado:{" "}
                    <strong className="text-[#1B2A45]">
                      {new Intl.NumberFormat("es-MX", {
                        style: "currency",
                        currency: s.moneda === "USD" ? "USD" : "MXN",
                        maximumFractionDigits: 0,
                      }).format(s.precio_deseado)}
                    </strong>
                  </span>
                )}
                {s.recamaras != null && <span>{s.recamaras} rec.</span>}
                {s.banos != null && <span>{s.banos} baños</span>}
                {s.area_m2 != null && <span>{s.area_m2} m²</span>}
              </div>

              <p className="text-[13px] text-gray-600 leading-relaxed whitespace-pre-wrap border-t border-[#E4E0D6] pt-3">
                {s.descripcion}
              </p>
              {s.comentarios && (
                <p className="text-[12px] text-gray-500 leading-relaxed whitespace-pre-wrap mt-2">
                  <span className="font-semibold text-[#1B2A45]">Comentarios: </span>
                  {s.comentarios}
                </p>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
