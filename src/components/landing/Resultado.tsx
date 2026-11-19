"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Reveal } from "./shared";

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
  "Foto inicial y final con guía de color, con iluminación y encuadre comparables.",
  "Datos breves: concentración usada, duración y tus observaciones.",
  "Confirmación de que tenés el consentimiento del paciente para documentar el caso.",
];

export default function Resultado() {
  const [idx, setIdx] = useState(0);
  const tono = TONOS[idx];

  return (
    <section className="py-20 md:py-28" aria-labelledby="resultado-titulo">
      <div className="mx-auto grid max-w-[1200px] items-center gap-12 px-5 md:px-8 lg:grid-cols-[1.05fr_.95fr]">
        <Reveal>
          <p className="eyebrow">Tu caso clínico</p>
          <h2 id="resultado-titulo" className="mt-4 text-4xl md:text-6xl font-extrabold tracking-[-0.03em] leading-[1.02]">
            Simple de <span className="text-brand">documentar.</span>
          </h2>
          <p className="mt-5 text-[16px] leading-relaxed text-soft">Dentro de los 60 días de recibida la muestra, nos enviás:</p>
          <ul className="mt-5 grid gap-3.5">
            {ENVIAR.map((t, i) => (
              <li key={i} className="flex gap-4 text-[16px] leading-relaxed text-ink">
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand text-xs font-extrabold text-white">{i + 1}</span>
                {t}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[14px] leading-relaxed text-soft">El caso se envía en forma privada. Alcanza con fotos de la sonrisa: no hace falta el nombre ni otros datos que identifiquen al paciente.</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-line bg-surface p-4">
              <p className="text-[13px] font-extrabold uppercase tracking-[0.14em] text-ink">Requisito</p>
              <p className="mt-1.5 text-[14px] leading-relaxed text-soft">Presentar el caso para cumplir con el programa y acceder al 20% OFF.</p>
            </div>
            <div className="rounded-lg border border-line bg-white p-4">
              <p className="text-[13px] font-extrabold uppercase tracking-[0.14em] text-ink">Opcional</p>
              <p className="mt-1.5 text-[14px] leading-relaxed text-soft">Autorizar que Dental Medrano lo publique. Solo con tu permiso y el de tu paciente, cuidando su privacidad.</p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="rounded-2xl bg-ink px-5 py-8 sm:px-8">
            <div className="relative mx-auto aspect-square w-full max-w-[260px] md:max-w-[320px]">
              <motion.div animate={{ backgroundColor: tono.c }} transition={{ duration: 0.4 }} className="absolute inset-[8%] rounded-full opacity-25 blur-3xl" />
              <motion.div
                animate={{ backgroundColor: tono.c }}
                transition={{ duration: 0.4 }}
                className="absolute inset-[16%] rounded-[46%_46%_42%_42%/55%_55%_45%_45%] shadow-[inset_-30px_-40px_60px_rgba(0,0,0,.22),inset_20px_24px_40px_rgba(255,255,255,.45),0_30px_60px_rgba(0,0,0,.5)]"
              />
              <div className="absolute inset-0 grid place-items-center">
                <AnimatePresence mode="wait">
                  <motion.p key={tono.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="text-5xl md:text-6xl font-extrabold tracking-tight text-black/80">
                    {tono.id}
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>
            <p className="mt-4 text-center text-[13px] font-semibold text-white/70">Tocá una tonalidad</p>
            <div className="mx-auto mt-3 flex max-w-[420px] justify-between gap-2" role="radiogroup" aria-label="Guía de color">
              {TONOS.map((t, i) => {
                const on = i === idx;
                return (
                  <button key={t.id} type="button" role="radio" aria-checked={on} onClick={() => setIdx(i)} className="group flex min-h-[44px] flex-1 flex-col items-center gap-2">
                    <span
                      className={`block h-11 w-full rounded-t-full rounded-b-md transition-transform duration-200 md:h-12 ${on ? "-translate-y-1.5 ring-2 ring-brand ring-offset-2 ring-offset-ink" : "group-hover:-translate-y-1"}`}
                      style={{ backgroundColor: t.c }}
                    />
                    <span className={`text-[11px] font-bold ${on ? "text-white" : "text-white/60"}`}>{t.id}</span>
                  </button>
                );
              })}
            </div>
            <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-xs text-white/60">
              <Check className="h-3 w-3" /> Guía ilustrativa. Los resultados dependen de cada paciente y protocolo.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
