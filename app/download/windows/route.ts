import { NextResponse } from 'next/server'

/* Proxy en streaming → asset -setup.exe del último release público del Desktop.
   Se transmite el binario en vez de redirigir (302) para que el navegador
   nunca muestre github.com en la barra de direcciones — el cliente solo ve
   ragfly.ai. */
const REPO = 'RAGfly/ragfly-desktop-releases'

export const dynamic = 'force-dynamic'
export const revalidate = 0

async function encontrarAsset(): Promise<{ name: string; browser_download_url: string } | null> {
  // Ver el comentario de ../mac/route.ts: un release de solo-Python publica solo
  // el payload firmado (sin instaladores), así que el "latest" puede no traer .exe.
  // Buscamos el release más reciente que SÍ tenga instalador de Windows.
  // Véase el equivalente de macOS: los releases de solo payload pueden dejar
  // el instalador más reciente fuera de los primeros 30 resultados.
  const res = await fetch(`https://api.github.com/repos/${REPO}/releases?per_page=100`, {
    headers: { Accept: 'application/vnd.github+json' },
    cache: 'no-store',
  })
  if (!res.ok) return null
  const releases = await res.json()
  for (const rel of Array.isArray(releases) ? releases : []) {
    if (rel.draft || rel.prerelease) continue
    const asset = (rel.assets ?? []).find((a: { name: string }) => a.name.endsWith('.exe'))
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
            'Content-Type': 'application/octet-stream',
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
