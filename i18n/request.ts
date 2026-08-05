import { getRequestConfig } from 'next-intl/server'
import { cookies, headers } from 'next/headers'
import { defaultLocale, locales, type Locale } from './config'
import { localeDelNavegador } from './accept-language'

/**
 * Idioma efectivo. En producción la cookie ya viene resuelta por `proxy.ts`,
 * que aplica la cadena completa: preferencia explícita → navegador → país →
 * inglés. La rama del navegador que queda acá cubre el caso sin proxy
 * (desarrollo local), para que `npm run dev` no salga siempre en inglés.
 */
export default getRequestConfig(async () => {
  const cookieStore = await cookies()
  const cookieLocale = cookieStore.get('NEXT_LOCALE')?.value

  let locale: Locale = defaultLocale

  if (cookieLocale && locales.includes(cookieLocale as Locale)) {
    locale = cookieLocale as Locale
  } else {
    const headerStore = await headers()
    const detected = localeDelNavegador(headerStore.get('accept-language'))
    if (detected) locale = detected
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  }
})
