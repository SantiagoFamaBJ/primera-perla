import type { Metadata, Viewport } from "next";
import "@fontsource/montserrat/400.css";
import "@fontsource/montserrat/500.css";
import "@fontsource/montserrat/600.css";
import "@fontsource/montserrat/700.css";
import "@fontsource/montserrat/800.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Probá Densell White gratis | Dental Medrano",
  description:
    "Jeringas de Densell White sin cargo para odontólogos que quieran probarlo con un paciente y compartir su caso clínico.",
  openGraph: {
    title: "Probá Densell White gratis en tu consultorio",
    description: "Pedí tu jeringa de 2 ml sin cargo. Cupo limitado para odontólogos con matrícula vigente.",
    images: ["/img/jeringa.png"],
    locale: "es_AR",
    type: "website",
  },
};

export const viewport: Viewport = { themeColor: "#000000", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-AR">
      <body>{children}</body>
    </html>
  );
}
