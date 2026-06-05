'use client'

import Image from 'next/image'
import Link from 'next/link'

/* ------------------------------------------------------------------ */
/* Tipos de contenido legal                                            */
/* ------------------------------------------------------------------ */
export type LegalBlock =
  | { kind: 'p'; text: React.ReactNode }
  | { kind: 'list'; items: React.ReactNode[] }
  | { kind: 'olist'; items: React.ReactNode[] }
  | { kind: 'note'; text: React.ReactNode }

export type LegalSection = {
  id?: string
  heading: string
  blocks: LegalBlock[]
}

export type LegalContent = {
  title: string
  updated: string
  version: string
  intro: LegalBlock[]
  sections: LegalSection[]
  disclaimer: string
}

/* ------------------------------------------------------------------ */
/* Render de bloques                                                   */
/* ------------------------------------------------------------------ */
function Block({ block }: { block: LegalBlock }) {
  switch (block.kind) {
    case 'p':
      return <p className="text-slm-dark/80 leading-[1.75] text-[15px]">{block.text}</p>
    case 'list':
      return (
        <ul className="flex flex-col gap-2 pl-1">
          {block.items.map((it, i) => (
            <li key={i} className="flex gap-3 text-slm-dark/80 leading-[1.7] text-[15px]">
              <span aria-hidden className="mt-[10px] h-1.5 w-1.5 shrink-0 rounded-full bg-slm-brand" />
              <span>{it}</span>
            </li>
          ))}
        </ul>
      )
    case 'olist':
      return (
        <ol className="flex flex-col gap-3">
          {block.items.map((it, i) => (
            <li key={i} className="flex gap-3 text-slm-dark/80 leading-[1.7] text-[15px]">
              <span
                aria-hidden
                className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slm-light text-[12px] font-semibold text-slm-brand-dark"
              >
                {i + 1}
              </span>
              <span>{it}</span>
            </li>
          ))}
        </ol>
      )
    case 'note':
      return (
        <p className="rounded-lg border border-slm-brand/15 bg-slm-light px-4 py-3 text-[13px] leading-relaxed text-slm-dark/70">
          {block.text}
        </p>
      )
  }
}

/* ------------------------------------------------------------------ */
/* Página legal                                                        */
/* ------------------------------------------------------------------ */
export default function LegalPage({ content }: { content: LegalContent }) {
  return (
    <main className="min-h-screen bg-white text-slm-dark">
      {/* Header sobrio */}
      <header className="sticky top-0 z-20 border-b border-slm-dark/10 bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1100px] items-center justify-between px-6 py-4 md:px-10">
          <Link href="/" className="flex items-center gap-2.5 font-manrope text-xl font-semibold text-slm-dark">
            <Image src="/ragfly_isotipo.png" alt="" width={26} height={26} className="h-6 w-auto" />
            RAGfly
          </Link>
          <Link
            href="/"
            className="font-helvetica-neue text-sm text-slm-gray transition-colors hover:text-slm-brand-dark"
          >
            ← Volver al inicio
          </Link>
        </div>
      </header>

      {/* Encabezado del documento */}
      <div className="border-b border-slm-dark/5 bg-gradient-to-b from-slm-light to-white">
        <div className="mx-auto max-w-[760px] px-6 py-14 md:px-8 md:py-20">
          <div className="mb-4 h-1 w-14 rounded-full bg-gradient-to-r from-slm-brand-dark via-slm-brand to-slm-brand-light" />
          <h1 className="font-helvetica-neue text-3xl font-medium leading-[1.1] tracking-[-0.02em] text-slm-dark md:text-[42px]">
            {content.title}
          </h1>
          <p className="mt-4 font-helvetica-neue text-sm text-slm-gray">
            Última actualización: {content.updated} · Versión {content.version}
          </p>
        </div>
      </div>

      {/* Cuerpo */}
      <article className="mx-auto max-w-[760px] px-6 py-12 md:px-8 md:py-16">
        <div className="flex flex-col gap-4">
          {content.intro.map((b, i) => (
            <Block key={i} block={b} />
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-12">
          {content.sections.map((s, i) => (
            <section key={i} id={s.id} className="scroll-mt-24">
              <h2 className="mb-4 font-helvetica-neue text-xl font-semibold tracking-[-0.01em] text-slm-brand-dark md:text-[22px]">
                {s.heading}
              </h2>
              <div className="flex flex-col gap-4">
                {s.blocks.map((b, j) => (
                  <Block key={j} block={b} />
                ))}
              </div>
            </section>
          ))}
        </div>

        <p className="mt-14 border-t border-slm-dark/10 pt-6 text-[13px] italic leading-relaxed text-slm-gray">
          {content.disclaimer}
        </p>
      </article>

      {/* Footer mínimo */}
      <footer className="border-t border-white/10 bg-slm-dark px-6 py-10 text-slm-gray-light md:px-10">
        <div className="mx-auto flex max-w-[1100px] flex-col gap-3 text-xs font-helvetica-neue md:flex-row md:items-center md:justify-between">
          <span>© {new Date().getFullYear()} RAGfly — Todos los derechos reservados.</span>
          <div className="flex gap-6">
            <Link href="/terminos" className="hover:text-white">Términos</Link>
            <Link href="/privacidad" className="hover:text-white">Privacidad</Link>
            <Link href="/" className="hover:text-white">Inicio</Link>
          </div>
        </div>
      </footer>
    </main>
  )
}
