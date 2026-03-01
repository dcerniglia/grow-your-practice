'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import type { NextLessonInfo } from '@gyp/shared'
import { ModuleCompleteToast } from './module-complete-toast'
import { MilestoneModal } from './milestone-modal'

const ENCOURAGEMENTS = [
  'Nice work.',
  'One step closer.',
  "You're building something.",
  "That wasn't so hard, was it?",
  'Progress looks good on you.',
  'Another one down.',
]

const MODULE_COMPLETE_MESSAGES: Record<string, string> = {
  'Your AI Foundation': "You've built a solid foundation. The rest gets even better.",
  'AI + HIPAA: The Truth': 'You now know more about AI compliance than 95% of therapists.',
  'Eliminate Your Admin Nightmare': 'Say goodbye to hours of paperwork. Your admin life just changed.',
  'Fill Your Practice': "Your marketing game just leveled up. Clients are going to find you.",
  'Build New Income Streams': "New revenue streams unlocked. You're thinking like an entrepreneur.",
  'Your AI-Powered Practice': "You did it. Your practice will never be the same.",
}

type LessonActionsProps = {
  lessonId: string
  isCompleted: boolean
  nextLesson: NextLessonInfo
  totalLessons: number
  completedLessons: number
  isLastLessonInModule: boolean
  moduleTitle: string
}

function getMilestone(
  prevCompleted: number,
  newCompleted: number,
  total: number,
): 25 | 50 | 75 | 100 | null {
  if (total === 0) return null
  const prevPercent = (prevCompleted / total) * 100
  const newPercent = (newCompleted / total) * 100
  const thresholds = [100, 75, 50, 25] as const
  for (const t of thresholds) {
    if (prevPercent < t && newPercent >= t) return t
  }
  return null
}

export function LessonActions({
  lessonId,
  isCompleted: initialCompleted,
  nextLesson,
  totalLessons,
  completedLessons,
  isLastLessonInModule,
  moduleTitle,
}: LessonActionsProps) {
  const router = useRouter()
  const [completed, setCompleted] = useState(initialCompleted)
  const [loading, setLoading] = useState(false)
  const [justCompleted, setJustCompleted] = useState(false)
  const [encouragement, setEncouragement] = useState('')
  const [showModuleToast, setShowModuleToast] = useState(false)
  const [milestone, setMilestone] = useState<25 | 50 | 75 | 100 | null>(null)

  const dismissToast = useCallback(() => setShowModuleToast(false), [])
  const dismissMilestone = useCallback(() => setMilestone(null), [])

  async function handleMarkComplete() {
    setLoading(true)
    try {
      const res = await fetch('/api/progress/lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonId, completed: true }),
      })
      if (res.ok) {
        setCompleted(true)
        setJustCompleted(true)
        setEncouragement(
          ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)] as string,
        )

        // Refresh server components (sidebar, layout) to reflect new progress
        router.refresh()

        // Check for module completion
        if (isLastLessonInModule) {
          setTimeout(() => setShowModuleToast(true), 600)
        }

        // Check for milestone
        const newCompleted = completedLessons + 1
        const hit = getMilestone(completedLessons, newCompleted, totalLessons)
        if (hit) {
          setTimeout(() => setMilestone(hit), isLastLessonInModule ? 1200 : 600)
        }
      }
    } catch {
      // Silently fail
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="mt-12 flex w-full flex-col items-center gap-4 border-t border-border pt-8">
        <AnimatePresence mode="wait">
          {!completed ? (
            <motion.button
              key="mark-complete"
              onClick={handleMarkComplete}
              disabled={loading}
              className="w-full rounded-button bg-accent px-8 py-3 text-lg font-semibold text-white shadow-card transition-colors hover:bg-accent-dark disabled:opacity-60 sm:w-auto"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {loading ? 'Saving...' : 'Mark as Complete'}
            </motion.button>
          ) : (
            <motion.div
              key="completed"
              className="flex flex-col items-center gap-3"
              initial={justCompleted ? { opacity: 0, scale: 0.9 } : false}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            >
              <motion.div
                className="flex items-center gap-2 rounded-button bg-primary/10 px-6 py-3 text-primary"
                initial={justCompleted ? { backgroundColor: 'rgba(212, 148, 58, 0.15)' } : false}
                animate={{ backgroundColor: 'rgba(45, 106, 106, 0.1)' }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <motion.svg
                  className="h-6 w-6"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  initial={justCompleted ? { scale: 0 } : false}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 12, delay: 0.1 }}
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                    clipRule="evenodd"
                  />
                </motion.svg>
                <span className="font-semibold">Lesson Complete!</span>
              </motion.div>

              {/* Encouraging message */}
              {justCompleted && encouragement && (
                <motion.p
                  className="text-sm text-text-muted"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  {encouragement}
                </motion.p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Next lesson CTA */}
        <AnimatePresence>
          {nextLesson && (
            <motion.div
              initial={justCompleted && completed ? { opacity: 0, y: 12 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: justCompleted ? 0.6 : 0, duration: 0.3 }}
            >
              <Link
                href={`/modules/${nextLesson.module.slug}/${nextLesson.lesson.slug}`}
                className="block w-full rounded-button bg-primary px-6 py-2.5 text-center font-medium text-white transition-colors hover:bg-primary-dark sm:inline-block sm:w-auto"
              >
                Next: {nextLesson.lesson.title} &rarr;
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        {!nextLesson && completed && (
          <p className="text-center text-text-muted">
            You&apos;ve reached the end of the course. Congratulations!
          </p>
        )}
      </div>

      {/* Module complete toast */}
      {showModuleToast && (
        <ModuleCompleteToast
          moduleTitle={moduleTitle}
          message={
            MODULE_COMPLETE_MESSAGES[moduleTitle] ||
            `${moduleTitle} complete. Well done!`
          }
          onDismiss={dismissToast}
        />
      )}

      {/* Milestone modal */}
      {milestone && (
        <MilestoneModal milestone={milestone} onDismiss={dismissMilestone} />
      )}
    </>
  )
}
