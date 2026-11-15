import Image from 'next/image'
import Link from 'next/link'
import { FAQ, MARCA, POR_QUE_NO_BASTA, SUPERFICIES, VIGENTE } from '../../content/regfly'
import { AREAS } from '../../content/regfly-areas'
import { URL_LOGIN_REGFLY, URL_REGISTRO_REGFLY } from '../../lib/host'
import { BlurIn } from '../sections/shared'
import { ChatAnimado } from './ChatAnimado'
import { HeroFondo } from './HeroFondo'
import { ConvergenciaAnimada, EscaleraAnimada, PreflightAnimado, VigenteAnimado } from './Instrumentos'
import { ListaEspera } from './ListaEspera'
import { Cabecera, EstadoChip, Pie, RAGFLY } from './Marco'
import { Escalonado, Item } from './Movimiento'

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
    <section id={id} className={`relative rf-corte overflow-hidden px-6 md:px-12 py-16 md:py-24 ${oscura ? 'bg-slm-dark text-white' : ''}`}>
      <div className="max-w-[1100px] mx-auto">
        {eyebrow && (
          <p className={`font-[family-name:var(--font-dato)] text-xs md:text-sm tracking-[0.04em] mb-3 ${oscura ? 'text-white/60' : 'text-slm-brand-dark'}`}>
            {eyebrow}
          </p>
        )}
        <BlurIn as="h2" className="font-helvetica-neue font-medium text-2xl md:text-4xl tracking-[-0.02em] leading-tight text-balance max-w-3xl">
          {titulo}
        </BlurIn>
        <span className="rf-eje mt-5 mb-10" aria-hidden="true" />
        {children}
      </div>
    </section>
  )
}

function Hero() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-slm-light via-white to-white">
      <HeroFondo />
      <div className="relative z-10 max-w-[900px] mx-auto px-6 md:px-12 pt-20 md:pt-28 pb-20 md:pb-28 text-center flex flex-col items-center gap-6">
        <BlurIn as="p" className="inline-flex rounded-full bg-white/80 backdrop-blur-md border border-slm-dark/10 px-4 py-1.5 font-[family-name:var(--font-dato)] text-xs md:text-sm tracking-[0.04em] text-slm-dark/80">
          {MARCA.atributos}
        </BlurIn>
        <BlurIn as="h1" className="font-helvetica-neue font-medium text-4xl md:text-6xl tracking-[-0.03em] leading-[1.06] text-balance text-slm-dark">
          {MARCA.titular}
        </BlurIn>
        <BlurIn delay={0.04} as="p" className="font-helvetica-neue font-medium text-lg md:text-2xl text-slm-brand-dark tracking-[-0.01em]">{MARCA.cobertura}</BlurIn>
        <BlurIn delay={0.08} as="p" className="font-helvetica-neue text-base md:text-xl text-slm-dark/85 max-w-2xl text-balance leading-relaxed">{MARCA.apoyo}</BlurIn>
        <BlurIn delay={0.3} className="flex flex-col sm:flex-row items-center gap-3 pt-4">
          <a href={URL_REGISTRO_REGFLY} className="rf-boton bg-slm-dark text-white px-7 py-3 rounded-full font-medium text-base hover:opacity-90 transition-opacity">
            Crear cuenta gratis
          </a>
          <a href="#conecta" className="rf-boton border border-slm-dark text-slm-dark px-7 py-3 rounded-full font-medium text-base hover:bg-white transition-colors">
            Conecta tu IA
          </a>
        </BlurIn>
      </div>
    </div>
  )
}

function Ejemplo() {
  return (
    <Seccion id="ejemplo" eyebrow="Así responde" titulo="Una pregunta, la norma y el artículo que la respaldan.">
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,520px)_minmax(0,1fr)] gap-10 lg:gap-14 items-center">
        <div className="flex flex-col gap-3">
          <ChatAnimado />
          <p className="text-sm text-slm-gray text-center lg:text-left">Ejemplo ilustrativo</p>
        </div>
        <div className="flex flex-col gap-5 text-base text-slm-dark leading-relaxed">
          <p>
            La ley fija la obligación de informar; el canal lo fija la norma de la CMF: se envían por CMF Supervisa, el canal único que establece la NCG 515.
          </p>
          <ol className="flex flex-col gap-3 text-sm md:text-base">
            <li className="flex gap-3 border-t border-slm-dark/12 pt-3">
              <span className="font-[family-name:var(--font-dato)] text-xs text-slm-brand-dark pt-1 shrink-0">1 · LEY</span>
              <span>Ley 18.045 de Mercado de Valores: la obligación de informar hechos esenciales.</span>
            </li>
            <li className="flex gap-3 border-t border-slm-dark/12 pt-3">
              <span className="font-[family-name:var(--font-dato)] text-xs text-slm-brand-dark pt-1 shrink-0">2 · CMF</span>
              <span>Norma de Carácter General N° 515 de la CMF y su documento de preguntas frecuentes.</span>
            </li>
          </ol>
        </div>
      </div>
      <figure className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        <figcaption className="text-base md:text-lg text-slm-gray leading-relaxed">
          Una respuesta puede reunir fuentes de distintos niveles: la ley, el reglamento y la norma del supervisor.
          El esquema es ilustrativo; las fuentes y citas dependen de cada consulta.
        </figcaption>
        <picture>
          <source media="(max-width: 639px)" srcSet="/design/regfly-tres-normas-movil.svg" />
          <Image
            src="/design/regfly-tres-normas-una-respuesta.svg"
            alt="Ejemplo conceptual de una ley, un reglamento y una norma del supervisor que aportan fuentes a una respuesta."
            width={960}
            height={520}
            className="w-full h-auto rounded-xl"
          />
        </picture>
      </figure>
    </Seccion>
  )
}

function Tarjetas({ items, columnas = 3 }: { items: readonly { t: string; d: string }[]; columnas?: 1 | 3 }) {
  return (
    <Escalonado className={`grid grid-cols-1 gap-5 ${columnas === 3 ? 'md:grid-cols-3' : ''}`}>
      {items.map((it) => (
        <Item key={it.t} className="rounded-2xl border border-slm-dark/10 bg-white p-6 flex flex-col gap-3">
          <h3 className="font-helvetica-neue font-semibold text-lg text-slm-dark">{it.t}</h3>
          <p className="text-base text-slm-gray leading-relaxed">{it.d}</p>
        </Item>
      ))}
    </Escalonado>
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
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] gap-8 lg:gap-12 items-start">
          <VigenteAnimado />
          <Tarjetas items={VIGENTE} columnas={1} />
        </div>
      </Seccion>

      <Seccion id="preciso" eyebrow="Preciso" titulo="Cita la norma superior primero.">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <p className="text-base md:text-lg text-slm-gray leading-relaxed">
            Las normas no pesan igual. REGfly las ordena por jerarquía y, cuando dos se contradicen, cita primero la de mayor rango y
            después la instrucción del supervisor. Cada respuesta lleva la norma y el artículo.
          </p>
          <EscaleraAnimada />
        </div>
        <p className="mt-8 text-sm text-slm-gray max-w-2xl">
          En una segunda fase se suma de la ley al dictamen: dictámenes, oficios, sanciones y sentencias.
        </p>
      </Seccion>

      <Seccion eyebrow="Preflight" titulo="Si no está respaldado, no responde." oscura>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.05fr] gap-10 lg:gap-14 items-center">
          <p className="text-lg text-white/80 max-w-xl leading-relaxed">
            Antes de contestar, REGfly comprueba que el corpus acredita la respuesta. Si tu pregunta queda fuera de la cobertura o no hay
            respaldo, te lo dice. Prefiere abstenerse a inventar.
          </p>
          <PreflightAnimado />
        </div>
      </Seccion>

      <Seccion id="cobertura" eyebrow="Cobertura" titulo="Lo que cubrimos, con su estado real.">
        <Escalonado className="flex flex-col gap-3">
          {AREAS.map((a) => (
            <Item key={a.slug} className="rounded-2xl border border-slm-dark/10 bg-white px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
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
            </Item>
          ))}
        </Escalonado>
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
        <div className="mt-10">
          <ConvergenciaAnimada />
        </div>
      </Seccion>

      <Seccion id="conecta" eyebrow="Conecta tu IA" titulo="Una misma consulta, por donde ya trabajas.">
        <Escalonado className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {SUPERFICIES.map((s) => (
            <Item key={s.t} className="rounded-2xl border border-slm-dark/10 bg-white p-5 flex flex-col gap-2">
              <h3 className="font-[family-name:var(--font-dato)] text-sm tracking-[0.04em] text-slm-brand-dark">{s.t}</h3>
              <p className="text-sm text-slm-gray leading-relaxed">{s.d}</p>
            </Item>
          ))}
        </Escalonado>
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
        <Escalonado className="flex flex-col gap-3 max-w-3xl">
          {FAQ.map((f) => (
            <Item as="details" key={f.q} className="group rounded-2xl border border-slm-dark/10 bg-white px-6 py-4">
              <summary className="cursor-pointer list-none font-helvetica-neue font-medium text-lg text-slm-dark flex justify-between gap-4">
                {f.q}
                <span className="text-slm-brand-dark group-open:rotate-45 transition-transform" aria-hidden="true">+</span>
              </summary>
              <p className="pt-3 text-base text-slm-gray leading-relaxed">{f.a}</p>
            </Item>
          ))}
        </Escalonado>
      </Seccion>

      <Seccion id="acceso" eyebrow="Acceso" titulo="Crea tu cuenta y consulta la normativa.">
        <p className="text-base md:text-lg text-slm-gray max-w-2xl leading-relaxed mb-6">
          Regístrate gratis o entra con tu cuenta RAGfly. Estamos abriendo por áreas: si quieres que te avisemos cuando se abra la tuya, deja tu correo.
        </p>
        <div className="flex flex-wrap items-center gap-5 mb-8">
          <a href={URL_REGISTRO_REGFLY} className="rf-boton inline-flex bg-slm-dark text-white px-7 py-3 rounded-full font-medium text-base hover:opacity-90 transition-opacity">
            Crear cuenta gratis
          </a>
          <a href={URL_LOGIN_REGFLY} className="text-base font-medium text-slm-dark hover:opacity-70 transition-opacity">
            Iniciar sesión
          </a>
        </div>
        <ListaEspera />
      </Seccion>

      <Pie />
    </main>
  )
}
