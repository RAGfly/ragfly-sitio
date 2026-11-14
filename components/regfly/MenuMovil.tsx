'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

/* Menú móvil de REGfly — mismo patrón que el Header de RAGfly (ícono que gira, panel que baja,
   enlaces que entran uno a uno). En pantallas anchas la navegación va en la propia cabecera. */
export function MenuMovil({ links }: { links: readonly { l: string; h: string }[] }) {
  const [abierto, setAbierto] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setAbierto((o) => !o)}
        className="xl:hidden text-slm-dark shrink-0"
        aria-label={abierto ? 'Cerrar menú' : 'Abrir menú'}
        aria-expanded={abierto}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={abierto ? 'x' : 'm'}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              {abierto ? (
                <>
                  <line x1="6" y1="6" x2="18" y2="18" />
                  <line x1="18" y1="6" x2="6" y2="18" />
                </>
              ) : (
                <>
                  <line x1="4" y1="7" x2="20" y2="7" />
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <line x1="4" y1="17" x2="20" y2="17" />
                </>
              )}
            </svg>
          </motion.div>
        </AnimatePresence>
      </button>

      <AnimatePresence>
        {abierto && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="absolute top-full left-0 right-0 bg-white shadow-lg mx-4 mt-2 rounded-lg px-6 py-8 z-50 xl:hidden"
          >
            <div className="flex flex-col gap-5">
              {links.map((it, i) => (
                <motion.a
                  key={it.l}
                  href={it.h}
                  onClick={() => setAbierto(false)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="text-lg text-slm-dark"
                >
                  {it.l}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
