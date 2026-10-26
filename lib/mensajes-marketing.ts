import type { Locale } from '../i18n/config'

// Los cinco idiomas del sitio (i18n/config). Se repiten aquí porque el test corre este
// archivo con node --test, que solo borra los imports de tipos.
const IDIOMAS: readonly string[] = ['en', 'es', 'pt', 'fr', 'de'] satisfies readonly Locale[]

/** Contrato compartido con Corp: el catálogo contiene texto, nunca HTML/CSS. */
export type FragmentoMarketing = { texto: string; estilo?: 'normal' | 'enfasis' }
export type MensajeMarketing = { version: 1; idioma: Locale; titulo: FragmentoMarketing[]; cuerpo: string }

export function validarMensaje(valor: unknown, locale: string): MensajeMarketing | null {
  if (!valor || typeof valor !== 'object') return null
  const m = valor as Record<string, unknown>
  if (m.version !== 1 || m.idioma !== locale || typeof m.cuerpo !== 'string' || !m.cuerpo.length || m.cuerpo.length > 4000) return null
  if (!Array.isArray(m.titulo) || !m.titulo.length || m.titulo.length > 30) return null
  if (!m.titulo.every((f: unknown) => {
    if (!f || typeof f !== 'object') return false
    const s = f as Record<string, unknown>
    return Object.keys(s).every(k => k === 'texto' || k === 'estilo') && typeof s.texto === 'string' && s.texto.length > 0 && s.texto.length <= 500 && (s.estilo === undefined || s.estilo === 'normal' || s.estilo === 'enfasis')
  })) return null
  return m as MensajeMarketing
}

export async function cargarMensajeMarketing(id: unknown, locale: string = 'en'): Promise<MensajeMarketing | null> {
  // Corp sirve el copy de campaña en los cinco idiomas del sitio (?locale=, mig 9188 de Corp).
  // Nunca impone otro idioma al visitante: si falta la traducción, la landing usa su texto localizado.
  if (!IDIOMAS.includes(locale)) return null
  if (typeof id !== 'string' || !/^(?:i-[cmp][1-6]|l-[bk][1-7])$/i.test(id)) return null
  try {
    const response = await fetch(`https://ragfly-corp-production.up.railway.app/parametros/mensajes-marketing/${id.toLowerCase()}?locale=${locale}`, {
      next: { revalidate: 60 }, signal: AbortSignal.timeout(3000),
    })
    if (!response.ok) return null
    return validarMensaje(await response.json(), locale)
  } catch { return null }
}
