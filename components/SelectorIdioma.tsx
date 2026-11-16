'use client'

import { useLocale, useTranslations } from 'next-intl'
import { useState, useRef, useEffect, useTransition } from 'react'
import { setLocale } from '../i18n/actions'
import { locales, localeNames, localeShort, type Locale } from '../i18n/config'

export function SelectorIdioma() {
  const locale = useLocale() as Locale
  const t = useTranslations('selector')
  const [abierto, setAbierto] = useState(false)
  const [pending, startTransition] = useTransition()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function fueraClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setAbierto(false)
      }
    }
    document.addEventListener('mousedown', fueraClick)
    return () => document.removeEventListener('mousedown', fueraClick)
  }, [])

  function elegir(loc: Locale) {
    setAbierto(false)
    startTransition(async () => {
      await setLocale(loc)
      window.location.reload()
    })
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setAbierto((v) => !v)}
        disabled={pending}
        aria-label={t('label')}
        className="flex items-center gap-1 text-sm text-[#737373] hover:text-[var(--foreground)] transition-colors px-2 py-1 rounded border border-transparent hover:border-[#EAEAEA]"
      >
        <span>{localeShort[locale]}</span>
        <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
          <path d="M2 4l3 3 3-3z" />
        </svg>
      </button>
      {abierto && (
        <ul className="absolute right-0 top-full mt-1 bg-white border border-[#EAEAEA] rounded-md shadow-md py-1 min-w-[140px] z-50">
          {locales.map((loc) => (
            <li key={loc}>
              <button
                type="button"
                onClick={() => elegir(loc)}
                className={`w-full text-left px-3 py-1.5 text-sm hover:bg-[#F5F5F5] ${
                  loc === locale
                    ? 'text-[var(--foreground)] font-semibold'
                    : 'text-[#737373]'
                }`}
              >
                <span className="inline-block w-7 text-xs text-[#737373]">
                  {localeShort[loc]}
                </span>
                {localeNames[loc]}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
