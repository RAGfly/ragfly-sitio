'use client'

/* ------------------------------------------------------------------ */
/* FormularioAlta — el registro dentro de la página de destino          */
/*                                                                     */
/* La cuenta la crea app.ragfly.ai (Víctor, 15-oct: sin tocar el        */
/* backend). Este formulario entrega ahí ya decidido, sin la pantalla   */
/* intermedia:                                                         */
/*   Google / Microsoft → /login?proveedor=… (lanza el OAuth al montar) */
/*   correo             → /login?registro=1#email=… (registro abierto   */
/*                        con el correo puesto; el fragmento no viaja   */
/*                        al servidor)                                 */
/*   Log in             → /login                                       */
/* Las utm_* de la URL viajan siempre (plan §6: fuente de cada cuenta). */
/* ------------------------------------------------------------------ */
import { useState } from 'react'
import { medirGoogle } from '../../lib/google-analytics'
import { track } from '@vercel/analytics'
import { URL_LOGIN, type TextosComunes } from '../../content/apertura'

const CLAVES_UTM = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const

function urlLogin(extra: Record<string, string>, correo?: string): string {
  const url = new URL(URL_LOGIN)
  const actual = new URLSearchParams(window.location.search)
  for (const k of CLAVES_UTM) {
    const v = actual.get(k)
    if (v) url.searchParams.set(k, v)
  }
  for (const [k, v] of Object.entries(extra)) url.searchParams.set(k, v)
  if (correo) url.hash = new URLSearchParams({ email: correo }).toString()
  return url.toString()
}

const botonClaro =
  'font-helvetica-neue flex w-full items-center justify-center gap-3 rounded-full border border-slm-brand-light bg-white px-6 py-3 text-base font-medium text-slm-dark hover:border-slm-brand'

function LogoGoogle() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.5l6.7-6.7C35.6 2.4 30.2 0 24 0 14.6 0 6.6 5.4 2.7 13.3l7.8 6C12.4 13.6 17.7 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 2.9-2.2 5.4-4.7 7.1l7.3 5.7c4.3-4 7.2-9.9 7.2-17.3z" />
      <path fill="#FBBC05" d="M10.5 28.7c-.5-1.4-.8-3-.8-4.7s.3-3.3.8-4.7l-7.8-6C1 16.6 0 20.2 0 24s1 7.4 2.7 10.7l7.8-6z" />
      <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.3-5.7c-2 1.4-4.7 2.3-8.6 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.8 6C6.6 42.6 14.6 48 24 48z" />
    </svg>
  )
}

function LogoMicrosoft() {
  return (
    <svg width="18" height="18" viewBox="0 0 21 21" aria-hidden="true">
      <path fill="#F25022" d="M0 0h10v10H0z" />
      <path fill="#7FBA00" d="M11 0h10v10H11z" />
      <path fill="#00A4EF" d="M0 11h10v10H0z" />
      <path fill="#FFB900" d="M11 11h10v10H11z" />
    </svg>
  )
}

export function FormularioAlta({ id, textos, compacto = false }: { id?: string; textos: TextosComunes; compacto?: boolean }) {
  const [correo, setCorreo] = useState('')
  const a = textos.alta
  /* compacto: la tarjeta de la columna derecha del hero (Víctor, 17-oct) */
  const boton = compacto ? botonClaro.replace('px-6 py-3 text-base', 'px-5 py-2.5 text-sm') : botonClaro
  const campo = compacto ? 'px-4 py-2.5 text-sm' : 'px-5 py-3 text-base'
  const enviar = compacto ? 'px-5 py-2.5 text-sm' : 'px-6 py-3 text-base'

  function medirRegistro(metodo: string) {
    medirGoogle('signup_start', metodo)
    // Dos propiedades, sin correo ni otros datos personales. Es intención, no alta completada.
    track('signup_intent', { metodo, utm_content: new URLSearchParams(window.location.search).get('utm_content') ?? '' })
  }

  function ir(e: React.MouseEvent<HTMLAnchorElement>, extra: Record<string, string>) {
    e.currentTarget.href = urlLogin(extra)
    if (extra.proveedor) medirRegistro(extra.proveedor)
  }

  function crear(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    medirRegistro('email')
    window.location.href = urlLogin({ registro: '1' }, correo.trim())
  }

  return (
    <div id={id} className={compacto ? 'flex w-full flex-col gap-2.5 rounded-2xl border border-slm-brand-light bg-white p-5 shadow-sm' : 'flex w-full max-w-[420px] flex-col gap-3'}>
      <a href={`${URL_LOGIN}?proveedor=google`} onClick={(e) => ir(e, { proveedor: 'google' })} className={boton}>
        <LogoGoogle />
        {a.google}
      </a>
      <a href={`${URL_LOGIN}?proveedor=microsoft`} onClick={(e) => ir(e, { proveedor: 'microsoft' })} className={boton}>
        <LogoMicrosoft />
        {a.microsoft}
      </a>
      <div className="flex items-center gap-3 font-helvetica-neue text-sm text-slm-gray" aria-hidden="true">
        <span className="h-px flex-1 bg-slm-brand-light" />
        {a.o}
        <span className="h-px flex-1 bg-slm-brand-light" />
      </div>
      <form onSubmit={crear} className={compacto ? 'flex flex-col gap-2.5' : 'flex flex-col gap-3'}>
        <label className="sr-only" htmlFor={`${id ?? 'alta'}-correo`}>{a.correo}</label>
        <input
          id={`${id ?? 'alta'}-correo`}
          type="email"
          required
          autoComplete="email"
          placeholder={a.correo}
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          className={`w-full min-w-0 rounded-full border border-slm-brand-light ${campo} font-helvetica-neue text-slm-dark outline-none focus:border-slm-brand`}
        />
        <button
          type="submit"
          className={`font-helvetica-neue w-full rounded-full bg-slm-dark ${enviar} font-medium text-slm-light hover:opacity-90`}
        >
          {a.crear}
        </button>
      </form>
      <p className={`font-helvetica-neue ${compacto ? 'text-xs' : 'text-sm'} text-slm-gray`}>
        {a.nota}{' '}
        <a href="#planes" className="font-medium text-slm-dark underline underline-offset-2 whitespace-nowrap">
          {a.verPrecios} ↓
        </a>
      </p>
      <p className={`font-helvetica-neue ${compacto ? 'text-xs' : 'text-sm'} text-slm-gray`}>
        {textos.yaTienesCuenta}{' '}
        <a href={URL_LOGIN} onClick={(e) => ir(e, {})} className="font-medium text-slm-dark underline underline-offset-2">
          {a.entrar}
        </a>
      </p>
    </div>
  )
}
