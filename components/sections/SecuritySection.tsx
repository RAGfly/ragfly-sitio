'use client'

import { useTranslations } from 'next-intl'
import { BlurIn } from './shared'

/* ------------------------------------------------------------------ */
/* SecuritySection                                                      */
/* ------------------------------------------------------------------ */
export function SecuritySection() {
  const t = useTranslations()
  const puntos = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => t(`seguridad.punto${i}` as Parameters<typeof t>[0]))
  return (
    <section id="seguridad" className="px-6 md:px-12 lg:px-[60px] py-24 md:py-32 bg-slm-dark text-slm-light relative overflow-hidden">
      <div className="absolute inset-0 opacity-40 pointer-events-none"
        style={{ background: 'radial-gradient(700px 500px at 90% 10%, rgba(0,139,214,0.30), transparent 60%), radial-gradient(600px 400px at 0% 90%, rgba(213,236,248,0.15), transparent 70%)' }} />
      <div className="relative max-w-[1200px] mx-auto grid lg:grid-cols-2 gap-16 items-start">
        <div className="flex flex-col gap-8">
          <span className="text-sm uppercase tracking-[0.18em] text-slm-brand-light">{t('seguridad.eyebrow')}</span>
          <BlurIn as="h2" className="text-4xl md:text-5xl lg:text-6xl font-helvetica-neue font-medium leading-[1.05] tracking-[-0.03em]">
            {t('seguridad.titulo1')} <span className="text-slm-brand-light">{t('seguridad.tituloAccent')}</span>
          </BlurIn>
          <p className="text-base md:text-lg text-slm-gray-light font-helvetica-neue max-w-[480px] leading-relaxed">
            {t('seguridad.descripcion')}
          </p>
        </div>
        <ul className="flex flex-col gap-px bg-white/10 rounded-[24px] overflow-hidden border border-white/10">
          {puntos.map((p, i) => (
            <li key={i} className="bg-slm-dark px-6 py-5 flex gap-4 items-start">
              <span className="text-xs text-slm-brand-light mt-1 flex-none">{String(i + 1).padStart(2, '0')}</span>
              <span className="font-helvetica-neue text-base md:text-lg text-slm-light/90 leading-snug">{p}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
