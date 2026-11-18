"use client";

import { useState } from "react";
import { Reveal, useLanding } from "./shared";

function AntesDespues({ antes, despues, alt }: { antes: string; despues: string; alt: string }) {
  const [pos, setPos] = useState(50);
  return (
    <div className="relative aspect-[4/3] select-none overflow-hidden rounded-lg bg-surface-2">
      <img src={despues} alt={`${alt} — después`} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
      <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <img src={antes} alt={`${alt} — antes`} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
      </div>
      <div className="pointer-events-none absolute inset-y-0 w-0.5 bg-white" style={{ left: `${pos}%` }}>
        <span className="absolute left-1/2 top-1/2 grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-brand text-sm font-bold text-white shadow-lg">↔</span>
      </div>
      <span className="absolute left-3 top-3 rounded bg-black/70 px-2 py-1 text-[11px] font-bold uppercase tracking-widest">Antes</span>
      <span className="absolute right-3 top-3 rounded bg-black/70 px-2 py-1 text-[11px] font-bold uppercase tracking-widest">Después</span>
      <input type="range" min={0} max={100} value={pos} onChange={(e) => setPos(Number(e.target.value))} aria-label="Comparar antes y después" className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0" />
    </div>
  );
}

// La sección solo aparece cuando hay casos cargados desde /ADMIN.
export default function Casos() {
  const { config } = useLanding();
  const casos = config.casos.filter((c) => c.antes && c.despues);
  if (!casos.length) return null;
  return (
    <section id="casos" className="bg-black py-24 md:py-32">
      <div className="mx-auto max-w-[1200px] px-5 md:px-8">
        <Reveal className="max-w-[720px]">
          <p className="eyebrow">Casos de la comunidad</p>
          <h2 className="mt-4 text-4xl md:text-6xl font-extrabold tracking-[-0.03em] leading-[1.02]">Resultados de <span className="text-brand">colegas.</span></h2>
        </Reveal>
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {casos.map((c, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <AntesDespues antes={c.antes} despues={c.despues} alt={c.profesional || "Caso clínico"} />
              <p className="mt-4 font-bold">{c.profesional}</p>
              {c.detalle && <p className="mt-1 text-[15px] text-mute">{c.detalle}</p>}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
