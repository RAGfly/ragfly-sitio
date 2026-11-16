import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import { esHostRegfly, URL_REGFLY } from '../../../lib/host'

export async function GET() {
  if (!esHostRegfly((await headers()).get('host'))) notFound()
  const cuerpo = `# REGfly, by RAGfly

> Que tu IA responda con la normativa vigente. Normativa chilena con cita a la norma y al artículo. Simple, vigente y preciso.

REGfly es el módulo de regulación de RAGfly (en la app: «RAGfly - Regulación»). Se consulta por chat, MCP, REST, SDK y CLI con la cuenta RAGfly.

- Cita primero la norma superior cuando hay conflicto entre normas.
- Cada documento guarda fuente oficial, fecha de vigencia y fecha de término; lo derogado se marca.
- Si la respuesta no está respaldada, o la pregunta queda fuera de cobertura, se abstiene.
- La cobertura se nombra por área y regulador, con estado: Disponible, En evaluación o Próximamente.

Aviso: información normativa con su fuente; no constituye asesoría legal.

## Páginas
- ${URL_REGFLY}/cl
- ${URL_REGFLY}/sitemap.xml
`
  return new Response(cuerpo, { headers: { 'content-type': 'text/plain; charset=utf-8' } })
}
