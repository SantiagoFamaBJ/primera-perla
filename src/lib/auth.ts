import "server-only";
import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE = "pp_admin";
const secret = () => (process.env.ADMIN_PASSWORD || "dm2026") + (process.env.SUPABASE_SERVICE_ROLE_KEY || "");

function firmar(exp: number) {
  return `${exp}.${createHmac("sha256", secret()).update(String(exp)).digest("hex")}`;
}

export function passwordOk(pw: string) {
  const a = Buffer.from(pw || "");
  const b = Buffer.from(process.env.ADMIN_PASSWORD || "dm2026");
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function crearSesion() {
  const exp = Date.now() + 1000 * 60 * 60 * 24 * 7;
  (await cookies()).set(COOKIE, firmar(exp), { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 7 });
}

export async function cerrarSesion() {
  (await cookies()).delete(COOKIE);
}

export async function esAdmin() {
  const v = (await cookies()).get(COOKIE)?.value;
  if (!v) return false;
  const exp = Number(v.split(".")[0]);
  if (!exp || exp < Date.now()) return false;
  const esperado = firmar(exp);
  return v.length === esperado.length && timingSafeEqual(Buffer.from(v), Buffer.from(esperado));
}
