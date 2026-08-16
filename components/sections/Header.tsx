'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SelectorIdioma } from '../SelectorIdioma'

/* ------------------------------------------------------------------ */
/* Header                                                               */
/* ------------------------------------------------------------------ */
export function Header() {
  const t = useTranslations()
  const [open, setOpen] = useState(false)
  const links = [
    /* Anclas del orden nuevo (S1→S10). Las viejas —#que-es, #diferencia,
       #como-se-usa, #seguridad, #pruebalo— ya no existen en la página.
       El orden Simple → Privado → Preciso refuerza el eslogan y espeja el
       orden de las secciones de la landing. */
    { l: t('nav.producto'), h: '#simple' },
    { l: t('nav.seguridad'), h: '#privado' },
    { l: t('nav.capacidades'), h: '#precision' },
    { l: t('nav.comoFunciona'), h: '#superficies' },
    { l: t('nav.planes'), h: '#planes' },
    { l: t('nav.descargar'), h: '/download' },
  ]

  return (
    <header className="sticky top-0 left-0 right-0 flex justify-between items-center px-6 md:px-12 lg:px-15 py-6 z-20 bg-white/80 backdrop-blur-sm">
      <div className="flex items-center gap-10">
        <a href="#" className="flex items-center gap-2.5" aria-label="RAGfly">
          <Image src="/ala_5c.png" alt="" width={2348} height={553} className="h-7 w-auto" />
          <span className="font-manrope font-semibold text-2xl text-slm-dark tracking-tight">RAGfly</span>
        </a>
        <nav className="hidden lg:flex items-center gap-8">
          {links.map((it) => (
            <a key={it.l} href={it.h} className="text-base text-slm-dark hover:opacity-70 transition-opacity">
              {it.l}
            </a>
          ))}
        </nav>
      </div>

      <div className="hidden lg:flex items-center gap-4">
        <SelectorIdioma />
        <a href="https://app.ragfly.ai" className="text-base font-medium text-slm-dark hover:opacity-70 transition-opacity">
          {t('nav.iniciarSesion')}
        </a>
        <a
          href="https://app.ragfly.ai"
          className="bg-slm-dark text-slm-light px-6 py-2.5 rounded-full font-medium text-base hover:opacity-90 transition-opacity"
        >
          {t('nav.cta')}
        </a>
      </div>

      <button onClick={() => setOpen((o) => !o)} className="lg:hidden text-slm-dark" aria-label="Menu">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={open ? 'x' : 'm'}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {open ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="6" y1="6" x2="18" y2="18" /><line x1="18" y1="6" x2="6" y2="18" />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="7" x2="20" y2="7" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="17" x2="20" y2="17" />
              </svg>
            )}
          </motion.div>
        </AnimatePresence>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="absolute top-24 left-0 right-0 bg-white shadow-lg mx-4 rounded-lg px-6 py-8 z-50 lg:hidden"
          >
            <div className="flex flex-col gap-5">
              {links.map((it, i) => (
                <motion.a
                  key={it.l}
                  href={it.h}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="text-lg text-slm-dark"
                >
                  {it.l}
                </motion.a>
              ))}
              <div className="border-t border-black/10 my-2" />
              <SelectorIdioma />
              <a href="https://app.ragfly.ai" className="font-medium text-base text-slm-dark">
                {t('nav.iniciarSesion')}
              </a>
              <a
                href="https://app.ragfly.ai"
                className="bg-slm-dark text-slm-light px-6 py-2.5 rounded-full font-medium text-base text-center"
              >
                {t('nav.cta')}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
