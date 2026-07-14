// ─────────────────────────────────────────────────────────────────────────
// build-planes.mjs — compila content/planes.mjs → messages/es.json + meta
// ─────────────────────────────────────────────────────────────────────────
//
//   node scripts/build-planes.mjs       (o: npm run build:planes)
//
// Lee la fuente única (content/planes.mjs), reescribe el bloque "planes"
// de messages/es.json y emite content/planes-meta.json (resaltado + conteo
// de features) que consume app/page.tsx. NO toca los otros idiomas: para
// eso corre la skill /ragfly-idiomas-sitio después.
// ─────────────────────────────────────────────────────────────────────────

import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { planes, notaPlanes } from '../content/planes.mjs'

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, '..')
const esPath = resolve(root, 'messages/es.json')
const metaPath = resolve(root, 'content/planes-meta.json')

// Eyebrow / título / etiqueta "recomendado" son fijos del bloque; los
// preservamos si ya existen, con defaults razonables.
const es = JSON.parse(readFileSync(esPath, 'utf8'))
const prev = es.planes ?? {}

const bloque = {
  eyebrow: prev.eyebrow ?? 'Planes',
  titulo: prev.titulo ?? 'Un plan para cada tamaño de organización.',
  recomendado: prev.recomendado ?? 'Recomendado',
  nota: notaPlanes,
}

const meta = { plans: [] }

planes.forEach((p, i) => {
  // Algunas líneas de herencia comercial deben abrir la tarjeta antes de los límites.
  const feats = [...(p.featuresIniciales ?? []), p.limites.tokens, p.limites.vectores, ...p.features]

  bloque[`plan${i}Nombre`] = p.nombre
  bloque[`plan${i}Sub`] = p.sub
  bloque[`plan${i}Precio`] = p.precio
  bloque[`plan${i}Cta`] = p.cta
  feats.forEach((f, fi) => {
    bloque[`plan${i}F${fi}`] = f
  })

  meta.plans.push({ idx: i, featured: !!p.resaltado, featureCount: feats.length })
})

es.planes = bloque
writeFileSync(esPath, JSON.stringify(es, null, 2) + '\n', 'utf8')
writeFileSync(metaPath, JSON.stringify(meta, null, 2) + '\n', 'utf8')

console.log(`✓ messages/es.json — bloque "planes" regenerado (${planes.length} planes)`)
planes.forEach((p, i) =>
  console.log(`  plan${i} ${p.nombre.padEnd(13)} ${meta.plans[i].featureCount} features${p.resaltado ? '  ★ recomendado' : ''}`)
)
console.log(`✓ content/planes-meta.json — metadatos para page.tsx`)
console.log(`\nAhora corre  /ragfly-idiomas-sitio  para regenerar en/pt/fr/de.`)
