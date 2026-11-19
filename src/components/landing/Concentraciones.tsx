"use client";

import { Arrow, Check, Reveal, track, useLanding } from "./shared";

export default function Concentraciones() {
  const { config, estado, elegir, seleccion } = useLanding();
  return (
    <section id="concentraciones" className="bg-surface py-20 md:py-28">
      <div className="mx-auto max-w-[1200px] px-5 md:px-8">
        <Reveal className="max-w-[760px]">
          <p className="eyebrow">Concentraciones</p>
          <h2 className="mt-4 text-4xl md:text-6xl font-extrabold tracking-[-0.03em] leading-[1.02]">
            Elegí la que <span className="text-brand">querés probar.</span>
          </h2>
          <p className="mt-5 text-[16px] md:text-lg leading-relaxed text-soft">
            Gel de peróxido de carbamida en jeringa individual de 2 ml.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 md:mt-12">
          {config.concentraciones.map((c) => {
            const activa = seleccion === c.valor;
            const detalles = (c.detalles || "").split("\n").map((l) => l.trim()).filter(Boolean);
            return (
              <div
                key={c.valor}
                className={`flex flex-col rounded-lg border bg-white p-6 transition-colors ${activa ? "border-brand ring-2 ring-brand/20" : "border-line"}`}
              >
                <p className="inline-flex self-start rounded-full bg-surface px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-soft">{c.nivel}</p>
                <p className="mt-4 text-[80px] font-extrabold leading-none tracking-[-0.05em]">
                  {c.numero}
                  <span className="ml-1 align-top text-[0.42em] text-brand">%</span>
                </p>
                <p className="mt-1 text-[11px] font-bold tracking-[0.18em] text-mute">PERÓXIDO DE CARBAMIDA</p>
                <p className="mt-3 text-[15px] font-semibold text-ink">{c.descripcion}</p>
                <ul className="mt-4 grid gap-2 border-t border-line pt-4">
                  {c.presentacion && (
                    <li className="flex gap-2.5 text-[13.5px] leading-snug text-soft">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" /> Presentación: {c.presentacion.charAt(0).toLowerCase() + c.presentacion.slice(1)}
                    </li>
                  )}
                  {detalles.map((l) => (
                    <li key={l} className="flex gap-2.5 text-[13.5px] leading-snug text-soft">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" /> {l}
                    </li>
                  ))}
                </ul>
                {estado.abierto && (
                  <div className="mt-auto pt-6">
                    <button
                      type="button"
                      onClick={() => {
                        track("SeleccionConcentracion", { concentracion: c.valor }, { custom: true, ga: "select_concentracion" });
                        elegir(c.valor);
                      }}
                      className={`inline-flex min-h-[50px] w-full items-center justify-between rounded-[4px] px-4 text-[15px] font-bold transition-colors ${activa ? "bg-brand text-white" : "bg-ink text-white hover:bg-brand"}`}
                    >
                      {activa ? `Elegiste ${c.numero}%` : `Quiero probar ${c.numero}%`} <Arrow />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {config.caracteristicas.length > 0 && (
          <ul className="mt-8 flex flex-wrap justify-center gap-2">
            {config.caracteristicas.map((t) => (
              <li key={t} className="rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-soft">{t}</li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
