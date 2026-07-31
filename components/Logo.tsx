/* Logotipo "Cima" — concepto 01 de la propuesta de identidad.
   Vértice de dos planos diagonales sobre línea de horizonte en bronce. */

export function LogoMark({ className = "w-6 h-6", light = false }: { className?: string; light?: boolean }) {
  return (
    <svg viewBox="0 0 120 120" className={`${className} shrink-0`} aria-hidden="true">
      <path d="M60 26 L84 78 L72 78 L60 52 L48 78 L36 78 Z" fill={light ? "#FFFFFF" : "#1B2A45"} />
      <rect x="30" y="86" width="60" height="4" fill="#B08D57" />
    </svg>
  );
}

export default function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <LogoMark className="w-5 h-5" light={light} />
      <span className="flex items-baseline gap-1.5">
        <span
          className={`font-display text-[14px] font-extrabold tracking-[0.14em] uppercase leading-none ${
            light ? "text-white" : "text-[#1B2A45]"
          }`}
        >
          Alarang
        </span>
        <span className="font-display text-[11px] font-bold tracking-[0.2em] text-[#B08D57] uppercase leading-none">
          B.R.
        </span>
      </span>
    </span>
  );
}
