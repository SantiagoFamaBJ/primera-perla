"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Reveal, ease } from "./shared";

const PASOS = [
  { n: "01", t: "Completá el formulario", d: "Dos pasos rápidos. Elegís la concentración que querés probar." },
  { n: "02", t: "Recibí tu jeringa", d: "Validamos tu matrícula y te la enviamos sin cargo, con la guía para las fotos." },
  { n: "03", t: "Tratá a tu paciente", d: "Con tu protocolo. Documentás el antes y el después con guía de color." },
  { n: "04", t: "Compartí tu caso", d: "Dentro de los 60 días de recibida la muestra, y accedés al 20% OFF." },
];

export default function Pasos() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 55%"] });
  const scale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="como-funciona" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-[1200px] px-5 md:px-8">
        <Reveal className="max-w-[720px]">
          <p className="eyebrow">Cómo funciona</p>
          <h2 className="mt-4 text-4xl md:text-6xl font-extrabold tracking-[-0.03em] leading-[1.02]">
            Cuatro pasos. <span className="text-mute">Un caso real.</span>
          </h2>
          <p className="mt-5 text-lg text-soft">Sin compra. Solo te pedimos que nos muestres tu resultado.</p>
        </Reveal>

        <div ref={ref} className="relative mt-16 md:mt-20">
          {/* Línea que se completa con el scroll */}
          <div className="absolute left-[11px] top-0 bottom-0 w-px bg-line md:left-0 md:right-0 md:top-[11px] md:bottom-auto md:h-px md:w-auto" />
          <motion.div
            style={{ scaleY: scale }}
            className="absolute left-[11px] top-0 bottom-0 w-px origin-top bg-brand md:hidden"
          />
          <motion.div
            style={{ scaleX: scale }}
            className="absolute left-0 right-0 top-[11px] hidden h-px origin-left bg-brand md:block"
          />
          <ol className="grid gap-12 md:grid-cols-4 md:gap-8">
            {PASOS.map((p, i) => (
              <motion.li
                key={p.n}
                className="relative pl-12 md:pl-0 md:pt-14"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, ease, delay: i * 0.12 }}
              >
                <span className={`absolute left-0 top-0 grid h-[23px] w-[23px] place-items-center rounded-full border-2 ${i === 3 ? "border-brand bg-brand" : "border-brand bg-black"}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${i === 3 ? "bg-white" : "bg-brand"}`} />
                </span>
                <p className="text-sm font-extrabold tracking-[0.2em] text-brand">{p.n}</p>
                <h3 className="mt-2 text-2xl font-bold tracking-tight">{p.t}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-mute">{p.d}</p>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
