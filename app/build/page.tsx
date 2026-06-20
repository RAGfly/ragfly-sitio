import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { documentos, grupos } from '../../content/integradores.mjs'

/* ------------------------------------------------------------------ */
/* /build — landing face for integrators (agents, devs, consultancies) */
/* English-only & static: the integration kit is English and the site  */
/* defaultLocale is 'en'. Cards are driven by content/integradores.mjs; */
/* docs sync from the product repo via scripts/build-integradores.mjs.  */
/* ------------------------------------------------------------------ */

export const metadata: Metadata = {
  title: 'Build on RAGfly — Integration kit',
  description:
    'Connect your agent or app to RAGfly: five interfaces (Python SDK, MCP, CLI, REST, Web), one auth contract, RBAC by design. Docs for Claude, Codex, developers and consultancies.',
  alternates: { canonical: '/build' },
}

type Doc = (typeof documentos)[number]
const cards: Doc[] = documentos.filter((d) => d.cara !== false)

function Card({ d }: { d: Doc }) {
  return (
    <Link
      href={`/build/${d.slug}`}
      className="border border-slm-light-gray rounded-2xl p-5 hover:border-slm-brand hover:shadow-sm transition-all group block"
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl">{d.icono}</span>
        {d.destacado && (
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gradient-to-r from-slm-brand-dark to-slm-brand text-white uppercase tracking-wide">
            Start here
          </span>
        )}
      </div>
      <div className="font-semibold text-slm-dark text-sm group-hover:text-slm-brand transition-colors">{d.titulo}</div>
      <div className="text-xs text-slm-gray mt-1 font-helvetica-neue leading-snug">{d.desc}</div>
    </Link>
  )
}

export default function BuildPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slm-light-gray">
        <div className="max-w-[960px] mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/ala_5c.png" alt="RAGfly" width={2348} height={553} className="h-6 w-auto" />
            <span className="font-manrope font-semibold text-slm-dark text-base">RAGfly</span>
          </Link>
          <nav className="flex items-center gap-6 text-sm text-slm-gray">
            <Link href="/build/mcp" className="hover:text-slm-dark transition-colors">MCP</Link>
            <Link href="/build/rest" className="hover:text-slm-dark transition-colors">REST</Link>
            <Link href="/build/sdk" className="hover:text-slm-dark transition-colors">SDK</Link>
            <a href="https://api.ragfly.ai/docs" target="_blank" rel="noopener noreferrer" className="hover:text-slm-dark transition-colors">Swagger</a>
            <a href="https://app.ragfly.ai" className="bg-slm-dark text-white px-4 py-1.5 rounded-full text-xs font-medium hover:opacity-80 transition-opacity">
              Go to app →
            </a>
          </nav>
        </div>
      </header>

      <main className="max-w-[960px] mx-auto px-6 py-14">
        {/* Hero */}
        <div className="mb-12">
          <p className="text-xs uppercase tracking-[0.18em] text-slm-brand font-medium mb-3">Build on RAGfly</p>
          <h1 className="text-4xl font-semibold text-slm-dark mb-4 leading-tight">
            Give your agent the exact<br />
            <span className="bg-gradient-to-r from-slm-brand-dark via-slm-brand to-slm-brand-light bg-clip-text text-transparent">document context it needs.</span>
          </h1>
          <p className="text-lg text-slm-gray font-helvetica-neue leading-relaxed max-w-[640px]">
            RAGfly exposes your group&apos;s document corpus to any external system — agents, code, automations.
            Five interfaces, one auth contract, multi-tenant RBAC by design. Pick a path below or grab the raw docs.
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            <Link href="/build/quickstart" className="bg-slm-dark text-white px-5 py-2.5 rounded-full font-medium text-sm hover:opacity-90 transition-opacity">Quickstart →</Link>
            <a href="https://api.ragfly.ai/docs" target="_blank" rel="noopener noreferrer" className="border border-slm-light-gray text-slm-dark px-5 py-2.5 rounded-full font-medium text-sm hover:border-slm-brand transition-colors">Interactive API (Swagger)</a>
            <a href="/agents.json" className="border border-slm-light-gray text-slm-dark px-5 py-2.5 rounded-full font-medium text-sm hover:border-slm-brand transition-colors">agents.json</a>
          </div>
        </div>

        {/* API Key callout */}
        <div className="bg-slm-light rounded-2xl p-6 mb-14 border border-slm-light-gray">
          <h2 className="font-semibold text-slm-dark mb-1">Before you start — get your API Key</h2>
          <p className="text-sm text-slm-gray font-helvetica-neue mb-3">
            The group admin creates a key at{' '}
            <a href="https://app.ragfly.ai/api-keys" className="text-slm-brand underline" target="_blank" rel="noopener noreferrer">app.ragfly.ai/api-keys</a>
            {' '}(or via <code className="bg-white px-1.5 py-0.5 rounded border border-slm-light-gray text-xs">POST /auth/api-key</code>). Shown only once — store it in a secrets manager.
          </p>
          <code className="block bg-white px-3 py-2 rounded-lg border border-slm-light-gray text-xs font-mono text-slm-dark overflow-x-auto">
            Authorization: Bearer slm_live_xxxxxxxxxxxxxxxxxxxxxxxx
          </code>
        </div>

        {/* Doc groups */}
        {grupos.map((g) => (
          <section key={g.id} className="mb-14">
            <h2 className="text-2xl font-semibold text-slm-dark mb-1">{g.titulo}</h2>
            <p className="text-slm-gray font-helvetica-neue mb-6 leading-relaxed">{g.desc}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {cards.filter((d) => d.grupo === g.id).map((d) => <Card key={d.slug} d={d} />)}
              {g.id === 'interfaces' && (
                <a href="https://app.ragfly.ai" className="border border-dashed border-slm-light-gray rounded-2xl p-5 hover:border-slm-brand transition-all group block">
                  <div className="text-2xl mb-2">🌐</div>
                  <div className="font-semibold text-slm-dark text-sm group-hover:text-slm-brand transition-colors">Web</div>
                  <div className="text-xs text-slm-gray mt-1 font-helvetica-neue leading-snug">End users operate at app.ragfly.ai directly — no integration needed.</div>
                </a>
              )}
            </div>
          </section>
        ))}

        {/* Raw files for agents */}
        <div className="bg-slm-dark rounded-2xl p-6 text-slm-light/90 mb-14">
          <h2 className="font-semibold text-white mb-1">Raw files for agents</h2>
          <p className="text-sm text-slm-light/70 font-helvetica-neue mb-4">
            Every doc is also served as plain Markdown so an agent can fetch it directly. Point your agent at:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-1.5 text-xs font-mono">
            {documentos.map((d) => (
              <a key={d.archivo} href={`/integradores/${d.archivo}`} className="text-slm-light/80 hover:text-white hover:underline truncate">
                /integradores/{d.archivo}
              </a>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-4 text-xs">
            <a href="/llms.txt" className="text-slm-brand-light hover:underline">llms.txt</a>
            <a href="/llms-full.txt" className="text-slm-brand-light hover:underline">llms-full.txt</a>
            <a href="/agents.json" className="text-slm-brand-light hover:underline">agents.json</a>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-8 border-t border-slm-light-gray flex justify-between items-center text-xs text-slm-gray font-helvetica-neue">
          <Link href="/" className="hover:text-slm-dark transition-colors">← Back to site</Link>
          <span>© 2026 RAGfly</span>
        </div>
      </main>
    </div>
  )
}
