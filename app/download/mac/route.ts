import { NextResponse } from 'next/server'

/* Redirect estable → asset .dmg del último release público del Desktop.
   El nombre del archivo lleva versión (RAGfly-X.Y.Z.dmg), por eso el botón
   del sitio apunta aquí y no al asset directo. */
const REPO = 'RAGfly/ragfly-desktop-releases'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    // No basta con `releases/latest`: desde el gate quirúrgico del workflow, un
    // release de solo-Python publica ÚNICAMENTE el payload firmado (sin .dmg/.exe),
    // porque el shell Qt no cambió. Ese release es el "latest" y no trae instalador.
    // Recorremos los releases recientes (vienen del más nuevo al más viejo) y nos
    // quedamos con el primero que SÍ tenga instalador de macOS.
    const res = await fetch(`https://api.github.com/repos/${REPO}/releases?per_page=30`, {
      headers: { Accept: 'application/vnd.github+json' },
      cache: 'no-store',
    })
    if (res.ok) {
      const releases = await res.json()
      for (const rel of Array.isArray(releases) ? releases : []) {
        if (rel.draft || rel.prerelease) continue
        const asset = (rel.assets ?? []).find((a: { name: string }) => a.name.endsWith('.dmg'))
        if (asset) return NextResponse.redirect(asset.browser_download_url, 302)
      }
    }
  } catch {
    /* cae al fallback */
  }
  return NextResponse.redirect(`https://github.com/${REPO}/releases/latest`, 302)
}
