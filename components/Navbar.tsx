"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Logo from "./Logo";

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
        <Link href="/" className="group">
          <Logo />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-7">
          <Link href="/#propiedades"
            className="text-[13px] font-medium tracking-wide text-gray-500 hover:text-[#1B2A45] transition-colors">
            Propiedades
          </Link>
          <Link href="/vende-tu-propiedad"
            className="text-[13px] font-medium tracking-wide text-gray-500 hover:text-[#1B2A45] transition-colors">
            Vende tu propiedad
          </Link>
          <a href={FACEBOOK} target="_blank" rel="noopener noreferrer"
            className="text-[13px] font-medium tracking-wide text-gray-500 hover:text-[#1B2A45] transition-colors">
            Facebook
          </a>
          <a href={WHATSAPP} target="_blank" rel="noopener noreferrer"
            className="text-[13px] font-semibold tracking-wide text-white bg-[#1B2A45] hover:bg-[#B08D57] px-5 py-2 rounded-sm transition-colors">
            Contactar
          </a>
        </nav>

        {/* Mobile toggle */}
        <button onClick={() => setOpen(!open)}
          className="md:hidden p-1.5 text-gray-400 hover:text-[#1B2A45] transition-colors">
          {open ? <XIcon /> : <MenuIcon />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <div className="max-w-6xl mx-auto px-5 py-5 flex flex-col gap-5">
            <Link href="/#propiedades" onClick={() => setOpen(false)}
              className="text-sm font-medium text-gray-600 hover:text-[#1B2A45]">
              Propiedades
            </Link>
            <Link href="/vende-tu-propiedad" onClick={() => setOpen(false)}
              className="text-sm font-medium text-gray-600 hover:text-[#1B2A45]">
              Vende tu propiedad
            </Link>
            <a href={FACEBOOK} target="_blank" rel="noopener noreferrer"
              className="text-sm font-medium text-gray-600 hover:text-[#1B2A45]">
              Facebook
            </a>
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer"
              className="text-sm font-semibold text-center bg-[#1B2A45] text-white px-5 py-3 rounded-sm hover:bg-[#B08D57] transition-colors">
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
