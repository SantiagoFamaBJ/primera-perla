"use client";

import { motion } from "framer-motion";
import { Contador } from "./Cupo";
import { Arrow, Reveal, ease, useLanding } from "./shared";

export default function Concentraciones() {
  const { config, estado, elegir, seleccion } = useLanding();
  return (
    <section id="concentraciones" className="bg-paper text-black py-24 md:py-32">
      <div className="mx-auto max-w-[1200px] px-5 md:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-end">
          <Reveal>
            <p className="eyebrow">Blanqueamiento ambulatorio profesional</p>
            <h2 className="mt-4 text-4xl md:text-6xl font-extrabold tracking-[-0.03em] leading-[1.02]">
              Elegí la concentración <span className="text-brand">que querés probar.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-lg leading-relaxed text-black/65">
              Gel de peróxido de carbamida en jeringa individual de 2 ml. Lo dosificás según tu protocolo y tu paciente lo hace en casa, bajo tu supervisión.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {config.concentraciones.map((c, i) => {
            const activa = seleccion === c.valor;
            return (
              <motion.div
                key={c.valor}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.8, ease, delay: i * 0.12 }}
                whileHover={{ y: -6 }}
                className={`group relative overflow-hidden rounded-lg border bg-white p-7 md:p-8 transition-colors ${activa ? "border-brand" : "border-black/10"}`}
              >
                <div className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-brand transition-transform duration-500 group-hover:scale-x-100" />
                <div className="flex items-start justify-between">
                  <p className="text-xs font-bold tracking-[0.24em] text-black/50">CP · {c.nivel.toUpperCase()}</p>
                  <p className="text-xs font-semibold text-black/40">Cód. {c.codigo}</p>
                </div>
                <p className="mt-4 text-[96px] md:text-[112px] font-extrabold leading-none tracking-[-0.05em]">
                  <Contador valor={Number(c.numero) || 0} />
                  <span className="text-brand text-[0.45em] align-top ml-1">%</span>
                </p>
                <p className="mt-3 text-lg font-semibold">{c.descripcion}</p>
                {estado.abierto && (
                  <button
                    type="button"
                    onClick={() => elegir(c.valor)}
                    className={`mt-7 inline-flex w-full items-center justify-between rounded-[4px] px-5 py-4 text-[15px] font-bold transition-colors ${activa ? "bg-brand text-white" : "bg-black text-white hover:bg-brand"}`}
                  >
                    {activa ? "Elegida" : `Quiero probar ${c.numero}%`} <Arrow />
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>

        {config.caracteristicas.length > 0 && (
          <Reveal className="mt-10 flex flex-wrap justify-center gap-2.5">
            {config.caracteristicas.map((t) => (
              <span key={t} className="rounded-full border border-black/15 bg-white px-4 py-2 text-sm font-semibold text-black/75">{t}</span>
            ))}
          </Reveal>
        )}
      </div>
    </section>
  );
}
