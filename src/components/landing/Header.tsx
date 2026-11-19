"use client";

import { useEffect, useState } from "react";
import { CtaForm, External, WebLink, useLanding } from "./shared";

export default function Header() {
  const { estado } = useLanding();
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const f = () => setSolid(window.scrollY > 20);
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);

  return (
    <header className={`fixed inset-x-0 top-0 z-40 border-b bg-white/95 backdrop-blur transition-colors duration-300 ${solid ? "border-line" : "border-transparent"}`}>
      <div className="mx-auto flex h-16 md:h-[72px] max-w-[1200px] items-center justify-between gap-6 px-5 md:px-8">
        <a href="#inicio" aria-label="Dental Medrano, volver al inicio" className="shrink-0">
          <img src="/img/dm-color.webp" alt="Dental Medrano" width={640} height={171} className="h-8 md:h-10 w-auto" />
        </a>
        <nav className="flex items-center gap-7" aria-label="Secciones">
          <a href="#como-funciona" className="hidden lg:block text-sm font-semibold text-soft hover:text-brand">Cómo funciona</a>
          <a href="#concentraciones" className="hidden lg:block text-sm font-semibold text-soft hover:text-brand">Concentraciones</a>
          <a href="#preguntas" className="hidden lg:block text-sm font-semibold text-soft hover:text-brand">Preguntas</a>
          <WebLink lugar="header" className="hidden md:inline-flex items-center gap-1.5 text-sm font-semibold text-soft hover:text-brand">
            dentalmedrano.com <External className="w-3.5 h-3.5" />
          </WebLink>
          {estado.abierto && (
            <CtaForm lugar="header" className="btn btn-brand hidden sm:inline-flex !min-h-[42px] !px-5 !text-sm">Pedí tu muestra gratis</CtaForm>
          )}
        </nav>
      </div>
    </header>
  );
}
