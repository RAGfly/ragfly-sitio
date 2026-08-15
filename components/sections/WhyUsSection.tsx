'use client'

import { useTranslations } from 'next-intl'
import { BlurIn } from './shared'

/* ------------------------------------------------------------------ */
/* WhyUsSection — "Por qué RAGfly" · 6 razones                          */
/* ------------------------------------------------------------------ */
export function WhyUsSection() {
  const t = useTranslations()
  const items = [0, 1, 2, 3, 4, 5].map((i) => ({
    titulo: t(`porQue.item${i}Titulo` as Parameters<typeof t>[0]),
    desc: t(`porQue.item${i}Desc` as Parameters<typeof t>[0]),
  }))
  return (
    <section id="por-que" className="px-6 md:px-12 lg:px-[60px] py-24 md:py-32 bg-white">
      <div className="max-w-[1200px] mx-auto flex flex-col gap-16">
        <div className="max-w-[680px] flex flex-col gap-6">
          <span className="text-sm uppercase tracking-[0.18em] text-slm-brand">{t('porQue.eyebrow')}</span>
          <BlurIn as="h2" className="text-slm-dark text-4xl md:text-5xl lg:text-6xl font-helvetica-neue font-medium leading-[1.05] tracking-[-0.03em]">
            {t('porQue.titulo')}
          </BlurIn>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((r, i) => {
            const azul = i === 0
            return (
              <div
                key={r.titulo}
                className={`rounded-[24px] p-8 flex flex-col gap-4 ${azul ? 'bg-gradient-to-br from-slm-brand-dark via-slm-brand to-slm-brand-light text-white' : 'bg-slm-light'}`}
              >
                <span className={`text-xs ${azul ? 'text-white/70' : 'text-slm-gray-light'}`}>{String(i + 1).padStart(2, '0')}</span>
                <h3 className={`font-helvetica-neue text-2xl font-medium tracking-[-0.02em] leading-tight ${azul ? 'text-white' : 'text-slm-dark'}`}>{r.titulo}</h3>
                <p className={`font-helvetica-neue text-base leading-relaxed ${azul ? 'text-white/85' : 'text-slm-gray'}`}>{r.desc}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
