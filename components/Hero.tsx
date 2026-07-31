import Link from "next/link";
import { LogoMark } from "./Logo";

const WHATSAPP = "https://wa.me/527712026857";

export default function Hero() {
  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0 bg-[#141E33]" />
      <div className="absolute inset-0 bg-gradient-to-br from-[#141E33] via-[#1B2A45] to-[#101928]" />

      {/* Glow suave */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#B08D57]/8 rounded-full blur-[120px] pointer-events-none" />

      {/* Textura puntillada muy sutil */}
      <div className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-8 text-center">

        {/* Marca */}
        <div className="flex justify-center mb-8">
          <LogoMark className="w-11 h-11" light />
        </div>

        {/* Etiqueta editorial */}
        <p className="text-[#B08D57] text-[11px] font-bold tracking-[0.3em] uppercase mb-7 font-display">
          Alarang B.R. · Inmobiliaria
        </p>

        {/* Headline editorial */}
        <h1 className="font-display text-[clamp(2.3rem,6vw,4rem)] font-light text-white leading-[1.12] tracking-tight mb-6">
          Propiedades selectas en<br />
          <em className="not-italic font-extrabold text-white">renta, venta</em>{" "}
          <span className="text-[#B08D57]">y terrenos</span>
        </h1>

        <p className="text-gray-400 text-[15px] sm:text-base max-w-xl mx-auto mb-11 leading-relaxed font-light">
          Asesoría personalizada para encontrar o vender tu propiedad con confianza,
          rapidez y total transparencia.
        </p>

        {/* CTAs refinados */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a href="#propiedades"
            className="bg-[#B08D57] hover:bg-[#96784A] text-white font-semibold px-7 py-3 rounded-sm text-[13px] tracking-wide transition-colors">
            Ver propiedades disponibles
          </a>
          <Link href="/vende-tu-propiedad"
            className="text-white font-semibold text-[13px] px-7 py-3 rounded-sm border border-white/25 hover:bg-white hover:text-[#1B2A45] transition-colors tracking-wide">
            Vende tu propiedad
          </Link>
          <a href={WHATSAPP} target="_blank" rel="noopener noreferrer"
            className="text-white/55 hover:text-white text-[13px] font-medium px-4 py-3 transition-colors tracking-wide">
            Hablar con un asesor
          </a>
        </div>

        {/* Divisor */}
        <div className="mt-20 pt-8 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-0 sm:divide-x sm:divide-white/10">
          {[
            { value: "+5 años", label: "de experiencia en el mercado" },
            { value: "Renta · Venta · Terrenos", label: "en zonas residenciales" },
            { value: "Respuesta", label: "el mismo día por WhatsApp" },
          ].map(({ value, label }) => (
            <div key={value} className="sm:px-10 text-center">
              <div className="text-[17px] font-semibold text-white mb-1">{value}</div>
              <div className="text-gray-500 text-[12px] tracking-wide">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Fade inferior */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent pointer-events-none" />
    </section>
  );
}
