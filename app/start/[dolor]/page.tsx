import type { Metadata } from 'next'
import { cargarMensajeMarketing } from '../../../lib/mensajes-marketing'
import { TituloMarketing } from '../../../components/apertura/TituloMarketing'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getLocale } from 'next-intl/server'
import { FormularioAlta } from '../../../components/apertura/FormularioAlta'
import { PricingSection } from '../../../components/sections/PricingSection'
import { SelectorIdioma } from '../../../components/SelectorIdioma'
import { COMUN, PAGINAS, PUBLICADA, URL_GUIA_MCP, type Dolor } from '../../../content/apertura'
import { PRE_REGISTRATION } from '../../../content/preregistro'
import { locales, type Locale } from '../../../i18n/config'

/** Landing de campaña: gancho y dos párrafos del catálogo, captura por correo y
 * propuesta del producto. El acceso se confirma después desde el computador.
 * Sin login, tutorial ni video. Los mensajes siguen el idioma del visitante.
 */

const ES_PRODUCCION = process.env.VERCEL_ENV === 'production'

export const dynamicParams = false

export function generateStaticParams() {
  return [...Object.keys(PAGINAS), 'marketing'].map((dolor) => ({ dolor }))
}

const GENERICOS: Record<Locale, [string, string]> = {
    en: ['Make your documents available to your agents.', 'RAGfly is a RAG service. You connect your documents once, and the agents you already use query them over MCP, with the source and with access by workspace, area, role and agent.'],
    es: ['Disponibiliza tus documentos a tus agentes.', 'RAGfly es un servicio de RAG. Conectas tus documentos una vez y los agentes que ya usas los consultan por MCP, con la fuente y con acceso por workspace, área, rol y agente.'],
    pt: ['Disponibilize seus documentos para seus agentes.', 'O RAGfly é um serviço de RAG. Você conecta seus documentos uma vez e os agentes que você já usa os consultam por MCP, com a fonte e com acesso por workspace, área, papel e agente.'],
    fr: ['Mettez vos documents à la disposition de vos agents.', 'RAGfly est un service de RAG. Vous connectez vos documents une fois, et les agents que vous utilisez déjà les interrogent via MCP, avec la source et avec un accès par workspace, zone, rôle et agent.'],
    de: ['Stelle deine Dokumente deinen Agenten bereit.', 'RAGfly ist ein RAG-Dienst. Du verbindest deine Dokumente einmal, und die Agenten, die du bereits nutzt, fragen sie über MCP ab – mit Quelle und mit Zugriff nach Workspace, Bereich, Rolle und Agent.'],
  }

async function idioma(): Promise<Locale> {
  const l = (await getLocale()) as Locale
  return locales.includes(l) ? l : 'en'
}

export async function generateMetadata({ params, searchParams }: { params: Promise<{ dolor: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> }): Promise<Metadata> {
  const { dolor } = await params
  const p = PAGINAS[(dolor === 'marketing' ? 'memory' : dolor) as Dolor]
  if (!p) return {}
  const locale = await idioma()
  const mensaje = await cargarMensajeMarketing((await searchParams).utm_content, locale)
  const base = p.textos[locale]
  const t = mensaje
    ? { titulo: mensaje.titulo.map(f => f.texto).join(''), metaDescripcion: mensaje.cuerpo }
    : dolor === 'marketing' ? { titulo: GENERICOS[locale][0], metaDescripcion: GENERICOS[locale][1] } : base
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
  const locale = await idioma()
  const mensaje = await cargarMensajeMarketing(query.utm_content, locale)
  const base = p.textos[locale]

  const t = dolor === 'marketing' ? {...base, titulo: GENERICOS[locale][0], bajada: GENERICOS[locale][1]} : base
  const c = COMUN[locale]


  const titulo2 = 'text-slm-dark text-2xl md:text-[30px] font-helvetica-neue font-medium leading-tight tracking-[-0.02em] text-balance'
  const bloque = 'px-6 md:px-12 py-8 md:py-10 border-t border-slm-brand-light'
  const texto = 'font-helvetica-neue text-base md:text-lg leading-relaxed text-slm-gray'

  return (
    <div lang={locale} className="min-h-screen bg-white text-slm-dark">
      <header className="px-6 md:px-12 py-6">
        <div className="mx-auto flex max-w-[980px] items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5" aria-label="RAGfly">
            <Image src="/ala_5c.png" alt="" width={2348} height={553} className="h-7 w-auto" />
            <span className="font-manrope text-2xl font-semibold tracking-tight">RAGfly</span>
          </Link>
          {/* Sin «Start free» arriba (Víctor, 26-oct): el registro ya está en el hero. */}
          <div className="flex items-center gap-3">
            <SelectorIdioma />
          </div>
        </div>
      </header>
      <div className="border-y border-slm-brand-light bg-slm-light px-6 py-3 md:hidden">
        <p className="font-helvetica-neue text-sm leading-relaxed text-slm-dark">{PRE_REGISTRATION[locale].mobileNotice}</p>
        <a href="#signup" className="mt-1 inline-flex min-h-9 items-center font-helvetica-neue text-sm font-medium text-slm-brand-dark underline">{PRE_REGISTRATION[locale].submit} →</a>
      </div>

      <main>
        {/* 1 · Hero en dos columnas (Víctor, 17-oct): titular y bajada a la izquierda,
            pre-registro por correo a la derecha; en móvil se apilan. */}
        <section className="px-6 md:px-12 pt-8 pb-12 md:pt-14">
          <div className="mx-auto grid max-w-[980px] items-start gap-8 md:grid-cols-[minmax(0,1fr)_340px] md:gap-12">
            <div className="flex min-w-0 flex-col gap-6">
              <Etiqueta>{c.etiqueta}</Etiqueta>
              <h1 className="font-helvetica-neue text-4xl md:text-5xl font-medium leading-[1.06] tracking-[-0.035em] text-balance">
                {mensaje ? <TituloMarketing fragmentos={mensaje.titulo} /> : t.titulo}
              </h1>
              {/* Con bajada (Víctor, 26-oct): título → bajada → cuerpo del aviso en gris, en lugar de la línea de producto. */}
              <p className="font-helvetica-neue text-lg md:text-xl leading-relaxed">{mensaje?.bajada ?? mensaje?.cuerpo ?? t.bajada}</p>
              <p className="font-helvetica-neue text-base md:text-lg leading-relaxed text-slm-gray">{mensaje?.bajada ? mensaje.cuerpo : c.lineaProducto}</p>
              <p className="font-helvetica-neue text-lg md:text-xl font-medium text-slm-brand-dark">{c.eslogan}</p>
            </div>
            <FormularioAlta id="signup" locale={locale} />
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

        {/* 6 · Planes: al final; el registro Free enlaza aquí (#planes) */}
        <PricingSection locale={locale} destino="#signup" />
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
