import { NextResponse } from 'next/server'

/* Proxy en streaming → asset .dmg del último release público del Desktop.
   El nombre del archivo lleva versión (RAGfly-X.Y.Z.dmg), por eso el botón
   del sitio apunta aquí y no al asset directo. Se transmite el binario en
   vez de redirigir (302) para que el navegador nunca muestre github.com
   en la barra de direcciones — el cliente solo ve ragfly.ai. */
const REPO = 'RAGfly/ragfly-desktop-releases'

export const dynamic = 'force-dynamic'
export const revalidate = 0

async function encontrarAsset(): Promise<{ name: string; browser_download_url: string } | null> {
  // No basta con `releases/latest`: desde el gate quirúrgico del workflow, un
  // release de solo-Python publica ÚNICAMENTE el payload firmado (sin .dmg/.exe),
  // porque el shell Qt no cambió. Ese release es el "latest" y no trae instalador.
  // Recorremos los releases recientes (vienen del más nuevo al más viejo) y nos
  // quedamos con el primero que SÍ tenga instalador de macOS.
  // El último instalador puede estar bastante antes que los releases de solo
  // payload. Pedimos el máximo que permite GitHub para no caer en la página
  // de releases cuando sí existe un instalador descargable.
  const res = await fetch(`https://api.github.com/repos/${REPO}/releases?per_page=100`, {
    headers: { Accept: 'application/vnd.github+json' },
    cache: 'no-store',
  })
  if (!res.ok) return null
  const releases = await res.json()
  for (const rel of Array.isArray(releases) ? releases : []) {
    if (rel.draft || rel.prerelease) continue
    const asset = (rel.assets ?? []).find((a: { name: string }) => a.name.endsWith('.dmg'))
    if (asset) return asset
  }
  return null
}

export async function GET() {
  try {
    const asset = await encontrarAsset()
    if (asset) {
      const descarga = await fetch(asset.browser_download_url, { cache: 'no-store' })
      if (descarga.ok && descarga.body) {
        return new NextResponse(descarga.body, {
          headers: {
            'Content-Type': 'application/x-apple-diskimage',
            'Content-Disposition': `attachment; filename="${asset.name}"`,
            ...(descarga.headers.get('content-length')
              ? { 'Content-Length': descarga.headers.get('content-length')! }
              : {}),
          },
        })
      }
    }
  } catch {
    /* cae al fallback */
  }
  return NextResponse.redirect(`https://github.com/${REPO}/releases/latest`, 302)
}
