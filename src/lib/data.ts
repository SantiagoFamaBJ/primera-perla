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

export async function getInscriptos(): Promise<number> {
  try {
    const { count } = await db()
      .from("pp_inscripciones")
      .select("id", { count: "exact", head: true })
      .in("estado", ESTADOS_QUE_CUENTAN as unknown as string[]);
    return count ?? 0;
  } catch {
    return 0;
  }
}

export type Estado = { cupo: number; inscriptos: number; restantes: number; abierto: boolean; motivo: "" | "cupo" | "fecha" | "manual" };

export function calcularEstado(config: Config, inscriptos: number): Estado {
  const restantes = Math.max(0, config.cupo - inscriptos);
  let motivo: Estado["motivo"] = "";
  if (config.cerradoManual) motivo = "manual";
  else if (Date.now() > new Date(config.cierre).getTime()) motivo = "fecha";
  else if (restantes <= 0) motivo = "cupo";
  return { cupo: config.cupo, inscriptos, restantes, abierto: motivo === "", motivo };
}
