"use client";

import { Arrow, Check, track, useLanding } from "./shared";

// Acceso directo justo debajo del hero: elegís la concentración y vas al formulario con eso cargado.
export default function AccesoRapido() {
  const { config, estado, elegir } = useLanding();
  if (!estado.abierto) return null;
  return (
    <section aria-labelledby="acceso-titulo" className="border-y border-line-dark bg-onyx-2">
      <div className="mx-auto grid max-w-[1200px] gap-7 px-5 py-9 md:px-8 md:py-11 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-12">
        <div>
          <p id="acceso-titulo" className="eyebrow">Pedí tus 2 jeringas sin cargo</p>
          <ul className="mt-4 grid gap-2 text-[15px] text-sand md:text-[16px]">
            <li className="flex gap-2.5"><Check className="mt-1.5 h-3.5 w-3.5 shrink-0 text-signature" /><span><strong className="font-medium text-pearl">Retiro sin cargo</strong> en {config.retiroLugar}.</span></li>
            <li className="flex gap-2.5"><Check className="mt-1.5 h-3.5 w-3.5 shrink-0 text-signature" /><span>O <strong className="font-medium text-pearl">envío a domicilio a tu cargo</strong>, coordinado por WhatsApp.</span></li>
          </ul>
        </div>
        <div>
          <p className="mb-3 text-[12px] font-medium uppercase tracking-[0.22em] text-mist">Elegí la concentración</p>
          <div className="grid grid-cols-3 gap-2.5 sm:flex">
            {config.concentraciones.map((c) => {
              const agotada = estado.agotadas.includes(c.valor);
              return (
                <button
                  key={c.valor}
                  type="button"
                  disabled={agotada}
                  onClick={() => {
                    track("SeleccionConcentracion", { concentracion: c.valor, lugar: "acceso-rapido" }, { custom: true, ga: "select_concentracion" });
                    elegir(c.valor);
                  }}
                  aria-label={agotada ? `${c.valor} agotado` : `Pedir ${c.valor}`}
                  className={`group flex min-h-[64px] flex-col items-center justify-center rounded-2xl border px-4 transition-colors sm:min-w-[108px] ${agotada ? "cursor-not-allowed border-line-dark opacity-60" : "border-line-dark hover:border-champagne hover:bg-champagne/10"}`}
                >
                  <span className={`font-display text-[32px] leading-none ${agotada ? "text-mist line-through" : ""}`}>{c.numero}<span className="text-[0.55em]">%</span></span>
                  <span className={`mt-1 text-[10px] font-medium uppercase tracking-[0.18em] ${agotada ? "text-danger" : "text-mist group-hover:text-champagne"}`}>
                    {agotada ? "Agotado" : <span className="inline-flex items-center gap-1">Pedir <Arrow className="h-3 w-3" /></span>}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
