"use client";

import { WebLink, fechaCorta, useLanding, waLink } from "./shared";

export default function Footer() {
  const { config, abrirBases } = useLanding();
  return (
    <footer className="border-t border-line bg-black pb-28 pt-16 md:pb-14">
      <div className="mx-auto grid max-w-[1200px] gap-10 px-5 md:grid-cols-[1.2fr_1fr_1fr] md:px-8">
        <img src="/img/dm-blanco.png" alt="Dental Medrano" className="h-11 w-auto self-start" />
        <div className="grid gap-1.5 text-[15px] text-soft">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-white">Professional Center</p>
          <p>Marcelo T. de Alvear 2063, CABA</p>
          <a href="https://www.google.com/maps/search/?api=1&query=Marcelo+T.+de+Alvear+2063+CABA" target="_blank" rel="noopener" className="hover:text-white">Cómo llegar</a>
        </div>
        <div className="grid gap-1.5 text-[15px] text-soft">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-white">Contacto</p>
          <a href="tel:+5491164362400" className="hover:text-white">11 6436-2400</a>
          <a href={waLink(config.whatsapp, config.whatsappTexto)} target="_blank" rel="noopener" className="hover:text-white">WhatsApp</a>
          <WebLink lugar="footer" className="hover:text-white">Web de Densell White</WebLink>
          <a href="https://dentalmedrano.com" target="_blank" rel="noopener" className="hover:text-white">dentalmedrano.com</a>
        </div>
      </div>
      <div className="mx-auto mt-12 max-w-[1200px] px-5 md:px-8">
        <p className="max-w-[60em] text-[13px] leading-relaxed text-mute">
          Densell White es un producto de venta exclusiva a profesionales e instituciones sanitarias. La elección del producto y del protocolo corresponde al odontólogo. Programa Primera Perla: cupo de {config.cupo} jeringas, inscripción hasta el {fechaCorta(config.cierre)} o hasta agotar el cupo.{" "}
          <button type="button" onClick={abrirBases} className="underline underline-offset-2 hover:text-white">Bases y condiciones</button>
        </p>
      </div>
    </footer>
  );
}
