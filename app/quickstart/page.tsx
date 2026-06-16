'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

/* ------------------------------------------------------------------ */
/* Quickstart — ragfly.ai/quickstart                                   */
/* Guía de integración para desarrolladores: MCP · REST · CLI         */
/* Strings en messages/{es,en,pt,fr,de}.json → quickstart.*           */
/* ------------------------------------------------------------------ */

function Code({ children }: { children: string }) {
  return (
    <pre className="overflow-x-auto rounded-xl bg-slm-dark text-slm-light/90 font-mono text-sm leading-relaxed p-5 my-4">
      <code>{children}</code>
    </pre>
  )
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-5 mb-8">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-slm-brand-dark to-slm-brand flex items-center justify-center text-white text-sm font-semibold">
        {n}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-slm-dark text-base mb-2">{title}</h3>
        {children}
      </div>
    </div>
  )
}

function SectionCard({ id, emoji, title, badge, children }: { id: string; emoji: string; title: string; badge?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mb-16 scroll-mt-20">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-2xl">{emoji}</span>
        <h2 className="text-2xl font-semibold text-slm-dark">{title}</h2>
        {badge && (
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gradient-to-r from-slm-brand-dark to-slm-brand text-white">
            {badge}
          </span>
        )}
      </div>
      {children}
    </section>
  )
}

/* Snippets de código — no se traducen (son técnicos) */
const SNIPPET_MCP = `{
  "mcpServers": {
    "ragfly": {
      "url": "https://api.ragfly.ai/mcp/sse",
      "headers": {
        "Authorization": "Bearer slm_live_xxxxxxxxxx"
      }
    }
  }
}`

const SNIPPET_MCP_VERIFY = `estado_sesion()
→ {"usuario": "bot-finanzas", "grupo": "EMPRESA", "rol": "DOC-ADMIN"}`

const SNIPPET_MCP_RESULT = `# Pregunta en lenguaje natural con RAG completo
preguntar(texto="¿Cuáles son las cláusulas de penalización en los contratos de 2024?")
→ Respuesta con citas a la fuente

# Búsqueda semántica directa (sin LLM)
buscar_chunks(q="cláusulas de penalización", limite=5)
→ [{chunk, documento, score}, ...]`

const SNIPPET_REST_VERIFY = `curl https://api.ragfly.ai/auth/me \\
  -H "Authorization: Bearer slm_live_xxxxxxxxxx"

# Respuesta esperada:
{
  "codigo_usuario": "bot-finanzas",
  "rol_principal": "DOC-ADMIN",
  "grupo_activo": "EMPRESA"
}`

const SNIPPET_REST_LIST = `curl "https://api.ragfly.ai/documentos/paginado?estado=VECTORIZADO&limite=10" \\
  -H "Authorization: Bearer slm_live_xxxxxxxxxx"`

const SNIPPET_REST_SEARCH = `curl -X POST https://api.ragfly.ai/documentos/buscar-semantico \\
  -H "Authorization: Bearer slm_live_xxxxxxxxxx" \\
  -H "Content-Type: application/json" \\
  -d '{"q": "cláusulas de penalización", "limit": 5}'`

const SNIPPET_REST_RAG = `# 1. Crear conversación
curl -X POST https://api.ragfly.ai/chat/conversaciones \\
  -H "Authorization: Bearer slm_live_xxxxxxxxxx" \\
  -H "Content-Type: application/json" \\
  -d '{"codigo_funcion": "CHAT-USUARIO"}'
# → {"id": 42, ...}

# 2. Enviar mensaje (respuesta en SSE)
curl -X POST https://api.ragfly.ai/chat/conversaciones/42/mensajes/stream \\
  -H "Authorization: Bearer slm_live_xxxxxxxxxx" \\
  -H "Content-Type: application/json" \\
  -d '{"texto": "¿Cuáles son las cláusulas de penalización?"}'`

const SNIPPET_CLI_INSTALL = `pip install ragfly
ragfly version
# RAGfly Desktop v2.x.x`

const SNIPPET_CLI_AUTH = `# Opción A — Login interactivo (JWT, 1 hora)
ragfly login

# Opción B — API Key (automatizaciones, sin caducidad)
export RAGFLY_TOKEN=slm_live_xxxxxxxxxx

# Verificar
ragfly cloud me
# Usuario: bot-finanzas · Rol: DOC-ADMIN · Grupo: EMPRESA`

const SNIPPET_CLI_COMMANDS = `# Listar documentos vectorizados
ragfly cloud documento listar --estado VECTORIZADO --limite 20

# Ver un documento en detalle
ragfly cloud documento ver DOC-2024-001

# Listar Espacios de Trabajo
ragfly cloud espacio listar

# Ejecutar una habilidad LLM y esperar resultado
ragfly cloud habilidad ejecutar RESUMIR_DOCUMENTO --espacio 42 --esperar

# Ver estado del pipeline
ragfly cloud cola ver --estado EJECUTANDO`

const SNIPPET_CLI_BINARY = `ragfly
├── login / logout / version / config
├── local       ← operaciones sobre el filesystem local
└── cloud
    ├── me
    ├── documento   listar | ver
    ├── espacio     listar | ver
    ├── habilidad   listar | ver | ejecutar
    ├── cola        ver | ejecuciones
    ├── api-key     crear | listar | revocar
    └── chat        enviar`

const SNIPPET_APIKEY = `# Formato de la key
slm_live_xxxxxxxxxxxxxxxxxxxxxxxx

# Úsala en todos los métodos:
Authorization: Bearer slm_live_xxxxxxxxxxxxxxxxxxxxxxxx`

const MCP_TOOLS = ['estado_sesion', 'listar_documentos', 'ver_documento', 'buscar_chunks', 'preguntar', 'listar_espacios', 'ver_espacio', 'listar_habilidades', 'ver_habilidad', 'ejecutar_habilidad', 'ver_cola', 'ver_ejecuciones']

const REST_ENDPOINTS: [string, string, string][] = [
  ['GET',  '/auth/me',                                      'restEp1'],
  ['GET',  '/documentos/paginado',                          'restEp2'],
  ['POST', '/documentos/buscar-semantico',                  'restEp3'],
  ['GET',  '/espacios-trabajo/paginado',                    'restEp4'],
  ['GET',  '/habilidades',                                  'restEp5'],
  ['POST', '/habilidades/{codigo}/ejecutar',                'restEp6'],
  ['GET',  '/cola-estados-docs/paginado',                   'restEp7'],
  ['POST', '/chat/conversaciones/{id}/mensajes/stream',     'restEp8'],
]

export default function QuickstartPage() {
  const t = useTranslations('quickstart')

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slm-light-gray">
        <div className="max-w-[900px] mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/ragfly_isotipo.png" alt="RAGfly" width={24} height={24} />
            <span className="font-manrope font-semibold text-slm-dark text-base">RAGfly</span>
          </Link>
          <nav className="flex items-center gap-6 text-sm text-slm-gray">
            <a href="#mcp" className="hover:text-slm-dark transition-colors">MCP</a>
            <a href="#rest" className="hover:text-slm-dark transition-colors">REST</a>
            <a href="#cli" className="hover:text-slm-dark transition-colors">CLI</a>
            <a href="https://api.ragfly.ai/docs" target="_blank" rel="noopener noreferrer" className="hover:text-slm-dark transition-colors">Swagger API</a>
            <a href="https://app.ragfly.ai" className="bg-slm-dark text-white px-4 py-1.5 rounded-full text-xs font-medium hover:opacity-80 transition-opacity">
              {t('navApp')}
            </a>
          </nav>
        </div>
      </header>

      <main className="max-w-[900px] mx-auto px-6 py-14">

        {/* Intro */}
        <div className="mb-14">
          <p className="text-xs uppercase tracking-[0.18em] text-slm-brand font-medium mb-3">{t('eyebrow')}</p>
          <h1 className="text-4xl font-semibold text-slm-dark mb-4 leading-tight">
            {t('heroTitle1')}<br />
            <span className="bg-gradient-to-r from-slm-brand-dark via-slm-brand to-slm-brand-light bg-clip-text text-transparent">{t('heroTitle2')}</span>
          </h1>
          <p className="text-lg text-slm-gray font-helvetica-neue leading-relaxed max-w-[620px]">
            {t('heroDesc')}
          </p>

          <div className="grid grid-cols-3 gap-4 mt-8">
            {([
              { id: 'mcp',  icon: '🤖', label: 'MCP',  descKey: 'pathMcpDesc',  badgeKey: 'pathMcpBadge' },
              { id: 'rest', icon: '🔌', label: 'REST', descKey: 'pathRestDesc', badgeKey: undefined },
              { id: 'cli',  icon: '⚡', label: 'CLI',  descKey: 'pathCliDesc',  badgeKey: undefined },
            ] as const).map(c => (
              <a key={c.id} href={`#${c.id}`} className="border border-slm-light-gray rounded-2xl p-5 hover:border-slm-brand hover:shadow-sm transition-all group">
                <div className="text-2xl mb-2">{c.icon}</div>
                <div className="font-semibold text-slm-dark text-sm group-hover:text-slm-brand transition-colors">{c.label}</div>
                <div className="text-xs text-slm-gray mt-1 font-helvetica-neue leading-snug">{t(c.descKey)}</div>
                {c.badgeKey && <div className="mt-2 text-xs text-slm-brand font-medium">{t(c.badgeKey)} ↓</div>}
              </a>
            ))}
          </div>
        </div>

        {/* API Key */}
        <div className="bg-slm-light rounded-2xl p-6 mb-14 border border-slm-light-gray">
          <h2 className="font-semibold text-slm-dark mb-1">{t('apiKeyTitle')}</h2>
          <p className="text-sm text-slm-gray font-helvetica-neue mb-4">
            {t.rich('apiKeyDesc', {
              link: (chunks) => (
                <a href="https://app.ragfly.ai/api-keys" className="text-slm-brand underline" target="_blank" rel="noopener noreferrer">{chunks}</a>
              ),
            })}
          </p>
          <div className="flex flex-wrap gap-3">
            {(['apiKeyRole1', 'apiKeyRole2'] as const).map(k => (
              <span key={k} className="text-xs bg-white border border-slm-light-gray rounded-lg px-3 py-1.5 text-slm-gray font-mono">{t(k)}</span>
            ))}
          </div>
          <Code>{SNIPPET_APIKEY}</Code>
          <p className="text-xs text-slm-gray font-helvetica-neue">
            {t('apiKeyVerify')}{' '}
            <code className="bg-white px-1.5 py-0.5 rounded border border-slm-light-gray text-xs">curl https://api.ragfly.ai/auth/me -H &quot;Authorization: Bearer slm_live_...&quot;</code>
          </p>
        </div>

        {/* MCP */}
        <SectionCard id="mcp" emoji="🤖" title={t('mcpTitle')} badge={t('mcpBadge')}>
          <p className="text-slm-gray font-helvetica-neue mb-6 leading-relaxed">{t('mcpDesc')}</p>

          <Step n={1} title={t('mcpStep1Title')}>
            <p className="text-sm text-slm-gray mb-2 font-helvetica-neue">
              {t.rich('mcpStep1FileNote', {
                f: (chunks) => <code className="bg-slm-light px-1.5 rounded text-xs">{chunks}</code>,
                g: (chunks) => <code className="bg-slm-light px-1.5 rounded text-xs">{chunks}</code>,
              })}
            </p>
            <Code>{SNIPPET_MCP}</Code>
            <p className="text-xs text-slm-gray font-helvetica-neue">
              {t.rich('mcpStep1HttpNote', {
                c: (chunks) => <code className="bg-slm-light px-1 rounded text-xs">{chunks}</code>,
              })}
            </p>
          </Step>

          <Step n={2} title={t('mcpStep2Title')}>
            <p className="text-sm text-slm-gray font-helvetica-neue mb-2">
              {t.rich('mcpStep2Note', {
                c: (chunks) => <code className="bg-slm-light px-1 rounded text-xs">{chunks}</code>,
              })}
            </p>
            <Code>{SNIPPET_MCP_VERIFY}</Code>
          </Step>

          <Step n={3} title={t('mcpStep3Title')}>
            <Code>{SNIPPET_MCP_RESULT}</Code>
          </Step>

          <div className="bg-slm-light rounded-xl p-4 text-sm">
            <p className="font-medium text-slm-dark mb-2">{t('mcpToolsTitle')}</p>
            <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs text-slm-gray font-mono">
              {MCP_TOOLS.map(tool => <span key={tool}>· {tool}</span>)}
            </div>
            <a href="/agents.json" className="text-xs text-slm-brand mt-3 block hover:underline">{t('mcpToolsCatalog')}</a>
          </div>
        </SectionCard>

        {/* REST */}
        <SectionCard id="rest" emoji="🔌" title={t('restTitle')}>
          <p className="text-slm-gray font-helvetica-neue mb-6 leading-relaxed">
            {t.rich('restDesc', {
              c: (chunks) => <code className="bg-slm-light px-1.5 rounded text-sm">{chunks}</code>,
              link: (chunks) => (
                <a href="https://api.ragfly.ai/docs" target="_blank" rel="noopener noreferrer" className="text-slm-brand hover:underline">{chunks}</a>
              ),
            })}
          </p>

          <Step n={1} title={t('restStep1Title')}><Code>{SNIPPET_REST_VERIFY}</Code></Step>
          <Step n={2} title={t('restStep2Title')}><Code>{SNIPPET_REST_LIST}</Code></Step>
          <Step n={3} title={t('restStep3Title')}><Code>{SNIPPET_REST_SEARCH}</Code></Step>
          <Step n={4} title={t('restStep4Title')}><Code>{SNIPPET_REST_RAG}</Code></Step>

          <div className="border border-slm-light-gray rounded-xl overflow-hidden text-sm">
            <div className="bg-slm-light px-4 py-3 font-medium text-slm-dark text-xs uppercase tracking-wide">{t('restEndpointsTitle')}</div>
            {REST_ENDPOINTS.map(([method, route, key]) => (
              <div key={route} className="flex items-start gap-3 px-4 py-2.5 border-t border-slm-light-gray">
                <span className={`text-xs font-mono font-semibold shrink-0 w-10 ${method === 'POST' ? 'text-green-600' : 'text-slm-brand'}`}>{method}</span>
                <code className="text-xs text-slm-dark shrink-0 w-64">{route}</code>
                <span className="text-xs text-slm-gray font-helvetica-neue">{t(key as Parameters<typeof t>[0])}</span>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* CLI */}
        <SectionCard id="cli" emoji="⚡" title={t('cliTitle')}>
          <p className="text-slm-gray font-helvetica-neue mb-6 leading-relaxed">{t('cliDesc')}</p>

          <Step n={1} title={t('cliStep1Title')}><Code>{SNIPPET_CLI_INSTALL}</Code></Step>
          <Step n={2} title={t('cliStep2Title')}><Code>{SNIPPET_CLI_AUTH}</Code></Step>
          <Step n={3} title={t('cliStep3Title')}><Code>{SNIPPET_CLI_COMMANDS}</Code></Step>

          <div className="bg-slm-light rounded-xl p-4 text-sm">
            <p className="font-medium text-slm-dark mb-3">{t('cliBinaryTitle')}</p>
            <Code>{SNIPPET_CLI_BINARY}</Code>
          </div>
        </SectionCard>

        {/* CTA */}
        <div className="bg-gradient-to-br from-slm-brand-dark to-slm-brand rounded-2xl p-8 text-white text-center">
          <h2 className="text-xl font-semibold mb-2">{t('ctaTitle')}</h2>
          <p className="text-white/80 font-helvetica-neue text-sm mb-6">{t('ctaDesc')}</p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href="https://app.ragfly.ai" className="bg-white text-slm-dark px-6 py-2.5 rounded-full font-medium text-sm hover:opacity-90 transition-opacity">{t('ctaBtn')}</a>
            <a href="https://api.ragfly.ai/docs" target="_blank" rel="noopener noreferrer" className="border border-white/40 text-white px-6 py-2.5 rounded-full font-medium text-sm hover:bg-white/10 transition-colors">Swagger API</a>
            <a href="/agents.json" className="border border-white/40 text-white px-6 py-2.5 rounded-full font-medium text-sm hover:bg-white/10 transition-colors">agents.json</a>
          </div>
        </div>

        {/* Footer mínimo */}
        <div className="mt-12 pt-8 border-t border-slm-light-gray flex justify-between items-center text-xs text-slm-gray font-helvetica-neue">
          <Link href="/" className="hover:text-slm-dark transition-colors">{t('footerBack')}</Link>
          <span>© 2026 RAGfly</span>
        </div>
      </main>
    </div>
  )
}
