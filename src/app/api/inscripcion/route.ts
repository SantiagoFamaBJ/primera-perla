import { NextResponse } from "next/server";
import { db } from "@/lib/supabase";
import { calcularEstado, getConfig, getConteo, stockDe } from "@/lib/data";
import { enviarLeadCapi } from "@/lib/capi";
import { avisarNuevaSolicitud } from "@/lib/notificar";
import { ESTADOS_QUE_CUENTAN } from "@/lib/types";
import { PASO1, PASO2, normMatricula, normWhatsapp, validar } from "@/lib/validate";

export const dynamic = "force-dynamic";

const txt = (v: unknown, max = 200) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const MSG_CERRADO = "La inscripción está cerrada: se agotó el stock o terminó el plazo.";

// Paso 1: datos profesionales. Se guarda como "incompleta" (no ocupa stock todavía).
// Si ya existe (volvió al paso 1 y corrigió algo), se actualiza la misma fila en vez de crear otra.
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const errores = validar(PASO1, body);
  if (!body.acepta_datos) errores.acepta_datos = "Necesitamos tu autorización para gestionar la solicitud.";
  if (Object.keys(errores).length) return NextResponse.json({ ok: false, errores }, { status: 400 });

  const config = await getConfig();
  if (!config.concentraciones.some((c) => c.valor === body.concentracion))
    return NextResponse.json({ ok: false, errores: { concentracion: "Elegí una de las concentraciones disponibles." } }, { status: 400 });
  const estado = calcularEstado(config, await getConteo());
  if (!estado.abierto) return NextResponse.json({ ok: false, error: MSG_CERRADO, cerrado: true }, { status: 409 });
  if (estado.agotadas.includes(body.concentracion))
    return NextResponse.json({ ok: false, errores: { concentracion: "Esa concentración se agotó. Elegí otra." }, estado }, { status: 409 });

  const matricula_norm = normMatricula(body.matricula);
  const { data: dup } = await db()
    .from("pp_inscripciones")
    .select("id")
    .eq("matricula_norm", matricula_norm)
    .in("estado", ESTADOS_QUE_CUENTAN as unknown as string[])
    .limit(1);
  if (dup?.length)
    return NextResponse.json(
      { ok: false, errores: { matricula: "Esta matrícula ya tiene una solicitud. Si creés que es un error, escribinos por WhatsApp." } },
      { status: 409 },
    );

  const datos = {
    nombre: txt(body.nombre),
    matricula: txt(body.matricula, 40),
    matricula_norm,
    email: txt(body.email).toLowerCase(),
    whatsapp: normWhatsapp(txt(body.whatsapp, 40)),
    concentracion: txt(body.concentracion, 20),
    acepta_datos: true,
    updated_at: new Date().toISOString(),
  };

  const idPrevio = txt(body.id, 60);
  if (idPrevio) {
    const { data: upd } = await db().from("pp_inscripciones").update(datos).eq("id", idPrevio).eq("estado", "parcial").select("id");
    if (upd?.length) return NextResponse.json({ ok: true, id: idPrevio });
  }

  const { data, error } = await db()
    .from("pp_inscripciones")
    .insert({
      ...datos,
      utm_source: txt(body.utm_source),
      utm_medium: txt(body.utm_medium),
      utm_campaign: txt(body.utm_campaign),
      utm_content: txt(body.utm_content),
      utm_term: txt(body.utm_term),
      campaign_id: txt(body.campaign_id, 60),
      adset_id: txt(body.adset_id, 60),
      ad_id: txt(body.ad_id, 60),
      fbclid: txt(body.fbclid, 500),
      fbp: txt(body.fbp, 200),
      fbc: txt(body.fbc, 500),
      landing_url: txt(body.landing_url, 500),
      user_agent: txt(req.headers.get("user-agent"), 300),
    })
    .select("id")
    .single();

  if (error || !data) return NextResponse.json({ ok: false, error: "No pudimos guardar tus datos. Probá de nuevo." }, { status: 500 });
  return NextResponse.json({ ok: true, id: data.id });
}

// Paso 2: datos de envío + bases. Acá se confirma la solicitud (el Lead se cuenta solo si esto sale bien).
export async function PATCH(req: Request) {
  const body = await req.json().catch(() => ({}));
  const id = txt(body.id, 60);
  const errores = validar(PASO2, body);
  if (body.entrega !== "retiro" && body.entrega !== "envio") errores.entrega = "Elegí cómo querés recibir las jeringas.";
  if (body.entrega === "envio") {
    if (txt(body.domicilio).length < 5) errores.domicilio = "Escribí calle, número y, si corresponde, piso o consultorio.";
    if (!/^[A-Za-z]?\d{4}[A-Za-z]{0,3}$/.test(txt(body.codigo_postal, 12).replace(/\s/g, ""))) errores.codigo_postal = "Escribí un código postal válido (ej: 1425 o C1425ABC).";
  }
  if (!body.acepta_bases) errores.acepta_bases = "Tenés que aceptar las bases y el compromiso de presentar el caso.";
  if (!id) return NextResponse.json({ ok: false, error: "Falta completar el paso 1." }, { status: 400 });
  if (Object.keys(errores).length) return NextResponse.json({ ok: false, errores }, { status: 400 });

  const config = await getConfig();
  const estado = calcularEstado(config, await getConteo());
  if (estado.motivo === "fecha" || estado.motivo === "manual")
    return NextResponse.json({ ok: false, error: MSG_CERRADO, cerrado: true }, { status: 409 });

  const envio = body.entrega === "envio";
  const datos = {
    entrega: envio ? "envio" : "retiro",
    domicilio: envio ? txt(body.domicilio) : "",
    codigo_postal: envio ? txt(body.codigo_postal, 12).toUpperCase() : "",
    localidad: txt(body.localidad),
    provincia: txt(body.provincia),
    tipo_matricula: txt(body.tipo_matricula),
    especialidad: txt(body.especialidad),
    marca_actual: txt(body.marca_actual),
    blanqueamientos_mes: txt(body.blanqueamientos_mes),
    acepta_bases: true,
    acepta_publicacion: Boolean(body.acepta_publicacion),
    acepta_novedades: Boolean(body.acepta_novedades),
  };

  // Stock de la concentración elegida en el paso 1 (la función cuenta solo esa concentración)
  const { data: previo } = await db().from("pp_inscripciones").select("concentracion").eq("id", id).maybeSingle();
  const conc = config.concentraciones.find((c) => c.valor === previo?.concentracion);
  const { data, error } = await db().rpc("pp_confirmar", { p_id: id, p_datos: datos, p_cupo: conc ? stockDe(conc.stock) : 0 });
  if (error) return NextResponse.json({ ok: false, error: "No pudimos confirmar tu solicitud. Probá de nuevo." }, { status: 500 });
  if (data === "cupo") return NextResponse.json({ ok: false, error: "Se agotó la concentración que elegiste. Volvé al paso 1 y elegí otra.", agotada: true }, { status: 409 });
  if (data === "duplicada") return NextResponse.json({ ok: false, error: "Esta matrícula ya tiene una solicitud." }, { status: 409 });
  if (data !== "ok") return NextResponse.json({ ok: false, error: "No encontramos tu solicitud. Volvé a empezar." }, { status: 404 });

  const { data: fila } = await db().from("pp_inscripciones").select("*").eq("id", id).single();
  await enviarLeadCapi({
    eventId: `lead-${id}`,
    url: fila?.landing_url || req.headers.get("referer") || "",
    ip: (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || null,
    ua: req.headers.get("user-agent"),
    fbp: fila?.fbp,
    fbc: fila?.fbc,
    concentracion: fila?.concentracion,
  });

  if (fila) await avisarNuevaSolicitud(fila, req.headers.get("origin") || fila.landing_url || "https://primera-perla.vercel.app");

  return NextResponse.json({ ok: true, eventId: `lead-${id}` });
}
