import type { Metadata } from 'next'
import { headers } from 'next/headers'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { AREAS, AVISO_LEGAL, getArea } from '../../../../content/regfly-areas'
import { Cabecera, EstadoChip, Pie } from '../../../../components/regfly/Marco'
import { ListaEspera } from '../../../../components/regfly/ListaEspera'
import { esHostRegfly, URL_REGISTRO_REGFLY } from '../../../../lib/host'
import '../../regfly.css'

type Props = { params: Promise<{ area: string }> }

export const dynamicParams = false
export const generateStaticParams = () => AREAS.map((a) => ({ area: a.slug }))

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const area = getArea((await params).area)
  if (!area) return {}
  return {
    title: `${area.nombre}: normativa vigente para tu IA | REGfly`,
    description: `${area.resumen} Con cita a la norma y al artículo. REGfly, by RAGfly.`,
    alternates: { canonical: `/cl/${area.slug}` },
  }
}

// Las rutas internas /regfly/* solo existen para el host de REGfly: en ragfly.ai responden 404.
export default async function PaginaArea({ params }: Props) {
  if (!esHostRegfly((await headers()).get('host'))) notFound()
  const area = getArea((await params).area)
  if (!area) notFound()
  return (
    <main className="regfly flex flex-col min-h-full">
      <Cabecera base="/cl" />
      <div className="px-6 md:px-12 py-16 md:py-24">
        <div className="max-w-[900px] mx-auto">
          <nav aria-label="Ruta" className="font-[family-name:var(--font-dato)] text-xs md:text-sm tracking-[0.04em] text-slm-gray mb-6">
            <Link href="/cl" className="hover:text-slm-brand-dark">REGfly Chile</Link> /{' '}
            <Link href="/cl#cobertura" className="hover:text-slm-brand-dark">Cobertura</Link>
          </nav>
          <div className="flex flex-wrap items-center gap-4">
            <h1 className="font-helvetica-neue font-medium text-4xl md:text-6xl tracking-[-0.03em] leading-[1.06] text-balance text-slm-dark">{area.nombre}</h1>
            <EstadoChip estado={area.estado} />
          </div>
          <p className="mt-6 text-lg md:text-xl text-slm-dark/85 leading-relaxed max-w-2xl">{area.resumen}</p>

          <h2 className="mt-14 mb-5 font-helvetica-neue font-medium text-2xl tracking-[-0.02em] text-slm-dark">Qué le puedes preguntar a tu IA</h2>
          <ul className="flex flex-col gap-3">
            {area.preguntas.map((p) => (
              <li key={p} className="border-l-2 border-slm-brand pl-5 text-lg text-slm-dark">{p}</li>
            ))}
          </ul>

          <h2 className="mt-14 mb-5 font-helvetica-neue font-medium text-2xl tracking-[-0.02em] text-slm-dark">Reguladores</h2>
          <ul className="grid gap-3">
            {area.supervisores.map((s) => (
              <li key={s.slug} className="rounded-2xl border border-slm-dark/10 bg-white p-5 flex items-start justify-between gap-4">
                <div>
                  <Link href={`/cl/${area.slug}/${s.slug}`} className="font-helvetica-neue font-semibold text-lg text-slm-dark hover:text-slm-brand-dark">{s.nombre}</Link>
                  <p className="mt-1 text-base text-slm-gray leading-relaxed">{s.trae}</p>
                </div>
                <EstadoChip estado={s.estado} />
              </li>
            ))}
          </ul>

          {area.estado !== 'disponible' && (
            <div className="mt-14 rounded-2xl bg-slm-light border border-slm-brand-light p-6 max-w-xl">
              <h2 className="font-helvetica-neue font-semibold text-lg text-slm-dark mb-3">Avísame cuando abra esta área</h2>
              <ListaEspera fuente={`regfly:cl:${area.slug}`} />
            </div>
          )}
          <div className="mt-10 flex flex-wrap gap-3">
            <a href={URL_REGISTRO_REGFLY} className="rf-boton bg-slm-dark text-white px-7 py-3 rounded-full font-medium text-base hover:opacity-90 transition-opacity">Crear cuenta gratis</a>
            <Link href="/cl#conecta" className="rf-boton border border-slm-dark text-slm-dark px-7 py-3 rounded-full font-medium text-base hover:bg-white transition-colors">Conecta tu IA</Link>
          </div>
          <p className="mt-10 text-sm text-slm-gray">{AVISO_LEGAL}</p>
        </div>
      </div>
      <Pie />
    </main>
  )
}
