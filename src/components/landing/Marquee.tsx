"use client";

const ITEMS = ["Sin compra", "Envío sin cargo", "Elegís la concentración", "20% OFF al compartir tu caso", "10% OFF en compras +$200.000", "Una por matrícula", "Hasta agotar stock"];

export default function Marquee() {
  const fila = [...ITEMS, ...ITEMS];
  return (
    <div className="relative overflow-hidden bg-brand py-4 -rotate-[1.2deg] scale-[1.02] origin-center" aria-label={ITEMS.join(", ")}>
      <div className="marquee" aria-hidden="true">
        {fila.map((t, i) => (
          <span key={i} className="flex items-center gap-8 pr-8 text-sm md:text-base font-extrabold uppercase tracking-[0.12em] text-white whitespace-nowrap">
            {t}
            <svg viewBox="0 0 10 10" className="h-2.5 w-2.5"><circle cx="5" cy="5" r="5" fill="#000" /></svg>
          </span>
        ))}
      </div>
    </div>
  );
}
