// ─────────────────────────────────────────────────────────────────────────
// content/integradores.mjs — config curada de la sección ragfly.ai/build
// ─────────────────────────────────────────────────────────────────────────
//
// FUENTE ÚNICA de los documentos: el kit del repo producto en
//   ../../ragfly/docs/integradores/*.md
// Este archivo NO contiene el copy de los documentos — solo su CURADURÍA:
// qué documento se publica, con qué slug de URL, ícono y a qué grupo
// pertenece en la página-cara.
//
// ⚠️ `titulo`/`desc` de abajo NO son lo que se muestra (salvo grupo
// 'alimentacion'): app/build/page.tsx y app/build/[doc]/page.tsx resuelven
// el título y la descripción de vitrina vía next-intl,
// t(`cards.${slug}.titulo`) / t(`cards.${slug}.desc`), ignorando estos
// campos. Al agregar un documento nuevo hay que agregar TAMBIÉN la clave
// `build.cards.<slug>` en los 5 `messages/*.json` (en/es/de/fr/pt) — si
// falta, el <title>, el hero de la subpágina, la portada /build y el pie
// "otros docs" de cualquier otra subpágina muestran la clave cruda en vez
// del texto (no se ve con un curl -> 200 ni leyendo el href del link; solo
// navegando la página real). Bug real + fix: mecanismo-sync-docs-
// integradores-a-sitio.md en la memoria del agente (2026-09-28).
//
// El copy real se sincroniza con `node scripts/build-integradores.mjs`
// (o `npm run build:integradores`), que lee los .md y genera los artefactos.
// ─────────────────────────────────────────────────────────────────────────

// Carpeta del kit, relativa a la raíz del frontend (repos hermanos).
export const KIT_DIR = '../../ragfly/docs/integradores'

// Grupos de la página-cara, en orden de render. Copy en inglés: el kit es
// inglés y el defaultLocale del sitio es 'en' (audiencia global de devs/agentes).
export const grupos = [
  { id: 'alimentacion', titulo: 'Feed your corpus', desc: 'Start with the source of truth: local files, Google Drive or Dropbox. RAGfly indexes the content; the original stays where it belongs.' },
  { id: 'interfaces', titulo: 'The six interfaces', desc: 'Pick the one that fits your stack — all share the same auth contract and the same RBAC.' },
  { id: 'guias',      titulo: 'Guides & reference',  desc: 'How to start, how each runtime behaves, and how to report your evaluation.' },
]

// Documentos publicados. `archivo` = nombre del .md en el kit.
// `slug` = URL en ragfly.ai/build/<slug>. El .md crudo se sirve además en
// ragfly.ai/integradores/<archivo> para que un agente lo fetchee tal cual.
// `cara: false` → no aparece como tarjeta en la página-cara (sólo accesible
// por URL directa), p.ej. el README del kit que la propia página-cara absorbe.
export const documentos = [
  // ── Feed your corpus ──────────────────────────────────────────────────
  { slug: 'integration',         archivo: 'INTEGRATION.md',         grupo: 'alimentacion', icono: '🧭', titulo: 'Feed your corpus', desc: 'Choose local files, Google Drive or Dropbox; learn credentials, privacy and how agents access indexed content.', destacado: true },
  { slug: 'google-drive',        archivo: 'GOOGLE_DRIVE.md',        grupo: 'alimentacion', icono: '📁', titulo: 'Google Drive',     desc: 'Enable the Drive connector for your workspace: Google Cloud credentials and group setup.' },
  { slug: 'dropbox',             archivo: 'DROPBOX.md',             grupo: 'alimentacion', icono: '📦', titulo: 'Dropbox',          desc: 'Enable the Dropbox connector for your workspace: app key, redirect URI and group setup.' },

  // ── The six interfaces ────────────────────────────────────────────────
  // Orden = camino del integrador: MCP (por donde abrimos) → SDK → REST → CLI.
  { slug: 'mcp',    archivo: 'MCP.md',    grupo: 'interfaces', icono: '🤖', titulo: 'MCP',            desc: 'LLM agents (Claude Code, Cursor, Cline, Codex). The agent discovers the tools itself.', destacado: true },
  { slug: 'sdk',    archivo: 'SDK.md',    grupo: 'interfaces', icono: '📦', titulo: 'Python SDK',     desc: 'pip install ragfly. Fastest path from Python: client.ask("…").' },
  { slug: 'sdk-ts', archivo: 'SDK-TS.md', grupo: 'interfaces', icono: '📘', titulo: 'TypeScript SDK', desc: 'npm i @ragfly/sdk. Same surface as Python, zero deps: Node, browser, Vercel Edge, Workers.' },
  { slug: 'rest',   archivo: 'REST.md',   grupo: 'interfaces', icono: '🔌', titulo: 'REST + SSE',     desc: 'Any language or platform: n8n, Make, Zapier, custom apps.' },
  { slug: 'cli',    archivo: 'CLI.md',    grupo: 'interfaces', icono: '⚡', titulo: 'CLI',            desc: 'Scripts, automations, CI/CD pipelines and terminal diagnostics.' },
  // "Web" is the sixth interface: use app.ragfly.ai directly, no integration.

  // ── Guides & reference ────────────────────────────────────────────────
  { slug: 'quickstart',          archivo: 'QUICKSTART.md',          grupo: 'guias', icono: '🚀', titulo: 'Quickstart',           desc: 'From zero to first semantic query: sign up → API Key → MCP → result.' },
  { slug: 'operations',          archivo: 'OPERATIONS.md',          grupo: 'guias', icono: '📋', titulo: 'Operations reference', desc: '108 operations across REST, MCP, CLI and both SDKs — kind, minimum profile and which screens use each one.' },
  { slug: 'runtime-hints',       archivo: 'RUNTIME_HINTS.md',       grupo: 'guias', icono: '🎛️', titulo: 'Runtime hints',         desc: 'Which tool to use per runtime: short-context agents, reasoners, IDEs, REST.' },
  { slug: 'env-vars',            archivo: 'ENV_VARS.md',            grupo: 'guias', icono: '🔧', titulo: 'Environment variables', desc: 'Every RAGFLY_ variable: canonical name, default, legacy aliases. One place, no surprises.' },
  { slug: 'agents-md',           archivo: 'AGENTS.md',              grupo: 'guias', icono: '📄', titulo: 'AGENTS.md',             desc: 'Drop it in the root of your agent workspace (Codex/Claude).' },
  { slug: 'evaluation-template', archivo: 'EVALUATION_TEMPLATE.md', grupo: 'guias', icono: '✅', titulo: 'Evaluation template',   desc: 'Report findings from your test with a standard format.' },

  // Kit README: absorbed by the landing face, not shown as a card.
  { slug: 'readme', archivo: 'README.md', grupo: 'guias', icono: '📚', titulo: 'Integration kit', desc: 'Kit index.', cara: false },
]
