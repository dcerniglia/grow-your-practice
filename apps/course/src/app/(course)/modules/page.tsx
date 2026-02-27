import Link from 'next/link'
import { getModulesWithLessons, getUserProgress, mergeProgressIntoModules, isModuleUnlocked } from '@/lib/course-data'

export default async function ModulesPage() {
  const [modules, progress] = await Promise.all([
    getModulesWithLessons(),
    getUserProgress(),
  ])
  const modulesWithProgress = mergeProgressIntoModules(modules, progress)

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-8 font-heading text-3xl text-primary">Modules</h1>
      <div className="space-y-4">
        {modulesWithProgress.map((mod) => {
          const unlocked = isModuleUnlocked(modulesWithProgress, mod.slug)
          const completedCount = mod.lessons.filter((l) => l.completed).length
          const totalCount = mod.lessons.length
          const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

          return (
            <Link
              key={mod.id}
              href={`/modules/${mod.slug}`}
              className={`block rounded-card border border-border bg-surface p-5 transition-shadow hover:shadow-md ${
                !unlocked ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    {mod.iconEmoji && <span className="text-xl">{mod.iconEmoji}</span>}
                    <h2 className="font-heading text-lg text-text">
                      {!unlocked && '🔒 '}{mod.title}
                    </h2>
                  </div>
                  <p className="mt-1 text-sm text-text-muted">{mod.description}</p>
                  <p className="mt-2 text-xs text-text-muted">
                    {totalCount} lesson{totalCount !== 1 ? 's' : ''}
                    {completedCount > 0 && ` · ${completedCount} completed`}
                  </p>
                </div>
                {unlocked && totalCount > 0 && (
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-sm font-medium text-primary">{pct}%</span>
                    <div className="h-2 w-20 overflow-hidden rounded-full bg-background">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
