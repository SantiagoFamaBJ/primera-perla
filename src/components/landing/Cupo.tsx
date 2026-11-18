"use client";

import { animate, motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { fechaCorta, useLanding } from "./shared";

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
  const pct = estado.cupo ? (estado.restantes / estado.cupo) * 100 : 0;
  const pocas = estado.restantes > 0 && estado.restantes <= Math.ceil(estado.cupo * 0.25);

  if (!estado.abierto) {
    return (
      <div className={`rounded-md border px-5 py-4 ${claro ? "border-black/15" : "border-line bg-surface"}`}>
        <p className="font-bold">Inscripción cerrada</p>
        <p className={`text-sm mt-1 ${claro ? "text-black/60" : "text-mute"}`}>
          {estado.motivo === "cupo" ? "Se completaron todas las jeringas." : "Terminó el plazo de inscripción."}
        </p>
      </div>
    );
  }

  return (
    <div className={`rounded-md border px-5 py-4 ${claro ? "border-black/15 bg-white/60" : "border-line bg-surface/80 backdrop-blur"}`}>
      <div className="flex items-center justify-between gap-4">
        <p className="text-[15px] font-semibold">
          Quedan <Contador valor={estado.restantes} className="text-brand text-xl font-extrabold" /> de {estado.cupo} jeringas
        </p>
        <span className={`flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] ${claro ? "text-black/60" : "text-mute"}`}>
          <span className="pulse-dot inline-block h-2 w-2 rounded-full bg-brand" /> En vivo
        </span>
      </div>
      <div className={`mt-3 h-1.5 overflow-hidden rounded-full ${claro ? "bg-black/10" : "bg-white/10"}`}>
        <motion.div
          className="h-full rounded-full bg-brand"
          initial={{ width: "100%" }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, ease: [0.2, 0.7, 0.1, 1], delay: 0.2 }}
        />
      </div>
      <p className={`mt-2 text-xs ${claro ? "text-black/60" : "text-mute"}`}>
        {pocas ? "Últimas jeringas · " : ""}Inscripción hasta el {fechaCorta(config.cierre)} o hasta agotar el cupo.
      </p>
    </div>
  );
}
