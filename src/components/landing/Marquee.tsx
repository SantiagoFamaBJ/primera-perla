"use client";

import { useLanding } from "./shared";

const ITEMS = ["Muestra sin cargo", "CP 10 · 16 · 22%", "Para odontólogos matriculados", "20% off al presentar tu caso", "Una muestra por matrícula", "Hasta agotar stock"];

export default function Marquee() {
  const { config } = useLanding();
  const items = config.mostrarDescuentoExtra
    ? [...ITEMS.slice(0, 4), `${config.descuentoExtra.replace(/ en todas tus compras/i, "")} en compras +${config.descuentoExtraMinimo}`, ...ITEMS.slice(4)]
    : ITEMS;
  const fila = [...items, ...items];
  return (
    <div className="relative overflow-hidden border-y border-line-dark bg-onyx-2 py-4" aria-label={items.join(", ")}>
      <div className="marquee" aria-hidden="true">
        {fila.map((t, i) => (
          <span key={i} className="flex items-center gap-8 pr-8 text-[12px] font-medium uppercase tracking-[0.26em] text-sand whitespace-nowrap">
            {t}
            <span className="h-1.5 w-1.5 rounded-full bg-signature" />
          </span>
        ))}
      </div>
    </div>
  );
}
