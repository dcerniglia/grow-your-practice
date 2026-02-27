'use client'

import Link from 'next/link'
import { PageTransition } from './page-transition'
import { StaggerList, StaggerItem } from './stagger-list'
import { AnimatedProgressBar } from './animated-progress-bar'

type ModuleWithProgress = {
  id: string
  slug: string
  title: string
  iconEmoji?: string
  lessons: { completed: boolean }[]
}

type NextLessonDisplay = {
  module: { slug: string; title: string; iconEmoji?: string }
  lesson: { slug: string; title: string }
}

type DashboardClientProps = {
  greeting: string
  encouragement: string
  progressPercent: number
  completedLessons: number
  totalLessons: number
  nextLesson: NextLessonDisplay | null
  modules: ModuleWithProgress[]
}

export function DashboardClient({
  greeting,
  encouragement,
  progressPercent,
  completedLessons,
  totalLessons,
  nextLesson,
  modules,
}: DashboardClientProps) {
  return (
    <PageTransition>
      <div className="mx-auto max-w-4xl">
        <h1 className="font-heading text-3xl text-primary">{greeting}, there</h1>
        <p className="mt-2 text-text-muted">{encouragement}</p>

        {/* Overall progress */}
        <div className="mt-8 rounded-card bg-surface p-6 shadow-card">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-heading text-lg text-text">Your Progress</h2>
            <span className="text-sm font-medium text-primary">{progressPercent}% complete</span>
          </div>
          <AnimatedProgressBar percent={progressPercent} />
          <p className="mt-2 text-sm text-text-muted">
            {completedLessons} of {totalLessons} lessons completed
          </p>
        </div>

        {/* Continue where you left off */}
        {nextLesson && (
          <Link
            href={`/modules/${nextLesson.module.slug}/${nextLesson.lesson.slug}`}
            className="mt-6 block rounded-card bg-surface p-6 shadow-card transition-shadow hover:shadow-lg"
          >
            <p className="mb-1 text-sm font-medium text-text-muted">Continue where you left off</p>
            <h3 className="font-heading text-xl text-text">{nextLesson.lesson.title}</h3>
            <p className="mt-1 text-sm text-text-muted">
              {nextLesson.module.iconEmoji} {nextLesson.module.title}
            </p>
            <span className="mt-3 inline-block rounded-button bg-accent px-5 py-2 font-medium text-white">
              Continue &rarr;
            </span>
          </Link>
        )}

        {/* Module grid */}
        <h2 className="mb-4 mt-10 font-heading text-xl text-text">Modules</h2>
        <StaggerList className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((mod) => {
            const modCompleted = mod.lessons.filter((l) => l.completed).length
            const modTotal = mod.lessons.length
            const allDone = modCompleted === modTotal && modTotal > 0

            return (
              <StaggerItem key={mod.id}>
                <Link
                  href={`/modules/${mod.slug}`}
                  className="block rounded-card bg-surface p-5 shadow-card transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
                >
                  <div className="mb-2 text-2xl">{mod.iconEmoji}</div>
                  <h3 className="font-heading text-base text-text">{mod.title}</h3>
                  <div className="mt-3 flex items-center gap-2">
                    {allDone ? (
                      <span className="text-sm font-medium text-primary">Complete &#x2713;</span>
                    ) : (
                      <>
                        <AnimatedProgressBar
                          percent={modTotal > 0 ? (modCompleted / modTotal) * 100 : 0}
                          height="h-1.5"
                          className="flex-1"
                        />
                        <span className="text-xs text-text-muted">
                          {modCompleted}/{modTotal}
                        </span>
                      </>
                    )}
                  </div>
                </Link>
              </StaggerItem>
            )
          })}
        </StaggerList>

        {/* Resources quick access */}
        <div className="mt-8">
          <Link
            href="/resources"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-dark"
          >
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M3 3.5A1.5 1.5 0 014.5 2h6.879a1.5 1.5 0 011.06.44l4.122 4.12A1.5 1.5 0 0117 7.622V16.5a1.5 1.5 0 01-1.5 1.5h-11A1.5 1.5 0 013 16.5v-13z" />
            </svg>
            Browse all resources &rarr;
          </Link>
        </div>
      </div>
    </PageTransition>
  )
}
