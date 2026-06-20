import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import docsData from '../../../content/integradores-docs.json'

/* ------------------------------------------------------------------ */
/* /build/[doc] — renders one integration doc synced from the product  */
/* repo. HTML is pre-rendered at build time by build-integradores.mjs. */
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
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slm-light-gray">
        <div className="max-w-[820px] mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/build" className="flex items-center gap-2.5">
            <Image src="/ala_5c.png" alt="RAGfly" width={2348} height={553} className="h-6 w-auto" />
            <span className="font-manrope font-semibold text-slm-dark text-base">RAGfly</span>
            <span className="text-slm-light-gray">/</span>
            <span className="text-slm-gray text-sm">build</span>
          </Link>
          <nav className="flex items-center gap-5 text-sm text-slm-gray">
            <a href={d.rawUrl} className="hover:text-slm-dark transition-colors font-mono text-xs">{d.archivo}</a>
            <a href="https://api.ragfly.ai/docs" target="_blank" rel="noopener noreferrer" className="hover:text-slm-dark transition-colors">Swagger</a>
          </nav>
        </div>
      </header>

      <main className="max-w-[820px] mx-auto px-6 py-12">
        <Link href="/build" className="text-sm text-slm-brand hover:underline">← All docs</Link>

        <div className="flex items-center gap-3 mt-4 mb-8">
          <span className="text-3xl">{d.icono}</span>
          <div>
            <h1 className="text-3xl font-semibold text-slm-dark leading-tight">{d.titulo}</h1>
            <p className="text-sm text-slm-gray font-helvetica-neue">{d.desc}</p>
          </div>
        </div>

        {/* Rendered Markdown */}
        <article className="doc-prose" dangerouslySetInnerHTML={{ __html: d.html }} />

        {/* Other docs */}
        <div className="mt-16 pt-8 border-t border-slm-light-gray">
          <p className="text-xs uppercase tracking-wide text-slm-gray font-medium mb-4">Other docs</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {order.filter((o) => o.slug !== d.slug).map((o) => (
              <Link key={o.slug} href={`/build/${o.slug}`} className="border border-slm-light-gray rounded-xl px-3 py-2.5 text-sm hover:border-slm-brand transition-colors flex items-center gap-2">
                <span>{o.icono}</span>
                <span className="text-slm-dark truncate">{o.titulo}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slm-light-gray flex justify-between items-center text-xs text-slm-gray font-helvetica-neue">
          <Link href="/" className="hover:text-slm-dark transition-colors">← Back to site</Link>
          <a href={d.rawUrl} className="hover:text-slm-dark transition-colors">View raw {d.archivo} →</a>
        </div>
      </main>
    </div>
  )
}
