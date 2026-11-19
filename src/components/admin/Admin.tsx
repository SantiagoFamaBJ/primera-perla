"use client";

import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { ESTADOS, type Config } from "@/lib/types";

type Row = Record<string, string | boolean | null> & { id: string; estado: string; created_at: string };

const inputCls = "w-full rounded border border-neutral-300 bg-white px-3 py-2.5 text-[15px] focus:border-[#f15922] focus:outline-none focus:ring-2 focus:ring-[#f15922]/20";
const btnCls = "inline-flex items-center justify-center gap-2 rounded bg-[#f15922] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#d64712] disabled:opacity-50";
const btn2Cls = "inline-flex items-center justify-center gap-2 rounded border border-neutral-300 bg-white px-4 py-2.5 text-sm font-bold hover:border-neutral-500";

function Login({ onOk }: { onOk: () => void }) {
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  return (
    <div className="grid min-h-screen place-items-center bg-neutral-100 p-5 text-black">
      <form
        className="w-full max-w-sm rounded-lg bg-white p-8 shadow-sm"
        onSubmit={async (e) => {
          e.preventDefault();
          const r = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: pw }) });
          if (r.ok) onOk(); else setError("Contraseña incorrecta");
        }}
      >
        <img src="/img/dm-color.png" alt="Dental Medrano" className="mx-auto h-12 w-auto" />
        <h1 className="mt-6 text-center text-xl font-bold">Muestras Densell White · Admin</h1>
        <label htmlFor="pw" className="mt-6 block text-sm font-semibold">Contraseña</label>
        <input id="pw" type="password" className={`${inputCls} mt-2`} value={pw} onChange={(e) => setPw(e.target.value)} autoFocus />
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        <button className={`${btnCls} mt-5 w-full`}>Entrar</button>
      </form>
    </div>
  );
}

function Inscripciones() {
  const [rows, setRows] = useState<Row[]>([]);
  const [cargando, setCargando] = useState(true);
  const [filtro, setFiltro] = useState("todas");
  const [busca, setBusca] = useState("");
  const [abierta, setAbierta] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    setCargando(true);
    const r = await fetch("/api/admin/inscripciones", { cache: "no-store" });
    const j = await r.json();
    setRows(j.rows || []);
    setCargando(false);
  }, []);
  useEffect(() => { cargar(); }, [cargar]);

  const cambiar = async (id: string, cambios: Record<string, string>) => {
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...cambios } : r)));
    await fetch("/api/admin/inscripciones", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, ...cambios }) });
  };

  const conteo = useMemo(() => {
    const c: Record<string, number> = {};
    rows.forEach((r) => { c[r.estado] = (c[r.estado] || 0) + 1; });
    return c;
  }, [rows]);
  const ocupan = rows.filter((r) => ESTADOS.find((e) => e.id === r.estado)?.cuenta).length;

  const visibles = rows.filter((r) => {
    if (filtro !== "todas" && r.estado !== filtro) return false;
    if (!busca) return true;
    const q = busca.toLowerCase();
    return [r.nombre, r.matricula, r.email, r.whatsapp, r.localidad].some((v) => String(v ?? "").toLowerCase().includes(q));
  });

  const porConc = useMemo(() => {
    const c: Record<string, number> = {};
    rows.filter((r) => ESTADOS.find((e) => e.id === r.estado)?.cuenta).forEach((r) => { const k = String(r.concentracion || "—"); c[k] = (c[k] || 0) + 1; });
    return c;
  }, [rows]);

  const fmt = (iso: string) => new Date(iso).toLocaleString("es-AR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit", timeZone: "America/Buenos_Aires" });

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <div className="rounded-lg bg-black p-4 text-white"><p className="text-xs font-bold uppercase tracking-widest text-neutral-400">Confirmadas</p><p className="mt-1 text-3xl font-extrabold">{ocupan}</p></div>
        <div className="rounded-lg bg-white p-4"><p className="text-xs font-bold uppercase tracking-widest text-neutral-500">Pendientes</p><p className="mt-1 text-3xl font-extrabold text-[#f15922]">{conteo.pendiente || 0}</p></div>
        <div className="rounded-lg bg-white p-4"><p className="text-xs font-bold uppercase tracking-widest text-neutral-500">Incompletas</p><p className="mt-1 text-3xl font-extrabold">{conteo.parcial || 0}</p></div>
        <div className="rounded-lg bg-white p-4"><p className="text-xs font-bold uppercase tracking-widest text-neutral-500">Por concentración</p><p className="mt-2 text-sm font-semibold">{Object.entries(porConc).map(([k, v]) => `${k}: ${v}`).join(" · ") || "—"}</p></div>
      </div>

      <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center">
        <select className={`${inputCls} md:w-60`} value={filtro} onChange={(e) => setFiltro(e.target.value)}>
          <option value="todas">Todas ({rows.length})</option>
          {ESTADOS.map((e) => <option key={e.id} value={e.id}>{e.label} ({conteo[e.id] || 0})</option>)}
        </select>
        <input className={inputCls} placeholder="Buscar por nombre, matrícula, email, WhatsApp o localidad" value={busca} onChange={(e) => setBusca(e.target.value)} />
        <div className="flex gap-2">
          <button className={btn2Cls} onClick={cargar}>Actualizar</button>
          <a className={btnCls} href="/api/admin/export">Descargar Excel</a>
        </div>
      </div>
      <p className="mt-2 text-xs text-neutral-500">“Incompleta” = completó solo el paso 1 (no ocupa cupo). Sirve para recontactar.</p>

      <div className="mt-4 overflow-x-auto rounded-lg bg-white">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead className="border-b border-neutral-200 text-xs uppercase tracking-wider text-neutral-500">
            <tr><th className="p-3">Fecha</th><th className="p-3">Nombre</th><th className="p-3">Matrícula</th><th className="p-3">Conc.</th><th className="p-3">WhatsApp</th><th className="p-3">Provincia / Localidad</th><th className="p-3">Estado</th><th className="p-3" /></tr>
          </thead>
          <tbody>
            {cargando && <tr><td colSpan={8} className="p-6 text-center text-neutral-500">Cargando…</td></tr>}
            {!cargando && !visibles.length && <tr><td colSpan={8} className="p-6 text-center text-neutral-500">No hay inscripciones.</td></tr>}
            {visibles.map((r) => (
              <Fragment key={r.id}>
                <tr className="border-b border-neutral-100 hover:bg-neutral-50">
                  <td className="p-3 whitespace-nowrap">{fmt(r.created_at)}</td>
                  <td className="p-3 font-semibold">{r.nombre}</td>
                  <td className="p-3">{r.matricula} <span className="text-neutral-400">{r.tipo_matricula ? `· ${String(r.tipo_matricula).match(/\((\w+)\)/)?.[1] ?? ""}` : ""}</span></td>
                  <td className="p-3">{r.concentracion}</td>
                  <td className="p-3"><a className="text-[#f15922] font-semibold" href={`https://wa.me/549${r.whatsapp}`} target="_blank" rel="noopener">{r.whatsapp}</a></td>
                  <td className="p-3">{r.provincia ? `${r.provincia}${r.localidad ? ` · ${r.localidad}` : ""}` : "—"}</td>
                  <td className="p-3">
                    <select className="rounded border border-neutral-300 px-2 py-1.5 text-sm" value={r.estado} onChange={(e) => cambiar(r.id, { estado: e.target.value })}>
                      {ESTADOS.map((e) => <option key={e.id} value={e.id}>{e.label}</option>)}
                    </select>
                  </td>
                  <td className="p-3"><button className="text-sm font-semibold underline" onClick={() => setAbierta(abierta === r.id ? null : r.id)}>{abierta === r.id ? "Cerrar" : "Ver"}</button></td>
                </tr>
                {abierta === r.id && (
                  <tr className="bg-neutral-50">
                    <td colSpan={8} className="p-4">
                      <div className="grid gap-x-8 gap-y-1.5 text-sm md:grid-cols-3">
                        {[["Email", r.email], ["Domicilio", r.domicilio], ["CP", r.codigo_postal], ["Localidad", r.localidad], ["Especialidad", r.especialidad], ["Marca actual", r.marca_actual], ["Blanq./mes", r.blanqueamientos_mes], ["Autoriza publicar", r.acepta_publicacion ? "Sí" : "No"], ["Novedades", r.acepta_novedades ? "Sí" : "No"], ["Origen", [r.utm_source, r.utm_campaign, r.utm_content].filter(Boolean).join(" / ") || "—"], ["Anuncio (ad_id)", r.ad_id]].map(([k, v]) => (
                          <p key={String(k)}><span className="text-neutral-500">{k}:</span> {String(v ?? "—") || "—"}</p>
                        ))}
                      </div>
                      <div className="mt-4 grid gap-3 md:grid-cols-5">
                        <div><label className="text-xs font-bold uppercase tracking-wider text-neutral-500">Cupón</label><input className={`${inputCls} mt-1`} defaultValue={String(r.cupon_codigo ?? "")} onBlur={(e) => cambiar(r.id, { cupon_codigo: e.target.value })} /></div>
                        <div><label className="text-xs font-bold uppercase tracking-wider text-neutral-500">Cupón entregado</label><input type="date" className={`${inputCls} mt-1`} defaultValue={r.cupon_entregado_at ? String(r.cupon_entregado_at).slice(0, 10) : ""} onBlur={(e) => cambiar(r.id, { cupon_entregado_at: e.target.value })} /></div>
                        <div><label className="text-xs font-bold uppercase tracking-wider text-neutral-500">Cupón usado</label><input type="date" className={`${inputCls} mt-1`} defaultValue={r.cupon_usado_at ? String(r.cupon_usado_at).slice(0, 10) : ""} onBlur={(e) => cambiar(r.id, { cupon_usado_at: e.target.value })} /></div>
                        <div><label className="text-xs font-bold uppercase tracking-wider text-neutral-500">Compra $</label><input inputMode="decimal" className={`${inputCls} mt-1`} defaultValue={String(r.compra_monto ?? "")} onBlur={(e) => cambiar(r.id, { compra_monto: e.target.value })} /></div>
                        <div><label className="text-xs font-bold uppercase tracking-wider text-neutral-500">Detalle compra</label><input className={`${inputCls} mt-1`} defaultValue={String(r.compra_detalle ?? "")} onBlur={(e) => cambiar(r.id, { compra_detalle: e.target.value })} /></div>
                      </div>
                      <label className="mt-3 block text-xs font-bold uppercase tracking-wider text-neutral-500">Notas internas</label>
                      <textarea className={`${inputCls} mt-1`} rows={2} defaultValue={String(r.notas ?? "")} onBlur={(e) => cambiar(r.id, { notas: e.target.value })} />
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Lista<T extends Record<string, string>>({ items, campos, vacio, onChange, conSubida }: { items: T[]; campos: { k: keyof T; label: string; tipo?: "text" | "textarea" | "img" }[]; vacio: T; onChange: (v: T[]) => void; conSubida?: boolean }) {
  const set = (i: number, k: keyof T, v: string) => onChange(items.map((it, j) => (j === i ? { ...it, [k]: v } : it)));
  const mover = (i: number, d: number) => { const n = [...items]; const [x] = n.splice(i, 1); n.splice(i + d, 0, x); onChange(n); };
  const subir = async (i: number, k: keyof T, f: File) => {
    const fd = new FormData(); fd.append("file", f);
    const r = await fetch("/api/admin/upload", { method: "POST", body: fd }); const j = await r.json();
    if (j.ok) set(i, k, j.url); else alert(j.error || "No se pudo subir");
  };
  return (
    <div className="grid gap-3">
      {items.map((it, i) => (
        <div key={i} className="rounded-lg border border-neutral-200 bg-white p-4">
          <div className="grid gap-3 md:grid-cols-2">
            {campos.map((c) => (
              <div key={String(c.k)} className={c.tipo === "textarea" ? "md:col-span-2" : ""}>
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">{c.label}</label>
                {c.tipo === "textarea" ? (
                  <textarea className={`${inputCls} mt-1`} rows={3} value={it[c.k]} onChange={(e) => set(i, c.k, e.target.value)} />
                ) : (
                  <div className="mt-1 flex gap-2">
                    <input className={inputCls} value={it[c.k]} onChange={(e) => set(i, c.k, e.target.value)} />
                    {c.tipo === "img" && conSubida && (
                      <label className={`${btn2Cls} cursor-pointer whitespace-nowrap`}>Subir<input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && subir(i, c.k, e.target.files[0])} /></label>
                    )}
                  </div>
                )}
                {c.tipo === "img" && it[c.k] && <img src={it[c.k]} alt="" className="mt-2 h-20 rounded border object-contain" />}
              </div>
            ))}
          </div>
          <div className="mt-3 flex gap-2 text-sm">
            <button className="font-semibold underline disabled:opacity-30" disabled={i === 0} onClick={() => mover(i, -1)}>Subir</button>
            <button className="font-semibold underline disabled:opacity-30" disabled={i === items.length - 1} onClick={() => mover(i, 1)}>Bajar</button>
            <button className="ml-auto font-semibold text-red-600 underline" onClick={() => confirm("¿Quitar este ítem?") && onChange(items.filter((_, j) => j !== i))}>Quitar</button>
          </div>
        </div>
      ))}
      <button className={btn2Cls} onClick={() => onChange([...items, { ...vacio }])}>+ Agregar</button>
    </div>
  );
}

function F({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div><label className="text-xs font-bold uppercase tracking-wider text-neutral-500">{label}</label><div className="mt-1">{children}</div>{hint && <p className="mt-1 text-xs text-neutral-500">{hint}</p>}</div>
  );
}

function Configuracion({ seccion }: { seccion: "general" | "contenido" | "productos" | "casos" | "faq" }) {
  const [c, setC] = useState<Config | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [msg, setMsg] = useState("");
  useEffect(() => { fetch("/api/admin/config", { cache: "no-store" }).then((r) => r.json()).then((j) => setC(j.config)); }, []);
  if (!c) return <p className="text-neutral-500">Cargando…</p>;
  const set = <K extends keyof Config>(k: K, v: Config[K]) => setC({ ...c, [k]: v });

  // datetime-local trabaja sin zona: lo mostramos y guardamos en hora argentina
  const cierreLocal = (() => {
    const d = new Date(new Date(c.cierre).getTime() - 3 * 3600 * 1000);
    return d.toISOString().slice(0, 16);
  })();

  const guardar = async () => {
    setGuardando(true); setMsg("");
    const r = await fetch("/api/admin/config", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ config: c }) });
    setGuardando(false);
    setMsg(r.ok ? "Guardado. La web se actualiza en menos de un minuto." : "No se pudo guardar.");
  };

  return (
    <div className="grid gap-6">
      {seccion === "general" && (
        <div className="grid gap-4 rounded-lg bg-white p-5 md:grid-cols-2">
          <F label="Nombre del programa" hint="Va arriba de todo, sobre «Densell White»."><input className={inputCls} value={c.programa} onChange={(e) => set("programa", e.target.value)} /></F>
          <F label="Stock de jeringas" hint="No se muestra en la web. Al llegar a este número, el formulario se cierra solo."><input type="number" min={0} className={inputCls} value={c.cupo} onChange={(e) => set("cupo", Number(e.target.value))} /></F>
          <F label="Cierre de inscripción (hora Argentina)"><input type="datetime-local" className={inputCls} value={cierreLocal} onChange={(e) => set("cierre", `${e.target.value}:59-03:00`)} /></F>
          <F label="Cerrar inscripción ahora" hint="Cierra el formulario aunque quede cupo o tiempo.">
            <label className="flex items-center gap-2 py-2"><input type="checkbox" checked={c.cerradoManual} onChange={(e) => set("cerradoManual", e.target.checked)} className="h-5 w-5 accent-[#f15922]" /> Cerrada</label>
          </F>
          <F label="ID del Pixel de Meta" hint="Solo el número. Vacío = sin Pixel."><input className={inputCls} value={c.pixelId} onChange={(e) => set("pixelId", e.target.value)} placeholder="123456789012345" /></F>
          <F label="ID de Google Analytics 4" hint="Formato G-XXXXXXX. Vacío = sin GA4."><input className={inputCls} value={c.gaId} onChange={(e) => set("gaId", e.target.value)} placeholder="G-XXXXXXXXXX" /></F>
          <F label="Web a la que llevan los botones"><input className={inputCls} value={c.webUrl} onChange={(e) => set("webUrl", e.target.value)} /></F>
          <F label="Texto del link a la web (header)"><input className={inputCls} value={c.webLabel} onChange={(e) => set("webLabel", e.target.value)} /></F>
          <F label="Plazo de envío (opcional)" hint="Solo si está confirmado. Ej: Los envíos salen en tandas semanales. Vacío = no se muestra."><input className={inputCls} value={c.plazoEnvio} onChange={(e) => set("plazoEnvio", e.target.value)} /></F>
          <F label="WhatsApp (solo números)"><input className={inputCls} value={c.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} /></F>
          <F label="Mensaje inicial de WhatsApp"><input className={inputCls} value={c.whatsappTexto} onChange={(e) => set("whatsappTexto", e.target.value)} /></F>
          <F label="Razón social (bases)"><input className={inputCls} value={c.razonSocial} onChange={(e) => set("razonSocial", e.target.value)} /></F>
          <F label="CUIT (bases)"><input className={inputCls} value={c.cuit} onChange={(e) => set("cuit", e.target.value)} /></F>
        </div>
      )}

      {seccion === "contenido" && (
        <div className="grid gap-5">
          <div className="grid gap-4 rounded-lg bg-white p-5">
            <F label="Título principal" hint="Las últimas dos palabras van en naranja."><input className={inputCls} value={c.heroTitulo} onChange={(e) => set("heroTitulo", e.target.value)} /></F>
            <F label="Bajada"><textarea className={inputCls} rows={3} value={c.heroBajada} onChange={(e) => set("heroBajada", e.target.value)} /></F>
            <F label="Mostrar el descuento extra (10% OFF)" hint="Si está apagado, no aparece en ningún lado de la web.">
              <label className="flex items-center gap-2 py-2"><input type="checkbox" checked={c.mostrarDescuentoExtra} onChange={(e) => set("mostrarDescuentoExtra", e.target.checked)} className="h-5 w-5 accent-[#f15922]" /> Visible en la web</label>
            </F>
            <F label="Descuento extra"><input className={inputCls} value={c.descuentoExtra} onChange={(e) => set("descuentoExtra", e.target.value)} /></F>
            <F label="Monto mínimo del descuento extra"><input className={inputCls} value={c.descuentoExtraMinimo} onChange={(e) => set("descuentoExtraMinimo", e.target.value)} /></F>
            <F label="Características generales (franja debajo de las tarjetas)" hint="Una por línea. Vacío = no se muestra."><textarea className={inputCls} rows={5} value={c.caracteristicas.join("\n")} onChange={(e) => set("caracteristicas", e.target.value.split("\n").map((s) => s.trim()).filter(Boolean))} /></F>
          </div>
          <h3 className="font-bold">Concentraciones</h3>
          <Lista
            items={c.concentraciones}
            vacio={{ valor: "", numero: "", nivel: "", descripcion: "", codigo: "", presentacion: "Jeringa de 2 ml", detalles: "" }}
            campos={[{ k: "valor", label: "Valor (ej: CP 10%)" }, { k: "numero", label: "Número" }, { k: "nivel", label: "Uso (ej: Ambulatorio)" }, { k: "codigo", label: "Código" }, { k: "presentacion", label: "Presentación" }, { k: "descripcion", label: "Descripción" }, { k: "detalles", label: "Características (una por línea)", tipo: "textarea" }]}
            onChange={(v) => set("concentraciones", v)}
          />
        </div>
      )}

      {seccion === "productos" && (
        <Lista
          items={c.productos}
          vacio={{ nombre: "", detalle: "", imagen: "", link: "" }}
          campos={[{ k: "nombre", label: "Nombre" }, { k: "detalle", label: "Detalle corto" }, { k: "imagen", label: "Imagen (URL)", tipo: "img" }, { k: "link", label: "Link de compra" }]}
          onChange={(v) => set("productos", v)}
          conSubida
        />
      )}

      {seccion === "casos" && (
        <div>
          <p className="mb-3 text-sm text-neutral-600">Solo imágenes reales y autorizadas. La sección aparece en la web cuando hay al menos un caso con antes y después.</p>
          <Lista
            items={c.casos}
            vacio={{ antes: "", despues: "", profesional: "", detalle: "" }}
            campos={[{ k: "antes", label: "Foto antes", tipo: "img" }, { k: "despues", label: "Foto después", tipo: "img" }, { k: "profesional", label: "Profesional (nombre y matrícula)" }, { k: "detalle", label: "Detalle (concentración, días)" }]}
            onChange={(v) => set("casos", v)}
            conSubida
          />
        </div>
      )}

      {seccion === "faq" && (
        <Lista items={c.faq} vacio={{ pregunta: "", respuesta: "" }} campos={[{ k: "pregunta", label: "Pregunta" }, { k: "respuesta", label: "Respuesta", tipo: "textarea" }]} onChange={(v) => set("faq", v)} />
      )}

      <div className="sticky bottom-0 -mx-5 flex items-center gap-4 border-t border-neutral-200 bg-neutral-100/95 px-5 py-4 backdrop-blur">
        <button className={btnCls} onClick={guardar} disabled={guardando}>{guardando ? "Guardando…" : "Guardar cambios"}</button>
        {msg && <p className="text-sm font-semibold">{msg}</p>}
      </div>
    </div>
  );
}

const TABS = [
  { id: "inscripciones", label: "Inscripciones" },
  { id: "general", label: "Configuración" },
  { id: "contenido", label: "Textos" },
  { id: "productos", label: "Productos" },
  { id: "casos", label: "Casos clínicos" },
  { id: "faq", label: "Preguntas" },
] as const;

export default function Admin() {
  const [ok, setOk] = useState<boolean | null>(null);
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("inscripciones");
  useEffect(() => { fetch("/api/admin/login").then((r) => r.json()).then((j) => setOk(j.ok)); }, []);
  if (ok === null) return <div className="min-h-screen bg-neutral-100" />;
  if (!ok) return <Login onOk={() => setOk(true)} />;
  return (
    <div className="min-h-screen bg-neutral-100 text-black">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-5 py-4">
          <div className="flex items-center gap-4">
            <img src="/img/dm-color.png" alt="Dental Medrano" className="h-9 w-auto" />
            <span className="hidden text-sm font-bold text-neutral-500 sm:inline">Muestras Densell White · Admin</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" target="_blank" className="text-sm font-semibold underline">Ver web</a>
            <button className="text-sm font-semibold underline" onClick={async () => { await fetch("/api/admin/login", { method: "DELETE" }); setOk(false); }}>Salir</button>
          </div>
        </div>
        <nav className="mx-auto flex max-w-[1200px] gap-1 overflow-x-auto px-5">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`whitespace-nowrap border-b-2 px-3 py-3 text-sm font-bold ${tab === t.id ? "border-[#f15922] text-black" : "border-transparent text-neutral-500 hover:text-black"}`}>{t.label}</button>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-[1200px] px-5 py-6">
        {tab === "inscripciones" ? <Inscripciones /> : <Configuracion key={tab} seccion={tab} />}
      </main>
    </div>
  );
}
