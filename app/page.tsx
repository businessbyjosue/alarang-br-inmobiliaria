import Hero from "@/components/Hero";
import PropiedadCard from "@/components/PropiedadCard";
import { createServerClient } from "@/lib/supabase-server";
import { Propiedad } from "@/lib/types";

const WHATSAPP = "https://wa.me/527712026857";

function EmptyState() {
  return (
    <div className="py-24 flex flex-col items-center gap-5 text-center">
      {/* Ícono ilustrativo */}
      <div className="w-16 h-16 rounded-2xl bg-[#4FA8D5]/8 flex items-center justify-center">
        <svg viewBox="0 0 24 24" className="w-8 h-8 text-[#4FA8D5]/50" fill="none" stroke="currentColor" strokeWidth="1.3">
          <path d="M3 12L12 3l9 9" />
          <path d="M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9" />
        </svg>
      </div>
      <div>
        <p className="text-[15px] font-semibold text-[#1a1a2e] mb-1">Pronto habrá propiedades disponibles</p>
        <p className="text-[13px] text-gray-400 max-w-xs">
          Estamos preparando el inventario. Mientras tanto, contáctanos directamente.
        </p>
      </div>
      <a
        href={WHATSAPP}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-[13px] font-semibold text-[#25D366] border border-[#25D366]/30 hover:bg-[#25D366] hover:text-white px-5 py-2.5 rounded-full transition-all duration-200"
      >
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        Consultar por WhatsApp
      </a>
    </div>
  );
}

export const revalidate = 60;

export default async function HomePage() {
  const sb = createServerClient();
  const { data } = await sb
    .from("propiedades")
    .select("*, propiedad_imagenes(*)")
    .eq("publicado", true)
    .order("created_at", { ascending: false });

  const propiedades = (data ?? []) as Propiedad[];

  return (
    <main className="flex-1">
      <Hero />

      <section id="propiedades" className="max-w-6xl mx-auto px-5 sm:px-8 py-20">
        <div className="mb-10">
          <p className="text-[11px] font-semibold tracking-[0.25em] text-[#4FA8D5] uppercase mb-2">
            Disponibles ahora
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1a1a2e]">Propiedades</h2>
        </div>

        {propiedades.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {propiedades.map((p) => (
              <PropiedadCard key={p.id} p={p} />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </section>
    </main>
  );
}
