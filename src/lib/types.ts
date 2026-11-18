export type Concentracion = {
  valor: string; // "CP 10%"
  numero: string; // "10"
  nivel: string; // "Ambulatorio" / "En consultorio"
  descripcion: string;
  codigo: string;
  detalles: string; // una característica por línea (según la ficha)
};

export type Producto = { nombre: string; detalle: string; imagen: string; link: string };
export type Caso = { antes: string; despues: string; profesional: string; detalle: string };
export type Faq = { pregunta: string; respuesta: string };

export type Config = {
  programa: string; // nombre del programa (arriba de todo)
  descuentoExtra: string; // texto del 10% OFF
  descuentoExtraMinimo: string; // "$200.000"
  cupo: number; // interno: no se muestra en la web
  cierre: string; // ISO con zona horaria
  cerradoManual: boolean;
  pixelId: string;
  webUrl: string;
  webLabel: string;
  whatsapp: string; // solo números, ej 5491164362400
  whatsappTexto: string;
  heroTitulo: string;
  heroBajada: string;
  concentraciones: Concentracion[];
  caracteristicas: string[];
  productos: Producto[];
  casos: Caso[];
  faq: Faq[];
  razonSocial: string;
  cuit: string;
};

export const ESTADOS = [
  { id: "parcial", label: "Incompleta", cuenta: false },
  { id: "pendiente", label: "Pendiente de validar", cuenta: true },
  { id: "aprobada", label: "Aprobada", cuenta: true },
  { id: "enviada", label: "Jeringa enviada", cuenta: true },
  { id: "caso_recibido", label: "Caso recibido", cuenta: true },
  { id: "rechazada", label: "Rechazada", cuenta: false },
] as const;

export const ESTADOS_QUE_CUENTAN = ESTADOS.filter((e) => e.cuenta).map((e) => e.id);
