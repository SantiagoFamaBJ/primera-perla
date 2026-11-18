import { esAdmin } from "@/lib/auth";
import { db } from "@/lib/supabase";
import { ESTADOS } from "@/lib/types";

export const dynamic = "force-dynamic";

const COLS: [string, string][] = [
  ["created_at", "Fecha"], ["estado", "Estado"], ["nombre", "Nombre"], ["matricula", "Matrícula"],
  ["tipo_matricula", "Tipo matrícula"], ["provincia_matricula", "Provincia matrícula"], ["especialidad", "Especialidad"],
  ["concentracion", "Concentración"], ["whatsapp", "WhatsApp"], ["email", "Email"], ["consultorio", "Consultorio"],
  ["localidad", "Localidad"], ["provincia", "Provincia"], ["instagram", "Instagram"], ["marca_actual", "Marca actual"],
  ["blanqueamientos_mes", "Blanqueamientos/mes"], ["acepta_novedades", "Acepta novedades"], ["utm_source", "utm_source"],
  ["utm_campaign", "utm_campaign"], ["utm_content", "utm_content"], ["notas", "Notas"],
];

export async function GET() {
  if (!(await esAdmin())) return new Response("No autorizado", { status: 401 });
  const { data } = await db().from("pp_inscripciones").select("*").order("created_at", { ascending: true });
  const label = (id: string) => ESTADOS.find((e) => e.id === id)?.label ?? id;
  const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const lines = [COLS.map((c) => esc(c[1])).join(";")];
  for (const r of data ?? []) {
    lines.push(
      COLS.map(([k]) => {
        let v = r[k];
        if (k === "estado") v = label(v);
        if (k === "created_at") v = new Date(v).toLocaleString("es-AR", { timeZone: "America/Buenos_Aires" });
        if (typeof v === "boolean") v = v ? "Sí" : "No";
        return esc(v);
      }).join(";"),
    );
  }
  // BOM para que Excel abra bien los acentos
  return new Response("﻿" + lines.join("\r\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="primera-perla-inscripciones.csv"`,
    },
  });
}
