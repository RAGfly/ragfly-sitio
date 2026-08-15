'use client'

import { useTranslations } from 'next-intl'
import { BlurIn } from './shared'

/* ------------------------------------------------------------------ */
/* IdentitiesSection — "Le das un perfil, no acceso"                    */
/* ------------------------------------------------------------------ */
export function IdentitiesSection() {
  const t = useTranslations()
  const tags = [0, 1, 2].map((i) => t(`identidades.tag${i}` as Parameters<typeof t>[0]))
  return (
    <section id="identidades" className="px-6 md:px-12 lg:px-[60px] py-24 md:py-32 bg-slm-light">
      <div className="max-w-[1100px] mx-auto flex flex-col gap-12">
        <div className="max-w-[820px] flex flex-col gap-6">
          <span className="text-sm uppercase tracking-[0.18em] text-slm-brand">{t('identidades.eyebrow')}</span>
          <BlurIn as="h2" className="text-slm-dark text-4xl md:text-5xl lg:text-6xl font-helvetica-neue font-medium leading-[1.05] tracking-[-0.03em]">
            {t('identidades.titulo1')}{' '}
            <span className="inline-block pb-[0.06em] bg-gradient-to-r from-slm-brand-dark via-slm-brand to-slm-brand-light bg-clip-text text-transparent">{t('identidades.tituloAccent')}</span>
          </BlurIn>
          <p className="text-slm-gray font-helvetica-neue text-base md:text-lg leading-relaxed">{t('identidades.descripcion')}</p>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          <p className="rounded-[24px] bg-white border border-slm-dark/8 p-8 text-slm-gray font-helvetica-neue text-base md:text-lg leading-relaxed">{t('identidades.p0')}</p>
          <p className="rounded-[24px] bg-white border border-slm-dark/8 p-8 text-slm-gray font-helvetica-neue text-base md:text-lg leading-relaxed">{t('identidades.p1')}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {tags.map((tag) => (
            <span key={tag} className="inline-flex items-center gap-2 rounded-full bg-white border border-slm-dark/8 px-4 py-2 text-sm text-slm-dark font-helvetica-neue">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-slm-brand" />{tag}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
