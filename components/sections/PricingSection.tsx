import { getLocale, getTranslations } from 'next-intl/server'
import { BlurIn } from './shared'
import { cargarCatalogo, numero, PRINCIPALES, SECUNDARIOS, usd } from '../../lib/catalogo-planes'

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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                    <span className="rf-boton self-start text-[10px] uppercase tracking-[0.15em] bg-slm-brand-light/20 text-slm-brand-light px-2 py-1 rounded-full mb-1">{t('recomendado')}</span>
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
                <a href="https://app.ragfly.ai" className={`rf-boton text-center font-medium text-sm px-5 py-3 rounded-full transition-opacity hover:opacity-90 ${featured ? 'bg-slm-brand-light text-slm-dark' : 'bg-slm-dark text-slm-light'}`}>
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
