"use client";

import { useLanding } from "./shared";

const ITEMS = ["Muestra sin cargo", "Envío sin cargo", "CP 10 · 16 · 22 · 35%", "Para odontólogos matriculados", "20% OFF al presentar tu caso", "Una muestra por matrícula", "Hasta agotar stock"];

export default function Marquee() {
  const { config } = useLanding();
  const items = config.mostrarDescuentoExtra
    ? [...ITEMS.slice(0, 5), `${config.descuentoExtra.replace(/ en todas tus compras/i, "")} en compras +${config.descuentoExtraMinimo}`, ...ITEMS.slice(5)]
    : ITEMS;
  const fila = [...items, ...items];
  return (
    <div className="relative overflow-hidden bg-brand py-3.5" aria-label={items.join(", ")}>
      <div className="marquee" aria-hidden="true">
        {fila.map((t, i) => (
          <span key={i} className="flex items-center gap-7 pr-7 text-[13px] md:text-sm font-extrabold uppercase tracking-[0.12em] text-white whitespace-nowrap">
            {t}
            <span className="h-1.5 w-1.5 rounded-full bg-white/70" />
          </span>
        ))}
      </div>
    </div>
  );
}
