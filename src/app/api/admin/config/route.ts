import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { esAdmin } from "@/lib/auth";
import { db } from "@/lib/supabase";
import { getConfig } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await esAdmin())) return NextResponse.json({ ok: false }, { status: 401 });
  return NextResponse.json({ ok: true, config: await getConfig() });
}

export async function PUT(req: Request) {
  if (!(await esAdmin())) return NextResponse.json({ ok: false }, { status: 401 });
  const { config } = await req.json().catch(() => ({}));
  if (!config || typeof config !== "object") return NextResponse.json({ ok: false }, { status: 400 });
  const { error } = await db().from("pp_config").upsert({ key: "main", value: config, updated_at: new Date().toISOString() });
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  revalidatePath("/");
  return NextResponse.json({ ok: true });
}
