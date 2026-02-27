'use client'

import { motion } from 'framer-motion'

export function SproutAnimation() {
  return (
    <div className="mb-4 flex items-end justify-center" style={{ height: 80 }}>
      <svg width="64" height="80" viewBox="0 0 64 80" fill="none">
        {/* Stem */}
        <motion.path
          d="M32 78 C32 78 32 45 32 35"
          stroke="#2D6A6A"
          strokeWidth="3"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
        />
        {/* Left leaf */}
        <motion.path
          d="M32 50 C22 45 14 38 18 28 C22 32 28 40 32 50"
          fill="#2D6A6A"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.9 }}
          style={{ transformOrigin: '32px 50px' }}
        />
        {/* Right leaf */}
        <motion.path
          d="M32 42 C42 37 50 30 46 20 C42 24 36 32 32 42"
          fill="#3A8585"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 1.2 }}
          style={{ transformOrigin: '32px 42px' }}
        />
        {/* Seed / soil dot */}
        <motion.circle
          cx="32"
          cy="78"
          r="4"
          fill="#D4943A"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 10, delay: 0.1 }}
        />
      </svg>
    </div>
  )
}
