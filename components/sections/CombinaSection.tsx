'use client'

import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { BlurIn } from './shared'

/* ------------------------------------------------------------------ */
/* CombinaSection — "Lo que casi nadie combina" · 3 temas + tabla       */
/* ------------------------------------------------------------------ */
export function CombinaSection() {
  const t = useTranslations()
  const temas = [0, 1, 2].map((i) => ({
    num: t(`combina.item${i}Num` as Parameters<typeof t>[0]),
    titulo: t(`combina.item${i}Titulo` as Parameters<typeof t>[0]),
    desc: t(`combina.item${i}Desc` as Parameters<typeof t>[0]),
  }))
  const rows = [0, 1, 2, 3, 4].map((i) => ({
    sin: t(`combina.tablaSin${i}` as Parameters<typeof t>[0]),
    con: t(`combina.tablaCon${i}` as Parameters<typeof t>[0]),
  }))
  return (
    <section id="diferencia" className="px-6 md:px-12 lg:px-[60px] py-24 md:py-32 bg-slm-light">
      <div className="max-w-[1200px] mx-auto flex flex-col gap-16">
        <div className="max-w-[720px] flex flex-col gap-6">
          <span className="text-sm uppercase tracking-[0.18em] text-slm-brand">{t('combina.eyebrow')}</span>
          <BlurIn as="h2" className="text-slm-dark text-4xl md:text-5xl lg:text-6xl font-helvetica-neue font-medium leading-[1.05] tracking-[-0.03em]">
            {t('combina.titulo1')}{' '}
            <span className="inline-block pb-[0.06em] bg-gradient-to-r from-slm-brand-dark via-slm-brand to-slm-brand-light bg-clip-text text-transparent">{t('combina.tituloAccent')}</span>
          </BlurIn>
        </div>

        <motion.div
          className="grid md:grid-cols-3 gap-4"
          initial="h" whileInView="s" viewport={{ once: true, amount: 0.2 }}
          variants={{ h: {}, s: { transition: { staggerChildren: 0.1 } } }}
        >
          {temas.map((c) => (
            <motion.div
              key={c.num}
              variants={{ h: { opacity: 0, y: 20 }, s: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } } }}
              className="rounded-[24px] bg-white p-8 border border-slm-dark/5 flex flex-col gap-4 min-h-[280px]"
            >
              <span className="font-helvetica-neue text-5xl font-medium bg-gradient-to-br from-slm-brand-dark via-slm-brand to-slm-brand-light bg-clip-text text-transparent leading-none">{c.num}</span>
              <h3 className="text-xl md:text-2xl font-helvetica-neue font-medium text-slm-dark tracking-[-0.02em] leading-tight">{c.titulo}</h3>
              <p className="text-slm-gray font-helvetica-neue text-base leading-relaxed">{c.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        <div className="rounded-[24px] bg-white border border-slm-dark/8 p-8 md:p-10 flex flex-col gap-3">
          <h3 className="font-helvetica-neue text-xl md:text-2xl font-medium text-slm-dark tracking-[-0.02em]">{t('combina.capaTitulo')}</h3>
          <p className="text-slm-gray font-helvetica-neue text-base md:text-lg leading-relaxed max-w-[900px]">{t('combina.capaDesc')}</p>
        </div>

        <div className="overflow-hidden rounded-[24px] border border-slm-dark/8 bg-white">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slm-dark/8">
                <th scope="col" className="px-6 py-4 text-xs uppercase tracking-[0.16em] text-slm-gray-light font-medium w-1/2">{t('combina.tablaCol0')}</th>
                <th scope="col" className="px-6 py-4 text-xs uppercase tracking-[0.16em] text-slm-brand font-medium w-1/2 bg-slm-light/50">{t('combina.tablaCol1')}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className="border-b border-slm-dark/5 last:border-0">
                  <td className="px-6 py-4 align-top font-helvetica-neue text-base text-slm-gray leading-snug">{r.sin}</td>
                  <td className="px-6 py-4 align-top font-helvetica-neue text-base text-slm-dark leading-snug bg-slm-light/30">{r.con}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
