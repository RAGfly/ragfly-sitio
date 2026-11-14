import Link from 'next/link'
import { ESCALERA, FAQ, MARCA, POR_QUE_NO_BASTA, SUPERFICIES, VIGENTE } from '../../content/regfly'
import { AREAS } from '../../content/regfly-areas'
import { ListaEspera } from './ListaEspera'
import { Cabecera, EstadoChip, Pie, RAGFLY } from './Marco'

function Seccion({
  id,
  eyebrow,
  titulo,
  children,
  oscura = false,
}: {
  id?: string
  eyebrow?: string
  titulo: string
  children: React.ReactNode
  oscura?: boolean
}) {
  return (
    <section id={id} className={`px-6 md:px-12 py-16 md:py-24 ${oscura ? 'bg-slm-dark text-white' : ''}`}>
      <div className="max-w-[1100px] mx-auto">
        {eyebrow && (
          <p className={`font-[family-name:var(--font-dato)] text-xs md:text-sm tracking-[0.04em] mb-3 ${oscura ? 'text-white/60' : 'text-slm-brand-dark'}`}>
            {eyebrow}
          </p>
        )}
        <h2 className="font-helvetica-neue font-medium text-2xl md:text-4xl tracking-[-0.02em] leading-tight text-balance max-w-3xl mb-10">
          {titulo}
        </h2>
        {children}
      </div>
    </section>
  )
}

function Hero() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-slm-light via-white to-white">
      <div className="max-w-[900px] mx-auto px-6 md:px-12 pt-20 md:pt-28 pb-20 md:pb-28 text-center flex flex-col items-center gap-6">
        <p className="inline-flex rounded-full bg-white/80 border border-slm-dark/10 px-4 py-1.5 font-[family-name:var(--font-dato)] text-xs md:text-sm tracking-[0.04em] text-slm-dark/80">
          {MARCA.atributos}
        </p>
        <h1 className="font-helvetica-neue font-medium text-4xl md:text-6xl tracking-[-0.03em] leading-[1.06] text-balance text-slm-dark">
          {MARCA.titular}
        </h1>
        <p className="font-helvetica-neue font-medium text-lg md:text-2xl text-slm-brand-dark tracking-[-0.01em]">{MARCA.cobertura}</p>
        <p className="font-helvetica-neue text-base md:text-xl text-slm-dark/85 max-w-2xl text-balance leading-relaxed">{MARCA.apoyo}</p>
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-4">
          <a href="#acceso" className="rf-boton bg-slm-dark text-white px-7 py-3 rounded-full font-medium text-base hover:opacity-90 transition-opacity">
            Hazle una pregunta
          </a>
          <a href="#conecta" className="rf-boton border border-slm-dark text-slm-dark px-7 py-3 rounded-full font-medium text-base hover:bg-white transition-colors">
            Conecta tu IA
          </a>
        </div>
      </div>
    </div>
  )
}

function Ejemplo() {
  return (
    <Seccion id="ejemplo" eyebrow="Así responde" titulo="Una pregunta, la norma y el artículo que la respaldan.">
      <div className="max-w-[760px] rounded-3xl border border-slm-dark/10 bg-white shadow-[0_8px_40px_-12px_rgba(0,46,71,0.18)] overflow-hidden">
        <div className="px-6 py-4 bg-slm-light border-b border-slm-dark/10 text-sm text-slm-gray">Ejemplo ilustrativo</div>
        <div className="p-6 md:p-8 flex flex-col gap-6">
          <div className="self-end max-w-[85%] rounded-2xl rounded-br-md bg-slm-dark text-white px-5 py-3 text-base">
            ¿Por qué canal envía un emisor sus hechos esenciales a la CMF?
          </div>
          <div className="flex flex-col gap-4 text-base text-slm-dark leading-relaxed">
            <p>
              La ley fija la obligación de informar; el canal lo fija la norma de la CMF: se envían por CMF Supervisa, el canal único que establece la NCG 515.</p>
            <ol className="flex flex-col gap-2 text-sm md:text-base">
              <li className="flex gap-3">
                <span className="font-[family-name:var(--font-dato)] text-xs text-slm-brand-dark pt-1">1 · LEY</span>
                <span>Ley 18.045 de Mercado de Valores: la obligación de informar hechos esenciales.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-[family-name:var(--font-dato)] text-xs text-slm-brand-dark pt-1">2 · CMF</span>
                <span>Norma de Carácter General N° 515 de la CMF y su documento de preguntas frecuentes.</span>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </Seccion>
  )
}

function Tarjetas({ items }: { items: readonly { t: string; d: string }[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {items.map((it) => (
        <div key={it.t} className="rounded-2xl border border-slm-dark/10 bg-white p-6 flex flex-col gap-3">
          <h3 className="font-helvetica-neue font-semibold text-lg text-slm-dark">{it.t}</h3>
          <p className="text-base text-slm-gray leading-relaxed">{it.d}</p>
        </div>
      ))}
    </div>
  )
}

// JSON-LD propio de REGfly (el de RAGfly no se hereda en este host).
const JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      name: 'REGfly',
      alternateName: 'REGfly, by RAGfly',
      url: 'https://www.regfly.ai/cl',
      parentOrganization: { '@type': 'Organization', name: 'RAGfly', url: RAGFLY },
    },
    {
      '@type': 'FAQPage',
      inLanguage: 'es-CL',
      mainEntity: FAQ.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  ],
}

export function RegflyLanding() {
  return (
    <main className="regfly flex flex-col min-h-full">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <Cabecera />
      <Hero />

      <Ejemplo />

      <Seccion titulo="Por qué no basta tu IA sola" eyebrow="El problema">
        <Tarjetas items={POR_QUE_NO_BASTA} />
      </Seccion>

      <Seccion id="vigente" eyebrow="Vigente" titulo="La normativa que rige hoy, no la que recordaba el modelo.">
        <Tarjetas items={VIGENTE} />
      </Seccion>

      <Seccion id="preciso" eyebrow="Preciso" titulo="Cita la norma superior primero.">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <p className="text-base md:text-lg text-slm-gray leading-relaxed">
            Las normas no pesan igual. REGfly las ordena por jerarquía y, cuando dos se contradicen, cita primero la de mayor rango y
            después la instrucción del supervisor. Cada respuesta lleva la norma y el artículo.
          </p>
          <ol className="flex flex-col gap-2">
            {ESCALERA.map((nivel, i) => (
              <li
                key={nivel}
                className="rounded-xl border border-slm-dark/10 bg-white px-5 py-3 text-base text-slm-dark"
                style={{ marginLeft: `${i * 10}px` }}
              >
                {nivel}
              </li>
            ))}
          </ol>
        </div>
        <p className="mt-8 text-sm text-slm-gray max-w-2xl">
          En una segunda fase se suma de la ley al dictamen: dictámenes, oficios, sanciones y sentencias.
        </p>
      </Seccion>

      <Seccion eyebrow="Preflight" titulo="Si no está respaldado, no responde." oscura>
        <p className="text-lg text-white/80 max-w-2xl leading-relaxed">
          Antes de contestar, REGfly comprueba que el corpus acredita la respuesta. Si tu pregunta queda fuera de la cobertura o no hay
          respaldo, te lo dice. Prefiere abstenerse a inventar.
        </p>
      </Seccion>

      <Seccion id="cobertura" eyebrow="Cobertura" titulo="Lo que cubrimos, con su estado real.">
        <div className="flex flex-col gap-3">
          {AREAS.map((a) => (
            <div key={a.slug} className="rounded-2xl border border-slm-dark/10 bg-white px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-helvetica-neue font-semibold text-lg text-slm-dark">
                  <Link href={`/cl/${a.slug}`} className="hover:text-slm-brand-dark">{a.nombre}</Link>
                </h3>
                <p className="text-sm text-slm-gray">
                  {a.supervisores.map((s, i) => (
                    <span key={s.slug}>
                      {i > 0 && ' · '}
                      <Link href={`/cl/${a.slug}/${s.slug}`} className="hover:text-slm-brand-dark underline-offset-4 hover:underline">{s.sigla ?? s.nombre}</Link>
                    </span>
                  ))}
                </p>
              </div>
              <span className="self-start sm:self-auto"><EstadoChip estado={a.estado} /></span>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm text-slm-gray max-w-2xl">
          Marcamos como Disponible solo lo que ya pasó nuestra evaluación. En evaluación significa que el material está cargado y lo
          estamos midiendo antes de abrirlo.
        </p>
      </Seccion>

      <Seccion eyebrow="Con tus documentos" titulo="Cruza la normativa con tus propios documentos.">
        <p className="text-base md:text-lg text-slm-gray max-w-2xl leading-relaxed">
          REGfly funciona junto a{' '}
          <a href={RAGFLY} className="text-slm-brand-dark underline underline-offset-4 hover:opacity-80">
            RAGfly - Privado
          </a>
          , el servicio de RAG de tus documentos. Tu agente consulta ambos con un solo servidor MCP.
        </p>
      </Seccion>

      <Seccion id="conecta" eyebrow="Conecta tu IA" titulo="Una misma consulta, por donde ya trabajas.">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {SUPERFICIES.map((s) => (
            <div key={s.t} className="rounded-2xl border border-slm-dark/10 bg-white p-5 flex flex-col gap-2">
              <h3 className="font-[family-name:var(--font-dato)] text-sm tracking-[0.04em] text-slm-brand-dark">{s.t}</h3>
              <p className="text-sm text-slm-gray leading-relaxed">{s.d}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 text-base text-slm-dark">
          Usa tu cuenta RAGfly.{' '}
          <a href={`${RAGFLY}/build`} className="text-slm-brand-dark underline underline-offset-4 hover:opacity-80">
            Guías de integración
          </a>
        </p>
      </Seccion>

      <Seccion id="planes" eyebrow="Planes" titulo="Desde Free.">
        <p className="text-base md:text-lg text-slm-gray max-w-2xl leading-relaxed">
          Regulación tiene sus propios planes y cupos, compartidos por toda la organización. Publicaremos los precios en UF más IVA
          cuando cerremos los planes. Mientras, deja tu correo y te avisamos.
        </p>
      </Seccion>

      <Seccion id="faq" eyebrow="Preguntas frecuentes" titulo="Lo que más nos preguntan.">
        <div className="flex flex-col gap-3 max-w-3xl">
          {FAQ.map((f) => (
            <details key={f.q} className="group rounded-2xl border border-slm-dark/10 bg-white px-6 py-4">
              <summary className="cursor-pointer list-none font-helvetica-neue font-medium text-lg text-slm-dark flex justify-between gap-4">
                {f.q}
                <span className="text-slm-brand-dark group-open:rotate-45 transition-transform" aria-hidden="true">+</span>
              </summary>
              <p className="pt-3 text-base text-slm-gray leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </Seccion>

      <Seccion id="acceso" eyebrow="Acceso" titulo="Hazle tu primera pregunta a la normativa.">
        <p className="text-base md:text-lg text-slm-gray max-w-2xl leading-relaxed mb-6">
          Estamos abriendo por áreas. Deja tu correo y te escribimos cuando puedas consultar.
        </p>
        <ListaEspera />
      </Seccion>

      <Pie />
    </main>
  )
}
