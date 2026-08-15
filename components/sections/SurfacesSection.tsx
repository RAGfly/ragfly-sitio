'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { BlurIn } from './shared'

/* ------------------------------------------------------------------ */
/* SurfacesSection — "MCP, REST, CLI o SDK" + snippet                   */
/* ------------------------------------------------------------------ */
export function SurfacesSection() {
  const t = useTranslations()
  const surfaces = [
    { h: t('superficies.mcpTitulo'), d: t('superficies.mcpDesc'), href: '/build/mcp', feat: true },
    { h: t('superficies.cliTitulo'), d: t('superficies.cliDesc'), href: '/build/cli', feat: false },
    { h: t('superficies.restTitulo'), d: t('superficies.restDesc'), href: '/build/rest', feat: false },
    { h: t('superficies.sdkTitulo'), d: t('superficies.sdkDesc'), href: '/build/sdk', feat: false },
  ]
  const snippet = `{
  "mcpServers": {
    "ragfly": {
      "url": "https://api.ragfly.ai/mcp/sse",
      "headers": { "Authorization": "Bearer slm_live_xxxxxxxxxx" }
    }
  }
}`
  return (
    <section id="como-se-usa" className="px-6 md:px-12 lg:px-[60px] py-24 md:py-32 bg-slm-light">
      <div className="max-w-[1200px] mx-auto flex flex-col gap-12">
        <div className="max-w-[720px] flex flex-col gap-6">
          <span className="text-sm uppercase tracking-[0.18em] text-slm-brand">{t('superficies.eyebrow')}</span>
          <BlurIn as="h2" className="text-slm-dark text-4xl md:text-5xl lg:text-6xl font-helvetica-neue font-medium leading-[1.05] tracking-[-0.03em]">
            {t('superficies.titulo1')}{' '}
            <span className="inline-block pb-[0.06em] bg-gradient-to-r from-slm-brand-dark via-slm-brand to-slm-brand-light bg-clip-text text-transparent">{t('superficies.tituloAccent')}</span>
          </BlurIn>
          <p className="text-base md:text-lg text-slm-gray font-helvetica-neue max-w-[560px] leading-relaxed">{t('superficies.descripcion')}</p>
        </div>
        <div className="grid md:grid-cols-4 gap-4">
          {surfaces.map((s) => (
            <Link
              key={s.h}
              href={s.href}
              className={`rounded-[24px] p-8 flex flex-col gap-3 border transition-colors hover:border-slm-brand hover:bg-slm-light ${s.feat ? 'bg-white border-slm-brand/40' : 'bg-white border-slm-dark/8'}`}
            >
              <div className="flex items-center gap-2">
                <h3 className="font-mono text-xl font-medium text-slm-dark">{s.h}</h3>
                {s.feat && <span className="text-[10px] uppercase tracking-[0.15em] bg-slm-brand/10 text-slm-brand px-2 py-0.5 rounded-full">abrimos aquí</span>}
              </div>
              <p className="text-slm-gray font-helvetica-neue text-base leading-relaxed">{s.d}</p>
            </Link>
          ))}
        </div>
        <div className="rounded-[24px] bg-slm-dark text-slm-light p-6 md:p-8 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-[0.18em] text-slm-brand-light">{t('superficies.snippetTitulo')}</span>
            <span className="text-xs text-slm-gray-light font-helvetica-neue">{t('superficies.snippetSub')}</span>
          </div>
          <pre className="overflow-x-auto font-mono text-sm leading-relaxed text-slm-light/90 bg-black/20 rounded-xl p-4"><code>{snippet}</code></pre>
          <div className="flex flex-wrap gap-3">
            <a href="/agents.json" className="bg-slm-brand-light text-slm-dark px-5 py-2.5 rounded-full font-medium text-sm hover:opacity-90 transition-opacity">agents.json</a>
            <a href="/llms-full.txt" className="border border-white/30 text-slm-light px-5 py-2.5 rounded-full font-medium text-sm hover:bg-white/10 transition-colors">Catálogo (Markdown)</a>
            <a href="https://api.ragfly.ai/docs" target="_blank" rel="noopener noreferrer" className="border border-white/30 text-slm-light px-5 py-2.5 rounded-full font-medium text-sm hover:bg-white/10 transition-colors">Swagger API</a>
            <Link href="/build/quickstart" className="border border-white/30 text-slm-light px-5 py-2.5 rounded-full font-medium text-sm hover:bg-white/10 transition-colors">Quickstart →</Link>
          </div>
        </div>
      </div>
    </section>
  )
}
