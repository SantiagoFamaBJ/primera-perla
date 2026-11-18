"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Reveal } from "./shared";

// Guía de color ilustrativa, de la tonalidad más clara a la más oscura.
const TONOS = [
  { id: "B1", c: "#F6EEDC" },
  { id: "A1", c: "#EEDCB8" },
  { id: "A2", c: "#E6CDA2" },
  { id: "A3", c: "#DDBE8E" },
  { id: "A3.5", c: "#D4AF7D" },
  { id: "A4", c: "#C9A26B" },
];

const ENVIAR = [
  "Foto inicial y final de la sonrisa con guía de color, misma luz y encuadre.",
  "Ficha breve: concentración, días de tratamiento y tus observaciones.",
  "Confirmación de que tenés el consentimiento de tu paciente.",
];

export default function Resultado() {
  const [idx, setIdx] = useState(0);
  const tono = TONOS[idx];

  return (
    <section className="bg-black py-24 md:py-32" aria-labelledby="resultado-titulo">
      <div className="mx-auto grid max-w-[1200px] items-center gap-14 px-5 md:px-8 lg:grid-cols-2">
        <Reveal>
          <p className="eyebrow">Tu caso clínico</p>
          <h2 id="resultado-titulo" className="mt-4 text-4xl md:text-6xl font-extrabold tracking-[-0.03em] leading-[1.02]">
            El resultado <span className="text-brand">lo documentás vos.</span>
          </h2>
          <ul className="mt-8 grid gap-4">
            {ENVIAR.map((t, i) => (
              <li key={i} className="flex gap-4 text-[16px] leading-relaxed text-soft">
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand text-xs font-extrabold text-white">{i + 1}</span>
                {t}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="relative mx-auto aspect-square w-full max-w-[300px] md:max-w-[400px]">
            <motion.div animate={{ backgroundColor: tono.c }} transition={{ duration: 0.5 }} className="absolute inset-[8%] rounded-full opacity-25 blur-3xl" />
            <motion.div
              animate={{ backgroundColor: tono.c }}
              transition={{ duration: 0.5 }}
              className="absolute inset-[16%] rounded-[46%_46%_42%_42%/55%_55%_45%_45%] shadow-[inset_-30px_-40px_60px_rgba(0,0,0,.25),inset_20px_24px_40px_rgba(255,255,255,.45),0_40px_80px_rgba(0,0,0,.6)]"
            />
            <div className="absolute inset-0 grid place-items-center">
              <AnimatePresence mode="wait">
                <motion.p
                  key={tono.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.25 }}
                  className="text-5xl md:text-7xl font-extrabold tracking-tight text-black/80"
                >
                  {tono.id}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>

          <p className="mt-6 text-center text-[13px] font-semibold text-mute">Tocá una tonalidad</p>
          <div className="mx-auto mt-3 flex max-w-[440px] justify-between gap-2" role="radiogroup" aria-label="Guía de color">
            {TONOS.map((t, i) => {
              const on = i === idx;
              return (
                <button
                  key={t.id}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => setIdx(i)}
                  className="group flex flex-1 flex-col items-center gap-2"
                >
                  <span
                    className={`block h-12 w-full rounded-t-full rounded-b-md transition-all duration-300 md:h-14 ${on ? "-translate-y-2 ring-2 ring-brand ring-offset-2 ring-offset-black" : "group-hover:-translate-y-1"}`}
                    style={{ backgroundColor: t.c }}
                  />
                  <span className={`text-[11px] font-bold ${on ? "text-white" : "text-mute"}`}>{t.id}</span>
                </button>
              );
            })}
          </div>
          <p className="mt-4 text-center text-xs text-mute">Guía ilustrativa. Los resultados dependen de cada paciente y protocolo.</p>
        </Reveal>
      </div>
    </section>
  );
}
