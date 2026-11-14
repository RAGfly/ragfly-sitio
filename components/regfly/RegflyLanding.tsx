import Image from 'next/image'
import { AREAS, ESCALERA, FAQ, MARCA, NAV, POR_QUE_NO_BASTA, SUPERFICIES, VIGENTE } from '../../content/regfly'
import { ListaEspera } from './ListaEspera'

const RAGFLY = 'https://www.ragfly.ai'

const ESTADO_ESTILO: Record<string, string> = {
  Disponible: 'bg-slm-brand text-white',
  'En evaluación': 'bg-slm-brand-light text-slm-brand-dark',
  Próximamente: 'bg-slm-dark/5 text-slm-gray',
}

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

function Cabecera() {
  return (
    <header className="sticky top-0 z-20 bg-white/85 backdrop-blur-sm border-b border-slm-dark/5">
      <div className="max-w-[1200px] mx-auto flex items-center justify-between px-6 md:px-12 py-4">
        <a href="#" className="flex items-center gap-2.5 shrink-0 whitespace-nowrap" aria-label={`${MARCA.nombre}, ${MARCA.porMadre}`}>
          <Image src="/ala_5c.png" alt="" width={2348} height={553} className="h-6 w-auto" />
          <span className="font-manrope font-semibold text-2xl text-slm-dark tracking-tight">{MARCA.nombre}</span>
          <span className="hidden md:inline text-xs text-slm-gray mt-1">{MARCA.porMadre}</span>
        </a>
        <nav className="hidden xl:flex items-center gap-7">
          {NAV.map((it) => (
            <a key={it.l} href={it.h} className="text-base text-slm-dark hover:opacity-70 transition-opacity">
              {it.l}
            </a>
          ))}
        </nav>
        <a
          href="#acceso"
          className="rf-boton shrink-0 bg-slm-dark text-white px-5 py-2.5 rounded-full font-medium text-sm md:text-base whitespace-nowrap hover:opacity-90 transition-opacity"
        >
          <span className="sm:hidden">Preguntar</span>
          <span className="hidden sm:inline">Hazle una pregunta</span>
        </a>
      </div>
    </header>
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

export function RegflyLanding() {
  const anio = new Date().getFullYear()
  return (
    <main className="regfly flex flex-col min-h-full">
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
            <div key={a.area} className="rounded-2xl border border-slm-dark/10 bg-white px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-helvetica-neue font-semibold text-lg text-slm-dark">{a.area}</h3>
                <p className="text-sm text-slm-gray">{a.supervisor}</p>
              </div>
              <span className={`self-start sm:self-auto rounded-full px-4 py-1.5 text-sm font-medium whitespace-nowrap ${ESTADO_ESTILO[a.estado]}`}>
                {a.estado}
              </span>
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
    </main>
  )
}
