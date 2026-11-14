'use client'

import { useState } from 'react'

type Estado = 'idle' | 'enviando' | 'ok' | 'error' | 'invalido'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Lista de espera de REGfly: mismo endpoint que el sitio madre, con su propia `source`. */
export function ListaEspera({ fuente = 'regfly:lista-espera' }: { fuente?: string }) {
  const [email, setEmail] = useState('')
  const [empresa, setEmpresa] = useState('') // honeypot
  const [estado, setEstado] = useState<Estado>('idle')

  async function enviar(e: React.FormEvent) {
    e.preventDefault()
    if (estado === 'enviando') return
    const valor = email.trim()
    if (!EMAIL_RE.test(valor)) {
      setEstado('invalido')
      return
    }
    setEstado('enviando')
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: valor, company: empresa, source: fuente }),
      })
      if (!res.ok) throw new Error('estado')
      setEstado('ok')
      setEmail('')
    } catch {
      setEstado('error')
    }
  }

  if (estado === 'ok') {
    return (
      <p className="rounded-2xl bg-slm-light border border-slm-dark/10 px-5 py-4 max-w-[460px] text-slm-dark">
        Listo. Te escribimos cuando puedas hacer tu primera consulta.
      </p>
    )
  }

  return (
    <form onSubmit={enviar} className="flex flex-col gap-3 max-w-[460px]" noValidate>
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (estado !== 'idle') setEstado('idle')
          }}
          placeholder="tu@empresa.cl"
          aria-label="Correo electrónico"
          autoComplete="email"
          className="flex-1 rounded-full border border-slm-dark/20 bg-white px-5 py-3 text-base text-slm-dark placeholder:text-slm-gray-light focus:outline-none focus:border-slm-brand"
        />
        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          value={empresa}
          onChange={(e) => setEmpresa(e.target.value)}
          className="hidden"
          name="empresa"
        />
        <button
          type="submit"
          disabled={estado === 'enviando'}
          className="rf-boton bg-slm-dark text-white px-7 py-3 rounded-full font-medium text-base hover:opacity-90 transition-opacity disabled:opacity-60"
        >
          {estado === 'enviando' ? 'Enviando…' : 'Avísame'}
        </button>
      </div>
      {estado === 'invalido' && <p className="text-sm text-red-700">Revisa el correo: no parece válido.</p>}
      {estado === 'error' && <p className="text-sm text-red-700">No pudimos registrarte. Intenta de nuevo en un momento.</p>}
    </form>
  )
}
