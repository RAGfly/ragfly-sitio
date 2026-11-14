import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import { esHostRegfly, URL_REGFLY } from '../../../lib/host'

export async function GET() {
  if (!esHostRegfly((await headers()).get('host'))) notFound()
  const cuerpo = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${URL_REGFLY}/cl</loc></url>
</urlset>
`
  return new Response(cuerpo, { headers: { 'content-type': 'application/xml; charset=utf-8' } })
}
