export type SidebarModule = {
  id: string
  title: string
  slug: string
  order: number
  iconEmoji?: string
  isGated: boolean
  lessons: SidebarLesson[]
}

export type SidebarLesson = {
  id: string
  title: string
  slug: string
  order: number
  moduleSlug: string
  completed: boolean
}

export type UserProgress = {
  completedLessonIds: string[]
  completedModuleIds: string[]
}
