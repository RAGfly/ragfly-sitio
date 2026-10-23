'use client'

import { medirGoogle } from '../../lib/google-analytics'
import { track } from '@vercel/analytics'

/* ------------------------------------------------------------------ */
/* BotonEmpezar — «Start free» que conserva la atribución               */
/*                                                                     */
/* Los avisos llegan con utm_* (plan §6: una fila por cuenta con su     */
/* fuente). Al hacer clic, el botón reenvía esos parámetros a           */
/* app.ragfly.ai para que el alta quede atribuida; sin utm_* en la URL, */
/* va al destino limpio.                                                */
/* ------------------------------------------------------------------ */
const CLAVES = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const

export function BotonEmpezar({
  destino,
  className,
  children,
}: {
  destino: string
  className?: string
  children: React.ReactNode
}) {
  function conAtribucion(e: React.MouseEvent<HTMLAnchorElement>) {
    const actual = new URLSearchParams(window.location.search)
    const url = new URL(destino)
    for (const k of CLAVES) {
      const v = actual.get(k)
      if (v) url.searchParams.set(k, v)
    }
    e.currentTarget.href = url.toString()
    medirGoogle('signup_start')
    // Paso landing → registro: sin esto, un clic de aviso que no se registra no deja huella.
    track('cta_empezar', { utm_source: actual.get('utm_source') ?? '', utm_content: actual.get('utm_content') ?? '' })
  }

  return (
    <a href={destino} onClick={conAtribucion} className={className}>
      {children}
    </a>
  )
}
