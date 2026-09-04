'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { BlurIn } from './shared'

/* ------------------------------------------------------------------ */
/* PrecisoSection — S5 · familia E (la estela)                          */
/* Evolución de CombinaSection: híbrida (3 ramas) + rerank con          */
/* degradación visible, citas con deep-link y evaluación con triage.    */
/* ------------------------------------------------------------------ */
export function PrecisoSection() {
  const t = useTranslations()
  const triage = [0, 1, 2, 3].map((i) => t(`preciso.triage${i}` as Parameters<typeof t>[0]))

  return (
    <section id="precision" className="relative rf-corte px-6 md:px-12 lg:px-[60px] py-24 md:py-32 bg-white overflow-hidden">
      <div className="max-w-[1200px] mx-auto flex flex-col gap-14">
        <div className="max-w-[760px] flex flex-col gap-6">
          <span className="rf-anot text-slm-brand">{t('preciso.eyebrow')}</span>
          <BlurIn as="h2" className="text-slm-dark text-4xl md:text-5xl lg:text-6xl font-helvetica-neue font-medium leading-[1.05] tracking-[-0.03em]">
            {t('preciso.titulo1')}{' '}
            <span className="text-slm-brand-dark">{t('preciso.tituloAccent')}</span>
          </BlurIn>
          <span className="rf-eje" aria-hidden="true" />
          <p className="text-slm-gray font-helvetica-neue text-base md:text-lg leading-relaxed">
            {t('preciso.descripcion')}
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_1.05fr] gap-8 lg:gap-12 items-center border border-slm-dark/10 p-6 md:p-10">
          <div className="flex flex-col gap-5">
            <span className="rf-anot text-slm-dark/45">{t('preciso.citasTag')}</span>
            <h3 className="font-helvetica-neue text-2xl md:text-3xl font-medium text-slm-dark tracking-[-0.02em] leading-tight">
              {t('preciso.citasTitulo')}
            </h3>
            <p className="text-slm-gray font-helvetica-neue text-base leading-relaxed">{t('preciso.citasDesc')}</p>
          </div>
          <Image src="/design/E-estela-de-la-cita.svg" alt="" aria-hidden width={960} height={520} className="w-full h-auto" />
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <div className="border border-slm-dark/10 p-8 md:p-10 flex flex-col gap-4">
            <span className="rf-anot text-slm-dark/45">{t('preciso.hibridaTag')}</span>
            <h3 className="font-helvetica-neue text-2xl font-medium text-slm-dark tracking-[-0.02em] leading-tight">
              {t('preciso.hibridaTitulo')}
            </h3>
            <p className="text-slm-gray font-helvetica-neue text-base leading-relaxed">{t('preciso.hibridaDesc')}</p>
            <p className="font-interfaz text-xs md:text-sm text-slm-dark/70 border-l border-slm-brand/50 pl-4 mt-auto">
              {t('preciso.degradacionNota')}
            </p>
          </div>
          <div className="border border-slm-dark/10 p-8 md:p-10 flex flex-col gap-4">
            <span className="rf-anot text-slm-dark/45">{t('preciso.evalTag')}</span>
            <h3 className="font-helvetica-neue text-2xl font-medium text-slm-dark tracking-[-0.02em] leading-tight">
              {t('preciso.evalTitulo')}
            </h3>
            <p className="text-slm-gray font-helvetica-neue text-base leading-relaxed">{t('preciso.evalDesc')}</p>
            <div className="flex flex-col gap-2 mt-auto pt-4 border-t border-slm-dark/8">
              <span className="rf-anot text-slm-dark/45">{t('preciso.triageTitulo')}</span>
              <ol className="flex flex-wrap gap-x-3 gap-y-2">
                {triage.map((n, i) => (
                  <li key={n} className="font-mono text-xs text-slm-dark/80 border border-slm-dark/12 px-2.5 py-1.5">
                    {String(i + 1).padStart(2, '0')} · {n}
                  </li>
                ))}
              </ol>
              <p className="text-slm-dark/85 font-helvetica-neue text-base leading-relaxed mt-2">{t('preciso.remate')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
