"use client";

import { motion } from "framer-motion";
import { External, Reveal, WebLink, ease, useLanding } from "./shared";

export default function Beneficio() {
  const { config } = useLanding();
  return (
    <section className="relative overflow-hidden bg-surface py-24 md:py-28">
      <div className="mx-auto max-w-[1200px] px-5 md:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_.9fr]">
          <div className="relative">
            <motion.p
              className="text-[110px] sm:text-[160px] lg:text-[200px] font-extrabold leading-[0.85] tracking-[-0.06em]"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease }}
            >
              20<span className="text-brand">%</span>
            </motion.p>
            <motion.p
              className="text-outline text-[64px] sm:text-[96px] lg:text-[120px] font-extrabold leading-[0.9] tracking-[-0.04em] text-white/70"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease, delay: 0.15 }}
            >
              OFF
            </motion.p>
          </div>
          <Reveal>
            <p className="eyebrow">Beneficio por tu caso</p>
            <h2 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight leading-tight">
              Presentá tu caso clínico y te damos un 20% de descuento en Densell White.
            </h2>
            <p className="mt-5 text-[16px] leading-relaxed text-mute">
              Vale para compras de productos Densell White durante los 7 días corridos siguientes a la presentación del caso. Te lo enviamos por WhatsApp junto con la confirmación de que recibimos tu caso.
            </p>
          </Reveal>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease }}
          className="relative mt-16 overflow-hidden rounded-xl border border-brand/40 bg-black p-7 md:mt-20 md:p-10"
        >
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(241,89,34,.35),transparent_70%)]" />
          <div className="relative grid items-center gap-6 md:grid-cols-[auto_1fr_auto] md:gap-10">
            <p className="text-6xl md:text-7xl font-extrabold leading-none tracking-[-0.05em]">
              10<span className="text-brand">%</span>
              <span className="ml-2 text-2xl md:text-3xl tracking-normal text-mute">OFF</span>
            </p>
            <div>
              <p className="eyebrow">Y además</p>
              <p className="mt-2 text-xl md:text-2xl font-bold leading-snug">
                {config.descuentoExtra} mayores a <span className="text-brand">{config.descuentoExtraMinimo}</span>.
              </p>
            </div>
            <WebLink lugar="beneficio-10" className="btn btn-brand whitespace-nowrap">Comprar ahora <External /></WebLink>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
