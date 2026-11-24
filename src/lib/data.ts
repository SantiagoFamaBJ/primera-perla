import "server-only";
import { db } from "./supabase";
import { DEFAULTS } from "./defaults";
import { ESTADOS_QUE_CUENTAN, type Config } from "./types";

export async function getConfig(): Promise<Config> {
  try {
    const { data, error } = await db().from("pp_config").select("value").eq("key", "main").maybeSingle();
    if (error || !data) return DEFAULTS;
    return { ...DEFAULTS, ...(data.value as Partial<Config>) };
  } catch {
    return DEFAULTS;
  }
}

/** Solicitudes que ocupan stock, por concentración ("CP 10%" → 7). */
export async function getConteo(): Promise<Record<string, number>> {
  try {
    const { data } = await db()
      .from("pp_inscripciones")
      .select("concentracion")
      .in("estado", ESTADOS_QUE_CUENTAN as unknown as string[])
      .limit(5000);
    const c: Record<string, number> = {};
    for (const r of data ?? []) c[r.concentracion] = (c[r.concentracion] || 0) + 1;
    return c;
  } catch {
    return {};
  }
}

export const stockDe = (v: number | string | undefined) => {
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? Math.floor(n) : 0;
};

export type Estado = { abierto: boolean; motivo: "" | "cupo" | "fecha" | "manual"; agotadas: string[] };

export function calcularEstado(config: Config, conteo: Record<string, number>): Estado {
  const agotadas = config.concentraciones.filter((c) => (conteo[c.valor] || 0) >= stockDe(c.stock)).map((c) => c.valor);
  let motivo: Estado["motivo"] = "";
  if (config.cerradoManual) motivo = "manual";
  else if (Date.now() > new Date(config.cierre).getTime()) motivo = "fecha";
  else if (agotadas.length >= config.concentraciones.length) motivo = "cupo";
  return { abierto: motivo === "", motivo, agotadas };
}
