import Landing from "@/components/landing/Landing";
import { calcularEstado, getConfig, getConteo } from "@/lib/data";

export const revalidate = 30;

export default async function Page() {
  const config = await getConfig();
  const estado = calcularEstado(config, await getConteo());
  return <Landing config={config} estadoInicial={estado} />;
}
