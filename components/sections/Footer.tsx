'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import agentes from '../../content/agentes-data.json'

/* ------------------------------------------------------------------ */
/* Footer                                                               */
/* ------------------------------------------------------------------ */
export function Footer() {
  const t = useTranslations()
  const year = new Date().getFullYear()
  return (
    <footer className="px-6 md:px-12 lg:px-[60px] py-16 bg-slm-dark text-slm-gray-light">
      <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row gap-10 md:gap-16 items-start justify-between">
        <div className="flex flex-col gap-4 max-w-[320px]">
          <div className="flex items-center gap-2.5 font-manrope font-semibold text-2xl text-white">
            <Image src="/ala_1.5c.png" alt="" width={2348} height={553} className="h-7 w-auto" />
            RAGfly
          </div>
          <p className="font-helvetica-neue text-sm leading-relaxed">{t('footer.tagline')}</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-10">
          <div className="flex flex-col gap-3">
            <span className="text-xs uppercase tracking-[0.18em] text-white/60">{t('footer.producto' as Parameters<typeof t>[0])}</span>
            {/* Simple → Privado → Preciso: mismo orden del eslogan y del nav. */}
            <a href="#simple" className="font-helvetica-neue text-sm hover:text-white">{t('footer.capacidades')}</a>
            <a href="#privado" className="font-helvetica-neue text-sm hover:text-white">{t('footer.seguridadLink')}</a>
            <a href="#precision" className="font-helvetica-neue text-sm hover:text-white">{t('nav.capacidades')}</a>
            <a href="#superficies" className="font-helvetica-neue text-sm hover:text-white">{t('footer.comoFunciona')}</a>
            <Link href="/build/mcp" className="font-helvetica-neue text-sm hover:text-white">MCP</Link>
            <Link href="/build/cli" className="font-helvetica-neue text-sm hover:text-white">CLI</Link>
            <Link href="/build/rest" className="font-helvetica-neue text-sm hover:text-white">REST</Link>
            <Link href="/build/sdk" className="font-helvetica-neue text-sm hover:text-white">SDK</Link>
            <a href="#planes" className="font-helvetica-neue text-sm hover:text-white">{t('footer.planesLink')}</a>
            <a href="/download" className="font-helvetica-neue text-sm hover:text-white">{t('footer.desktopLink')}</a>
          </div>
          <div className="flex flex-col gap-3">
            <span className="text-xs uppercase tracking-[0.18em] text-white/60">{t('footer.empresa' as Parameters<typeof t>[0])}</span>
            <a href="#contacto" className="font-helvetica-neue text-sm hover:text-white">{t('footer.contacto')}</a>
            <a href="https://api.ragfly.ai/docs" target="_blank" rel="noopener noreferrer" className="font-helvetica-neue text-sm hover:text-white">Swagger API</a>
            <Link href="/build/quickstart" className="font-helvetica-neue text-sm hover:text-white">Quickstart</Link>
            <a href="/llms.txt" className="font-helvetica-neue text-sm hover:text-white">llms.txt</a>
            <a href="/agents.json" className="font-helvetica-neue text-sm hover:text-white">agents.json</a>
          </div>
          <div className="flex flex-col gap-3">
            <span className="text-xs uppercase tracking-[0.18em] text-white/60">{t('footer.legal')}</span>
            <a href="/legal/terms" className="font-helvetica-neue text-sm hover:text-white">{t('footer.terminos')}</a>
            <a href="/legal/privacy" className="font-helvetica-neue text-sm hover:text-white">{t('footer.privacidad')}</a>
            <a href="/legal/refund" className="font-helvetica-neue text-sm hover:text-white">{t('footer.reembolsos')}</a>
          </div>
        </div>
      </div>
      <div className="max-w-[1200px] mx-auto mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between gap-3 text-xs font-helvetica-neue">
        <span>{t('footer.copyright', { year })}</span>
        <span>{t('footer.actualizado', { fecha: agentes.actualizado })}</span>
      </div>
    </footer>
  )
}
