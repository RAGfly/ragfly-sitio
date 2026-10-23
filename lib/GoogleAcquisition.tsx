'use client'

import { useEffect, useSyncExternalStore } from 'react'
import { usePathname } from 'next/navigation'
import { CONSENT_COOKIE, consentimientoGoogle, medirGoogle } from './google-analytics'

const TEXTOS: Record<string, { texto: string; aceptar: string; rechazar: string; privacidad: string }> = {
  es: { texto: '¿Permites cookies opcionales de Google Analytics para medir las visitas y el recorrido hasta el registro? No enviamos tus correos ni documentos.', aceptar: 'Permitir analítica', rechazar: 'Rechazar', privacidad: 'Privacidad' },
  en: { texto: 'Allow optional Google Analytics cookies to measure visits and the journey to registration? We do not send your email addresses or documents.', aceptar: 'Allow analytics', rechazar: 'Reject', privacidad: 'Privacy' },
  pt: { texto: 'Permite cookies opcionais do Google Analytics para medir visitas e o percurso até o cadastro? Não enviamos seus e-mails nem documentos.', aceptar: 'Permitir análise', rechazar: 'Recusar', privacidad: 'Privacidade' },
  fr: { texto: 'Autoriser les cookies facultatifs de Google Analytics pour mesurer les visites et le parcours vers l’inscription ? Nous ne transmettons ni vos adresses e-mail ni vos documents.', aceptar: 'Autoriser les statistiques', rechazar: 'Refuser', privacidad: 'Confidentialité' },
  de: { texto: 'Optionale Google-Analytics-Cookies erlauben, um Besuche und den Weg zur Registrierung zu messen? Wir senden weder deine E-Mail-Adressen noch Dokumente.', aceptar: 'Analyse erlauben', rechazar: 'Ablehnen', privacidad: 'Datenschutz' },
}

export function GoogleAcquisition({ locale, app = false }: { locale: string; app?: boolean }) {
  const pathname = usePathname()
  const preguntar = useSyncExternalStore(
    (actualizar) => {
      window.addEventListener('ragfly-analytics-consent', actualizar)
      return () => window.removeEventListener('ragfly-analytics-consent', actualizar)
    },
    () => ['ragfly.ai', 'www.ragfly.ai', 'app.ragfly.ai'].includes(window.location.hostname) && !consentimientoGoogle(),
    () => false,
  )
  const publica = !app || pathname === '/login' || pathname === '/auth/callback'
  useEffect(() => {
    if (!publica) return
    medirGoogle('page_view')
    // Un único page_view por navegación; GA tiene la medición mejorada apagada.
  }, [pathname, publica])
  if (!publica) return null
  const t = TEXTOS[locale] ?? TEXTOS.en
  function elegir(aceptar: boolean) {
    document.cookie = `${CONSENT_COOKIE}=${aceptar ? 'accepted' : 'rejected'}; Domain=ragfly.ai; Path=/; Max-Age=15552000; SameSite=Lax; Secure`
    window.dispatchEvent(new Event('ragfly-analytics-consent'))
    if (aceptar) medirGoogle('page_view')
  }
  return (
    <>
      {preguntar && <aside role="region" aria-label="Google Analytics" className={`fixed bottom-0 left-0 right-0 z-[100] border-t p-4 text-sm shadow-lg ${app ? "border-borde bg-fondo-tarjeta text-texto" : "border-slm-brand-light bg-white text-slm-dark"}`}>
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-3">
          <p className="min-w-0 flex-1">{t.texto}</p>
          <button type="button" onClick={() => elegir(false)} className={`rounded border px-4 py-2 ${app ? "border-borde" : "border-slm-brand"}`}>{t.rechazar}</button>
          <button type="button" onClick={() => elegir(true)} className={`rounded px-4 py-2 ${app ? "bg-primario text-primario-texto" : "bg-slm-dark text-white"}`}>{t.aceptar}</button>
          <a href="https://www.ragfly.ai/legal/privacy" className="underline">{t.privacidad}</a>
        </div>
      </aside>}
    </>
  )
}
