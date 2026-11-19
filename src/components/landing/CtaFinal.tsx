"use client";

import { Arrow, CtaForm, useLanding } from "./shared";

export default function CtaFinal() {
  const { estado } = useLanding();
  if (!estado.abierto) return null;
  return (
    <section data-oculta-cta className="relative overflow-hidden bg-brand py-16 md:py-24">
      <img
        src="/img/jeringa.webp"
        alt=""
        aria-hidden="true"
        loading="lazy"
        width={633}
        height={627}
        className="pointer-events-none absolute -right-20 top-1/2 hidden w-[480px] -translate-y-1/2 -rotate-12 opacity-90 md:block"
      />
      <div className="relative mx-auto max-w-[1200px] px-5 md:px-8">
        <div className="max-w-[640px] text-white">
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-[-0.03em] leading-[1.02]">
            Probalo con tu próximo paciente.
          </h2>
          <p className="mt-4 text-lg font-semibold text-white/90">Muestra y envío sin cargo. Exclusivo para odontólogos matriculados.</p>
          <CtaForm lugar="cta-final" className="btn btn-dark mt-8 w-full sm:w-auto !min-h-[56px] !text-base">
            Pedí tu muestra gratis <Arrow />
          </CtaForm>
        </div>
      </div>
    </section>
  );
}
