import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import docsData from '../../../content/integradores-docs.json'

/* ------------------------------------------------------------------ */
/* /build/[doc] — renders one integration doc synced from the product  */
/* repo. HTML is pre-rendered at build time by build-integradores.mjs. */
/* Visual language aligned with the landing + /legal: brand v2.0       */
/* tokens, helvetica-neue heading, sober document body via .doc-prose. */
/* ------------------------------------------------------------------ */

type DocEntry = {
  slug: string
  archivo: string
  titulo: string
  desc: string
  grupo: string
  icono: string
  cara: boolean
  rawUrl: string
  html: string
}

const docs = docsData.docs as Record<string, DocEntry>
const order = Object.values(docs).filter((d) => d.cara)

export function generateStaticParams() {
  return Object.keys(docs).map((doc) => ({ doc }))
}

export async function generateMetadata({ params }: { params: Promise<{ doc: string }> }): Promise<Metadata> {
  const { doc } = await params
  const d = docs[doc]
  if (!d) return {}
  return {
    title: `${d.titulo} — Build on RAGfly`,
    description: d.desc,
    alternates: { canonical: `/build/${d.slug}` },
  }
}

export default async function DocPage({ params }: { params: Promise<{ doc: string }> }) {
  const { doc } = await params
  const d = docs[doc]
  if (!d) notFound()

  return (
    <div className="min-h-screen bg-white">
      {/* Header — mismo patrón sobrio que /legal y /build */}
      <header className="sticky top-0 z-50 border-b border-slm-dark/10 bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex h-auto max-w-[820px] items-center justify-between px-6 py-4 md:px-8">
          <Link href="/build" className="flex items-center gap-2.5">
            <Image src="/ala_5c.png" alt="" width={2348} height={553} className="h-6 w-auto" />
            <span className="font-manrope text-xl font-semibold text-slm-dark">RAGfly</span>
            <span className="text-slm-gray-light">/</span>
            <span className="text-sm text-slm-gray">build</span>
          </Link>
          <nav className="flex items-center gap-5 text-sm text-slm-gray">
            <a href={d.rawUrl} className="font-mono text-xs transition-colors hover:text-slm-dark">{d.archivo}</a>
            <a href="https://api.ragfly.ai/docs" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-slm-dark">Swagger</a>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-[820px] px-6 py-12 md:px-8">
        <Link href="/build" className="text-sm text-slm-brand-dark transition-colors hover:text-slm-brand">← All docs</Link>

        {/* Encabezado del documento — barra de acento + título helvetica-neue */}
        <div className="mb-8 mt-5">
          <div className="mb-4 h-1 w-14 rounded-full bg-gradient-to-r from-slm-brand-dark via-slm-brand to-slm-brand-light" />
          <div className="flex items-center gap-3">
            <span className="text-3xl">{d.icono}</span>
            <div>
              <h1 className="font-helvetica-neue text-3xl font-medium leading-tight tracking-[-0.02em] text-slm-dark">{d.titulo}</h1>
              <p className="font-helvetica-neue text-sm text-slm-gray">{d.desc}</p>
            </div>
          </div>
        </div>

        {/* Rendered Markdown */}
        <article className="doc-prose" dangerouslySetInnerHTML={{ __html: d.html }} />

        {/* Other docs */}
        <div className="mt-16 border-t border-slm-dark/8 pt-8">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.18em] text-slm-brand">Other docs</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {order.filter((o) => o.slug !== d.slug).map((o) => (
              <Link key={o.slug} href={`/build/${o.slug}`} className="flex items-center gap-2 rounded-xl border border-slm-dark/8 px-3 py-2.5 text-sm transition-colors hover:border-slm-brand/40">
                <span>{o.icono}</span>
                <span className="truncate text-slm-dark">{o.titulo}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-12 flex items-center justify-between border-t border-slm-dark/8 pt-8 font-helvetica-neue text-xs text-slm-gray">
          <Link href="/" className="transition-colors hover:text-slm-dark">← Back to site</Link>
          <a href={d.rawUrl} className="transition-colors hover:text-slm-dark">View raw {d.archivo} →</a>
        </div>
      </main>
    </div>
  )
}
