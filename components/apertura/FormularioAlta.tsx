'use client'

/** Captura por correo en la landing; no inicia sesión ni crea una cuenta sin verificarla. */
import { useState } from 'react'
import { track } from '@vercel/analytics'
import { medirGoogle } from '../../lib/google-analytics'
import { PRE_REGISTRATION } from '../../content/preregistro'
import type { Locale } from '../../i18n/config'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.ragfly.ai'
const CLAVES_UTM = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const

export function FormularioAlta({ id = 'signup', locale }: { id?: string; locale: Locale }) {
  const t = PRE_REGISTRATION[locale]
  const [correo, setCorreo] = useState('')
  const [acepta, setAcepta] = useState(false)
  const [estado, setEstado] = useState<'idle' | 'sending' | 'saved' | 'error'>('idle')

  async function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (estado === 'sending' || !acepta) return
    setEstado('sending')
    const query = new URLSearchParams(window.location.search)
    const attribution = Object.fromEntries(CLAVES_UTM.flatMap(key => {
      const value = query.get(key)?.trim().slice(0, 200)
      return value ? [[key, value]] : []
    }))
    try {
      const response = await fetch(`${API_URL}/auth/pre-registration`, {
        method: 'POST', credentials: 'omit',
        headers: { 'Content-Type': 'application/json', 'Accept-Language': locale },
        body: JSON.stringify({ email: correo.trim(), locale, terms_accepted: true, attribution }),
        signal: AbortSignal.timeout(25000),
      })
      if (!response.ok) throw new Error('request_failed')
      setEstado('saved')
      // Es una solicitud capturada; el alta se mide después de verificar el correo.
      medirGoogle('pre_registration_requested', 'email_link')
      const gancho = attribution.utm_content || ''
      track('pre_registration_requested', { utm_content: /^[a-z0-9][a-z0-9-]{0,29}$/i.test(gancho) ? gancho : '' })
    } catch {
      setEstado('error')
    }
  }

  return (
    <div id={id} className="scroll-mt-6 w-full rounded-2xl border border-slm-brand-light bg-slm-light p-5 md:p-6 font-helvetica-neue">
      <h2 className="text-xl font-medium tracking-tight text-slm-dark">{t.title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-slm-gray">{t.description}</p>
      {estado === 'saved' ? (
        <div role="status" className="mt-5">
          <p className="font-medium text-slm-brand-dark">{t.success}</p>
          <p className="mt-2 text-sm leading-relaxed text-slm-gray">{t.next}</p>
          <button type="button" onClick={() => setEstado('idle')} className="mt-4 text-sm text-slm-brand underline">{t.resend}</button>
        </div>
      ) : (
        <form onSubmit={enviar} className="mt-5 flex flex-col gap-3">
          <label htmlFor={`${id}-correo`} className="sr-only">{t.email}</label>
          <input id={`${id}-correo`} type="email" required autoComplete="email" maxLength={254}
            placeholder={t.email} value={correo} onChange={e => setCorreo(e.target.value)}
            className="w-full min-w-0 rounded-xl border border-slm-brand-light bg-white px-4 py-3 text-base text-slm-dark outline-none focus:border-slm-brand" />
          <label className="flex items-start gap-2.5 text-xs leading-relaxed text-slm-gray">
            <input type="checkbox" required checked={acepta} onChange={e => setAcepta(e.target.checked)}
              className="mt-0.5 size-4 shrink-0 accent-slm-brand" />
            <span>{t.accept} <a href="/legal/terms" target="_blank" rel="noopener noreferrer" className="underline">{t.terms}</a> {t.andPrivacy} <a href="/legal/privacy" target="_blank" rel="noopener noreferrer" className="underline">{t.privacy}</a>.</span>
          </label>
          <button type="submit" disabled={estado === 'sending'}
            className="w-full rounded-full bg-slm-brand px-5 py-3 text-sm font-medium text-white transition hover:bg-slm-brand-dark disabled:opacity-60">
            {estado === 'sending' ? t.sending : t.submit}
          </button>
          {estado === 'error' && <p role="alert" className="text-sm text-red-700">{t.error}</p>}
        </form>
      )}
      <p className="mt-4 text-xs leading-relaxed text-slm-gray">{t.free}</p>
    </div>
  )
}
