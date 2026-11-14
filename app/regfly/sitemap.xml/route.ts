import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import { AREAS } from '../../../content/regfly-areas'
import { esHostRegfly, URL_REGFLY } from '../../../lib/host'

export async function GET() {
  if (!esHostRegfly((await headers()).get('host'))) notFound()
  const urls = [`${URL_REGFLY}/cl`]
  for (const a of AREAS) {
    urls.push(`${URL_REGFLY}/cl/${a.slug}`)
    for (const s of a.supervisores) urls.push(`${URL_REGFLY}/cl/${a.slug}/${s.slug}`)
  }
  const cuerpo = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u}</loc></url>`).join('\n')}
</urlset>
`
  return new Response(cuerpo, { headers: { 'content-type': 'application/xml; charset=utf-8' } })
}
