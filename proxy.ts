import { NextResponse, type NextRequest } from 'next/server'

import { locales, type Locale } from './i18n/config'
import { localePorPais } from './i18n/locale-country'

const UN_ANO = 60 * 60 * 24 * 365

/**
 * Idioma inicial del visitante por el LUGAR desde el que llega.
 *
 * La cadena es 1) preferencia explícita (la cookie que deja el selector de
 * idioma), 2) el país, 3) inglés. Antes el sitio saltaba el nivel 2 y miraba
 * el `accept-language` del navegador, que responde a cómo está configurado el
 * equipo y no a dónde está la persona: alguien en Francia con el navegador en
 * inglés veía el sitio en inglés, y alguien en Turquía con el navegador en
 * francés lo veía en francés. Es además la misma regla que aplica
 * app.ragfly.ai, y el recorrido es uno solo — se llega al producto desde acá,
 * así que el idioma no puede cambiar al cruzar de dominio.
 */
export function proxy(request: NextRequest) {
  const cookieActual = request.cookies.get('NEXT_LOCALE')?.value
  if (cookieActual && locales.includes(cookieActual as Locale)) {
    return NextResponse.next()
  }

  const locale = localePorPais(request.headers.get('x-vercel-ip-country'))

  // La cookie de la respuesta persiste la decisión. La copia en los headers de
  // la solicitud permite que next-intl use el locale también en ESTE primer SSR.
  const requestHeaders = new Headers(request.headers)
  request.cookies.set('NEXT_LOCALE', locale)
  requestHeaders.set('cookie', request.cookies.toString())

  const response = NextResponse.next({ request: { headers: requestHeaders } })
  response.cookies.set('NEXT_LOCALE', locale, {
    path: '/',
    maxAge: UN_ANO,
    sameSite: 'lax',
    secure: request.nextUrl.protocol === 'https:',
  })
  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)'],
}
