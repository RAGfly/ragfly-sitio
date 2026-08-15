'use client'

import Image from 'next/image'

/* ------------------------------------------------------------------ */
/* HeroBgCorredores — reemplazo de HeroBg (tiles de documentos)        */
/*                                                                     */
/* Paso 2 del §6 de REDISENO_SITIO_v2.md. Referencia lista para pegar  */
/* en components/HeroBg.tsx tras la extracción del paso 1.             */
/*                                                                     */
/* Requiere las clases de design/corredores/corredores.css en          */
/* app/globals.css. Conserva las alas: solo cambia el campo de fondo.  */
/*                                                                     */
/* Valores DETERMINISTAS derivados del índice (sin Math.random) para   */
/* que el HTML de servidor y cliente coincidan — misma precaución que  */
/* tenía HeroBg contra el hydration mismatch.                          */
/* ------------------------------------------------------------------ */

const CORREDORES = 7
/* Un solo blip ámbar en toda la pantalla: el autorizado. */
const LANE_AMBAR = 3

export function HeroBg() {
  const lanes = Array.from({ length: CORREDORES }, (_, i) => ({
    id: i,
    /* Reparto perpendicular parejo; el rotate(-11deg) hace el resto. */
    top: `${8 + i * 13}%`,
    /* 26–40 s: lento y constante. El fondo no compite con el titular. */
    dur: `${26 + ((i * 17) % 15)}s`,
    /* Negativos: al cargar, los corredores ya están en uso. */
    delay: `${-((i * 11) % 26)}s`,
    amber: i === LANE_AMBAR,
  }))

  return (
    <div className="hero-canvas">
      <Image
        src="/ala_1.5c.png"
        alt=""
        aria-hidden
        width={2348}
        height={553}
        priority
        className="hero-wing hero-wing--top"
      />
      <Image
        src="/ala_1.5c.png"
        alt=""
        aria-hidden
        width={2348}
        height={553}
        className="hero-wing hero-wing--bottom"
      />

      <div className="lane-field" aria-hidden>
        {lanes.map((l) => (
          <div key={l.id} className="lane" style={{ top: l.top }}>
            <span
              className={l.amber ? 'blip blip--amber' : 'blip'}
              style={{ animationDuration: l.dur, animationDelay: l.delay }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
