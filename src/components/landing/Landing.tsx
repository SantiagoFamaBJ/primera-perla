"use client";

import { useCallback, useEffect, useState } from "react";
import { MotionConfig } from "framer-motion";
import type { Config } from "@/lib/types";
import type { Estado } from "@/lib/data";
import { LandingCtx } from "./shared";
import Header from "./Header";
import Hero from "./Hero";
import Marquee from "./Marquee";
import Pasos from "./Pasos";
import Concentraciones from "./Concentraciones";
import Resultado from "./Resultado";
import Beneficio from "./Beneficio";
import Formulario from "./Formulario";
import Casos from "./Casos";
import Faq from "./Faq";
import CtaFinal from "./CtaFinal";
import Footer from "./Footer";
import Flotantes from "./Flotantes";
import Bases from "./Bases";
import Pixel from "./Pixel";

export default function Landing({ config, estadoInicial }: { config: Config; estadoInicial: Estado }) {
  const [estado, setEstado] = useState(estadoInicial);
  const [seleccion, setSeleccion] = useState("");
  const [basesAbiertas, setBasesAbiertas] = useState(false);

  // Cupo en vivo: se actualiza cada 45 segundos
  useEffect(() => {
    const t = setInterval(async () => {
      try {
        const r = await fetch("/api/cupo", { cache: "no-store" });
        if (r.ok) setEstado(await r.json());
      } catch {}
    }, 45000);
    return () => clearInterval(t);
  }, []);

  const elegir = useCallback((valor: string) => {
    setSeleccion(valor);
    document.getElementById("formulario")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <LandingCtx.Provider value={{ config, estado, seleccion, elegir, abrirBases: () => setBasesAbiertas(true) }}>
      <MotionConfig reducedMotion="user">
        <Pixel />
        <Header />
        <main>
          <Hero />
          <Marquee />
          <Pasos />
          <Concentraciones />
          <Resultado />
          <Casos />
          <Beneficio />
          <Formulario onEstado={setEstado} onSeleccion={setSeleccion} />
          <Faq />
          <CtaFinal />
        </main>
        <Footer />
        <Flotantes />
        <Bases abierto={basesAbiertas} onClose={() => setBasesAbiertas(false)} />
      </MotionConfig>
    </LandingCtx.Provider>
  );
}
