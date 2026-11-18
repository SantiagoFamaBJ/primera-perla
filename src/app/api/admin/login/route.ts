import { NextResponse } from "next/server";
import { cerrarSesion, crearSesion, esAdmin, passwordOk } from "@/lib/auth";

export async function GET() {
  return NextResponse.json({ ok: await esAdmin() });
}

export async function POST(req: Request) {
  const { password } = await req.json().catch(() => ({ password: "" }));
  if (!passwordOk(String(password || ""))) return NextResponse.json({ ok: false }, { status: 401 });
  await crearSesion();
  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  await cerrarSesion();
  return NextResponse.json({ ok: true });
}
