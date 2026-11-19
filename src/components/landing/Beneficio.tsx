"use client";

import { Reveal, useLanding } from "./shared";

// Beneficio secundario: no compite con la solicitud de la muestra.
export default function Beneficio() {
  const { config } = useLanding();
  return (
    <section className="bg-surface py-16 md:py-20">
      <div className="mx-auto grid max-w-[1200px] gap-4 px-5 md:px-8">
        <Reveal className="grid items-center gap-6 rounded-xl border border-line bg-white p-6 md:grid-cols-[auto_1fr] md:gap-10 md:p-9">
          <p className="text-6xl md:text-7xl font-extrabold leading-none tracking-[-0.05em]">
            20<span className="text-brand">%</span>
            <span className="ml-2 text-2xl md:text-3xl tracking-normal text-mute">OFF</span>
          </p>
          <div>
            <p className="eyebrow">Beneficio por presentar tu caso</p>
            <p className="mt-2 text-xl md:text-2xl font-bold leading-snug">20% de descuento en tu próxima compra de Densell White.</p>
            <p className="mt-2 text-[15px] leading-relaxed text-soft">
              Cuando recibimos y revisamos tu caso, te enviamos un cupón por WhatsApp. Vale por 30 días corridos desde que te lo entregamos. No se entrega al completar el formulario.
            </p>
          </div>
        </Reveal>

        {config.mostrarDescuentoExtra && (
          <Reveal className="grid items-center gap-6 rounded-xl border border-line bg-white p-6 md:grid-cols-[auto_1fr] md:gap-10 md:p-9">
            <p className="text-6xl md:text-7xl font-extrabold leading-none tracking-[-0.05em]">
              10<span className="text-brand">%</span>
              <span className="ml-2 text-2xl md:text-3xl tracking-normal text-mute">OFF</span>
            </p>
            <div>
              <p className="eyebrow">Y además</p>
              <p className="mt-2 text-xl md:text-2xl font-bold leading-snug">
                {config.descuentoExtra} mayores a <span className="text-brand">{config.descuentoExtraMinimo}</span>.
              </p>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
