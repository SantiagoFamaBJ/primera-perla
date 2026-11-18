import type { Config } from "./types";

// Valores iniciales. Todo se puede cambiar desde /ADMIN → Configuración.
export const DEFAULTS: Config = {
  cupo: 40,
  cierre: "2026-12-04T23:59:59-03:00",
  cerradoManual: false,
  pixelId: "",
  webUrl: "https://densellwhite.vercel.app",
  webLabel: "Conocé Densell White",
  whatsapp: "5491164362400",
  whatsappTexto: "¡Hola! Vi el programa Primera Perla de Densell White y quiero hacer una consulta.",
  heroTitulo: "Probá Densell White gratis en tu consultorio.",
  heroBajada:
    "Te enviamos una jeringa de 2 ml sin cargo para que la uses con un paciente. Vos elegís la concentración, documentás el caso y te llevás un 20% OFF.",
  concentraciones: [
    { valor: "CP 10%", numero: "10", nivel: "Baja", descripcion: "La opción más suave.", codigo: "006529" },
    { valor: "CP 16%", numero: "16", nivel: "Media", descripcion: "El punto de equilibrio.", codigo: "006531" },
    { valor: "CP 22%", numero: "22", nivel: "Alta", descripcion: "Una hora al día.", codigo: "006533" },
  ],
  caracteristicas: ["pH neutro", "Alta viscosidad", "Agente desensibilizante", "Libera flúor", "Ambulatorio o en consultorio"],
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
    {
      nombre: "Densell White CP35% – Full Kit",
      detalle: "Blanqueamiento en consultorio",
      imagen: "https://dentalmedrano.com/wp-content/uploads/2025/05/6535.jpg",
      link: "https://dentalmedrano.com/producto/blanq-densell-white-cp35-full-kit-office-peroxido-de-carbamida-42jeringas/",
    },
  ],
  casos: [],
  faq: [
    { pregunta: "¿Tiene algún costo?", respuesta: "No. La jeringa es sin cargo y no tenés que comprar nada para participar. Solo te pedimos que nos compartas tu caso clínico." },
    { pregunta: "¿Quién puede participar?", respuesta: "Odontólogos con matrícula vigente en Argentina. Hay una muestra por matrícula y validamos cada inscripción antes del envío." },
    { pregunta: "¿Hasta cuándo puedo anotarme?", respuesta: "Hasta agotar las jeringas o hasta la fecha de cierre, lo que ocurra primero. Las muestras se asignan por orden de inscripción validada." },
    { pregunta: "¿Cómo y cuándo recibo la jeringa?", respuesta: "Una vez revisada tu inscripción, te escribimos por WhatsApp para coordinar la entrega. Los envíos salen en tandas semanales a partir del 23/11." },
    { pregunta: "¿Qué tengo que enviar como caso clínico?", respuesta: "Una foto inicial y una final de la sonrisa con guía de color, con la misma luz y encuadre; una ficha breve con la concentración, los días de tratamiento y tus observaciones; y la confirmación de que tenés el consentimiento de tu paciente para usar las imágenes." },
    { pregunta: "¿Cómo uso el 20% OFF?", respuesta: "Cuando recibimos tu caso, te enviamos el beneficio por WhatsApp. Vale durante los 7 días corridos siguientes para compras de productos Densell White." },
    { pregunta: "¿Van a publicar mi caso?", respuesta: "Sí. Al participar autorizás a Dental Medrano a publicar tu caso con tu nombre y matrícula, como indican las bases y condiciones." },
    { pregunta: "¿Puedo pedir más de una concentración?", respuesta: "No. Hay una jeringa por matrícula, de la concentración que elijas en el formulario." },
    { pregunta: "¿Qué pasa si no envío el caso?", respuesta: "El programa existe para conocer resultados reales. Si no recibimos tu caso dentro de los 60 días de recibida la muestra, no accedés al beneficio del 20% OFF." },
  ],
  razonSocial: "",
  cuit: "",
};
