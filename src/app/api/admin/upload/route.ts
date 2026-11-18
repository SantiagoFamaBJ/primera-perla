import { NextResponse } from "next/server";
import { esAdmin } from "@/lib/auth";
import { db } from "@/lib/supabase";

export async function POST(req: Request) {
  if (!(await esAdmin())) return NextResponse.json({ ok: false }, { status: 401 });
  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ ok: false, error: "Falta el archivo" }, { status: 400 });
  if (!file.type.startsWith("image/")) return NextResponse.json({ ok: false, error: "Tiene que ser una imagen" }, { status: 400 });
  if (file.size > 8 * 1024 * 1024) return NextResponse.json({ ok: false, error: "La imagen pesa más de 8 MB" }, { status: 400 });
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
  const path = `casos/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await db().storage.from("pp-casos").upload(path, file, { contentType: file.type });
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  const { data } = db().storage.from("pp-casos").getPublicUrl(path);
  return NextResponse.json({ ok: true, url: data.publicUrl });
}
