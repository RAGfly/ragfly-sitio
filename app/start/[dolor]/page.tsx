import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { BotonEmpezar } from '../../../components/apertura/BotonEmpezar'
import { COMUN, PAGINAS, PUBLICADA, URL_APP, URL_GUIA_MCP, type Dolor } from '../../../content/apertura'

/* ------------------------------------------------------------------ */
/* /start/[dolor] — páginas de destino de la apertura controlada        */
/*                                                                     */
/* Una por dolor (plan v2.5 §5.1): /start/context y /start/memory.      */
/* Versión B (Víctor, 14-oct): 1 gancho + eslogan literal · 2 video 1 · */
/* 3 bajada · 4 cómo empieza · 5 con qué funciona · 6 workspaces ·      */
/* 7 privado · 8 cierre. Sin FAQ, sin precios y sin cifras.             */
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

function Etiquetas({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((s) => (
        <span key={s} className="rounded border border-slm-brand-light px-3 py-1.5 font-[family-name:var(--font-dato)] text-xs tracking-[0.04em]">
          {s}
        </span>
      ))}
    </div>
  )
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
            destino={URL_APP}
            className="rf-boton hidden sm:inline-block rounded-full bg-slm-dark px-6 py-2.5 text-base font-medium text-slm-light hover:opacity-90"
          >
            Start free
          </BotonEmpezar>
        </div>
      </header>

      <main>
        {/* 1 · Gancho del aviso + eslogan literal */}
        <section className="px-6 md:px-12 pt-8 pb-8 md:pt-14">
          <div className="mx-auto flex max-w-[760px] flex-col gap-5">
            <Etiqueta>RAG service for agents</Etiqueta>
            <h1 className="font-helvetica-neue text-4xl md:text-6xl font-medium leading-[1.06] tracking-[-0.035em] text-balance">
              {gancho}
            </h1>
            <div className="flex flex-col gap-1">
              <p className="font-helvetica-neue text-lg md:text-xl font-medium">{COMUN.eslogan}</p>
              <p className="font-helvetica-neue text-lg md:text-xl text-slm-brand-dark">{COMUN.bajadaProducto}</p>
            </div>
          </div>
        </section>

        {/* 2 · Video 1 del dolor */}
        <section className="px-6 md:px-12 pb-6">
          <div className="mx-auto max-w-[980px]">
            {p.video.src ? (
              <video
                controls
                playsInline
                preload="metadata"
                poster={p.video.poster}
                className="aspect-video w-full max-w-full rounded-md bg-slm-cabina"
              >
                <source src={p.video.src} />
              </video>
            ) : (
              <div
                role="img"
                aria-label="Product video"
                className="grid aspect-video w-full max-w-full place-items-center rounded-md bg-slm-cabina px-6 text-center text-slm-light"
              >
                <div className="flex max-w-[30ch] flex-col items-center gap-4">
                  <span className="grid h-16 w-16 place-items-center rounded-full border border-[#55B2E4]">
                    <svg width="20" height="22" viewBox="0 0 20 22" aria-hidden="true"><path d="M2 1 L19 11 L2 21 Z" fill="#55B2E4" /></svg>
                  </span>
                  <p className="font-helvetica-neue text-lg md:text-2xl font-medium leading-snug text-balance">{p.video.apertura}</p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* 3 · Bajada del dolor */}
        <section className="px-6 md:px-12 pb-12">
          <p className="mx-auto max-w-[760px] font-helvetica-neue text-lg md:text-xl leading-relaxed">{p.bajada}</p>
        </section>

        {/* 4 · Cómo empieza */}
        <section id="start" className={bloque}>
          <div className="mx-auto flex max-w-[760px] flex-col gap-5">
            <Etiqueta>How it starts</Etiqueta>
            <h2 className={titulo2}>{COMUN.pasosTitulo}</h2>
            <ol className="flex flex-col gap-4">
              {COMUN.pasos.map((paso, i) => (
                <li key={paso} className="grid grid-cols-[40px_1fr] items-baseline gap-3">
                  <span className="grid h-8 w-8 place-items-center rounded-full border border-slm-brand-light font-[family-name:var(--font-dato)] text-sm text-slm-brand">
                    {i + 1}
                  </span>
                  <span className="min-w-0 font-helvetica-neue text-base md:text-lg">{paso}</span>
                </li>
              ))}
            </ol>
            <p className="font-helvetica-neue text-base md:text-lg">{COMUN.despuesPasos}</p>
            <p className="font-helvetica-neue text-base text-slm-gray">{COMUN.recomendado}</p>
          </div>
        </section>

        {/* 5 · Con qué funciona */}
        <section className={bloque}>
          <div className="mx-auto flex max-w-[760px] flex-col gap-4">
            <Etiqueta>Works with</Etiqueta>
            <h2 className={titulo2}>{COMUN.conQueFunciona}</h2>
            <p className={texto}>{COMUN.interfaces}</p>
            <Etiquetas items={['MCP', 'REST', 'SDK', 'CLI']} />
          </div>
        </section>

        {/* 6 · Workspaces */}
        <section className={bloque}>
          <div className="mx-auto flex max-w-[760px] flex-col gap-4">
            <Etiqueta>Workspaces</Etiqueta>
            <h2 className={titulo2}>{COMUN.workspaceTitulo}</h2>
            <p className={texto}>{COMUN.workspace}</p>
            <p className="font-helvetica-neue text-lg md:text-xl font-medium leading-snug">{COMUN.granular}</p>
            <Etiquetas items={['Area', 'Role', 'Agent']} />
          </div>
        </section>

        {/* 7 · Privado (fondo suave) */}
        <section className={`${bloque} bg-slm-light`}>
          <div className="mx-auto flex max-w-[760px] flex-col gap-4">
            <Etiqueta>Private</Etiqueta>
            <h2 className="max-w-[26ch] font-helvetica-neue text-2xl md:text-4xl font-medium leading-tight tracking-[-0.02em] text-balance">
              {COMUN.privadoTitulo}
            </h2>
            <p className="font-helvetica-neue text-base md:text-lg leading-relaxed">{COMUN.privado}</p>
          </div>
        </section>

        {/* 8 · Cierre */}
        <section className={bloque}>
          <div className="mx-auto max-w-[760px]">
            <BotonEmpezar
              destino={URL_APP}
              className="rf-boton inline-block rounded-full bg-slm-dark px-7 py-3.5 text-base font-medium text-slm-light hover:opacity-90"
            >
              Start free
            </BotonEmpezar>
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
