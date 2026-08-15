'use client'

import { useTranslations } from 'next-intl'
import { BlurIn } from './shared'

/* ------------------------------------------------------------------ */
/* LockInSection — S8.bis (NUEVA) · «Sin lock-in», una pantalla         */
/* Familia F (instrumento): tres diales —modelo / base / corpus—, cada  */
/* uno con su dueño. Se dibujan inline y SIN cifras: la familia F exige */
/* que solo aparezcan números reales, y aquí no hay ninguno que medir.  */
/* Nunca «BYOK» a secas: siempre parsing-BYOK y embedding-BYOK.         */
/* ------------------------------------------------------------------ */
export function LockInSection() {
  const t = useTranslations()
  const diales = [0, 1, 2].map((i) => ({
    tag: t(`lockin.card${i}Tag` as Parameters<typeof t>[0]),
    titulo: t(`lockin.card${i}Titulo` as Parameters<typeof t>[0]),
    desc: t(`lockin.card${i}Desc` as Parameters<typeof t>[0]),
  }))

  return (
    <section id="lock-in" className="relative rf-corte px-6 md:px-12 lg:px-[60px] py-24 md:py-32 bg-slm-cabina text-slm-light overflow-hidden">
      <div className="max-w-[1200px] mx-auto flex flex-col gap-12">
        <div className="max-w-[760px] flex flex-col gap-6">
          <span className="rf-anot text-slm-brand-light/80">{t('lockin.eyebrow')}</span>
          <BlurIn as="h2" className="text-4xl md:text-5xl lg:text-6xl font-helvetica-neue font-medium leading-[1.05] tracking-[-0.03em]">
            {t('lockin.titulo1')}{' '}
            <span className="text-slm-brand-light">{t('lockin.tituloAccent')}</span>
          </BlurIn>
          <span className="rf-eje" aria-hidden="true" />
          <p className="text-slm-gray-light font-helvetica-neue text-base md:text-lg leading-relaxed">
            {t('lockin.descripcion')}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-px bg-white/10 border border-white/10">
          {diales.map((d) => (
            <div key={d.tag} className="bg-slm-cabina p-8 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="rf-anot text-slm-brand-light/70">{d.tag}</span>
                <span className="rf-anot text-slm-light/40">{t('lockin.dueno')}</span>
              </div>
              {/* Dial: arco fino, sin relleno ni cifra inventada. */}
              <svg viewBox="0 0 120 66" width="120" height="66" fill="none" aria-hidden="true">
                <path d="M10 60 A50 50 0 0 1 110 60" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
                <path d="M10 60 A50 50 0 0 1 110 60" stroke="#55B2E4" strokeWidth="1.5" strokeDasharray="118 40" />
                <path d="M60 60 L90 26" stroke="#55B2E4" strokeWidth="1" strokeLinecap="round" />
                <circle cx="60" cy="60" r="2.5" fill="#55B2E4" />
              </svg>
              <h3 className="font-helvetica-neue text-xl md:text-2xl font-medium tracking-[-0.02em] leading-tight">
                {d.titulo}
              </h3>
              <p className="text-slm-gray-light font-helvetica-neue text-base leading-relaxed">{d.desc}</p>
            </div>
          ))}
        </div>

        <p className="max-w-[820px] font-helvetica-neue text-lg md:text-xl leading-relaxed text-slm-light/90 border-l border-slm-brand-light/50 pl-5">
          {t('lockin.remate')}
        </p>
      </div>
    </section>
  )
}
