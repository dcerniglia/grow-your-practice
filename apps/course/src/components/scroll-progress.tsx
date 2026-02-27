'use client'

import { useEffect, useState } from 'react'
import { motion, useSpring } from 'framer-motion'

export function ScrollProgress() {
  const [progress, setProgress] = useState(0)
  const smoothProgress = useSpring(0, { stiffness: 100, damping: 30 })

  useEffect(() => {
    function handleScroll() {
      const scrollTop = document.documentElement.scrollTop
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
      if (scrollHeight > 0) {
        setProgress(scrollTop / scrollHeight)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    smoothProgress.set(progress)
  }, [progress, smoothProgress])

  return (
    <motion.div
      className="fixed left-0 right-0 top-0 z-40 h-0.5 origin-left bg-primary"
      style={{ scaleX: smoothProgress }}
    />
  )
}
