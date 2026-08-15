'use client'

import { useTranslations } from 'next-intl'
import { BlurIn } from './shared'

/* ------------------------------------------------------------------ */
/* Hero                                                                 */
/* ------------------------------------------------------------------ */
export function Hero() {
  const t = useTranslations()
  return (
    <div className="flex-1 flex flex-col items-center justify-between px-6 md:px-12 pb-12 md:pb-16 relative">
      <div className="pt-6 md:pt-10 z-10">
        <BlurIn className="inline-flex items-center gap-2 rounded-full bg-white/70 backdrop-blur-md border border-slm-dark/10 px-4 py-1.5">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-gradient-to-br from-slm-brand-dark to-slm-brand-light" />
          <span className="text-xs md:text-sm tracking-[0.04em] text-slm-dark/80">{t('hero.eyebrow')}</span>
        </BlurIn>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center z-10 gap-6">
        <BlurIn
          as="h1"
          className="text-center font-helvetica-neue font-medium leading-[1.08] text-slm-dark max-w-4xl"
        >
          <span className="block text-4xl md:text-6xl lg:text-7xl tracking-[-0.03em]">{t('hero.headlineLead')}</span>
          <span className="block text-4xl md:text-6xl lg:text-7xl tracking-[-0.03em] pb-[0.12em] bg-gradient-to-r from-slm-brand-dark via-slm-brand to-slm-brand-light bg-clip-text text-transparent">
            {t('hero.headlineAccent')}
          </span>
        </BlurIn>
        <BlurIn delay={0.08} className="font-helvetica-neue text-lg md:text-2xl text-slm-dark/90 font-medium tracking-[0.01em] max-w-2xl text-center leading-snug">
          {t('hero.slogan')}
        </BlurIn>
        <BlurIn delay={0.09} className="font-helvetica-neue text-base md:text-lg text-slm-dark/75 tracking-[0.01em] max-w-2xl text-center leading-snug">
          {t('hero.lineaApoyo')}
        </BlurIn>
        <BlurIn delay={0.1} className="font-helvetica-neue text-base md:text-xl text-slm-gray tracking-[0.01em] max-w-2xl text-center leading-relaxed">
          {t('hero.tagline')}
        </BlurIn>
      </div>
      <div className="z-10 flex flex-col items-center gap-7 max-w-xl text-center">
        <BlurIn delay={0.3} className="flex flex-col sm:flex-row items-center gap-3">
          <a
            href="https://app.ragfly.ai"
            className="bg-slm-dark text-slm-light px-7 py-3 rounded-full font-medium text-base hover:opacity-90 transition-opacity"
          >
            {t('hero.ctaPrimario')}
          </a>
          <a
            href="#pruebalo"
            className="border border-slm-dark text-slm-dark px-7 py-3 rounded-full font-medium text-base hover:bg-gray-50 transition-colors"
          >
            {t('hero.ctaSecundario')}
          </a>
        </BlurIn>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white to-transparent z-20 pointer-events-none" />
    </div>
  )
}
