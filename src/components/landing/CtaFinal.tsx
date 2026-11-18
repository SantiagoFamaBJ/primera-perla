"use client";

import { motion } from "framer-motion";
import { Arrow, External, WebLink, ease, useLanding } from "./shared";

export default function CtaFinal() {
  const { estado } = useLanding();
  return (
    <section className="relative overflow-hidden bg-brand py-20 md:py-28">
      <motion.img
        src="/img/jeringa.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 top-1/2 hidden w-[520px] -translate-y-1/2 opacity-90 md:block"
        initial={{ rotate: -40, x: 120, opacity: 0 }}
        whileInView={{ rotate: -12, x: 0, opacity: 0.9 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease }}
      />
      <div className="relative mx-auto max-w-[1200px] px-5 md:px-8">
        <div className="max-w-[640px]">
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-[-0.03em] leading-[1.02]">
            {estado.abierto ? (
              <>Quedan {estado.restantes} jeringas.<br />La próxima puede ser tuya.</>
            ) : (
              <>Conocé toda la línea Densell White.</>
            )}
          </h2>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            {estado.abierto && <a href="#formulario" className="btn btn-dark">Pedí tu jeringa gratis <Arrow /></a>}
            <WebLink lugar="cta-final" className="btn border border-white/70 text-white hover:bg-white hover:text-brand">Ir a la web <External /></WebLink>
          </div>
        </div>
      </div>
    </section>
  );
}
