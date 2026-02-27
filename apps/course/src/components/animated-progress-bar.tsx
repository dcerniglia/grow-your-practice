'use client'

import { motion } from 'framer-motion'

type AnimatedProgressBarProps = {
  percent: number
  height?: string
  className?: string
}

export function AnimatedProgressBar({
  percent,
  height = 'h-3',
  className = '',
}: AnimatedProgressBarProps) {
  return (
    <div className={`overflow-hidden rounded-full bg-background-dark ${height} ${className}`}>
      <motion.div
        className={`${height} rounded-full bg-primary`}
        initial={{ width: 0 }}
        animate={{ width: `${percent}%` }}
        transition={{ type: 'spring', stiffness: 60, damping: 15, delay: 0.2 }}
      />
    </div>
  )
}
