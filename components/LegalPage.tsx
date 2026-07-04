'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { SelectorIdioma } from './SelectorIdioma'

/* ------------------------------------------------------------------ */
/* Tipos de contenido legal (data-driven, generado desde los maestros) */
/* ------------------------------------------------------------------ */
export type LegalBlock = {
  kind: 'p' | 'list' | 'olist'
  text?: string
  items?: string[]
}

export type LegalSection = {
  id: string
  heading: string
  blocks: LegalBlock[]
}

export type LegalContent = {
  title: string
  subtitle: string
  intro: LegalBlock[]
  sections: LegalSection[]
}

/* Etiqueta "volver al inicio" por idioma */
const BACK_LABEL: Record<string, string> = {
  es: '← Volver al inicio',
  en: '← Back to home',
  pt: '← Voltar ao início',
  fr: "← Retour à l'accueil",
  de: '← Zurück zur Startseite',
}

/* Etiquetas del chrome (footer) por idioma — mismo registro que el contenido */
type ChromeLabels = { rights: string; terms: string; privacy: string; refund: string; home: string }
const CHROME: Record<string, ChromeLabels> = {
  es: { rights: 'Todos los derechos reservados.', terms: 'Términos', privacy: 'Privacidad', refund: 'Reembolsos', home: 'Inicio' },
  en: { rights: 'All rights reserved.', terms: 'Terms', privacy: 'Privacy', refund: 'Refunds', home: 'Home' },
  pt: { rights: 'Todos os direitos reservados.', terms: 'Termos', privacy: 'Privacidade', refund: 'Reembolsos', home: 'Início' },
  fr: { rights: 'Tous droits réservés.', terms: 'Conditions', privacy: 'Confidentialité', refund: 'Remboursements', home: 'Accueil' },
  de: { rights: 'Alle Rechte vorbehalten.', terms: 'Bedingungen', privacy: 'Datenschutz', refund: 'Rückerstattungen', home: 'Startseite' },
}

/* ------------------------------------------------------------------ */
/* Render inline: **negrita** + enlaces de email, URL y dominio ragfly  */
/* ------------------------------------------------------------------ */
function linkify(text: string, keyBase: string): React.ReactNode[] {
  const out: React.ReactNode[] = []
  // 1) email  2) URL http(s)  3) dominio ragfly.ai (con subdominio opcional)
  const re = /([\w.+-]+@[\w-]+(?:\.[\w-]+)+)|(https?:\/\/[^\s)]+)|((?:[a-z0-9-]+\.)*ragfly\.ai)\b/gi
  let last = 0
  let m: RegExpExecArray | null
  let i = 0
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) out.push(text.slice(last, m.index))
    const [match, email, url, domain] = m
    const href = email ? `mailto:${email}` : url ? url : `https://${domain}`
    out.push(
      <a
        key={`${keyBase}-ln-${i++}`}
        href={href}
        className="text-slm-brand-dark underline underline-offset-2 hover:text-slm-brand"
        {...(url ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {match}
      </a>,
    )
    last = m.index + match.length
  }
  if (last < text.length) out.push(text.slice(last))
  return out
}

function renderInline(text: string, keyBase: string): React.ReactNode[] {
  const out: React.ReactNode[] = []
  const re = /\*\*(.+?)\*\*/g
  let last = 0
  let m: RegExpExecArray | null
  let i = 0
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) out.push(...linkify(text.slice(last, m.index), `${keyBase}-t${i}`))
    out.push(
      <strong key={`${keyBase}-b-${i++}`} className="font-semibold text-slm-dark">
        {m[1]}
      </strong>,
    )
    last = m.index + m[0].length
  }
  if (last < text.length) out.push(...linkify(text.slice(last), `${keyBase}-t-end`))
  return out
}

/* ------------------------------------------------------------------ */
/* Render de bloques                                                   */
/* ------------------------------------------------------------------ */
function Block({ block, k }: { block: LegalBlock; k: string }) {
  if (block.kind === 'p') {
    return <p className="text-slm-dark/80 leading-[1.75] text-[15px]">{renderInline(block.text ?? '', k)}</p>
  }
  if (block.kind === 'list') {
    return (
      <ul className="flex flex-col gap-2 pl-1">
        {(block.items ?? []).map((it, i) => (
          <li key={i} className="flex gap-3 text-slm-dark/80 leading-[1.7] text-[15px]">
            <span aria-hidden className="mt-[10px] h-1.5 w-1.5 shrink-0 rounded-full bg-slm-brand" />
            <span>{renderInline(it, `${k}-${i}`)}</span>
          </li>
        ))}
      </ul>
    )
  }
  // olist
  return (
    <ol className="flex flex-col gap-3">
      {(block.items ?? []).map((it, i) => (
        <li key={i} className="flex gap-3 text-slm-dark/80 leading-[1.7] text-[15px]">
          <span
            aria-hidden
            className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slm-light text-[12px] font-semibold text-slm-brand-dark"
          >
            {i + 1}
          </span>
          <span>{renderInline(it, `${k}-${i}`)}</span>
        </li>
      ))}
    </ol>
  )
}

/* ------------------------------------------------------------------ */
/* Página legal                                                        */
/* ------------------------------------------------------------------ */
export default function LegalPage({ content }: { content: LegalContent }) {
  const locale = useLocale()
  const back = BACK_LABEL[locale] ?? BACK_LABEL.en
  const chrome = CHROME[locale] ?? CHROME.en

  return (
    <main className="min-h-screen bg-white text-slm-dark">
      {/* Header sobrio */}
      <header className="sticky top-0 z-20 border-b border-slm-dark/10 bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1100px] items-center justify-between px-6 py-4 md:px-10">
          <Link href="/" className="flex items-center gap-2.5 font-manrope text-xl font-semibold text-slm-dark">
            <Image src="/ala_5c.png" alt="" width={2348} height={553} className="h-6 w-auto" />
            RAGfly
          </Link>
          <div className="flex items-center gap-4">
            <SelectorIdioma />
            <Link
              href="/"
              className="font-helvetica-neue text-sm text-slm-gray transition-colors hover:text-slm-brand-dark"
            >
              {back}
            </Link>
          </div>
        </div>
      </header>

      {/* Encabezado del documento */}
      <div className="border-b border-slm-dark/5 bg-gradient-to-b from-slm-light to-white">
        <div className="mx-auto max-w-[760px] px-6 py-14 md:px-8 md:py-20">
          <div className="mb-4 h-1 w-14 rounded-full bg-gradient-to-r from-slm-brand-dark via-slm-brand to-slm-brand-light" />
          <h1 className="font-helvetica-neue text-3xl font-medium leading-[1.1] tracking-[-0.02em] text-slm-dark md:text-[42px]">
            {content.title}
          </h1>
          <p className="mt-4 font-helvetica-neue text-sm text-slm-gray">{content.subtitle}</p>
        </div>
      </div>

      {/* Cuerpo */}
      <article className="mx-auto max-w-[760px] px-6 py-12 md:px-8 md:py-16">
        <div className="flex flex-col gap-4">
          {content.intro.map((b, i) => (
            <Block key={`intro-${i}`} block={b} k={`intro-${i}`} />
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-12">
          {content.sections.map((s, i) => (
            <section key={s.id || i} id={s.id} className="scroll-mt-24">
              <h2 className="mb-4 font-helvetica-neue text-xl font-semibold tracking-[-0.01em] text-slm-brand-dark md:text-[22px]">
                {s.heading}
              </h2>
              <div className="flex flex-col gap-4">
                {s.blocks.map((b, j) => (
                  <Block key={`${s.id}-${j}`} block={b} k={`${s.id}-${j}`} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </article>

      {/* Footer mínimo */}
      <footer className="border-t border-white/10 bg-slm-dark px-6 py-10 text-slm-gray-light md:px-10">
        <div className="mx-auto flex max-w-[1100px] flex-col gap-3 text-xs font-helvetica-neue md:flex-row md:items-center md:justify-between">
          <span>© {new Date().getFullYear()} RAGfly — {chrome.rights}</span>
          <div className="flex gap-6">
            <Link href="/legal/terms" className="hover:text-white">{chrome.terms}</Link>
            <Link href="/legal/privacy" className="hover:text-white">{chrome.privacy}</Link>
            <Link href="/legal/refund" className="hover:text-white">{chrome.refund}</Link>
            <Link href="/" className="hover:text-white">{chrome.home}</Link>
          </div>
        </div>
      </footer>
    </main>
  )
}
