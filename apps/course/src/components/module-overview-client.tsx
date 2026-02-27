'use client'

import Link from 'next/link'
import { PageTransition } from './page-transition'
import { StaggerList, StaggerItem } from './stagger-list'
import { AnimatedProgressBar } from './animated-progress-bar'
import type { SidebarModule } from '@gyp/shared'

type ModuleOverviewClientProps = {
  mod: SidebarModule
  completedCount: number
}

export function ModuleOverviewClient({ mod, completedCount }: ModuleOverviewClientProps) {
  return (
    <PageTransition>
      <div className="mx-auto max-w-2xl">
        <div className="mb-2 text-4xl">{mod.iconEmoji}</div>
        <h1 className="font-heading text-3xl text-primary">{mod.title}</h1>
        <p className="mt-2 text-text-muted">
          {completedCount} of {mod.lessons.length} lessons completed
        </p>

        {mod.lessons.length > 0 && (
          <div className="mt-4">
            <AnimatedProgressBar
              percent={mod.lessons.length > 0 ? (completedCount / mod.lessons.length) * 100 : 0}
              height="h-2"
            />
          </div>
        )}

        <StaggerList className="mt-8 space-y-3">
          {mod.lessons.map((lesson) => (
            <StaggerItem key={lesson.id}>
              <Link
                href={`/modules/${mod.slug}/${lesson.slug}`}
                className="flex items-center gap-4 rounded-card bg-surface p-4 shadow-card transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
              >
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
            </StaggerItem>
          ))}
        </StaggerList>
      </div>
    </PageTransition>
  )
}
