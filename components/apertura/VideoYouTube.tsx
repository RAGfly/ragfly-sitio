'use client'

/* ------------------------------------------------------------------ */
/* VideoYouTube — video de YouTube con carga liviana                   */
/*                                                                     */
/* Muestra la miniatura con un botón de play; el iframe se crea recién */
/* al hacer clic, desde youtube-nocookie.com y con autoplay, así la    */
/* página no carga el reproductor de YouTube ni sus cookies hasta que  */
/* la persona lo pide (Víctor, 15-oct). 16:9, ancho del contenedor.    */
/* ------------------------------------------------------------------ */
import { useState } from 'react'

export function VideoYouTube({ id, etiqueta }: { id: string; etiqueta: string }) {
  const [activo, setActivo] = useState(false)

  if (activo) {
    return (
      <div className="relative aspect-video w-full max-w-full overflow-hidden rounded-md bg-slm-cabina">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={etiqueta}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        />
      </div>
    )
  }

  return (
    <button
      type="button"
      aria-label={etiqueta}
      onClick={() => setActivo(true)}
      className="group relative block aspect-video w-full max-w-full overflow-hidden rounded-md bg-slm-cabina"
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- miniatura externa liviana; next/image exigiría declarar el dominio */}
      <img
        src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
        alt=""
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <span className="absolute inset-0 grid place-items-center bg-black/20 transition-colors group-hover:bg-black/10">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-white/95 shadow-md transition-transform group-hover:scale-105 md:h-20 md:w-20">
          <svg width="22" height="24" viewBox="0 0 20 22" aria-hidden="true" className="text-slm-dark">
            <path d="M3 1 L19 11 L3 21 Z" fill="currentColor" />
          </svg>
        </span>
      </span>
    </button>
  )
}
