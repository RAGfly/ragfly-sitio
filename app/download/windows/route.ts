import { NextResponse } from 'next/server'

/* Redirect estable → asset -setup.exe del último release público del Desktop. */
const REPO = 'RAGfly/ragfly-desktop-releases'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    // Ver el comentario de ../mac/route.ts: un release de solo-Python publica solo
    // el payload firmado (sin instaladores), así que el "latest" puede no traer .exe.
    // Buscamos el release más reciente que SÍ tenga instalador de Windows.
    const res = await fetch(`https://api.github.com/repos/${REPO}/releases?per_page=30`, {
      headers: { Accept: 'application/vnd.github+json' },
      cache: 'no-store',
    })
    if (res.ok) {
      const releases = await res.json()
      for (const rel of Array.isArray(releases) ? releases : []) {
        if (rel.draft || rel.prerelease) continue
        const asset = (rel.assets ?? []).find((a: { name: string }) => a.name.endsWith('.exe'))
        if (asset) return NextResponse.redirect(asset.browser_download_url, 302)
      }
    }
  } catch {
    /* cae al fallback */
  }
  return NextResponse.redirect(`https://github.com/${REPO}/releases/latest`, 302)
}
