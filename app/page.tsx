'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { SelectorIdioma } from '../components/SelectorIdioma'
import { WaitlistForm } from '../components/WaitlistForm'
import planesMeta from '../content/planes-meta.json'
import agentes from '../content/agentes-data.json'

/* ------------------------------------------------------------------ */
/* BlurIn                                                               */
/* ------------------------------------------------------------------ */
function BlurIn({
  children,
  as: Tag = 'div',
  className = '',
  delay = 0,
  id,
}: {
  children: React.ReactNode
  as?: keyof React.JSX.IntrinsicElements
  className?: string
  delay?: number
  id?: string
}) {
  const ref = useRef<HTMLElement>(null)
  const inViewHook = useInView(ref as React.RefObject<Element>, { once: true, amount: 0.1 })
  const [forced, setForced] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const wh = window.innerHeight || 800
    if (r.top < wh && r.bottom > 0) {
      const t = setTimeout(() => setForced(true), 30)
      return () => clearTimeout(t)
    }
  }, [])

  const inView = inViewHook || forced
  // @ts-ignore
  const MotionTag = motion[Tag] || motion.div
  return (
    <MotionTag
      ref={ref}
      id={id}
      className={className}
      initial={{ filter: 'blur(20px)', opacity: 0 }}
      animate={inView ? { filter: 'blur(0px)', opacity: 1 } : { filter: 'blur(20px)', opacity: 0 }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </MotionTag>
  )
}

/* ------------------------------------------------------------------ */
/* HeroBg — tiles de documentos flotantes                              */
/* ------------------------------------------------------------------ */
function HeroBg() {
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

/* ------------------------------------------------------------------ */
/* Header                                                               */
/* ------------------------------------------------------------------ */
function Header() {
  const t = useTranslations()
  const [open, setOpen] = useState(false)
  const links = [
    { l: t('nav.producto'), h: '#que-es' },
    { l: t('nav.capacidades'), h: '#diferencia' },
    { l: t('nav.comoFunciona'), h: '#como-se-usa' },
    { l: t('nav.seguridad'), h: '#seguridad' },
    { l: t('nav.planes'), h: '#planes' },
  ]

  return (
    <header className="sticky top-0 left-0 right-0 flex justify-between items-center px-6 md:px-12 lg:px-15 py-6 z-20 bg-white/80 backdrop-blur-sm">
      <div className="flex items-center gap-10">
        <a href="#" className="flex items-center gap-2.5" aria-label="RAGfly">
          <Image src="/ragfly_isotipo.png" alt="" width={28} height={28} className="h-7 w-auto" />
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

/* ------------------------------------------------------------------ */
/* Hero                                                                 */
/* ------------------------------------------------------------------ */
function Hero() {
  const t = useTranslations()
  return (
    <div className="flex-1 flex flex-col items-center justify-between px-6 md:px-12 pb-12 md:pb-16 relative">
      <div className="pt-6 md:pt-10 z-10">
        <BlurIn className="inline-flex items-center gap-2 rounded-full bg-white/70 backdrop-blur-md border border-slm-dark/10 px-4 py-1.5">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-gradient-to-br from-slm-brand-dark to-slm-brand-light" />
          <span className="text-xs md:text-sm tracking-[0.04em] text-slm-dark/80">{t('hero.eyebrow')}</span>
        </BlurIn>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center z-10 gap-6">
        <BlurIn
          as="h1"
          className="text-center font-helvetica-neue font-medium leading-[1.08] text-slm-dark max-w-4xl"
        >
          <span className="block text-4xl md:text-6xl lg:text-7xl tracking-[-0.03em]">{t('hero.headlineLead')}</span>
          <span className="block text-4xl md:text-6xl lg:text-7xl tracking-[-0.03em] pb-[0.12em] bg-gradient-to-r from-slm-brand-dark via-slm-brand to-slm-brand-light bg-clip-text text-transparent">
            {t('hero.headlineAccent')}
          </span>
        </BlurIn>
        <BlurIn delay={0.08} className="font-helvetica-neue text-lg md:text-2xl text-slm-dark/90 font-medium tracking-[0.01em] max-w-2xl text-center leading-snug">
          {t('hero.slogan')}
        </BlurIn>
        <BlurIn delay={0.1} className="font-helvetica-neue text-base md:text-xl text-slm-gray tracking-[0.01em] max-w-2xl text-center leading-relaxed">
          {t('hero.tagline')}
        </BlurIn>
      </div>
      <div className="z-10 flex flex-col items-center gap-7 max-w-xl text-center">
        <BlurIn delay={0.3} className="flex flex-col sm:flex-row items-center gap-3">
          <a
            href="https://app.ragfly.ai"
            className="bg-slm-dark text-slm-light px-7 py-3 rounded-full font-medium text-base hover:opacity-90 transition-opacity"
          >
            {t('hero.ctaPrimario')}
          </a>
          <a
            href="#pruebalo"
            className="border border-slm-dark text-slm-dark px-7 py-3 rounded-full font-medium text-base hover:bg-gray-50 transition-colors"
          >
            {t('hero.ctaSecundario')}
          </a>
        </BlurIn>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white to-transparent z-20 pointer-events-none" />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* BuildingSection — "¿Qué estás construyendo?" · 3 perfiles            */
/* ------------------------------------------------------------------ */
function BuildingSection() {
  const t = useTranslations()
  const cards = [
    { tag: t('construyendo.cardATag'), h: t('construyendo.cardATitulo'), d: t('construyendo.cardADesc'), cta: t('construyendo.cardACta'), href: 'https://app.ragfly.ai' },
    { tag: t('construyendo.cardBTag'), h: t('construyendo.cardBTitulo'), d: t('construyendo.cardBDesc'), cta: t('construyendo.cardBCta'), href: '#diferencia' },
    { tag: t('construyendo.cardCTag'), h: t('construyendo.cardCTitulo'), d: t('construyendo.cardCDesc'), cta: t('construyendo.cardCCta'), href: '#como-se-usa' },
  ]
  return (
    <section id="construyendo" className="px-6 md:px-12 lg:px-[60px] py-24 md:py-32 bg-white">
      <div className="max-w-[1280px] mx-auto flex flex-col gap-16">
        <div className="max-w-[760px] flex flex-col gap-6">
          <span className="text-sm uppercase tracking-[0.18em] text-slm-brand">{t('construyendo.eyebrow')}</span>
          <BlurIn as="h2" className="text-slm-dark text-4xl md:text-5xl lg:text-6xl font-helvetica-neue font-medium leading-[1.05] tracking-[-0.03em]">
            {t('construyendo.titulo1')}{' '}
            <em className="not-italic inline-block pb-[0.06em] bg-gradient-to-r from-slm-brand-dark via-slm-brand to-slm-brand-light bg-clip-text text-transparent">{t('construyendo.tituloEm')}</em>{' '}
            {t('construyendo.titulo2')}
          </BlurIn>
          <p className="text-base md:text-lg text-slm-gray font-helvetica-neue max-w-[560px] leading-relaxed">
            {t('construyendo.descripcion')}
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {cards.map((c) => (
            <a
              key={c.tag}
              href={c.href}
              className="group rounded-[28px] p-8 md:p-9 flex flex-col gap-5 min-h-[320px] bg-slm-light border border-slm-dark/8 hover:border-slm-brand/40 transition-colors"
            >
              <span className="text-xs uppercase tracking-[0.16em] text-slm-brand">{c.tag}</span>
              <h3 className="font-helvetica-neue text-2xl md:text-[28px] font-medium text-slm-dark tracking-[-0.02em] leading-tight">{c.h}</h3>
              <p className="font-helvetica-neue text-base text-slm-gray leading-relaxed flex-1">{c.d}</p>
              <span className="inline-flex items-center gap-2 text-sm font-medium text-slm-dark group-hover:gap-3 transition-all">
                {c.cta}<span aria-hidden="true">→</span>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* ProblemSolutionSection — "el RAG se rompe a escala" + tabla          */
/* ------------------------------------------------------------------ */
function ProblemSolutionSection() {
  const t = useTranslations()
  const sin = [0, 1, 2, 3, 4].map((i) => t(`problema.sin${i}` as Parameters<typeof t>[0]))
  const con = [0, 1, 2, 3, 4].map((i) => t(`problema.con${i}` as Parameters<typeof t>[0]))
  return (
    <section id="problema" className="px-6 md:px-12 lg:px-[60px] py-24 md:py-32 bg-slm-dark text-slm-light relative overflow-hidden">
      <div className="absolute inset-0 opacity-30 pointer-events-none"
        style={{ background: 'radial-gradient(800px 500px at 80% 20%, rgba(0,138,209,0.35), transparent 60%), radial-gradient(700px 500px at 10% 90%, rgba(204,232,246,0.18), transparent 70%)' }} />
      <div className="relative max-w-[1200px] mx-auto flex flex-col gap-16">
        <div className="max-w-[680px] flex flex-col gap-6">
          <span className="text-sm uppercase tracking-[0.18em] text-slm-brand-light">{t('problema.eyebrow')}</span>
          <BlurIn as="h2" className="text-4xl md:text-5xl lg:text-6xl font-helvetica-neue font-medium leading-[1.05] tracking-[-0.03em]">
            {t('problema.titulo1')} <span className="text-slm-brand-light">{t('problema.tituloAccent')}</span>
          </BlurIn>
          <p className="text-base md:text-lg text-slm-gray-light font-helvetica-neue max-w-[600px] leading-relaxed">
            {t('problema.descripcion')}
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          <div className="rounded-[28px] border border-white/10 p-8 md:p-10 bg-white/[0.03] backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-slm-gray-light text-sm">—</span>
              <span className="text-sm uppercase tracking-[0.18em] text-slm-gray-light">{t('problema.sinTitulo')}</span>
            </div>
            <ul className="flex flex-col gap-4">
              {sin.map((s, i) => (
                <li key={i} className="flex gap-3 text-slm-light/80 font-helvetica-neue text-base md:text-lg leading-snug">
                  <span className="mt-2 inline-block w-1.5 h-1.5 rounded-full bg-slm-gray-light flex-none" />{s}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-[28px] p-8 md:p-10 bg-gradient-to-br from-slm-brand-dark via-slm-brand/30 to-slm-brand-light/10 border border-slm-brand-light/30">
            <div className="flex items-center gap-3 mb-6">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slm-brand-light/20 text-slm-brand-light text-sm">✓</span>
              <span className="text-sm uppercase tracking-[0.18em] text-slm-brand-light">{t('problema.conTitulo')}</span>
            </div>
            <ul className="flex flex-col gap-4">
              {con.map((s, i) => (
                <li key={i} className="flex gap-3 text-slm-light font-helvetica-neue text-base md:text-lg leading-snug">
                  <span className="mt-2 inline-block w-1.5 h-1.5 rounded-full bg-slm-brand-light flex-none" />{s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* WhatIsSection — "Qué es RAGfly" (reusa el visual de carpetas)        */
/* ------------------------------------------------------------------ */
function WhatIsSection() {
  const t = useTranslations()
  const bullets = [0, 1, 2].map((i) => t(`queEs.bullet${i}` as Parameters<typeof t>[0]))
  const folders = [
    { name: 'Contratos 2025', count: '128 archivos' },
    { name: 'Auditorías Q4', count: '47 archivos' },
    { name: 'Procedimientos RRHH', count: '312 archivos' },
    { name: 'Minutas Directorio', count: '89 archivos' },
  ]
  return (
    <section id="que-es" className="px-6 md:px-12 lg:px-[60px] py-24 md:py-32 bg-white">
      <div className="max-w-[1280px] mx-auto grid lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-20 items-center">
        <div className="flex flex-col gap-7">
          <span className="text-sm uppercase tracking-[0.18em] text-slm-brand">{t('queEs.eyebrow')}</span>
          <BlurIn as="h2" className="text-slm-dark text-4xl md:text-5xl lg:text-6xl font-helvetica-neue font-medium leading-[1.05] tracking-[-0.03em]">
            {t('queEs.titulo1')}{' '}
            <span className="inline-block pb-[0.06em] bg-gradient-to-r from-slm-brand-dark via-slm-brand to-slm-brand-light bg-clip-text text-transparent">{t('queEs.tituloAccent')}</span>
          </BlurIn>
          <p className="text-slm-gray font-helvetica-neue text-base md:text-lg leading-relaxed max-w-[520px]">
            {t('queEs.descripcion')}
          </p>
          <ul className="flex flex-col gap-3 mt-2">
            {bullets.map((s, i) => (
              <li key={i} className="flex gap-3 text-slm-dark/85 font-helvetica-neue text-base leading-snug">
                <span className="mt-2 inline-block w-1.5 h-1.5 rounded-full bg-slm-brand flex-none" />{s}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative">
          <div className="rounded-[28px] bg-gradient-to-br from-slm-light via-white to-slm-light border border-slm-dark/8 p-6 md:p-8 relative overflow-hidden">
            <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden md:block" aria-hidden="true">
              <svg width="80" height="200" viewBox="0 0 80 200" fill="none">
                <path d="M 0 100 C 30 100, 50 100, 80 100" stroke="url(#beam)" strokeWidth="1.5" strokeDasharray="3 4">
                  <animate attributeName="stroke-dashoffset" from="0" to="-14" dur="1.5s" repeatCount="indefinite" />
                </path>
                <defs>
                  <linearGradient id="beam" x1="0" y1="0" x2="80" y2="0">
                    <stop offset="0%" stopColor="#008AD1" stopOpacity="0.1" />
                    <stop offset="100%" stopColor="#008AD1" stopOpacity="0.8" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <div className="text-xs uppercase tracking-[0.18em] text-slm-dark/40 mb-4">{t('queEs.eyebrow')}</div>

            <ul className="flex flex-col gap-2.5">
              {folders.map((f, i) => (
                <li
                  key={i}
                  className="group flex items-center gap-3 p-3.5 rounded-xl bg-white border border-slm-dark/8"
                  style={{ animation: 'folderScan 6s ease-in-out infinite', animationDelay: `${i * 0.6}s` }}
                >
                  <span className="inline-flex items-center justify-center w-9 h-9 rounded-md bg-slm-light border border-slm-dark/8 flex-none">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#045B8E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" />
                    </svg>
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-slm-dark truncate">{f.name}</div>
                    <div className="text-xs text-slm-dark/50">{f.count}</div>
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.18em] flex-none zs-status">✓</span>
                </li>
              ))}
            </ul>

            <div className="mt-5 flex items-center justify-between rounded-xl bg-slm-dark text-slm-light px-4 py-3">
              <span className="text-xs uppercase tracking-[0.18em] text-slm-brand-light">Pipeline</span>
              <span className="text-sm flex items-center gap-2">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-slm-brand-light animate-pulse" />
                Indexado · listo para tu agente
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* CombinaSection — "Lo que casi nadie combina" · 3 temas + tabla       */
/* ------------------------------------------------------------------ */
function CombinaSection() {
  const t = useTranslations()
  const temas = [0, 1, 2].map((i) => ({
    num: t(`combina.item${i}Num` as Parameters<typeof t>[0]),
    titulo: t(`combina.item${i}Titulo` as Parameters<typeof t>[0]),
    desc: t(`combina.item${i}Desc` as Parameters<typeof t>[0]),
  }))
  const rows = [0, 1, 2, 3, 4].map((i) => ({
    sin: t(`combina.tablaSin${i}` as Parameters<typeof t>[0]),
    con: t(`combina.tablaCon${i}` as Parameters<typeof t>[0]),
  }))
  return (
    <section id="diferencia" className="px-6 md:px-12 lg:px-[60px] py-24 md:py-32 bg-slm-light">
      <div className="max-w-[1200px] mx-auto flex flex-col gap-16">
        <div className="max-w-[720px] flex flex-col gap-6">
          <span className="text-sm uppercase tracking-[0.18em] text-slm-brand">{t('combina.eyebrow')}</span>
          <BlurIn as="h2" className="text-slm-dark text-4xl md:text-5xl lg:text-6xl font-helvetica-neue font-medium leading-[1.05] tracking-[-0.03em]">
            {t('combina.titulo1')}{' '}
            <span className="inline-block pb-[0.06em] bg-gradient-to-r from-slm-brand-dark via-slm-brand to-slm-brand-light bg-clip-text text-transparent">{t('combina.tituloAccent')}</span>
          </BlurIn>
        </div>

        <motion.div
          className="grid md:grid-cols-3 gap-4"
          initial="h" whileInView="s" viewport={{ once: true, amount: 0.2 }}
          variants={{ h: {}, s: { transition: { staggerChildren: 0.1 } } }}
        >
          {temas.map((c) => (
            <motion.div
              key={c.num}
              variants={{ h: { opacity: 0, y: 20 }, s: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } } }}
              className="rounded-[24px] bg-white p-8 border border-slm-dark/5 flex flex-col gap-4 min-h-[280px]"
            >
              <span className="font-helvetica-neue text-5xl font-medium bg-gradient-to-br from-slm-brand-dark via-slm-brand to-slm-brand-light bg-clip-text text-transparent leading-none">{c.num}</span>
              <h3 className="text-xl md:text-2xl font-helvetica-neue font-medium text-slm-dark tracking-[-0.02em] leading-tight">{c.titulo}</h3>
              <p className="text-slm-gray font-helvetica-neue text-base leading-relaxed">{c.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        <div className="rounded-[24px] bg-white border border-slm-dark/8 p-8 md:p-10 flex flex-col gap-3">
          <h3 className="font-helvetica-neue text-xl md:text-2xl font-medium text-slm-dark tracking-[-0.02em]">{t('combina.capaTitulo')}</h3>
          <p className="text-slm-gray font-helvetica-neue text-base md:text-lg leading-relaxed max-w-[900px]">{t('combina.capaDesc')}</p>
        </div>

        <div className="overflow-hidden rounded-[24px] border border-slm-dark/8 bg-white">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slm-dark/8">
                <th scope="col" className="px-6 py-4 text-xs uppercase tracking-[0.16em] text-slm-gray-light font-medium w-1/2">{t('combina.tablaCol0')}</th>
                <th scope="col" className="px-6 py-4 text-xs uppercase tracking-[0.16em] text-slm-brand font-medium w-1/2 bg-slm-light/50">{t('combina.tablaCol1')}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className="border-b border-slm-dark/5 last:border-0">
                  <td className="px-6 py-4 align-top font-helvetica-neue text-base text-slm-gray leading-snug">{r.sin}</td>
                  <td className="px-6 py-4 align-top font-helvetica-neue text-base text-slm-dark leading-snug bg-slm-light/30">{r.con}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* ChatSection — "Pruébalo hablándole" · chat como demo de DX           */
/* ------------------------------------------------------------------ */
function ChatSection() {
  const t = useTranslations()
  const turns = [0, 1, 2].map((i) => ({
    q: t(`chat.demo${i}` as Parameters<typeof t>[0]),
    r: t(`chat.demo${i}r` as Parameters<typeof t>[0]),
  }))
  return (
    <section id="pruebalo" className="px-6 md:px-12 lg:px-[60px] py-24 md:py-32 bg-white">
      <div className="max-w-[1200px] mx-auto grid lg:grid-cols-[1fr_1fr] gap-12 lg:gap-16 items-center">
        <div className="flex flex-col gap-6">
          <span className="text-sm uppercase tracking-[0.18em] text-slm-brand">{t('chat.eyebrow')}</span>
          <BlurIn as="h2" className="text-slm-dark text-4xl md:text-5xl font-helvetica-neue font-medium leading-[1.05] tracking-[-0.03em]">
            {t('chat.titulo1')}{' '}
            <span className="inline-block pb-[0.06em] bg-gradient-to-r from-slm-brand-dark via-slm-brand to-slm-brand-light bg-clip-text text-transparent">{t('chat.tituloAccent')}</span>
          </BlurIn>
          <p className="text-slm-gray font-helvetica-neue text-base md:text-lg leading-relaxed">{t('chat.descripcion')}</p>
          <p className="text-slm-gray font-helvetica-neue text-base md:text-lg leading-relaxed">{t('chat.descripcion2')}</p>
          <p className="text-sm text-slm-dark/60 font-helvetica-neue italic border-l-2 border-slm-brand/40 pl-4">{t('chat.nota')}</p>
        </div>

        <div className="rounded-[28px] bg-slm-dark text-slm-light p-6 md:p-8 flex flex-col gap-4 border border-slm-brand-dark/40">
          {turns.map((turn, i) => (
            <div key={i} className="flex flex-col gap-2">
              <div className="self-end max-w-[85%] rounded-2xl rounded-br-sm bg-slm-brand text-white px-4 py-2.5 font-mono text-sm leading-snug">
                {turn.q}
              </div>
              <div className="self-start max-w-[90%] rounded-2xl rounded-bl-sm bg-white/8 text-slm-light/90 px-4 py-2.5 font-helvetica-neue text-sm leading-snug">
                {turn.r}
              </div>
            </div>
          ))}
          <div className="mt-2 flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-4 py-2.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-slm-brand-light animate-pulse" />
            <span className="text-sm text-slm-gray-light font-helvetica-neue">RAGfly · escribe lo que necesites…</span>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* IdentitiesSection — "Le das un perfil, no acceso"                    */
/* ------------------------------------------------------------------ */
function IdentitiesSection() {
  const t = useTranslations()
  const tags = [0, 1, 2].map((i) => t(`identidades.tag${i}` as Parameters<typeof t>[0]))
  return (
    <section id="identidades" className="px-6 md:px-12 lg:px-[60px] py-24 md:py-32 bg-slm-light">
      <div className="max-w-[1100px] mx-auto flex flex-col gap-12">
        <div className="max-w-[820px] flex flex-col gap-6">
          <span className="text-sm uppercase tracking-[0.18em] text-slm-brand">{t('identidades.eyebrow')}</span>
          <BlurIn as="h2" className="text-slm-dark text-4xl md:text-5xl lg:text-6xl font-helvetica-neue font-medium leading-[1.05] tracking-[-0.03em]">
            {t('identidades.titulo1')}{' '}
            <span className="inline-block pb-[0.06em] bg-gradient-to-r from-slm-brand-dark via-slm-brand to-slm-brand-light bg-clip-text text-transparent">{t('identidades.tituloAccent')}</span>
          </BlurIn>
          <p className="text-slm-gray font-helvetica-neue text-base md:text-lg leading-relaxed">{t('identidades.descripcion')}</p>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          <p className="rounded-[24px] bg-white border border-slm-dark/8 p-8 text-slm-gray font-helvetica-neue text-base md:text-lg leading-relaxed">{t('identidades.p0')}</p>
          <p className="rounded-[24px] bg-white border border-slm-dark/8 p-8 text-slm-gray font-helvetica-neue text-base md:text-lg leading-relaxed">{t('identidades.p1')}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {tags.map((tag) => (
            <span key={tag} className="inline-flex items-center gap-2 rounded-full bg-white border border-slm-dark/8 px-4 py-2 text-sm text-slm-dark font-helvetica-neue">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-slm-brand" />{tag}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* ModesSection — "Cloud o Desktop"                                     */
/* ------------------------------------------------------------------ */
function ModesSection() {
  const t = useTranslations()
  const cloud = [0, 1, 2].map((i) => t(`modos.cloud${i}` as Parameters<typeof t>[0]))
  const desktop = [0, 1, 2].map((i) => t(`modos.desktop${i}` as Parameters<typeof t>[0]))
  return (
    <section id="modos" className="px-6 md:px-12 lg:px-[60px] py-24 md:py-32 bg-white">
      <div className="max-w-[1200px] mx-auto flex flex-col gap-16">
        <div className="max-w-[680px] flex flex-col gap-6">
          <span className="text-sm uppercase tracking-[0.18em] text-slm-brand">{t('modos.eyebrow')}</span>
          <BlurIn as="h2" className="text-slm-dark text-4xl md:text-5xl lg:text-6xl font-helvetica-neue font-medium leading-[1.05] tracking-[-0.03em]">
            {t('modos.titulo1')}{' '}
            <span className="inline-block pb-[0.06em] bg-gradient-to-r from-slm-brand-dark via-slm-brand to-slm-brand-light bg-clip-text text-transparent">{t('modos.tituloAccent')}</span>
          </BlurIn>
          <p className="text-base md:text-lg text-slm-gray font-helvetica-neue max-w-[560px] leading-relaxed">{t('modos.descripcion')}</p>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          <div className="rounded-[28px] bg-slm-light border border-slm-dark/8 p-8 md:p-10 flex flex-col gap-5">
            <span className="text-xs uppercase tracking-[0.16em] text-slm-brand">{t('modos.cloudTitulo')}</span>
            <p className="text-slm-gray font-helvetica-neue text-base md:text-lg leading-relaxed">{t('modos.cloudDesc')}</p>
            <ul className="flex flex-col gap-3 mt-auto">
              {cloud.map((s, i) => (
                <li key={i} className="flex gap-3 text-slm-dark/85 font-helvetica-neue text-base leading-snug">
                  <span className="mt-2 inline-block w-1.5 h-1.5 rounded-full bg-slm-brand flex-none" />{s}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-[28px] bg-slm-dark text-slm-light p-8 md:p-10 flex flex-col gap-5 relative overflow-hidden border border-slm-brand-dark/40">
            <div className="absolute inset-0 opacity-50 pointer-events-none"
              style={{ background: 'radial-gradient(600px 400px at 90% 0%, rgba(0,138,209,0.28), transparent 70%)' }} />
            <div className="relative flex flex-col gap-5">
              <span className="text-xs uppercase tracking-[0.16em] text-slm-brand-light">{t('modos.desktopTitulo')}</span>
              <p className="text-slm-light/85 font-helvetica-neue text-base md:text-lg leading-relaxed">{t('modos.desktopDesc')}</p>
              <ul className="flex flex-col gap-3">
                {desktop.map((s, i) => (
                  <li key={i} className="flex gap-3 text-slm-light/90 font-helvetica-neue text-base leading-snug">
                    <span className="mt-2 inline-block w-1.5 h-1.5 rounded-full bg-slm-brand-light flex-none" />{s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <p className="max-w-[760px] text-slm-gray font-helvetica-neue text-base md:text-lg leading-relaxed">{t('modos.nota')}</p>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* SurfacesSection — "MCP, REST, CLI o SDK" + snippet                   */
/* ------------------------------------------------------------------ */
function SurfacesSection() {
  const t = useTranslations()
  const surfaces = [
    { h: t('superficies.mcpTitulo'), d: t('superficies.mcpDesc'), feat: true },
    { h: t('superficies.restTitulo'), d: t('superficies.restDesc'), feat: false },
    { h: t('superficies.cliTitulo'), d: t('superficies.cliDesc'), feat: false },
    { h: t('superficies.sdkTitulo'), d: t('superficies.sdkDesc'), feat: false },
  ]
  const snippet = `{
  "mcpServers": {
    "ragfly": {
      "url": "https://api.ragfly.ai/mcp/sse",
      "headers": { "Authorization": "Bearer slm_live_xxxxxxxxxx" }
    }
  }
}`
  return (
    <section id="como-se-usa" className="px-6 md:px-12 lg:px-[60px] py-24 md:py-32 bg-slm-light">
      <div className="max-w-[1200px] mx-auto flex flex-col gap-12">
        <div className="max-w-[720px] flex flex-col gap-6">
          <span className="text-sm uppercase tracking-[0.18em] text-slm-brand">{t('superficies.eyebrow')}</span>
          <BlurIn as="h2" className="text-slm-dark text-4xl md:text-5xl lg:text-6xl font-helvetica-neue font-medium leading-[1.05] tracking-[-0.03em]">
            {t('superficies.titulo1')}{' '}
            <span className="inline-block pb-[0.06em] bg-gradient-to-r from-slm-brand-dark via-slm-brand to-slm-brand-light bg-clip-text text-transparent">{t('superficies.tituloAccent')}</span>
          </BlurIn>
          <p className="text-base md:text-lg text-slm-gray font-helvetica-neue max-w-[560px] leading-relaxed">{t('superficies.descripcion')}</p>
        </div>
        <div className="grid md:grid-cols-4 gap-4">
          {surfaces.map((s) => (
            <div
              key={s.h}
              className={`rounded-[24px] p-8 flex flex-col gap-3 border ${s.feat ? 'bg-white border-slm-brand/40' : 'bg-white border-slm-dark/8'}`}
            >
              <div className="flex items-center gap-2">
                <h3 className="font-mono text-xl font-medium text-slm-dark">{s.h}</h3>
                {s.feat && <span className="text-[10px] uppercase tracking-[0.15em] bg-slm-brand/10 text-slm-brand px-2 py-0.5 rounded-full">abrimos aquí</span>}
              </div>
              <p className="text-slm-gray font-helvetica-neue text-base leading-relaxed">{s.d}</p>
            </div>
          ))}
        </div>
        <div className="rounded-[24px] bg-slm-dark text-slm-light p-6 md:p-8 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-[0.18em] text-slm-brand-light">{t('superficies.snippetTitulo')}</span>
            <span className="text-xs text-slm-gray-light font-helvetica-neue">{t('superficies.snippetSub')}</span>
          </div>
          <pre className="overflow-x-auto font-mono text-sm leading-relaxed text-slm-light/90 bg-black/20 rounded-xl p-4"><code>{snippet}</code></pre>
          <div className="flex flex-wrap gap-3">
            <a href="/agents.json" className="bg-slm-brand-light text-slm-dark px-5 py-2.5 rounded-full font-medium text-sm hover:opacity-90 transition-opacity">agents.json</a>
            <a href="/llms-full.txt" className="border border-white/30 text-slm-light px-5 py-2.5 rounded-full font-medium text-sm hover:bg-white/10 transition-colors">Catálogo (Markdown)</a>
            <a href="https://api.ragfly.ai/docs" target="_blank" rel="noopener noreferrer" className="border border-white/30 text-slm-light px-5 py-2.5 rounded-full font-medium text-sm hover:bg-white/10 transition-colors">Swagger API</a>
            <a href="/build/quickstart" className="border border-white/30 text-slm-light px-5 py-2.5 rounded-full font-medium text-sm hover:bg-white/10 transition-colors">Quickstart →</a>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* BuiltSection — "Cómo está construido"                                */
/* ------------------------------------------------------------------ */
function BuiltSection() {
  const t = useTranslations()
  const items = [0, 1, 2, 3].map((i) => ({
    titulo: t(`construido.item${i}Titulo` as Parameters<typeof t>[0]),
    desc: t(`construido.item${i}Desc` as Parameters<typeof t>[0]),
  }))
  return (
    <section id="construido" className="px-6 md:px-12 lg:px-[60px] py-24 md:py-32 bg-white">
      <div className="max-w-[1200px] mx-auto flex flex-col gap-16">
        <div className="max-w-[680px] flex flex-col gap-6">
          <span className="text-sm uppercase tracking-[0.18em] text-slm-brand">{t('construido.eyebrow')}</span>
          <BlurIn as="h2" className="text-slm-dark text-4xl md:text-5xl lg:text-6xl font-helvetica-neue font-medium leading-[1.05] tracking-[-0.03em]">
            {t('construido.titulo1')}{' '}
            <span className="inline-block pb-[0.06em] bg-gradient-to-r from-slm-brand-dark via-slm-brand to-slm-brand-light bg-clip-text text-transparent">{t('construido.tituloAccent')}</span>
          </BlurIn>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {items.map((c, i) => (
            <div key={c.titulo} className="rounded-[24px] bg-slm-light p-8 border border-slm-dark/5 flex flex-col gap-3">
              <div className="flex items-baseline justify-between">
                <h3 className="text-xl md:text-2xl font-helvetica-neue font-medium text-slm-dark tracking-[-0.02em]">{c.titulo}</h3>
                <span className="text-xs text-slm-gray-light">0{i + 1}</span>
              </div>
              <p className="text-slm-gray font-helvetica-neue text-base leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* SecuritySection                                                      */
/* ------------------------------------------------------------------ */
function SecuritySection() {
  const t = useTranslations()
  const puntos = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => t(`seguridad.punto${i}` as Parameters<typeof t>[0]))
  return (
    <section id="seguridad" className="px-6 md:px-12 lg:px-[60px] py-24 md:py-32 bg-slm-dark text-slm-light relative overflow-hidden">
      <div className="absolute inset-0 opacity-40 pointer-events-none"
        style={{ background: 'radial-gradient(700px 500px at 90% 10%, rgba(0,138,209,0.30), transparent 60%), radial-gradient(600px 400px at 0% 90%, rgba(204,232,246,0.15), transparent 70%)' }} />
      <div className="relative max-w-[1200px] mx-auto grid lg:grid-cols-2 gap-16 items-start">
        <div className="flex flex-col gap-8">
          <span className="text-sm uppercase tracking-[0.18em] text-slm-brand-light">{t('seguridad.eyebrow')}</span>
          <BlurIn as="h2" className="text-4xl md:text-5xl lg:text-6xl font-helvetica-neue font-medium leading-[1.05] tracking-[-0.03em]">
            {t('seguridad.titulo1')} <span className="text-slm-brand-light">{t('seguridad.tituloAccent')}</span>
          </BlurIn>
          <p className="text-base md:text-lg text-slm-gray-light font-helvetica-neue max-w-[480px] leading-relaxed">
            {t('seguridad.descripcion')}
          </p>
        </div>
        <ul className="flex flex-col gap-px bg-white/10 rounded-[24px] overflow-hidden border border-white/10">
          {puntos.map((p, i) => (
            <li key={i} className="bg-slm-dark px-6 py-5 flex gap-4 items-start">
              <span className="text-xs text-slm-brand-light mt-1 flex-none">{String(i + 1).padStart(2, '0')}</span>
              <span className="font-helvetica-neue text-base md:text-lg text-slm-light/90 leading-snug">{p}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* PricingSection                                                       */
/* ------------------------------------------------------------------ */
function PricingSection() {
  const t = useTranslations()
  const plans = planesMeta.plans
  return (
    <section id="planes" className="px-6 md:px-12 lg:px-[60px] py-24 md:py-32 bg-slm-light">
      <div className="max-w-[1280px] mx-auto flex flex-col gap-16">
        <div className="max-w-[760px] flex flex-col gap-6">
          <span className="text-sm uppercase tracking-[0.18em] text-slm-brand">{t('planes.eyebrow')}</span>
          <BlurIn as="h2" className="text-slm-dark text-4xl md:text-5xl lg:text-6xl font-helvetica-neue font-medium leading-[1.05] tracking-[-0.03em]">
            {t('planes.titulo')}
          </BlurIn>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {plans.map(({ idx, featured, featureCount }) => {
            const nombre = t(`planes.plan${idx}Nombre` as Parameters<typeof t>[0])
            const sub = t(`planes.plan${idx}Sub` as Parameters<typeof t>[0])
            const precio = t(`planes.plan${idx}Precio` as Parameters<typeof t>[0])
            const cta = t(`planes.plan${idx}Cta` as Parameters<typeof t>[0])
            const feats = Array.from({ length: featureCount }, (_, fi) =>
              t(`planes.plan${idx}F${fi}` as Parameters<typeof t>[0])
            )
            return (
              <div
                key={nombre}
                className={`rounded-[24px] p-8 flex flex-col gap-6 border ${featured ? 'bg-slm-dark text-slm-light border-slm-brand-dark' : 'bg-white border-slm-dark/8'}`}
              >
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <h3 className={`font-helvetica-neue text-2xl font-medium tracking-[-0.02em] ${featured ? 'text-white' : 'text-slm-dark'}`}>{nombre}</h3>
                    {featured && <span className="text-[10px] uppercase tracking-[0.15em] bg-slm-brand-light/20 text-slm-brand-light px-2 py-1 rounded-full">{t('planes.recomendado')}</span>}
                  </div>
                  <p className={`font-helvetica-neue text-sm ${featured ? 'text-slm-gray-light' : 'text-slm-gray'}`}>{sub}</p>
                </div>
                <div className={`font-helvetica-neue text-lg font-medium ${featured ? 'text-white' : 'text-slm-dark'}`}>{precio}</div>
                <ul className="flex flex-col gap-3 flex-1">
                  {feats.map((f, i) => (
                    <li key={i} className={`flex gap-2 text-sm font-helvetica-neue leading-snug ${featured ? 'text-slm-light/90' : 'text-slm-gray'}`}>
                      <span className={`mt-1.5 inline-block w-1 h-1 rounded-full flex-none ${featured ? 'bg-slm-brand-light' : 'bg-slm-brand'}`} />{f}
                    </li>
                  ))}
                </ul>
                <a
                  href="https://app.ragfly.ai"
                  className={`text-center font-medium text-sm px-5 py-3 rounded-full transition-opacity hover:opacity-90 ${featured ? 'bg-slm-brand-light text-slm-dark' : 'bg-slm-dark text-slm-light'}`}
                >
                  {cta}
                </a>
              </div>
            )
          })}
        </div>
        <p className="max-w-[900px] text-slm-gray font-helvetica-neue text-base leading-relaxed">{t('planes.nota')}</p>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* WhyUsSection — "Por qué RAGfly" · 6 razones                          */
/* ------------------------------------------------------------------ */
function WhyUsSection() {
  const t = useTranslations()
  const items = [0, 1, 2, 3, 4, 5].map((i) => ({
    titulo: t(`porQue.item${i}Titulo` as Parameters<typeof t>[0]),
    desc: t(`porQue.item${i}Desc` as Parameters<typeof t>[0]),
  }))
  return (
    <section id="por-que" className="px-6 md:px-12 lg:px-[60px] py-24 md:py-32 bg-white">
      <div className="max-w-[1200px] mx-auto flex flex-col gap-16">
        <div className="max-w-[680px] flex flex-col gap-6">
          <span className="text-sm uppercase tracking-[0.18em] text-slm-brand">{t('porQue.eyebrow')}</span>
          <BlurIn as="h2" className="text-slm-dark text-4xl md:text-5xl lg:text-6xl font-helvetica-neue font-medium leading-[1.05] tracking-[-0.03em]">
            {t('porQue.titulo')}
          </BlurIn>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((r, i) => {
            const azul = i === 0
            return (
              <div
                key={r.titulo}
                className={`rounded-[24px] p-8 flex flex-col gap-4 ${azul ? 'bg-gradient-to-br from-slm-brand-dark via-slm-brand to-slm-brand-light text-white' : 'bg-slm-light'}`}
              >
                <span className={`text-xs ${azul ? 'text-white/70' : 'text-slm-gray-light'}`}>{String(i + 1).padStart(2, '0')}</span>
                <h3 className={`font-helvetica-neue text-2xl font-medium tracking-[-0.02em] leading-tight ${azul ? 'text-white' : 'text-slm-dark'}`}>{r.titulo}</h3>
                <p className={`font-helvetica-neue text-base leading-relaxed ${azul ? 'text-white/85' : 'text-slm-gray'}`}>{r.desc}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* FinalCTASection                                                      */
/* ------------------------------------------------------------------ */
function FinalCTASection() {
  const t = useTranslations()
  return (
    <section id="contacto" className="px-6 md:px-12 lg:px-[60px] py-24 md:py-32 bg-slm-light">
      <div className="max-w-[1100px] mx-auto rounded-[40px] p-10 md:p-16 lg:p-20 bg-gradient-to-br from-slm-brand-dark via-slm-brand to-slm-brand-light relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <div className="relative flex flex-col items-start gap-8 max-w-[640px]">
          <span className="text-sm uppercase tracking-[0.18em] text-white/80">{t('cta.eyebrow')}</span>
          <h2 className="text-white text-4xl md:text-5xl lg:text-6xl font-helvetica-neue font-medium leading-[1.05] tracking-[-0.03em]">
            {t('cta.titulo')}
          </h2>
          <p className="text-white/85 font-helvetica-neue text-base md:text-lg max-w-[480px] leading-relaxed">
            {t('cta.subtitulo')}
          </p>
          <div className="flex flex-col sm:flex-row items-start gap-3">
            <a href="https://app.ragfly.ai" className="bg-white text-slm-dark px-7 py-3.5 rounded-full font-medium text-base hover:opacity-90 transition-opacity">
              {t('cta.ctaPrimario')}
            </a>
            <a href="#pruebalo" className="border border-white/40 text-white px-7 py-3.5 rounded-full font-medium text-base hover:bg-white/10 transition-colors">
              {t('cta.ctaSecundario')}
            </a>
          </div>
          <div className="w-full pt-6 mt-2 border-t border-white/20">
            <WaitlistForm variant="onDark" />
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Footer                                                               */
/* ------------------------------------------------------------------ */
function Footer() {
  const t = useTranslations()
  const year = new Date().getFullYear()
  return (
    <footer className="px-6 md:px-12 lg:px-[60px] py-16 bg-slm-dark text-slm-gray-light">
      <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row gap-10 md:gap-16 items-start justify-between">
        <div className="flex flex-col gap-4 max-w-[320px]">
          <div className="flex items-center gap-2.5 font-manrope font-semibold text-2xl text-white">
            <Image src="/ragfly_isotipo.png" alt="" width={28} height={28} className="h-7 w-auto brightness-0 invert" style={{ filter: 'brightness(0) invert(1)' }} />
            RAGfly
          </div>
          <p className="font-helvetica-neue text-sm leading-relaxed">{t('footer.tagline')}</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-10">
          <div className="flex flex-col gap-3">
            <span className="text-xs uppercase tracking-[0.18em] text-white/60">{t('footer.producto' as Parameters<typeof t>[0])}</span>
            <a href="#que-es" className="font-helvetica-neue text-sm hover:text-white">{t('footer.capacidades')}</a>
            <a href="#como-se-usa" className="font-helvetica-neue text-sm hover:text-white">{t('footer.comoFunciona')}</a>
            <a href="#como-se-usa" className="font-helvetica-neue text-sm hover:text-white">{t('footer.paraAgentes')}</a>
            <a href="#planes" className="font-helvetica-neue text-sm hover:text-white">{t('footer.planesLink')}</a>
          </div>
          <div className="flex flex-col gap-3">
            <span className="text-xs uppercase tracking-[0.18em] text-white/60">{t('footer.empresa' as Parameters<typeof t>[0])}</span>
            <a href="#seguridad" className="font-helvetica-neue text-sm hover:text-white">{t('footer.seguridadLink')}</a>
            <a href="#contacto" className="font-helvetica-neue text-sm hover:text-white">{t('footer.contacto')}</a>
            <a href="https://api.ragfly.ai/docs" target="_blank" rel="noopener noreferrer" className="font-helvetica-neue text-sm hover:text-white">Swagger API</a>
            <a href="/build/quickstart" className="font-helvetica-neue text-sm hover:text-white">Quickstart</a>
            <a href="/llms.txt" className="font-helvetica-neue text-sm hover:text-white">llms.txt</a>
            <a href="/agents.json" className="font-helvetica-neue text-sm hover:text-white">agents.json</a>
          </div>
          <div className="flex flex-col gap-3">
            <span className="text-xs uppercase tracking-[0.18em] text-white/60">{t('footer.legal')}</span>
            <a href="/legal/terms" className="font-helvetica-neue text-sm hover:text-white">{t('footer.terminos')}</a>
            <a href="/legal/privacy" className="font-helvetica-neue text-sm hover:text-white">{t('footer.privacidad')}</a>
          </div>
        </div>
      </div>
      <div className="max-w-[1200px] mx-auto mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between gap-3 text-xs font-helvetica-neue">
        <span>{t('footer.copyright', { year })}</span>
        <span>{t('footer.actualizado', { fecha: agentes.actualizado })}</span>
      </div>
    </footer>
  )
}

/* ------------------------------------------------------------------ */
/* Page                                                                 */
/* ------------------------------------------------------------------ */
export default function Home() {
  return (
    <main className="flex flex-col min-h-full">
      <div className="h-screen flex flex-col relative overflow-hidden">
        <HeroBg />
        <Header />
        <Hero />
      </div>
      <BuildingSection />
      <ProblemSolutionSection />
      <WhatIsSection />
      <CombinaSection />
      <ChatSection />
      <IdentitiesSection />
      <ModesSection />
      <SurfacesSection />
      <BuiltSection />
      <SecuritySection />
      <PricingSection />
      <WhyUsSection />
      <FinalCTASection />
      <Footer />
    </main>
  )
}
