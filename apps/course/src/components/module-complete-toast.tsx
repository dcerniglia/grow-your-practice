'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type ModuleCompleteToastProps = {
  moduleTitle: string
  message: string
  onDismiss: () => void
}

export function ModuleCompleteToast({ moduleTitle, message, onDismiss }: ModuleCompleteToastProps) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(onDismiss, 400)
    }, 4000)
    return () => clearTimeout(timer)
  }, [onDismiss])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="fixed bottom-6 right-6 z-50 max-w-sm overflow-hidden rounded-card bg-surface p-5 shadow-lg"
        >
          {/* Floating golden dots */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute h-1.5 w-1.5 rounded-full bg-accent"
                initial={{
                  x: 20 + Math.random() * 200,
                  y: 60,
                  opacity: 0.8,
                }}
                animate={{
                  y: -20,
                  opacity: 0,
                }}
                transition={{
                  duration: 2 + Math.random(),
                  delay: Math.random() * 0.5,
                  repeat: 1,
                  ease: 'easeOut',
                }}
              />
            ))}
          </div>

          <div className="relative">
            <p className="text-sm font-medium text-accent">Module Complete!</p>
            <p className="mt-1 font-heading text-lg text-text">{moduleTitle}</p>
            <p className="mt-2 text-sm text-text-muted">{message}</p>
          </div>

          <button
            onClick={() => {
              setVisible(false)
              setTimeout(onDismiss, 400)
            }}
            className="absolute right-3 top-3 text-text-light hover:text-text"
          >
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
