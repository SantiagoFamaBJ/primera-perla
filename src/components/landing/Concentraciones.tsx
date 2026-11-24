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
              Gel de peróxido de carbamida en jeringa individual de 2 ml. Elegís la concentración que querés probar y la usás según tu protocolo.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="relative py-6">
            <img src="/img/jeringa.webp" alt="Jeringa Densell White de 2 ml" width={633} height={627} loading="lazy" className="mx-auto w-[78%] max-w-[420px] -rotate-[28deg] drop-shadow-[0_30px_30px_rgba(18,17,16,.25)]" />
          </Reveal>
        </div>

        <div className={`mt-14 grid border-y border-line-light ${n >= 3 ? "md:grid-cols-3" : n === 2 ? "md:grid-cols-2" : ""}`}>
          {config.concentraciones.map((c) => {
            const activa = seleccion === c.valor;
            const detalles = (c.detalles || "").split("\n").map((l) => l.trim()).filter(Boolean);
            return (
              <div key={c.valor} className={`flex flex-col items-center border-b border-line-light px-6 pb-9 pt-10 text-center transition-colors last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0 ${activa ? "bg-pearl-2" : "hover:bg-pearl-2"}`}>
                <p className="text-[13px] font-medium tracking-[0.3em] text-ink-soft">CP</p>
                <p className="font-display text-[110px] font-light leading-none md:text-[130px]">
                  {c.numero}<span className="text-[0.36em]">%</span>
                </p>
                <p className="mt-3 text-[13px] font-medium uppercase tracking-[0.26em]">{c.nivel}</p>
                <p className="mt-2 font-display text-[24px] font-medium italic leading-snug">{c.descripcion}</p>
                <ul className="mt-4 grid gap-1 text-[14px] text-ink-soft">
                  {c.presentacion && <li>{c.presentacion}</li>}
                  {detalles.map((l) => <li key={l}>{l}</li>)}
                </ul>
                {c.codigo && <p className="mt-4 text-[12px] font-medium tracking-[0.16em] text-ink-soft">CÓD. {c.codigo}</p>}
                {estado.abierto && (
                  <button
                    type="button"
                    onClick={() => {
                      track("SeleccionConcentracion", { concentracion: c.valor }, { custom: true, ga: "select_concentracion" });
                      elegir(c.valor);
                    }}
                    className={`btn mt-6 w-full max-w-[280px] ${activa ? "btn-brand" : "bg-onyx text-pearl hover:bg-brand"}`}
                  >
                    {activa ? `Elegiste ${c.numero}%` : `Quiero probar ${c.numero}%`} <Arrow />
                  </button>
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
