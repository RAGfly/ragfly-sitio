/* Fondo del hero de REGfly — el mismo sistema que HeroBg de RAGfly (alas a la deriva + corredores
   con un punto que viaja), con los colores de RAGfly. Las alas son la misma pieza (`ala_1.5c.png`)
   usada como máscara. Valores deterministas (sin Math.random) para
   que el HTML de servidor y de cliente coincidan.
   Regla del sistema: nada cae, todo viaja; un solo punto ámbar en pantalla (el autorizado). */

const CORREDORES = 7
const LANE_AMBAR = 3

export function HeroFondo() {
  const lanes = Array.from({ length: CORREDORES }, (_, i) => ({
    id: i,
    top: `${8 + i * 13}%`,
    dur: `${26 + ((i * 17) % 15)}s`,
    delay: `${-((i * 11) % 26)}s`,
    amber: i === LANE_AMBAR,
  }))

  return (
    <div className="rg-hero-fondo" aria-hidden>
      <div className="rg-ala rg-ala--arriba" />
      <div className="rg-ala rg-ala--abajo" />
      <div className="lane-field">
        {lanes.map((l) => (
          <div key={l.id} className="lane" style={{ top: l.top }}>
            <span className={l.amber ? 'blip blip--amber' : 'blip'} style={{ animationDuration: l.dur, animationDelay: l.delay }} />
          </div>
        ))}
      </div>
    </div>
  )
}
