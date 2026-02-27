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
  durationMinutes?: number
  videoId?: string
  content?: string
  resources?: LessonResource[]
}

export type LessonResource = {
  id: string
  title: string
  description?: string
  fileType: string
  url: string
}

export type LessonWithModule = SidebarLesson & {
  module: SidebarModule
}

export type UserProgress = {
  completedLessonIds: string[]
  completedModuleIds: string[]
}

export type NextLessonInfo = {
  lesson: SidebarLesson
  module: SidebarModule
} | null
