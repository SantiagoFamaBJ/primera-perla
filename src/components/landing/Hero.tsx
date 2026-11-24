"use client";

import { useEffect, useId, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Arrow, Check, CtaForm, ease, fechaCorta, useLanding } from "./shared";

function Visual({ compacto = false }: { compacto?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18 });
  const sy = useSpring(my, { stiffness: 60, damping: 18 });
  const rx = useTransform(sy, (v) => v * -8);
  const ry = useTransform(sx, (v) => v * 10);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const f = (e: PointerEvent) => {
      mx.set(e.clientX / window.innerWidth - 0.5);
      my.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("pointermove", f, { passive: true });
    return () => window.removeEventListener("pointermove", f);
  }, [mx, my]);

  const circId = "circ" + useId().replace(/:/g, "");
  const anillo = "DENSELL WHITE · CP 10 · 16 · 22 · MUESTRA PROFESIONAL · ";

  return (
    <div ref={ref} className="relative mx-auto aspect-square w-full max-w-[540px]" style={{ perspective: 1000 }} aria-hidden="true">
      <div className="absolute inset-[14%] rounded-full bg-[radial-gradient(circle,rgba(200,182,142,.22)_0%,rgba(232,118,43,.10)_45%,transparent_70%)] blur-2xl" />
      {/* Firma: las líneas del envase */}
      <svg viewBox="0 0 520 520" className="absolute inset-0 h-full w-full overflow-visible">
        {[
          { d: "M-60 400 C 120 330, 300 470, 600 300", c: "rgba(244,240,232,.22)", w: 1, delay: 0.3 },
          { d: "M-60 382 C 130 300, 310 450, 600 278", c: "rgba(244,240,232,.5)", w: 1, delay: 0.15 },
          { d: "M-60 362 C 140 272, 320 430, 600 256", c: "#e8762b", w: 2, delay: 0 },
        ].map((l) => (
          <motion.path key={l.d} d={l.d} fill="none" stroke={l.c} strokeWidth={l.w} strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2.4, ease: [0.4, 0, 0.2, 1], delay: l.delay }} />
        ))}
      </svg>
      <svg viewBox="0 0 500 500" className="absolute inset-0 h-full w-full">
        {[240, 196].map((r, i) => (
          <motion.circle
            key={r}
            cx="250" cy="250" r={r}
            fill="none"
            stroke={i === 0 ? "rgba(200,182,142,.55)" : "rgba(244,240,232,.14)"}
            strokeWidth={1}
            strokeDasharray={i === 1 ? "2 8" : undefined}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.8, ease: [0.4, 0, 0.2, 1], delay: 0.2 + i * 0.15 }}
            style={{ rotate: -90, originX: "50%", originY: "50%" }}
          />
        ))}
      </svg>
      <svg viewBox="0 0 500 500" className="spin-slow absolute inset-0 h-full w-full">
        <defs>
          <path id={circId} d="M250,250 m-222,0 a222,222 0 1,1 444,0 a222,222 0 1,1 -444,0" />
        </defs>
        <text fill="rgba(244,240,232,.45)" fontSize="11" fontWeight="500" letterSpacing="4" fontFamily="Jost, sans-serif">
          <textPath href={`#${circId}`}>{anillo + anillo}</textPath>
        </text>
      </svg>
      <motion.div className="absolute inset-[4%]" animate={{ rotate: 360 }} transition={{ duration: 14, repeat: Infinity, ease: "linear" }}>
        <span className="absolute left-1/2 top-0 -ml-1.5 h-3 w-3 rounded-full bg-signature shadow-[0_0_18px_4px_rgba(232,118,43,.6)]" />
      </motion.div>
      <motion.div style={{ rotateX: rx, rotateY: ry }} className="absolute inset-[5%]">
        <motion.div
          className="relative h-full w-full"
          initial={{ rotate: -20, scale: 0.92 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ duration: 1.1, ease, delay: 0.2 }}
        >
          <motion.div className="relative h-full w-full" animate={{ y: [0, -12, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1.4 }}>
            <img src="/img/jeringa.webp" alt="" width={633} height={627} fetchPriority="high" className="h-full w-full object-contain drop-shadow-[0_40px_45px_rgba(0,0,0,.6)]" />
            <div className="shine pointer-events-none absolute inset-0" />
          </motion.div>
        </motion.div>
      </motion.div>
      {!compacto && (<div className="absolute right-0 top-[8%] rounded-xl border border-line-dark bg-onyx-2/85 px-3.5 py-2 backdrop-blur">
        <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-mist">Gel blanqueador</p>
        <p className="font-display text-lg leading-tight">Densell White</p>
      </div>)}
      {!compacto && (<div className="absolute bottom-[8%] left-0 rounded-xl border border-line-dark bg-onyx-2/85 px-3.5 py-2 backdrop-blur">
        <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-mist">Peróxido de carbamida</p>
        <p className="font-display text-lg leading-tight">10 · 16 · 22%</p>
      </div>)}
    </div>
  );
}

function VisualMovil() {
  // Mismo círculo animado del escritorio, en tamaño celular (se ve apenas carga)
  return (
    <div className="relative mx-auto -my-1 w-[236px] lg:hidden">
      <Visual compacto />
    </div>
  );
}

export default function Hero() {
  const { config, estado } = useLanding();
  const tit = config.heroTitulo.trim().split(" ");
  const corte = Math.max(0, tit.length - 2);
  const bajada = <p className="max-w-[30em] whitespace-pre-line text-[17px] leading-relaxed text-sand md:text-[20px]">{config.heroBajada}</p>;
  const facts = [
    { n: "2 ml", l: "Muestra sin cargo" },
    { n: fechaCorta(config.cierre), l: "Cierre de inscripción" },
    { n: "20%", l: "Off al presentar tu caso" },
  ];
  return (
    <section id="inicio" data-oculta-cta className="relative isolate overflow-hidden pt-[84px] pb-14 md:pt-32 md:pb-24">
      <div className="pointer-events-none absolute -right-64 -top-52 -z-10 h-[900px] w-[900px] bg-[radial-gradient(circle,rgba(200,182,142,.12),transparent_60%)]" />
      <div className="mx-auto grid max-w-[1200px] items-center gap-6 px-5 md:px-8 lg:grid-cols-[1.1fr_.9fr] lg:gap-12">
        <div className="flex flex-col gap-4 md:gap-7">
          <p className="eyebrow">{config.programa} · Densell White</p>
          <h1 className="text-[46px] leading-[1.02] sm:text-7xl lg:text-[96px]">
            {tit.slice(0, corte).join(" ")} <em className="italic text-champagne">{tit.slice(corte).join(" ")}</em>
          </h1>
          <VisualMovil />
          <div className="hidden lg:block">{bajada}</div>

          <div className="flex flex-col gap-3">
            {estado.abierto ? (
              <CtaForm lugar="hero" className="btn btn-brand w-full sm:w-auto sm:self-start">
                Pedí tu muestra gratis <Arrow />
              </CtaForm>
            ) : (
              <p className="rounded-2xl border border-line-dark px-5 py-4 text-sand">La inscripción está cerrada. Gracias por tu interés.</p>
            )}
            <p className="flex items-start gap-2 text-[14px] text-sand">
              <Check className="mt-1 h-3.5 w-3.5 shrink-0 text-signature" />
              <span>Exclusivo para odontólogos matriculados de Argentina. <span className="text-mist">El envío corre por cuenta del profesional.</span></span>
            </p>
          </div>
          <div className="lg:hidden">{bajada}</div>

          <div className="mt-2 grid grid-cols-3 border-t border-line-dark">
            {facts.map((f, i) => (
              <div key={f.l} className={`pt-4 pr-3 ${i < 2 ? "mr-3 border-r border-line-dark" : ""}`}>
                <p className="font-display text-[30px] leading-none md:text-[40px]" style={{ fontVariantNumeric: "tabular-nums" }}>{f.n}</p>
                <p className="mt-2 text-[10px] font-medium uppercase leading-snug tracking-[0.16em] text-mist md:text-[12px]">{f.l}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="mx-auto hidden w-full lg:block">
          <Visual />
        </div>
      </div>
    </section>
  );
}
