import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import { esHostRegfly, URL_REGFLY } from '../../../lib/host'

export async function GET() {
  if (!esHostRegfly((await headers()).get('host'))) notFound()
  const cuerpo = `# REGfly — regfly.ai
User-agent: *
Allow: /

Sitemap: ${URL_REGFLY}/sitemap.xml
`
  return new Response(cuerpo, { headers: { 'content-type': 'text/plain; charset=utf-8' } })
}
