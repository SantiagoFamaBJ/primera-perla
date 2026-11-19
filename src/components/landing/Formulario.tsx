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
      <label htmlFor={id} className="text-[14px] font-bold">
        {label} {opcional ? <span className="font-medium text-mute">(opcional)</span> : <span className="text-brand">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-[13px] text-mute">{hint}</p>}
      {error && <p id={`${id}-err`} className="text-[13px] font-semibold text-danger">{error}</p>}
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

function Casilla({ id, checked, onChange, error, children }: { id: string; checked: boolean; onChange: (v: boolean) => void; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="flex cursor-pointer gap-3 text-[14px] leading-relaxed text-soft">
        <input id={id} type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="mt-0.5 h-5 w-5 shrink-0 accent-[#f15922]" aria-invalid={Boolean(error)} />
        <span>{children}</span>
      </label>
      {error && <p className="mt-1 pl-8 text-[13px] font-semibold text-danger">{error}</p>}
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
  const Nota = () => <p className="mt-3 text-center text-[13px] text-mute">Sin compra obligatoria. Una muestra por matrícula, sujeta a validación y disponibilidad.</p>;

  return (
    <section ref={sectionRef} id="formulario" className="bg-surface py-20 md:py-28">
      <div className="mx-auto grid max-w-[1200px] items-start gap-10 px-5 md:px-8 lg:grid-cols-[.8fr_1.2fr] lg:gap-14">
        <aside className="flex flex-col gap-5 lg:sticky lg:top-28">
          <p className="eyebrow">Solicitud</p>
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-[-0.03em] leading-[1.02]">
            Pedí tu <span className="text-brand">muestra gratis.</span>
          </h2>
          <p className="text-[16px] md:text-lg text-soft">Dos pasos, menos de 2 minutos.</p>
          <ul className="grid gap-2.5 text-[15px] text-ink">
            {[
              "Para odontólogos con matrícula vigente en Argentina",
              "Una muestra por matrícula, sujeta a validación",
              "Envío sin cargo",
              `Hasta el ${fechaLarga(config.cierre)} o hasta agotar stock`,
            ].map((t) => (
              <li key={t} className="flex gap-3"><CheckIcon className="mt-1 h-4 w-4 shrink-0 text-brand" /> {t}</li>
            ))}
          </ul>
          <div className="flex items-center gap-4 rounded-lg border border-line bg-white p-4">
            <img src="/img/dm-color.webp" alt="Dental Medrano" width={640} height={171} className="h-8 w-auto" loading="lazy" />
            <p className="text-[13px] leading-snug text-soft">Programa organizado por <strong className="text-ink">Dental Medrano</strong> · Professional Center, Marcelo T. de Alvear 2063, CABA</p>
          </div>
        </aside>

        <div ref={cardRef} className="scroll-mt-24 rounded-xl border border-line bg-white p-5 shadow-[0_20px_60px_-30px_rgba(0,0,0,.25)] sm:p-8 md:p-10">
          {cerrado ? (
            <div className="py-10 text-center">
              <p className="text-3xl font-bold">La inscripción está cerrada.</p>
              <p className="mt-3 text-soft">Se agotó el stock o terminó el plazo. Gracias por tu interés.</p>
              <WebLink lugar="form-cerrado" className="btn btn-brand mt-8">Ir a dentalmedrano.com <External /></WebLink>
            </div>
          ) : (
            <>
              {paso !== 3 && (
                <div className="mb-7" aria-label={`Paso ${paso} de 2`}>
                  <div className="flex items-center justify-between text-[13px] font-bold">
                    <span className={paso === 1 ? "text-ink" : "text-mute"}>1. Datos profesionales</span>
                    <span className={paso === 2 ? "text-ink" : "text-mute"}>2. Datos para el envío</span>
                  </div>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface-2">
                    <motion.div className="h-full bg-brand" animate={{ width: paso === 1 ? "50%" : "100%" }} transition={{ duration: 0.5, ease }} />
                  </div>
                </div>
              )}

              {alerta && <div role="alert" className="mb-6 rounded-md border border-danger/40 bg-[#fff3f0] px-4 py-3 text-[15px] text-ink">{alerta}</div>}

              <AnimatePresence mode="wait" initial={false}>
                {paso === 1 && (
                  <motion.form key="p1" noValidate onSubmit={enviarPaso1} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                    <fieldset>
                      <legend className="mb-3 text-[14px] font-bold">Concentración que querés probar <span className="text-brand">*</span></legend>
                      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4" role="radiogroup">
                        {config.concentraciones.map((c, i) => {
                          const on = d.concentracion === c.valor;
                          return (
                            <label key={c.valor} className={`relative cursor-pointer rounded-md border px-2 py-3.5 text-center transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand ${on ? "border-brand bg-brand-50" : "border-[#cfccc6] hover:border-ink"}`}>
                              <input id={`conc-${i}`} type="radio" name="concentracion" value={c.valor} checked={on} onChange={() => { set("concentracion")(c.valor); track("SeleccionConcentracion", { concentracion: c.valor, lugar: "formulario" }, { custom: true, ga: "select_concentracion" }); }} className="sr-only" />
                              <span className="block text-3xl font-extrabold tracking-tight">{c.numero}<span className="text-lg text-brand">%</span></span>
                              <span className="mt-1 block text-[10px] font-bold uppercase leading-tight tracking-[0.1em] text-mute">{c.nivel}</span>
                              {on && <span className="absolute right-2 top-2 grid h-4 w-4 place-items-center rounded-full bg-brand text-white"><CheckIcon className="h-2.5 w-2.5" /></span>}
                            </label>
                          );
                        })}
                      </div>
                      {err.concentracion && <p className="mt-2 text-[13px] font-semibold text-danger">{err.concentracion}</p>}
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
                        Acepto que Dental Medrano use mis datos para gestionar esta solicitud, según la Ley 25.326. <span className="text-brand">*</span>
                      </Casilla>
                    </div>

                    <button type="submit" disabled={enviando} aria-busy={enviando} className="btn btn-brand mt-7 w-full !min-h-[58px] !text-base disabled:opacity-60">
                      {enviando ? "Guardando…" : <>Continuar <Arrow /></>}
                    </button>
                    <Nota />
                  </motion.form>
                )}

                {paso === 2 && (
                  <motion.form key="p2" noValidate onSubmit={enviarPaso2} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.25 }}>
                    <p className="mb-5 text-[15px] text-soft">
                      {nombre ? `${nombre}, ` : ""}¿a dónde te enviamos tu muestra de <strong className="text-ink">Densell White {String(d.concentracion)}</strong>?
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

                    <p className="mb-4 mt-7 border-t border-line pt-6 text-[13px] font-extrabold uppercase tracking-[0.14em] text-mute">Sobre tu práctica</p>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Campo id="tipo_matricula" label="Tipo de matrícula" error={err.tipo_matricula}>
                        <Select id="tipo_matricula" value={String(d.tipo_matricula)} onChange={set("tipo_matricula")} opciones={TIPOS_MATRICULA} placeholder="Elegí una opción" invalid={Boolean(err.tipo_matricula)} />
                      </Campo>
                      <Campo id="especialidad" label="Especialidad" error={err.especialidad}>
                        <Select id="especialidad" value={String(d.especialidad)} onChange={set("especialidad")} opciones={ESPECIALIDADES} placeholder="Elegí una opción" invalid={Boolean(err.especialidad)} />
                      </Campo>
                      <Campo id="marca_actual" label="¿Qué blanqueamiento ambulatorio usás hoy?" error={err.marca_actual} full>
                        <Select id="marca_actual" value={String(d.marca_actual)} onChange={set("marca_actual")} opciones={MARCAS} placeholder="Elegí una opción" invalid={Boolean(err.marca_actual)} />
                      </Campo>
                      <Campo id="blanqueamientos_mes" label="¿Cuántos blanqueamientos ambulatorios hacés por mes?" error={err.blanqueamientos_mes} full>
                        <Select id="blanqueamientos_mes" value={String(d.blanqueamientos_mes)} onChange={set("blanqueamientos_mes")} opciones={VOLUMENES} placeholder="Elegí una opción" invalid={Boolean(err.blanqueamientos_mes)} />
                      </Campo>
                    </div>

                    <div className="mt-7 grid gap-4 border-t border-line pt-6">
                      <Casilla id="acepta_bases" checked={Boolean(d.acepta_bases)} onChange={set("acepta_bases")} error={err.acepta_bases}>
                        Acepto las{" "}
                        <button type="button" onClick={(e) => { e.preventDefault(); abrirBases(); }} className="font-bold text-brand underline underline-offset-2">bases y condiciones</button>{" "}
                        y me comprometo a presentar mi caso clínico dentro de los 60 días de recibida la muestra. <span className="text-brand">*</span>
                      </Casilla>
                      <Casilla id="acepta_publicacion" checked={Boolean(d.acepta_publicacion)} onChange={set("acepta_publicacion")}>
                        Autorizo a Dental Medrano a publicar mi caso con mi nombre, siempre que también cuente con el consentimiento del paciente. <span className="text-mute">(opcional)</span>
                      </Casilla>
                      <Casilla id="acepta_novedades" checked={Boolean(d.acepta_novedades)} onChange={set("acepta_novedades")}>
                        Quiero recibir novedades y promociones de Dental Medrano. <span className="text-mute">(opcional)</span>
                      </Casilla>
                    </div>

                    <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row">
                      <button type="button" onClick={() => { setPaso(1); setErr({}); setAlerta(""); }} className="btn btn-ghost">Volver</button>
                      <button type="submit" disabled={enviando} aria-busy={enviando} className="btn btn-brand flex-1 !min-h-[58px] !text-base disabled:opacity-60">
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
                        <motion.circle cx="40" cy="40" r="36" fill="none" stroke="#f15922" strokeWidth="3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.7, ease }} />
                        <motion.path d="M25 41l10 10 20-22" fill="none" stroke="#111" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4, delay: 0.5 }} />
                      </svg>
                      <h3 className="mt-5 text-3xl md:text-4xl font-extrabold tracking-tight">Recibimos tu solicitud{listo.nombre ? `, ${listo.nombre}` : ""}.</h3>
                    </div>
                    <div className="mx-auto mt-6 max-w-[34em] rounded-lg border border-line bg-surface p-5">
                      <p className="text-[13px] font-extrabold uppercase tracking-[0.14em] text-mute">Resumen</p>
                      <p className="mt-1 text-lg font-bold">Muestra Densell White {listo.concentracion}</p>
                      <ul className="mt-3 grid gap-2 text-[15px] text-soft">
                        <li className="flex gap-2.5"><CheckIcon className="mt-1 h-4 w-4 shrink-0 text-brand" /> Vamos a verificar tu matrícula.</li>
                        <li className="flex gap-2.5"><CheckIcon className="mt-1 h-4 w-4 shrink-0 text-brand" /> La entrega está sujeta a validación y disponibilidad.</li>
                        <li className="flex gap-2.5"><CheckIcon className="mt-1 h-4 w-4 shrink-0 text-brand" /> Te contactamos por WhatsApp con los próximos pasos.</li>
                      </ul>
                    </div>

                    <div className="mt-8 border-t border-line pt-6">
                      <p className="text-center text-[15px] font-bold">Mientras tanto, conocé toda la línea Densell White</p>
                      {config.productos.length > 0 && (
                        <div className="mt-4 grid grid-cols-3 gap-2.5">
                          {config.productos.slice(0, 3).map((p) => (
                            <WebLink key={p.nombre} lugar="exito-producto" href={p.link} className="group overflow-hidden rounded-md border border-line bg-white transition-colors hover:border-brand">
                              <div className="aspect-square overflow-hidden bg-white">
                                {p.imagen && <img src={p.imagen} alt={p.nombre} className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105" loading="lazy" />}
                              </div>
                              <p className="px-2.5 py-2 text-[12px] font-bold leading-snug">{p.nombre}</p>
                            </WebLink>
                          ))}
                        </div>
                      )}
                      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                        <WebLink lugar="exito" className="btn btn-brand flex-1">Ir a dentalmedrano.com <External /></WebLink>
                        <a href={waLink(config.whatsapp, config.whatsappTexto)} target="_blank" rel="noopener" className="btn btn-ghost"><WaIcon className="h-5 w-5 text-[#25D366]" /> Consultar</a>
                      </div>
                      <p className="mt-6 text-center">
                        <button type="button" onClick={nuevaSolicitud} className="text-[13px] font-semibold text-mute underline underline-offset-2 hover:text-ink">
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
