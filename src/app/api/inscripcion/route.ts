import { NextResponse } from "next/server";
import { db } from "@/lib/supabase";
import { calcularEstado, getConfig, getInscriptos } from "@/lib/data";
import { ESTADOS_QUE_CUENTAN } from "@/lib/types";
import { PASO1, PASO2, normMatricula, normWhatsapp, validar } from "@/lib/validate";

export const dynamic = "force-dynamic";

const txt = (v: unknown, max = 200) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const MSG_CERRADO = "La inscripción está cerrada: se agotó el stock o terminó el plazo.";

// Paso 1: datos clave. Se guarda como "incompleta" (no ocupa cupo todavía).
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const errores = validar(PASO1, body);
  if (!body.acepta_datos) errores.acepta_datos = "Necesitamos tu autorización para usar tus datos.";
  if (Object.keys(errores).length) return NextResponse.json({ ok: false, errores }, { status: 400 });

  const config = await getConfig();
  const estado = calcularEstado(config, await getInscriptos());
  if (!estado.abierto) return NextResponse.json({ ok: false, error: MSG_CERRADO, cerrado: true }, { status: 409 });

  const matricula_norm = normMatricula(body.matricula);
  const { data: dup } = await db()
    .from("pp_inscripciones")
    .select("id")
    .eq("matricula_norm", matricula_norm)
    .in("estado", ESTADOS_QUE_CUENTAN as unknown as string[])
    .limit(1);
  if (dup?.length)
    return NextResponse.json(
      { ok: false, errores: { matricula: "Esta matrícula ya está inscripta. Si creés que es un error, escribinos por WhatsApp." } },
      { status: 409 },
    );

  const { data, error } = await db()
    .from("pp_inscripciones")
    .insert({
      nombre: txt(body.nombre),
      matricula: txt(body.matricula, 40),
      matricula_norm,
      email: txt(body.email).toLowerCase(),
      whatsapp: normWhatsapp(txt(body.whatsapp, 40)),
      concentracion: txt(body.concentracion, 20),
      acepta_datos: true,
      utm_source: txt(body.utm_source),
      utm_medium: txt(body.utm_medium),
      utm_campaign: txt(body.utm_campaign),
      utm_content: txt(body.utm_content),
      utm_term: txt(body.utm_term),
      fbclid: txt(body.fbclid, 500),
      landing_url: txt(body.landing_url, 500),
      user_agent: txt(req.headers.get("user-agent"), 300),
    })
    .select("id")
    .single();

  if (error || !data) return NextResponse.json({ ok: false, error: "No pudimos guardar tus datos. Probá de nuevo." }, { status: 500 });
  return NextResponse.json({ ok: true, id: data.id });
}

// Paso 2: datos de consultorio + bases. Acá se confirma y ocupa cupo.
export async function PATCH(req: Request) {
  const body = await req.json().catch(() => ({}));
  const id = txt(body.id, 60);
  const errores = validar(PASO2, body);
  if (!body.acepta_bases) errores.acepta_bases = "Tenés que aceptar las bases y condiciones.";
  if (!id) return NextResponse.json({ ok: false, error: "Falta completar el paso 1." }, { status: 400 });
  if (Object.keys(errores).length) return NextResponse.json({ ok: false, errores }, { status: 400 });

  const config = await getConfig();
  const estado = calcularEstado(config, await getInscriptos());
  if (estado.motivo === "fecha" || estado.motivo === "manual")
    return NextResponse.json({ ok: false, error: MSG_CERRADO, cerrado: true }, { status: 409 });

  const datos = {
    tipo_matricula: txt(body.tipo_matricula),
    provincia_matricula: txt(body.provincia_matricula),
    especialidad: txt(body.especialidad),
    consultorio: txt(body.consultorio),
    localidad: txt(body.localidad),
    provincia: txt(body.provincia),
    instagram: txt(body.instagram, 80),
    marca_actual: txt(body.marca_actual),
    blanqueamientos_mes: txt(body.blanqueamientos_mes),
    acepta_bases: true,
    acepta_novedades: Boolean(body.acepta_novedades),
  };

  const { data, error } = await db().rpc("pp_confirmar", { p_id: id, p_datos: datos, p_cupo: config.cupo });
  if (error) return NextResponse.json({ ok: false, error: "No pudimos confirmar tu inscripción. Probá de nuevo." }, { status: 500 });
  if (data === "cupo") return NextResponse.json({ ok: false, error: "Se agotó el stock disponible para el programa. Gracias por tu interés.", cerrado: true }, { status: 409 });
  if (data === "duplicada") return NextResponse.json({ ok: false, error: "Esta matrícula ya está inscripta." }, { status: 409 });
  if (data !== "ok") return NextResponse.json({ ok: false, error: "No encontramos tu inscripción. Volvé a empezar." }, { status: 404 });
  return NextResponse.json({ ok: true });
}
