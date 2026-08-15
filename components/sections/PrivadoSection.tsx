'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { BlurIn } from './shared'

/* ------------------------------------------------------------------ */
/* PrivadoSection — S4 · familias C (manifiesto) y A (carta)            */
/* Absorbe ModesSection + SecuritySection.                              */
/*                                                                     */
/* El titular es la frase canónica COMPLETA: la segunda mitad («y si   */
/* quieres, el documento no sale de tu red») nunca se recorta.         */
/* ------------------------------------------------------------------ */
export function PrivadoSection() {
  const t = useTranslations()
  const pildoras = [0, 1, 2].map((i) => t(`privado.pildora${i}` as Parameters<typeof t>[0]))

  return (
    <section id="privado" className="relative rf-corte px-6 md:px-12 lg:px-[60px] py-24 md:py-32 bg-slm-light overflow-hidden">
      <div className="max-w-[1200px] mx-auto flex flex-col gap-14">
        <div className="max-w-[860px] flex flex-col gap-6">
          <span className="rf-anot text-slm-brand">{t('privado.eyebrow')}</span>
          <BlurIn as="h2" className="text-slm-dark text-3xl md:text-5xl font-helvetica-neue font-medium leading-[1.08] tracking-[-0.03em]">
            {t('privado.titulo1')}{' '}
            <span className="text-slm-brand-dark">{t('privado.tituloAccent')}</span>
          </BlurIn>
          <span className="rf-eje" aria-hidden="true" />
          <p className="text-slm-gray font-helvetica-neue text-base md:text-lg leading-relaxed">
            {t('privado.descripcion')}
          </p>
        </div>

        {/* Pieza 1 — el manifiesto */}
        <div className="grid lg:grid-cols-[1.05fr_1fr] gap-8 lg:gap-12 items-center border border-slm-dark/10 bg-white p-6 md:p-10">
          <div className="flex flex-col gap-5">
            <span className="rf-anot text-slm-dark/45">{t('privado.manifiestoTag')}</span>
            <h3 className="font-helvetica-neue text-2xl md:text-3xl font-medium text-slm-dark tracking-[-0.02em] leading-tight">
              {t('privado.manifiestoTitulo')}
            </h3>
            <p className="text-slm-gray font-helvetica-neue text-base leading-relaxed">{t('privado.manifiestoDesc')}</p>
            <div className="border-l border-slm-brand/50 pl-4 flex flex-col gap-2">
              <p className="text-slm-dark font-helvetica-neue text-base leading-relaxed font-medium">
                {t('privado.subeTitulo')}
              </p>
              <p className="text-slm-gray font-helvetica-neue text-base leading-relaxed">{t('privado.subeDesc')}</p>
            </div>
          </div>
          <Image src="/design/C-manifiesto.svg" alt="" aria-hidden width={960} height={520} className="w-full h-auto" />
        </div>

        {/* Pieza 2 — carta de espacio aéreo + privilegios por área */}
        <div className="grid lg:grid-cols-[1fr_1.05fr] gap-8 lg:gap-12 items-center border border-slm-dark/10 bg-white p-6 md:p-10">
          <Image src="/design/A-carta-espacio-aereo.svg" alt="" aria-hidden width={960} height={520} className="w-full h-auto order-2 lg:order-1" />
          <div className="flex flex-col gap-5 order-1 lg:order-2">
            <span className="rf-anot text-slm-dark/45">{t('privado.cartaTag')}</span>
            <h3 className="font-helvetica-neue text-2xl md:text-3xl font-medium text-slm-dark tracking-[-0.02em] leading-tight">
              {t('privado.cartaTitulo')}
            </h3>
            <p className="text-slm-gray font-helvetica-neue text-base leading-relaxed">{t('privado.cartaDesc')}</p>
            <p className="text-slm-dark/85 font-helvetica-neue text-base leading-relaxed">{t('privado.cartaCierre')}</p>
          </div>
        </div>

        {/* Pieza 3 — BYOK como claim propio · Pieza 4 — piso de privacidad */}
        <div className="grid lg:grid-cols-2 gap-5">
          <div className="border border-slm-dark/10 bg-white p-8 md:p-10 flex flex-col gap-5">
            <span className="rf-anot text-slm-dark/45">{t('privado.byokTag')}</span>
            <h3 className="font-helvetica-neue text-2xl md:text-[28px] font-medium text-slm-dark tracking-[-0.02em] leading-tight">
              {t('privado.byokTitulo')}
            </h3>
            <p className="text-slm-gray font-helvetica-neue text-base leading-relaxed">{t('privado.byokDesc')}</p>
            <p className="text-slm-dark/85 font-helvetica-neue text-base leading-relaxed border-t border-slm-dark/8 pt-5 mt-auto">
              {t('privado.byokNota')}
            </p>
          </div>
          <div className="border border-slm-dark/10 bg-white p-8 md:p-10 flex flex-col gap-5">
            <span className="rf-anot text-slm-dark/45">{t('privado.pisoTag')}</span>
            <h3 className="font-helvetica-neue text-2xl md:text-[28px] font-medium text-slm-dark tracking-[-0.02em] leading-tight">
              {t('privado.pisoTitulo')}
            </h3>
            <p className="text-slm-gray font-helvetica-neue text-base leading-relaxed">{t('privado.pisoDesc')}</p>
            <p className="text-slm-gray font-helvetica-neue text-base leading-relaxed">{t('privado.pisoVerificacion')}</p>
            <p className="text-slm-dark/70 font-helvetica-neue text-sm leading-relaxed border-t border-slm-dark/8 pt-5 mt-auto italic">
              {t('privado.pisoHonestidad')}
            </p>
          </div>
        </div>

        {/* Píldoras técnicas — instrumento */}
        <div className="flex flex-col gap-4">
          <span className="rf-anot text-slm-dark/45">{t('privado.pildorasTitulo')}</span>
          <div className="flex flex-wrap gap-3">
            {pildoras.map((p) => (
              <span key={p} className="border border-slm-dark/12 bg-white px-4 py-2.5 font-mono text-xs md:text-sm text-slm-dark/80">
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
