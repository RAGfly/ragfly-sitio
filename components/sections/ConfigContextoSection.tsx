'use client'

import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { BlurIn } from './shared'

/* ------------------------------------------------------------------ */
/* ConfigContextoSection — S6 (NUEVA) · «La configuración expande el    */
/* contexto». Sin ancestro en la página anterior.                       */
/*                                                                     */
/* Se venden las capas como CONFIGURABLES (siete capas, cinco          */
/* editables), no como pobladas. El glosario de dominio NO se promete: */
/* está parcial y por eso no aparece.                                  */
/* ------------------------------------------------------------------ */
export function ConfigContextoSection() {
  const t = useTranslations()
  const cards = [0, 1, 2].map((i) => ({
    tag: t(`config.card${i}Tag` as Parameters<typeof t>[0]),
    titulo: t(`config.card${i}Titulo` as Parameters<typeof t>[0]),
    desc: t(`config.card${i}Desc` as Parameters<typeof t>[0]),
    nota: i === 2 ? undefined : t(`config.card${i}Nota` as Parameters<typeof t>[0]),
  }))
  const card2NotaTitulo = t('config.card2NotaTitulo')
  const card2NotaDesc = t('config.card2NotaDesc')

  return (
    <section id="configuracion" className="relative rf-corte px-6 md:px-12 lg:px-[60px] py-24 md:py-32 bg-slm-light overflow-hidden">
      <div className="max-w-[1200px] mx-auto flex flex-col gap-14">
        <div className="max-w-[760px] flex flex-col gap-6">
          <span className="rf-anot text-slm-brand">{t('config.eyebrow')}</span>
          <BlurIn as="h2" className="text-slm-dark text-4xl md:text-5xl lg:text-6xl font-helvetica-neue font-medium leading-[1.05] tracking-[-0.03em]">
            {t('config.titulo1')}{' '}
            <span className="text-slm-brand-dark">{t('config.tituloAccent')}</span>
          </BlurIn>
          <span className="rf-eje" aria-hidden="true" />
          <p className="text-slm-gray font-helvetica-neue text-base md:text-lg leading-relaxed">
            {t('config.descripcion')}
          </p>
        </div>

        <motion.div
          className="grid md:grid-cols-3 gap-5"
          initial="h"
          whileInView="s"
          viewport={{ once: true, amount: 0.2 }}
          variants={{ h: {}, s: { transition: { staggerChildren: 0.1 } } }}
        >
          {cards.map((c, i) => (
            <motion.div
              key={c.tag}
              /* Curva larga, sin spring: nada rebota. */
              variants={{ h: { opacity: 0, y: 16 }, s: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } } }}
              className="border border-slm-dark/10 bg-white p-8 flex flex-col gap-4"
            >
              <div className="flex items-center justify-between">
                <span className="rf-anot text-slm-dark/45">{c.tag}</span>
                <span className="rf-anot text-slm-dark/25">{String(i + 1).padStart(2, '0')}</span>
              </div>
              <h3 className="font-helvetica-neue text-xl md:text-2xl font-medium text-slm-dark tracking-[-0.02em] leading-tight">
                {c.titulo}
              </h3>
              <p className="text-slm-gray font-helvetica-neue text-base leading-relaxed">{c.desc}</p>
              {c.nota ? (
                <p className="font-mono text-xs md:text-[13px] text-slm-dark/70 leading-relaxed border-l border-slm-brand/50 pl-4 mt-auto">
                  {c.nota}
                </p>
              ) : (
                <div className="border-l border-slm-brand/50 pl-4 flex flex-col gap-1 mt-auto">
                  <p className="font-mono text-xs md:text-[13px] text-slm-dark/70 leading-relaxed">{card2NotaTitulo}</p>
                  <p className="font-mono text-xs md:text-[13px] text-slm-dark/50 leading-relaxed">{card2NotaDesc}</p>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
