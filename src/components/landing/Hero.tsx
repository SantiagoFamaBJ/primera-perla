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
  const anillo = "DENSELL WHITE · CP 10 · 16 · 22 · 35 · MUESTRA PROFESIONAL · ";

  return (
    <div ref={ref} className="relative mx-auto aspect-square w-full max-w-[540px]" style={{ perspective: 1000 }} aria-hidden="true">
      <div className="absolute inset-[14%] rounded-full bg-[radial-gradient(circle,rgba(241,89,34,.28)_0%,rgba(241,89,34,.08)_45%,transparent_70%)] blur-2xl" />
      <svg viewBox="0 0 500 500" className="absolute inset-0 h-full w-full">
        {[240, 196, 152].map((r, i) => (
          <motion.circle
            key={r}
            cx="250" cy="250" r={r}
            fill="none"
            stroke={i === 0 ? "rgba(241,89,34,.75)" : "rgba(0,0,0,.12)"}
            strokeWidth={i === 0 ? 1.5 : 1}
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
        <text fill="rgba(0,0,0,.35)" fontSize="11" fontWeight="700" letterSpacing="3.4">
          <textPath href={`#${circId}`}>{anillo + anillo}</textPath>
        </text>
      </svg>
      <motion.div className="absolute inset-[4%]" animate={{ rotate: 360 }} transition={{ duration: 14, repeat: Infinity, ease: "linear" }}>
        <span className="absolute left-1/2 top-0 -ml-1.5 h-3 w-3 rounded-full bg-brand shadow-[0_0_16px_3px_rgba(241,89,34,.55)]" />
      </motion.div>
      <motion.div style={{ rotateX: rx, rotateY: ry }} className="absolute inset-[5%]">
        <motion.div
          className="relative h-full w-full"
          initial={{ rotate: -20, scale: 0.92 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ duration: 1.1, ease, delay: 0.2 }}
        >
          <motion.div className="relative h-full w-full" animate={{ y: [0, -12, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1.4 }}>
            <img src="/img/jeringa.webp" alt="" width={633} height={627} fetchPriority="high" className="h-full w-full object-contain drop-shadow-[0_30px_35px_rgba(0,0,0,.28)]" />
            <div className="shine pointer-events-none absolute inset-0" />
          </motion.div>
        </motion.div>
      </motion.div>
      {!compacto && (<div className="absolute right-0 top-[8%] rounded-md border border-black/10 bg-white/90 px-2.5 py-1.5 shadow-sm backdrop-blur md:px-3.5 md:py-2">
        <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-mute md:text-[10px]">Gel blanqueador</p>
        <p className="text-[11px] font-bold md:text-sm">Densell White</p>
      </div>)}
      {!compacto && (<div className="absolute bottom-[8%] left-0 rounded-md border border-black/10 bg-white/90 px-2.5 py-1.5 shadow-sm backdrop-blur md:px-3.5 md:py-2">
        <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-mute md:text-[10px]">Peróxido de carbamida</p>
        <p className="text-[11px] font-bold md:text-sm">10 · 16 · 22 · 35%</p>
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
  const bajada = <p className="max-w-[34em] whitespace-pre-line text-[16px] md:text-lg leading-relaxed text-soft">{config.heroBajada}</p>;
  return (
    <section id="inicio" data-oculta-cta className="relative isolate overflow-hidden pt-[84px] md:pt-28 pb-12 md:pb-20">
      <div className="grid-bg absolute inset-0 -z-10" />
      <div className="mx-auto grid max-w-[1200px] items-center gap-6 px-5 md:px-8 lg:grid-cols-[1.05fr_.95fr] lg:gap-6">
        <div className="flex flex-col gap-4 md:gap-6">
          <div className="flex flex-col gap-1 border-l-2 border-brand pl-3 md:pl-4">
            <p className="eyebrow">{config.programa}</p>
            <p className="text-[15px] md:text-lg font-bold tracking-[0.04em]">Densell White</p>
          </div>
          <h1 className="text-[34px] leading-[1.05] sm:text-6xl lg:text-[72px] font-extrabold tracking-[-0.03em]">
            {tit.slice(0, corte).join(" ")} <span className="text-brand">{tit.slice(corte).join(" ")}</span>
          </h1>
          <VisualMovil />
          <div className="hidden lg:block">{bajada}</div>

          <ul className="flex flex-wrap gap-2" aria-label="Condiciones">
            {["Para matriculados", "Envío sin cargo", "Sin compra obligatoria"].map((t) => (
              <li key={t} className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1.5 text-[13px] font-bold text-ink">
                <Check className="h-3.5 w-3.5 text-brand" /> {t}
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-2.5">
            {estado.abierto ? (
              <CtaForm lugar="hero" className="btn btn-brand w-full sm:w-auto sm:self-start !min-h-[56px] !text-base">
                Pedí tu muestra gratis <Arrow />
              </CtaForm>
            ) : (
              <p className="rounded-md border border-line bg-surface px-4 py-3 font-semibold">La inscripción está cerrada. Gracias por tu interés.</p>
            )}
            <p className="flex items-start gap-1.5 text-[13px] font-semibold text-ink">
              <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" />
              <span>Exclusivo para odontólogos matriculados de Argentina <span className="font-medium text-mute">· Hasta el {fechaCorta(config.cierre)} o hasta agotar stock</span></span>
            </p>
          </div>
          <div className="lg:hidden">{bajada}</div>
        </div>
        <div className="mx-auto hidden w-full sm:w-[72%] lg:block lg:w-full">
          <Visual />
        </div>
      </div>
    </section>
  );
}
