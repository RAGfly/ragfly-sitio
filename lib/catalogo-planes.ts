// Catálogo de planes del sitio: la fuente es la BD de PROD (GET /pagos/catalogo-publico).
// Lo leen la sección de precios, /llms.txt y el JSON-LD de layout.tsx, para que ninguna
// pieza publique cupos escritos a mano (llms.txt los tuvo desfasados hasta 2026-10-14,
// pendiente 413768). El FALLBACK solo cubre una caída de la API.

export type Valor = { cantidad_incluida: number | null; incluido: boolean | null }
export type Caracteristica = {
  codigo_caracteristica: string
  nombre: string
  tipo_caracteristica: string
  unidad: string | null
  unidades_pack?: number | null
  precio_pack_usd?: number | null
  unidades_adicional_recurrente?: number | null
  precio_adicional_recurrente_usd?: number | null
}
export type Plan = {
  codigo_plan: string
  nombre: string
  precio_mensual_usd: number | null
  descripcion: string | null
}
export type Catalogo = {
  planes: Plan[]
  caracteristicas: Caracteristica[]
  valores: Record<string, Record<string, Valor>>
}

export const PRINCIPALES = ['CORPUS_ACTIVO', 'RETRIEVALS', 'RECUP_INTELIGENTE', 'RAG_AGENTICO']
export const SECUNDARIOS = ['ENTIDADES', 'AREAS', 'ESPACIOS_TRABAJO', 'SINTESIS', 'CHAT']

export const FALLBACK: Catalogo = {
  planes: [
    { codigo_plan: 'FREE', nombre: 'Free', precio_mensual_usd: 0, descripcion: null },
    { codigo_plan: 'STARTER', nombre: 'Starter', precio_mensual_usd: 39, descripcion: null },
    { codigo_plan: 'GROWTH', nombre: 'Growth', precio_mensual_usd: 149, descripcion: null },
    { codigo_plan: 'SCALE', nombre: 'Scale', precio_mensual_usd: 590, descripcion: null },
    { codigo_plan: 'BUSINESS', nombre: 'Business', precio_mensual_usd: 1990, descripcion: null },
    { codigo_plan: 'ENTERPRISE', nombre: 'Enterprise / Soberano', precio_mensual_usd: null, descripcion: null },
  ],
  caracteristicas: [
    { codigo_caracteristica: 'CORPUS_ACTIVO', nombre: 'Corpus activo', tipo_caracteristica: 'CUPO', unidad: 'páginas', unidades_adicional_recurrente: 10000, precio_adicional_recurrente_usd: 10 },
    { codigo_caracteristica: 'RETRIEVALS', nombre: 'Retrieval simple', tipo_caracteristica: 'CUPO', unidad: 'retrievals' },
    { codigo_caracteristica: 'RECUP_INTELIGENTE', nombre: 'RAG Aumentado', tipo_caracteristica: 'CUPO', unidad: 'operaciones', unidades_pack: 500, precio_pack_usd: 35 },
    { codigo_caracteristica: 'RAG_AGENTICO', nombre: 'RAG Agéntico', tipo_caracteristica: 'CUPO', unidad: 'operaciones', unidades_pack: 50, precio_pack_usd: 59 },
    { codigo_caracteristica: 'ENTIDADES', nombre: 'Workspaces', tipo_caracteristica: 'CUPO', unidad: null },
    { codigo_caracteristica: 'AREAS', nombre: 'Áreas', tipo_caracteristica: 'CUPO', unidad: null },
    { codigo_caracteristica: 'ESPACIOS_TRABAJO', nombre: 'Colecciones', tipo_caracteristica: 'CUPO', unidad: null },
    { codigo_caracteristica: 'SINTESIS', nombre: 'Síntesis (páginas fuente)', tipo_caracteristica: 'CUPO', unidad: 'páginas' },
    { codigo_caracteristica: 'CHAT', nombre: 'Asistencias', tipo_caracteristica: 'CUPO', unidad: null },
  ],
  valores: Object.fromEntries([
    ['FREE', [1000, 1500, 30, 5, 5, 4, 5, 1500, 10]],
    ['STARTER', [10000, 5000, 300, 50, 25, 12, 10, 10000, 30]],
    ['GROWTH', [50000, 25000, 1500, 150, 150, 50, 50, 50000, 100]],
    ['SCALE', [250000, 100000, 5000, 500, 500, 200, 200, 200000, 250]],
    ['BUSINESS', [1000000, 1000000, 12500, 1250, 1500, 1000, 1000, 750000, 1000]],
    ['ENTERPRISE', [null, null, null, null, null, null, null, null, null]],
  ].map(([codigo, cantidades]) => [
    codigo,
    Object.fromEntries([...PRINCIPALES, ...SECUNDARIOS].map((car, i) => [
      car, { cantidad_incluida: (cantidades as Array<number | null>)[i], incluido: null },
    ])),
  ])),
}

export async function cargarCatalogo(locale: string): Promise<Catalogo> {
  const base = process.env.RAGFLY_API_URL || 'https://api.ragfly.ai'
  try {
    const respuesta = await fetch(
      `${base}/pagos/catalogo-publico?locale=${encodeURIComponent(locale)}`,
      { next: { revalidate: 300 } },
    )
    if (!respuesta.ok) return FALLBACK
    return await respuesta.json() as Catalogo
  } catch {
    return FALLBACK
  }
}

// useGrouping 'always': en es el CLDR no agrupa las cifras de 4 dígitos («1990 US$», «1000»).
export function numero(valor: number, locale: string) {
  return new Intl.NumberFormat(locale, { useGrouping: 'always' }).format(valor)
}

export function usd(valor: number, locale: string) {
  return new Intl.NumberFormat(locale, {
    style: 'currency', currency: 'USD', maximumFractionDigits: 0, useGrouping: 'always',
  }).format(valor)
}

/** Bajada de un plan en el idioma de la página. La BD guarda `descripcion` solo en
 *  español (aunque se pida otro locale): fuera de es manda `sub` (messages/*.json). */
export function bajadaPlan(plan: Plan, locale: string, sub: string): string {
  return (locale === 'es' && plan.descripcion) || sub
}

/** Cupos de un plan como los muestra la grilla: principales («1,000 Active corpus/month»)
 *  y secundarios en una línea («Workspaces: 2 · Areas: 4 · …»). */
export function cuposPlan(
  catalogo: Catalogo,
  codigoPlan: string,
  locale: string,
  textos: { aMedida: string; porMesCorto: string },
): { principales: string[]; secundarios: string } {
  const valores = catalogo.valores[codigoPlan] || {}
  const nombre = (codigo: string) =>
    catalogo.caracteristicas.find((c) => c.codigo_caracteristica === codigo)?.nombre || codigo
  const principales = PRINCIPALES.map((codigo) => {
    const cantidad = valores[codigo]?.cantidad_incluida
    return cantidad == null
      ? `${textos.aMedida} ${nombre(codigo)}`
      : `${numero(Number(cantidad), locale)} ${nombre(codigo)}${textos.porMesCorto}`
  })
  const secundarios = SECUNDARIOS.map((codigo) => {
    const cantidad = valores[codigo]?.cantidad_incluida
    return `${nombre(codigo)}: ${cantidad == null ? textos.aMedida : numero(Number(cantidad), locale)}`
  }).join(' · ')
  return { principales, secundarios }
}

// En español, Intl no agrupa los números de 4 cifras («1500» junto a «10.000»).
function entero(valor: number) {
  return new Intl.NumberFormat('es', { useGrouping: 'always' }).format(valor)
}

/** Cupos de un plan en una línea, en español, para llms.txt y el JSON-LD. */
export function resumenPlanEs(catalogo: Catalogo, codigoPlan: string): string | null {
  const valores = catalogo.valores[codigoPlan] || {}
  const nombre = (codigo: string) =>
    catalogo.caracteristicas.find((c) => c.codigo_caracteristica === codigo)?.nombre || codigo
  const cantidad = (codigo: string) => valores[codigo]?.cantidad_incluida
  const corpus = cantidad('CORPUS_ACTIVO')
  if (corpus == null) return null
  const mensuales = ['RETRIEVALS', 'RECUP_INTELIGENTE', 'RAG_AGENTICO']
    .filter((codigo) => cantidad(codigo) != null)
    .map((codigo) => `${entero(Number(cantidad(codigo)))} ${nombre(codigo)}`)
  const workspaces = cantidad('ENTIDADES')
  return [
    `${nombre('CORPUS_ACTIVO').toLowerCase()} ${entero(Number(corpus))} páginas`,
    mensuales.length ? `${mensuales.join(', ')} por mes` : null,
    workspaces == null ? null : `${entero(Number(workspaces))} ${nombre('ENTIDADES').toLowerCase()}`,
  ].filter(Boolean).join('; ')
}

/** Línea «Precios (USD)» de llms.txt, armada desde el catálogo vivo. */
export function lineaPreciosEs(catalogo: Catalogo): string {
  const planes = catalogo.planes.map((plan) => {
    const resumen = resumenPlanEs(catalogo, plan.codigo_plan)
    if (plan.precio_mensual_usd == null || resumen == null) return `${plan.nombre} a medida`
    const precio = plan.precio_mensual_usd === 0 ? '$0' : `$${entero(Number(plan.precio_mensual_usd))}/mes`
    return `${plan.nombre} ${precio} (${resumen})`
  })
  const porCodigo = new Map(catalogo.caracteristicas.map((c) => [c.codigo_caracteristica, c]))
  const corpus = porCodigo.get('CORPUS_ACTIVO')
  const aumentado = porCodigo.get('RECUP_INTELIGENTE')
  const agentico = porCodigo.get('RAG_AGENTICO')
  const adicionales = corpus?.unidades_adicional_recurrente && aumentado?.unidades_pack && agentico?.unidades_pack
    ? ` Adicionales (planes pagados): corpus activo +${entero(Number(corpus.unidades_adicional_recurrente))} páginas por $${entero(Number(corpus.precio_adicional_recurrente_usd))}/mes; packs de compra única de ${aumentado.nombre} (+${entero(Number(aumentado.unidades_pack))} por $${entero(Number(aumentado.precio_pack_usd))}) y ${agentico.nombre} (+${entero(Number(agentico.unidades_pack))} por $${entero(Number(agentico.precio_pack_usd))}); sin cobro automático por exceso.`
    : ''
  return `- Precios (USD; fuente: catálogo vivo, https://ragfly.ai/#planes): ${planes.join(' · ')}.${adicionales}`
}
