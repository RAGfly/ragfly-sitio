import { NextResponse, type NextRequest } from 'next/server'

import { localeDelNavegador } from './i18n/accept-language'
import { locales, type Locale } from './i18n/config'
import { localePorPais } from './i18n/locale-country'
import { esHostRegfly } from './lib/host'

const UN_ANO = 60 * 60 * 24 * 365

/**
 * REGfly (regfly.ai): sitio en español y solo Chile, sin selector de idioma.
 * La raíz redirige a /cl mientras haya un solo país (redirección temporal:
 * con más países la raíz pasará a ser un selector).
 */
function proxyRegfly(request: NextRequest) {
  const ruta = request.nextUrl.pathname
  if (ruta.startsWith('/_next')) return NextResponse.next()
  if (ruta === '/cl' || ruta.startsWith('/cl/')) {
    const url = request.nextUrl.clone()
    url.pathname = `/regfly${ruta}`
    return NextResponse.rewrite(url)
  }
  if (ruta === '/robots.txt' || ruta === '/sitemap.xml' || ruta === '/llms.txt') {
    const url = request.nextUrl.clone()
    url.pathname = `/regfly${ruta}`
    return NextResponse.rewrite(url)
  }
  // La lista de espera reutiliza el endpoint del sitio madre.
  if (ruta === '/api/waitlist') return NextResponse.next()
  // Nada más existe en este host: se vuelve a la landing de Chile.
  const destino = request.nextUrl.clone()
  destino.pathname = '/cl'
  destino.search = ''
  return NextResponse.redirect(destino, 307)
}

/**
 * Idioma inicial del visitante. La cadena, en orden:
 *
 *   1. preferencia explícita — la cookie que deja el selector de idioma;
 *   2. el NAVEGADOR (`Accept-Language`) — una preferencia real de la persona,
 *      declarada antes de conocer RAGfly: alguien que vive en Francia con el
 *      navegador en español quiere español, no francés;
 *   3. el PAÍS — inferencia razonable cuando el navegador no pide ninguno de
 *      los idiomas que publicamos (un turco pidiendo `tr` cae acá);
 *   4. inglés.
 *
 * Es la misma regla que aplica app.ragfly.ai, y el recorrido es uno solo — se
 * llega al producto desde acá, así que el idioma no puede cambiar al cruzar de
 * dominio. Consecuencia asumida del nivel 2: no se puede distinguir "elegí
 * inglés" de "nunca toqué la configuración", así que un equipo con inglés de
 * fábrica verá inglés aunque esté en Francia.
 */
export function proxy(request: NextRequest) {
  // regfly.ai comparte este despliegue con ragfly.ai: se enruta por host.
  if (esHostRegfly(request.headers.get('host'))) return proxyRegfly(request)

  const cookieActual = request.cookies.get('NEXT_LOCALE')?.value
  if (cookieActual && locales.includes(cookieActual as Locale)) {
    return NextResponse.next()
  }

  const locale =
    localeDelNavegador(request.headers.get('accept-language')) ??
    localePorPais(request.headers.get('x-vercel-ip-country'))

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
