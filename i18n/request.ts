import { getRequestConfig } from 'next-intl/server'
import { cookies, headers } from 'next/headers'
import { defaultLocale, locales, type Locale } from './config'

function pickFromAcceptLanguage(header: string | null): Locale | null {
  if (!header) return null
  const parsed = header
    .split(',')
    .map((part) => {
      const [tag, q] = part.trim().split(';q=')
      return { tag: tag.toLowerCase(), q: q ? parseFloat(q) : 1 }
    })
    .sort((a, b) => b.q - a.q)

  for (const { tag } of parsed) {
    const base = tag.split('-')[0]
    if (locales.includes(base as Locale)) return base as Locale
  }
  return null
}

/**
 * Idioma efectivo: 1) la preferencia explícita (cookie del selector, que en
 * producción ya trae la decisión por país que toma `proxy.ts`), 2) el idioma
 * del navegador, 3) inglés.
 *
 * El paso 2 es solo una red para entornos SIN el encabezado de país —
 * desarrollo local o un despliegue fuera de Vercel—. En producción el proxy
 * siempre deja la cookie puesta antes de llegar acá, así que manda el LUGAR,
 * igual que en app.ragfly.ai.
 */
export default getRequestConfig(async () => {
  const cookieStore = await cookies()
  const cookieLocale = cookieStore.get('NEXT_LOCALE')?.value

  let locale: Locale = defaultLocale

  if (cookieLocale && locales.includes(cookieLocale as Locale)) {
    locale = cookieLocale as Locale
  } else {
    const headerStore = await headers()
    const detected = pickFromAcceptLanguage(headerStore.get('accept-language'))
    if (detected) locale = detected
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  }
})
