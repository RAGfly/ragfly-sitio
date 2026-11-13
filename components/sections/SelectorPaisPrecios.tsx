'use client'

import { useRouter } from 'next/navigation'
import { useMemo } from 'react'

type Pais = { codigo_pais: string; nombre_pais: string }

export function SelectorPaisPrecios({ pais, paises, locale, etiqueta, internacional }: {
  pais: string | null
  paises: Pais[]
  locale: string
  etiqueta: string
  internacional: string
}) {
  const router = useRouter()
  const opciones = useMemo(() => {
    const nombres = new Intl.DisplayNames([locale], { type: 'region' })
    return paises.map(p => ({ codigo: p.codigo_pais, nombre: nombres.of(p.codigo_pais) || p.nombre_pais }))
      .sort((a, b) => a.nombre.localeCompare(b.nombre, locale))
  }, [paises, locale])
  if (opciones.length === 0) return null

  function cambiarPais(valor: string) {
    if (valor !== 'GLOBAL' && !opciones.some(p => p.codigo === valor)) return
    const secure = window.location.protocol === 'https:' ? '; Secure' : ''
    document.cookie = `RAGFLY_PRICE_COUNTRY=${valor}; Path=/; Max-Age=31536000; SameSite=Lax${secure}`
    router.refresh()
  }

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm text-slm-gray font-helvetica-neue">
      <label htmlFor="pais-precios">{etiqueta}</label>
      <select id="pais-precios" value={pais ?? 'GLOBAL'} onChange={e => cambiarPais(e.target.value)}
        className="rounded-lg border border-slm-dark/20 bg-white px-3 py-2 text-slm-dark focus:outline-none focus:ring-2 focus:ring-slm-brand">
        <option value="GLOBAL">{internacional}</option>
        {opciones.map(p => <option key={p.codigo} value={p.codigo}>{p.nombre}</option>)}
      </select>
    </div>
  )
}
