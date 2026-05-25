'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { SelectorIdioma } from '../components/SelectorIdioma'

/* ------------------------------------------------------------------ */
/* BlurIn                                                               */
/* ------------------------------------------------------------------ */
function BlurIn({
  children,
  as: Tag = 'div',
  className = '',
  delay = 0,
}: {
  children: React.ReactNode
  as?: keyof React.JSX.IntrinsicElements
  className?: string
  delay?: number
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
  const tiles = Array.from({ length: 14 }, (_, i) => ({
    id: i,
    left: ((i * 73 + 11) % 100),
    delay: -(Math.random() * 18).toFixed(2),
    dur: (14 + Math.random() * 14).toFixed(2),
    rot: `${(Math.random() * 14 - 7).toFixed(1)}deg`,
    scale: (0.6 + Math.random() * 0.7).toFixed(2),
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
    { l: t('nav.producto'), h: '#dos-formas' },
    { l: t('nav.capacidades'), h: '#capacidades' },
    { l: t('nav.comoFunciona'), h: '#como-funciona' },
    { l: t('nav.seguridad'), h: '#seguridad' },
    { l: t('nav.planes'), h: '#planes' },
  ]

  return (
    <header className="sticky top-0 left-0 right-0 flex justify-between items-center px-6 md:px-12 lg:px-15 py-6 z-20 bg-white/80 backdrop-blur-sm">
      <div className="flex items-center gap-10">
        <a href="#" className="flex items-center gap-2.5" aria-label="Server LM">
          <Image src="/serverlm_isotipo.png" alt="" width={28} height={28} className="h-7 w-auto" />
          <span className="font-manrope font-semibold text-2xl text-slm-dark tracking-tight">Server LM</span>
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
        <a href="https://app.serverlm.ai" className="text-base font-medium text-slm-dark hover:opacity-70 transition-opacity">
          {t('nav.iniciarSesion')}
        </a>
        <a
          href="https://app.serverlm.ai"
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
              <a href="https://app.serverlm.ai" className="font-medium text-base text-slm-dark">
                {t('nav.iniciarSesion')}
              </a>
              <a
                href="https://app.serverlm.ai"
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
      <div className="flex-1 flex flex-col items-center justify-center z-10 gap-5">
        <BlurIn
          as="h1"
          className="text-center font-helvetica-neue font-medium leading-[1.05] text-slm-dark max-w-3xl"
        >
          <span className="block text-4xl md:text-6xl lg:text-7xl tracking-[-0.03em]">{t('hero.headlineLead')}</span>
          <span className="block text-4xl md:text-6xl lg:text-7xl tracking-[-0.03em] bg-gradient-to-r from-slm-brand-dark via-slm-brand to-slm-brand-light bg-clip-text text-transparent">
            {t('hero.headlineAccent')}
          </span>
        </BlurIn>
        <BlurIn delay={0.1} className="font-helvetica-neue text-lg md:text-xl text-slm-gray tracking-[0.01em]">
          {t('hero.tagline')}
        </BlurIn>
      </div>
      <div className="z-10 flex flex-col items-center gap-7 max-w-xl text-center">
        <BlurIn delay={0.3} className="flex flex-col sm:flex-row items-center gap-3">
          <a
            href="https://app.serverlm.ai"
            className="bg-slm-dark text-slm-light px-7 py-3 rounded-full font-medium text-base hover:opacity-90 transition-opacity"
          >
            {t('hero.ctaPrimario')}
          </a>
          <a
            href="#dos-formas"
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
/* Card visuals (CSS-only)                                              */
/* ------------------------------------------------------------------ */
function Card1Visual() {
  return (
    <div className="card-visual card1-bg grain">
      <div className="card1-ring r2" />
      <div className="card1-ring" />
      <div className="card1-shield" />
      <svg className="absolute inset-0" viewBox="0 0 400 400" preserveAspectRatio="none">
        {Array.from({ length: 8 }, (_, i) => {
          const a = (i / 8) * Math.PI * 2
          const cx = 200 + Math.cos(a) * 150
          const cy = 170 + Math.sin(a) * 150
          return (
            <g key={i}>
              <line x1="200" y1="170" x2={cx} y2={cy} stroke="rgba(30,74,130,0.18)" strokeWidth="1" strokeDasharray="2 4" />
              <circle cx={cx} cy={cy} r="3.2" fill="#1E4A82" opacity="0.8" />
            </g>
          )
        })}
      </svg>
    </div>
  )
}

function Card2Visual() {
  const greetings = ['Hola', 'Hello', 'Olá', 'Bonjour', 'Hallo', 'Hola']
  return (
    <div className="card-visual card2-bg grain">
      <div className="greeting-stack" aria-hidden="true">
        <ul>
          {greetings.map((g, i) => <li key={i}>{g}</li>)}
        </ul>
      </div>
      <div className="flag-dots" aria-hidden="true">
        <span className="on" /><span /><span /><span /><span />
      </div>
    </div>
  )
}

function Card3Visual() {
  return (
    <div className="card-visual card3-bg grain">
      <div className="org-grid" aria-hidden="true">
        {[1, 2, 3].map((i) => (
          <div key={i} className={`org-card c${i}`}>
            <span className="accent" />
            <span className="ln a" /><span className="ln b" /><span className="ln c" />
          </div>
        ))}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* InsightsSection                                                      */
/* ------------------------------------------------------------------ */
function InsightsSection() {
  const t = useTranslations()
  const cards = [
    { visual: <Card1Visual />, overlay: 'rgba(206,223,235,0.25)', stat: t('insights.card1Stat'), desc: t('insights.card1Desc'), minH: 'min-h-[450px]' },
    { visual: <Card2Visual />, overlay: 'rgba(247,236,233,0.6)', stat: t('insights.card2Stat'), desc: t('insights.card2Desc'), minH: 'min-h-[350px]' },
    { visual: <Card3Visual />, overlay: 'rgba(218,218,218,0.2)', stat: t('insights.card3Stat'), desc: t('insights.card3Desc'), minH: 'min-h-[450px]' },
  ]
  return (
    <section className="px-6 md:px-12 lg:px-[60px] py-20 bg-white flex flex-col gap-[90px]">
      <div className="max-w-[517px] flex flex-col gap-10">
        <BlurIn as="h2" className="text-slm-dark text-4xl md:text-5xl lg:text-6xl font-helvetica-neue font-medium leading-[1] lg:leading-[60px] tracking-[-0.03em]">
          {t('insights.titulo')}
        </BlurIn>
        <BlurIn as="p" className="text-slm-gray text-base md:text-lg lg:text-xl font-helvetica-neue max-w-[420px] leading-snug">
          {t('insights.subtitulo')}
        </BlurIn>
      </div>
      <motion.div
        className="flex flex-col lg:flex-row items-stretch lg:items-end gap-5"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.2 } } }}
      >
        {cards.map((c, i) => (
          <motion.div
            key={i}
            className={`flex-1 p-10 rounded-[40px] relative overflow-hidden flex flex-col justify-end ${c.minH}`}
            variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } } }}
          >
            {c.visual}
            <div className="absolute inset-0" style={{ background: c.overlay }} />
            <div className="relative z-10 flex flex-col gap-5">
              <span className="text-5xl md:text-[60px] font-helvetica-neue font-medium leading-[1] text-slm-dark">{c.stat}</span>
              <p className="text-lg md:text-[22px] font-helvetica-neue opacity-80 text-slm-gray leading-snug max-w-[377px]">{c.desc}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* ZeroSetupSection                                                     */
/* ------------------------------------------------------------------ */
function ZeroSetupSection() {
  const t = useTranslations()
  const bullets = [0, 1, 2].map((i) => t(`zeroSetup.bullet${i}` as Parameters<typeof t>[0]))
  const folders = [0, 1, 2, 3].map((i) => ({
    name: t(`zeroSetup.folder${i}Name` as Parameters<typeof t>[0]),
    count: t(`zeroSetup.folder${i}Count` as Parameters<typeof t>[0]),
  }))
  return (
    <section className="px-6 md:px-12 lg:px-[60px] py-24 md:py-32 bg-white">
      <div className="max-w-[1280px] mx-auto grid lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-20 items-center">
        <div className="flex flex-col gap-7">
          <span className="text-sm uppercase tracking-[0.18em] text-slm-brand">{t('zeroSetup.eyebrow')}</span>
          <BlurIn as="h2" className="text-slm-dark text-4xl md:text-5xl lg:text-6xl font-helvetica-neue font-medium leading-[1.05] tracking-[-0.03em]">
            {t('zeroSetup.titulo1')}{' '}
            <span className="bg-gradient-to-r from-slm-brand-dark via-slm-brand to-slm-brand-light bg-clip-text text-transparent">{t('zeroSetup.tituloAccent')}</span>
          </BlurIn>
          <p className="text-slm-gray font-helvetica-neue text-base md:text-lg leading-relaxed max-w-[480px]">
            {t('zeroSetup.descripcion')}
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
                    <stop offset="0%" stopColor="#4089CD" stopOpacity="0.1" />
                    <stop offset="100%" stopColor="#4089CD" stopOpacity="0.8" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <div className="text-xs uppercase tracking-[0.18em] text-slm-dark/40 mb-4">{t('zeroSetup.seleccionados')}</div>

            <ul className="flex flex-col gap-2.5">
              {folders.map((f, i) => (
                <li
                  key={i}
                  className="group flex items-center gap-3 p-3.5 rounded-xl bg-white border border-slm-dark/8"
                  style={{ animation: 'folderScan 6s ease-in-out infinite', animationDelay: `${i * 0.6}s` }}
                >
                  <span className="inline-flex items-center justify-center w-9 h-9 rounded-md bg-slm-light border border-slm-dark/8 flex-none">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1E4A82" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" />
                    </svg>
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-slm-dark truncate">{f.name}</div>
                    <div className="text-xs text-slm-dark/50">{f.count}</div>
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.18em] flex-none zs-status">{t('zeroSetup.indexado')}</span>
                </li>
              ))}
            </ul>

            <div className="mt-5 flex items-center justify-between rounded-xl bg-slm-dark text-slm-light px-4 py-3">
              <span className="text-xs uppercase tracking-[0.18em] text-slm-brand-light">{t('zeroSetup.pipeline')}</span>
              <span className="text-sm flex items-center gap-2">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-slm-brand-light animate-pulse" />
                {t('zeroSetup.reindexacion')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* TwoPathsSection                                                      */
/* ------------------------------------------------------------------ */
function TwoPathsSection() {
  const t = useTranslations()
  const paths = [
    {
      tag: t('dosFormas.cardATag'),
      h: t('dosFormas.cardATitulo'),
      d: t('dosFormas.cardADesc'),
      bullets: [0, 1, 2].map((i) => t(`dosFormas.cardAB${i}` as Parameters<typeof t>[0])),
      cta: t('dosFormas.cardACta'),
      dark: false,
    },
    {
      tag: t('dosFormas.cardBTag'),
      h: t('dosFormas.cardBTitulo'),
      d: t('dosFormas.cardBDesc'),
      bullets: [0, 1, 2].map((i) => t(`dosFormas.cardBB${i}` as Parameters<typeof t>[0])),
      cta: t('dosFormas.cardBCta'),
      dark: true,
    },
  ]
  return (
    <section id="dos-formas" className="px-6 md:px-12 lg:px-[60px] py-24 md:py-32 bg-white">
      <div className="max-w-[1280px] mx-auto flex flex-col gap-16">
        <div className="max-w-[720px] flex flex-col gap-6">
          <span className="text-sm uppercase tracking-[0.18em] text-slm-brand">{t('dosFormas.eyebrow')}</span>
          <BlurIn as="h2" className="text-slm-dark text-4xl md:text-5xl lg:text-6xl font-helvetica-neue font-medium leading-[1.05] tracking-[-0.03em]">
            {t('dosFormas.titulo1')}{' '}
            <em className="not-italic bg-gradient-to-r from-slm-brand-dark via-slm-brand to-slm-brand-light bg-clip-text text-transparent">{t('dosFormas.tituloEm')}</em>{' '}
            {t('dosFormas.titulo2')}
          </BlurIn>
          <p className="text-base md:text-lg text-slm-gray font-helvetica-neue max-w-[560px] leading-relaxed">
            {t('dosFormas.descripcion')}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-5">
          {paths.map((p) => (
            <div
              key={p.tag}
              className={`rounded-[32px] p-8 md:p-10 lg:p-12 flex flex-col gap-7 min-h-[520px] relative overflow-hidden border ${
                p.dark ? 'bg-slm-dark text-slm-light border-slm-brand-dark/40' : 'bg-slm-light text-slm-dark border-slm-dark/8'
              }`}
            >
              {p.dark && (
                <div
                  className="absolute inset-0 opacity-50 pointer-events-none"
                  style={{ background: 'radial-gradient(600px 400px at 90% 0%, rgba(64,137,205,0.28), transparent 70%)' }}
                />
              )}
              <div className="relative flex flex-col gap-7 flex-1">
                <span className={`text-xs uppercase tracking-[0.18em] ${p.dark ? 'text-slm-brand-light' : 'text-slm-brand'}`}>{p.tag}</span>
                <h3 className={`font-helvetica-neue text-3xl md:text-4xl font-medium leading-[1.1] tracking-[-0.02em] ${p.dark ? 'text-white' : 'text-slm-dark'}`}>{p.h}</h3>
                <p className={`font-helvetica-neue text-base md:text-lg leading-relaxed ${p.dark ? 'text-slm-light/85' : 'text-slm-gray'}`}>{p.d}</p>
                <ul className="flex flex-col gap-3 mt-auto">
                  {p.bullets.map((b, i) => (
                    <li key={i} className={`flex gap-3 text-sm md:text-base font-helvetica-neue leading-snug ${p.dark ? 'text-slm-light/90' : 'text-slm-dark/80'}`}>
                      <span className={`mt-1.5 inline-block w-1.5 h-1.5 rounded-full flex-none ${p.dark ? 'bg-slm-brand-light' : 'bg-slm-brand'}`} />{b}
                    </li>
                  ))}
                </ul>
                <a
                  href="#contacto"
                  className={`relative inline-flex w-fit items-center gap-2 px-6 py-3 rounded-full font-medium text-sm md:text-base transition-opacity hover:opacity-90 ${
                    p.dark ? 'bg-slm-brand-light text-slm-dark' : 'bg-slm-dark text-slm-light'
                  }`}
                >
                  {p.cta}
                  <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* ProblemSolutionSection                                               */
/* ------------------------------------------------------------------ */
function ProblemSolutionSection() {
  const t = useTranslations()
  const sin = [0, 1, 2, 3, 4].map((i) => t(`problema.sin${i}` as Parameters<typeof t>[0]))
  const con = [0, 1, 2, 3, 4].map((i) => t(`problema.con${i}` as Parameters<typeof t>[0]))
  return (
    <section id="producto" className="px-6 md:px-12 lg:px-[60px] py-24 md:py-32 bg-slm-dark text-slm-light relative overflow-hidden">
      <div className="absolute inset-0 opacity-30 pointer-events-none"
        style={{ background: 'radial-gradient(800px 500px at 80% 20%, rgba(64,137,205,0.35), transparent 60%), radial-gradient(700px 500px at 10% 90%, rgba(122,180,221,0.18), transparent 70%)' }} />
      <div className="relative max-w-[1200px] mx-auto flex flex-col gap-16">
        <div className="max-w-[640px] flex flex-col gap-6">
          <span className="text-sm uppercase tracking-[0.18em] text-slm-brand-light">{t('problema.eyebrow')}</span>
          <BlurIn as="h2" className="text-4xl md:text-5xl lg:text-6xl font-helvetica-neue font-medium leading-[1.05] tracking-[-0.03em]">
            {t('problema.titulo1')} <span className="text-slm-brand-light">{t('problema.tituloAccent')}</span>
          </BlurIn>
          <p className="text-base md:text-lg text-slm-gray-light font-helvetica-neue max-w-[520px] leading-relaxed">
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
/* CapabilitiesSection                                                  */
/* ------------------------------------------------------------------ */
function CapabilitiesSection() {
  const t = useTranslations()
  const caps = [0, 1, 2, 3, 4, 5].map((i) => ({
    titulo: t(`capacidades.item${i}Titulo` as Parameters<typeof t>[0]),
    desc: t(`capacidades.item${i}Desc` as Parameters<typeof t>[0]),
  }))
  return (
    <section id="capacidades" className="px-6 md:px-12 lg:px-[60px] py-24 md:py-32 bg-slm-light">
      <div className="max-w-[1200px] mx-auto flex flex-col gap-16">
        <div className="max-w-[680px] flex flex-col gap-6">
          <span className="text-sm uppercase tracking-[0.18em] text-slm-brand">{t('capacidades.eyebrow')}</span>
          <BlurIn as="h2" className="text-slm-dark text-4xl md:text-5xl lg:text-6xl font-helvetica-neue font-medium leading-[1.05] tracking-[-0.03em]">
            {t('capacidades.titulo1')}{' '}
            <span className="bg-gradient-to-r from-slm-brand-dark via-slm-brand to-slm-brand-light bg-clip-text text-transparent">
              {t('capacidades.tituloAccent')}
            </span>
            {t('capacidades.titulo2')}
          </BlurIn>
        </div>
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
          initial="h" whileInView="s" viewport={{ once: true, amount: 0.2 }}
          variants={{ h: {}, s: { transition: { staggerChildren: 0.08 } } }}
        >
          {caps.map((c, i) => (
            <motion.div
              key={c.titulo}
              variants={{ h: { opacity: 0, y: 20 }, s: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } } }}
              className="rounded-[24px] bg-white p-8 border border-slm-dark/5 hover:border-slm-brand/40 transition-colors flex flex-col gap-4 min-h-[220px]"
            >
              <div className="flex items-baseline justify-between">
                <h3 className="text-2xl md:text-3xl font-helvetica-neue font-medium text-slm-dark tracking-[-0.02em]">{c.titulo}</h3>
                <span className="text-xs text-slm-gray-light">0{i + 1}</span>
              </div>
              <p className="text-slm-gray font-helvetica-neue text-base md:text-[17px] leading-relaxed">{c.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* HowItWorksSection                                                    */
/* ------------------------------------------------------------------ */
function HowItWorksSection() {
  const t = useTranslations()
  const steps = [0, 1, 2, 3].map((i) => ({
    n: t(`comoFunciona.paso${i}N` as Parameters<typeof t>[0]),
    titulo: t(`comoFunciona.paso${i}Titulo` as Parameters<typeof t>[0]),
    desc: t(`comoFunciona.paso${i}Desc` as Parameters<typeof t>[0]),
  }))
  return (
    <section id="como-funciona" className="px-6 md:px-12 lg:px-[60px] py-24 md:py-32 bg-white">
      <div className="max-w-[1200px] mx-auto flex flex-col gap-16">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <div className="max-w-[640px] flex flex-col gap-6">
            <span className="text-sm uppercase tracking-[0.18em] text-slm-brand">{t('comoFunciona.eyebrow')}</span>
            <BlurIn as="h2" className="text-slm-dark text-4xl md:text-5xl lg:text-6xl font-helvetica-neue font-medium leading-[1.05] tracking-[-0.03em]">
              {t('comoFunciona.titulo')}
            </BlurIn>
          </div>
          <p className="max-w-[360px] text-slm-gray font-helvetica-neue text-base md:text-lg leading-relaxed">
            {t('comoFunciona.subtitulo')}
          </p>
        </div>
        <ol className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-slm-dark/8 rounded-[24px] overflow-hidden border border-slm-dark/8">
          {steps.map((s) => (
            <li key={s.n} className="bg-white p-8 md:p-10 flex flex-col gap-5 min-h-[260px] relative">
              <span className="font-helvetica-neue text-5xl md:text-6xl font-medium bg-gradient-to-br from-slm-brand-dark via-slm-brand to-slm-brand-light bg-clip-text text-transparent leading-none">
                {s.n}
              </span>
              <h3 className="font-helvetica-neue text-xl md:text-2xl font-medium text-slm-dark tracking-[-0.02em]">{s.titulo}</h3>
              <p className="text-slm-gray font-helvetica-neue text-base leading-relaxed">{s.desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* ModulesSection                                                       */
/* ------------------------------------------------------------------ */
function ModulesSection() {
  const t = useTranslations()
  const mods = [0, 1, 2].map((i) => ({
    key: t(`modulos.item${i}Key` as Parameters<typeof t>[0]),
    titulo: t(`modulos.item${i}Titulo` as Parameters<typeof t>[0]),
    desc: t(`modulos.item${i}Desc` as Parameters<typeof t>[0]),
  }))
  const chips = [0, 1, 2, 3, 4].map((i) => t(`modulos.agentsChip${i}` as Parameters<typeof t>[0]))
  return (
    <section className="px-6 md:px-12 lg:px-[60px] py-24 md:py-32 bg-white">
      <div className="max-w-[1200px] mx-auto flex flex-col gap-16">
        <div className="max-w-[680px] flex flex-col gap-6">
          <span className="text-sm uppercase tracking-[0.18em] text-slm-brand">{t('modulos.eyebrow')}</span>
          <BlurIn as="h2" className="text-slm-dark text-4xl md:text-5xl lg:text-6xl font-helvetica-neue font-medium leading-[1.05] tracking-[-0.03em]">
            {t('modulos.titulo')}
          </BlurIn>
        </div>

        <div className="rounded-[32px] p-8 md:p-10 lg:p-12 bg-gradient-to-br from-slm-dark via-slm-brand-dark to-slm-brand text-slm-light relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-30 pointer-events-none"
            style={{ background: 'radial-gradient(700px 400px at 90% 10%, rgba(122,180,221,0.40), transparent 65%)' }}
          />
          <div className="relative grid lg:grid-cols-[1fr_auto] gap-8 items-center">
            <div className="flex flex-col gap-4 max-w-[640px]">
              <div className="flex items-center gap-3">
                <span className="font-manrope font-bold text-sm tracking-[0.15em] text-white bg-white/15 px-3 py-1 rounded-full">{t('modulos.agentsTag')}</span>
                <span className="text-xs uppercase tracking-[0.18em] text-slm-brand-light">{t('modulos.agentsCapa')}</span>
              </div>
              <h3 className="font-helvetica-neue text-2xl md:text-3xl lg:text-4xl font-medium tracking-[-0.02em] leading-[1.15]">
                {t('modulos.agentsTitulo')}
              </h3>
              <p className="font-helvetica-neue text-base md:text-lg text-slm-light/85 leading-relaxed">
                {t('modulos.agentsDesc')}
              </p>
            </div>
            <div className="flex flex-wrap lg:flex-col gap-2 lg:gap-1.5 lg:items-end">
              {chips.map((c) => (
                <span key={c} className="text-xs md:text-sm text-white/85 bg-white/10 px-3 py-1.5 rounded-full whitespace-nowrap">{c}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {mods.map((m) => (
            <div key={m.key} className="rounded-[28px] p-10 border border-slm-dark/8 bg-gradient-to-br from-white to-slm-light/60 flex flex-col gap-5 min-h-[240px]">
              <div className="flex items-center gap-3">
                <span className="font-manrope font-bold text-sm tracking-[0.15em] text-slm-brand-dark bg-slm-brand-light/20 px-3 py-1 rounded-full">
                  {m.key}
                </span>
              </div>
              <h3 className="font-helvetica-neue text-2xl md:text-3xl font-medium text-slm-dark tracking-[-0.02em]">{m.titulo}</h3>
              <p className="text-slm-gray font-helvetica-neue text-base md:text-[17px] leading-relaxed">{m.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* TextFillSection                                                      */
/* ------------------------------------------------------------------ */
function TextFillSection() {
  const t = useTranslations()
  const ref = useRef<HTMLElement>(null)
  const [fill, setFill] = useState(0)
  const text = t('textFill')

  useEffect(() => {
    const onScroll = () => {
      const el = ref.current
      if (!el) return
      const top = el.getBoundingClientRect().top
      const wh = window.innerHeight
      const start = wh * 0.8, end = wh * 0.2
      let pct = top >= start ? 0 : top <= end ? 100 : ((start - top) / (start - end)) * 100
      setFill(Math.max(0, Math.min(100, pct)))
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll) }
  }, [])

  return (
    <section ref={ref} className="flex justify-center items-center px-6 md:px-16 py-24 md:py-32 bg-white mb-[30vh]">
      <div className="max-w-2xl w-full text-center relative">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-helvetica-neue font-medium leading-tight relative tracking-[-0.03em]">
          <span className="block text-slm-gray-light">{text}</span>
          <span
            className="absolute inset-0 bg-gradient-to-r from-slm-brand-dark via-slm-brand to-slm-brand-light bg-clip-text text-transparent"
            style={{ clipPath: `inset(0 ${100 - fill}% 0 0)`, transition: 'clip-path 0.1s linear' }}
          >
            {text}
          </span>
        </h2>
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
        style={{ background: 'radial-gradient(700px 500px at 90% 10%, rgba(64,137,205,0.30), transparent 60%), radial-gradient(600px 400px at 0% 90%, rgba(122,180,221,0.15), transparent 70%)' }} />
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
  const plans = [
    { idx: 0, featured: false, featureCount: 4 },
    { idx: 1, featured: false, featureCount: 5 },
    { idx: 2, featured: true, featureCount: 7 },
    { idx: 3, featured: false, featureCount: 5 },
  ]
  return (
    <section id="planes" className="px-6 md:px-12 lg:px-[60px] py-24 md:py-32 bg-slm-light">
      <div className="max-w-[1280px] mx-auto flex flex-col gap-16">
        <div className="max-w-[680px] flex flex-col gap-6">
          <span className="text-sm uppercase tracking-[0.18em] text-slm-brand">{t('planes.eyebrow')}</span>
          <BlurIn as="h2" className="text-slm-dark text-4xl md:text-5xl lg:text-6xl font-helvetica-neue font-medium leading-[1.05] tracking-[-0.03em]">
            {t('planes.titulo')}
          </BlurIn>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                  href="mailto:rufinocabreragaillard@gmail.com"
                  className={`text-center font-medium text-sm px-5 py-3 rounded-full transition-opacity hover:opacity-90 ${featured ? 'bg-slm-brand-light text-slm-dark' : 'bg-slm-dark text-slm-light'}`}
                >
                  {cta}
                </a>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* WhyUsSection                                                         */
/* ------------------------------------------------------------------ */
function WhyUsSection() {
  const t = useTranslations()
  const items = [0, 1, 2, 3].map((i) => ({
    titulo: t(`porQueNosotros.item${i}Titulo` as Parameters<typeof t>[0]),
    desc: t(`porQueNosotros.item${i}Desc` as Parameters<typeof t>[0]),
  }))
  return (
    <section className="px-6 md:px-12 lg:px-[60px] py-24 md:py-32 bg-white">
      <div className="max-w-[1200px] mx-auto flex flex-col gap-16">
        <div className="max-w-[680px] flex flex-col gap-6">
          <span className="text-sm uppercase tracking-[0.18em] text-slm-brand">{t('porQueNosotros.eyebrow')}</span>
          <BlurIn as="h2" className="text-slm-dark text-4xl md:text-5xl lg:text-6xl font-helvetica-neue font-medium leading-[1.05] tracking-[-0.03em]">
            {t('porQueNosotros.titulo')}
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
            <a href="https://app.serverlm.ai" className="bg-white text-slm-dark px-7 py-3.5 rounded-full font-medium text-base hover:opacity-90 transition-opacity">
              {t('cta.ctaPrimario')}
            </a>
            <a href="mailto:rufinocabreragaillard@gmail.com" className="border border-white/40 text-white px-7 py-3.5 rounded-full font-medium text-base hover:bg-white/10 transition-colors">
              {t('cta.ctaSecundario')}
            </a>
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
            <Image src="/serverlm_isotipo.png" alt="" width={28} height={28} className="h-7 w-auto brightness-0 invert" style={{ filter: 'brightness(0) invert(1)' }} />
            Server LM
          </div>
          <p className="font-helvetica-neue text-sm leading-relaxed">{t('footer.tagline')}</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-10">
          <div className="flex flex-col gap-3">
            <span className="text-xs uppercase tracking-[0.18em] text-white/60">{t('footer.producto' as Parameters<typeof t>[0])}</span>
            <a href="#capacidades" className="font-helvetica-neue text-sm hover:text-white">{t('footer.capacidades')}</a>
            <a href="#como-funciona" className="font-helvetica-neue text-sm hover:text-white">{t('footer.comoFunciona')}</a>
            <a href="#planes" className="font-helvetica-neue text-sm hover:text-white">{t('footer.planesLink')}</a>
          </div>
          <div className="flex flex-col gap-3">
            <span className="text-xs uppercase tracking-[0.18em] text-white/60">{t('footer.empresa' as Parameters<typeof t>[0])}</span>
            <a href="#seguridad" className="font-helvetica-neue text-sm hover:text-white">{t('footer.seguridadLink')}</a>
            <a href="#contacto" className="font-helvetica-neue text-sm hover:text-white">{t('footer.contacto')}</a>
          </div>
          <div className="flex flex-col gap-3">
            <span className="text-xs uppercase tracking-[0.18em] text-white/60">{t('footer.legal')}</span>
            <a href="#" className="font-helvetica-neue text-sm hover:text-white">{t('footer.terminos')}</a>
            <a href="#" className="font-helvetica-neue text-sm hover:text-white">{t('footer.privacidad')}</a>
          </div>
        </div>
      </div>
      <div className="max-w-[1200px] mx-auto mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between gap-3 text-xs font-helvetica-neue">
        <span>{t('footer.copyright', { year })}</span>
        <span>{t('footer.sitio')}</span>
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
      <InsightsSection />
      <ZeroSetupSection />
      <TwoPathsSection />
      <ProblemSolutionSection />
      <CapabilitiesSection />
      <HowItWorksSection />
      <ModulesSection />
      <TextFillSection />
      <SecuritySection />
      <PricingSection />
      <WhyUsSection />
      <FinalCTASection />
      <Footer />
    </main>
  )
}
