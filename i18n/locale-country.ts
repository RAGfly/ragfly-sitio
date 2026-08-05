import { defaultLocale, type Locale } from './config'

const PAISES_ES = new Set([
  'AR', 'BO', 'CL', 'CO', 'CR', 'CU', 'DO', 'EC', 'ES', 'GQ', 'GT',
  'HN', 'MX', 'NI', 'PA', 'PE', 'PR', 'PY', 'SV', 'UY', 'VE',
])

const PAISES_FR = new Set([
  'BJ', 'BF', 'CD', 'CG', 'CI', 'FR', 'GA', 'GN', 'MC', 'ML', 'NE', 'SN', 'TG',
])

const PAISES_DE = new Set(['AT', 'DE', 'LI'])

const PAISES_PT = new Set(['AO', 'BR', 'CV', 'GW', 'MZ', 'PT', 'ST', 'TL'])

/**
 * Convierte un país ISO 3166-1 alpha-2 en un locale publicado por RAGfly.
 * Los países multilingües ambiguos y cualquier idioma no soportado caen a EN.
 *
 * Gemelo de `src/i18n/locale-country.ts` en el monorepo del producto: el sitio
 * y app.ragfly.ai deben elegir el MISMO idioma para el mismo visitante, porque
 * el recorrido es uno solo (se llega al producto desde el sitio). Al cambiar
 * un mapeo acá, cambiarlo también allá.
 */
export function localePorPais(country: string | null | undefined): Locale {
  const codigo = country?.trim().toUpperCase()
  if (!codigo) return defaultLocale
  if (PAISES_ES.has(codigo)) return 'es'
  if (PAISES_FR.has(codigo)) return 'fr'
  if (PAISES_DE.has(codigo)) return 'de'
  if (PAISES_PT.has(codigo)) return 'pt'
  return defaultLocale
}
