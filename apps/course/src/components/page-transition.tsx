'use client'

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: 'easeOut' as const },
}

export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={fadeUp.initial}
      animate={fadeUp.animate}
      transition={fadeUp.transition}
    >
      {children}
    </motion.div>
  )
}
