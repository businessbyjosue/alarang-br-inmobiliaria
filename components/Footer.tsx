const WHATSAPP = "https://wa.me/527712026857";
const FACEBOOK = "https://www.facebook.com/share/1B6n82QjaY/?mibextid=wwXIfr";

export default function Footer() {
  return (
    <footer className="bg-[#0e1520] text-white">
      {/* CTA strip */}
      <div className="border-b border-white/8">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-5">
          <div>
            <p className="text-[13px] font-semibold text-white mb-0.5">¿Buscas una propiedad?</p>
            <p className="text-[12px] text-gray-500">Respondemos el mismo día. Sin compromiso.</p>
          </div>
          <a
            href={WHATSAPP}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-[13px] font-semibold bg-[#25D366] hover:bg-[#1ebe5d] text-white px-6 py-2.5 rounded-full transition-colors shrink-0"
          >
            <WhatsAppIcon />
            Contactar ahora
          </a>
        </div>
      </div>

      {/* Cuerpo */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-12 grid grid-cols-1 sm:grid-cols-3 gap-10">

        {/* Brand */}
        <div className="sm:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[14px] font-bold tracking-[0.15em] text-white uppercase">Alarang</span>
            <span className="w-px h-3.5 bg-[#4FA8D5]/40" />
            <span className="text-[10px] font-semibold tracking-[0.3em] text-[#4FA8D5] uppercase">B.R.</span>
          </div>
          <p className="text-[13px] text-gray-500 leading-relaxed max-w-sm">
            Asesoría personalizada en renta y venta de propiedades en México.
            Seriedad, rapidez y total transparencia en cada operación.
          </p>
        </div>

        {/* Links */}
        <div>
          <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-gray-600 mb-4">Contacto</p>
          <div className="flex flex-col gap-3">
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2.5 text-[13px] text-gray-400 hover:text-[#25D366] transition-colors group">
              <WhatsAppIcon className="text-gray-600 group-hover:text-[#25D366]" />
              WhatsApp
            </a>
            <a href={FACEBOOK} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2.5 text-[13px] text-gray-400 hover:text-[#4FA8D5] transition-colors group">
              <FacebookIcon className="text-gray-600 group-hover:text-[#4FA8D5]" />
              Facebook
            </a>
            <a href="/#propiedades"
              className="flex items-center gap-2.5 text-[13px] text-gray-400 hover:text-white transition-colors">
              <GridIcon />
              Ver propiedades
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/6">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[11px] text-gray-700">
            © {new Date().getFullYear()} Alarang B.R. Todos los derechos reservados.
          </p>
          <p className="text-[11px] text-gray-700">
            Inmobiliaria · México
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ── Iconos ── */

function WhatsAppIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`w-3.5 h-3.5 fill-current shrink-0 ${className}`}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

function FacebookIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`w-3.5 h-3.5 fill-current shrink-0 ${className}`}>
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.887v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
    </svg>
  );
}

function GridIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 shrink-0 text-gray-600" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
    </svg>
  );
}
