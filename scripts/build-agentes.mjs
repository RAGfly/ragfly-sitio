// ─────────────────────────────────────────────────────────────────────────
// build-agentes.mjs — compila content/agentes.mjs → public/agents.json + .txt
// ─────────────────────────────────────────────────────────────────────────
//
//   node scripts/build-agentes.mjs       (o: npm run build:agentes)
//
// Lee la fuente única (content/agentes.mjs) y emite dos artefactos que un
// agente de IA consume directamente desde el sitio:
//
//   public/agents.json   — catálogo estructurado, máquina-legible.
//   public/llms-full.txt — el mismo catálogo en Markdown (estándar llmstxt.org).
//
// La sección visible "Para Agentes" de la landing importa content/agentes.mjs
// directamente; este script solo genera los archivos estáticos públicos.
// ─────────────────────────────────────────────────────────────────────────

import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { mcp, familias, capacidades, recursos } from '../content/agentes.mjs'

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, '..')
const pub = resolve(root, 'public')

const fecha = new Date().toISOString().slice(0, 10)

// ── agents.json ────────────────────────────────────────────────────────────
const json = {
  nombre: 'RAGfly',
  descripcion:
    'Servicio de RAG multi-tenant. Entrega a un agente de IA el contexto documental exacto que necesita, filtrado por RBAC, vía MCP, CLI o API REST.',
  sitio: 'https://ragfly.ai',
  app: 'https://app.ragfly.ai',
  actualizado: fecha,
  mcp,
  total_operaciones: capacidades.length,
  familias,
  operaciones: capacidades,
  total_recursos: recursos.length,
  recursos,
}
writeFileSync(resolve(pub, 'agents.json'), JSON.stringify(json, null, 2) + '\n', 'utf8')

// content/agentes-data.json — consumido por app/page.tsx (sección "Para Agentes").
writeFileSync(
  resolve(root, 'content/agentes-data.json'),
  JSON.stringify({ mcp, familias, operaciones: capacidades, recursos, actualizado: fecha }, null, 2) + '\n',
  'utf8',
)

// ── llms-full.txt ────────────────────────────────────────────────────────
const L = []
L.push('# RAGfly — Catálogo para agentes')
L.push('')
L.push('> ' + json.descripcion)
L.push('')
L.push(`Actualizado: ${fecha}`)
L.push('')
L.push('## Conexión MCP')
L.push('')
L.push(`- Endpoint SSE: ${mcp.endpointSSE}`)
L.push(`- Endpoint HTTP (streamable): ${mcp.endpointHTTP}`)
L.push(`- Autenticación: ${mcp.auth}`)
L.push(`- Alcance: ${mcp.scope}`)
L.push('')
L.push('También disponible vía la CLI de RAGfly Desktop: `ragfly cloud ...`')
L.push('')
L.push(`## Recursos operativos (${recursos.length}; no son tools)`)
L.push('')
for (const recurso of recursos) {
  L.push(`### ${recurso.titulo}`)
  L.push('')
  L.push(recurso.descripcion)
  L.push('')
  L.push('Reglas de seguridad:')
  for (const regla of recurso.reglas_seguridad) L.push(`- ${regla}`)
  L.push('')
  L.push('Documentación:')
  for (const enlace of recurso.enlaces) L.push(`- [${enlace.titulo}](${enlace.url})`)
  L.push('')
}
L.push(`## Operaciones (${capacidades.length})`)
L.push('')
for (const fam of familias) {
  const items = capacidades.filter((c) => c.familia === fam)
  if (!items.length) continue
  L.push(`### ${fam}`)
  L.push('')
  for (const c of items) {
    L.push(`#### ${c.id}`)
    L.push('')
    L.push(c.descripcion)
    L.push('')
    L.push(`- MCP tool: \`${c.id}\``)
    L.push(`- CLI: \`${c.cli}\``)
    L.push(`- REST: \`${c.metodo} ${c.ruta}\` (acceso ${c.tipo_acceso})`)
    if (c.params.length) {
      L.push(`- Parámetros:`)
      for (const p of c.params) {
        L.push(`  - \`${p.nombre}\` (${p.tipo}, def: ${p.default}) — ${p.desc}`)
      }
    }
    L.push('')
  }
}
writeFileSync(resolve(pub, 'llms-full.txt'), L.join('\n'), 'utf8')

console.log(`✓ public/agents.json — ${capacidades.length} operaciones, ${recursos.length} recursos`)
console.log(`✓ content/agentes-data.json — datos para page.tsx`)
console.log(`✓ public/llms-full.txt — catálogo Markdown`)
const porFam = familias.map((f) => `${f}:${capacidades.filter((c) => c.familia === f).length}`).join('  ')
console.log(`  ${porFam}`)
