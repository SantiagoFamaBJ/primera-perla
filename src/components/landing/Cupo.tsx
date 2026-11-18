"use client";

import { animate, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { fechaLarga, useLanding } from "./shared";

export function Contador({ valor, className }: { valor: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const visto = useInView(ref, { once: true });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!visto) return;
    const c = animate(n, valor, { duration: 1.4, ease: [0.2, 0.7, 0.1, 1], onUpdate: (v) => setN(Math.round(v)) });
    return () => c.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visto, valor]);
  return <span ref={ref} className={className} style={{ fontVariantNumeric: "tabular-nums" }}>{n}</span>;
}

export default function Cupo({ claro = false }: { claro?: boolean }) {
  const { estado, config } = useLanding();

  if (!estado.abierto) {
    return (
      <div className={`rounded-md border px-5 py-4 ${claro ? "border-black/15" : "border-line bg-surface"}`}>
        <p className="font-bold">Inscripción cerrada</p>
        <p className={`text-sm mt-1 ${claro ? "text-black/60" : "text-mute"}`}>
          {estado.motivo === "cupo" ? "Se agotó el stock disponible para el programa." : "Terminó el plazo de inscripción."}
        </p>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-4 rounded-md border px-5 py-4 ${claro ? "border-black/15 bg-white/60" : "border-line bg-surface/80 backdrop-blur"}`}>
      <span className="pulse-dot inline-block h-2.5 w-2.5 shrink-0 rounded-full bg-brand" />
      <div>
        <p className="text-[15px] font-bold">Inscripción abierta hasta agotar stock</p>
        <p className={`mt-0.5 text-[13px] ${claro ? "text-black/60" : "text-mute"}`}>Cierra el {fechaLarga(config.cierre)} como máximo.</p>
      </div>
    </div>
  );
}
