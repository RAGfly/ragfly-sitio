'use client'

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

/* Entrada escalonada de REGfly — mismo movimiento que ConfigContextoSection de RAGfly:
   curva larga, sin spring (nada rebota), 0,1 s entre elemento y elemento, una sola vez. */

const EASE = [0.22, 1, 0.36, 1] as const

const TAGS = { div: motion.div, li: motion.li, details: motion.details } as const

export function Escalonado({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      initial="h"
      whileInView="s"
      viewport={{ once: true, amount: 0.15 }}
      variants={{ h: {}, s: { transition: { staggerChildren: 0.1 } } }}
    >
      {children}
    </motion.div>
  )
}

export function Item({
  children,
  className = '',
  as = 'div',
}: {
  children: ReactNode
  className?: string
  as?: keyof typeof TAGS
}) {
  const Tag = TAGS[as]
  return (
    <Tag
      className={className}
      variants={{ h: { opacity: 0, y: 16 }, s: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } } }}
    >
      {children}
    </Tag>
  )
}
