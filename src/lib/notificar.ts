import "server-only";

// Aviso por mail de cada solicitud confirmada (opcional).
// Usa Resend (plan gratis: 3.000 mails por mes). Se activa con estas variables en Vercel:
//   RESEND_API_KEY  → la clave de resend.com
//   NOTIFY_EMAIL    → a quién avisar (uno o varios separados por coma)
//   NOTIFY_FROM     → opcional; si no está, usa el remitente de prueba de Resend
// Si falta la clave o el mail, no hace nada y la solicitud se guarda igual.
type Datos = Record<string, string | boolean | null | undefined>;

const esc = (v: unknown) => String(v ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c] as string);

export async function avisarNuevaSolicitud(d: Datos, origenUrl: string) {
  const key = process.env.RESEND_API_KEY;
  const para = (process.env.NOTIFY_EMAIL || "").split(",").map((s) => s.trim()).filter(Boolean);
  if (!key || !para.length) return;

  const filas: [string, unknown][] = [
    ["Nombre", d.nombre],
    ["Matrícula", `${d.matricula ?? ""} ${d.tipo_matricula ? `(${d.tipo_matricula})` : ""}`],
    ["Concentración", d.concentracion],
    ["WhatsApp", d.whatsapp],
    ["Email", d.email],
    ["Domicilio", `${d.domicilio ?? ""} · CP ${d.codigo_postal ?? ""}`],
    ["Localidad", `${d.localidad ?? ""}, ${d.provincia ?? ""}`],
    ["Especialidad", d.especialidad],
    ["Usa hoy", d.marca_actual],
    ["Blanqueamientos/mes", d.blanqueamientos_mes],
    ["Autoriza publicar", d.acepta_publicacion ? "Sí" : "No"],
    ["Acepta novedades", d.acepta_novedades ? "Sí" : "No"],
    ["Origen", [d.utm_source, d.utm_campaign, d.utm_content].filter(Boolean).join(" / ") || "—"],
  ];

  let admin = "";
  try { admin = new URL("/ADMIN", origenUrl).toString(); } catch {}

  const html = `<div style="font-family:Arial,sans-serif;max-width:560px">
    <h2 style="margin:0 0 4px">Nueva solicitud de muestra Densell White</h2>
    <p style="margin:0 0 16px;color:#555">${esc(d.nombre)} pidió ${esc(d.concentracion)}.</p>
    <table style="border-collapse:collapse;width:100%;font-size:14px">
      ${filas.map(([k, v]) => `<tr><td style="padding:6px 8px;border-bottom:1px solid #eee;color:#777;width:40%">${esc(k)}</td><td style="padding:6px 8px;border-bottom:1px solid #eee">${esc(v) || "—"}</td></tr>`).join("")}
    </table>
    ${admin ? `<p style="margin-top:18px"><a href="${esc(admin)}" style="background:#f05922;color:#fff;padding:10px 18px;border-radius:999px;text-decoration:none">Ver en el admin</a></p>` : ""}
  </div>`;

  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.NOTIFY_FROM || "Muestras Densell White <onboarding@resend.dev>",
        to: para,
        subject: `Nueva solicitud: ${String(d.nombre ?? "").slice(0, 60)} · ${d.concentracion ?? ""}`,
        html,
      }),
      signal: AbortSignal.timeout(5000),
    });
  } catch {
    // Si el mail falla, la solicitud ya quedó guardada en Supabase.
  }
}
