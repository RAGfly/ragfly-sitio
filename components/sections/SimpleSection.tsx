'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { BlurIn } from './shared'

/* ------------------------------------------------------------------ */
/* SimpleSection — S3 · familia B (perfil de vuelo)                     */
/* Absorbe ProblemSolutionSection + WhatIsSection.                      */
/* Sin «<30 min»: la ingesta es desatendida; la velocidad va en runtime.*/
/* ------------------------------------------------------------------ */

/* Estados REALES del pipeline (docs/operativos/OPER_PROCESS_PIPELINE). */
const ESTADOS = ['CARGADO', 'METADATA', 'ESCANEADO', 'CHUNKEADO', 'VECTORIZADO']

export function SimpleSection() {
  const t = useTranslations()

  return (
    <section id="simple" className="relative rf-corte px-6 md:px-12 lg:px-[60px] py-24 md:py-32 bg-white overflow-hidden">
      <div className="max-w-[1200px] mx-auto flex flex-col gap-14">
        <div className="max-w-[760px] flex flex-col gap-6">
          <span className="rf-anot text-slm-brand">{t('simple.eyebrow')}</span>
          <BlurIn as="h2" className="text-slm-dark text-4xl md:text-5xl lg:text-6xl font-helvetica-neue font-medium leading-[1.05] tracking-[-0.03em]">
            {t('simple.titulo1')}{' '}
            <span className="text-slm-brand-dark">{t('simple.tituloAccent')}</span>
          </BlurIn>
          <span className="rf-eje" aria-hidden="true" />
          <p className="text-slm-gray font-helvetica-neue text-base md:text-lg leading-relaxed">
            {t('simple.descripcion')}
          </p>
        </div>

        {/* Perfil de vuelo + estados del pipeline en monoespaciada */}
        <div className="border border-slm-dark/10 p-6 md:p-10 flex flex-col gap-8">
          <Image
            src="/design/B-perfil-de-vuelo.svg"
            alt=""
            aria-hidden
            width={960}
            height={500}
            className="w-full h-auto"
          />
          <div className="flex flex-col gap-3">
            <span className="rf-anot text-slm-dark/45">{t('simple.pipelineTitulo')}</span>
            <ol className="flex flex-wrap items-center gap-x-3 gap-y-2">
              {ESTADOS.map((e, i) => (
                <li key={e} className="flex items-center gap-3">
                  <span className="rf-anot text-slm-dark/80 border border-slm-dark/12 px-2.5 py-1.5">{e}</span>
                  {i < ESTADOS.length - 1 && <span className="text-slm-dark/25" aria-hidden="true">→</span>}
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <div className="border border-slm-dark/10 p-8 flex flex-col gap-3">
            <h3 className="font-helvetica-neue text-xl md:text-2xl font-medium text-slm-dark tracking-[-0.02em]">
              {t('simple.ritmoTitulo')}
            </h3>
            <p className="text-slm-gray font-helvetica-neue text-base leading-relaxed">{t('simple.ritmoDesc')}</p>
          </div>
          <div className="border border-slm-dark/10 p-8 flex flex-col gap-3">
            <h3 className="font-helvetica-neue text-xl md:text-2xl font-medium text-slm-dark tracking-[-0.02em]">
              {t('simple.onboardingTitulo')}
            </h3>
            <p className="text-slm-gray font-helvetica-neue text-base leading-relaxed">{t('simple.onboardingDesc')}</p>
          </div>
          {/* Par simétrico: por dónde entra el documento y por dónde sale la
              respuesta. Misma estructura en las dos — etiqueta, lista y un pie
              con su matiz— para que se lean como las dos bocas del pipeline. */}
          <div className="border border-slm-dark/10 p-8 flex flex-col gap-3">
            <span className="rf-anot text-slm-dark/45">{t('simple.formatosTitulo')}</span>
            <p className="text-slm-dark/85 font-helvetica-neue text-base leading-relaxed">{t('simple.formatos')}</p>
            <p className="text-slm-gray font-helvetica-neue text-sm leading-relaxed mt-auto pt-3 border-t border-slm-dark/8">
              <span className="rf-anot text-slm-dark/45 mr-2">{t('simple.limiteTitulo')}</span>
              {t('simple.limiteDesc')}
            </p>
          </div>
          <div className="border border-slm-dark/10 p-8 flex flex-col gap-3">
            <span className="rf-anot text-slm-dark/45">{t('simple.interfacesTitulo')}</span>
            <p className="text-slm-dark/85 font-helvetica-neue text-base leading-relaxed">{t('simple.interfaces')}</p>
            <p className="text-slm-gray font-helvetica-neue text-sm leading-relaxed mt-auto pt-3 border-t border-slm-dark/8">
              <span className="rf-anot text-slm-dark/45 mr-2">{t('simple.interfacesNotaTitulo')}</span>
              {t('simple.interfacesNotaDesc')}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
