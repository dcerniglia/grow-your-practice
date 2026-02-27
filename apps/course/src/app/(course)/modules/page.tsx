import { redirect } from 'next/navigation'
import { getModulesWithLessons, getUserProgress, mergeProgressIntoModules, getNextUncompletedLesson } from '@/lib/course-data'

export default async function ModulesPage() {
  const [modules, progress] = await Promise.all([
    getModulesWithLessons(),
    getUserProgress(),
  ])
  const modulesWithProgress = mergeProgressIntoModules(modules, progress)
  const nextLesson = getNextUncompletedLesson(modulesWithProgress)

  if (nextLesson) {
    redirect(`/modules/${nextLesson.module.slug}/${nextLesson.lesson.slug}`)
  }

  // All lessons complete — go to dashboard
  redirect('/dashboard')
}
