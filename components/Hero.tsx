const WHATSAPP = "https://wa.me/527712026857";

export default function Hero() {
  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0 bg-[#0e1520]" />
      <div className="absolute inset-0 bg-gradient-to-br from-[#0e1520] via-[#111d30] to-[#0a1a28]" />

      {/* Glow suave */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#4FA8D5]/8 rounded-full blur-[120px] pointer-events-none" />

      {/* Textura puntillada muy sutil */}
      <div className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-8 text-center">

        {/* Etiqueta editorial */}
        <p className="text-[#4FA8D5] text-[11px] font-semibold tracking-[0.3em] uppercase mb-10">
          Alarang B.R. · Inmobiliaria
        </p>

        {/* Headline editorial */}
        <h1 className="text-[clamp(2.4rem,6vw,4.2rem)] font-light text-white leading-[1.1] tracking-tight mb-6">
          Propiedades selectas en<br />
          <em className="not-italic font-semibold text-white">renta y venta</em>{" "}
          <span className="text-[#4FA8D5]">en México</span>
        </h1>

        <p className="text-gray-400 text-[15px] sm:text-base max-w-xl mx-auto mb-12 leading-relaxed font-light">
          Asesoría personalizada para encontrar o vender tu propiedad con confianza,
          rapidez y total transparencia.
        </p>

        {/* CTAs refinados */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a href="#propiedades"
            className="bg-[#4FA8D5] hover:bg-[#3a95c2] text-white font-medium px-7 py-2.5 rounded-full text-[13px] tracking-wide transition-all">
            Ver propiedades disponibles
          </a>
          <a href={WHATSAPP} target="_blank" rel="noopener noreferrer"
            className="text-white/60 hover:text-white text-[13px] font-medium px-7 py-2.5 rounded-full border border-white/15 hover:border-white/30 transition-all tracking-wide">
            Hablar con un asesor
          </a>
        </div>

        {/* Divisor */}
        <div className="mt-20 pt-8 border-t border-white/8 grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-0 sm:divide-x sm:divide-white/8">
          {[
            { value: "+5 años", label: "de experiencia en el mercado" },
            { value: "Renta · Venta", label: "en zonas residenciales" },
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
