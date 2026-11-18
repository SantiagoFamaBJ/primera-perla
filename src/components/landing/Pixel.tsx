"use client";

import Script from "next/script";
import { useEffect } from "react";
import { useLanding } from "./shared";

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid"];

export default function Pixel() {
  const { config } = useLanding();

  // Guarda los UTM de la visita para mandarlos con la inscripción
  useEffect(() => {
    try {
      const p = new URLSearchParams(location.search);
      const prev = JSON.parse(sessionStorage.getItem("pp_utm") || "{}");
      const now: Record<string, string> = { ...prev };
      UTM_KEYS.forEach((k) => { const v = p.get(k); if (v) now[k] = v; });
      if (!now.landing_url) now.landing_url = location.href;
      sessionStorage.setItem("pp_utm", JSON.stringify(now));
    } catch {}
  }, []);

  const id = config.pixelId?.replace(/\D/g, "");
  if (!id) return null;
  return (
    <Script id="meta-pixel" strategy="afterInteractive">
      {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${id}');fbq('track','PageView');`}
    </Script>
  );
}

export function leerUtm(): Record<string, string> {
  try { return JSON.parse(sessionStorage.getItem("pp_utm") || "{}"); } catch { return {}; }
}
