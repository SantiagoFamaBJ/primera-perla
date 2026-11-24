"use client";

import { useEffect, useState } from "react";
import { CtaForm, External, WebLink, useLanding } from "./shared";

export default function Header() {
  const { estado } = useLanding();
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const f = () => setSolid(window.scrollY > 40);
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);

  const link = "hidden lg:block text-[12px] font-medium uppercase tracking-[0.2em] text-mist transition-colors hover:text-pearl";

  return (
    <header className={`fixed inset-x-0 top-0 z-40 border-b transition-colors duration-500 ${solid ? "border-line-dark bg-onyx/85 backdrop-blur-md" : "border-transparent bg-onyx/40 backdrop-blur-sm"}`}>
      <div className="mx-auto grid h-16 max-w-[1200px] grid-cols-[1fr_auto_1fr] items-center gap-4 px-5 md:h-[76px] md:px-8">
        <nav className="flex items-center gap-7" aria-label="Secciones">
          <a href="#como-funciona" className={link}>Cómo funciona</a>
          <a href="#concentraciones" className={link}>Concentraciones</a>
          <a href="#preguntas" className={link}>Preguntas</a>
        </nav>
        <a href="#inicio" aria-label="Dental Medrano, volver al inicio" className="justify-self-center">
          <img src="/img/dm-blanco.webp" alt="Dental Medrano" width={640} height={171} className="h-9 w-auto md:h-10" />
        </a>
        <div className="flex items-center justify-end gap-6">
          <WebLink lugar="header" className="hidden md:inline-flex items-center gap-1.5 text-[12px] font-medium uppercase tracking-[0.2em] text-mist hover:text-pearl">
            dentalmedrano.com <External className="h-3.5 w-3.5" />
          </WebLink>
          {estado.abierto && (
            <CtaForm lugar="header" className="btn btn-brand hidden sm:inline-flex !min-h-[42px] !px-5 !text-[12px]">Pedí tu muestra</CtaForm>
          )}
        </div>
      </div>
    </header>
  );
}
