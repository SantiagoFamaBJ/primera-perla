"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Reveal, useLanding } from "./shared";

export default function Faq() {
  const { config } = useLanding();
  const [abierta, setAbierta] = useState<number | null>(0);
  return (
    <section id="preguntas" className="py-24 md:py-32">
      <div className="mx-auto grid max-w-[1200px] gap-12 px-5 md:px-8 lg:grid-cols-[.8fr_1.2fr]">
        <Reveal>
          <p className="eyebrow">Preguntas frecuentes</p>
          <h2 className="mt-4 text-4xl md:text-6xl font-extrabold tracking-[-0.03em] leading-[1.02]">
            Lo que <span className="text-brand">conviene saber.</span>
          </h2>
        </Reveal>
        <div className="border-t border-line">
          {config.faq.map((f, i) => {
            const on = abierta === i;
            return (
              <div key={i} className="border-b border-line">
                <h3>
                  <button
                    type="button"
                    aria-expanded={on}
                    onClick={() => setAbierta(on ? null : i)}
                    className="flex w-full items-center justify-between gap-6 py-6 text-left text-lg md:text-xl font-bold"
                  >
                    {f.pregunta}
                    <motion.span animate={{ rotate: on ? 45 : 0 }} className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line text-xl font-light text-brand">+</motion.span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {on && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35 }} className="overflow-hidden">
                      <p className="pb-6 pr-12 text-[16px] leading-relaxed text-mute">{f.respuesta}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
