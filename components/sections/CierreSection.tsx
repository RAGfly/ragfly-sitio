'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { WaitlistForm } from '../WaitlistForm'
import { BlurIn } from './shared'

/* ------------------------------------------------------------------ */
/* CierreSection — S10 · fusión de Building + Built + WhyUs + CTA final */
/*                                                                     */
/* El FAQ vive en i18n (namespace `faq`, claves q0/a0…qN/aN + `total`), */
/* en los 5 idiomas. Se rinde como acordeón nativo (<details>): sin JS, */
/* sin rebote. content/faq.json quedó sin consumir.                     */
/* ------------------------------------------------------------------ */
export function CierreSection() {
  const t = useTranslations()
  const tFaq = useTranslations('faq')
  const faq = Array.from({ length: Number(tFaq('total')) }, (_, i) => ({
    q: tFaq(`q${i}` as Parameters<typeof tFaq>[0]),
    a: tFaq(`a${i}` as Parameters<typeof tFaq>[0]),
  }))

  return (
    <section id="cierre" className="relative rf-corte px-6 md:px-12 lg:px-[60px] py-24 md:py-32 bg-slm-light overflow-hidden">
      <div className="max-w-[1200px] mx-auto flex flex-col gap-16">
        <div className="max-w-[900px] flex flex-col gap-7">
          <span className="rf-anot text-slm-brand">{t('cierre.eyebrow')}</span>
          <BlurIn as="h2" className="text-slm-dark text-3xl md:text-[44px] font-helvetica-neue font-medium leading-[1.12] tracking-[-0.03em]">
            {t('cierre.titulo')}
          </BlurIn>
          <span className="rf-eje" aria-hidden="true" />
          <div className="flex flex-col gap-2 max-w-[620px]">
            <p className="text-slm-dark font-helvetica-neue text-lg font-medium leading-relaxed">
              {t('cierre.northStarTitulo')}
            </p>
            <p className="text-slm-gray font-helvetica-neue text-base leading-relaxed">{t('cierre.northStarDesc')}</p>
          </div>
          <div className="flex flex-col sm:flex-row items-start gap-3">
            <a
              href="https://app.ragfly.ai"
              className="bg-slm-dark text-slm-light px-7 py-3.5 rounded-full font-medium text-base hover:opacity-90 transition-opacity"
            >
              {t('cierre.ctaPrimario')}
            </a>
            <Link
              href="/build/mcp"
              className="border border-slm-dark text-slm-dark px-7 py-3.5 rounded-full font-medium text-base hover:bg-white transition-colors"
            >
              {t('cierre.ctaSecundario')}
            </Link>
          </div>
        </div>

        {/* FAQ — acordeón nativo */}
        <div id="faq" className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <span className="rf-anot text-slm-brand">{t('cierre.faqEyebrow')}</span>
            <h3 className="text-slm-dark text-2xl md:text-3xl font-helvetica-neue font-medium tracking-[-0.02em]">
              {t('cierre.faqTitulo')}
            </h3>
          </div>
          <div className="border border-slm-dark/10 bg-white">
            {faq.map((item) => (
              <details key={item.q} className="group border-b border-slm-dark/8 last:border-0">
                <summary className="flex items-start justify-between gap-6 cursor-pointer list-none px-6 py-5 text-slm-dark font-helvetica-neue text-base md:text-lg">
                  <span>{item.q}</span>
                  <span className="text-slm-brand text-xl leading-none flex-none select-none group-open:hidden" aria-hidden="true">+</span>
                  <span className="text-slm-brand text-xl leading-none flex-none select-none hidden group-open:inline" aria-hidden="true">−</span>
                </summary>
                <p className="px-6 pb-6 -mt-1 text-slm-gray font-helvetica-neue text-base leading-relaxed max-w-[900px]">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>

        {/* Contacto / waitlist */}
        <div id="contacto" className="border border-slm-dark/10 bg-white p-8 md:p-10 flex flex-col gap-6 max-w-[760px]">
          <WaitlistForm variant="onLight" />
          <p className="text-slm-gray font-helvetica-neue text-sm">
            {t('cierre.escribenos')}{' '}
            <a href="mailto:info@ragfly.ai" className="text-slm-brand underline underline-offset-2 hover:opacity-80">
              info@ragfly.ai
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}
