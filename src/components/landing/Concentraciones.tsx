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
            <p className="eyebrow">Blanqueamiento profesional</p>
            <h2 className="mt-4 text-4xl md:text-6xl font-extrabold tracking-[-0.03em] leading-[1.02]">
              Elegí la concentración <span className="text-brand">que querés probar.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-lg leading-relaxed text-black/65">
              Gel de peróxido de carbamida en jeringa individual de 2 ml. 10 y 16% para uso ambulatorio, 22% para uso ambulatorio o en consultorio, y 35% para consultorio.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {config.concentraciones.map((c, i) => {
            const activa = seleccion === c.valor;
            return (
              <motion.div
                key={c.valor}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.8, ease, delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                className={`group relative flex flex-col overflow-hidden rounded-lg border bg-white p-6 transition-colors ${activa ? "border-brand" : "border-black/10"}`}
              >
                <div className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-brand transition-transform duration-500 group-hover:scale-x-100" />
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-black/50">{c.nivel}</p>
                  {c.codigo && <p className="text-[11px] font-semibold text-black/40">Cód. {c.codigo}</p>}
                </div>
                <p className="mt-4 text-[88px] font-extrabold leading-none tracking-[-0.05em]">
                  <Contador valor={Number(c.numero) || 0} />
                  <span className="ml-1 align-top text-[0.42em] text-brand">%</span>
                </p>
                <p className="mt-1 text-xs font-bold tracking-[0.18em] text-black/45">PERÓXIDO DE CARBAMIDA</p>
                <p className="mt-3 text-[15px] font-semibold text-black/75">{c.descripcion}</p>
                {c.detalles?.trim() && (
                  <ul className="mt-4 grid gap-2 border-t border-black/10 pt-4">
                    {c.detalles.split("\n").map((l) => l.trim()).filter(Boolean).map((l) => (
                      <li key={l} className="flex gap-2.5 text-[13.5px] leading-snug text-black/65">
                        <svg viewBox="0 0 16 16" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" aria-hidden="true"><path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        {l}
                      </li>
                    ))}
                  </ul>
                )}
                {estado.abierto && (
                  <div className="mt-auto pt-6">
                  <button
                    type="button"
                    onClick={() => elegir(c.valor)}
                    className={`inline-flex w-full items-center justify-between rounded-[4px] px-4 py-3.5 text-[14px] font-bold transition-colors ${activa ? "bg-brand text-white" : "bg-black text-white hover:bg-brand"}`}
                  >
                    {activa ? "Elegida" : `Quiero probar ${c.numero}%`} <Arrow />
                  </button>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {config.caracteristicas.length > 0 && (
          <Reveal className="mt-16">
            <p className="text-center text-xs font-bold uppercase tracking-[0.22em] text-black/45">Características del gel</p>
            <ul className="mt-6 flex flex-wrap border-y border-black/10">
              {config.caracteristicas.map((t, i, arr) => {
                const ultimaSola = arr.length % 2 === 1 && i === arr.length - 1;
                return (
                  <li
                    key={t}
                    className={`flex flex-col items-center gap-3 px-4 py-7 text-center md:flex-1 md:basis-0 md:border-b-0 md:border-r md:last:border-r-0 ${ultimaSola ? "basis-full" : "basis-1/2"} ${i % 2 === 0 && !ultimaSola ? "border-r border-black/10" : "border-black/10"} ${i < arr.length - (arr.length % 2 === 1 ? 1 : 2) ? "border-b" : ""}`}
                  >
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-brand/10 text-brand">
                      <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden="true"><path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </span>
                    <span className="text-[15px] font-bold leading-snug">{t}</span>
                  </li>
                );
              })}
            </ul>
          </Reveal>
        )}
      </div>
    </section>
  );
}
