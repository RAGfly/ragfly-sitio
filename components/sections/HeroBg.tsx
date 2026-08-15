'use client'

import Image from 'next/image'

/* ------------------------------------------------------------------ */
/* HeroBg — tiles de documentos flotantes                              */
/* ------------------------------------------------------------------ */
export function HeroBg() {
  // Valores deterministas derivados del índice (sin Math.random) para que
  // el HTML del servidor y del cliente coincidan — evita hydration mismatch.
  const tiles = Array.from({ length: 14 }, (_, i) => ({
    id: i,
    left: ((i * 73 + 11) % 100),
    delay: (-(((i * 37) % 18) + (i % 3) * 0.33)).toFixed(2),
    dur: (14 + ((i * 53) % 14)).toFixed(2),
    rot: `${(((i * 41) % 14) - 7).toFixed(1)}deg`,
    scale: (0.6 + ((i * 29) % 70) / 100).toFixed(2),
  }))

  return (
    <div className="hero-canvas">
      {/* Ala de la marca — pieza decorativa (como en el PPTX), reemplaza el
          motivo de círculos. Tono claro (1.5c) para no competir con el texto. */}
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
      <div className="doc-field">
        {tiles.map((t) => (
          <div
            key={t.id}
            className="doc-tile"
            style={{
              left: `${t.left}%`,
              bottom: '-20%',
              animationDelay: `${t.delay}s`,
              animationDuration: `${t.dur}s`,
              ['--r' as string]: t.rot,
            }}
          />
        ))}
      </div>
    </div>
  )
}
