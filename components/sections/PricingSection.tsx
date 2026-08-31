import { getLocale, getTranslations } from 'next-intl/server'
import { BlurIn } from './shared'

type Valor = { cantidad_incluida: number | null; incluido: boolean | null }
type Caracteristica = {
  codigo_caracteristica: string
  nombre: string
  tipo_caracteristica: string
  unidad: string | null
  unidades_pack?: number | null
  precio_pack_usd?: number | null
  unidades_adicional_recurrente?: number | null
  precio_adicional_recurrente_usd?: number | null
}
type Catalogo = {
  planes: Array<{
    codigo_plan: string
    nombre: string
    precio_mensual_usd: number | null
    descripcion: string | null
  }>
  caracteristicas: Caracteristica[]
  valores: Record<string, Record<string, Valor>>
}

const PRINCIPALES = ['CORPUS_ACTIVO', 'RETRIEVALS', 'RECUP_INTELIGENTE', 'RAG_AGENTICO']
const SECUNDARIOS = ['ENTIDADES', 'AREAS', 'ESPACIOS_TRABAJO', 'SINTESIS', 'ASISTENCIAS']

const FALLBACK: Catalogo = {
  planes: [
    { codigo_plan: 'FREE', nombre: 'Free', precio_mensual_usd: 0, descripcion: null },
    { codigo_plan: 'STARTER', nombre: 'Starter', precio_mensual_usd: 39, descripcion: null },
    { codigo_plan: 'GROWTH', nombre: 'Growth', precio_mensual_usd: 149, descripcion: null },
    { codigo_plan: 'SCALE', nombre: 'Scale', precio_mensual_usd: 590, descripcion: null },
    { codigo_plan: 'ENTERPRISE', nombre: 'Enterprise', precio_mensual_usd: null, descripcion: null },
  ],
  caracteristicas: [
    { codigo_caracteristica: 'CORPUS_ACTIVO', nombre: 'Corpus activo', tipo_caracteristica: 'CUPO', unidad: 'páginas', unidades_adicional_recurrente: 10000, precio_adicional_recurrente_usd: 10 },
    { codigo_caracteristica: 'RETRIEVALS', nombre: 'Retrieval simple', tipo_caracteristica: 'CUPO', unidad: 'retrievals' },
    { codigo_caracteristica: 'RECUP_INTELIGENTE', nombre: 'RAG Aumentado', tipo_caracteristica: 'CUPO', unidad: 'consultas', unidades_pack: 500, precio_pack_usd: 35 },
    { codigo_caracteristica: 'RAG_AGENTICO', nombre: 'RAG Agéntico', tipo_caracteristica: 'CUPO', unidad: 'operaciones', unidades_pack: 50, precio_pack_usd: 59 },
    { codigo_caracteristica: 'ENTIDADES', nombre: 'Entidades (entornos aislados)', tipo_caracteristica: 'CUPO', unidad: null },
    { codigo_caracteristica: 'AREAS', nombre: 'Áreas', tipo_caracteristica: 'CUPO', unidad: null },
    { codigo_caracteristica: 'ESPACIOS_TRABAJO', nombre: 'Espacios de Trabajo', tipo_caracteristica: 'CUPO', unidad: null },
    { codigo_caracteristica: 'SINTESIS', nombre: 'Síntesis', tipo_caracteristica: 'CUPO', unidad: 'páginas' },
    { codigo_caracteristica: 'ASISTENCIAS', nombre: 'Asistencias', tipo_caracteristica: 'CUPO', unidad: null },
  ],
  valores: Object.fromEntries([
    ['FREE', [1000, 1500, 30, 5, 2, 4, 5, 1500, 10]],
    ['STARTER', [10000, 5000, 300, 50, 5, 12, 10, 10000, 30]],
    ['GROWTH', [50000, 25000, 1500, 150, 25, 50, 50, 50000, 100]],
    ['SCALE', [250000, 100000, 5000, 500, 150, 200, 200, 200000, 250]],
    ['ENTERPRISE', [null, null, null, null, null, null, null, null, null]],
  ].map(([codigo, cantidades]) => [
    codigo,
    Object.fromEntries([...PRINCIPALES, ...SECUNDARIOS].map((car, i) => [
      car, { cantidad_incluida: (cantidades as Array<number | null>)[i], incluido: null },
    ])),
  ])),
}

function numero(valor: number, locale: string) {
  return new Intl.NumberFormat(locale).format(valor)
}

function usd(valor: number, locale: string) {
  return new Intl.NumberFormat(locale, {
    style: 'currency', currency: 'USD', maximumFractionDigits: 0,
  }).format(valor)
}

async function cargarCatalogo(locale: string): Promise<Catalogo> {
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

export async function PricingSection() {
  const locale = await getLocale()
  const t = await getTranslations('planes')
  const catalogo = await cargarCatalogo(locale)
  const porCodigo = new Map(catalogo.caracteristicas.map((c) => [c.codigo_caracteristica, c]))
  const corpus = porCodigo.get('CORPUS_ACTIVO')
  const aumentado = porCodigo.get('RECUP_INTELIGENTE')
  const agentico = porCodigo.get('RAG_AGENTICO')

  return (
    <section id="planes" className="relative rf-corte px-6 md:px-12 lg:px-[60px] py-24 md:py-32 bg-white overflow-hidden">
      <div className="max-w-[1280px] mx-auto flex flex-col gap-16">
        <div className="max-w-[760px] flex flex-col gap-6">
          <span className="rf-anot text-slm-brand">{t('eyebrow')}</span>
          <BlurIn as="h2" className="text-slm-dark text-4xl md:text-5xl lg:text-6xl font-helvetica-neue font-medium leading-[1.05] tracking-[-0.03em]">
            {t('titulo')}
          </BlurIn>
          <span className="rf-eje" aria-hidden="true" />
          <span className="rf-anot text-slm-dark/45">{t('anotacion')}</span>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {catalogo.planes.map((plan) => {
            const valores = catalogo.valores[plan.codigo_plan] || {}
            const enterprise = plan.codigo_plan === 'ENTERPRISE'
            const free = plan.codigo_plan === 'FREE'
            const featured = plan.codigo_plan === 'GROWTH'
            const secundarios = SECUNDARIOS.map((codigo) => {
              const cantidad = valores[codigo]?.cantidad_incluida
              const nombre = porCodigo.get(codigo)?.nombre || codigo
              return `${nombre}: ${cantidad == null ? t('aMedida') : numero(Number(cantidad), locale)}`
            }).join(' · ')
            const principales = PRINCIPALES.map((codigo) => {
              const cantidad = valores[codigo]?.cantidad_incluida
              const car = porCodigo.get(codigo)
              return `${cantidad == null ? t('aMedida') : numero(Number(cantidad), locale)} ${car?.nombre || codigo}${cantidad == null ? '' : t('porMesCorto')}`
            })
            const adicionales = !free && !enterprise && corpus && aumentado && agentico
              ? t('adicionalesLinea', {
                  corpus: numero(Number(corpus.unidades_adicional_recurrente || 10000), locale),
                  corpusPrecio: usd(Number(corpus.precio_adicional_recurrente_usd || 10), locale),
                  aumentado: numero(Number(aumentado.unidades_pack || 500), locale),
                  aumentadoPrecio: usd(Number(aumentado.precio_pack_usd || 35), locale),
                  agentico: numero(Number(agentico.unidades_pack || 50), locale),
                  agenticoPrecio: usd(Number(agentico.precio_pack_usd || 59), locale),
                })
              : null

            return (
              <article key={plan.codigo_plan} className={`rounded-[24px] p-8 flex flex-col gap-6 border ${featured ? 'bg-slm-dark text-slm-light border-slm-brand-dark' : 'bg-slm-light/60 border-slm-dark/10'}`}>
                <div className="flex flex-col gap-1.5">
                  {featured ? (
                    <span className="self-start text-[10px] uppercase tracking-[0.15em] bg-slm-brand-light/20 text-slm-brand-light px-2 py-1 rounded-full mb-1">{t('recomendado')}</span>
                  ) : <span className="mb-1 h-[22px]" aria-hidden="true" />}
                  <h3 className={`font-helvetica-neue text-2xl font-medium tracking-[-0.02em] ${featured ? 'text-white' : 'text-slm-dark'}`}>{plan.nombre}</h3>
                  <p className={`font-helvetica-neue text-sm ${featured ? 'text-slm-gray-light' : 'text-slm-gray'}`}>{plan.descripcion || t(`sub${plan.codigo_plan}`)}</p>
                </div>
                <div className={`font-helvetica-neue text-lg font-medium ${featured ? 'text-white' : 'text-slm-dark'}`}>
                  {plan.precio_mensual_usd == null ? t('aMedida') : plan.precio_mensual_usd === 0 ? t('gratis') : `${usd(Number(plan.precio_mensual_usd), locale)}${t('porMes')}`}
                </div>
                <ul className="flex flex-col gap-3 flex-1">
                  {principales.map((linea) => (
                    <li key={linea} className={`flex gap-2 text-sm font-helvetica-neue leading-snug ${featured ? 'text-slm-light/90' : 'text-slm-gray'}`}>
                      <span className={`mt-1.5 inline-block w-1 h-1 rounded-full flex-none ${featured ? 'bg-slm-brand-light' : 'bg-slm-brand'}`} />
                      <span>{linea}</span>
                    </li>
                  ))}
                  <li className={`text-xs leading-relaxed ${featured ? 'text-slm-light/70' : 'text-slm-gray'}`}>{t('limitesSecundarios')}: {secundarios}</li>
                  {adicionales && <li className={`text-xs leading-relaxed ${featured ? 'text-slm-light/70' : 'text-slm-gray'}`}>{adicionales}</li>}
                </ul>
                <a href="https://app.ragfly.ai" className={`text-center font-medium text-sm px-5 py-3 rounded-full transition-opacity hover:opacity-90 ${featured ? 'bg-slm-brand-light text-slm-dark' : 'bg-slm-dark text-slm-light'}`}>
                  {enterprise ? t('ctaEmpresa') : free ? t('ctaGratis') : t('ctaEmpezar')}
                </a>
              </article>
            )
          })}
        </div>

        <div className="max-w-[900px] text-slm-gray font-helvetica-neue text-xs md:text-[13px] leading-relaxed">{t('nota')}</div>
      </div>
    </section>
  )
}
