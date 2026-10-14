import { LLMS_TXT } from '../../content/llms'
import { cargarCatalogo, lineaPreciosEs } from '../../lib/catalogo-planes'

// /llms.txt para agentes. Los precios y cupos salen de la BD (GET /pagos/catalogo-publico),
// la misma fuente que la sección de planes; el resto del texto vive en content/llms.ts.
export async function GET() {
  const catalogo = await cargarCatalogo('es')
  return new Response(LLMS_TXT.replace('{{PRECIOS}}', lineaPreciosEs(catalogo)), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600',
    },
  })
}
