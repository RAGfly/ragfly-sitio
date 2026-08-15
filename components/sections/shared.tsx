'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

/* ------------------------------------------------------------------ */
/* BlurIn                                                               */
/* ------------------------------------------------------------------ */
export function BlurIn({
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
  // @ts-expect-error motion supports dynamic intrinsic tags here.
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
