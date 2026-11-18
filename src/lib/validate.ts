// Validaciones compartidas entre el formulario y la API.
export const PROVINCIAS = [
  "Ciudad Autónoma de Buenos Aires", "Buenos Aires", "Catamarca", "Chaco", "Chubut", "Córdoba", "Corrientes",
  "Entre Ríos", "Formosa", "Jujuy", "La Pampa", "La Rioja", "Mendoza", "Misiones", "Neuquén", "Río Negro",
  "Salta", "San Juan", "San Luis", "Santa Cruz", "Santa Fe", "Santiago del Estero", "Tierra del Fuego", "Tucumán",
];
export const TIPOS_MATRICULA = ["Nacional (MN)", "Provincial (MP)"];
export const ESPECIALIDADES = ["Odontología general", "Estética dental", "Ortodoncia", "Rehabilitación oral", "Otra"];
export const MARCAS = ["Densell White", "FGM Whiteness", "Opalescence", "Philips Zoom", "Otra", "Hoy no hago blanqueamiento ambulatorio"];
export const VOLUMENES = ["Ninguno por ahora", "1 a 3", "4 a 10", "Más de 10"];

export const normMatricula = (v: string) => v.replace(/\D/g, "");
export const normWhatsapp = (v: string) => v.replace(/\D/g, "").replace(/^54/, "").replace(/^9/, "").replace(/^0/, "");

type Check = (v: string) => string | null;
const req = (msg: string): Check => (v) => (v && v.trim() ? null : msg);

export const PASO1: Record<string, Check> = {
  nombre: (v) => (v?.trim().split(/\s+/).length >= 2 ? null : "Escribí tu nombre y apellido."),
  matricula: (v) => (normMatricula(v || "").length >= 3 ? null : "Escribí tu número de matrícula."),
  whatsapp: (v) => (normWhatsapp(v || "").length === 10 ? null : "Escribí un número con código de área (10 dígitos)."),
  email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test((v || "").trim()) ? null : "Escribí un email válido."),
  concentracion: req("Elegí una concentración."),
};

export const PASO2: Record<string, Check> = {
  tipo_matricula: req("Elegí el tipo de matrícula."),
  provincia_matricula: req("Elegí la provincia de la matrícula."),
  especialidad: req("Elegí tu especialidad."),
  consultorio: req("Escribí el nombre de tu consultorio o institución."),
  localidad: req("Escribí tu localidad."),
  provincia: req("Elegí tu provincia."),
  marca_actual: req("Elegí una opción."),
  blanqueamientos_mes: req("Elegí una opción."),
};

export function validar(reglas: Record<string, Check>, data: Record<string, unknown>) {
  const errores: Record<string, string> = {};
  for (const [k, fn] of Object.entries(reglas)) {
    const e = fn(String(data[k] ?? ""));
    if (e) errores[k] = e;
  }
  return errores;
}
