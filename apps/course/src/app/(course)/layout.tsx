import { UserMenu } from './user-menu'
import { Sidebar } from '@/components/sidebar'
import { MobileNav } from '@/components/mobile-nav'
import { getModulesWithLessons, getUserProgress, mergeProgressIntoModules, getNextUncompletedLesson } from '@/lib/course-data'

export default async function CourseLayout({ children }: { children: React.ReactNode }) {
  const [modules, progress] = await Promise.all([
    getModulesWithLessons(),
    getUserProgress(),
  ])
  const modulesWithProgress = mergeProgressIntoModules(modules, progress)
  const nextLesson = getNextUncompletedLesson(modulesWithProgress)
  const completedLessons = modulesWithProgress.reduce(
    (sum, m) => sum + m.lessons.filter((l) => l.completed).length,
    0,
  )

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <Sidebar modules={modulesWithProgress} />
      </div>

      <div className="flex flex-1 flex-col">
        {/* Mobile top bar with hamburger */}
        <MobileNav modules={modulesWithProgress} nextLesson={nextLesson} completedLessons={completedLessons} />

        {/* Desktop header */}
        <header className="hidden items-center justify-end border-b border-border bg-surface px-6 py-3 lg:flex">
          <UserMenu />
        </header>

        <main className="flex-1 px-4 py-4 pb-24 sm:px-6 sm:py-6 lg:pb-6">{children}</main>
      </div>
    </div>
  )
}
