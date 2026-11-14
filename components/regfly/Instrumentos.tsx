import { ESCALERA } from '../../content/regfly'

/* Instrumentos animados de REGfly — CSS puro, sin estado (componentes de servidor).
   Mismas reglas de movimiento que RAGfly: velocidad constante, sin spring ni rebote, un solo
   movimiento por sección, y respeto a prefers-reduced-motion (ver regfly.css y globals.css).
   Las clases pf-*, lane, blip y rf-anot vienen de globals.css (sistema compartido). */

/* ------------------------------------------------------------------ */
/* Preflight — la lista de chequeo y la negativa (NegativaSection)      */
/* El ámbar vive aquí: marca lo autorizado y el ítem que bloquea.       */
/* ------------------------------------------------------------------ */
/* Copy revisado el 14-nov-2026 contra ARQUITECTURA-DE-MARCA.md: solo afirma lo que la marca ya
   sostiene (el corpus acredita la respuesta, cita norma y artículo, se abstiene fuera de cobertura).
   La cobertura va primero (es la compuerta); el ítem que bloquea es la falta de respaldo.
   No se afirma «vigencia verificada» en el Preflight: la vigencia es el atributo de la digestión. */
const CHEQUEOS = [
  'La pregunta está dentro de la cobertura',
  'La norma está cargada en el corpus',
  'La cita se resuelve a la norma y al artículo',
] as const
const BLOQUEO = 'Respaldo para esta afirmación'
const RESPUESTA_NEGATIVA = 'No encontré respaldo en la normativa cargada para responder esto con confianza.'

export function PreflightAnimado() {
  return (
    <div className="border border-white/12 p-7 md:p-9 flex flex-col gap-6 bg-white/[0.02] text-slm-light">
      <span className="rf-anot text-slm-brand-light/70">Antes de responder</span>

      <ul className="font-interfaz flex flex-col" aria-label="Chequeos previos a la respuesta">
        {CHEQUEOS.map((c, i) => {
          const delay = `${i * 1.1}s`
          return (
            <li key={c} className="flex items-center gap-4 py-4 border-b border-white/8">
              <span className="pf-stack flex-none w-5 h-5">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" className="pf-fade-out" style={{ animationDelay: delay }}>
                  <circle cx="10" cy="10" r="3" fill="none" stroke="rgba(255,255,255,.35)" strokeWidth="1.4" />
                </svg>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" className="pf-fade-in" style={{ animationDelay: delay }}>
                  <path d="M4 10 l4 4 l8 -10" stroke="#E8A33D" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </span>
              <span className="flex-1 text-sm text-slm-light/90">{c}</span>
              <span className="pf-stack">
                <span className="rf-anot rf-anot-sm text-slm-light/40 pf-fade-out" style={{ animationDelay: delay }}>Pendiente</span>
                <span className="rf-anot rf-anot-sm text-slm-ambar/80 pf-fade-in" style={{ animationDelay: delay }}>Verificado</span>
              </span>
            </li>
          )
        })}
        <li className="flex items-center gap-4 py-4 border-b border-white/8">
          <span className="pf-stack flex-none w-5 h-5">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" className="pf-fade-out" style={{ animationDelay: '3.3s' }}>
              <circle cx="10" cy="10" r="3" fill="none" stroke="rgba(255,255,255,.35)" strokeWidth="1.4" />
            </svg>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" className="pf-fade-in" style={{ animationDelay: '3.3s' }}>
              <path d="M5 5 l10 10 M15 5 l-10 10" stroke="#C08A3A" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </span>
          <span className="pf-stack flex-1">
            <span className="text-sm text-slm-light/90 pf-fade-out" style={{ animationDelay: '3.3s' }}>{BLOQUEO}</span>
            <span className="text-sm text-slm-light/55 line-through decoration-white/25 pf-fade-in" style={{ animationDelay: '3.3s' }}>{BLOQUEO}</span>
          </span>
          <span className="pf-stack">
            <span className="rf-anot rf-anot-sm text-slm-light/40 pf-fade-out" style={{ animationDelay: '3.3s' }}>Pendiente</span>
            <span className="rf-anot rf-anot-sm text-[#C08A3A] pf-fade-in" style={{ animationDelay: '3.3s' }}>Sin respaldo</span>
          </span>
        </li>
      </ul>

      <div className="font-interfaz flex flex-col gap-2 border-l border-slm-ambar/60 pl-4">
        <span className="rf-anot rf-anot-interfaz text-slm-light/40">Respuesta</span>
        <p className="text-sm md:text-base text-slm-light/90 leading-relaxed">“{RESPUESTA_NEGATIVA}”</p>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Vigente — lo derogado, marcado: la versión anterior se tacha y la    */
/* vigente aparece. Ilustra el ciclo de una norma, sin citar ninguna.   */
/* ------------------------------------------------------------------ */
export function VigenteAnimado() {
  return (
    <div className="border border-slm-dark/10 bg-white p-7 md:p-9 flex flex-col gap-6">
      <span className="rf-anot text-slm-dark/45">Estado de la norma</span>
      <ul className="font-interfaz flex flex-col" aria-label="Ejemplo del ciclo de una norma: la versión anterior queda derogada y la nueva vigente">
        <li className="flex items-center gap-4 py-4 border-b border-slm-dark/8">
          <span className="pf-stack flex-1">
            <span className="text-sm md:text-base text-slm-dark pf-fade-out">Versión anterior</span>
            <span className="text-sm md:text-base text-slm-dark/45 line-through decoration-slm-dark/30 pf-fade-in">Versión anterior</span>
          </span>
          <span className="pf-stack">
            <span className="rf-anot rf-anot-sm text-slm-gray pf-fade-out">Rige</span>
            <span className="rf-anot rf-anot-sm text-slm-dark/45 pf-fade-in">Derogada</span>
          </span>
        </li>
        <li className="flex items-center gap-4 py-4 border-b border-slm-dark/8">
          <span className="pf-stack flex-1">
            <span className="text-sm md:text-base text-slm-dark pf-fade-in" style={{ animationDelay: '.6s' }}>Versión vigente</span>
          </span>
          <span className="pf-stack">
            <span className="rf-anot rf-anot-sm text-slm-brand-dark pf-fade-in" style={{ animationDelay: '.6s' }}>Vigente</span>
          </span>
        </li>
      </ul>
      <p className="font-interfaz text-xs md:text-[13px] text-slm-dark/70 leading-relaxed border-l border-slm-brand/50 pl-4">
        Lo que dejó de regir queda marcado. No se mezcla con lo vigente.
      </p>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Escalera de jerarquía — una fila encendida baja por la escalera,     */
/* de la norma superior a la instrucción (cita la superior primero).    */
/* Ciclo fijo de 12 s (ver rgPeldano en regfly.css), 1 s por peldaño.   */
/* ------------------------------------------------------------------ */
export function EscaleraAnimada() {
  return (
    <ol className="flex flex-col gap-2 rg-escala" aria-label="Jerarquía normativa, de mayor a menor rango">
      {ESCALERA.map((nivel, i) => (
        <li
          key={nivel}
          className="rounded-xl border border-slm-dark/10 bg-white px-5 py-3 text-base text-slm-dark"
          style={{ marginLeft: `${i * 10}px`, animationDelay: `${i}s` }}
        >
          {nivel}
        </li>
      ))}
    </ol>
  )
}

/* ------------------------------------------------------------------ */
/* Con tus documentos — dos fuentes, una consulta, una respuesta.       */
/* Un punto viaja por cada vía (el mismo corredor del hero).            */
/* ------------------------------------------------------------------ */
function Fuente({ titulo, sub }: { titulo: string; sub: string }) {
  return (
    <div className="border border-slm-dark/10 bg-white px-5 py-4 flex flex-col gap-1">
      <span className="rf-anot rf-anot-sm text-slm-dark/45">{sub}</span>
      <span className="font-helvetica-neue font-medium text-lg text-slm-dark">{titulo}</span>
    </div>
  )
}

function Via({ dur, delay }: { dur: string; delay: string }) {
  return (
    <div className="hidden md:block rg-via" aria-hidden="true">
      <span className="blip" style={{ animationDuration: dur, animationDelay: delay }} />
    </div>
  )
}

export function ConvergenciaAnimada() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(80px,160px)_minmax(0,1fr)] md:grid-rows-2 gap-4 md:gap-y-6 items-center max-w-[860px]">
      <Fuente titulo="La normativa" sub="REGfly" />
      <Via dur="7s" delay="-1s" />
      <div className="order-last md:order-none md:row-span-2 md:col-start-3 md:row-start-1 border border-slm-brand/40 bg-slm-light px-6 py-8 flex flex-col gap-2">
        <span className="rf-anot rf-anot-sm text-slm-brand-dark">Una consulta</span>
        <span className="font-helvetica-neue font-medium text-xl md:text-2xl text-slm-dark tracking-[-0.02em]">Un solo servidor MCP</span>
      </div>
      <Fuente titulo="Tus documentos" sub="RAGfly - Privado" />
      <Via dur="9s" delay="-4s" />
    </div>
  )
}
