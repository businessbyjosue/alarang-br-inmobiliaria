import type { Metadata } from "next";
import VenderForm from "@/components/VenderForm";
import { LogoMark } from "@/components/Logo";

export const metadata: Metadata = {
  title: "Vende tu propiedad | Alarang B.R.",
  description:
    "Publica tu casa, departamento o terreno con Alarang B.R. Déjanos los datos y te contactamos para promocionarla al mejor precio.",
};

const BENEFICIOS = [
  {
    titulo: "Valuación honesta",
    texto: "Analizamos la zona y el mercado para fijar un precio que sí venda.",
  },
  {
    titulo: "Promoción profesional",
    texto: "Fotos, ficha completa y difusión en el sitio, Facebook y WhatsApp.",
  },
  {
    titulo: "Filtramos por ti",
    texto: "Solo te presentamos compradores o inquilinos serios y calificados.",
  },
];

export default function VendeTuPropiedadPage() {
  return (
    <main className="flex-1 bg-[#F3F1EC]">
      {/* Encabezado */}
      <section className="bg-[#1B2A45]">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 py-16 sm:py-20 text-center">
          <div className="flex justify-center mb-6">
            <LogoMark className="w-10 h-10" light />
          </div>
          <p className="font-display text-[11px] font-bold tracking-[0.28em] text-[#B08D57] uppercase mb-4">
            Vende o renta con nosotros
          </p>
          <h1 className="font-display text-[clamp(1.9rem,5vw,3rem)] font-extrabold text-white leading-tight mb-5">
            Publica tu propiedad
          </h1>
          <p className="text-[15px] text-gray-400 max-w-xl mx-auto leading-relaxed">
            Llena el formulario con los datos de tu casa, departamento o terreno.
            Revisamos la información y te contactamos para acordar los siguientes pasos.
          </p>
        </div>
      </section>

      {/* Beneficios */}
      <section className="max-w-5xl mx-auto px-5 sm:px-8 -mt-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {BENEFICIOS.map((b, i) => (
            <div key={b.titulo} className="bg-white border border-[#E4E0D6] rounded-sm p-5">
              <span className="font-display text-[13px] font-extrabold text-[#B08D57] block mb-2">
                0{i + 1}
              </span>
              <h2 className="font-display text-[15px] font-bold text-[#1B2A45] mb-1.5">{b.titulo}</h2>
              <p className="text-[13px] text-gray-500 leading-relaxed">{b.texto}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Formulario */}
      <section className="max-w-3xl mx-auto px-5 sm:px-8 py-14">
        <VenderForm />
      </section>
    </main>
  );
}
