"use client";

import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";

// Guía de color ilustrativa: de un tono más saturado a uno más claro.
const TONOS = [
  { id: "A4", c: "#C9A26B" },
  { id: "A3.5", c: "#D4AF7D" },
  { id: "A3", c: "#DDBE8E" },
  { id: "A2", c: "#E6CDA2" },
  { id: "A1", c: "#EEDCB8" },
  { id: "B1", c: "#F6EEDC" },
];

const ENVIAR = [
  "Foto inicial y final de la sonrisa con guía de color, misma luz y encuadre.",
  "Ficha breve: concentración, días de tratamiento y tus observaciones.",
  "Confirmación de que tenés el consentimiento de tu paciente.",
];

export default function Resultado() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [idx, setIdx] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setIdx(Math.min(TONOS.length - 1, Math.max(0, Math.floor(v * 1.15 * TONOS.length))));
  });
  const color = useTransform(scrollYProgress, TONOS.map((_, i) => i / (TONOS.length - 1) / 1.15), TONOS.map((t) => t.c));
  const barra = useTransform(scrollYProgress, [0, 0.87], ["0%", "100%"]);

  return (
    <section ref={ref} className="relative h-[220vh] bg-black" aria-labelledby="resultado-titulo">
      <div className="sticky top-0 flex min-h-screen items-center overflow-hidden pt-20 pb-6 md:py-20">
        <div className="mx-auto grid w-full max-w-[1200px] items-center gap-6 px-5 md:gap-12 md:px-8 lg:grid-cols-2">
          <div>
            <p className="eyebrow">Tu caso clínico</p>
            <h2 id="resultado-titulo" className="mt-3 text-[32px] md:mt-4 md:text-6xl font-extrabold tracking-[-0.03em] leading-[1.02]">
              El resultado <span className="text-brand">lo documentás vos.</span>
            </h2>
            <ul className="mt-5 grid gap-3 md:mt-8 md:gap-4">
              {ENVIAR.map((t, i) => (
                <li key={i} className="flex gap-4 text-[14px] leading-relaxed text-soft md:text-[16px]">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand text-xs font-extrabold text-white">{i + 1}</span>
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative">
            <div className="relative mx-auto aspect-square w-full max-w-[210px] sm:max-w-[320px] md:max-w-[440px]">
              <motion.div style={{ backgroundColor: color }} className="absolute inset-[10%] rounded-full blur-3xl opacity-25" />
              <motion.div
                style={{ backgroundColor: color }}
                className="absolute inset-[18%] rounded-[46%_46%_42%_42%/55%_55%_45%_45%] shadow-[inset_-30px_-40px_60px_rgba(0,0,0,.25),inset_20px_24px_40px_rgba(255,255,255,.45),0_40px_80px_rgba(0,0,0,.6)]"
              />
              <div className="absolute inset-0 grid place-items-center">
                <div className="text-center">
                  <motion.p key={TONOS[idx].id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-black/80">
                    {TONOS[idx].id}
                  </motion.p>
                </div>
              </div>
            </div>
            <div className="mx-auto mt-4 flex max-w-[440px] md:mt-6 justify-between gap-2">
              {TONOS.map((t, i) => (
                <div key={t.id} className="flex flex-1 flex-col items-center gap-2">
                  <div
                    className={`h-10 md:h-14 w-full rounded-t-full rounded-b-md transition-all duration-300 ${i === idx ? "-translate-y-2 ring-2 ring-brand ring-offset-2 ring-offset-black" : "opacity-80"}`}
                    style={{ backgroundColor: t.c }}
                  />
                  <span className={`text-[11px] font-bold ${i === idx ? "text-white" : "text-mute"}`}>{t.id}</span>
                </div>
              ))}
            </div>
            <div className="mx-auto mt-4 h-1 max-w-[440px] overflow-hidden rounded-full bg-white/10">
              <motion.div style={{ width: barra }} className="h-full bg-brand" />
            </div>
            <p className="mt-3 text-center text-xs text-mute">Animación ilustrativa. Los resultados dependen de cada paciente y protocolo.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
