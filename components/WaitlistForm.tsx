'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

type Status = 'idle' | 'loading' | 'success' | 'error' | 'invalid'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Captura de email / waitlist.
 * Envía a /api/waitlist, que reenvía a WAITLIST_ENDPOINT (webhook de Make,
 * Formspree, Zapier, Supabase, etc.). Ver app/api/waitlist/route.ts.
 *
 * `variant`:
 *  - "onDark"  → para fondos oscuros/gradiente (sección de contacto / hero).
 *  - "onLight" → para fondos claros.
 */
export function WaitlistForm({ variant = 'onDark' }: { variant?: 'onDark' | 'onLight' }) {
  const t = useTranslations('waitlist')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  // honeypot anti-bots: si se llena, ignoramos el envío
  const [company, setCompany] = useState('')

  const onDark = variant === 'onDark'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (status === 'loading') return

    const value = email.trim()
    if (!EMAIL_RE.test(value)) {
      setStatus('invalid')
      return
    }

    setStatus('loading')
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: value, company, source: 'site:contacto' }),
      })
      if (!res.ok) throw new Error('bad status')
      setStatus('success')
      setEmail('')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div
        className={
          onDark
            ? 'rounded-2xl bg-white/15 backdrop-blur-sm border border-white/25 px-5 py-4 max-w-[460px]'
            : 'rounded-2xl bg-slm-light border border-slm-dark/10 px-5 py-4 max-w-[460px]'
        }
        role="status"
        aria-live="polite"
      >
        <p className={onDark ? 'text-white font-medium' : 'text-slm-dark font-medium'}>
          {t('success')}
        </p>
      </div>
    )
  }

  const labelColor = onDark ? 'text-white/85' : 'text-slm-gray'
  const inputClass = onDark
    ? 'flex-1 min-w-0 rounded-full bg-white/95 text-slm-dark placeholder:text-slm-gray/70 px-5 py-3 text-base outline-none focus:ring-2 focus:ring-white/60'
    : 'flex-1 min-w-0 rounded-full bg-white text-slm-dark placeholder:text-slm-gray/70 px-5 py-3 text-base outline-none border border-slm-dark/15 focus:ring-2 focus:ring-slm-brand/40'
  const btnClass = onDark
    ? 'rf-boton rounded-full bg-white text-slm-dark px-6 py-3 font-medium text-base hover:opacity-90 transition-opacity disabled:opacity-60 whitespace-nowrap'
    : 'rf-boton rounded-full bg-slm-dark text-slm-light px-6 py-3 font-medium text-base hover:opacity-90 transition-opacity disabled:opacity-60 whitespace-nowrap'

  return (
    <div className="max-w-[480px] w-full">
      <p className={`text-sm md:text-base ${labelColor} mb-3`}>{t('prompt')}</p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3" noValidate>
        {/* honeypot oculto */}
        <input
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="hidden"
          aria-hidden="true"
        />
        <input
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          placeholder={t('placeholder')}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (status === 'invalid' || status === 'error') setStatus('idle')
          }}
          className={inputClass}
          aria-label={t('placeholder')}
        />
        <button type="submit" disabled={status === 'loading'} className={btnClass}>
          {status === 'loading' ? t('sending') : t('button')}
        </button>
      </form>
      {status === 'invalid' && (
        <p className={`mt-2 text-sm ${onDark ? 'text-white/90' : 'text-red-600'}`}>{t('invalid')}</p>
      )}
      {status === 'error' && (
        <p className={`mt-2 text-sm ${onDark ? 'text-white/90' : 'text-red-600'}`}>{t('error')}</p>
      )}
    </div>
  )
}
