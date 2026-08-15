'use client'

import { useTranslations } from 'next-intl'
import { WaitlistForm } from '../WaitlistForm'

/* ------------------------------------------------------------------ */
/* FinalCTASection                                                      */
/* ------------------------------------------------------------------ */
export function FinalCTASection() {
  const t = useTranslations()
  return (
    <section id="contacto" className="px-6 md:px-12 lg:px-[60px] py-24 md:py-32 bg-slm-light">
      <div className="max-w-[1100px] mx-auto rounded-[40px] p-10 md:p-16 lg:p-20 bg-gradient-to-br from-slm-brand-dark via-slm-brand to-slm-brand-light relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <div className="relative flex flex-col items-start gap-8 max-w-[640px]">
          <span className="text-sm uppercase tracking-[0.18em] text-white/80">{t('cta.eyebrow')}</span>
          <h2 className="text-white text-4xl md:text-5xl lg:text-6xl font-helvetica-neue font-medium leading-[1.05] tracking-[-0.03em]">
            {t('cta.titulo')}
          </h2>
          <p className="text-white/85 font-helvetica-neue text-base md:text-lg max-w-[480px] leading-relaxed">
            {t('cta.subtitulo')}
          </p>
          <div className="flex flex-col sm:flex-row items-start gap-3">
            <a href="https://app.ragfly.ai" className="bg-white text-slm-dark px-7 py-3.5 rounded-full font-medium text-base hover:opacity-90 transition-opacity">
              {t('cta.ctaPrimario')}
            </a>
            <a href="#pruebalo" className="border border-white/40 text-white px-7 py-3.5 rounded-full font-medium text-base hover:bg-white/10 transition-colors">
              {t('cta.ctaSecundario')}
            </a>
          </div>
          <div className="w-full pt-6 mt-2 border-t border-white/20">
            <WaitlistForm variant="onDark" />
          </div>
          <p className="text-white/70 font-helvetica-neue text-sm">
            {t('cta.escribenos')}{' '}
            <a href="mailto:info@ragfly.ai" className="text-white underline underline-offset-2 hover:text-white/80">info@ragfly.ai</a>
          </p>
        </div>
      </div>
    </section>
  )
}
