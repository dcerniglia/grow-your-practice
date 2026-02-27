'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { NextLessonInfo } from '@gyp/shared'

type LessonActionsProps = {
  lessonId: string
  isCompleted: boolean
  nextLesson: NextLessonInfo
}

export function LessonActions({ lessonId, isCompleted: initialCompleted, nextLesson }: LessonActionsProps) {
  const [completed, setCompleted] = useState(initialCompleted)
  const [loading, setLoading] = useState(false)

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
      }
    } catch {
      // Silently fail
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-12 flex flex-col items-center gap-4 border-t border-border pt-8">
      {!completed ? (
        <button
          onClick={handleMarkComplete}
          disabled={loading}
          className="rounded-button bg-accent px-8 py-3 text-lg font-semibold text-white shadow-card transition-colors hover:bg-accent-dark disabled:opacity-60"
        >
          {loading ? 'Saving...' : 'Mark as Complete'}
        </button>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-2 text-primary">
            <svg className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-semibold">Lesson Complete!</span>
          </div>
        </div>
      )}

      {nextLesson && (
        <Link
          href={`/modules/${nextLesson.module.slug}/${nextLesson.lesson.slug}`}
          className="rounded-button bg-primary px-6 py-2.5 font-medium text-white transition-colors hover:bg-primary-dark"
        >
          Next: {nextLesson.lesson.title} &rarr;
        </Link>
      )}

      {!nextLesson && completed && (
        <p className="text-center text-text-muted">
          You&apos;ve reached the end of the course. Congratulations!
        </p>
      )}
    </div>
  )
}
