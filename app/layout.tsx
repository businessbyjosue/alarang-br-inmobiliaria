import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Alarang B.R. | Inmobiliaria",
  description: "Renta y venta de propiedades con atención personalizada. Alarang B.R.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="h-full">
      <body className={`${inter.className} min-h-full flex flex-col bg-white text-[#1a1a2e]`}>
        <Navbar />
        <div className="flex-1 flex flex-col pt-14">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
