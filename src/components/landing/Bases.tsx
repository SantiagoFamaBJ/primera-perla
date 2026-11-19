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

  const organiza = config.razonSocial ? `${config.razonSocial}${config.cuit ? ` (CUIT ${config.cuit})` : ""}` : "Dental Medrano";

  const puntos = [
    `Organiza ${organiza} ("Dental Medrano").`,
    `Vigencia: solicitudes desde la publicación hasta el ${fechaLarga(config.cierre)} a las 23:59, o hasta agotar stock, lo que ocurra primero.`,
    "Participan odontólogos con matrícula vigente en la República Argentina. Una muestra por matrícula. Dental Medrano verifica la matrícula antes del envío.",
    "La muestra es una jeringa Densell White de 2 ml de la concentración elegida (10, 16, 22 o 35% de peróxido de carbamida), sujeta a validación y disponibilidad de stock. Se asignan por orden de solicitud validada.",
    "Participar no requiere compra. La muestra y su envío no tienen costo para el profesional. El envío se realiza al domicilio indicado en la solicitud.",
    "Una jeringa de 2 ml puede no alcanzar para completar un tratamiento. La muestra no garantiza un resultado clínico específico. La indicación, el protocolo y la supervisión del tratamiento corresponden al odontólogo según su criterio profesional.",
    "Al solicitar la muestra, el profesional se compromete a presentar su caso clínico dentro de los 60 días de recibida: foto inicial y final con guía de color, con iluminación y encuadre comparables; datos breves de la concentración usada, la duración y sus observaciones; y la confirmación de que cuenta con el consentimiento del paciente para documentar el caso. El caso se presenta en forma privada a Dental Medrano y no debe incluir nombre ni otros datos identificatorios del paciente que no sean necesarios.",
    "Participar y presentar el caso no implica autorizar su publicación. Dental Medrano solo puede publicar un caso, con el nombre y la matrícula del profesional, si este lo autoriza en forma específica y opcional, y si cuenta además con el consentimiento del paciente. La publicación se realiza preservando la identidad y privacidad del paciente. No otorgar esta autorización no afecta la participación ni el beneficio del 20%.",
    "Al presentar el caso conforme a estas bases, el profesional recibe por WhatsApp un cupón de 20% de descuento en productos Densell White, válido durante 30 días corridos desde su entrega. El cupón no se entrega al completar la solicitud.",
    ...(config.mostrarDescuentoExtra ? [`Además, los participantes acceden a ${config.descuentoExtra} mayores a ${config.descuentoExtraMinimo}.`] : []),
    "Los datos personales se tratan según la Ley 25.326 de Protección de Datos Personales, solo para gestionar la solicitud y el programa. El envío de novedades comerciales requiere un consentimiento separado y opcional. No se comparten datos clínicos ni imágenes de pacientes con herramientas publicitarias.",
    "Dental Medrano puede rechazar solicitudes con datos incompletos, matrícula no verificable o que no cumplan estas bases.",
  ];

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => { if (e.target === ref.current) onClose(); }}
      aria-labelledby="bases-titulo"
      className="m-auto w-[calc(100%-24px)] max-w-[720px] rounded-xl bg-white p-0 text-ink backdrop:bg-black/60"
    >
      <div className="relative max-h-[85vh] overflow-y-auto p-6 md:p-10">
        <button type="button" onClick={onClose} aria-label="Cerrar las bases y condiciones" className="absolute right-3 top-3 grid h-11 w-11 place-items-center rounded-full text-2xl hover:bg-surface">×</button>
        <p className="eyebrow">{config.programa} · Densell White</p>
        <h3 id="bases-titulo" className="mt-3 text-3xl font-extrabold tracking-tight">Bases y condiciones</h3>
        <ol className="mt-6 grid list-decimal gap-3 pl-5 text-[15px] leading-relaxed text-soft">
          {puntos.map((p, i) => <li key={i}>{p}</li>)}
        </ol>
        <button type="button" onClick={onClose} className="btn btn-brand mt-8">Entendido</button>
      </div>
    </dialog>
  );
}
