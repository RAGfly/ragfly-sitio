'use client'

import { useTranslations } from 'next-intl'
import { BlurIn } from './shared'

/* ------------------------------------------------------------------ */
/* ChatSection — "Pruébalo hablándole" · chat como demo de DX           */
/* ------------------------------------------------------------------ */
export function ChatSection() {
  const t = useTranslations()
  const turns = [0, 1, 2].map((i) => ({
    q: t(`chat.demo${i}` as Parameters<typeof t>[0]),
    r: t(`chat.demo${i}r` as Parameters<typeof t>[0]),
  }))
  return (
    <section id="pruebalo" className="px-6 md:px-12 lg:px-[60px] py-24 md:py-32 bg-white">
      <div className="max-w-[1200px] mx-auto grid lg:grid-cols-[1fr_1fr] gap-12 lg:gap-16 items-center">
        <div className="flex flex-col gap-6">
          <span className="text-sm uppercase tracking-[0.18em] text-slm-brand">{t('chat.eyebrow')}</span>
          <BlurIn as="h2" className="text-slm-dark text-4xl md:text-5xl font-helvetica-neue font-medium leading-[1.05] tracking-[-0.03em]">
            {t('chat.titulo1')}{' '}
            <span className="inline-block pb-[0.06em] bg-gradient-to-r from-slm-brand-dark via-slm-brand to-slm-brand-light bg-clip-text text-transparent">{t('chat.tituloAccent')}</span>
          </BlurIn>
          <p className="text-slm-gray font-helvetica-neue text-base md:text-lg leading-relaxed">{t('chat.descripcion')}</p>
          <p className="text-slm-gray font-helvetica-neue text-base md:text-lg leading-relaxed">{t('chat.descripcion2')}</p>
          <p className="text-sm text-slm-dark/60 font-helvetica-neue italic border-l-2 border-slm-brand/40 pl-4">{t('chat.nota')}</p>
        </div>

        <div className="rounded-[28px] bg-slm-dark text-slm-light p-6 md:p-8 flex flex-col gap-4 border border-slm-brand-dark/40">
          {turns.map((turn, i) => (
            <div key={i} className="flex flex-col gap-2">
              <div className="self-end max-w-[85%] rounded-2xl rounded-br-sm bg-slm-brand text-white px-4 py-2.5 font-mono text-sm leading-snug">
                {turn.q}
              </div>
              <div className="self-start max-w-[90%] rounded-2xl rounded-bl-sm bg-white/8 text-slm-light/90 px-4 py-2.5 font-helvetica-neue text-sm leading-snug">
                {turn.r}
              </div>
            </div>
          ))}
          <div className="mt-2 flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-4 py-2.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-slm-brand-light animate-pulse" />
            <span className="text-sm text-slm-gray-light font-helvetica-neue">RAGfly · escribe lo que necesites…</span>
          </div>
        </div>
      </div>
    </section>
  )
}
