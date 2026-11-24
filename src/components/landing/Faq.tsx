"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Reveal, useLanding } from "./shared";

export default function Faq() {
  const { config } = useLanding();
  const [abierta, setAbierta] = useState<number | null>(0);
  return (
    <section id="preguntas" className="on-light bg-pearl py-24 text-onyx md:py-32">
      <div className="mx-auto max-w-[1200px] px-5 md:px-8">
        <Reveal className="grid max-w-[760px] gap-5">
          <p className="eyebrow">Preguntas frecuentes</p>
          <h2 className="text-[46px] leading-[1.02] md:text-[84px]">
            Lo que <em className="italic text-champagne-ink">conviene saber.</em>
          </h2>
        </Reveal>
        <div className="mt-12 border-t border-line-light md:mt-14">
          {config.faq.map((f, i) => {
            const on = abierta === i;
            return (
              <div key={i} className="border-b border-line-light">
                <h3>
                  <button
                    type="button"
                    aria-expanded={on}
                    aria-controls={`faq-${i}`}
                    onClick={() => setAbierta(on ? null : i)}
                    className="flex min-h-[56px] w-full items-center justify-between gap-6 py-6 text-left font-display text-[23px] font-medium leading-tight md:text-[29px]"
                  >
                    {f.pregunta}
                    <motion.span animate={{ rotate: on ? 45 : 0 }} className="shrink-0 font-sans text-[26px] font-light text-champagne-ink">+</motion.span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {on && (
                    <motion.div id={`faq-${i}`} initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                      <p className="max-w-[46em] pb-6 text-[17px] leading-relaxed text-ink-soft">{f.respuesta}</p>
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
