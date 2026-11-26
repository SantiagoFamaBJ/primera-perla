import { NextResponse } from "next/server";
import { esAdmin } from "@/lib/auth";
import { db } from "@/lib/supabase";
import { ESTADOS } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await esAdmin())) return NextResponse.json({ ok: false }, { status: 401 });
  const { data, error } = await db().from("pp_inscripciones").select("*").order("created_at", { ascending: false }).limit(2000);
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, rows: data });
}

export async function PATCH(req: Request) {
  if (!(await esAdmin())) return NextResponse.json({ ok: false }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const { id, estado, notas } = body;
  const cambios: Record<string, unknown> = { updated_at: new Date().toISOString() };
  // Seguimiento comercial editable desde el admin
  for (const k of ["cupon_codigo", "compra_detalle"]) if (body[k] !== undefined) cambios[k] = String(body[k]).slice(0, 300) || null;
  for (const k of ["cupon_entregado_at", "cupon_usado_at"]) if (body[k] !== undefined) cambios[k] = body[k] ? new Date(body[k]).toISOString() : null;
  if (body.compra_monto !== undefined) cambios.compra_monto = body.compra_monto === "" || body.compra_monto === null ? null : Number(String(body.compra_monto).replace(/[^\d.]/g, "")) || null;
  if (estado !== undefined) {
    if (!ESTADOS.some((e) => e.id === estado)) return NextResponse.json({ ok: false }, { status: 400 });
    cambios.estado = estado;
  }
  if (notas !== undefined) cambios.notas = String(notas).slice(0, 2000);
  const { error } = await db().from("pp_inscripciones").update(cambios).eq("id", id);
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  if (!(await esAdmin())) return NextResponse.json({ ok: false }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const ids = (Array.isArray(body.ids) ? body.ids : [body.id]).filter((x: unknown) => typeof x === "string" && /^[0-9a-f-]{36}$/i.test(x)).slice(0, 500);
  if (!ids.length) return NextResponse.json({ ok: false }, { status: 400 });
  const { error } = await db().from("pp_inscripciones").delete().in("id", ids);
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, borradas: ids.length });
}
