import { esAdmin } from "@/lib/auth";
import { db } from "@/lib/supabase";
import { ESTADOS } from "@/lib/types";

export const dynamic = "force-dynamic";

const COLS: [string, string][] = [
  ["created_at", "Fecha"], ["estado", "Estado"], ["nombre", "Nombre"], ["matricula", "Matrícula"],
  ["tipo_matricula", "Tipo matrícula"], ["provincia_matricula", "Provincia matrícula"], ["especialidad", "Especialidad"],
  ["concentracion", "Concentración"], ["whatsapp", "WhatsApp"], ["email", "Email"],
  ["entrega", "Entrega"], ["domicilio", "Domicilio"], ["codigo_postal", "CP"], ["localidad", "Localidad"], ["provincia", "Provincia"],
  ["marca_actual", "Marca actual"], ["blanqueamientos_mes", "Blanqueamientos/mes"],
  ["acepta_publicacion", "Autoriza publicación"], ["acepta_novedades", "Acepta novedades"],
  ["aprobada_at", "Aprobada"], ["rechazada_at", "Rechazada"], ["enviada_at", "Enviada"], ["entregada_at", "Entregada"], ["caso_recibido_at", "Caso recibido"],
  ["cupon_codigo", "Cupón"], ["cupon_entregado_at", "Cupón entregado"], ["cupon_usado_at", "Cupón usado"], ["compra_monto", "Compra $"], ["compra_detalle", "Compra detalle"],
  ["utm_source", "utm_source"], ["utm_medium", "utm_medium"], ["utm_campaign", "utm_campaign"], ["utm_content", "utm_content"],
  ["campaign_id", "campaign_id"], ["adset_id", "adset_id"], ["ad_id", "ad_id"], ["notas", "Notas"],
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
        if ((k === "created_at" || k.endsWith("_at")) && v) v = new Date(v).toLocaleString("es-AR", { timeZone: "America/Buenos_Aires" });
        if (typeof v === "boolean") v = v ? "Sí" : "No";
        return esc(v);
      }).join(";"),
    );
  }
  // BOM para que Excel abra bien los acentos
  return new Response("﻿" + lines.join("\r\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="inscripciones-muestras-densell-white.csv"`,
    },
  });
}
