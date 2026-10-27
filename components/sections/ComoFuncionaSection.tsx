'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { BlurIn } from './shared'

export function ComoFuncionaSection() {
  const t = useTranslations('comoFunciona')
  return (
    <section id="como-funciona" className="relative rf-corte px-6 md:px-12 lg:px-[60px] py-24 md:py-32 bg-white overflow-hidden">
      <div className="max-w-[1200px] mx-auto flex flex-col gap-14">
        <div className="max-w-[760px] flex flex-col gap-6">
          <span className="rf-anot text-slm-brand">{t('eyebrow')}</span>
          <BlurIn as="h2" className="text-slm-dark text-4xl md:text-5xl lg:text-6xl font-helvetica-neue font-medium leading-[1.05] tracking-[-0.03em]">
            {t('titulo')}
          </BlurIn>
          <span className="rf-eje" aria-hidden="true" />
        </div>
        <ol className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {[0, 1, 2].map((i) => (
            <li key={i} className="min-w-0 border-t border-slm-dark/12 pt-6 flex flex-col gap-4">
              <span className="font-[family-name:var(--font-dato)] text-5xl md:text-6xl text-slm-brand/60" aria-hidden="true">{i + 1}</span>
              <h3 className="font-helvetica-neue text-2xl font-medium text-slm-dark tracking-[-0.02em]">{t(`paso${i}Titulo`)}</h3>
              <p className="text-slm-gray font-helvetica-neue text-base leading-relaxed">{t(`paso${i}Desc`)}</p>
              {i === 0 && <p className="font-interfaz text-sm text-slm-brand-dark">{t('paso0Nota')}</p>}
              {i === 2 && (
                <p className="font-interfaz text-sm text-slm-gray leading-relaxed">
                  {t('paso2Nota')}{' · '}
                  <Link href="/build/mcp" className="text-slm-brand-dark underline underline-offset-4 hover:opacity-75">{t('guia')} →</Link>
                </p>
              )}
            </li>
          ))}
        </ol>
        <a href="https://app.ragfly.ai" className="rf-boton self-start bg-slm-dark text-slm-light px-7 py-3 rounded-full font-medium text-base hover:opacity-90 transition-opacity">{t('cta')}</a>
      </div>
    </section>
  )
}
