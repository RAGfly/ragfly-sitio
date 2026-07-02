// ─────────────────────────────────────────────────────────────────────────
// build-integradores.mjs — sincroniza el kit del producto → sitio
// ─────────────────────────────────────────────────────────────────────────
//
//   node scripts/build-integradores.mjs      (o: npm run build:integradores)
//
// FUENTE ÚNICA: ../../ragfly/docs/integradores/*.md  (repo producto)
// Vercel solo ve el repo del sitio, así que este sync corre LOCAL y commitea
// los artefactos. Genera:
//
//   public/integradores/<ARCHIVO>.md     — el .md crudo, fetcheable por agentes.
//   content/integradores-docs.json       — HTML pre-renderizado por slug + meta.
//
// Nunca se edita el copy técnico a mano en el sitio: se edita el kit en el
// producto y se vuelve a correr este script (o la skill /ragfly-build-sitio).
// ─────────────────────────────────────────────────────────────────────────

import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { marked } from 'marked'
import { KIT_DIR, documentos } from '../content/integradores.mjs'

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, '..')
const kit = resolve(root, KIT_DIR)
const outMd = resolve(root, 'public/integradores')
const fecha = new Date().toISOString().slice(0, 10)

// Quita un bloque de frontmatter YAML inicial (--- ... ---) si existe.
function stripFrontmatter(src) {
  if (!src.startsWith('---')) return src
  const end = src.indexOf('\n---', 3)
  if (end === -1) return src
  const after = src.indexOf('\n', end + 1)
  return src.slice(after + 1).replace(/^\s+/, '')
}

marked.setOptions({ gfm: true, breaks: false })

// Ids de heading estilo GitHub — sin esto los enlaces `#ancla` del kit
// (p.ej. MCP.md#setting-up-ragfly_root--…) no apuntan a nada en la sub-página.
function githubSlug(html) {
  return html
    .replace(/<[^>]+>/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s_-]/gu, '')
    .replace(/\s/g, '-')
}

marked.use({
  renderer: {
    heading({ tokens, depth }) {
      const html = this.parser.parseInline(tokens)
      return `<h${depth} id="${githubSlug(html)}">${html}</h${depth}>\n`
    },
  },
})

// Mapa archivo .md → slug de URL, para reescribir enlaces intra-kit.
const slugByArchivo = Object.fromEntries(documentos.map((d) => [d.archivo, d.slug]))

// Reescribe enlaces markdown a otros .md del kit → /build/<slug>(#ancla).
// Sin esto, `[X](INTEGRATION.md)` resolvería a /build/INTEGRATION.md (404).
function rewriteKitLinks(md) {
  return md.replace(/\]\((?:\.\/)?([A-Za-z_]+\.md)(#[^)]*)?\)/g, (m, archivo, ancla = '') => {
    const slug = slugByArchivo[archivo]
    return slug ? `](/build/${slug}${ancla})` : m
  })
}

// Carpeta limpia de .md públicos.
rmSync(outMd, { recursive: true, force: true })
mkdirSync(outMd, { recursive: true })

const docs = {}
for (const d of documentos) {
  const raw = readFileSync(resolve(kit, d.archivo), 'utf8')

  // 1) .md crudo público (nombre original, para fetch de agentes).
  writeFileSync(resolve(outMd, d.archivo), raw, 'utf8')

  // 2) HTML pre-renderizado para la sub-página.
  const cuerpo = rewriteKitLinks(stripFrontmatter(raw))
  docs[d.slug] = {
    slug: d.slug,
    archivo: d.archivo,
    titulo: d.titulo,
    desc: d.desc,
    grupo: d.grupo,
    icono: d.icono,
    cara: d.cara !== false,
    rawUrl: `/integradores/${d.archivo}`,
    html: marked.parse(cuerpo),
  }
}

writeFileSync(
  resolve(root, 'content/integradores-docs.json'),
  JSON.stringify({ actualizado: fecha, docs }, null, 2) + '\n',
  'utf8',
)

console.log(`✓ public/integradores/ — ${documentos.length} .md crudos`)
console.log(`✓ content/integradores-docs.json — ${documentos.length} docs (HTML + meta)`)
console.log(`  fuente: ${KIT_DIR}  ·  ${fecha}`)
