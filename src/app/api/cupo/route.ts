import { NextResponse } from "next/server";
import { calcularEstado, getConfig, getInscriptos } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET() {
  const config = await getConfig();
  return NextResponse.json(calcularEstado(config, await getInscriptos()));
}
