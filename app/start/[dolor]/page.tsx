import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { BotonEmpezar } from '../../../components/apertura/BotonEmpezar'
import { FormularioAlta } from '../../../components/apertura/FormularioAlta'
import { COMUN, PAGINAS, PUBLICADA, URL_GUIA_MCP, URL_REGISTRO, type Dolor } from '../../../content/apertura'

/* ------------------------------------------------------------------ */
/* /start/[dolor] — páginas de destino de la apertura controlada        */
/*                                                                     */
/* Una por dolor: /start/context y /start/memory. Estructura vigente   */
/* (plan v2.8 §11, Víctor 14 y 15-oct): 1 hero (gancho, bajada del      */
/* dolor, eslogan, registro + login) · video 1 cuando exista · 2 cómo   */
/* empieza · 3 pilares · 4 cierre (Free + registro + login). Sin FAQ,   */
/* sin precios, sin cifras y sin proveedores por plan.                  */
/*                                                                     */
/* Solo inglés: no usa next-intl. Sin índice en buscadores: son destino */
/* de campaña, no páginas del sitio.                                    */
/* ------------------------------------------------------------------ */

const ES_PRODUCCION = process.env.VERCEL_ENV === 'production'

export const dynamicParams = false

export function generateStaticParams() {
  return (Object.keys(PAGINAS) as Dolor[]).map((dolor) => ({ dolor }))
}

export async function generateMetadata({ params }: { params: Promise<{ dolor: string }> }): Promise<Metadata> {
  const { dolor } = await params
  const p = PAGINAS[dolor as Dolor]
  if (!p) return {}
  return {
    title: `${p.gancho} — RAGfly`,
    description: p.metaDescripcion,
    robots: { index: false, follow: false },
    alternates: { canonical: `/start/${dolor}` },
    openGraph: { title: p.gancho, description: p.metaDescripcion, url: `https://ragfly.ai/start/${dolor}` },
  }
}

function Etiqueta({ children }: { children: React.ReactNode }) {
  return <span className="rf-anot text-slm-brand">{children}</span>
}

export default async function PaginaDolor({
  params,
  searchParams,
}: {
  params: Promise<{ dolor: string }>
  searchParams: Promise<{ h?: string | string[] }>
}) {
  const { dolor } = await params
  const p = PAGINAS[dolor as Dolor]
  if (!p) notFound()
  if (!PUBLICADA && ES_PRODUCCION) notFound()

  // Título = gancho del aviso por el que llegó (?h=c1); por defecto, el vigente.
  const { h } = await searchParams
  const clave = (Array.isArray(h) ? h[0] : h)?.toLowerCase() ?? ''
  const gancho = p.ganchosAlternos[clave] ?? p.gancho

  const titulo2 = 'text-slm-dark text-2xl md:text-[30px] font-helvetica-neue font-medium leading-tight tracking-[-0.02em] text-balance'
  const bloque = 'px-6 md:px-12 py-12 md:py-14 border-t border-slm-brand-light'
  const texto = 'font-helvetica-neue text-base md:text-lg leading-relaxed text-slm-gray'

  return (
    <div lang="en" className="min-h-screen bg-white text-slm-dark">
      <header className="px-6 md:px-12 py-6">
        <div className="mx-auto flex max-w-[980px] items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5" aria-label="RAGfly">
            <Image src="/ala_5c.png" alt="" width={2348} height={553} className="h-7 w-auto" />
            <span className="font-manrope text-2xl font-semibold tracking-tight">RAGfly</span>
          </Link>
          <BotonEmpezar
            destino={URL_REGISTRO}
            className="rf-boton hidden sm:inline-block rounded-full bg-slm-dark px-6 py-2.5 text-base font-medium text-slm-light hover:opacity-90"
          >
            Start free
          </BotonEmpezar>
        </div>
      </header>

      <main>
        {/* 1 · Hero: gancho del aviso, bajada del dolor, eslogan y registro */}
        <section className="px-6 md:px-12 pt-8 pb-12 md:pt-14">
          <div className="mx-auto flex max-w-[760px] flex-col gap-6">
            <Etiqueta>RAG service for agents</Etiqueta>
            <h1 className="font-helvetica-neue text-4xl md:text-6xl font-medium leading-[1.06] tracking-[-0.035em] text-balance">
              {gancho}
            </h1>
            <p className="font-helvetica-neue text-lg md:text-xl leading-relaxed">{p.bajada}</p>
            <p className="font-helvetica-neue text-lg md:text-xl font-medium text-slm-brand-dark">{COMUN.eslogan}</p>
            <FormularioAlta id="signup" />
          </div>
        </section>

        {/* Video 1 del dolor: solo cuando está publicado */}
        {p.video.src && (
          <section className="px-6 md:px-12 pb-12">
            <div className="mx-auto max-w-[980px]">
              <video
                controls
                playsInline
                preload="metadata"
                poster={p.video.poster}
                className="aspect-video w-full max-w-full rounded-md bg-slm-cabina"
              >
                <source src={p.video.src} />
              </video>
            </div>
          </section>
        )}

        {/* 2 · Cómo empieza */}
        <section id="start" className={bloque}>
          <div className="mx-auto flex max-w-[760px] flex-col gap-5">
            <Etiqueta>How it starts</Etiqueta>
            <h2 className={titulo2}>{COMUN.pasosTitulo}</h2>
            <ol className="flex flex-col gap-5">
              {COMUN.pasos.map((paso, i) => (
                <li key={paso.titulo} className="grid grid-cols-[40px_1fr] items-baseline gap-3">
                  <span className="grid h-8 w-8 place-items-center rounded-full border border-slm-brand-light font-[family-name:var(--font-dato)] text-sm text-slm-brand">
                    {i + 1}
                  </span>
                  <span className="min-w-0 flex flex-col gap-1">
                    <span className="font-helvetica-neue text-base md:text-lg font-medium">{paso.titulo}</span>
                    <span className="font-helvetica-neue text-base text-slm-gray">{paso.detalle}</span>
                  </span>
                </li>
              ))}
            </ol>
            <p className="font-helvetica-neue text-base md:text-lg">{COMUN.despuesPasos}</p>
          </div>
        </section>

        {/* 3 · Pilares */}
        <section className={`${bloque} bg-slm-light`}>
          <div className="mx-auto grid max-w-[760px] gap-x-10 gap-y-8 sm:grid-cols-2">
            {COMUN.pilares.map((pilar) => (
              <div key={pilar.nombre} className="flex min-w-0 flex-col gap-2">
                <h2 className="font-helvetica-neue text-xl md:text-2xl font-medium tracking-[-0.01em]">{pilar.nombre}</h2>
                <p className={texto}>{pilar.texto}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 4 · Cierre */}
        <section className={bloque}>
          <div className="mx-auto flex max-w-[760px] flex-col gap-6">
            <h2 className={titulo2}>{COMUN.cierre}</h2>
            <FormularioAlta id="signup-cierre" />
          </div>
        </section>
      </main>

      <footer className="border-t border-slm-brand-light px-6 md:px-12 py-8 font-helvetica-neue text-sm text-slm-gray">
        <div className="mx-auto flex max-w-[980px] flex-wrap justify-between gap-3">
          <span>© {new Date().getFullYear()} RAGfly</span>
          <span className="flex gap-4">
            <Link href={URL_GUIA_MCP} className="hover:text-slm-dark">MCP guide</Link>
            <Link href="/legal/privacy" className="hover:text-slm-dark">Privacy</Link>
            <Link href="/legal/terms" className="hover:text-slm-dark">Terms</Link>
          </span>
        </div>
      </footer>
    </div>
  )
}
