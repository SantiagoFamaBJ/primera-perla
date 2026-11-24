export type Concentracion = {
  valor: string; // "CP 10%"
  numero: string; // "10"
  nivel: string; // "Ambulatorio" / "En consultorio"
  descripcion: string;
  codigo: string;
  presentacion: string;
  indicacion: string; // para qué se indica (según la ficha)
  protocolo: string; // protocolo de referencia (según la ficha); vacío = "según indicación profesional"
  detalles: string; // formulación / características, una por línea (según la ficha)
  stock: number | string; // solicitudes disponibles de esta concentración (cada solicitud = 2 jeringas)
};

export type Producto = { nombre: string; detalle: string; imagen: string; link: string };
export type Caso = { antes: string; despues: string; profesional: string; detalle: string };
export type Faq = { pregunta: string; respuesta: string };

export type Config = {
  programa: string; // nombre del programa (arriba de todo)
  mostrarDescuentoExtra: boolean; // muestra u oculta el 10% OFF en toda la web
  descuentoExtra: string; // texto del 10% OFF
  descuentoExtraMinimo: string; // "$200.000"
  cupo: number; // ya no se usa: el stock es por concentración
  cierre: string; // ISO con zona horaria
  cerradoManual: boolean;
  pixelId: string;
  gaId: string; // Google Analytics 4 (G-XXXX), opcional
  webUrl: string;
  webLabel: string;
  plazoEnvio: string; // texto opcional sobre tiempos de envío (vacío = no se muestra)
  retiroLugar: string; // dónde se retira sin cargo
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
  { id: "enviada", label: "Enviada / lista para retirar", cuenta: true },
  { id: "entregada", label: "Entregada", cuenta: true },
  { id: "caso_recibido", label: "Caso recibido", cuenta: true },
  { id: "rechazada", label: "Rechazada", cuenta: false },
] as const;

export const ESTADOS_QUE_CUENTAN = ESTADOS.filter((e) => e.cuenta).map((e) => e.id);
