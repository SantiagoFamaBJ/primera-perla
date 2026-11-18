"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Estado } from "@/lib/data";
import { ESPECIALIDADES, MARCAS, PASO1, PASO2, PROVINCIAS, TIPOS_MATRICULA, VOLUMENES, validar } from "@/lib/validate";
import Cupo from "./Cupo";
import { leerUtm } from "./Pixel";
import { Arrow, External, WaIcon, WebLink, ease, fechaLarga, track, useLanding, waLink } from "./shared";

type Datos = Record<string, string | boolean>;
const INICIAL: Datos = {
  nombre: "", matricula: "", whatsapp: "", email: "", concentracion: "", acepta_datos: false,
  tipo_matricula: "", provincia_matricula: "", especialidad: "", consultorio: "", localidad: "", provincia: "",
  instagram: "", marca_actual: "", blanqueamientos_mes: "", acepta_bases: false, acepta_novedades: false,
};

function Campo({ id, label, error, opcional, hint, full, children }: { id: string; label: string; error?: string; opcional?: boolean; hint?: string; full?: boolean; children: React.ReactNode }) {
  return (
    <div className={`flex flex-col gap-2 ${full ? "sm:col-span-2" : ""}`}>
      <label htmlFor={id} className="text-[14px] font-semibold">
        {label} {opcional ? <span className="font-medium text-mute">(opcional)</span> : <span className="text-brand">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-[13px] text-mute">{hint}</p>}
      {error && <p id={`${id}-err`} className="text-[13px] font-medium text-danger">{error}</p>}
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

function Check({ id, checked, onChange, error, children }: { id: string; checked: boolean; onChange: (v: boolean) => void; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="flex cursor-pointer gap-3 text-[14px] leading-relaxed text-soft">
        <input id={id} type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="mt-1 h-[18px] w-[18px] shrink-0 accent-[#f15922]" aria-invalid={Boolean(error)} />
        <span>{children}</span>
      </label>
      {error && <p className="mt-1 pl-[30px] text-[13px] font-medium text-danger">{error}</p>}
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
  const cardRef = useRef<HTMLDivElement>(null);

  // La concentración elegida en las tarjetas llega acá
  useEffect(() => { if (seleccion) setD((p) => ({ ...p, concentracion: seleccion })); }, [seleccion]);

  // Si recargó la página entre el paso 1 y el 2, lo retomamos
  useEffect(() => {
    try {
      const g = JSON.parse(sessionStorage.getItem("pp_form") || "null");
      if (g?.id && g?.datos) { setId(g.id); setD({ ...INICIAL, ...g.datos }); setPaso(2); }
    } catch {}
  }, []);

  const set = (k: string) => (v: string | boolean) => {
    setD((p) => ({ ...p, [k]: v }));
    if (k === "concentracion") onSeleccion(String(v));
    if (err[k]) setErr((e) => { const n = { ...e }; delete n[k]; return n; });
  };
  const inp = (k: string, extra: React.InputHTMLAttributes<HTMLInputElement> = {}) => ({
    id: k, className: "field-input", value: String(d[k] ?? ""), "aria-invalid": Boolean(err[k]),
    "aria-describedby": err[k] ? `${k}-err` : undefined, onChange: (e: React.ChangeEvent<HTMLInputElement>) => set(k)(e.target.value), ...extra,
  });

  const subir = () => cardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  const enfocarError = (e: Record<string, string>) => {
    const primero = Object.keys(e)[0];
    setTimeout(() => (document.getElementById(primero === "concentracion" ? "conc-0" : primero) as HTMLElement | null)?.focus(), 50);
  };

  async function enviarPaso1(ev: React.FormEvent) {
    ev.preventDefault();
    setAlerta("");
    const e = validar(PASO1, d);
    if (!d.acepta_datos) e.acepta_datos = "Necesitamos tu autorización para usar tus datos.";
    setErr(e);
    if (Object.keys(e).length) { enfocarError(e); return; }
    setEnviando(true);
    try {
      const r = await fetch("/api/inscripcion", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: d.nombre, matricula: d.matricula, whatsapp: d.whatsapp, email: d.email, concentracion: d.concentracion, acepta_datos: d.acepta_datos, ...leerUtm() }),
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
      track("InitiateCheckout", { content_name: "Muestra Densell White - paso 1" });
      setPaso(2);
      subir();
    } catch {
      setAlerta("No pudimos conectarnos. Revisá tu conexión y probá de nuevo.");
    } finally { setEnviando(false); }
  }

  async function enviarPaso2(ev: React.FormEvent) {
    ev.preventDefault();
    setAlerta("");
    const e = validar(PASO2, d);
    if (!d.acepta_bases) e.acepta_bases = "Tenés que aceptar las bases y condiciones.";
    setErr(e);
    if (Object.keys(e).length) { enfocarError(e); return; }
    setEnviando(true);
    try {
      const r = await fetch("/api/inscripcion", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...d, id }) });
      const j = await r.json();
      if (!j.ok) {
        if (j.errores) { setErr(j.errores); enfocarError(j.errores); }
        else setAlerta(j.error || "No pudimos confirmar tu inscripción.");
        if (j.cerrado) refrescarCupo();
        return;
      }
      sessionStorage.removeItem("pp_form");
      track("Lead", { content_name: "Muestra Densell White", content_category: String(d.concentracion) });
      setPaso(3);
      refrescarCupo();
      subir();
    } catch {
      setAlerta("No pudimos conectarnos. Revisá tu conexión y probá de nuevo.");
    } finally { setEnviando(false); }
  }

  async function refrescarCupo() {
    try { const r = await fetch("/api/cupo", { cache: "no-store" }); if (r.ok) onEstado(await r.json()); } catch {}
  }

  const nombre = String(d.nombre).trim().split(/\s+/)[0] || "";
  const cerrado = !estado.abierto && paso !== 3;

  return (
    <section id="formulario" className="relative scroll-mt-16 py-24 md:py-32">
      <div className="mx-auto grid max-w-[1200px] items-start gap-12 px-5 md:px-8 lg:grid-cols-[.8fr_1.2fr] lg:gap-16">
        <aside className="flex flex-col gap-6 lg:sticky lg:top-28">
          <p className="eyebrow">Inscripción</p>
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-[-0.03em] leading-[1.02]">
            Pedí tu <span className="text-brand">jeringa gratis.</span>
          </h2>
          <p className="text-lg text-soft">Te lleva menos de 2 minutos. Validamos cada inscripción antes del envío.</p>
          <Cupo />
          <ul className="grid gap-2.5 text-[15px] text-soft">
            <li className="flex gap-3"><span className="text-brand">—</span> Una jeringa por matrícula, hasta agotar stock</li>
            <li className="flex gap-3"><span className="text-brand">—</span> Para odontólogos con matrícula vigente en Argentina</li>
            <li className="flex gap-3"><span className="text-brand">—</span> Inscripción hasta el {fechaLarga(config.cierre)}</li>
          </ul>
        </aside>

        <div ref={cardRef} className="scroll-mt-24 rounded-xl border border-line bg-surface p-6 sm:p-8 md:p-10">
          {cerrado ? (
            <div className="py-10 text-center">
              <p className="text-3xl font-bold">La inscripción está cerrada.</p>
              <p className="mt-3 text-mute">Se agotó el stock o terminó el plazo. Gracias por tu interés.</p>
              <WebLink lugar="form-cerrado" className="btn btn-brand mt-8">Ir a dentalmedrano.com <External /></WebLink>
            </div>
          ) : (
            <>
              {paso !== 3 && (
                <div className="mb-8">
                  <div className="flex items-center justify-between text-[13px] font-bold">
                    <span className={paso === 1 ? "text-white" : "text-mute"}>1. Tus datos</span>
                    <span className={paso === 2 ? "text-white" : "text-mute"}>2. Tu consultorio</span>
                  </div>
                  <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/10">
                    <motion.div className="h-full bg-brand" animate={{ width: paso === 1 ? "50%" : "100%" }} transition={{ duration: 0.6, ease }} />
                  </div>
                </div>
              )}

              {alerta && (
                <div role="alert" className="mb-6 rounded-md border border-danger/60 bg-danger/10 px-4 py-3 text-[15px]">{alerta}</div>
              )}

              <AnimatePresence mode="wait" initial={false}>
                {paso === 1 && (
                  <motion.form key="p1" noValidate onSubmit={enviarPaso1} initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.35 }}>
                    <fieldset>
                      <legend className="mb-3 text-[14px] font-semibold">Concentración que querés probar <span className="text-brand">*</span></legend>
                      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4" role="radiogroup">
                        {config.concentraciones.map((c, i) => {
                          const on = d.concentracion === c.valor;
                          return (
                            <label key={c.valor} className={`relative cursor-pointer rounded-md border px-2 py-4 text-center transition-colors ${on ? "border-brand bg-brand/10" : "border-line hover:border-white/30"}`}>
                              <input id={`conc-${i}`} type="radio" name="concentracion" value={c.valor} checked={on} onChange={() => set("concentracion")(c.valor)} className="sr-only" />
                              <span className="block text-3xl font-extrabold tracking-tight">{c.numero}<span className="text-brand text-lg">%</span></span>
                              <span className="mt-1 block text-[10px] font-bold uppercase tracking-[0.14em] text-mute">{c.nivel}</span>
                              {on && <motion.span layoutId="conc-check" className="absolute right-2 top-2 h-2 w-2 rounded-full bg-brand" />}
                            </label>
                          );
                        })}
                      </div>
                      {err.concentracion && <p className="mt-2 text-[13px] font-medium text-danger">{err.concentracion}</p>}
                    </fieldset>

                    <div className="mt-7 grid gap-5 sm:grid-cols-2">
                      <Campo id="nombre" label="Nombre y apellido" error={err.nombre} full>
                        <input {...inp("nombre", { autoComplete: "name" })} />
                      </Campo>
                      <Campo id="matricula" label="Número de matrícula" error={err.matricula}>
                        <input {...inp("matricula", { inputMode: "numeric" })} />
                      </Campo>
                      <Campo id="whatsapp" label="WhatsApp" error={err.whatsapp} hint="Con código de área, sin 0 ni 15.">
                        <input {...inp("whatsapp", { type: "tel", autoComplete: "tel", placeholder: "11 2345 6789" })} />
                      </Campo>
                      <Campo id="email" label="Email" error={err.email} full>
                        <input {...inp("email", { type: "email", autoComplete: "email", placeholder: "nombre@consultorio.com" })} />
                      </Campo>
                    </div>

                    <div className="mt-6">
                      <Check id="acepta_datos" checked={Boolean(d.acepta_datos)} onChange={set("acepta_datos")} error={err.acepta_datos}>
                        Acepto que Dental Medrano use mis datos para gestionar el programa, según la Ley 25.326 de Protección de Datos Personales. <span className="text-brand">*</span>
                      </Check>
                    </div>

                    <button type="submit" disabled={enviando} className="btn btn-brand mt-8 w-full !min-h-[58px] disabled:opacity-60">
                      {enviando ? "Enviando…" : <>Continuar <Arrow /></>}
                    </button>
                    <p className="mt-3 text-center text-[13px] text-mute">Paso 1 de 2 · Tus datos quedan guardados</p>
                  </motion.form>
                )}

                {paso === 2 && (
                  <motion.form key="p2" noValidate onSubmit={enviarPaso2} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }} transition={{ duration: 0.35 }}>
                    <p className="mb-6 text-[15px] text-soft">
                      {nombre ? `Bien, ${nombre}. ` : ""}Último paso: contanos dónde atendés y cómo trabajás hoy.
                    </p>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Campo id="tipo_matricula" label="Tipo de matrícula" error={err.tipo_matricula}>
                        <Select id="tipo_matricula" value={String(d.tipo_matricula)} onChange={set("tipo_matricula")} opciones={TIPOS_MATRICULA} placeholder="Elegí una opción" invalid={Boolean(err.tipo_matricula)} />
                      </Campo>
                      <Campo id="provincia_matricula" label="Provincia de la matrícula" error={err.provincia_matricula}>
                        <Select id="provincia_matricula" value={String(d.provincia_matricula)} onChange={set("provincia_matricula")} opciones={PROVINCIAS} placeholder="Elegí una provincia" invalid={Boolean(err.provincia_matricula)} />
                      </Campo>
                      <Campo id="especialidad" label="Especialidad" error={err.especialidad} full>
                        <Select id="especialidad" value={String(d.especialidad)} onChange={set("especialidad")} opciones={ESPECIALIDADES} placeholder="Elegí una opción" invalid={Boolean(err.especialidad)} />
                      </Campo>
                      <Campo id="consultorio" label="Consultorio o institución" error={err.consultorio} full>
                        <input {...inp("consultorio", { autoComplete: "organization" })} />
                      </Campo>
                      <Campo id="localidad" label="Localidad" error={err.localidad}>
                        <input {...inp("localidad", { autoComplete: "address-level2" })} />
                      </Campo>
                      <Campo id="provincia" label="Provincia" error={err.provincia}>
                        <Select id="provincia" value={String(d.provincia)} onChange={set("provincia")} opciones={PROVINCIAS} placeholder="Elegí una provincia" invalid={Boolean(err.provincia)} />
                      </Campo>
                      <Campo id="marca_actual" label="¿Qué marca de blanqueamiento ambulatorio usás hoy?" error={err.marca_actual} full>
                        <Select id="marca_actual" value={String(d.marca_actual)} onChange={set("marca_actual")} opciones={MARCAS} placeholder="Elegí una opción" invalid={Boolean(err.marca_actual)} />
                      </Campo>
                      <Campo id="blanqueamientos_mes" label="¿Cuántos blanqueamientos ambulatorios hacés por mes?" error={err.blanqueamientos_mes} full>
                        <Select id="blanqueamientos_mes" value={String(d.blanqueamientos_mes)} onChange={set("blanqueamientos_mes")} opciones={VOLUMENES} placeholder="Elegí una opción" invalid={Boolean(err.blanqueamientos_mes)} />
                      </Campo>
                      <Campo id="instagram" label="Instagram del consultorio" opcional hint="Si publicamos tu caso, te etiquetamos." full>
                        <input {...inp("instagram", { placeholder: "@tuconsultorio" })} />
                      </Campo>
                    </div>

                    <div className="mt-6 grid gap-4">
                      <Check id="acepta_bases" checked={Boolean(d.acepta_bases)} onChange={set("acepta_bases")} error={err.acepta_bases}>
                        Acepto las{" "}
                        <button type="button" onClick={(e) => { e.preventDefault(); abrirBases(); }} className="font-semibold text-brand underline underline-offset-2">bases y condiciones</button>{" "}
                        y me comprometo a enviar mi caso clínico dentro de los 60 días de recibida la muestra. <span className="text-brand">*</span>
                      </Check>
                      <Check id="acepta_novedades" checked={Boolean(d.acepta_novedades)} onChange={set("acepta_novedades")}>
                        Quiero recibir novedades de Dental Medrano. <span className="text-mute">(opcional)</span>
                      </Check>
                    </div>

                    <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row">
                      <button type="button" onClick={() => { setPaso(1); setErr({}); }} className="btn btn-ghost sm:w-auto">Volver</button>
                      <button type="submit" disabled={enviando} className="btn btn-brand flex-1 !min-h-[58px] disabled:opacity-60">
                        {enviando ? "Enviando…" : <>Pedí tu jeringa <Arrow /></>}
                      </button>
                    </div>
                  </motion.form>
                )}

                {paso === 3 && (
                  <motion.div key="ok" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, ease }} className="text-center" role="status">
                    <svg viewBox="0 0 80 80" className="mx-auto h-20 w-20" aria-hidden="true">
                      <motion.circle cx="40" cy="40" r="36" fill="none" stroke="#f15922" strokeWidth="3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, ease }} />
                      <motion.path d="M25 41l10 10 20-22" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.6 }} />
                    </svg>
                    <h3 className="mt-6 text-4xl font-extrabold tracking-tight">¡Listo{nombre ? `, ${nombre}` : ""}!</h3>
                    <p className="mx-auto mt-3 max-w-[30em] text-soft">
                      Recibimos tu inscripción para probar Densell White {String(d.concentracion)}. Validamos tu matrícula y te escribimos por WhatsApp para coordinar la entrega.
                    </p>

                    <div className="mt-10 rounded-lg border border-line bg-black/40 p-6 text-left">
                      <p className="eyebrow">Mientras esperás</p>
                      <p className="mt-3 text-xl font-bold">Conocé toda la línea Densell White</p>
                      <p className="mt-2 text-[15px] text-mute">Kits ambulatorios, de consultorio y complementos. Con tu caso accedés al 20% OFF{config.mostrarDescuentoExtra ? `, y tenés ${config.descuentoExtra} mayores a ${config.descuentoExtraMinimo}` : ""}.</p>
                      <div className="mt-5 grid gap-3 sm:grid-cols-3">
                        {config.productos.slice(0, 3).map((p) => (
                          <WebLink key={p.nombre} lugar="exito-producto" href={p.link} className="group overflow-hidden rounded-md border border-line bg-white text-black transition-colors hover:border-brand">
                            <div className="aspect-[4/3] overflow-hidden bg-white">
                              {p.imagen && <img src={p.imagen} alt={p.nombre} className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105" loading="lazy" />}
                            </div>
                            <p className="px-3 py-2.5 text-[13px] font-bold leading-snug">{p.nombre}</p>
                          </WebLink>
                        ))}
                      </div>
                      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                        <WebLink lugar="exito" className="btn btn-brand flex-1">Ir a dentalmedrano.com <External /></WebLink>
                        <a href={waLink(config.whatsapp, config.whatsappTexto)} target="_blank" rel="noopener" className="btn btn-ghost">
                          <WaIcon className="h-5 w-5" /> Consultar
                        </a>
                      </div>
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
