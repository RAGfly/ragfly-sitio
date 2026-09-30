// build-agentes.mjs — compile the public agent catalog from the integration kit.
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { mcp, recursos } from '../content/agentes.mjs'
import { KIT_DIR } from '../content/integradores.mjs'

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, '..')
const pub = resolve(root, 'public')
const kit = process.env.RAGFLY_KIT_DIR ? resolve(process.env.RAGFLY_KIT_DIR) : resolve(root, KIT_DIR)
const date = new Date().toISOString().slice(0, 10)
const backtick = String.fromCharCode(96)

function readMcpTools() {
  const markdown = readFileSync(resolve(kit, 'MCP.md'), 'utf8')
  const heading = markdown.indexOf('## Available tools')
  const end = markdown.indexOf('### Setting up your organization', heading)
  if (heading < 0 || end < 0) throw new Error('MCP tool table markers are missing')
  const rows = markdown.slice(heading, end).split('\n').filter((line) => line.startsWith('|'))
  const tools = []
  for (const row of rows.slice(2)) {
    const marker = '__ESCAPED_PIPE__'
    const cells = row.replace(/\\\|/g, marker).split('|').slice(1, -1).map((cell) =>
      cell.trim().replaceAll(marker, '|'),
    )
    if (cells.length < 3 || !cells[0] || /^-+$/.test(cells[0])) continue
    tools.push({
      name: cells[0].split(backtick).join(''),
      description: cells[1],
      parameters: cells[2],
    })
  }
  if (tools.length === 0) throw new Error('No MCP tools found in the integration kit')
  return tools
}

const tools = readMcpTools()
const operations = {
  method: 'GET',
  endpoint: 'https://api.ragfly.ai/v1/operations',
  description: 'Separate manifest catalog of screen operations allowed by the credential after RBAC filtering. Its entries are not MCP tools.',
}
const json = {
  name: 'RAGfly',
  description: 'Document retrieval for agents, exposed through MCP tools and a separate RBAC-filtered REST operations manifest.',
  site: 'https://ragfly.ai',
  app: 'https://app.ragfly.ai',
  updated: date,
  mcp,
  total_mcp_tools: tools.length,
  tools,
  operations,
  total_resources: recursos.length,
  resources: recursos,
}
writeFileSync(resolve(pub, 'agents.json'), JSON.stringify(json, null, 2) + '\n', 'utf8')
writeFileSync(
  resolve(root, 'content/agentes-data.json'),
  JSON.stringify({ mcp, tools, operations, resources: recursos, updated: date, actualizado: date }, null, 2) + '\n',
  'utf8',
)

const lines = [
  '# RAGfly — Agent interface catalog',
  '',
  '> Discover MCP tools with tools/list. Discover the separate manifest operations with GET /v1/operations.',
  '',
  'Updated: ' + date,
  '',
  '## MCP connection',
  '',
  '- SSE endpoint: ' + mcp.endpointSSE,
  '- Streamable HTTP endpoint: ' + mcp.endpointHTTP,
  '- Authentication: ' + mcp.auth,
  '- Scope: ' + mcp.scope,
  '',
  'API keys are issued through a signed-in human session. A fixed-entity key cannot change entity. A flexible key can select an authorized entity or release focus with entity_code: null; the server persists the focus for that key.',
  '',
  '## MCP tools (' + tools.length + ')',
  '',
]
for (const tool of tools) {
  lines.push('### ' + tool.name)
  lines.push('')
  lines.push(tool.description)
  if (tool.parameters && tool.parameters !== '—') lines.push('Parameters: ' + tool.parameters)
  lines.push('')
}
lines.push('## Manifest operations')
lines.push('')
lines.push(operations.description)
lines.push('')
lines.push('Endpoint: ' + operations.method + ' ' + operations.endpoint)
lines.push('')
lines.push('## Guidance resources (' + recursos.length + ')')
lines.push('')
for (const resource of recursos) {
  lines.push('### ' + resource.titulo)
  lines.push('')
  lines.push(resource.descripcion)
  lines.push('')
  lines.push('Security rules:')
  for (const rule of resource.reglas_seguridad) lines.push('- ' + rule)
  lines.push('')
  lines.push('Documentation:')
  for (const link of resource.enlaces) lines.push('- [' + link.titulo + '](' + link.url + ')')
  lines.push('')
}
writeFileSync(resolve(pub, 'llms-full.txt'), lines.join('\n'), 'utf8')
console.log('Generated agents.json and llms-full.txt from MCP.md: ' + tools.length + ' MCP tools; manifest operations remain separate.')
