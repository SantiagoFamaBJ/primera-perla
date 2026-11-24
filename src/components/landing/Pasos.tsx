"use client";

import { motion } from "framer-motion";
import { Reveal, ease } from "./shared";

const PASOS = [
  { n: "01", t: "Elegí tu muestra", d: "Seleccioná la concentración y completá tus datos." },
  { n: "02", t: "Recibila", d: "Validamos tu matrícula y coordinamos el envío por WhatsApp. El envío corre por tu cuenta." },
  { n: "03", t: "Probala en tu consultorio", d: "Usala según tu criterio profesional y documentá el antes y el después con guía de color." },
  { n: "04", t: "Compartí tu caso", d: "Dentro de los 60 días de recibida la muestra. Y accedé al 20% off." },
];

export default function Pasos() {
  return (
    <section id="como-funciona" className="py-24 md:py-32">
      <div className="mx-auto max-w-[1200px] px-5 md:px-8">
        <Reveal className="grid max-w-[760px] gap-5">
          <p className="eyebrow">Cómo participar</p>
          <h2 className="text-[46px] leading-[1.02] md:text-[84px]">
            Cuatro pasos,<br /><em className="italic text-champagne">un caso.</em>
          </h2>
          <p className="max-w-[34em] text-[17px] text-sand md:text-[20px]">Sin compra. Solo te pedimos que nos muestres tu resultado.</p>
        </Reveal>

        <ol className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0 md:mt-20">
          {PASOS.map((p, i) => (
            <motion.li
              key={p.n}
              className="relative border-t border-line-dark pt-9 lg:pr-7"
              initial={{ y: 16 }}
              whileInView={{ y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, ease, delay: i * 0.08 }}
            >
              <span className={`absolute -top-[5px] left-0 h-[9px] w-[9px] rounded-full shadow-[0_0_0_4px_#121110] ${i === 3 ? "bg-signature" : "bg-pearl"}`} />
              <p className="text-[13px] font-medium tracking-[0.26em] text-champagne">{p.n}</p>
              <h3 className="mt-3 text-[32px] font-normal leading-[1.05] md:text-[36px]">{p.t}</h3>
              <p className="mt-3 text-[16px] leading-relaxed text-sand">{p.d}</p>
            </motion.li>
          ))}
        </ol>

        <p className="mt-12 max-w-[60em] text-[14px] leading-relaxed text-mist">
          La muestra es una jeringa de 2 ml para que conozcas el producto: según el caso y el protocolo, puede no alcanzar para completar un tratamiento. No garantiza un resultado específico. Al solicitarla te comprometés a presentar tu caso clínico dentro de los 60 días de recibida.
        </p>
      </div>
    </section>
  );
}
