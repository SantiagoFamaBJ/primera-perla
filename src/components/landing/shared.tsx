"use client";

import { createContext, useContext } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import type { Config } from "@/lib/types";
import type { Estado } from "@/lib/data";

type Ctx = {
  config: Config;
  estado: Estado;
  seleccion: string;
  elegir: (valor: string) => void;
  abrirBases: () => void;
};
export const LandingCtx = createContext<Ctx | null>(null);
export const useLanding = () => {
  const c = useContext(LandingCtx);
  if (!c) throw new Error("LandingCtx");
  return c;
};

declare global {
  interface Window { fbq?: (...args: unknown[]) => void }
}
export function track(evento: string, datos?: Record<string, unknown>, custom = false) {
  if (typeof window === "undefined" || !window.fbq) return;
  window.fbq(custom ? "trackCustom" : "track", evento, datos ?? {});
}

export const ease = [0.2, 0.7, 0.1, 1] as const;

export function Reveal({ delay = 0, y = 28, ...props }: HTMLMotionProps<"div"> & { delay?: number; y?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, ease, delay }}
      {...props}
    />
  );
}

export const Arrow = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 16 16" className={className} aria-hidden="true">
    <path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

export const External = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 16 16" className={className} aria-hidden="true">
    <path d="M6 3H3v10h10v-3M9 3h4v4M13 3 7 9" fill="none" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);

export const WaIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
    <path d="M17.5 14.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.4-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.6-.4zM12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.5 1.3 5L2 22l5.1-1.3c1.5.8 3.1 1.2 4.9 1.2 5.5 0 10-4.5 10-10S17.5 2 12 2zm0 18.2c-1.6 0-3.2-.4-4.5-1.2l-.3-.2-3 .8.8-3-.2-.3C4 15 3.6 13.5 3.6 12c0-4.6 3.8-8.4 8.4-8.4s8.4 3.8 8.4 8.4-3.8 8.2-8.4 8.2z" />
  </svg>
);

/** Link a la web de Densell White con UTM para medir de qué parte de la landing vino. */
export function WebLink({ lugar, href, className, children }: { lugar: string; href?: string; className?: string; children: React.ReactNode }) {
  const { config } = useLanding();
  const base = href || config.webUrl;
  let url = base;
  try {
    const u = new URL(base);
    u.searchParams.set("utm_source", "landing-muestra-densell-white");
    u.searchParams.set("utm_medium", "landing");
    u.searchParams.set("utm_content", lugar);
    url = u.toString();
  } catch {}
  return (
    <a href={url} target="_blank" rel="noopener" className={className} onClick={() => track("IrALaWeb", { lugar }, true)}>
      {children}
    </a>
  );
}

export function waLink(numero: string, texto: string) {
  return `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`;
}

export function fechaCorta(iso: string) {
  return new Date(iso).toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", timeZone: "America/Buenos_Aires" });
}
export function fechaLarga(iso: string) {
  return new Date(iso).toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric", timeZone: "America/Buenos_Aires" });
}
