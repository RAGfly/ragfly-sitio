'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { motion, useInView } from 'framer-motion'
import { useTranslations } from 'next-intl'

/* ------------------------------------------------------------------ */
/* ChatAnimado — maqueta del chat de RAGfly para «Cómo funciona».        */
/* Ciclo: se escribe la pregunta → preparando respuesta → respuesta con  */
/* sus fuentes. Todo el contenido ocupa su lugar desde el inicio, así    */
/* la animación no mueve la página.                                      */
/* ------------------------------------------------------------------ */

const VACIO = 0
const ESCRIBIENDO = 1
const PREPARANDO = 2
const RESPUESTA = 3
const SALIENDO = 4

const MS_POR_LETRA = 42
const MS_PREPARANDO = 3800
const MS_RESPUESTA_A_LA_VISTA = 8000

function Aparece({
  visible,
  retardo = 0,
  className = '',
  children,
}: {
  visible: boolean
  retardo?: number
  className?: string
  children: ReactNode
}) {
  return (
    <div
      className={`transition-[opacity,transform] duration-500 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'} ${className}`}
      style={{ transitionDelay: visible ? `${retardo}ms` : '0ms' }}
    >
      {children}
    </div>
  )
}

/* Cola de la burbuja: triángulo abajo, por fuera de la esquina recta. */
function Cola({ lado, color }: { lado: 'izquierda' | 'derecha'; color: string }) {
  return (
    <span
      className={`absolute bottom-0 h-3 w-3 ${color} ${lado === 'derecha' ? '-right-2.5' : '-left-2.5'}`}
      style={{ clipPath: lado === 'derecha' ? 'polygon(0 0, 0 100%, 100% 100%)' : 'polygon(100% 0, 100% 100%, 0 100%)' }}
    />
  )
}

export function ChatAnimado() {
  const t = useTranslations('comoFunciona')
  const ref = useRef<HTMLDivElement>(null)
  const enVista = useInView(ref, { amount: 0.3 })
  const [fase, setFase] = useState(VACIO)
  const [letras, setLetras] = useState(0)

  const pregunta = Array.from(t('chatPregunta'))
  const total = pregunta.length

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []
    const en = (ms: number, fn: () => void) => timers.push(setTimeout(fn, ms))

    if (!enVista) {
      en(0, () => {
        setFase(VACIO)
        setLetras(0)
      })
      return () => timers.forEach(clearTimeout)
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      en(0, () => {
        setFase(RESPUESTA)
        setLetras(total)
      })
      return () => timers.forEach(clearTimeout)
    }

    const ciclo = () => {
      timers.length = 0
      en(0, () => {
        setFase(VACIO)
        setLetras(0)
      })
      let ms = 700
      en(ms, () => setFase(ESCRIBIENDO))
      ms += 350
      for (let i = 1; i <= total; i++) {
        ms += MS_POR_LETRA
        en(ms, () => setLetras(i))
      }
      ms += 500
      en(ms, () => setFase(PREPARANDO))
      ms += MS_PREPARANDO
      en(ms, () => setFase(RESPUESTA))
      ms += MS_RESPUESTA_A_LA_VISTA
      en(ms, () => setFase(SALIENDO))
      ms += 700
      en(ms, ciclo)
    }
    ciclo()
    return () => timers.forEach(clearTimeout)
  }, [enVista, total])

  const escribiendo = fase === ESCRIBIENDO && letras < total
  const conRespuesta = fase === RESPUESTA || fase === SALIENDO
  const filas = [
    { doc: t('chatDoc0'), resumen: t('chatResumen0'), retardo: 550 },
    { doc: t('chatDoc1'), resumen: t('chatResumen1'), retardo: 800 },
  ]

  return (
    <figure className="w-full max-w-[460px] mx-auto lg:mx-0 font-helvetica-neue">
      <p className="sr-only">
        {t('chatPregunta')} {t('chatRespuesta')} {filas.map((f) => `${f.doc}: ${f.resumen}`).join(' ')} {t('chatOtros')}
      </p>
      <div ref={ref} aria-hidden="true" className="rounded-[28px] border border-white/10 bg-slm-cabina p-4 sm:p-5 lg:p-4 xl:p-5">
        <div className={`flex flex-col gap-4 transition-opacity duration-500 ${fase === SALIENDO || fase === VACIO ? 'opacity-0' : 'opacity-100'}`}>
          <Aparece visible={fase >= ESCRIBIENDO} className="relative ml-auto mr-2 w-fit max-w-[92%]">
            <div className="rounded-[22px] rounded-br-[4px] bg-slm-brand px-5 py-3.5 text-xl sm:text-2xl font-semibold leading-[1.2] tracking-[-0.015em] text-white">
              <span style={escribiendo ? { boxShadow: '2px 0 0 0 #fff' } : undefined}>{pregunta.slice(0, letras).join('')}</span>
              <span className="invisible">{pregunta.slice(letras).join('')}</span>
            </div>
            <Cola lado="derecha" color="bg-slm-brand" />
          </Aparece>

          <div className="relative ml-2">
            <div
              className={`absolute left-0 top-0 transition-[opacity,transform] duration-300 ease-out ${fase === PREPARANDO ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
            >
              <div className="relative flex items-center gap-3 rounded-[20px] rounded-bl-[4px] bg-white px-4 py-3">
                <span className="flex items-center gap-1">
                  {fase === PREPARANDO &&
                    [0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="block h-1.5 w-1.5 rounded-full bg-slm-brand"
                        animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
                        transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.16, ease: 'easeInOut' }}
                      />
                    ))}
                </span>
                <span className="text-sm font-medium text-slm-dark">{t('chatPreparando')}</span>
                <Cola lado="izquierda" color="bg-white" />
              </div>
            </div>

            <Aparece visible={conRespuesta} className="relative">
              <div className="rounded-[24px] rounded-bl-[4px] bg-white p-4 sm:p-5 lg:p-4 xl:p-5 text-slm-dark">
                <p className="text-lg font-semibold leading-snug tracking-[-0.01em]">{t('chatRespuesta')}</p>
                <div className="mt-3.5 overflow-hidden rounded-xl border border-slm-dark/12 text-xs sm:text-[13px] leading-snug">
                  <Aparece visible={conRespuesta} retardo={300}>
                    <div className="grid grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_3rem] gap-x-2 bg-slm-light px-3 py-2 font-semibold">
                      <span>{t('chatColDocumento')}</span>
                      <span>{t('chatColResumen')}</span>
                      <span className="text-right whitespace-nowrap">{t('chatColAbrir')}</span>
                    </div>
                  </Aparece>
                  {filas.map((f) => (
                    <Aparece key={f.doc} visible={conRespuesta} retardo={f.retardo}>
                      <div className="grid grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_3rem] items-center gap-x-2 border-t border-slm-dark/12 px-3 py-2.5">
                        <span className="min-w-0 break-words font-semibold">{f.doc}</span>
                        <span className="min-w-0 text-slm-gray">{f.resumen}</span>
                        <span className="text-right whitespace-nowrap text-slm-brand-dark underline underline-offset-2">{t('chatVer')}</span>
                      </div>
                    </Aparece>
                  ))}
                </div>
                <Aparece visible={conRespuesta} retardo={1100}>
                  <p className="mt-3 text-[13px] leading-snug text-slm-gray">{t('chatOtros')}</p>
                </Aparece>
              </div>
              <Cola lado="izquierda" color="bg-white" />
            </Aparece>
          </div>
        </div>
      </div>
    </figure>
  )
}
