import { locales, type Locale } from './config'

/**
 * Primer idioma publicado por RAGfly que el navegador declara en
 * `Accept-Language`, respetando el orden de preferencia (factor `q`).
 * Devuelve null si el visitante no pide ninguno de los que publicamos.
 *
 * Es el nivel 2 de la cadena de idioma: una preferencia REAL de la persona,
 * declarada antes de conocer RAGfly, y por eso gana sobre el país — alguien
 * que vive en Francia con el navegador en español quiere español, no francés.
 */
export function localeDelNavegador(header: string | null | undefined): Locale | null {
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
