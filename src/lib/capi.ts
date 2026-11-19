import "server-only";

// Conversions API de Meta (opcional). Solo se activa si están META_PIXEL_ID y META_CAPI_TOKEN en Vercel.
// Usa el mismo event_id que el Pixel del navegador, así Meta deduplica el Lead.
// No envía datos personales ni clínicos: solo identificadores técnicos de Meta (fbp/fbc), IP y navegador.
export async function enviarLeadCapi(opts: { eventId: string; url: string; ip?: string | null; ua?: string | null; fbp?: string | null; fbc?: string | null; concentracion?: string }) {
  const pixel = process.env.META_PIXEL_ID;
  const token = process.env.META_CAPI_TOKEN;
  if (!pixel || !token) return;
  const user_data: Record<string, string> = {};
  if (opts.ip) user_data.client_ip_address = opts.ip;
  if (opts.ua) user_data.client_user_agent = opts.ua;
  if (opts.fbp) user_data.fbp = opts.fbp;
  if (opts.fbc) user_data.fbc = opts.fbc;
  try {
    await fetch(`https://graph.facebook.com/v21.0/${pixel}/events?access_token=${encodeURIComponent(token)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data: [{
          event_name: "Lead",
          event_time: Math.floor(Date.now() / 1000),
          event_id: opts.eventId,
          action_source: "website",
          event_source_url: opts.url,
          user_data,
          custom_data: { content_name: "Muestra Densell White", content_category: opts.concentracion || "" },
        }],
      }),
      signal: AbortSignal.timeout(4000),
    });
  } catch {
    // Si falla, el Lead igual queda registrado por el Pixel del navegador.
  }
}
