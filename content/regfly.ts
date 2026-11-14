/**
 * Contenido de la landing de REGfly (regfly.ai/cl).
 * Fuente: «Marca · REGfly y arquitectura de marca RAGfly» (14-nov-2026).
 *
 * Reglas de la marca que este archivo respeta:
 *  - Sin promesa de «a la fecha X» hasta que esas preguntas pasen la evaluación del área.
 *  - No se publica el número de niveles de la jerarquía normativa.
 *  - Cobertura: se nombra lo cargado y abierto, nunca «toda la regulación».
 *    En «Cobertura» solo figura como Disponible lo que pasó la evaluación.
 *  - REGfly no habla de privacidad (es promesa de RAGfly - Privado).
 */

export const MARCA = {
  nombre: 'REGfly',
  porMadre: 'by RAGfly',
  atributos: 'Simple, vigente y preciso',
  titular: 'Que tu IA responda con la normativa vigente.',
  cobertura: 'De la ley a la circular de cada supervisor.',
  apoyo: 'Nosotros la mantenemos al día. Tú la consultas, con cita a la norma y al artículo.',
  aviso: 'Información normativa con su fuente; no constituye asesoría legal.',
} as const

export const NAV = [
  { l: 'Vigente', h: '#vigente' },
  { l: 'Preciso', h: '#preciso' },
  { l: 'Cobertura', h: '#cobertura' },
  { l: 'Conecta tu IA', h: '#conecta' },
  { l: 'Planes', h: '#planes' },
  { l: 'Preguntas', h: '#faq' },
] as const

export const POR_QUE_NO_BASTA = [
  {
    t: 'Responde con una versión que ya cambió',
    d: 'Un modelo aprende la normativa hasta una fecha y no sabe qué se derogó o modificó después.',
  },
  {
    t: 'Inventa artículos con total seguridad',
    d: 'Cita un número de artículo que suena bien. Sin la fuente delante, no hay cómo saber si existe.',
  },
  {
    t: 'Mezcla la ley con la circular',
    d: 'Trata igual una ley y una guía del supervisor. Cuando se contradicen, no sabe cuál manda.',
  },
] as const

export const VIGENTE = [
  { t: 'Fuentes oficiales', d: 'Cada documento viene del sitio del organismo que lo emite, con su enlace.' },
  { t: 'Lo derogado, marcado', d: 'Cuando una norma deja de regir, queda marcada como tal. No se mezcla con lo vigente.' },
  { t: 'Fechas por documento', d: 'Cada norma guarda su fecha de vigencia y, si corresponde, su fecha de término.' },
] as const

export const ESCALERA = [
  'Tratados',
  'Constitución',
  'Leyes, DFL y DL',
  'Reglamentos y decretos supremos',
  'Normas de carácter general, circulares y resoluciones',
  'Compendios, directivas e instrucciones',
  'Oficios circulares, guías y preguntas frecuentes',
] as const

export const AREAS = [
  {
    area: 'Empresa, mercados y consumo',
    supervisor: 'Comisión para el Mercado Financiero (CMF)',
    estado: 'En evaluación',
  },
  {
    area: 'Derecho tributario',
    supervisor: 'Servicio de Impuestos Internos (SII)',
    estado: 'En evaluación',
  },
  {
    area: 'Trabajo y seguridad social',
    supervisor: 'Dirección del Trabajo y supervisores del sistema previsional',
    estado: 'Próximamente',
  },
  {
    area: 'Compras públicas',
    supervisor: 'Desde la mirada del proveedor',
    estado: 'Próximamente',
  },
] as const

export type EstadoCobertura = (typeof AREAS)[number]['estado'] | 'Disponible'

export const SUPERFICIES = [
  { t: 'Chat', d: 'Pregunta en lenguaje natural y recibe la respuesta con su cita.' },
  { t: 'MCP', d: 'Conecta tu agente de IA a REGfly con un solo servidor.' },
  { t: 'REST', d: 'La misma consulta, como API, para tus propios sistemas.' },
  { t: 'SDK', d: 'Python y TypeScript.' },
  { t: 'CLI', d: 'Consulta desde la terminal o desde un script.' },
] as const

export const FAQ = [
  {
    q: '¿Reemplaza a un abogado?',
    a: 'No. REGfly entrega la normativa con su fuente y su cita para que tú o tu abogado la revisen. No constituye asesoría legal.',
  },
  {
    q: '¿Qué normativa cubre hoy?',
    a: 'Abrimos por áreas y supervisores, y solo damos por disponible lo que pasó nuestra evaluación. La sección Cobertura muestra el estado de cada una.',
  },
  {
    q: '¿Qué pasa si no hay respaldo para mi pregunta?',
    a: 'No responde. Si la pregunta queda fuera de la cobertura o el corpus no acredita la respuesta, te lo dice en lugar de adivinar.',
  },
  {
    q: '¿Qué norma cita primero cuando hay conflicto?',
    a: 'La de mayor rango. Si una circular y una ley se contradicen, cita primero la ley y después la instrucción del supervisor.',
  },
  {
    q: '¿Necesito una cuenta nueva?',
    a: 'No. REGfly usa tu cuenta RAGfly: mismo inicio de sesión, y el cupo de consultas lo comparte toda tu organización.',
  },
  {
    q: '¿Qué normas entran a continuación?',
    a: 'Primero la normativa y las instrucciones de cada supervisor. En una segunda fase se suman dictámenes, oficios, sanciones y sentencias.',
  },
] as const
