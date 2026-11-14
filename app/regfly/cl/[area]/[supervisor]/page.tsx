import type { Metadata } from 'next'
import { headers } from 'next/headers'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { AREAS, AVISO_LEGAL, getArea, getSupervisor } from '../../../../../content/regfly-areas'
import { Cabecera, EstadoChip, Pie } from '../../../../../components/regfly/Marco'
import { ListaEspera } from '../../../../../components/regfly/ListaEspera'
import { esHostRegfly } from '../../../../../lib/host'
import '../../../regfly.css'

type Props = { params: Promise<{ area: string; supervisor: string }> }

export const dynamicParams = false
export const generateStaticParams = () =>
  AREAS.flatMap((a) => a.supervisores.map((s) => ({ area: a.slug, supervisor: s.slug })))

async function cargar(params: Props['params']) {
  const { area: areaSlug, supervisor: supSlug } = await params
  const area = getArea(areaSlug)
  const sup = area ? getSupervisor(area, supSlug) : undefined
  return area && sup ? { area, sup } : null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const datos = await cargar(params)
  if (!datos) return {}
  const { area, sup } = datos
  return {
    title: `${sup.sigla ?? sup.nombre}: normativa vigente para tu IA | REGfly`,
    description: `${sup.trae} Con cita a la norma y al artículo. REGfly, by RAGfly.`,
    alternates: { canonical: `/cl/${area.slug}/${sup.slug}` },
  }
}

// Las rutas internas /regfly/* solo existen para el host de REGfly: en ragfly.ai responden 404.
export default async function PaginaSupervisor({ params }: Props) {
  if (!esHostRegfly((await headers()).get('host'))) notFound()
  const datos = await cargar(params)
  if (!datos) notFound()
  const { area, sup } = datos
  return (
    <main className="regfly flex flex-col min-h-full">
      <Cabecera base="/cl" />
      <div className="px-6 md:px-12 py-16 md:py-24">
        <div className="max-w-[900px] mx-auto">
          <nav aria-label="Ruta" className="font-[family-name:var(--font-dato)] text-xs md:text-sm tracking-[0.04em] text-slm-gray mb-6">
            <Link href="/cl" className="hover:text-slm-brand-dark">REGfly Chile</Link> /{' '}
            <Link href={`/cl/${area.slug}`} className="hover:text-slm-brand-dark">{area.nombre}</Link>
          </nav>
          <div className="flex flex-wrap items-center gap-4">
            <h1 className="font-helvetica-neue font-medium text-4xl md:text-6xl tracking-[-0.03em] leading-[1.06] text-balance text-slm-dark">{sup.nombre}</h1>
            <EstadoChip estado={sup.estado} />
          </div>
          <p className="mt-6 text-lg md:text-xl text-slm-dark/85 leading-relaxed max-w-2xl">{sup.trae}</p>

          <h2 className="mt-14 mb-5 font-helvetica-neue font-medium text-2xl tracking-[-0.02em] text-slm-dark">Cómo responde</h2>
          <ul className="flex flex-col gap-3 text-lg text-slm-dark">
            <li className="border-l-2 border-slm-brand pl-5">Cita la norma y el artículo.</li>
            <li className="border-l-2 border-slm-brand pl-5">Si hay conflicto, cita primero la norma superior: la ley antes que la instrucción.</li>
            <li className="border-l-2 border-slm-brand pl-5">Marca lo derogado y guarda la fecha de vigencia y de término.</li>
            <li className="border-l-2 border-slm-brand pl-5">Si no está respaldado, no responde.</li>
          </ul>

          {sup.segundaFase && (
            <p className="mt-8 rounded-2xl bg-slm-light border border-slm-brand-light p-5 max-w-xl text-slm-dark">
              Esta fuente forma parte de la segunda fase: los casos concretos, de la ley al dictamen. La primera fase cubre la norma y las instrucciones generales de cada supervisor.
            </p>
          )}

          {sup.estado !== 'disponible' && (
            <div className="mt-12 rounded-2xl bg-slm-light border border-slm-brand-light p-6 max-w-xl">
              <h2 className="font-helvetica-neue font-semibold text-lg text-slm-dark mb-3">Avísame cuando abra {sup.sigla ?? sup.nombre}</h2>
              <ListaEspera fuente={`regfly:cl:${area.slug}:${sup.slug}`} />
            </div>
          )}
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/cl#acceso" className="rf-boton bg-slm-dark text-white px-7 py-3 rounded-full font-medium text-base hover:opacity-90 transition-opacity">Hazle una pregunta</Link>
            <Link href={`/cl/${area.slug}`} className="rf-boton border border-slm-dark text-slm-dark px-7 py-3 rounded-full font-medium text-base hover:bg-white transition-colors">Ver {area.nombre}</Link>
          </div>
          <p className="mt-10 text-sm text-slm-gray">{AVISO_LEGAL}</p>
        </div>
      </div>
      <Pie />
    </main>
  )
}
