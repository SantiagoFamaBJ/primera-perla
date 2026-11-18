"use client";

import { useEffect, useRef } from "react";
import { fechaLarga, useLanding } from "./shared";

export default function Bases({ abierto, onClose }: { abierto: boolean; onClose: () => void }) {
  const { config } = useLanding();
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (abierto && !d.open) d.showModal();
    if (!abierto && d.open) d.close();
  }, [abierto]);

  const organiza = config.razonSocial
    ? `${config.razonSocial}${config.cuit ? ` (CUIT ${config.cuit})` : ""}`
    : "Dental Medrano";

  const puntos = [
    `Organiza ${organiza}.`,
    `Vigencia: inscripción desde la publicación hasta el ${fechaLarga(config.cierre)} a las 23:59, o hasta agotar stock, lo que ocurra primero.`,
    "Participan odontólogos con matrícula vigente en la República Argentina. Una muestra por matrícula.",
    "Jeringas Densell White de la concentración elegida, hasta agotar stock. Se asignan por orden de inscripción validada.",
    "Participar no requiere compra. La muestra no tiene costo para el profesional.",
    "El profesional se compromete a enviar su caso clínico dentro de los 60 días de recibida la muestra: foto inicial y final con guía de color, ficha breve y declaración de consentimiento del paciente.",
    "Al presentar el caso, el profesional recibe un beneficio del 20% de descuento en productos Densell White, válido durante los 7 días corridos siguientes a la presentación.",
    `Además, los participantes acceden a ${config.descuentoExtra} mayores a ${config.descuentoExtraMinimo}.`,
    "El producto es de venta exclusiva a profesionales. El tratamiento es indicado y supervisado por el odontólogo según su criterio clínico.",
    "Al participar, el profesional autoriza a Dental Medrano a publicar su caso con su nombre y matrícula, sin contraprestación adicional.",
    "Los datos personales se tratan según la Ley 25.326, solo para gestionar el programa y, si el profesional lo acepta, para enviarle novedades.",
    "Dental Medrano puede rechazar inscripciones con datos incompletos o matrícula no verificable.",
  ];

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => { if (e.target === ref.current) onClose(); }}
      aria-labelledby="bases-titulo"
      className="m-auto w-[calc(100%-32px)] max-w-[720px] rounded-xl bg-paper p-0 text-black backdrop:bg-black/75 backdrop:backdrop-blur-sm"
    >
      <div className="relative max-h-[82vh] overflow-y-auto p-7 md:p-10">
        <button type="button" onClick={onClose} aria-label="Cerrar las bases y condiciones" className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full text-2xl hover:bg-black/5">×</button>
        <p className="eyebrow">{config.programa} · Densell White</p>
        <h3 id="bases-titulo" className="mt-3 text-3xl font-extrabold tracking-tight">Bases y condiciones</h3>
        <ol className="mt-6 grid list-decimal gap-3 pl-5 text-[15px] leading-relaxed text-black/70">
          {puntos.map((p, i) => <li key={i}>{p}</li>)}
        </ol>
        <button type="button" onClick={onClose} className="btn btn-brand mt-8">Entendido</button>
      </div>
    </dialog>
  );
}
