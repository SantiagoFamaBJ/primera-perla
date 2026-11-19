import type { Metadata, Viewport } from "next";
import "@fontsource/montserrat/400.css";
import "@fontsource/montserrat/600.css";
import "@fontsource/montserrat/700.css";
import "@fontsource/montserrat/800.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Muestra gratis de Densell White para odontólogos | Dental Medrano",
  description:
    "Pedí una jeringa de Densell White sin cargo (CP 10, 16, 22 o 35%). Envío gratis. Exclusivo para odontólogos matriculados de Argentina. Programa de casos clínicos de Dental Medrano.",
  openGraph: {
    title: "Probá Densell White gratis en tu consultorio",
    description: "Muestra y envío sin cargo. Exclusivo para odontólogos matriculados de Argentina.",
    images: ["/img/jeringa.png"],
    locale: "es_AR",
    type: "website",
  },
};

export const viewport: Viewport = { themeColor: "#ffffff", width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-AR">
      <body>{children}</body>
    </html>
  );
}
