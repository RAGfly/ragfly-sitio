'use client'

import { useTranslations } from 'next-intl'
import { BlurIn } from './shared'

/* ------------------------------------------------------------------ */
/* BuiltSection — "Cómo está construido"                                */
/* ------------------------------------------------------------------ */
export function BuiltSection() {
  const t = useTranslations()
  const items = [0, 1, 2, 3].map((i) => ({
    titulo: t(`construido.item${i}Titulo` as Parameters<typeof t>[0]),
    desc: t(`construido.item${i}Desc` as Parameters<typeof t>[0]),
  }))
  return (
    <section id="construido" className="px-6 md:px-12 lg:px-[60px] py-24 md:py-32 bg-white">
      <div className="max-w-[1200px] mx-auto flex flex-col gap-16">
        <div className="max-w-[680px] flex flex-col gap-6">
          <span className="text-sm uppercase tracking-[0.18em] text-slm-brand">{t('construido.eyebrow')}</span>
          <BlurIn as="h2" className="text-slm-dark text-4xl md:text-5xl lg:text-6xl font-helvetica-neue font-medium leading-[1.05] tracking-[-0.03em]">
            {t('construido.titulo1')}{' '}
            <span className="inline-block pb-[0.06em] bg-gradient-to-r from-slm-brand-dark via-slm-brand to-slm-brand-light bg-clip-text text-transparent">{t('construido.tituloAccent')}</span>
          </BlurIn>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {items.map((c, i) => (
            <div key={c.titulo} className="rounded-[24px] bg-slm-light p-8 border border-slm-dark/5 flex flex-col gap-3">
              <div className="flex items-baseline justify-between">
                <h3 className="text-xl md:text-2xl font-helvetica-neue font-medium text-slm-dark tracking-[-0.02em]">{c.titulo}</h3>
                <span className="text-xs text-slm-gray-light">0{i + 1}</span>
              </div>
              <p className="text-slm-gray font-helvetica-neue text-base leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
