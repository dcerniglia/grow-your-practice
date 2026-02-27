import Link from 'next/link'
import { getModulesWithLessons, getUserProgress, mergeProgressIntoModules, isModuleUnlocked } from '@/lib/course-data'
import { notFound } from 'next/navigation'
import { ModuleOverviewClient } from '@/components/module-overview-client'

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

  return <ModuleOverviewClient mod={mod} completedCount={completedCount} />
}
