"use client";

import { motion } from "framer-motion";
import { External, Reveal, WebLink, ease } from "./shared";

export default function Beneficio() {
  return (
    <section className="relative overflow-hidden bg-surface py-24 md:py-28">
      <div className="mx-auto grid max-w-[1200px] items-center gap-10 px-5 md:px-8 lg:grid-cols-[1.1fr_.9fr]">
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
          <WebLink lugar="beneficio" className="btn btn-ghost mt-8">Ver productos Densell White <External /></WebLink>
        </Reveal>
      </div>
    </section>
  );
}
