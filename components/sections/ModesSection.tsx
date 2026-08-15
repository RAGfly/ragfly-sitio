'use client'

import { useTranslations } from 'next-intl'
import { BlurIn } from './shared'

/* ------------------------------------------------------------------ */
/* ModesSection — "Cloud o Desktop"                                     */
/* ------------------------------------------------------------------ */
export function ModesSection() {
  const t = useTranslations()
  const cloud = [0, 1, 2].map((i) => t(`modos.cloud${i}` as Parameters<typeof t>[0]))
  const desktop = [0, 1, 2].map((i) => t(`modos.desktop${i}` as Parameters<typeof t>[0]))
  return (
    <section id="modos" className="px-6 md:px-12 lg:px-[60px] py-24 md:py-32 bg-white">
      <div className="max-w-[1200px] mx-auto flex flex-col gap-16">
        <div className="max-w-[680px] flex flex-col gap-6">
          <span className="text-sm uppercase tracking-[0.18em] text-slm-brand">{t('modos.eyebrow')}</span>
          <BlurIn as="h2" className="text-slm-dark text-4xl md:text-5xl lg:text-6xl font-helvetica-neue font-medium leading-[1.05] tracking-[-0.03em]">
            {t('modos.titulo1')}{' '}
            <span className="inline-block pb-[0.06em] bg-gradient-to-r from-slm-brand-dark via-slm-brand to-slm-brand-light bg-clip-text text-transparent">{t('modos.tituloAccent')}</span>
          </BlurIn>
          <p className="text-base md:text-lg text-slm-gray font-helvetica-neue max-w-[560px] leading-relaxed">{t('modos.descripcion')}</p>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          <div className="rounded-[28px] bg-slm-light border border-slm-dark/8 p-8 md:p-10 flex flex-col gap-5">
            <span className="text-xs uppercase tracking-[0.16em] text-slm-brand">{t('modos.cloudTitulo')}</span>
            <p className="text-slm-gray font-helvetica-neue text-base md:text-lg leading-relaxed">{t('modos.cloudDesc')}</p>
            <ul className="flex flex-col gap-3 mt-auto">
              {cloud.map((s, i) => (
                <li key={i} className="flex gap-3 text-slm-dark/85 font-helvetica-neue text-base leading-snug">
                  <span className="mt-2 inline-block w-1.5 h-1.5 rounded-full bg-slm-brand flex-none" />{s}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-[28px] bg-slm-dark text-slm-light p-8 md:p-10 flex flex-col gap-5 relative overflow-hidden border border-slm-brand-dark/40">
            <div className="absolute inset-0 opacity-50 pointer-events-none"
              style={{ background: 'radial-gradient(600px 400px at 90% 0%, rgba(0,139,214,0.28), transparent 70%)' }} />
            <div className="relative flex flex-col gap-5">
              <span className="text-xs uppercase tracking-[0.16em] text-slm-brand-light">{t('modos.desktopTitulo')}</span>
              <p className="text-slm-light/85 font-helvetica-neue text-base md:text-lg leading-relaxed">{t('modos.desktopDesc')}</p>
              <ul className="flex flex-col gap-3">
                {desktop.map((s, i) => (
                  <li key={i} className="flex gap-3 text-slm-light/90 font-helvetica-neue text-base leading-snug">
                    <span className="mt-2 inline-block w-1.5 h-1.5 rounded-full bg-slm-brand-light flex-none" />{s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <p className="max-w-[760px] text-slm-gray font-helvetica-neue text-base md:text-lg leading-relaxed">{t('modos.nota')}</p>
      </div>
    </section>
  )
}
