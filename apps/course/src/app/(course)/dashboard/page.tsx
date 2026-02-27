import Link from 'next/link'
import { getModulesWithLessons, getUserProgress, mergeProgressIntoModules, getNextUncompletedLesson } from '@/lib/course-data'

const ENCOURAGEMENTS = [
  "Every lesson you complete brings you closer to a practice that works for you, not the other way around.",
  "You're building skills that will save you hours every week. Keep going!",
  "Small steps, big impact. Each lesson is another tool in your toolkit.",
  "You're ahead of 95% of therapists just by being here. Nice work.",
  "The best time to start was yesterday. The second best time is right now.",
  "Think of this as an investment in your future self — the one with more free time.",
  "Progress isn't always linear, but every lesson counts.",
]

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

function getDayEncouragement(): string {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000,
  )
  const idx = dayOfYear % ENCOURAGEMENTS.length
  return ENCOURAGEMENTS[idx] as string
}

export default async function DashboardPage() {
  const [modules, progress] = await Promise.all([
    getModulesWithLessons(),
    getUserProgress(),
  ])
  const modulesWithProgress = mergeProgressIntoModules(modules, progress)

  const totalLessons = modulesWithProgress.reduce((sum, m) => sum + m.lessons.length, 0)
  const completedLessons = modulesWithProgress.reduce(
    (sum, m) => sum + m.lessons.filter((l) => l.completed).length,
    0,
  )
  const progressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0
  const nextLesson = getNextUncompletedLesson(modulesWithProgress)

  return (
    <div className="mx-auto max-w-4xl">
      {/* Greeting */}
      <h1 className="font-heading text-3xl text-primary">
        {getGreeting()}, there
      </h1>
      <p className="mt-2 text-text-muted">{getDayEncouragement()}</p>

      {/* Overall progress */}
      <div className="mt-8 rounded-card bg-surface p-6 shadow-card">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-heading text-lg text-text">Your Progress</h2>
          <span className="text-sm font-medium text-primary">{progressPercent}% complete</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-background-dark">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
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
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {modulesWithProgress.map((mod) => {
          const modCompleted = mod.lessons.filter((l) => l.completed).length
          const modTotal = mod.lessons.length
          const allDone = modCompleted === modTotal && modTotal > 0

          return (
            <Link
              key={mod.id}
              href={`/modules/${mod.slug}`}
              className="rounded-card bg-surface p-5 shadow-card transition-shadow hover:shadow-lg"
            >
              <div className="mb-2 text-2xl">{mod.iconEmoji}</div>
              <h3 className="font-heading text-base text-text">{mod.title}</h3>
              <div className="mt-3 flex items-center gap-2">
                {allDone ? (
                  <span className="text-sm font-medium text-primary">Complete ✓</span>
                ) : (
                  <>
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-background-dark">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${modTotal > 0 ? (modCompleted / modTotal) * 100 : 0}%` }}
                      />
                    </div>
                    <span className="text-xs text-text-muted">
                      {modCompleted}/{modTotal}
                    </span>
                  </>
                )}
              </div>
            </Link>
          )
        })}
      </div>

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
  )
}
