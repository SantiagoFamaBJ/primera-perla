"use client";

import { Reveal, useLanding } from "./shared";

// Beneficio secundario: acompaña, no compite con la solicitud de la muestra.
export default function Beneficio() {
  const { config } = useLanding();
  return (
    <section className="bg-onyx-2 py-24 md:py-28">
      <div className="mx-auto max-w-[1200px] px-5 md:px-8">
        <div className="grid items-end gap-10 lg:grid-cols-2 lg:gap-14">
          <Reveal>
            <p className="eyebrow">Beneficio por tu caso</p>
            <p className="mt-4 whitespace-nowrap font-display text-[104px] font-light leading-[0.9] tracking-[-0.03em] md:text-[170px]">
              20% <em className="text-[0.42em] tracking-normal text-champagne">off</em>
            </p>
          </Reveal>
          <Reveal delay={0.1} className="grid gap-5 pb-3">
            <p className="font-display text-[30px] font-medium leading-tight md:text-[34px]">
              Presentá tu caso clínico y te damos un 20% de descuento en tu próxima compra de Densell White.
            </p>
            <p className="text-[16px] leading-relaxed text-mist">
              Cuando recibimos y revisamos tu caso, te enviamos un cupón por WhatsApp. Vale por 7 días corridos desde que te lo entregamos. No se entrega al completar el formulario.
            </p>
          </Reveal>
        </div>

        {config.mostrarDescuentoExtra && (
          <Reveal className="mt-14 grid items-center gap-6 border-t border-line-dark pt-10 md:grid-cols-[auto_1fr] md:gap-12">
            <p className="whitespace-nowrap font-display text-[72px] font-light leading-none md:text-[96px]">
              10% <em className="text-[0.42em] text-champagne">off</em>
            </p>
            <div>
              <p className="eyebrow">Y además</p>
              <p className="mt-2 font-display text-[26px] font-medium leading-snug md:text-[30px]">
                {config.descuentoExtra} mayores a {config.descuentoExtraMinimo}.
              </p>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
