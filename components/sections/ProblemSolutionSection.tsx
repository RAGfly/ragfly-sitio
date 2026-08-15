'use client'

import { useTranslations } from 'next-intl'
import { BlurIn } from './shared'

/* ------------------------------------------------------------------ */
/* ProblemSolutionSection — "el RAG se rompe a escala" + tabla          */
/* ------------------------------------------------------------------ */
export function ProblemSolutionSection() {
  const t = useTranslations()
  const sin = [0, 1, 2, 3, 4].map((i) => t(`problema.sin${i}` as Parameters<typeof t>[0]))
  const con = [0, 1, 2, 3, 4].map((i) => t(`problema.con${i}` as Parameters<typeof t>[0]))
  return (
    <section id="problema" className="px-6 md:px-12 lg:px-[60px] py-24 md:py-32 bg-slm-dark text-slm-light relative overflow-hidden">
      <div className="absolute inset-0 opacity-30 pointer-events-none"
        style={{ background: 'radial-gradient(800px 500px at 80% 20%, rgba(0,139,214,0.35), transparent 60%), radial-gradient(700px 500px at 10% 90%, rgba(213,236,248,0.18), transparent 70%)' }} />
      <div className="relative max-w-[1200px] mx-auto flex flex-col gap-16">
        <div className="max-w-[680px] flex flex-col gap-6">
          <span className="text-sm uppercase tracking-[0.18em] text-slm-brand-light">{t('problema.eyebrow')}</span>
          <BlurIn as="h2" className="text-4xl md:text-5xl lg:text-6xl font-helvetica-neue font-medium leading-[1.05] tracking-[-0.03em]">
            {t('problema.titulo1')} <span className="text-slm-brand-light">{t('problema.tituloAccent')}</span>
          </BlurIn>
          <p className="text-base md:text-lg text-slm-gray-light font-helvetica-neue max-w-[600px] leading-relaxed">
            {t('problema.descripcion')}
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          <div className="rounded-[28px] border border-white/10 p-8 md:p-10 bg-white/[0.03] backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-slm-gray-light text-sm">—</span>
              <span className="text-sm uppercase tracking-[0.18em] text-slm-gray-light">{t('problema.sinTitulo')}</span>
            </div>
            <ul className="flex flex-col gap-4">
              {sin.map((s, i) => (
                <li key={i} className="flex gap-3 text-slm-light/80 font-helvetica-neue text-base md:text-lg leading-snug">
                  <span className="mt-2 inline-block w-1.5 h-1.5 rounded-full bg-slm-gray-light flex-none" />{s}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-[28px] p-8 md:p-10 bg-gradient-to-br from-slm-brand-dark via-slm-brand/30 to-slm-brand-light/10 border border-slm-brand-light/30">
            <div className="flex items-center gap-3 mb-6">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slm-brand-light/20 text-slm-brand-light text-sm">✓</span>
              <span className="text-sm uppercase tracking-[0.18em] text-slm-brand-light">{t('problema.conTitulo')}</span>
            </div>
            <ul className="flex flex-col gap-4">
              {con.map((s, i) => (
                <li key={i} className="flex gap-3 text-slm-light font-helvetica-neue text-base md:text-lg leading-snug">
                  <span className="mt-2 inline-block w-1.5 h-1.5 rounded-full bg-slm-brand-light flex-none" />{s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
