import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { documentos, grupos } from '../../content/integradores.mjs'

/* ------------------------------------------------------------------ */
/* /build — landing face for integrators (agents, devs, consultancies) */
/* English-only & static: the integration kit is English and the site  */
/* defaultLocale is 'en'. Cards are driven by content/integradores.mjs; */
/* docs sync from the product repo via scripts/build-integradores.mjs.  */
/* Visual language aligned with the landing (app/page.tsx): brand v2.0  */
/* tokens, helvetica-neue headings + gradient accent, big radii.        */
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
      className="group block rounded-[24px] border border-slm-dark/8 p-5 transition-colors hover:border-slm-brand/40 hover:shadow-sm"
    >
      <div className="mb-2 flex items-center gap-2">
        <span className="text-2xl">{d.icono}</span>
        {d.destacado && (
          <span className="rounded-full bg-gradient-to-r from-slm-brand-dark to-slm-brand px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-white">
            Start here
          </span>
        )}
      </div>
      <div className="text-sm font-semibold text-slm-dark transition-colors group-hover:text-slm-brand">{d.titulo}</div>
      <div className="mt-1 font-helvetica-neue text-xs leading-snug text-slm-gray">{d.desc}</div>
    </Link>
  )
}

export default function BuildPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header — mismo patrón sobrio que /legal */}
      <header className="sticky top-0 z-50 border-b border-slm-dark/10 bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-[960px] items-center justify-between px-6 py-4 md:px-8">
          <Link href="/" className="flex items-center gap-2.5 font-manrope text-xl font-semibold text-slm-dark">
            <Image src="/ala_5c.png" alt="" width={2348} height={553} className="h-6 w-auto" />
            RAGfly
          </Link>
          <nav className="flex items-center gap-5 text-sm text-slm-gray">
            <Link href="/build/mcp" className="hidden transition-colors hover:text-slm-dark sm:inline">MCP</Link>
            <Link href="/build/rest" className="hidden transition-colors hover:text-slm-dark sm:inline">REST</Link>
            <Link href="/build/sdk" className="hidden transition-colors hover:text-slm-dark sm:inline">SDK</Link>
            <a href="https://api.ragfly.ai/docs" target="_blank" rel="noopener noreferrer" className="hidden transition-colors hover:text-slm-dark sm:inline">Swagger</a>
            <a href="https://app.ragfly.ai" className="rounded-full bg-slm-dark px-4 py-1.5 text-xs font-medium text-slm-light transition-opacity hover:opacity-80">
              Go to app →
            </a>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-[960px] px-6 py-14 md:px-8">
        {/* Hero */}
        <div className="mb-14">
          <p className="mb-4 text-sm uppercase tracking-[0.18em] text-slm-brand">Build on RAGfly</p>
          <h1 className="max-w-[760px] font-helvetica-neue text-4xl font-medium leading-[1.05] tracking-[-0.03em] text-slm-dark md:text-5xl">
            Give your agent the exact{' '}
            <span className="inline-block bg-gradient-to-r from-slm-brand-dark via-slm-brand to-slm-brand-light bg-clip-text pb-[0.06em] text-transparent">
              document context it needs.
            </span>
          </h1>
          <p className="mt-5 max-w-[640px] font-helvetica-neue text-lg leading-relaxed text-slm-gray">
            RAGfly exposes your group&apos;s document corpus to any external system — agents, code, automations.
            Five interfaces, one auth contract, multi-tenant RBAC by design. Pick a path below or grab the raw docs.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/build/quickstart" className="rounded-full bg-slm-dark px-5 py-2.5 text-sm font-medium text-slm-light transition-opacity hover:opacity-90">Quickstart →</Link>
            <a href="https://api.ragfly.ai/docs" target="_blank" rel="noopener noreferrer" className="rounded-full border border-slm-dark/15 px-5 py-2.5 text-sm font-medium text-slm-dark transition-colors hover:border-slm-brand">Interactive API (Swagger)</a>
            <a href="/agents.json" className="rounded-full border border-slm-dark/15 px-5 py-2.5 text-sm font-medium text-slm-dark transition-colors hover:border-slm-brand">agents.json</a>
          </div>
        </div>

        {/* API Key callout */}
        <div className="mb-14 rounded-[24px] border border-slm-dark/8 bg-slm-light p-6">
          <h2 className="mb-1 font-helvetica-neue text-xl font-medium tracking-[-0.01em] text-slm-dark">Before you start — get your API Key</h2>
          <p className="mb-3 font-helvetica-neue text-sm text-slm-gray">
            The group admin creates a key at{' '}
            <a href="https://app.ragfly.ai/api-keys" className="text-slm-brand-dark underline underline-offset-2 hover:text-slm-brand" target="_blank" rel="noopener noreferrer">app.ragfly.ai/api-keys</a>
            {' '}(or via <code className="rounded border border-slm-dark/10 bg-white px-1.5 py-0.5 text-xs">POST /auth/api-key</code>). Shown only once — store it in a secrets manager.
          </p>
          <code className="block overflow-x-auto rounded-lg border border-slm-dark/10 bg-white px-3 py-2 font-mono text-xs text-slm-dark">
            Authorization: Bearer slm_live_xxxxxxxxxxxxxxxxxxxxxxxx
          </code>
        </div>

        {/* Doc groups */}
        {grupos.map((g) => (
          <section key={g.id} className="mb-14">
            <h2 className="mb-1 font-helvetica-neue text-2xl font-medium tracking-[-0.02em] text-slm-dark md:text-3xl">{g.titulo}</h2>
            <p className="mb-6 font-helvetica-neue leading-relaxed text-slm-gray">{g.desc}</p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              {cards.filter((d) => d.grupo === g.id).map((d) => <Card key={d.slug} d={d} />)}
              {g.id === 'interfaces' && (
                <a href="https://app.ragfly.ai" className="group block rounded-[24px] border border-dashed border-slm-dark/15 p-5 transition-colors hover:border-slm-brand/40">
                  <div className="mb-2 text-2xl">🌐</div>
                  <div className="text-sm font-semibold text-slm-dark transition-colors group-hover:text-slm-brand">Web</div>
                  <div className="mt-1 font-helvetica-neue text-xs leading-snug text-slm-gray">End users operate at app.ragfly.ai directly — no integration needed.</div>
                </a>
              )}
            </div>
          </section>
        ))}

        {/* Raw files for agents */}
        <div className="relative mb-14 overflow-hidden rounded-[24px] bg-slm-dark p-6 text-slm-light/90 md:p-8">
          <div
            className="pointer-events-none absolute inset-0 opacity-50"
            style={{ background: 'radial-gradient(600px 400px at 90% 0%, rgba(0,139,214,0.28), transparent 70%)' }}
          />
          <div className="relative">
            <h2 className="mb-1 font-helvetica-neue text-xl font-medium tracking-[-0.01em] text-white">Raw files for agents</h2>
            <p className="mb-4 font-helvetica-neue text-sm text-slm-light/70">
              Every doc is also served as plain Markdown so an agent can fetch it directly. Point your agent at:
            </p>
            <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 font-mono text-xs sm:grid-cols-3">
              {documentos.map((d) => (
                <a key={d.archivo} href={`/integradores/${d.archivo}`} className="truncate text-slm-light/80 hover:text-white hover:underline">
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
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slm-dark/8 pt-8 font-helvetica-neue text-xs text-slm-gray">
          <Link href="/" className="transition-colors hover:text-slm-dark">← Back to site</Link>
          <span>© 2026 RAGfly</span>
        </div>
      </main>
    </div>
  )
}
