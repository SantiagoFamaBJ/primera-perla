"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Arrow, CtaForm, WaIcon, track, useLanding, waLink } from "./shared";

export default function Flotantes() {
  const { config, estado } = useLanding();
  const [mostrarCta, setMostrarCta] = useState(false);

  // CTA fijo en mobile: aparece cuando el CTA del hero salió de pantalla y se oculta cuando el formulario está visible.
  useEffect(() => {
    // Se oculta donde ya hay un CTA grande a la vista (formulario y cierre)
    const zonas = [...document.querySelectorAll("#formulario, [data-oculta-cta]")];
    const visibles = new Set<Element>();
    const calc = () => setMostrarCta(window.scrollY > 520 && visibles.size === 0);
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? visibles.add(e.target) : visibles.delete(e.target)));
      calc();
    }, { threshold: 0 });
    zonas.forEach((z) => io.observe(z));
    window.addEventListener("scroll", calc, { passive: true });
    calc();
    return () => { window.removeEventListener("scroll", calc); io.disconnect(); };
  }, []);

  const visible = mostrarCta && estado.abierto;

  return (
    <>
      <a
        href={waLink(config.whatsapp, config.whatsappTexto)}
        target="_blank"
        rel="noopener"
        aria-label="Escribinos por WhatsApp"
        onClick={() => track("Contact", {}, { ga: "contact_whatsapp" })}
        className={`fixed right-4 z-40 grid h-12 w-12 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_8px_24px_rgba(0,0,0,.25)] transition-[bottom] duration-300 md:bottom-6 md:right-6 md:h-14 md:w-14 ${visible ? "bottom-[84px]" : "bottom-4"}`}
      >
        <WaIcon className="h-6 w-6 md:h-7 md:w-7" />
      </a>

      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ y: 90 }} animate={{ y: 0 }} exit={{ y: 90 }} transition={{ duration: 0.25 }}
            className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white/95 px-4 pb-[max(10px,env(safe-area-inset-bottom))] pt-2.5 backdrop-blur md:hidden"
          >
            <CtaForm lugar="sticky-mobile" className="btn btn-brand w-full !min-h-[50px]">
              Pedí tu muestra gratis <Arrow />
            </CtaForm>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
