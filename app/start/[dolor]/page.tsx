import type { Metadata } from 'next'
import { cargarMensajeMarketing } from '../../../lib/mensajes-marketing'
import { TituloMarketing } from '../../../components/apertura/TituloMarketing'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getLocale } from 'next-intl/server'
import { BotonEmpezar } from '../../../components/apertura/BotonEmpezar'
import { FormularioAlta } from '../../../components/apertura/FormularioAlta'
import { VideoYouTube } from '../../../components/apertura/VideoYouTube'
import { SelectorIdioma } from '../../../components/SelectorIdioma'
import { COMUN, PAGINAS, PUBLICADA, URL_GUIA_MCP, URL_REGISTRO, VIDEO_YOUTUBE_ID, type Dolor } from '../../../content/apertura'
import { locales, type Locale } from '../../../i18n/config'

/* ------------------------------------------------------------------ */
/* /start/[dolor] — páginas de destino de la apertura controlada        */
/*                                                                     */
/* Una por dolor: /start/context y /start/memory. Estructura vigente   */
/* (plan v2.8 §11, Víctor 14 y 15-oct): 1 hero (titular, bajada del     */
/* dolor, eslogan, registro + login) · video del Quickstart · 2 cómo   */
/* empieza · 3 pilares · 4 cierre (Free + registro + login) · 5 FAQ,  */
/* sin precios, sin cifras y sin proveedores por plan.                  */
/*                                                                     */
/* Multilingüe (Víctor, 15-oct): el idioma sale de getLocale(), la     */
/* misma cadena del resto del sitio, y se cambia con SelectorIdioma.    */
/* Sin índice en buscadores: son destino de campaña.                    */
/* ------------------------------------------------------------------ */

const ES_PRODUCCION = process.env.VERCEL_ENV === 'production'

export const dynamicParams = false

export function generateStaticParams() {
  return [...Object.keys(PAGINAS), 'marketing'].map((dolor) => ({ dolor }))
}

async function idioma(): Promise<Locale> {
  const l = (await getLocale()) as Locale
  return locales.includes(l) ? l : 'en'
}

export async function generateMetadata({ params }: { params: Promise<{ dolor: string }> }): Promise<Metadata> {
  const { dolor } = await params
  const p = PAGINAS[(dolor === 'marketing' ? 'memory' : dolor) as Dolor]
  if (!p) return {}
  const t = p.textos[await idioma()]
  return {
    title: `${t.titulo} — RAGfly`,
    description: t.metaDescripcion,
    robots: { index: false, follow: false },
    alternates: { canonical: `/start/${dolor}` },
    openGraph: { title: t.titulo, description: t.metaDescripcion, url: `https://ragfly.ai/start/${dolor}` },
  }
}

function Etiqueta({ children }: { children: React.ReactNode }) {
  return <span className="rf-anot text-slm-brand">{children}</span>
}

export default async function PaginaDolor({ params, searchParams }: { params: Promise<{ dolor: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { dolor } = await params
  const p = PAGINAS[(dolor === 'marketing' ? 'memory' : dolor) as Dolor]
  if (!p) notFound()
  if (!PUBLICADA && ES_PRODUCCION) notFound()

  const query = await searchParams
  const mensaje = await cargarMensajeMarketing(query.utm_content)
  const locale = mensaje ? mensaje.idioma : await idioma()
  const base = p.textos[locale]
  const genericos = {
    en: ['Your documents. Your agents. Your rules.', 'Connect your agents to your documents with access by workspace, area, role and agent.'],
    es: ['Tus documentos. Tus agentes. Tus reglas.', 'Conecta tus agentes a tus documentos con acceso por workspace, área, rol y agente.'],
    pt: ['Seus documentos. Seus agentes. Suas regras.', 'Conecte seus agentes aos seus documentos com acesso por workspace, área, função e agente.'],
    fr: ['Vos documents. Vos agents. Vos règles.', 'Connectez vos agents à vos documents avec un accès par workspace, domaine, rôle et agent.'],
    de: ['Deine Dokumente. Deine Agenten. Deine Regeln.', 'Verbinde deine Agenten mit deinen Dokumenten, mit Zugriff nach Workspace, Bereich, Rolle und Agent.'],
  }
  const t = dolor === 'marketing' ? {...base, titulo: genericos[locale][0], bajada: genericos[locale][1]} : base
  const c = COMUN[locale]


  const titulo2 = 'text-slm-dark text-2xl md:text-[30px] font-helvetica-neue font-medium leading-tight tracking-[-0.02em] text-balance'
  const bloque = 'px-6 md:px-12 py-12 md:py-14 border-t border-slm-brand-light'
  const texto = 'font-helvetica-neue text-base md:text-lg leading-relaxed text-slm-gray'

  return (
    <div lang={locale} className="min-h-screen bg-white text-slm-dark">
      <header className="px-6 md:px-12 py-6">
        <div className="mx-auto flex max-w-[980px] items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5" aria-label="RAGfly">
            <Image src="/ala_5c.png" alt="" width={2348} height={553} className="h-7 w-auto" />
            <span className="font-manrope text-2xl font-semibold tracking-tight">RAGfly</span>
          </Link>
          <div className="flex items-center gap-3">
            <SelectorIdioma />
            <BotonEmpezar
              destino={URL_REGISTRO}
              className="rf-boton hidden sm:inline-block rounded-full bg-slm-dark px-6 py-2.5 text-base font-medium text-slm-light hover:opacity-90"
            >
              {c.empezar}
            </BotonEmpezar>
          </div>
        </div>
      </header>

      <main>
        {/* 1 · Hero: titular fijo de la página, bajada, eslogan y registro */}
        <section className="px-6 md:px-12 pt-8 pb-12 md:pt-14">
          <div className="mx-auto flex max-w-[760px] flex-col gap-6">
            <Etiqueta>{c.etiqueta}</Etiqueta>
            <h1 className="font-helvetica-neue text-4xl md:text-6xl font-medium leading-[1.06] tracking-[-0.035em] text-balance">
              {mensaje ? <TituloMarketing fragmentos={mensaje.titulo} /> : t.titulo}
            </h1>
            <p className="font-helvetica-neue text-lg md:text-xl leading-relaxed">{mensaje?.cuerpo ?? t.bajada}</p>
            <p className="font-helvetica-neue text-lg md:text-xl font-medium text-slm-brand-dark">{c.eslogan}</p>
            <FormularioAlta id="signup" textos={c} />
          </div>
        </section>

        {/* 2 · Cómo empieza */}
        <section id="start" className={bloque}>
          <div className="mx-auto flex max-w-[760px] flex-col gap-5">
            <Etiqueta>{c.pasosEtiqueta}</Etiqueta>
            <h2 className={titulo2}>{c.pasosTitulo}</h2>
            <ol className="flex flex-col gap-5">
              {c.pasos.map((paso, i) => (
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
            <p className="font-helvetica-neue text-base md:text-lg">{c.despuesPasos}</p>
          </div>
        </section>

        {/* Video del Quickstart: después de «Cómo empieza» (Víctor, 15-oct); carga al clic */}
        <section className="px-6 md:px-12 pb-12 md:pb-14">
          <div className="mx-auto max-w-[760px]">
            <VideoYouTube id={VIDEO_YOUTUBE_ID} etiqueta={c.reproducirVideo} />
          </div>
        </section>

        {/* 3 · Pilares */}
        <section className={`${bloque} bg-slm-light`}>
          <div className="mx-auto mb-10 flex max-w-[760px] flex-col gap-3">
            <h2 className={titulo2}>{c.queEsRag.titulo}</h2>
            <p className="font-helvetica-neue text-base md:text-lg leading-relaxed">{c.queEsRag.texto}</p>
          </div>
          <div className="mx-auto grid max-w-[760px] gap-x-10 gap-y-8 sm:grid-cols-2">
            {c.pilares.map((pilar) => (
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
            <h2 className={titulo2}>{c.cierre}</h2>
            <FormularioAlta id="signup-cierre" textos={c} />
          </div>
        </section>

        {/* 5 · Preguntas frecuentes: cerradas, la persona abre la que quiera */}
        <section className={bloque}>
          <div className="mx-auto flex max-w-[760px] flex-col gap-5">
            <Etiqueta>FAQ</Etiqueta>
            {/* Mismo tamaño que los títulos de los pilares (Víctor, 15-oct). */}
            <h2 className="font-helvetica-neue text-xl md:text-2xl font-medium tracking-[-0.01em]">{c.faq.titulo}</h2>
            <div className="flex flex-col border-t border-slm-brand-light">
              {c.faq.preguntas.map((p) => (
                <details key={p.q} className="group border-b border-slm-brand-light">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 font-helvetica-neue text-base md:text-lg [&::-webkit-details-marker]:hidden">
                    <span className="min-w-0">{p.q}</span>
                    <span aria-hidden="true" className="shrink-0 text-xl leading-none text-slm-brand transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="pb-5 font-helvetica-neue text-base md:text-lg leading-relaxed text-slm-gray">{p.a}</p>
                  {p.tabla && (
                    <div className="mb-6 overflow-x-auto">
                      <table className="w-full table-fixed border-collapse font-helvetica-neue text-sm md:text-base">
                        <thead>
                          <tr>
                            {p.tabla.columnas.map((col, i) => (
                              <th
                                key={i}
                                scope="col"
                                className={`border-b border-slm-brand-light px-2 md:px-3 py-2 text-left font-medium ${i === 2 ? 'text-slm-brand-dark' : 'text-slm-dark'}`}
                              >
                                {col}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {p.tabla.filas.map((fila) => (
                            <tr key={fila[0]}>
                              {fila.map((celda, i) =>
                                i === 0 ? (
                                  <th key={i} scope="row" className="border-b border-slm-brand-light px-2 md:px-3 py-2 text-left align-top font-medium text-slm-dark">
                                    {celda}
                                  </th>
                                ) : (
                                  <td key={i} className={`border-b border-slm-brand-light px-2 md:px-3 py-2 align-top break-words ${i === 2 ? 'text-slm-dark' : 'text-slm-gray'}`}>
                                    {celda}
                                  </td>
                                ),
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slm-brand-light px-6 md:px-12 py-8 font-helvetica-neue text-sm text-slm-gray">
        <div className="mx-auto flex max-w-[980px] flex-wrap justify-between gap-3">
          <span>© {new Date().getFullYear()} RAGfly</span>
          <span className="flex gap-4">
            <Link href={URL_GUIA_MCP} className="hover:text-slm-dark">{c.pie.guiaMcp}</Link>
            <Link href="/legal/privacy" className="hover:text-slm-dark">{c.pie.privacidad}</Link>
            <Link href="/legal/terms" className="hover:text-slm-dark">{c.pie.terminos}</Link>
          </span>
        </div>
      </footer>
    </div>
  )
}
