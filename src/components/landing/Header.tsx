"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { External, WebLink, useLanding } from "./shared";

export default function Header() {
  const { config, estado } = useLanding();
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const f = () => setSolid(window.scrollY > 30);
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);

  return (
    <motion.header
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.7, ease: [0.2, 0.7, 0.1, 1] }}
      className={`fixed inset-x-0 top-0 z-40 border-b transition-colors duration-300 ${solid ? "bg-black/85 backdrop-blur-md border-line" : "border-transparent"}`}
    >
      <div className="mx-auto flex h-16 md:h-20 max-w-[1200px] items-center justify-between gap-6 px-5 md:px-8">
        <a href="#inicio" aria-label="Dental Medrano, volver al inicio" className="shrink-0">
          <img src="/img/dm-blanco.png" alt="Dental Medrano" className="h-8 md:h-10 w-auto" />
        </a>
        <nav className="flex items-center gap-7" aria-label="Secciones">
          <a href="#como-funciona" className="hidden lg:block text-sm font-semibold text-soft hover:text-white transition-colors">Cómo funciona</a>
          <a href="#concentraciones" className="hidden lg:block text-sm font-semibold text-soft hover:text-white transition-colors">Concentraciones</a>
          <a href="#preguntas" className="hidden lg:block text-sm font-semibold text-soft hover:text-white transition-colors">Preguntas</a>
          <WebLink lugar="header" className="hidden md:inline-flex items-center gap-2 text-sm font-semibold text-soft hover:text-white transition-colors">
            {config.webLabel} <External className="w-3.5 h-3.5" />
          </WebLink>
          {estado.abierto && (
            <a href="#formulario" className="btn btn-brand !min-h-[42px] !px-5 !text-sm">Pedí tu jeringa</a>
          )}
        </nav>
      </div>
    </motion.header>
  );
}
