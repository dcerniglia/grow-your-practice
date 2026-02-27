import Link from 'next/link'
import { getModulesWithLessons, getUserProgress, mergeProgressIntoModules, isModuleUnlocked } from '@/lib/course-data'
import { notFound } from 'next/navigation'

export default async function ModuleOverviewPage({
  params,
}: {
  params: Promise<{ moduleSlug: string }>
}) {
  const { moduleSlug } = await params
  const [modules, progress] = await Promise.all([
    getModulesWithLessons(),
    getUserProgress(),
  ])
  const modulesWithProgress = mergeProgressIntoModules(modules, progress)
  const mod = modulesWithProgress.find((m) => m.slug === moduleSlug)
  if (!mod) notFound()

  const unlocked = isModuleUnlocked(modulesWithProgress, moduleSlug)
  const prevModule = modulesWithProgress.find((m) => m.order === mod.order - 1)

  if (!unlocked && prevModule) {
    return (
      <div className="mx-auto max-w-2xl py-16 text-center">
        <div className="mb-6 text-6xl">🔒</div>
        <h1 className="font-heading text-3xl text-text">{mod.title}</h1>
        <p className="mt-4 text-lg text-text-muted">
          Complete <strong className="text-primary">{prevModule.title}</strong> first.
          You&apos;ll get here soon!
        </p>
        <Link
          href={`/modules/${prevModule.slug}`}
          className="mt-6 inline-block rounded-button bg-primary px-6 py-2.5 font-medium text-white transition-colors hover:bg-primary-dark"
        >
          Go to {prevModule.title} &rarr;
        </Link>
      </div>
    )
  }

  const completedCount = mod.lessons.filter((l) => l.completed).length

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-2 text-4xl">{mod.iconEmoji}</div>
      <h1 className="font-heading text-3xl text-primary">{mod.title}</h1>
      <p className="mt-2 text-text-muted">
        {completedCount} of {mod.lessons.length} lessons completed
      </p>

      {/* Lesson list */}
      <div className="mt-8 space-y-3">
        {mod.lessons.map((lesson) => (
          <Link
            key={lesson.id}
            href={`/modules/${mod.slug}/${lesson.slug}`}
            className="flex items-center gap-4 rounded-card bg-surface p-4 shadow-card transition-shadow hover:shadow-lg"
          >
            {/* Completion indicator */}
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-primary/30">
              {lesson.completed ? (
                <svg className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <span className="text-sm font-medium text-text-muted">{lesson.order}</span>
              )}
            </div>

            <div className="flex-1">
              <h3 className="font-medium text-text">{lesson.title}</h3>
              {lesson.durationMinutes && (
                <p className="mt-0.5 text-xs text-text-muted">{lesson.durationMinutes} min</p>
              )}
            </div>

            <svg className="h-5 w-5 shrink-0 text-text-light" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        ))}
      </div>
    </div>
  )
}
