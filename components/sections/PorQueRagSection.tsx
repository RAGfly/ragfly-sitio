'use client'

import { useTranslations } from 'next-intl'
import { BlurIn } from './shared'

/* Por qué un RAG (MENSAJE-CANONICO §0, decisión del usuario 2026-11-11): va entre el hero y
   «Cómo funciona». Primero el porqué de un RAG; el porqué de RAGfly lo dan las secciones
   Simple, Privado y Preciso. Mismo texto que el aviso de LinkedIn. */
export function PorQueRagSection() {
  const t = useTranslations('porQueRag')
  return (
    <section id="por-que-rag" className="relative rf-corte px-6 md:px-12 lg:px-[60px] py-24 md:py-32 bg-slm-light overflow-hidden">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] gap-12 lg:gap-16 items-start">
        <div className="flex flex-col gap-6">
          <span className="rf-anot text-slm-brand">{t('eyebrow')}</span>
          <BlurIn as="h2" className="text-slm-dark text-3xl md:text-4xl lg:text-5xl font-helvetica-neue font-medium leading-[1.1] tracking-[-0.03em] text-balance">
            {t('titulo')}
          </BlurIn>
          <p className="text-slm-gray font-helvetica-neue text-lg md:text-xl leading-relaxed">{t('descripcion1')}</p>
          <span className="rf-eje" aria-hidden="true" />
        </div>
        <div className="flex flex-col gap-8 lg:pt-12">
          <p className="text-slm-dark font-helvetica-neue text-xl md:text-2xl font-medium leading-snug tracking-[-0.01em]">{t('descripcion2')}</p>
          <ul className="flex flex-col">
            {[0, 1, 2].map((i) => (
              <li key={i} className="border-t border-slm-dark/12 py-5 flex gap-4 items-baseline">
                <span className="font-[family-name:var(--font-dato)] text-sm text-slm-brand w-7 shrink-0" aria-hidden="true">{`0${i + 1}`}</span>
                <span className="text-slm-dark font-helvetica-neue text-base md:text-lg leading-relaxed">{t(`item${i}`)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
