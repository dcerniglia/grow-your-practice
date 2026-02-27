'use client'

import { motion, AnimatePresence } from 'framer-motion'

type MilestoneModalProps = {
  milestone: 25 | 50 | 75 | 100
  onDismiss: () => void
}

const MILESTONES: Record<number, { emoji: string; copy: string; dismiss: string }> = {
  25: {
    emoji: '\u{1F331}',
    copy: "You're off to a great start. The hardest part \u2014 starting \u2014 is behind you.",
    dismiss: 'Keep going',
  },
  50: {
    emoji: '\u{1F33F}',
    copy: "Halfway there. You've already learned enough to change how you run your practice.",
    dismiss: 'Keep going',
  },
  75: {
    emoji: '\u{1FAB4}',
    copy: "Almost there. You're in the top tier of tech-savvy therapists now.",
    dismiss: 'Keep going',
  },
  100: {
    emoji: '\u{1F333}',
    copy: 'You did it. Your practice is about to change.',
    dismiss: 'Explore your dashboard',
  },
}

// TODO: When milestone === 100, call POST /api/newsletter/subscribe with source 'course-complete'
// to tag the user with gyp-completed in ConvertKit (Issue #19)

export function MilestoneModal({ milestone, onDismiss }: MilestoneModalProps) {
  const data = MILESTONES[milestone]!
  const is100 = milestone === 100

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
        onClick={onDismiss}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="relative mx-4 max-w-md overflow-hidden rounded-card bg-surface p-8 text-center shadow-lg"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Golden particles for 100% */}
          {is100 && (
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute h-2 w-2 rounded-full bg-accent"
                  initial={{
                    x: 100 + (Math.random() - 0.5) * 200,
                    y: 150,
                    opacity: 0.9,
                    scale: 0.5 + Math.random() * 0.5,
                  }}
                  animate={{
                    y: -30,
                    opacity: 0,
                  }}
                  transition={{
                    duration: 2.5 + Math.random() * 1.5,
                    delay: Math.random() * 0.8,
                    repeat: Infinity,
                    ease: 'easeOut',
                  }}
                />
              ))}
            </div>
          )}

          <div className="relative">
            <motion.div
              className={`mb-4 ${is100 ? 'text-7xl' : 'text-6xl'}`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.15 }}
            >
              {data.emoji}
            </motion.div>

            <motion.p
              className="text-sm font-medium uppercase tracking-wide text-accent"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              {milestone}% Complete
            </motion.p>

            <motion.p
              className="mt-4 font-heading text-xl text-text"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              {data.copy}
            </motion.p>

            <motion.button
              onClick={onDismiss}
              className="mt-8 rounded-button bg-primary px-8 py-3 font-medium text-white transition-colors hover:bg-primary-dark"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
            >
              {data.dismiss}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
