/** GA4 de adquisición: solo páginas públicas, consentimiento y parámetros permitidos.
 * La misma implementación se publica en el sitio y en la app. Nunca captura
 * formularios, documentos, identificadores de usuario, correos ni tokens OAuth.
 */
export const GA_ID = 'G-GV0Q0RP5WP'
export const CONSENT_COOKIE = 'ragfly_analytics_consent'
const HOSTS = ['www.ragfly.ai', 'ragfly.ai', 'app.ragfly.ai']
type Evento = 'page_view' | 'signup_start' | 'registration_view' | 'registration_submitted' | 'sign_up'
declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
    ragflyGaReady?: boolean
  }
}
export function consentimientoGoogle(): string | null {
  if (typeof document === 'undefined') return null
  return document.cookie.split('; ').find(c => c.startsWith(`${CONSENT_COOKIE}=`))?.split('=')[1] ?? null
}
export function ubicacionPublica(raw: string): string {
  const url = new URL(raw)
  const clean = new URL(url.origin + url.pathname)
  for (const key of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']) {
    const value = url.searchParams.get(key)
    if (value && /^[a-z0-9_.-]{1,100}$/i.test(value)) clean.searchParams.set(key, value)
  }
  return clean.toString()
}
export function iniciarGoogle(): boolean {
  if (typeof window === 'undefined' || !HOSTS.includes(window.location.hostname) || consentimientoGoogle() !== 'accepted') return false
  try {
  if (window.ragflyGaReady) return true
  window.dataLayer = window.dataLayer || []
  window.gtag = function () {
    // Google tag consume comandos en el formato Arguments oficial.
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer?.push(arguments)
  }
  window.gtag('js', new Date())
  window.gtag('config', GA_ID, {
    send_page_view: false,
    cookie_domain: 'ragfly.ai',
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    page_location: ubicacionPublica(window.location.href),
    page_referrer: document.referrer ? new URL(document.referrer).origin : '',
    page_title: 'RAGfly · Acquisition',
  })
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
  document.head.appendChild(script)
  window.ragflyGaReady = true
  return true
  } catch {
    // La analítica nunca interrumpe el alta ni la navegación.
    return false
  }
}
export function medirGoogle(evento: Evento, metodo?: string): boolean {
  if (!iniciarGoogle()) return false
  const method = ['google', 'microsoft', 'azure', 'github', 'email'].includes(metodo ?? '') ? metodo : undefined
  window.gtag?.('event', evento, {
    send_to: GA_ID,
    page_location: ubicacionPublica(window.location.href),
    page_title: 'RAGfly · Acquisition',
    ...(method ? { method } : {}),
    transport_type: 'beacon',
  })
  return true
}
export function medirAltaGoogle(resultado: { nuevo_registro?: boolean; id_registro?: string }, metodo?: string): boolean {
  if (!resultado.nuevo_registro || !resultado.id_registro || !iniciarGoogle()) return false
  const key = `ragfly.ga.registration.${resultado.id_registro}`
  try {
    if (window.localStorage.getItem(key)) return false
    if (!medirGoogle('sign_up', metodo)) return false
    window.localStorage.setItem(key, 'sent')
    return true
  } catch {
    // Si no se puede deduplicar, no inventar una conversión. El alta continúa.
    return false
  }
}
