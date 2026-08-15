'use client'

import { useTranslations } from 'next-intl'
import planesMeta from '../../content/planes-meta.json'
import { BlurIn } from './shared'

const pricingItalicTerms = [
  'Verified Answers',
  'Agentic Retrieval',
  'RAGfly Desktop',
  'Area Control',
  'Hi-res/OCR',
  'Add-ons',
  'Overage',
  'Retrievals',
  'Entities',
  'Entity',
  'Pages',
  'Playground',
  'BYOK',
  'parsing-BYOK',
  'embedding-BYOK',
  'encrypted-BYOK',
  'BYO',
  'LLM',
  'DPA/SLA',
  'Custom',
  'custom',
  'Fast',
  'page',
  'pack',
  'packs',
  'operation',
  'ops',
  'add-on',
  'sales-assisted',
].sort((a, b) => b.length - a.length)

const pricingItalicSet = new Set(pricingItalicTerms)
const pricingItalicPattern = new RegExp(
  `(${pricingItalicTerms.map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`,
  'g'
)

function PricingText({ children }: { children: string }) {
  return (
    <>
      {children.split(pricingItalicPattern).map((part, idx) =>
        pricingItalicSet.has(part) ? (
          <em key={`${part}-${idx}`} className="italic">
            {part}
          </em>
        ) : (
          part
        )
      )}
    </>
  )
}

/* ------------------------------------------------------------------ */
/* PricingSection                                                       */
/* ------------------------------------------------------------------ */
export function PricingSection() {
  const t = useTranslations()
  const plans = planesMeta.plans
  const notaLines = t('planes.nota').split('\n').filter(Boolean)
  return (
    <section id="planes" className="px-6 md:px-12 lg:px-[60px] py-24 md:py-32 bg-slm-light">
      <div className="max-w-[1280px] mx-auto flex flex-col gap-16">
        <div className="max-w-[760px] flex flex-col gap-6">
          <span className="text-sm uppercase tracking-[0.18em] text-slm-brand">{t('planes.eyebrow')}</span>
          <BlurIn as="h2" className="text-slm-dark text-4xl md:text-5xl lg:text-6xl font-helvetica-neue font-medium leading-[1.05] tracking-[-0.03em]">
            <PricingText>{t('planes.titulo')}</PricingText>
          </BlurIn>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {plans.map(({ idx, featured, featureCount }) => {
            const nombre = t(`planes.plan${idx}Nombre` as Parameters<typeof t>[0])
            const sub = t(`planes.plan${idx}Sub` as Parameters<typeof t>[0])
            const precio = t(`planes.plan${idx}Precio` as Parameters<typeof t>[0])
            const cta = t(`planes.plan${idx}Cta` as Parameters<typeof t>[0])
            const feats = Array.from({ length: featureCount }, (_, fi) =>
              t(`planes.plan${idx}F${fi}` as Parameters<typeof t>[0])
            )
            return (
              <div
                key={nombre}
                className={`rounded-[24px] p-8 flex flex-col gap-6 border ${featured ? 'bg-slm-dark text-slm-light border-slm-brand-dark' : 'bg-white border-slm-dark/8'}`}
              >
                <div className="flex flex-col gap-1.5">
                  {featured ? (
                    <span className="self-start text-[10px] uppercase tracking-[0.15em] bg-slm-brand-light/20 text-slm-brand-light px-2 py-1 rounded-full mb-1">{t('planes.recomendado')}</span>
                  ) : (
                    <span className="mb-1 h-[22px]" aria-hidden="true" />
                  )}
                  <h3 className={`font-helvetica-neue text-2xl font-medium tracking-[-0.02em] ${featured ? 'text-white' : 'text-slm-dark'}`}>{nombre}</h3>
                  <p className={`font-helvetica-neue text-sm ${featured ? 'text-slm-gray-light' : 'text-slm-gray'}`}><PricingText>{sub}</PricingText></p>
                </div>
                <div className={`font-helvetica-neue text-lg font-medium ${featured ? 'text-white' : 'text-slm-dark'}`}><PricingText>{precio}</PricingText></div>
                <ul className="flex flex-col gap-3 flex-1">
                  {feats.map((f, i) => (
                    <li key={i} className={`flex gap-2 text-sm font-helvetica-neue leading-snug ${featured ? 'text-slm-light/90' : 'text-slm-gray'}`}>
                      <span className={`mt-1.5 inline-block w-1 h-1 rounded-full flex-none ${featured ? 'bg-slm-brand-light' : 'bg-slm-brand'}`} /><span><PricingText>{f}</PricingText></span>
                    </li>
                  ))}
                </ul>
                <a
                  href="https://app.ragfly.ai"
                  className={`text-center font-medium text-sm px-5 py-3 rounded-full transition-opacity hover:opacity-90 ${featured ? 'bg-slm-brand-light text-slm-dark' : 'bg-slm-dark text-slm-light'}`}
                >
                  {cta}
                </a>
              </div>
            )
          })}
        </div>
        <div className="max-w-[900px] text-slm-gray font-helvetica-neue text-xs md:text-[13px] leading-relaxed flex flex-col gap-1.5">
          {notaLines.map((line, idx) => (
            <p key={idx}>
              <PricingText>{line}</PricingText>
            </p>
          ))}
        </div>
      </div>
    </section>
  )
}
