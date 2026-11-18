"use client";

import { motion } from "framer-motion";
import { Arrow, External, Reveal, WebLink, ease, useLanding } from "./shared";

export default function Linea() {
  const { config } = useLanding();
  if (!config.productos.length) return null;
  return (
    <section className="bg-paper py-24 text-black md:py-32">
      <div className="mx-auto max-w-[1200px] px-5 md:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <Reveal className="max-w-[640px]">
            <p className="eyebrow">La línea completa</p>
            <h2 className="mt-4 text-4xl md:text-6xl font-extrabold tracking-[-0.03em] leading-[1.02]">
              Una solución para <span className="text-brand">cada protocolo.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <WebLink lugar="linea-header" className="btn btn-dark">Ver toda la línea <External /></WebLink>
          </Reveal>
        </div>

        <div className="-mx-5 mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0">
          {config.productos.map((p, i) => (
            <motion.div
              key={p.nombre + i}
              className="w-[78%] shrink-0 snap-start sm:w-[46%] md:w-auto"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.8, ease, delay: (i % 3) * 0.1 }}
            >
              <WebLink lugar="linea-producto" href={p.link} className="group flex h-full flex-col overflow-hidden rounded-lg border border-black/10 bg-white transition-shadow hover:shadow-[0_30px_60px_-30px_rgba(0,0,0,.35)]">
                <div className="aspect-[4/3] overflow-hidden bg-white">
                  {p.imagen && <img src={p.imagen} alt={p.nombre} className="h-full w-full object-contain transition-transform duration-700 group-hover:scale-105" loading="lazy" />}
                </div>
                <div className="flex flex-1 flex-col border-t border-black/5 p-5">
                  <p className="text-[17px] font-bold leading-snug">{p.nombre}</p>
                  {p.detalle && <p className="mt-1 text-sm text-black/55">{p.detalle}</p>}
                  <span className="mt-auto flex items-center gap-2 pt-5 text-sm font-bold text-brand">
                    Adquirir <Arrow className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </WebLink>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
