import Image from 'next/image'
import Link from 'next/link'
import { MARCA, NAV } from '../../content/regfly'
import { ETIQUETA_ESTADO, type Estado } from '../../content/regfly-areas'

export const RAGFLY = 'https://www.ragfly.ai'

const ESTADO_ESTILO: Record<Estado, string> = {
  disponible: 'bg-slm-brand text-white',
  evaluacion: 'bg-slm-brand-light text-slm-brand-dark',
  proximamente: 'bg-slm-dark/5 text-slm-gray',
}

export function EstadoChip({ estado }: { estado: Estado }) {
  return (
    <span className={`rounded-full px-4 py-1.5 text-sm font-medium whitespace-nowrap ${ESTADO_ESTILO[estado]}`}>
      {ETIQUETA_ESTADO[estado]}
    </span>
  )
}

/** `base` = '' en la portada (anclas) y '/cl' en las páginas interiores (vuelven a la portada). */
export function Cabecera({ base = '' }: { base?: string }) {
  return (
    <header className="sticky top-0 z-20 bg-white/85 backdrop-blur-sm border-b border-slm-dark/5">
      <div className="max-w-[1200px] mx-auto flex items-center justify-between px-6 md:px-12 py-4">
        <Link href={base || '#'} className="flex items-center gap-2.5 shrink-0 whitespace-nowrap" aria-label={`${MARCA.nombre}, ${MARCA.porMadre}`}>
          <Image src="/ala_5c.png" alt="" width={2348} height={553} className="h-6 w-auto" />
          <span className="font-manrope font-semibold text-2xl text-slm-dark tracking-tight">{MARCA.nombre}</span>
          <span className="hidden md:inline text-xs text-slm-gray mt-1">{MARCA.porMadre}</span>
        </Link>
        <nav className="hidden xl:flex items-center gap-7">
          {NAV.map((it) => (
            <a key={it.l} href={`${base}${it.h}`} className="text-base text-slm-dark hover:opacity-70 transition-opacity">
              {it.l}
            </a>
          ))}
        </nav>
        <a
          href={`${base}#acceso`}
          className="rf-boton shrink-0 bg-slm-dark text-white px-5 py-2.5 rounded-full font-medium text-sm md:text-base whitespace-nowrap hover:opacity-90 transition-opacity"
        >
          <span className="sm:hidden">Preguntar</span>
          <span className="hidden sm:inline">Hazle una pregunta</span>
        </a>
      </div>
    </header>
  )
}

export function Pie() {
  const anio = new Date().getFullYear()
  return (
    <footer className="px-6 md:px-12 py-14 bg-slm-dark text-white/70">
      <div className="max-w-[1100px] mx-auto flex flex-col gap-6">
        <div className="flex items-center gap-2.5 font-manrope font-semibold text-2xl text-white">
          <Image src="/ala_1.5c.png" alt="" width={2348} height={553} className="h-6 w-auto" />
          {MARCA.nombre}
          <span className="text-sm font-normal text-white/60 mt-1">{MARCA.porMadre}</span>
        </div>
        <p className="text-sm">{MARCA.aviso}</p>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <a href={`${RAGFLY}/legal/terms`} className="hover:text-white">Términos</a>
          <a href={`${RAGFLY}/legal/privacy`} className="hover:text-white">Privacidad</a>
          <a href={`${RAGFLY}/legal/refund`} className="hover:text-white">Reembolsos</a>
          <a href={RAGFLY} className="hover:text-white">RAGfly</a>
        </div>
        <p className="text-xs text-white/50">© {anio} {MARCA.nombre}, {MARCA.porMadre}.</p>
      </div>
    </footer>
  )
}
