"use client";

import { Arrow, Reveal, track, useLanding } from "./shared";

export default function Concentraciones() {
  const { config, estado, elegir, seleccion } = useLanding();
  const n = config.concentraciones.length;
  return (
    <section id="concentraciones" className="on-light bg-pearl py-24 text-onyx md:py-32">
      <div className="mx-auto max-w-[1200px] px-5 md:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1fr] lg:gap-14">
          <Reveal className="grid gap-5">
            <p className="eyebrow">Blanqueamiento profesional</p>
            <h2 className="text-[46px] leading-[1.02] md:text-[84px]">
              El brillo <em className="italic text-champagne-ink">lo indicás vos.</em>
            </h2>
            <hr className="rule" />
            <p className="max-w-[34em] text-[17px] text-ink-soft md:text-[20px]">
              Elegís una concentración y recibís 2 jeringas de 2 ml para usar según tu protocolo. Datos tomados de las fichas del producto.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="relative py-6">
            <img src="/img/jeringa.webp" alt="Jeringa Densell White de 2 ml" width={633} height={627} loading="lazy" className="mx-auto w-[78%] max-w-[420px] -rotate-[28deg] drop-shadow-[0_30px_30px_rgba(18,17,16,.25)]" />
          </Reveal>
        </div>

        <div className={`mt-14 grid border-y border-line-light ${n >= 3 ? "md:grid-cols-3" : n === 2 ? "md:grid-cols-2" : ""}`}>
          {config.concentraciones.map((c) => {
            const activa = seleccion === c.valor;
            const agotada = estado.agotadas.includes(c.valor);
            const formula = (c.detalles || "").split("\n").map((l) => l.trim()).filter(Boolean);
            const filas: [string, React.ReactNode][] = [
              ["Presentación", c.presentacion || "2 jeringas de 2 ml"],
              ["Indicación", c.indicacion || "Según indicación profesional."],
              ["Protocolo de referencia", c.protocolo || "Según indicación profesional."],
              ["Formulación", formula.length ? formula.join(" · ") : "Peróxido de carbamida al " + c.numero + "%."],
            ];
            return (
              <div key={c.valor} className={`relative flex flex-col border-b border-line-light px-6 pb-9 pt-10 transition-colors last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0 ${agotada ? "bg-pearl-2/60" : activa ? "bg-pearl-2" : "hover:bg-pearl-2"}`}>
                {agotada && <span className="absolute right-5 top-5 rounded-full bg-onyx px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-pearl">Agotado</span>}
                <div className="text-center">
                  <p className="text-[13px] font-medium tracking-[0.3em] text-ink-soft">CP</p>
                  <p className={`font-display text-[110px] font-light leading-none md:text-[130px] ${agotada ? "text-ink-soft/60 line-through decoration-[3px]" : ""}`}>
                    {c.numero}<span className="text-[0.36em]">%</span>
                  </p>
                  <p className="mt-3 text-[13px] font-medium uppercase tracking-[0.26em]">{c.nivel}</p>
                  <p className="mt-2 font-display text-[22px] font-medium italic leading-snug">{c.descripcion}</p>
                </div>
                <dl className="mt-6 grid gap-3 border-t border-line-light pt-5 text-left">
                  {filas.map(([k, v]) => (
                    <div key={k}>
                      <dt className="text-[11px] font-medium uppercase tracking-[0.2em] text-champagne-ink">{k}</dt>
                      <dd className="mt-0.5 text-[15px] leading-snug text-ink-soft">{v}</dd>
                    </div>
                  ))}
                </dl>
                {c.codigo && <p className="mt-4 text-center text-[12px] font-medium tracking-[0.16em] text-ink-soft">CÓD. {c.codigo}</p>}
                {estado.abierto && (
                  <div className="mt-auto flex justify-center pt-6">
                    {agotada ? (
                      <span className="btn w-full max-w-[280px] cursor-not-allowed border-line-light text-ink-soft">Agotado</span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          track("SeleccionConcentracion", { concentracion: c.valor }, { custom: true, ga: "select_concentracion" });
                          elegir(c.valor);
                        }}
                        className={`btn w-full max-w-[280px] ${activa ? "btn-brand" : "bg-onyx text-pearl hover:bg-brand"}`}
                      >
                        {activa ? `Elegiste ${c.numero}%` : `Quiero probar ${c.numero}%`} <Arrow />
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {config.caracteristicas.length > 0 && (
          <p className="mt-7 flex flex-wrap justify-center gap-x-7 gap-y-2 text-[16px] font-medium text-ink-soft">
            {config.caracteristicas.map((t) => <span key={t}>{t}</span>)}
          </p>
        )}
      </div>
    </section>
  );
}
