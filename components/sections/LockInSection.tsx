'use client'

import { useTranslations } from 'next-intl'
import { BlurIn } from './shared'

/* ------------------------------------------------------------------ */
/* LockInSection — S8.bis (NUEVA) · «Sin lock-in», una pantalla         */
/* Familia F (instrumento): tres instrumentos —modelo / base / corpus—, */
/* cada uno con su dueño. Se dibujan inline y SIN cifras: la familia F  */
/* exige que solo aparezcan números reales, y aquí no hay ninguno que   */
/* medir. Nunca «BYOK» a secas: siempre parsing-BYOK y embedding-BYOK.  */
/*                                                                     */
/* Cada tarjeta lleva un instrumento DISTINTO —dial, botonera, grafo—:  */
/* tres diales idénticos no decían nada. Todos comparten el mismo       */
/* lienzo 120×66 para que las tres tarjetas queden alineadas.           */
/* ------------------------------------------------------------------ */

const AZUL = '#55B2E4'
const CABINA = '#001A29' /* fondo de la tarjeta: los nodos lo usan de relleno */

/* MODELO — dial de aguja. El único que se mueve (ver .lk-aguja). */
function DialModelo() {
  return (
    <svg viewBox="0 0 120 66" width="120" height="66" fill="none" aria-hidden="true">
      <path d="M10 60 A50 50 0 0 1 110 60" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
      <path d="M10 60 A50 50 0 0 1 110 60" stroke={AZUL} strokeWidth="1.5" strokeDasharray="118 40" />
      <g className="lk-aguja">
        <path d="M60 60 L90 26" stroke={AZUL} strokeWidth="1" strokeLinecap="round" />
      </g>
      <circle cx="60" cy="60" r="2.5" fill={AZUL} />
    </svg>
  )
}

/* BASE — botonera de cinco slots. Los encendidos van en ÁMBAR de marca
   (#E8A33D): aquí no es decoración, marca qué corre bajo tu autorización. */
const SLOTS = [
  { x: 12, on: false },
  { x: 32, on: true },
  { x: 52, on: true },
  { x: 72, on: false },
  { x: 92, on: false },
]

function BotoneraBase() {
  return (
    <svg viewBox="0 0 120 66" width="120" height="66" fill="none" aria-hidden="true">
      <rect x="5" y="19" width="110" height="34" rx="2" stroke="rgba(255,255,255,0.14)" strokeWidth="1" />
      {SLOTS.map((s) =>
        s.on ? (
          <g key={s.x}>
            <rect x={s.x - 3} y={25} width={22} height={22} rx="3" fill="#E8A33D" opacity="0.16" />
            <rect x={s.x} y={28} width={16} height={16} rx="1.5" fill="#E8A33D" />
          </g>
        ) : (
          <rect
            key={s.x}
            x={s.x}
            y={28}
            width={16}
            height={16}
            rx="1.5"
            fill="rgba(255,255,255,0.06)"
            stroke="rgba(255,255,255,0.35)"
            strokeWidth="1"
          />
        ),
      )}
    </svg>
  )
}

/* DOCUMENTOS — el documento dentro de tu perímetro. Sin flechas: el
   documento no entra ni sale de ningún lado, se queda donde está. Nada
   de exportar (daría a entender que primero lo almacenamos nosotros). */
function DocumentoEnTuPerimetro() {
  return (
    <svg viewBox="0 0 120 66" width="120" height="66" fill="none" aria-hidden="true">
      {/* las cuatro esquinas de tu perímetro */}
      <path
        d="M30 18 V8 H40 M80 8 H90 V18 M90 48 V58 H80 M40 58 H30 V48"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* la hoja, adentro */}
      <path d="M46 16 H66 L74 24 V50 H46 Z" fill={CABINA} stroke={AZUL} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M66 16 V24 H74" stroke={AZUL} strokeWidth="1.5" strokeLinejoin="round" />
      <path
        d="M52 32 H64 M52 38 H68 M52 44 H60"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

const INSTRUMENTOS = [DialModelo, BotoneraBase, DocumentoEnTuPerimetro]

export function LockInSection() {
  const t = useTranslations()
  const diales = [0, 1, 2].map((i) => ({
    tag: t(`lockin.card${i}Tag` as Parameters<typeof t>[0]),
    titulo: t(`lockin.card${i}Titulo` as Parameters<typeof t>[0]),
    desc: t(`lockin.card${i}Desc` as Parameters<typeof t>[0]),
    Instrumento: INSTRUMENTOS[i],
  }))

  return (
    <section id="lock-in" className="relative rf-corte px-6 md:px-12 lg:px-[60px] py-24 md:py-32 bg-slm-cabina text-slm-light overflow-hidden">
      <div className="max-w-[1200px] mx-auto flex flex-col gap-12">
        <div className="max-w-[760px] flex flex-col gap-6">
          <span className="rf-anot text-slm-brand-light/80">{t('lockin.eyebrow')}</span>
          <BlurIn as="h2" className="text-4xl md:text-5xl lg:text-6xl font-helvetica-neue font-medium leading-[1.05] tracking-[-0.03em]">
            {t('lockin.titulo1')}{' '}
            <span className="text-slm-brand-light">{t('lockin.tituloAccent')}</span>
          </BlurIn>
          <span className="rf-eje" aria-hidden="true" />
          <p className="text-slm-gray-light font-helvetica-neue text-base md:text-lg leading-relaxed">
            {t('lockin.descripcion')}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-px bg-white/10 border border-white/10">
          {diales.map((d) => (
            <div key={d.tag} className="bg-slm-cabina p-8 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="rf-anot text-slm-brand-light/70">{d.tag}</span>
                <span className="rf-anot text-slm-light/40">{t('lockin.dueno')}</span>
              </div>
              {/* Instrumento: trazo fino, sin relleno ni cifra inventada. */}
              <d.Instrumento />
              <h3 className="font-helvetica-neue text-xl md:text-2xl font-medium tracking-[-0.02em] leading-tight">
                {d.titulo}
              </h3>
              <p className="text-slm-gray-light font-helvetica-neue text-base leading-relaxed">{d.desc}</p>
            </div>
          ))}
        </div>

        <p className="max-w-[820px] font-helvetica-neue text-lg md:text-xl leading-relaxed text-slm-light/90 border-l border-slm-brand-light/50 pl-5">
          {t('lockin.remate')}
        </p>
      </div>
    </section>
  )
}
