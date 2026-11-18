import Landing from "@/components/landing/Landing";
import { calcularEstado, getConfig, getInscriptos } from "@/lib/data";

export const revalidate = 30;

export default async function Page() {
  const config = await getConfig();
  const estado = calcularEstado(config, await getInscriptos());
  return <Landing config={config} estadoInicial={estado} />;
}
