"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const WHATSAPP = "https://wa.me/527712026857";
const FACEBOOK = "https://www.facebook.com/share/1B6n82QjaY/?mibextid=wwXIfr";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 bg-white/98 backdrop-blur-md border-b border-gray-100 transition-shadow duration-300 ${scrolled ? "shadow-[0_2px_16px_rgba(0,0,0,0.07)]" : "shadow-none"}`}>
      <div className="max-w-6xl mx-auto px-5 sm:px-8 h-14 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-[14px] font-bold tracking-[0.15em] text-[#1a1a2e] uppercase leading-none">Alarang</span>
          <span className="w-px h-3.5 bg-[#4FA8D5]/40 mx-0.5" />
          <span className="text-[10px] font-semibold tracking-[0.3em] text-[#4FA8D5] uppercase leading-none">B.R.</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/#propiedades"
            className="text-[13px] font-medium tracking-wide text-gray-500 hover:text-[#1a1a2e] transition-colors">
            Propiedades
          </Link>
          <a href={FACEBOOK} target="_blank" rel="noopener noreferrer"
            className="text-[13px] font-medium tracking-wide text-gray-500 hover:text-[#1a1a2e] transition-colors">
            Facebook
          </a>
          <a href={WHATSAPP} target="_blank" rel="noopener noreferrer"
            className="text-[13px] font-medium tracking-wide text-[#1a1a2e] border border-[#1a1a2e]/20 hover:border-[#1a1a2e] px-5 py-2 rounded-full transition-all hover:bg-[#1a1a2e] hover:text-white">
            Contactar
          </a>
        </nav>

        {/* Mobile toggle */}
        <button onClick={() => setOpen(!open)}
          className="md:hidden p-1.5 text-gray-400 hover:text-[#1a1a2e] transition-colors">
          {open ? <XIcon /> : <MenuIcon />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <div className="max-w-6xl mx-auto px-5 py-5 flex flex-col gap-5">
            <Link href="/#propiedades" onClick={() => setOpen(false)}
              className="text-sm font-medium text-gray-600 hover:text-[#1a1a2e]">
              Propiedades
            </Link>
            <a href={FACEBOOK} target="_blank" rel="noopener noreferrer"
              className="text-sm font-medium text-gray-600 hover:text-[#1a1a2e]">
              Facebook
            </a>
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer"
              className="text-sm font-semibold text-center border border-[#1a1a2e] text-[#1a1a2e] px-5 py-3 rounded-full hover:bg-[#1a1a2e] hover:text-white transition-all">
              Contactar por WhatsApp
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5">
      <line x1="3" y1="7" x2="21" y2="7" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="17" x2="21" y2="17" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
