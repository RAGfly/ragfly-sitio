// ─────────────────────────────────────────────────────────────────────────
// content/integradores.mjs — config curada de la sección ragfly.ai/build
// ─────────────────────────────────────────────────────────────────────────
//
// FUENTE ÚNICA de los documentos: el kit del repo producto en
//   ../../ragfly/docs/integradores/*.md
// Este archivo NO contiene el copy de los documentos — solo su CURADURÍA:
// qué documento se publica, con qué slug de URL, título, descripción de
// vitrina, ícono y a qué grupo pertenece en la página-cara.
//
// El copy real se sincroniza con `node scripts/build-integradores.mjs`
// (o `npm run build:integradores`), que lee los .md y genera los artefactos.
// ─────────────────────────────────────────────────────────────────────────

// Carpeta del kit, relativa a la raíz del frontend (repos hermanos).
export const KIT_DIR = '../../ragfly/docs/integradores'

// Grupos de la página-cara, en orden de render. Copy en inglés: el kit es
// inglés y el defaultLocale del sitio es 'en' (audiencia global de devs/agentes).
export const grupos = [
  { id: 'interfaces', titulo: 'The six interfaces', desc: 'Pick the one that fits your stack — all share the same auth contract and the same RBAC.' },
  { id: 'guias',      titulo: 'Guides & reference',  desc: 'How to start, how each runtime behaves, and how to report your evaluation.' },
]

// Documentos publicados. `archivo` = nombre del .md en el kit.
// `slug` = URL en ragfly.ai/build/<slug>. El .md crudo se sirve además en
// ragfly.ai/integradores/<archivo> para que un agente lo fetchee tal cual.
// `cara: false` → no aparece como tarjeta en la página-cara (sólo accesible
// por URL directa), p.ej. el README del kit que la propia página-cara absorbe.
export const documentos = [
  // ── The six interfaces ────────────────────────────────────────────────
  { slug: 'sdk',    archivo: 'SDK.md',    grupo: 'interfaces', icono: '📦', titulo: 'Python SDK',     desc: 'pip install ragfly. Fastest path from Python: client.ask("…").' },
  { slug: 'sdk-ts', archivo: 'SDK-TS.md', grupo: 'interfaces', icono: '📘', titulo: 'TypeScript SDK', desc: 'npm i @ragfly/sdk. Same surface as Python, zero deps: Node, browser, Vercel Edge, Workers.' },
  { slug: 'mcp',    archivo: 'MCP.md',    grupo: 'interfaces', icono: '🤖', titulo: 'MCP',            desc: 'LLM agents (Claude Code, Cursor, Cline, Codex). The agent discovers the tools itself.', destacado: true },
  { slug: 'cli',    archivo: 'CLI.md',    grupo: 'interfaces', icono: '⚡', titulo: 'CLI',            desc: 'Scripts, automations, CI/CD pipelines and terminal diagnostics.' },
  { slug: 'rest',   archivo: 'REST.md',   grupo: 'interfaces', icono: '🔌', titulo: 'REST + SSE',     desc: 'Any language or platform: n8n, Make, Zapier, custom apps.' },
  // "Web" is the sixth interface: use app.ragfly.ai directly, no integration.

  // ── Guides & reference ────────────────────────────────────────────────
  { slug: 'quickstart',          archivo: 'QUICKSTART.md',          grupo: 'guias', icono: '🚀', titulo: 'Quickstart',           desc: 'From zero to first semantic query: sign up → API Key → MCP → result.' },
  { slug: 'integration',         archivo: 'INTEGRATION.md',         grupo: 'guias', icono: '🧭', titulo: 'Integration guide',     desc: 'Credentials, roles, identity types and the contract common to every interface.' },
  { slug: 'runtime-hints',       archivo: 'RUNTIME_HINTS.md',       grupo: 'guias', icono: '🎛️', titulo: 'Runtime hints',         desc: 'Which tool to use per runtime: short-context agents, reasoners, IDEs, REST.' },
  { slug: 'agents-md',           archivo: 'AGENTS.md',              grupo: 'guias', icono: '📄', titulo: 'AGENTS.md',             desc: 'Drop it in the root of your agent workspace (Codex/Claude).' },
  { slug: 'evaluation-template', archivo: 'EVALUATION_TEMPLATE.md', grupo: 'guias', icono: '✅', titulo: 'Evaluation template',   desc: 'Report findings from your test with a standard format.' },

  // Kit README: absorbed by the landing face, not shown as a card.
  { slug: 'readme', archivo: 'README.md', grupo: 'guias', icono: '📚', titulo: 'Integration kit', desc: 'Kit index.', cara: false },
]
