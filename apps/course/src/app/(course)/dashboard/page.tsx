import { getModulesWithLessons, getUserProgress, mergeProgressIntoModules, getNextUncompletedLesson } from '@/lib/course-data'
import { DashboardClient } from '@/components/dashboard-client'

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
    <DashboardClient
      greeting={getGreeting()}
      encouragement={getDayEncouragement()}
      progressPercent={progressPercent}
      completedLessons={completedLessons}
      totalLessons={totalLessons}
      nextLesson={nextLesson}
      modules={modulesWithProgress}
    />
  )
}
