"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import Cupo from "./Cupo";
import { Arrow, External, WebLink, ease, useLanding } from "./shared";

function Titulo({ texto }: { texto: string }) {
  const palabras = texto.split(" ");
  const ultima = palabras.length - 1;
  return (
    <h1 className="text-[40px] leading-[1.04] sm:text-6xl lg:text-[76px] font-extrabold tracking-[-0.03em]" aria-label={texto}>
      {palabras.map((p, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom pb-[0.08em]" aria-hidden="true">
          <motion.span
            className={`inline-block ${i >= ultima - 1 ? "text-brand" : ""}`}
            initial={{ y: "110%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.9, ease, delay: 0.25 + i * 0.06 }}
          >
            {p}
            {i < ultima ? " " : ""}
          </motion.span>
        </span>
      ))}
    </h1>
  );
}

function Visual() {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18 });
  const sy = useSpring(my, { stiffness: 60, damping: 18 });
  const rx = useTransform(sy, (v) => v * -8);
  const ry = useTransform(sx, (v) => v * 10);
  const gx = useTransform(sx, (v) => v * 40);
  const gy = useTransform(sy, (v) => v * 40);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const rot = useTransform(scrollYProgress, [0, 1], [0, 18]);
  const lift = useTransform(scrollYProgress, [0, 1], [0, -80]);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const f = (e: PointerEvent) => {
      mx.set(e.clientX / window.innerWidth - 0.5);
      my.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("pointermove", f, { passive: true });
    return () => window.removeEventListener("pointermove", f);
  }, [mx, my]);

  const anillo = "DENSELL WHITE · PRIMERA PERLA · CP 10 · 16 · 22 · MUESTRA PROFESIONAL · ";

  return (
    <div ref={ref} className="relative mx-auto aspect-square w-full max-w-[560px]" style={{ perspective: 1000 }} aria-hidden="true">
      {/* Brillo naranja */}
      <motion.div
        style={{ x: gx, y: gy }}
        className="absolute inset-[12%] rounded-full bg-[radial-gradient(circle,rgba(241,89,34,.55)_0%,rgba(241,89,34,.12)_45%,transparent_70%)] blur-2xl"
        animate={{ scale: [1, 1.08, 1], opacity: [0.85, 1, 0.85] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Anillos que se dibujan */}
      <svg viewBox="0 0 500 500" className="absolute inset-0 h-full w-full">
        {[230, 190, 150].map((r, i) => (
          <motion.circle
            key={r}
            cx="250" cy="250" r={r}
            fill="none"
            stroke={i === 0 ? "rgba(241,89,34,.7)" : "rgba(255,255,255,.14)"}
            strokeWidth={i === 0 ? 1.5 : 1}
            strokeDasharray={i === 1 ? "2 8" : undefined}
            initial={{ pathLength: 0, rotate: -90 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2.2, ease: [0.4, 0, 0.2, 1], delay: 0.3 + i * 0.2 }}
            style={{ originX: "50%", originY: "50%" }}
          />
        ))}
      </svg>
      {/* Texto circular girando */}
      <svg viewBox="0 0 500 500" className="spin-slow absolute inset-0 h-full w-full">
        <defs>
          <path id="circ" d="M250,250 m-212,0 a212,212 0 1,1 424,0 a212,212 0 1,1 -424,0" />
        </defs>
        <text fill="rgba(255,255,255,.55)" fontSize="13" fontWeight="700" letterSpacing="4.2">
          <textPath href="#circ">{anillo + anillo}</textPath>
        </text>
      </svg>
      {/* Punto naranja orbitando */}
      <motion.div className="absolute inset-[4%]" animate={{ rotate: 360 }} transition={{ duration: 14, repeat: Infinity, ease: "linear" }}>
        <span className="absolute left-1/2 top-0 -ml-1.5 h-3 w-3 rounded-full bg-brand shadow-[0_0_20px_4px_rgba(241,89,34,.7)]" />
      </motion.div>
      {/* Jeringa */}
      <motion.div style={{ rotate: rot, y: lift }} className="absolute inset-[13%]">
        <motion.div style={{ rotateX: rx, rotateY: ry }} className="h-full w-full">
          <motion.div
            className="relative h-full w-full"
            initial={{ opacity: 0, rotate: -35, scale: 0.7, x: -60 }}
            animate={{ opacity: 1, rotate: 0, scale: 1, x: 0 }}
            transition={{ duration: 1.4, ease, delay: 0.4 }}
          >
            <motion.div className="relative h-full w-full" animate={{ y: [0, -14, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1.8 }}>
              <img src="/img/jeringa.png" alt="" className="h-full w-full object-contain drop-shadow-[0_40px_50px_rgba(0,0,0,.7)]" />
              <div className="shine pointer-events-none absolute inset-0" />
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
      {/* Etiquetas flotantes */}
      <motion.div
        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.6, duration: 0.8, ease }}
        className="absolute right-0 top-[16%] rounded-md border border-white/15 bg-black/60 px-3.5 py-2 backdrop-blur"
      >
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-mute">Jeringa</p>
        <p className="text-sm font-bold">2 ml · Sin cargo</p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.8, duration: 0.8, ease }}
        className="absolute bottom-[14%] left-0 rounded-md border border-white/15 bg-black/60 px-3.5 py-2 backdrop-blur"
      >
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-mute">Peróxido de carbamida</p>
        <p className="text-sm font-bold">10 · 16 · 22%</p>
      </motion.div>
    </div>
  );
}

export default function Hero() {
  const { config, estado } = useLanding();
  return (
    <section id="inicio" className="relative isolate overflow-hidden pt-24 md:pt-28 pb-16 md:pb-24">
      <div className="grid-bg absolute inset-0 -z-10" />
      <div className="mx-auto grid max-w-[1200px] items-center gap-8 px-5 md:px-8 lg:grid-cols-[1.05fr_.95fr] lg:gap-6">
        <div className="flex flex-col gap-6 md:gap-7">
          <motion.p className="eyebrow" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
            Programa Primera Perla · Densell White
          </motion.p>
          <Titulo texto={config.heroTitulo} />
          <motion.p
            className="max-w-[34em] text-[17px] md:text-lg leading-relaxed text-soft"
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease, delay: 0.75 }}
          >
            {config.heroBajada}
          </motion.p>
          <motion.div className="flex flex-col sm:flex-row gap-3" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease, delay: 0.9 }}>
            {estado.abierto ? (
              <a href="#formulario" className="btn btn-brand">Pedí tu jeringa gratis <Arrow /></a>
            ) : null}
            <WebLink lugar="hero" className="btn btn-ghost">Conocé la línea completa <External /></WebLink>
          </motion.div>
          <motion.div className="max-w-[460px]" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease, delay: 1.05 }}>
            <Cupo />
          </motion.div>
        </div>
        <div>
          <div className="mx-auto w-[86%] sm:w-[70%] lg:w-full">
            <Visual />
          </div>
        </div>
      </div>
    </section>
  );
}
