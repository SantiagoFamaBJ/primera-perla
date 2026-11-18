"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Arrow, WaIcon, track, useLanding, waLink } from "./shared";

export default function Flotantes() {
  const { config, estado } = useLanding();
  const [mostrarCta, setMostrarCta] = useState(false);

  // CTA fijo en mobile: aparece al bajar y se oculta cuando el formulario está en pantalla
  useEffect(() => {
    const form = document.getElementById("formulario");
    let formVisible = false;
    const io = form ? new IntersectionObserver(([e]) => { formVisible = e.isIntersecting; calc(); }, { threshold: 0.05 }) : null;
    if (form && io) io.observe(form);
    const calc = () => setMostrarCta(window.scrollY > 600 && !formVisible);
    window.addEventListener("scroll", calc, { passive: true });
    calc();
    return () => { window.removeEventListener("scroll", calc); io?.disconnect(); };
  }, []);

  return (
    <>
      <a
        href={waLink(config.whatsapp, config.whatsappTexto)}
        target="_blank"
        rel="noopener"
        aria-label="Escribinos por WhatsApp"
        onClick={() => track("Contact")}
        className={`fixed right-4 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_10px_30px_rgba(0,0,0,.45)] transition-[bottom,transform] duration-300 hover:scale-105 md:bottom-6 md:right-6 ${mostrarCta && estado.abierto ? "bottom-[88px]" : "bottom-4"}`}
      >
        <WaIcon className="h-7 w-7" />
      </a>

      <AnimatePresence>
        {mostrarCta && estado.abierto && (
          <motion.div
            initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} transition={{ duration: 0.35 }}
            className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-black/90 px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 backdrop-blur md:hidden"
          >
            <a href="#formulario" className="btn btn-brand w-full">
              Pedí tu jeringa gratis · quedan {estado.restantes} <Arrow />
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
