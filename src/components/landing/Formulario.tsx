"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Estado } from "@/lib/data";
import { ESPECIALIDADES, MARCAS, PASO1, PASO2, PROVINCIAS, TIPOS_MATRICULA, VOLUMENES, validar } from "@/lib/validate";
import { leerUtm } from "./Pixel";
import { Arrow, Check as CheckIcon, External, WaIcon, WebLink, ease, fechaLarga, track, useLanding, waLink } from "./shared";

type Datos = Record<string, string | boolean>;
const INICIAL: Datos = {
  concentracion: "", nombre: "", matricula: "", whatsapp: "", email: "", acepta_datos: false,
  domicilio: "", codigo_postal: "", localidad: "", provincia: "", tipo_matricula: "", especialidad: "",
  marca_actual: "", blanqueamientos_mes: "", acepta_bases: false, acepta_publicacion: false, acepta_novedades: false,
};
const LS_OK = "pp_solicitud_ok";

function Campo({ id, label, error, opcional, hint, full, children }: { id: string; label: string; error?: string; opcional?: boolean; hint?: string; full?: boolean; children: React.ReactNode }) {
  return (
    <div className={`flex flex-col gap-1.5 ${full ? "sm:col-span-2" : ""}`}>
      <label htmlFor={id} className="text-[15px] font-medium text-pearl">
        {label} {opcional ? <span className="text-[12px] tracking-[0.08em] text-mist">(opcional)</span> : <span className="text-signature">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-[14px] text-mist">{hint}</p>}
      {error && <p id={`${id}-err`} className="text-[14px] text-danger">{error}</p>}
    </div>
  );
}

function Select({ id, value, onChange, opciones, placeholder, invalid }: { id: string; value: string; onChange: (v: string) => void; opciones: string[]; placeholder: string; invalid: boolean }) {
  return (
    <select id={id} className="field-input" value={value} onChange={(e) => onChange(e.target.value)} aria-invalid={invalid} aria-describedby={invalid ? `${id}-err` : undefined}>
      <option value="">{placeholder}</option>
      {opciones.map((o) => <option key={o}>{o}</option>)}
    </select>
  );
}

// Opciones de un toque (menos interacciones que un desplegable en el celular)
function Chips({ id, label, value, onChange, opciones, error }: { id: string; label: string; value: string; onChange: (v: string) => void; opciones: string[]; error?: string }) {
  return (
    <fieldset className="sm:col-span-2" aria-describedby={error ? `${id}-err` : undefined}>
      <legend className="mb-2 text-[15px] font-medium text-pearl">{label} <span className="text-signature">*</span></legend>
      <div className="flex flex-wrap gap-2" role="radiogroup">
        {opciones.map((o, i) => {
          const on = value === o;
          return (
            <label key={o} className={`inline-flex min-h-[44px] cursor-pointer items-center rounded-full border px-4 text-[14px] transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-champagne ${on ? "border-champagne bg-champagne/15 text-pearl" : error ? "border-danger text-sand" : "border-line-dark text-sand hover:border-[#5a534a]"}`}>
              <input id={i === 0 ? id : undefined} type="radio" name={id} value={o} checked={on} onChange={() => onChange(o)} className="sr-only" />
              {o}
            </label>
          );
        })}
      </div>
      {error && <p id={`${id}-err`} className="mt-1.5 text-[14px] text-danger">{error}</p>}
    </fieldset>
  );
}

function Casilla({ id, checked, onChange, error, children }: { id: string; checked: boolean; onChange: (v: boolean) => void; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="flex cursor-pointer gap-3 text-[15px] leading-relaxed text-sand">
        <input id={id} type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="mt-1 h-5 w-5 shrink-0 accent-[#c8b68e]" aria-invalid={Boolean(error)} />
        <span>{children}</span>
      </label>
      {error && <p className="mt-1 pl-8 text-[14px] text-danger">{error}</p>}
    </div>
  );
}

export default function Formulario({ onEstado, onSeleccion }: { onEstado: (e: Estado) => void; onSeleccion: (v: string) => void }) {
  const { config, estado, seleccion, abrirBases } = useLanding();
  const [paso, setPaso] = useState<1 | 2 | 3>(1);
  const [d, setD] = useState<Datos>(INICIAL);
  const [err, setErr] = useState<Record<string, string>>({});
  const [alerta, setAlerta] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [id, setId] = useState("");
  const [listo, setListo] = useState<{ nombre: string; concentracion: string } | null>(null);
  const bloqueo = useRef(false);
  const iniciado = useRef(false);
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // La concentración elegida en las tarjetas llega acá
  useEffect(() => { if (seleccion) setD((p) => ({ ...p, concentracion: seleccion })); }, [seleccion]);

  // Retoma: solicitud ya enviada en este navegador, o paso 2 a medio completar
  useEffect(() => {
    try {
      const ok = JSON.parse(localStorage.getItem(LS_OK) || "null");
      if (ok?.concentracion) { setListo(ok); setPaso(3); return; }
      const g = JSON.parse(sessionStorage.getItem("pp_form") || "null");
      if (g?.id && g?.datos) { setId(g.id); setD({ ...INICIAL, ...g.datos }); setPaso(2); }
    } catch {}
  }, []);

  // ViewContent cuando el formulario entra en pantalla (una vez)
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { track("ViewContent", { content_name: "Formulario muestra Densell White" }, { ga: "view_form" }); io.disconnect(); }
    }, { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const marcarInicio = () => {
    if (iniciado.current) return;
    iniciado.current = true;
    track("InicioFormulario", {}, { custom: true, ga: "form_start" });
  };

  const set = (k: string) => (v: string | boolean) => {
    marcarInicio();
    setD((p) => ({ ...p, [k]: v }));
    if (k === "concentracion") onSeleccion(String(v));
    if (err[k]) setErr((e) => { const n = { ...e }; delete n[k]; return n; });
  };
  const inp = (k: string, extra: React.InputHTMLAttributes<HTMLInputElement> = {}) => ({
    id: k, name: k, className: "field-input", value: String(d[k] ?? ""), "aria-invalid": Boolean(err[k]),
    "aria-describedby": err[k] ? `${k}-err` : undefined, onFocus: marcarInicio,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => set(k)(e.target.value), ...extra,
  });

  const subir = () => cardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  const enfocarError = (e: Record<string, string>) => {
    const primero = Object.keys(e)[0];
    setTimeout(() => (document.getElementById(primero === "concentracion" ? "conc-0" : primero) as HTMLElement | null)?.focus(), 60);
  };
  async function refrescarCupo() {
    try { const r = await fetch("/api/cupo", { cache: "no-store" }); if (r.ok) onEstado(await r.json()); } catch {}
  }

  async function enviarPaso1(ev: React.FormEvent) {
    ev.preventDefault();
    if (bloqueo.current) return;
    setAlerta("");
    const e = validar(PASO1, d);
    if (!d.acepta_datos) e.acepta_datos = "Necesitamos tu autorización para gestionar la solicitud.";
    setErr(e);
    if (Object.keys(e).length) { enfocarError(e); return; }
    bloqueo.current = true; setEnviando(true);
    try {
      const r = await fetch("/api/inscripcion", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, nombre: d.nombre, matricula: d.matricula, whatsapp: d.whatsapp, email: d.email, concentracion: d.concentracion, acepta_datos: d.acepta_datos, ...leerUtm() }),
      });
      const j = await r.json();
      if (!j.ok) {
        if (j.errores) { setErr(j.errores); enfocarError(j.errores); }
        else setAlerta(j.error || "No pudimos enviar tus datos.");
        if (j.cerrado) refrescarCupo();
        return;
      }
      setId(j.id);
      sessionStorage.setItem("pp_form", JSON.stringify({ id: j.id, datos: d }));
      if (!id) track("FormularioPaso1", { concentracion: d.concentracion }, { custom: true, ga: "form_step1_complete" });
      setPaso(2);
      subir();
    } catch {
      setAlerta("No pudimos conectarnos. Revisá tu conexión y probá de nuevo.");
    } finally { bloqueo.current = false; setEnviando(false); }
  }

  async function enviarPaso2(ev: React.FormEvent) {
    ev.preventDefault();
    if (bloqueo.current) return;
    setAlerta("");
    const e = validar(PASO2, d);
    if (!d.acepta_bases) e.acepta_bases = "Tenés que aceptar las bases y el compromiso de presentar el caso.";
    setErr(e);
    if (Object.keys(e).length) { enfocarError(e); return; }
    bloqueo.current = true; setEnviando(true);
    try {
      const r = await fetch("/api/inscripcion", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...d, id }) });
      const j = await r.json();
      if (!j.ok) {
        if (j.errores) { setErr(j.errores); enfocarError(j.errores); }
        else setAlerta(j.error || "No pudimos confirmar tu solicitud.");
        if (j.cerrado) refrescarCupo();
        return;
      }
      // Lead SOLO cuando la solicitud quedó guardada. Mismo eventID que la Conversions API.
      track("Lead", { content_name: "Muestra Densell White", content_category: String(d.concentracion) }, { eventId: j.eventId, ga: "generate_lead" });
      const ok = { nombre: String(d.nombre).trim().split(/\s+/)[0] || "", concentracion: String(d.concentracion) };
      sessionStorage.removeItem("pp_form");
      try { localStorage.setItem(LS_OK, JSON.stringify(ok)); } catch {}
      setListo(ok);
      setPaso(3);
      refrescarCupo();
      subir();
    } catch {
      setAlerta("No pudimos conectarnos. Revisá tu conexión y probá de nuevo.");
    } finally { bloqueo.current = false; setEnviando(false); }
  }

  const nuevaSolicitud = () => {
    try { localStorage.removeItem(LS_OK); sessionStorage.removeItem("pp_form"); } catch {}
    setD(INICIAL); setId(""); setListo(null); setErr({}); setPaso(1);
  };

  const nombre = String(d.nombre).trim().split(/\s+/)[0] || "";
  const cerrado = !estado.abierto && paso !== 3;
  const Nota = () => <p className="mt-4 text-center text-[14px] text-mist">Sin compra obligatoria. Una muestra por matrícula, sujeta a validación y disponibilidad.</p>;

  return (
    <section ref={sectionRef} id="formulario" className="py-24 md:py-32">
      <div className="mx-auto grid max-w-[1200px] items-start gap-12 px-5 md:px-8 lg:grid-cols-[.8fr_1.2fr] lg:gap-16">
        <aside className="order-last flex flex-col gap-6 lg:order-none lg:sticky lg:top-28">
          <p className="eyebrow">Inscripción</p>
          <h2 className="text-[46px] leading-[1.02] md:text-[76px]">
            Pedí <em className="italic text-champagne">tu muestra.</em>
          </h2>
          <hr className="rule" />
          <p className="text-[17px] text-sand md:text-[20px]">Dos pasos, menos de 2 minutos.</p>
          <ul className="grid gap-2.5 text-[16px] text-sand">
            {[
              "Para odontólogos con matrícula vigente en Argentina",
              "Una muestra por matrícula, sujeta a validación",
              config.plazoEnvio ? `Muestra sin cargo. El envío corre por tu cuenta · ${config.plazoEnvio}` : "Muestra sin cargo. El envío corre por tu cuenta",
              "Requiere presentar tu caso clínico dentro de los 60 días",
              `Hasta el ${fechaLarga(config.cierre)} o hasta agotar stock`,
            ].map((t) => (
              <li key={t} className="flex gap-3"><CheckIcon className="mt-1.5 h-3.5 w-3.5 shrink-0 text-signature" /> {t}</li>
            ))}
          </ul>
          <div className="flex items-center gap-4 rounded-2xl border border-line-dark p-4">
            <img src="/img/dm-blanco.webp" alt="Dental Medrano" width={640} height={171} className="h-8 w-auto" loading="lazy" />
            <p className="text-[14px] leading-snug text-mist">Programa organizado por <strong className="font-medium text-pearl">Dental Medrano</strong> · Professional Center, Marcelo T. de Alvear 2063, CABA</p>
          </div>
        </aside>

        <div ref={cardRef} id="form-card" className="scroll-mt-20 rounded-[22px] border border-line-dark bg-onyx-2 p-5 sm:p-8 md:rounded-[28px] md:p-11">
          {cerrado ? (
            <div className="py-10 text-center">
              <p className="font-display text-[34px]">La inscripción está cerrada.</p>
              <p className="mt-3 text-mist">Se agotó el stock o terminó el plazo. Gracias por tu interés.</p>
              <WebLink lugar="form-cerrado" className="btn btn-brand mt-8">Ir a dentalmedrano.com <External /></WebLink>
            </div>
          ) : (
            <>
              {paso !== 3 && (
                <h2 className="mb-5 text-[38px] leading-tight lg:hidden">Pedí <em className="italic text-champagne">tu muestra.</em></h2>
              )}
              {paso !== 3 && (
                <div className="mb-7" aria-label={`Paso ${paso} de 2`}>
                  <div className="flex items-center justify-between text-[11px] font-medium uppercase tracking-[0.2em]">
                    <span className={paso === 1 ? "text-champagne" : "text-mist"}>1 · Datos profesionales</span>
                    <span className={paso === 2 ? "text-champagne" : "text-mist"}>2 · Envío</span>
                  </div>
                  <div className="mt-3 h-[2px] overflow-hidden rounded-full bg-line-dark">
                    <motion.div className="h-full bg-signature" animate={{ width: paso === 1 ? "50%" : "100%" }} transition={{ duration: 0.5, ease }} />
                  </div>
                </div>
              )}

              {paso !== 3 && (
                <div className="mb-7 flex gap-3 rounded-2xl border border-champagne/35 bg-champagne/[.07] p-4">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-champagne text-[13px] font-medium text-onyx">!</span>
                  <p className="text-[15px] leading-relaxed text-sand">
                    <strong className="font-medium text-pearl">La muestra forma parte de un programa de casos clínicos.</strong> Al recibirla, te comprometés a presentar tu caso en forma privada dentro de los 60 días. Publicarlo es opcional.{" "}
                    <button type="button" onClick={abrirBases} className="text-champagne underline underline-offset-4">Ver bases</button>
                  </p>
                </div>
              )}

              {alerta && <div role="alert" className="mb-6 rounded-xl border border-danger px-4 py-3 text-[15px] text-pearl">{alerta}</div>}

              <AnimatePresence mode="wait" initial={false}>
                {paso === 1 && (
                  <motion.form key="p1" noValidate onSubmit={enviarPaso1} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                    <fieldset>
                      <legend className="mb-3 text-[15px] font-medium text-pearl">Concentración que querés probar <span className="text-signature">*</span></legend>
                      <div className={`grid gap-3 ${config.concentraciones.length >= 3 ? "grid-cols-3" : "grid-cols-2"}`} role="radiogroup">
                        {config.concentraciones.map((c, i) => {
                          const on = d.concentracion === c.valor;
                          return (
                            <label key={c.valor} className={`relative cursor-pointer rounded-2xl border px-2 py-4 text-center transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-champagne ${on ? "border-champagne bg-champagne/10" : "border-line-dark hover:border-[#5a534a]"}`}>
                              <input id={`conc-${i}`} type="radio" name="concentracion" value={c.valor} checked={on} onChange={() => { set("concentracion")(c.valor); track("SeleccionConcentracion", { concentracion: c.valor, lugar: "formulario" }, { custom: true, ga: "select_concentracion" }); }} className="sr-only" />
                              <span className="block font-display text-[42px] leading-none">{c.numero}<span className="text-[0.5em]">%</span></span>
                              <span className="mt-1.5 block text-[10px] font-medium uppercase leading-tight tracking-[0.16em] text-mist">{c.nivel}</span>
                              {on && <span className="absolute right-2 top-2 grid h-4 w-4 place-items-center rounded-full bg-champagne text-onyx"><CheckIcon className="h-2.5 w-2.5" /></span>}
                            </label>
                          );
                        })}
                      </div>
                      {err.concentracion && <p className="mt-2 text-[14px] text-danger">{err.concentracion}</p>}
                    </fieldset>

                    <div className="mt-6 grid gap-5 sm:grid-cols-2">
                      <Campo id="nombre" label="Nombre y apellido" error={err.nombre} full>
                        <input {...inp("nombre", { autoComplete: "name", enterKeyHint: "next", autoCapitalize: "words" })} />
                      </Campo>
                      <Campo id="matricula" label="Número de matrícula" error={err.matricula}>
                        <input {...inp("matricula", { inputMode: "numeric", autoComplete: "off", enterKeyHint: "next" })} />
                      </Campo>
                      <Campo id="whatsapp" label="WhatsApp" error={err.whatsapp} hint="Con código de área, sin 0 ni 15.">
                        <input {...inp("whatsapp", { type: "tel", inputMode: "tel", autoComplete: "tel-national", placeholder: "11 2345 6789", enterKeyHint: "next" })} />
                      </Campo>
                      <Campo id="email" label="Email" error={err.email} full>
                        <input {...inp("email", { type: "email", inputMode: "email", autoComplete: "email", autoCapitalize: "none", placeholder: "nombre@consultorio.com", enterKeyHint: "next" })} />
                      </Campo>
                    </div>

                    <div className="mt-6">
                      <Casilla id="acepta_datos" checked={Boolean(d.acepta_datos)} onChange={set("acepta_datos")} error={err.acepta_datos}>
                        Acepto que Dental Medrano use mis datos para gestionar esta solicitud, según la Ley 25.326. <span className="text-signature">*</span>
                      </Casilla>
                    </div>

                    <button type="submit" disabled={enviando} aria-busy={enviando} className="btn btn-brand mt-7 w-full !min-h-[58px] disabled:opacity-60">
                      {enviando ? "Guardando…" : <>Continuar <Arrow /></>}
                    </button>
                    <Nota />
                  </motion.form>
                )}

                {paso === 2 && (
                  <motion.form key="p2" noValidate onSubmit={enviarPaso2} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.25 }}>
                    <p className="mb-6 text-[16px] text-sand">
                      {nombre ? `${nombre}, ` : ""}¿a dónde te enviamos tu muestra de <strong className="font-medium text-pearl">Densell White {String(d.concentracion)}</strong>?
                      <span className="mt-1.5 block text-[14px] text-mist">El costo del envío corre por tu cuenta; lo coordinamos por WhatsApp.{config.plazoEnvio ? ` ${config.plazoEnvio}` : ""}</span>
                    </p>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Campo id="domicilio" label="Domicilio de entrega" error={err.domicilio} hint="Calle, número y, si corresponde, piso o consultorio." full>
                        <input {...inp("domicilio", { autoComplete: "street-address", enterKeyHint: "next" })} />
                      </Campo>
                      <Campo id="codigo_postal" label="Código postal" error={err.codigo_postal}>
                        <input {...inp("codigo_postal", { autoComplete: "postal-code", autoCapitalize: "characters", enterKeyHint: "next", placeholder: "1425" })} />
                      </Campo>
                      <Campo id="localidad" label="Localidad" error={err.localidad}>
                        <input {...inp("localidad", { autoComplete: "address-level2", enterKeyHint: "next" })} />
                      </Campo>
                      <Campo id="provincia" label="Provincia" error={err.provincia} full>
                        <Select id="provincia" value={String(d.provincia)} onChange={set("provincia")} opciones={PROVINCIAS} placeholder="Elegí una provincia" invalid={Boolean(err.provincia)} />
                      </Campo>
                    </div>

                    <p className="mb-5 mt-8 border-t border-line-dark pt-7 text-[12px] font-medium uppercase tracking-[0.26em] text-champagne">Sobre tu práctica</p>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Chips id="tipo_matricula" label="Tipo de matrícula" value={String(d.tipo_matricula)} onChange={set("tipo_matricula")} opciones={TIPOS_MATRICULA} error={err.tipo_matricula} />
                      <Chips id="especialidad" label="Especialidad" value={String(d.especialidad)} onChange={set("especialidad")} opciones={ESPECIALIDADES} error={err.especialidad} />
                      <Chips id="marca_actual" label="¿Qué blanqueamiento ambulatorio usás hoy?" value={String(d.marca_actual)} onChange={set("marca_actual")} opciones={MARCAS} error={err.marca_actual} />
                      <Chips id="blanqueamientos_mes" label="¿Cuántos blanqueamientos ambulatorios hacés por mes?" value={String(d.blanqueamientos_mes)} onChange={set("blanqueamientos_mes")} opciones={VOLUMENES} error={err.blanqueamientos_mes} />
                    </div>

                    <div className="mt-8 grid gap-4 border-t border-line-dark pt-7">
                      <Casilla id="acepta_bases" checked={Boolean(d.acepta_bases)} onChange={set("acepta_bases")} error={err.acepta_bases}>
                        Acepto las{" "}
                        <button type="button" onClick={(e) => { e.preventDefault(); abrirBases(); }} className="text-champagne underline underline-offset-4">bases y condiciones</button>{" "}
                        y me comprometo a presentar mi caso clínico dentro de los 60 días de recibida la muestra. <span className="text-signature">*</span>
                      </Casilla>
                      <Casilla id="acepta_publicacion" checked={Boolean(d.acepta_publicacion)} onChange={set("acepta_publicacion")}>
                        Autorizo a Dental Medrano a publicar mi caso con mi nombre, siempre que también cuente con el consentimiento del paciente. <span className="text-mist">(opcional)</span>
                      </Casilla>
                      <Casilla id="acepta_novedades" checked={Boolean(d.acepta_novedades)} onChange={set("acepta_novedades")}>
                        Quiero recibir novedades y promociones de Dental Medrano. <span className="text-mist">(opcional)</span>
                      </Casilla>
                    </div>

                    <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row">
                      <button type="button" onClick={() => { setPaso(1); setErr({}); setAlerta(""); }} className="btn btn-ghost">Volver</button>
                      <button type="submit" disabled={enviando} aria-busy={enviando} className="btn btn-brand flex-1 !min-h-[58px] disabled:opacity-60">
                        {enviando ? "Enviando solicitud…" : <>Pedí tu muestra gratis <Arrow /></>}
                      </button>
                    </div>
                    <Nota />
                  </motion.form>
                )}

                {paso === 3 && listo && (
                  <motion.div key="ok" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, ease }} role="status">
                    <div className="text-center">
                      <svg viewBox="0 0 80 80" className="mx-auto h-16 w-16" aria-hidden="true">
                        <motion.circle cx="40" cy="40" r="36" fill="none" stroke="#c8b68e" strokeWidth="3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.7, ease }} />
                        <motion.path d="M25 41l10 10 20-22" fill="none" stroke="#f4f0e8" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4, delay: 0.5 }} />
                      </svg>
                      <h3 className="mt-5 text-[40px] leading-tight md:text-[46px]">Gracias{listo.nombre ? `, ${listo.nombre}` : ""}.</h3>
                      <p className="mt-2 text-sand">Recibimos tu solicitud.</p>
                    </div>
                    <div className="mx-auto mt-6 max-w-[34em] rounded-2xl border border-line-dark p-5">
                      <p className="eyebrow">Resumen</p>
                      <p className="mt-2 font-display text-[26px]">Muestra Densell White {listo.concentracion}</p>
                      <ul className="mt-3 grid gap-2 text-[15px] text-sand">
                        <li className="flex gap-2.5"><CheckIcon className="mt-1.5 h-3.5 w-3.5 shrink-0 text-signature" /> Vamos a verificar tu matrícula.</li>
                        <li className="flex gap-2.5"><CheckIcon className="mt-1.5 h-3.5 w-3.5 shrink-0 text-signature" /> La entrega está sujeta a validación y disponibilidad.</li>
                        <li className="flex gap-2.5"><CheckIcon className="mt-1.5 h-3.5 w-3.5 shrink-0 text-signature" /> Te escribimos por WhatsApp para coordinar el envío, que corre por tu cuenta.</li>
                      </ul>
                    </div>

                    <div className="mt-8 border-t border-line-dark pt-6">
                      <p className="text-center text-[16px] text-pearl">Mientras tanto, conocé toda la línea Densell White</p>
                      {config.productos.length > 0 && (
                        <div className={`mt-4 grid gap-2.5 ${config.productos.length >= 3 ? "grid-cols-3" : "grid-cols-2"}`}>
                          {config.productos.slice(0, 3).map((p) => (
                            <WebLink key={p.nombre} lugar="exito-producto" href={p.link} className="group overflow-hidden rounded-2xl border border-line-dark bg-pearl text-onyx transition-colors hover:border-champagne">
                              <div className="aspect-square overflow-hidden bg-white">
                                {p.imagen && <img src={p.imagen} alt={p.nombre} className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105" loading="lazy" />}
                              </div>
                              <p className="px-3 py-2.5 text-[13px] font-medium leading-snug">{p.nombre}</p>
                            </WebLink>
                          ))}
                        </div>
                      )}
                      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                        <WebLink lugar="exito" className="btn btn-brand flex-1">Ir a dentalmedrano.com <External /></WebLink>
                        <a href={waLink(config.whatsapp, config.whatsappTexto)} target="_blank" rel="noopener" className="btn btn-ghost"><WaIcon className="h-5 w-5" /> Consultar</a>
                      </div>
                      <p className="mt-6 text-center">
                        <button type="button" onClick={nuevaSolicitud} className="text-[14px] text-mist underline underline-offset-4 hover:text-pearl">
                          Hacer una solicitud para otra matrícula
                        </button>
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
