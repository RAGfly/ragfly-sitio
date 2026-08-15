'use client'

import { useTranslations } from 'next-intl'
import { BlurIn } from './shared'

/* ------------------------------------------------------------------ */
/* BuildingSection — "¿Qué estás construyendo?" · 3 perfiles            */
/* ------------------------------------------------------------------ */
export function BuildingSection() {
  const t = useTranslations()
  const cards = [
    { tag: t('construyendo.cardATag'), h: t('construyendo.cardATitulo'), d: t('construyendo.cardADesc'), cta: t('construyendo.cardACta'), href: 'https://app.ragfly.ai' },
    { tag: t('construyendo.cardBTag'), h: t('construyendo.cardBTitulo'), d: t('construyendo.cardBDesc'), cta: t('construyendo.cardBCta'), href: '#diferencia' },
    { tag: t('construyendo.cardCTag'), h: t('construyendo.cardCTitulo'), d: t('construyendo.cardCDesc'), cta: t('construyendo.cardCCta'), href: '#como-se-usa' },
  ]
  return (
    <section id="construyendo" className="px-6 md:px-12 lg:px-[60px] py-24 md:py-32 bg-white">
      <div className="max-w-[1280px] mx-auto flex flex-col gap-16">
        <div className="max-w-[760px] flex flex-col gap-6">
          <span className="text-sm uppercase tracking-[0.18em] text-slm-brand">{t('construyendo.eyebrow')}</span>
          <BlurIn as="h2" className="text-slm-dark text-4xl md:text-5xl lg:text-6xl font-helvetica-neue font-medium leading-[1.05] tracking-[-0.03em]">
            {t('construyendo.titulo1')}{' '}
            <em className="not-italic inline-block pb-[0.06em] bg-gradient-to-r from-slm-brand-dark via-slm-brand to-slm-brand-light bg-clip-text text-transparent">{t('construyendo.tituloEm')}</em>{' '}
            {t('construyendo.titulo2')}
          </BlurIn>
          <p className="text-base md:text-lg text-slm-gray font-helvetica-neue max-w-[560px] leading-relaxed">
            {t('construyendo.descripcion')}
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {cards.map((c) => (
            <a
              key={c.tag}
              href={c.href}
              className="group rounded-[28px] p-8 md:p-9 flex flex-col gap-5 min-h-[320px] bg-slm-light border border-slm-dark/8 hover:border-slm-brand/40 transition-colors"
            >
              <span className="text-xs uppercase tracking-[0.16em] text-slm-brand">{c.tag}</span>
              <h3 className="font-helvetica-neue text-2xl md:text-[28px] font-medium text-slm-dark tracking-[-0.02em] leading-tight">{c.h}</h3>
              <p className="font-helvetica-neue text-base text-slm-gray leading-relaxed flex-1">{c.d}</p>
              <span className="inline-flex items-center gap-2 text-sm font-medium text-slm-dark group-hover:gap-3 transition-all">
                {c.cta}<span aria-hidden="true">→</span>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
