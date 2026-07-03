import { NextResponse } from 'next/server'

/* Redirect estable → asset .dmg del último release público del Desktop.
   El nombre del archivo lleva versión (RAGfly-X.Y.Z.dmg), por eso el botón
   del sitio apunta aquí y no al asset directo. */
const REPO = 'RAGfly/ragfly-desktop-releases'

export const revalidate = 300

export async function GET() {
  try {
    const res = await fetch(`https://api.github.com/repos/${REPO}/releases/latest`, {
      headers: { Accept: 'application/vnd.github+json' },
      next: { revalidate: 300 },
    })
    if (res.ok) {
      const rel = await res.json()
      const asset = (rel.assets ?? []).find((a: { name: string }) => a.name.endsWith('.dmg'))
      if (asset) return NextResponse.redirect(asset.browser_download_url, 302)
    }
  } catch {
    /* cae al fallback */
  }
  return NextResponse.redirect(`https://github.com/${REPO}/releases/latest`, 302)
}
