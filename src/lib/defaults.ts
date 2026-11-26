import type { Config } from "./types";

// Valores iniciales. Todo se puede cambiar desde /ADMIN → Configuración.
export const DEFAULTS: Config = {
  programa: "Programa Casos Clínicos",
  mostrarDescuentoExtra: false,
  descuentoExtra: "10% OFF en todas tus compras",
  descuentoExtraMinimo: "$200.000",
  cupo: 40,
  cierre: "2026-12-23T23:59:59-03:00",
  cerradoManual: false,
  pixelId: "",
  gaId: "",
  webUrl: "https://dentalmedrano.com",
  webLabel: "dentalmedrano.com",
  plazoEnvio: "",
  retiroLugar: "Professional Center, Marcelo T. de Alvear 2063, CABA",
  whatsapp: "5491164362400",
  whatsappTexto: "¡Hola! Vi el programa de muestras de Densell White y quiero hacer una consulta.",
  heroTitulo: "Probá Densell White gratis en tu consultorio.",
  heroBajada:
    "Elegí la concentración que querés probar, recibí 2 jeringas sin cargo y compartí tu experiencia clínica. Además, obtené un 20% OFF en tu próxima compra de Densell White.",
  // Datos tomados de las fichas de dentalmedrano.com (jeringas individuales y Full Kit Home).
  concentraciones: [
    {
      valor: "CP 10%", numero: "10", nivel: "Ambulatorio", presentacion: "2 jeringas de 2 ml", codigo: "006529", stock: 20,
      descripcion: "Gel blanqueador con peróxido de carbamida al 10%.",
      indicacion: "Blanqueamiento ambulatorio bajo supervisión profesional. Permite complementar o continuar tratamientos domiciliarios.",
      protocolo: "",
      detalles: "",
    },
    {
      valor: "CP 16%", numero: "16", nivel: "Ambulatorio", presentacion: "2 jeringas de 2 ml", codigo: "006531", stock: 20,
      descripcion: "Gel blanqueador con peróxido de carbamida al 16%.",
      indicacion: "Blanqueamiento ambulatorio bajo supervisión profesional. Permite complementar o continuar tratamientos domiciliarios.",
      protocolo: "2 semanas en el hogar, o 1 semana como complemento de un tratamiento en consultorio.",
      detalles: "",
    },
    {
      valor: "CP 22%", numero: "22", nivel: "Ambulatorio o consultorio", presentacion: "2 jeringas de 2 ml", codigo: "006533", stock: 20,
      descripcion: "Gel blanqueador con peróxido de carbamida al 22%.",
      indicacion: "Blanqueamiento ambulatorio o en consultorio.",
      protocolo: "2 semanas en el hogar, o 1 semana como complemento de un tratamiento en consultorio.",
      detalles: "pH neutro y alta viscosidad\nAgente desensibilizante incorporado\nLibera flúor",
    },
  ],
  caracteristicas: [],
  productos: [
    {
      nombre: "Densell White Light LED CP22%",
      detalle: "Kit domiciliario con luz LED azul",
      imagen: "https://dentalmedrano.com/wp-content/uploads/2025/05/6534-2.jpg",
      link: "https://dentalmedrano.com/producto/blanq-densell-white-light-led-cp22-4jeringasluzcubeta/",
    },
    {
      nombre: "Densell White CP22% – Full Kit Home",
      detalle: "Kit ambulatorio completo",
      imagen: "https://dentalmedrano.com/wp-content/uploads/2025/05/6532-1.jpg",
      link: "https://dentalmedrano.com/producto/blanq-densell-white-cp22-full-kit-home-42jeringas2placas-c4/",
    },
  ],
  casos: [],
  faq: [
    { pregunta: "¿Tiene algún costo?", respuesta: "Las 2 jeringas son sin cargo y no tenés que comprar nada para participar. Podés retirarlas sin cargo en Professional Center (Marcelo T. de Alvear 2063, CABA) o pedir que te las enviemos: en ese caso, el costo del envío corre por tu cuenta." },
    { pregunta: "¿Quién puede participar?", respuesta: "Odontólogos con matrícula vigente en Argentina. Hay una solicitud por matrícula y validamos cada una antes de la entrega." },
    { pregunta: "¿Hasta cuándo puedo anotarme?", respuesta: "Hasta el 23 de diciembre de 2026 o hasta agotar stock de cada concentración, lo que ocurra primero. Se asignan por orden de solicitud validada." },
    { pregunta: "¿Cómo recibo las jeringas?", respuesta: "Verificamos tu matrícula y te escribimos por WhatsApp para coordinar. Podés retirarlas sin cargo en nuestro local o recibirlas por envío a tu cargo, según lo que elijas en el formulario." },
    { pregunta: "¿Dos jeringas alcanzan para un tratamiento completo?", respuesta: "No necesariamente. Son 2 jeringas de 2 ml para que conozcas el producto; según el caso y el protocolo, pueden no alcanzar para completar un tratamiento." },
    { pregunta: "¿Qué tengo que enviar como caso clínico?", respuesta: "Una foto inicial y una final con guía de color, con iluminación y encuadre comparables; datos breves de la concentración usada, la duración y tus observaciones; y la confirmación de que tenés el consentimiento de tu paciente. Lo enviás dentro de los 60 días de recibida la muestra." },
    { pregunta: "¿Van a publicar mi caso?", respuesta: "Solo si nos autorizás. La autorización es opcional y separada del programa, y cualquier publicación requiere también el consentimiento de tu paciente, cuidando su privacidad." },
    { pregunta: "¿Cómo recibo y uso el 20% OFF?", respuesta: "Cuando recibimos y revisamos tu caso, te enviamos un cupón por WhatsApp. Vale por 7 días corridos desde que te lo entregamos, para compras de productos Densell White en Dental Medrano." },
    { pregunta: "¿Puedo pedir más de una concentración?", respuesta: "No. Hay una solicitud por matrícula: 2 jeringas de la concentración que elijas." },
  ],
  razonSocial: "",
  cuit: "",
};
