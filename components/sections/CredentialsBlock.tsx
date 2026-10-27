'use client'

import { useTranslations } from 'next-intl'

export function CredentialsBlock() {
  const t = useTranslations()
  return (
    <div className="border border-slm-dark/10 bg-white p-8 md:p-10 flex flex-col gap-5">
      <span className="rf-anot text-slm-dark/45">{t('privado.byokTag')}</span>
      <h3 className="font-helvetica-neue text-2xl md:text-[28px] font-medium text-slm-dark tracking-[-0.02em] leading-tight">
        {t('privado.byokTitulo')}
      </h3>
      <p className="text-slm-gray font-helvetica-neue text-base leading-relaxed">{t('privado.byokDesc')}</p>
      <div className="font-interfaz border-l border-slm-brand/50 pl-4 flex flex-col gap-1 mt-auto">
        <p className="font-mono text-xs md:text-[13px] text-slm-dark/70 leading-relaxed">
          {t('privado.byokNotaTitulo')}
        </p>
        <p className="font-mono text-xs md:text-[13px] text-slm-dark/50 leading-relaxed">{t('privado.byokNotaDesc')}</p>
      </div>
    </div>
  )
}
