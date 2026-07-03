'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { useEffect, useState } from 'react'
import { SelectorIdioma } from './SelectorIdioma'

const RELEASES_URL = 'https://github.com/RAGfly/ragfly-desktop-releases/releases'

const BACK_LABEL: Record<string, string> = {
  es: '← Volver al inicio',
  en: '← Back to home',
  pt: '← Voltar ao início',
  fr: "← Retour à l'accueil",
  de: '← Zurück zur Startseite',
}

function AppleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.05 20.28c-.98.95-2.05.86-3.08.41-1.09-.47-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.41C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.53 4.09v-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  )
}

function WindowsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M3 5.1 10.5 4v7.6H3V5.1zm0 13.8 7.5 1.1v-7.5H3v6.4zM11.6 3.8 21 2.5v9.1h-9.4V3.8zm0 16.4 9.4 1.3v-9H11.6v7.7z" />
    </svg>
  )
}

type OS = 'mac' | 'windows' | null

export default function DownloadPage() {
  const t = useTranslations()
  const locale = useLocale()
  const back = BACK_LABEL[locale] ?? BACK_LABEL.en

  const [os, setOs] = useState<OS>(null)
  const [version, setVersion] = useState<string | null>(null)

  useEffect(() => {
    const ua = navigator.userAgent
    if (/Windows/i.test(ua)) setOs('windows')
    else if (/Mac/i.test(ua)) setOs('mac')
  }, [])

  useEffect(() => {
    fetch('https://api.github.com/repos/RAGfly/ragfly-desktop-releases/releases/latest')
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => j?.tag_name && setVersion(j.tag_name))
      .catch(() => {})
  }, [])

  const macBtn = (primary: boolean) => (
    <a
      href="/download/mac"
      className={
        primary
          ? 'inline-flex items-center gap-2.5 bg-slm-dark text-slm-light px-7 py-3.5 rounded-full font-medium text-base hover:opacity-90 transition-opacity'
          : 'inline-flex items-center gap-2.5 border border-slm-dark text-slm-dark px-7 py-3.5 rounded-full font-medium text-base hover:bg-gray-50 transition-colors'
      }
    >
      <AppleIcon />
      {t('download.ctaMac')}
    </a>
  )

  const winBtn = (primary: boolean) => (
    <a
      href="/download/windows"
      className={
        primary
          ? 'inline-flex items-center gap-2.5 bg-slm-dark text-slm-light px-7 py-3.5 rounded-full font-medium text-base hover:opacity-90 transition-opacity'
          : 'inline-flex items-center gap-2.5 border border-slm-dark text-slm-dark px-7 py-3.5 rounded-full font-medium text-base hover:bg-gray-50 transition-colors'
      }
    >
      <WindowsIcon />
      {t('download.ctaWindows')}
    </a>
  )

  const bullets = [0, 1, 2].map((i) => t(`modos.desktop${i}` as Parameters<typeof t>[0]))
  const pasos = [0, 1, 2].map((i) => ({
    titulo: t(`download.paso${i}Titulo` as Parameters<typeof t>[0]),
    desc: t(`download.paso${i}Desc` as Parameters<typeof t>[0]),
  }))

  return (
    <main className="min-h-screen bg-white text-slm-dark flex flex-col">
      {/* Header sobrio (mismo patrón que las páginas legales) */}
      <header className="sticky top-0 z-20 border-b border-slm-dark/10 bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1100px] items-center justify-between px-6 py-4 md:px-10">
          <Link href="/" className="flex items-center gap-2.5 font-manrope text-xl font-semibold text-slm-dark">
            <Image src="/ala_5c.png" alt="" width={2348} height={553} className="h-6 w-auto" />
            RAGfly
          </Link>
          <div className="flex items-center gap-4">
            <SelectorIdioma />
            <Link href="/" className="font-helvetica-neue text-sm text-slm-gray transition-colors hover:text-slm-brand-dark">
              {back}
            </Link>
          </div>
        </div>
      </header>

      {/* Hero de descarga */}
      <section className="px-6 md:px-12 py-20 md:py-28 bg-gradient-to-b from-slm-light to-white border-b border-slm-dark/5">
        <div className="max-w-[860px] mx-auto flex flex-col items-center text-center gap-7">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/70 backdrop-blur-md border border-slm-dark/10 px-4 py-1.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-gradient-to-br from-slm-brand-dark to-slm-brand-light" />
            <span className="text-xs md:text-sm tracking-[0.04em] text-slm-dark/80">{t('download.eyebrow')}</span>
          </span>

          <h1 className="font-helvetica-neue font-medium leading-[1.08] tracking-[-0.03em] text-4xl md:text-6xl">
            {t('download.titulo1')}{' '}
            <span className="inline-block pb-[0.08em] bg-gradient-to-r from-slm-brand-dark via-slm-brand to-slm-brand-light bg-clip-text text-transparent">
              {t('download.tituloAccent')}
            </span>
          </h1>

          <p className="font-helvetica-neue text-base md:text-lg text-slm-gray max-w-[620px] leading-relaxed">
            {t('download.descripcion')}
          </p>

          {/* Botones: el OS detectado va primero como primario */}
          <div className="flex flex-col sm:flex-row items-center gap-3 mt-2">
            {os === 'windows' ? (
              <>
                {winBtn(true)}
                {macBtn(false)}
              </>
            ) : (
              <>
                {macBtn(true)}
                {winBtn(false)}
              </>
            )}
          </div>

          <div className="flex items-center gap-3 text-sm text-slm-gray font-helvetica-neue">
            {version && (
              <span>
                {t('download.versionLabel')}: <span className="font-medium text-slm-dark">{version}</span>
              </span>
            )}
            <a
              href={RELEASES_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-slm-brand-dark"
            >
              {t('download.todasVersiones')}
            </a>
          </div>

          <p className="text-xs text-slm-dark/50 font-helvetica-neue max-w-[560px] leading-relaxed">
            {t('download.notaInstalacion')}
          </p>
        </div>
      </section>

      {/* Qué te llevas — bullets canónicos del Desktop */}
      <section className="px-6 md:px-12 py-16 md:py-20 bg-white">
        <div className="max-w-[860px] mx-auto flex flex-wrap justify-center gap-3">
          {bullets.map((b) => (
            <span
              key={b}
              className="inline-flex items-center gap-2 rounded-full bg-slm-light border border-slm-dark/8 px-4 py-2 text-sm text-slm-dark font-helvetica-neue"
            >
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-slm-brand" />
              {b}
            </span>
          ))}
        </div>
      </section>

      {/* Tres pasos */}
      <section className="px-6 md:px-12 py-16 md:py-24 bg-slm-light">
        <div className="max-w-[1100px] mx-auto flex flex-col gap-12">
          <div className="flex flex-col gap-4 max-w-[620px]">
            <span className="text-sm uppercase tracking-[0.18em] text-slm-brand">{t('download.pasosEyebrow')}</span>
            <h2 className="font-helvetica-neue text-3xl md:text-4xl font-medium tracking-[-0.02em] text-slm-dark">
              {t('download.pasosTitulo')}
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {pasos.map((p, i) => (
              <div key={p.titulo} className="rounded-[24px] bg-white border border-slm-dark/8 p-8 flex flex-col gap-4">
                <span className="font-helvetica-neue text-4xl font-medium bg-gradient-to-br from-slm-brand-dark via-slm-brand to-slm-brand-light bg-clip-text text-transparent leading-none">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="font-helvetica-neue text-xl font-medium text-slm-dark tracking-[-0.02em]">{p.titulo}</h3>
                <p className="font-helvetica-neue text-base text-slm-gray leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-slm-gray font-helvetica-neue text-base">
            {t('download.cloudNota')}{' '}
            <a href="https://app.ragfly.ai" className="text-slm-brand-dark underline underline-offset-2 hover:text-slm-brand">
              {t('download.cloudCta')}
            </a>
          </p>
        </div>
      </section>

      {/* Footer mínimo (mismo patrón que las páginas legales) */}
      <footer className="mt-auto border-t border-white/10 bg-slm-dark px-6 py-10 text-slm-gray-light md:px-10">
        <div className="mx-auto flex max-w-[1100px] flex-col gap-3 text-xs font-helvetica-neue md:flex-row md:items-center md:justify-between">
          <span>© {new Date().getFullYear()} RAGfly</span>
          <div className="flex gap-6">
            <Link href="/legal/terms" className="hover:text-white">Terms</Link>
            <Link href="/legal/privacy" className="hover:text-white">Privacy</Link>
            <Link href="/" className="hover:text-white">ragfly.ai</Link>
          </div>
        </div>
      </footer>
    </main>
  )
}
