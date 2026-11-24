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
  whatsapp: "5491164362400",
  whatsappTexto: "¡Hola! Vi el programa de muestras de Densell White y quiero hacer una consulta.",
  heroTitulo: "Probá Densell White gratis en tu consultorio.",
  heroBajada:
    "Elegí la concentración que querés probar, recibí una jeringa sin cargo y compartí tu experiencia clínica. Además, obtené un 20% OFF en tu próxima compra de Densell White.",
  concentraciones: [
    { valor: "CP 10%", numero: "10", nivel: "Ambulatorio", presentacion: "Jeringa de 2 ml", codigo: "006529", descripcion: "Para blanqueamiento ambulatorio bajo supervisión profesional.", detalles: "Permite complementar o continuar tratamientos domiciliarios" },
    { valor: "CP 16%", numero: "16", nivel: "Ambulatorio", presentacion: "Jeringa de 2 ml", codigo: "006531", descripcion: "Para blanqueamiento ambulatorio bajo supervisión profesional.", detalles: "Permite complementar o continuar tratamientos domiciliarios" },
    { valor: "CP 22%", numero: "22", nivel: "Ambulatorio o consultorio", presentacion: "Jeringa de 2 ml", codigo: "006533", descripcion: "Para uso ambulatorio o en consultorio.", detalles: "60 minutos por día\npH neutro y alta viscosidad\nAgente desensibilizante incorporado\nLibera flúor" },
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
    { pregunta: "¿Tiene algún costo?", respuesta: "La jeringa es sin cargo y no tenés que comprar nada para participar. El costo del envío corre por tu cuenta: lo coordinamos por WhatsApp." },
    { pregunta: "¿Quién puede participar?", respuesta: "Odontólogos con matrícula vigente en Argentina. Hay una muestra por matrícula y validamos cada solicitud antes del envío." },
    { pregunta: "¿Hasta cuándo puedo anotarme?", respuesta: "Hasta el 23 de diciembre de 2026 o hasta agotar stock, lo que ocurra primero. Las muestras se asignan por orden de solicitud validada." },
    { pregunta: "¿Cómo y cuándo recibo la jeringa?", respuesta: "Verificamos tu matrícula y te escribimos por WhatsApp para coordinar el envío al domicilio que indicaste. El costo del envío corre por tu cuenta. La entrega está sujeta a validación y disponibilidad." },
    { pregunta: "¿Una jeringa alcanza para un tratamiento completo?", respuesta: "No necesariamente. Es una muestra de 2 ml para que conozcas el producto y, según el caso y el protocolo, puede no alcanzar para completar un tratamiento." },
    { pregunta: "¿Qué tengo que enviar como caso clínico?", respuesta: "Una foto inicial y una final con guía de color, con iluminación y encuadre comparables; datos breves de la concentración usada, la duración y tus observaciones; y la confirmación de que tenés el consentimiento de tu paciente para documentar el caso. Lo enviás dentro de los 60 días de recibida la muestra." },
    { pregunta: "¿Van a publicar mi caso?", respuesta: "Solo si nos autorizás. La autorización para publicar es opcional y separada del programa, y cualquier publicación requiere también el consentimiento de tu paciente, cuidando su privacidad." },
    { pregunta: "¿Cómo recibo y uso el 20% OFF?", respuesta: "Cuando recibimos y revisamos tu caso, te enviamos un cupón por WhatsApp. Vale por 30 días corridos desde que te lo entregamos, para compras de productos Densell White en Dental Medrano." },
    { pregunta: "¿Puedo pedir más de una concentración?", respuesta: "No. Hay una jeringa por matrícula, de la concentración que elijas en el formulario." },
  ],
  razonSocial: "",
  cuit: "",
};
