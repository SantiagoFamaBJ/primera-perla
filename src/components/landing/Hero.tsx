"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Arrow, Check, CtaForm, ease, fechaCorta, useLanding } from "./shared";

function Visual() {
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

  const anillo = "DENSELL WHITE · CP 10 · 16 · 22 · 35 · MUESTRA PROFESIONAL · ";

  return (
    <div ref={ref} className="relative mx-auto aspect-square w-full max-w-[540px]" style={{ perspective: 1000 }} aria-hidden="true">
      <div className="absolute inset-[14%] rounded-full bg-[radial-gradient(circle,rgba(241,89,34,.28)_0%,rgba(241,89,34,.08)_45%,transparent_70%)] blur-2xl" />
      <svg viewBox="0 0 500 500" className="absolute inset-0 h-full w-full">
        {[230, 190, 150].map((r, i) => (
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
          <path id="circ" d="M250,250 m-212,0 a212,212 0 1,1 424,0 a212,212 0 1,1 -424,0" />
        </defs>
        <text fill="rgba(0,0,0,.45)" fontSize="13" fontWeight="700" letterSpacing="4.2">
          <textPath href="#circ">{anillo + anillo}</textPath>
        </text>
      </svg>
      <motion.div className="absolute inset-[4%]" animate={{ rotate: 360 }} transition={{ duration: 14, repeat: Infinity, ease: "linear" }}>
        <span className="absolute left-1/2 top-0 -ml-1.5 h-3 w-3 rounded-full bg-brand shadow-[0_0_16px_3px_rgba(241,89,34,.55)]" />
      </motion.div>
      <motion.div style={{ rotateX: rx, rotateY: ry }} className="absolute inset-[13%]">
        <motion.div
          className="relative h-full w-full"
          initial={{ opacity: 0, rotate: -30, scale: 0.8 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          transition={{ duration: 1.1, ease, delay: 0.2 }}
        >
          <motion.div className="relative h-full w-full" animate={{ y: [0, -12, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1.4 }}>
            <img src="/img/jeringa.webp" alt="" width={633} height={627} fetchPriority="high" className="h-full w-full object-contain drop-shadow-[0_30px_35px_rgba(0,0,0,.28)]" />
            <div className="shine pointer-events-none absolute inset-0" />
          </motion.div>
        </motion.div>
      </motion.div>
      <div className="absolute right-0 top-[15%] rounded-md border border-black/10 bg-white/90 px-3.5 py-2 shadow-sm backdrop-blur">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-mute">Gel blanqueador</p>
        <p className="text-sm font-bold">Densell White</p>
      </div>
      <div className="absolute bottom-[13%] left-0 rounded-md border border-black/10 bg-white/90 px-3.5 py-2 shadow-sm backdrop-blur">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-mute">Peróxido de carbamida</p>
        <p className="text-sm font-bold">10 · 16 · 22 · 35%</p>
      </div>
    </div>
  );
}

export default function Hero() {
  const { config, estado } = useLanding();
  const tit = config.heroTitulo.trim().split(" ");
  const corte = Math.max(0, tit.length - 2);
  return (
    <section id="inicio" className="relative isolate overflow-hidden pt-24 md:pt-28 pb-14 md:pb-20">
      <div className="grid-bg absolute inset-0 -z-10" />
      <div className="mx-auto grid max-w-[1200px] items-center gap-6 px-5 md:px-8 lg:grid-cols-[1.05fr_.95fr] lg:gap-6">
        <div className="flex flex-col gap-5 md:gap-6">
          <div className="flex flex-col gap-1 border-l-2 border-brand pl-4">
            <p className="eyebrow">{config.programa}</p>
            <p className="text-base md:text-lg font-bold tracking-[0.04em]">Densell White</p>
          </div>
          <h1 className="text-[38px] leading-[1.04] sm:text-6xl lg:text-[72px] font-extrabold tracking-[-0.03em]">
            {tit.slice(0, corte).join(" ")} <span className="text-brand">{tit.slice(corte).join(" ")}</span>
          </h1>
          <p className="max-w-[34em] text-[16px] md:text-lg leading-relaxed text-soft">{config.heroBajada}</p>

          <ul className="flex flex-wrap gap-2" aria-label="Condiciones">
            {["Envío sin cargo", "Elegí 10, 16, 22 o 35%", "Sin compra obligatoria"].map((t) => (
              <li key={t} className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1.5 text-[13px] font-bold text-ink">
                <Check className="h-3.5 w-3.5 text-brand" /> {t}
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-3">
            {estado.abierto ? (
              <CtaForm lugar="hero" className="btn btn-brand w-full sm:w-auto sm:self-start !min-h-[56px] !text-base">
                Pedí tu muestra gratis <Arrow />
              </CtaForm>
            ) : (
              <p className="rounded-md border border-line bg-surface px-4 py-3 font-semibold">La inscripción está cerrada. Gracias por tu interés.</p>
            )}
            <p className="text-[13px] font-semibold text-mute">
              Exclusivo para odontólogos matriculados de Argentina · Hasta el {fechaCorta(config.cierre)} o hasta agotar stock
            </p>
          </div>
        </div>
        <div className="mx-auto w-[78%] sm:w-[62%] lg:w-full">
          <Visual />
        </div>
      </div>
    </section>
  );
}
