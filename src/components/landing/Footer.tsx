"use client";

import { WebLink, fechaCorta, useLanding, waLink } from "./shared";

export default function Footer() {
  const { config, abrirBases } = useLanding();
  return (
    <footer className="border-t border-line bg-black pb-28 pt-16 text-center md:pb-14">
      <div className="mx-auto flex max-w-[1200px] flex-col items-center px-5 md:px-8">
        <img src="/img/dm-blanco.png" alt="Dental Medrano" className="h-12 w-auto" />

        <div className="mt-10 grid w-full max-w-[640px] gap-10 sm:grid-cols-2">
          <div className="grid gap-1.5 text-[15px] text-soft">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-white">Professional Center</p>
            <p>Marcelo T. de Alvear 2063, CABA</p>
            <a href="https://www.google.com/maps/search/?api=1&query=Marcelo+T.+de+Alvear+2063+CABA" target="_blank" rel="noopener" className="hover:text-white">Cómo llegar</a>
          </div>
          <div className="grid gap-1.5 text-[15px] text-soft">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-white">Contacto</p>
            <a href="tel:+5491164362400" className="hover:text-white">11 6436-2400</a>
            <a href={waLink(config.whatsapp, config.whatsappTexto)} target="_blank" rel="noopener" className="hover:text-white">WhatsApp</a>
            <WebLink lugar="footer" className="hover:text-white">dentalmedrano.com</WebLink>
          </div>
        </div>

        <p className="mt-12 max-w-[60em] text-[13px] leading-relaxed text-mute">
          Densell White es un producto de venta exclusiva a profesionales e instituciones sanitarias. La elección del producto y del protocolo corresponde al odontólogo. Inscripción hasta el {fechaCorta(config.cierre)} o hasta agotar stock.{" "}
          <button type="button" onClick={abrirBases} className="underline underline-offset-2 hover:text-white">Bases y condiciones</button>
        </p>
      </div>
    </footer>
  );
}
