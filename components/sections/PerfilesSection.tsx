'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { BlurIn } from './shared'

/* ------------------------------------------------------------------ */
/* PerfilesSection — S7 · «la tripulación» (familia A)                  */
/* Evolución de IdentitiesSection, elevada de rango.                    */
/* ------------------------------------------------------------------ */
export function PerfilesSection() {
  const t = useTranslations()
  const puntos = [0, 1, 2, 3].map((i) => ({
    titulo: t(`perfiles.p${i}Titulo` as Parameters<typeof t>[0]),
    desc: t(`perfiles.p${i}Desc` as Parameters<typeof t>[0]),
  }))

  return (
    <section id="perfiles" className="relative rf-corte px-6 md:px-12 lg:px-[60px] py-24 md:py-32 bg-white overflow-hidden">
      <div className="max-w-[1200px] mx-auto flex flex-col gap-14">
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-14 items-center">
          <div className="flex flex-col gap-6">
            <span className="rf-anot text-slm-brand">{t('perfiles.eyebrow')}</span>
            <BlurIn as="h2" className="text-slm-dark text-3xl md:text-5xl font-helvetica-neue font-medium leading-[1.08] tracking-[-0.03em]">
              {t('perfiles.titulo1')}{' '}
              <span className="text-slm-brand-dark">{t('perfiles.tituloAccent')}</span>
            </BlurIn>
            <span className="rf-eje" aria-hidden="true" />
            <p className="text-slm-gray font-helvetica-neue text-base md:text-lg leading-relaxed">
              {t('perfiles.descripcion')}
            </p>
          </div>
          <Image src="/design/A-carta-espacio-aereo.svg" alt="" aria-hidden width={960} height={520} className="w-full h-auto" />
        </div>

        <div className="grid md:grid-cols-2 gap-px bg-slm-dark/10 border border-slm-dark/10">
          {puntos.map((p, i) => (
            <div key={p.titulo} className="bg-white p-8 flex flex-col gap-3">
              <div className="flex items-baseline justify-between">
                <h3 className="font-helvetica-neue text-xl md:text-2xl font-medium text-slm-dark tracking-[-0.02em]">
                  {p.titulo}
                </h3>
                <span className="rf-anot text-slm-dark/25">{String(i + 1).padStart(2, '0')}</span>
              </div>
              <p className="text-slm-gray font-helvetica-neue text-base leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>

        <p className="max-w-[820px] text-slm-dark font-interfaz text-lg md:text-xl leading-relaxed border-l border-slm-brand/50 pl-5">
          {t('perfiles.remate')}
        </p>
      </div>
    </section>
  )
}
