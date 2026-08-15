'use client'

import { useTranslations } from 'next-intl'
import { BlurIn } from './shared'

/* ------------------------------------------------------------------ */
/* NegativaSection — S2 · familia D (lista de chequeo y la negativa)    */
/*                                                                     */
/* La única imagen de la categoría que muestra a una IA negándose.      */
/* El ámbar vive AQUÍ: marca lo autorizado (chequeo pasado) y el ítem   */
/* que bloquea. No se repite decorativamente en el resto de la página.  */
/* La lista se dibuja inline (no como <Image>) para que su texto sea    */
/* traducible en las 5 lenguas del sitio.                              */
/* ------------------------------------------------------------------ */
export function NegativaSection() {
  const t = useTranslations()
  const chequeos = [0, 1, 2].map((i) => t(`negativa.item${i}` as Parameters<typeof t>[0]))

  return (
    <section id="negativa" className="relative rf-corte px-6 md:px-12 lg:px-[60px] py-24 md:py-32 bg-slm-cabina text-slm-light overflow-hidden">
      <div className="max-w-[1200px] mx-auto grid lg:grid-cols-[1fr_1.05fr] gap-12 lg:gap-16 items-center">
        <div className="flex flex-col gap-6">
          <span className="rf-anot text-slm-brand-light/80">{t('negativa.eyebrow')}</span>
          <BlurIn as="h2" className="text-4xl md:text-5xl lg:text-[56px] font-helvetica-neue font-medium leading-[1.05] tracking-[-0.03em]">
            {t('negativa.titulo1')}{' '}
            <span className="text-slm-ambar">{t('negativa.tituloAccent')}</span>
          </BlurIn>
          <span className="rf-eje" aria-hidden="true" />
          <p className="text-slm-gray-light font-helvetica-neue text-base md:text-lg leading-relaxed max-w-[520px]">
            {t('negativa.descripcion')}
          </p>
          <p className="text-slm-light/60 font-helvetica-neue text-sm md:text-base italic leading-relaxed max-w-[520px]">
            {t('negativa.nota')}
          </p>
          <p className="text-slm-light/55 font-helvetica-neue text-base md:text-lg leading-relaxed max-w-[520px]">
            {t('negativa.pie')}
          </p>
        </div>

        {/* Lista de chequeo — dibujo técnico, línea fina, sin relleno */}
        <div className="border border-white/12 rounded-none p-7 md:p-9 flex flex-col gap-6 bg-white/[0.02]">
          <span className="rf-anot text-slm-brand-light/70">{t('negativa.listaTitulo')}</span>

          <ul className="flex flex-col">
            {chequeos.map((c, i) => {
              const delay = `${i * 1.1}s`
              return (
                <li key={c} className="flex items-center gap-4 py-4 border-b border-white/8">
                  <span className="pf-stack flex-none w-5 h-5">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" className="pf-fade-out" style={{ animationDelay: delay }}>
                      <circle cx="10" cy="10" r="3" fill="none" stroke="rgba(255,255,255,.35)" strokeWidth="1.4" />
                    </svg>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" className="pf-fade-in" style={{ animationDelay: delay }}>
                      <path d="M4 10 l4 4 l8 -10" stroke="#E8A33D" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </span>
                  <span className="flex-1 font-mono text-sm text-slm-light/90">{c}</span>
                  <span className="pf-stack">
                    <span className="rf-anot text-slm-light/40 pf-fade-out" style={{ animationDelay: delay }}>{t('negativa.estadoPendiente')}</span>
                    <span className="rf-anot text-slm-ambar/80 pf-fade-in" style={{ animationDelay: delay }}>{t('negativa.estadoOk')}</span>
                  </span>
                </li>
              )
            })}
            <li className="flex items-center gap-4 py-4 border-b border-white/8">
              <span className="pf-stack flex-none w-5 h-5">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" className="pf-fade-out" style={{ animationDelay: '3.3s' }}>
                  <circle cx="10" cy="10" r="3" fill="none" stroke="rgba(255,255,255,.35)" strokeWidth="1.4" />
                </svg>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" className="pf-fade-in" style={{ animationDelay: '3.3s' }}>
                  <path d="M5 5 l10 10 M15 5 l-10 10" stroke="#C08A3A" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </span>
              <span className="pf-stack flex-1">
                <span className="font-mono text-sm text-slm-light/90 pf-fade-out" style={{ animationDelay: '3.3s' }}>{t('negativa.item3')}</span>
                <span className="font-mono text-sm text-slm-light/55 line-through decoration-white/25 pf-fade-in" style={{ animationDelay: '3.3s' }}>{t('negativa.item3')}</span>
              </span>
              <span className="pf-stack">
                <span className="rf-anot text-slm-light/40 pf-fade-out" style={{ animationDelay: '3.3s' }}>{t('negativa.estadoPendiente')}</span>
                <span className="rf-anot text-slm-light/45 pf-fade-in" style={{ animationDelay: '3.3s' }}>{t('negativa.estadoBloqueado')}</span>
              </span>
            </li>
          </ul>

          <div className="flex flex-col gap-2 border-l border-slm-ambar/60 pl-4">
            <span className="rf-anot text-slm-light/40">{t('negativa.respuestaTitulo')}</span>
            <p className="font-mono text-sm md:text-base text-slm-light/90 leading-relaxed">
              “{t('negativa.respuesta')}”
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
