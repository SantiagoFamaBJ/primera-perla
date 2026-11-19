"use client";

import Script from "next/script";
import { useEffect } from "react";
import { useLanding } from "./shared";

// UTM + IDs dinámicos de Meta. En el anuncio, usar por ejemplo:
// ?utm_source=meta&utm_medium=paid&utm_campaign={{campaign.name}}&utm_content={{ad.name}}&campaign_id={{campaign.id}}&adset_id={{adset.id}}&ad_id={{ad.id}}
const KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "campaign_id", "adset_id", "ad_id", "fbclid"];

function cookie(nombre: string) {
  return document.cookie.split("; ").find((c) => c.startsWith(nombre + "="))?.split("=")[1] || "";
}

export default function Pixel() {
  const { config } = useLanding();

  useEffect(() => {
    try {
      const p = new URLSearchParams(location.search);
      const prev = JSON.parse(sessionStorage.getItem("pp_utm") || "{}");
      const now: Record<string, string> = { ...prev };
      KEYS.forEach((k) => { const v = p.get(k); if (v) now[k] = v; });
      if (!now.landing_url) now.landing_url = location.href;
      // fbc a partir del fbclid si el Pixel todavía no creó la cookie
      if (now.fbclid && !now.fbc) now.fbc = `fb.1.${Date.now()}.${now.fbclid}`;
      sessionStorage.setItem("pp_utm", JSON.stringify(now));
    } catch {}
  }, []);

  const pixel = config.pixelId?.replace(/\D/g, "");
  const ga = config.gaId?.trim().match(/^G-[A-Z0-9]+$/i)?.[0];
  return (
    <>
      {pixel && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${pixel}');fbq('track','PageView');`}
        </Script>
      )}
      {ga && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${ga}`} strategy="afterInteractive" />
          <Script id="ga4" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${ga}');`}
          </Script>
        </>
      )}
    </>
  );
}

export function leerUtm(): Record<string, string> {
  let d: Record<string, string> = {};
  try { d = JSON.parse(sessionStorage.getItem("pp_utm") || "{}"); } catch {}
  const fbp = cookie("_fbp");
  const fbc = cookie("_fbc") || d.fbc || "";
  return { ...d, fbp, fbc };
}
