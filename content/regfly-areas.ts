/**
 * Cobertura de REGfly Chile por área y supervisor: alimenta la sección Cobertura de la
 * portada y las páginas indexables /cl/[area] y /cl/[area]/[supervisor].
 *
 * Reglas (admin/estrategia/ARQUITECTURA-DE-MARCA.md):
 *  - «Disponible» solo para lo que PASÓ la evaluación del área. Hoy no hay ninguna: no se
 *    marca Disponible por tener documentos cargados.
 *  - Se nombra lo cargado y abierto, nunca «toda la regulación».
 *  - Sin cifras de documentos ni número de niveles. Sin «a la fecha X».
 *
 * Origen: regu-Ragfly/docs/planes/ALCANCE_REGULACION_CHILE.md §2 (13-nov-2026).
 * Estados iniciales (14-nov-2026): el piloto de TEST cubre mercados (CMF) y tributario (SII)
 * → «En evaluación»; el resto → «Próximamente». Confirmar con Regulación antes de cambiarlos.
 */

export type Estado = 'disponible' | 'evaluacion' | 'proximamente'

export const ETIQUETA_ESTADO: Record<Estado, string> = {
  disponible: 'Disponible',
  evaluacion: 'En evaluación',
  proximamente: 'Próximamente',
}

export type Supervisor = {
  slug: string
  nombre: string
  sigla?: string
  estado: Estado
  /** Qué trae, en una frase. Solo lo que el alcance de lanzamiento declara. */
  trae: string
  /** true = jurisprudencia propia del supervisor (segunda fase). */
  segundaFase?: boolean
}

export type Area = {
  slug: string
  nombre: string
  estado: Estado
  /** Para quién y qué cubre, en una frase. */
  resumen: string
  /** Preguntas típicas, en lenguaje de quien consulta. */
  preguntas: string[]
  supervisores: Supervisor[]
}

const NORMA = 'Normas, circulares, resoluciones e instrucciones generales'

export const AREAS: Area[] = [
  {
    slug: 'tributario',
    nombre: 'Derecho tributario',
    estado: 'evaluacion',
    resumen: 'Impuestos, aduanas y cobranza: la ley y las instrucciones de cada servicio.',
    preguntas: [
      '¿Qué dice la ley y qué instruye el SII sobre este impuesto?',
      '¿Cuál es el procedimiento y el plazo que fija la circular?',
      '¿Qué responde el SII en sus preguntas frecuentes?',
    ],
    supervisores: [
      {
        slug: 'sii',
        nombre: 'Servicio de Impuestos Internos',
        sigla: 'SII',
        estado: 'evaluacion',
        trae: `${NORMA} del SII, con sus preguntas frecuentes.`,
      },
      {
        slug: 'aduanas',
        nombre: 'Servicio Nacional de Aduanas',
        sigla: 'Aduanas',
        estado: 'proximamente',
        trae: `${NORMA} de Aduanas.`,
      },
      {
        slug: 'tesoreria',
        nombre: 'Tesorería General de la República',
        sigla: 'TGR',
        estado: 'proximamente',
        trae: `${NORMA} de Tesorería.`,
      },
      {
        slug: 'tribunales-tributarios-aduaneros',
        nombre: 'Tribunales Tributarios y Aduaneros',
        estado: 'proximamente',
        trae: 'Sentencias de los Tribunales Tributarios y Aduaneros.',
        segundaFase: true,
      },
    ],
  },
  {
    slug: 'trabajo-seguridad-social',
    nombre: 'Trabajo y seguridad social',
    estado: 'proximamente',
    resumen: 'Relaciones laborales, previsión, salud y licencias: la ley y lo que instruye cada superintendencia.',
    preguntas: [
      '¿Qué exige el Código del Trabajo y qué precisa la Dirección del Trabajo?',
      '¿Cómo se tramita una licencia médica según SUSESO?',
      '¿Qué instruye la Superintendencia de Pensiones sobre las cotizaciones?',
    ],
    supervisores: [
      {
        slug: 'direccion-del-trabajo',
        nombre: 'Dirección del Trabajo',
        sigla: 'DT',
        estado: 'proximamente',
        trae: `${NORMA} de la Dirección del Trabajo.`,
      },
      {
        slug: 'suseso',
        nombre: 'Superintendencia de Seguridad Social',
        sigla: 'SUSESO',
        estado: 'proximamente',
        trae: `${NORMA} de SUSESO.`,
      },
      {
        slug: 'superintendencia-de-pensiones',
        nombre: 'Superintendencia de Pensiones',
        estado: 'proximamente',
        trae: `${NORMA} de la Superintendencia de Pensiones.`,
      },
      {
        slug: 'superintendencia-de-salud',
        nombre: 'Superintendencia de Salud',
        estado: 'proximamente',
        trae: `${NORMA} de la Superintendencia de Salud, incluidas las de licencias médicas y cotizaciones.`,
      },
    ],
  },
  {
    slug: 'empresa-mercados-consumo',
    nombre: 'Empresa, mercados y consumo',
    estado: 'evaluacion',
    resumen: 'Mercado de valores, libre competencia, consumo, ciberseguridad y prevención de lavado de activos.',
    preguntas: [
      '¿Qué obligaciones fija la ley y qué norma de carácter general las precisa?',
      '¿Qué exige la CMF a un emisor o a un regulado?',
      '¿Qué deben reportar las empresas en prevención de lavado de activos?',
    ],
    supervisores: [
      {
        slug: 'cmf',
        nombre: 'Comisión para el Mercado Financiero',
        sigla: 'CMF',
        estado: 'evaluacion',
        trae: `${NORMA} de la CMF.`,
      },
      {
        slug: 'sernac',
        nombre: 'Servicio Nacional del Consumidor',
        sigla: 'SERNAC',
        estado: 'proximamente',
        trae: `${NORMA} del SERNAC.`,
      },
      {
        slug: 'fne',
        nombre: 'Fiscalía Nacional Económica',
        sigla: 'FNE',
        estado: 'proximamente',
        trae: `${NORMA} de la Fiscalía Nacional Económica, como guías y directrices.`,
      },
      {
        slug: 'tdlc',
        nombre: 'Tribunal de Defensa de la Libre Competencia',
        sigla: 'TDLC',
        estado: 'proximamente',
        trae: 'Sentencias y resoluciones del Tribunal de Defensa de la Libre Competencia.',
        segundaFase: true,
      },
      {
        slug: 'agencia-nacional-de-ciberseguridad',
        nombre: 'Agencia Nacional de Ciberseguridad',
        sigla: 'ANCI',
        estado: 'proximamente',
        trae: `${NORMA} de la Agencia Nacional de Ciberseguridad.`,
      },
      {
        slug: 'uaf',
        nombre: 'Unidad de Análisis Financiero',
        sigla: 'UAF',
        estado: 'proximamente',
        trae: `${NORMA} de la UAF sobre prevención de lavado de activos.`,
      },
    ],
  },
  {
    slug: 'legislacion',
    nombre: 'Legislación',
    estado: 'proximamente',
    resumen: 'Las leyes que citan los supervisores, con su texto actualizado: la base que ordena todo lo demás.',
    preguntas: [
      '¿Qué dice el artículo de la ley que cita la circular?',
      '¿Esa norma sigue vigente o fue modificada o derogada?',
    ],
    supervisores: [
      {
        slug: 'ley-chile',
        nombre: 'Ley Chile (legislación citada por los supervisores)',
        estado: 'proximamente',
        trae: 'Leyes, decretos con fuerza de ley y decretos ley que cada supervisor lista como su legislación, con el texto actualizado.',
      },
    ],
  },
  {
    slug: 'compras-publicas',
    nombre: 'Compras públicas, desde el proveedor',
    estado: 'proximamente',
    resumen: 'Lo que necesita una empresa que le vende al Estado.',
    preguntas: [
      '¿Qué exige la ley de compras públicas a un proveedor?',
      '¿Qué dice la directiva de ChileCompra sobre este trámite?',
    ],
    supervisores: [
      {
        slug: 'chilecompra',
        nombre: 'ChileCompra',
        estado: 'proximamente',
        trae: 'Normas y directivas de ChileCompra desde el lado del proveedor.',
      },
      {
        slug: 'tribunal-de-contratacion-publica',
        nombre: 'Tribunal de Contratación Pública',
        estado: 'proximamente',
        trae: 'Sentencias del Tribunal de Contratación Pública.',
        segundaFase: true,
      },
    ],
  },
]

export const getArea = (slug: string) => AREAS.find((a) => a.slug === slug)
export const getSupervisor = (area: Area, slug: string) => area.supervisores.find((s) => s.slug === slug)

export const AVISO_LEGAL = 'Información normativa con su fuente; no constituye asesoría legal.'
