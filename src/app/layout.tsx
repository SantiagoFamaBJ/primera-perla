import type { Metadata, Viewport } from "next";
import "@fontsource/cormorant-garamond/latin-300.css";
import "@fontsource/cormorant-garamond/latin-300-italic.css";
import "@fontsource/cormorant-garamond/latin-400.css";
import "@fontsource/cormorant-garamond/latin-400-italic.css";
import "@fontsource/cormorant-garamond/latin-500.css";
import "@fontsource/jost/latin-300.css";
import "@fontsource/jost/latin-400.css";
import "@fontsource/jost/latin-500.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Muestra gratis de Densell White para odontólogos | Dental Medrano",
  description:
    "Pedí 2 jeringas de Densell White sin cargo (CP 10, 16 o 22%). Exclusivo para odontólogos matriculados de Argentina. Programa de casos clínicos de Dental Medrano.",
  openGraph: {
    title: "Probá Densell White gratis en tu consultorio",
    description: "2 jeringas sin cargo. Exclusivo para odontólogos matriculados de Argentina.",
    images: ["/img/jeringa.png"],
    locale: "es_AR",
    type: "website",
  },
};

export const viewport: Viewport = { themeColor: "#121110", width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-AR">
      <body>{children}</body>
    </html>
  );
}
