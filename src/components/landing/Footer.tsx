"use client";

import { WebLink, fechaLarga, useLanding, waLink } from "./shared";

export default function Footer() {
  const { config, abrirBases } = useLanding();
  return (
    <footer className="border-t border-line-dark pb-28 pt-16 text-center md:pb-14">
      <div className="mx-auto flex max-w-[1200px] flex-col items-center px-5 md:px-8">
        <img src="/img/dm-blanco.webp" alt="Dental Medrano" width={640} height={171} loading="lazy" className="h-11 w-auto" />
        <p className="mt-4 max-w-[34em] text-[15px] text-mist">Programa organizado por Dental Medrano, distribuidor de insumos odontológicos.</p>

        <div className="mt-10 grid w-full max-w-[640px] gap-8 sm:grid-cols-2">
          <div className="grid gap-1.5 text-[16px] text-sand">
            <p className="mb-1 text-[12px] font-medium uppercase tracking-[0.28em] text-pearl">Dónde estamos</p>
            <p>Professional Center</p>
            <p>Marcelo T. de Alvear 2063, CABA</p>
            <a href="https://www.google.com/maps/search/?api=1&query=Marcelo+T.+de+Alvear+2063+CABA" target="_blank" rel="noopener" className="py-1 underline-offset-2 hover:text-pearl hover:underline">Cómo llegar</a>
          </div>
          <div className="grid gap-1.5 text-[16px] text-sand">
            <p className="mb-1 text-[12px] font-medium uppercase tracking-[0.28em] text-pearl">Contacto</p>
            <a href="tel:+5491164362400" className="py-1 hover:text-pearl">11 6436-2400</a>
            <a href={waLink(config.whatsapp, config.whatsappTexto)} target="_blank" rel="noopener" className="py-1 hover:text-pearl">WhatsApp</a>
            <WebLink lugar="footer" className="py-1 hover:text-pearl">dentalmedrano.com</WebLink>
          </div>
        </div>

        <p className="mt-12 max-w-[60em] text-[14px] leading-relaxed text-mist">
          Densell White es un producto de venta exclusiva a profesionales e instituciones sanitarias. La elección del producto y del protocolo corresponde al odontólogo. Solicitudes hasta el {fechaLarga(config.cierre)} o hasta agotar stock. Una muestra por matrícula, sujeta a validación.{" "}
          <button type="button" onClick={abrirBases} className="text-pearl underline underline-offset-4">Bases y condiciones</button>
        </p>
      </div>
    </footer>
  );
}
