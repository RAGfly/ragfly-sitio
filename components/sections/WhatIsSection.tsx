'use client'

import { useTranslations } from 'next-intl'
import { BlurIn } from './shared'

/* ------------------------------------------------------------------ */
/* WhatIsSection — "Qué es RAGfly" (reusa el visual de carpetas)        */
/* ------------------------------------------------------------------ */
export function WhatIsSection() {
  const t = useTranslations()
  const bullets = [0, 1, 2].map((i) => t(`queEs.bullet${i}` as Parameters<typeof t>[0]))
  const folders = [
    { name: 'Contratos 2025', count: '128 archivos' },
    { name: 'Auditorías Q4', count: '47 archivos' },
    { name: 'Procedimientos RRHH', count: '312 archivos' },
    { name: 'Minutas Directorio', count: '89 archivos' },
  ]
  return (
    <section id="que-es" className="px-6 md:px-12 lg:px-[60px] py-24 md:py-32 bg-white">
      <div className="max-w-[1280px] mx-auto grid lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-20 items-center">
        <div className="flex flex-col gap-7">
          <span className="text-sm uppercase tracking-[0.18em] text-slm-brand">{t('queEs.eyebrow')}</span>
          <BlurIn as="h2" className="text-slm-dark text-4xl md:text-5xl lg:text-6xl font-helvetica-neue font-medium leading-[1.05] tracking-[-0.03em]">
            {t('queEs.titulo1')}{' '}
            <span className="inline-block pb-[0.06em] bg-gradient-to-r from-slm-brand-dark via-slm-brand to-slm-brand-light bg-clip-text text-transparent">{t('queEs.tituloAccent')}</span>
          </BlurIn>
          <p className="text-slm-gray font-helvetica-neue text-base md:text-lg leading-relaxed max-w-[520px]">
            {t('queEs.descripcion')}
          </p>
          <ul className="flex flex-col gap-3 mt-2">
            {bullets.map((s, i) => (
              <li key={i} className="flex gap-3 text-slm-dark/85 font-helvetica-neue text-base leading-snug">
                <span className="mt-2 inline-block w-1.5 h-1.5 rounded-full bg-slm-brand flex-none" />{s}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative">
          <div className="rounded-[28px] bg-gradient-to-br from-slm-light via-white to-slm-light border border-slm-dark/8 p-6 md:p-8 relative overflow-hidden">
            <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden md:block" aria-hidden="true">
              <svg width="80" height="200" viewBox="0 0 80 200" fill="none">
                <path d="M 0 100 C 30 100, 50 100, 80 100" stroke="url(#beam)" strokeWidth="1.5" strokeDasharray="3 4">
                  <animate attributeName="stroke-dashoffset" from="0" to="-14" dur="1.5s" repeatCount="indefinite" />
                </path>
                <defs>
                  <linearGradient id="beam" x1="0" y1="0" x2="80" y2="0">
                    <stop offset="0%" stopColor="#008BD6" stopOpacity="0.1" />
                    <stop offset="100%" stopColor="#008BD6" stopOpacity="0.8" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <div className="text-xs uppercase tracking-[0.18em] text-slm-dark/40 mb-4">{t('queEs.eyebrow')}</div>

            <ul className="flex flex-col gap-2.5">
              {folders.map((f, i) => (
                <li
                  key={i}
                  className="group flex items-center gap-3 p-3.5 rounded-xl bg-white border border-slm-dark/8"
                  style={{ animation: 'folderScan 6s ease-in-out infinite', animationDelay: `${i * 0.6}s` }}
                >
                  <span className="inline-flex items-center justify-center w-9 h-9 rounded-md bg-slm-light border border-slm-dark/8 flex-none">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#005D8F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" />
                    </svg>
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-slm-dark truncate">{f.name}</div>
                    <div className="text-xs text-slm-dark/50">{f.count}</div>
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.18em] flex-none zs-status">✓</span>
                </li>
              ))}
            </ul>

            <div className="mt-5 flex items-center justify-between rounded-xl bg-slm-dark text-slm-light px-4 py-3">
              <span className="text-xs uppercase tracking-[0.18em] text-slm-brand-light">Pipeline</span>
              <span className="text-sm flex items-center gap-2">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-slm-brand-light animate-pulse" />
                Indexado · listo para tu agente
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
