"use client";

import { motion } from "framer-motion";
import { Reveal, ease } from "./shared";

const PASOS = [
  { n: "01", t: "Elegí tu muestra", d: "Seleccioná la concentración y completá tus datos." },
  { n: "02", t: "Recibila sin cargo", d: "Validamos tu matrícula y te enviamos la jeringa." },
  { n: "03", t: "Probala en tu consultorio", d: "Usala según tu criterio profesional y documentá el resultado." },
  { n: "04", t: "Compartí tu caso", d: "Enviá la documentación dentro de los 60 días de recibida la muestra y obtené un 20% OFF." },
];

export default function Pasos() {
  return (
    <section id="como-funciona" className="py-20 md:py-28">
      <div className="mx-auto max-w-[1200px] px-5 md:px-8">
        <Reveal className="max-w-[720px]">
          <p className="eyebrow">Cómo funciona</p>
          <h2 className="mt-4 text-4xl md:text-6xl font-extrabold tracking-[-0.03em] leading-[1.02]">
            Cuatro pasos.<br /><span className="text-mute">Un caso real.</span>
          </h2>
        </Reveal>

        <ol className="relative mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 md:mt-16">
          {PASOS.map((p, i) => (
            <motion.li
              key={p.n}
              className={`relative rounded-lg border p-6 ${i === 3 ? "border-brand bg-brand-50" : "border-line bg-white"}`}
              initial={{ y: 16 }}
              whileInView={{ y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.55, ease, delay: i * 0.08 }}
            >
              <p className="text-sm font-extrabold tracking-[0.2em] text-brand">{p.n}</p>
              <h3 className="mt-3 text-xl font-bold tracking-tight">{p.t}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-soft">{p.d}</p>
            </motion.li>
          ))}
        </ol>

        <p className="mt-6 max-w-[60em] text-[13px] leading-relaxed text-mute">
          La muestra es una jeringa de 2 ml para que conozcas el producto: según el caso y el protocolo, puede no alcanzar para completar un tratamiento. No garantiza un resultado específico. Al solicitarla te comprometés a presentar tu caso clínico dentro de los 60 días de recibida.
        </p>
      </div>
    </section>
  );
}
