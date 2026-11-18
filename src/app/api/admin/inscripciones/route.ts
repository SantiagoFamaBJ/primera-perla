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
  const { id, estado, notas } = await req.json().catch(() => ({}));
  const cambios: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (estado !== undefined) {
    if (!ESTADOS.some((e) => e.id === estado)) return NextResponse.json({ ok: false }, { status: 400 });
    cambios.estado = estado;
  }
  if (notas !== undefined) cambios.notas = String(notas).slice(0, 2000);
  const { error } = await db().from("pp_inscripciones").update(cambios).eq("id", id);
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
