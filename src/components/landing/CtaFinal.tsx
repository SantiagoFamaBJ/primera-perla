"use client";

import { Arrow, CtaForm, useLanding } from "./shared";

export default function CtaFinal() {
  const { estado } = useLanding();
  if (!estado.abierto) return null;
  return (
    <section data-oculta-cta className="relative overflow-hidden py-24 md:py-32">
      <div className="pointer-events-none absolute -left-40 top-0 h-[700px] w-[700px] bg-[radial-gradient(circle,rgba(200,182,142,.1),transparent_60%)]" />
      <img
        src="/img/jeringa.webp"
        alt=""
        aria-hidden="true"
        loading="lazy"
        width={633}
        height={627}
        className="pointer-events-none absolute -right-16 top-1/2 hidden w-[460px] -translate-y-1/2 -rotate-12 drop-shadow-[0_40px_45px_rgba(0,0,0,.6)] md:block"
      />
      <div className="relative mx-auto max-w-[1200px] px-5 md:px-8">
        <div className="grid max-w-[640px] gap-6">
          <hr className="rule" />
          <h2 className="text-[46px] leading-[1.02] md:text-[84px]">
            Probalo con tu <em className="italic text-champagne">próximo paciente.</em>
          </h2>
          <p className="text-[17px] text-sand md:text-[20px]">2 jeringas sin cargo para odontólogos matriculados de Argentina.</p>
          <CtaForm lugar="cta-final" className="btn btn-brand mt-2 w-full sm:w-auto sm:justify-self-start">
            Pedí tu muestra gratis <Arrow />
          </CtaForm>
        </div>
      </div>
    </section>
  );
}
