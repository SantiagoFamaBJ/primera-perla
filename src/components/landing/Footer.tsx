"use client";

import { WebLink, fechaLarga, useLanding, waLink } from "./shared";

export default function Footer() {
  const { config, abrirBases } = useLanding();
  return (
    <footer className="bg-ink pb-28 pt-14 text-center text-white md:pb-14">
      <div className="mx-auto flex max-w-[1200px] flex-col items-center px-5 md:px-8">
        <img src="/img/dm-blanco.webp" alt="Dental Medrano" width={640} height={171} loading="lazy" className="h-11 w-auto" />
        <p className="mt-4 max-w-[34em] text-[14px] text-white/70">Programa organizado por Dental Medrano, distribuidor de insumos odontológicos.</p>

        <div className="mt-10 grid w-full max-w-[640px] gap-8 sm:grid-cols-2">
          <div className="grid gap-1.5 text-[15px] text-white/80">
            <p className="mb-1 text-xs font-bold uppercase tracking-[0.22em] text-white">Professional Center</p>
            <p>Marcelo T. de Alvear 2063, CABA</p>
            <a href="https://www.google.com/maps/search/?api=1&query=Marcelo+T.+de+Alvear+2063+CABA" target="_blank" rel="noopener" className="underline-offset-2 hover:text-white hover:underline">Cómo llegar</a>
          </div>
          <div className="grid gap-1.5 text-[15px] text-white/80">
            <p className="mb-1 text-xs font-bold uppercase tracking-[0.22em] text-white">Contacto</p>
            <a href="tel:+5491164362400" className="hover:text-white">11 6436-2400</a>
            <a href={waLink(config.whatsapp, config.whatsappTexto)} target="_blank" rel="noopener" className="hover:text-white">WhatsApp</a>
            <WebLink lugar="footer" className="hover:text-white">dentalmedrano.com</WebLink>
          </div>
        </div>

        <p className="mt-10 max-w-[60em] text-[13px] leading-relaxed text-white/60">
          Densell White es un producto de venta exclusiva a profesionales e instituciones sanitarias. La elección del producto y del protocolo corresponde al odontólogo. Solicitudes hasta el {fechaLarga(config.cierre)} o hasta agotar stock. Una muestra por matrícula, sujeta a validación.{" "}
          <button type="button" onClick={abrirBases} className="font-semibold text-white underline underline-offset-2">Bases y condiciones</button>
        </p>
      </div>
    </footer>
  );
}
