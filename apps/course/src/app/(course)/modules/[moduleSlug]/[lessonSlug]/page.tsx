import { notFound } from 'next/navigation'
import { getLessonBySlug, getNextLesson, getUserProgress, getModulesWithLessons, mergeProgressIntoModules } from '@/lib/course-data'
import { VideoPlayer } from '@/components/video-player'
import { MarkdownContent } from '@/components/markdown-content'
import { LessonActions } from '@/components/lesson-actions'
import { LessonPageClient } from '@/components/lesson-page-client'

export default async function LessonPage({
  params,
}: {
  params: Promise<{ moduleSlug: string; lessonSlug: string }>
}) {
  const { moduleSlug, lessonSlug } = await params
  const [lessonWithModule, nextLessonInfo, progress, modules] = await Promise.all([
    getLessonBySlug(moduleSlug, lessonSlug),
    getNextLesson(moduleSlug, lessonSlug),
    getUserProgress(),
    getModulesWithLessons(),
  ])

  if (!lessonWithModule) notFound()

  const { module: mod, ...lesson } = lessonWithModule
  const isCompleted = progress.completedLessonIds.includes(lesson.id)

  // Calculate total progress for milestone detection
  const modulesWithProgress = mergeProgressIntoModules(modules, progress)
  const totalLessons = modulesWithProgress.reduce((sum, m) => sum + m.lessons.length, 0)
  const completedLessons = modulesWithProgress.reduce(
    (sum, m) => sum + m.lessons.filter((l) => l.completed).length,
    0,
  )

  // Find this lesson's module to check if it's the last lesson
  const currentModule = modulesWithProgress.find((m) => m.slug === moduleSlug)
  const isLastLessonInModule = currentModule
    ? currentModule.lessons[currentModule.lessons.length - 1]?.id === lesson.id
    : false

  return (
    <LessonPageClient>
      <div className="mx-auto max-w-[720px]">
        {/* Breadcrumb */}
        <p className="mb-1 text-sm text-text-muted">
          {mod.iconEmoji} {mod.title}
        </p>

        <h1 className="font-heading text-3xl text-primary">{lesson.title}</h1>

        {lesson.durationMinutes && (
          <p className="mt-1 text-sm text-text-muted">{lesson.durationMinutes} min</p>
        )}

        {/* Video */}
        {lesson.videoId && (
          <div className="mt-6">
            <VideoPlayer videoId={lesson.videoId} lessonId={lesson.id} />
          </div>
        )}

        {/* Markdown content */}
        {lesson.content && (
          <div className="mt-6">
            <MarkdownContent content={lesson.content} />
          </div>
        )}

        {/* Resources */}
        {lesson.resources && lesson.resources.length > 0 && (
          <div className="mt-10">
            <h2 className="mb-4 font-heading text-xl text-text">Resources</h2>
            <div className="space-y-3">
              {lesson.resources.map((resource) => (
                <div
                  key={resource.id}
                  className="flex items-center justify-between rounded-card bg-surface p-4 shadow-card"
                >
                  <div>
                    <h3 className="font-medium text-text">{resource.title}</h3>
                    {resource.description && (
                      <p className="mt-0.5 text-sm text-text-muted">{resource.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="rounded bg-background-dark px-2 py-0.5 text-xs font-medium uppercase text-text-muted">
                      {resource.fileType}
                    </span>
                    <a
                      href={resource.url}
                      download
                      className="rounded-button bg-primary px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
                    >
                      Download
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <LessonActions
          lessonId={lesson.id}
          isCompleted={isCompleted}
          nextLesson={nextLessonInfo}
          totalLessons={totalLessons}
          completedLessons={completedLessons}
          isLastLessonInModule={isLastLessonInModule}
          moduleTitle={mod.title}
        />
      </div>
    </LessonPageClient>
  )
}
