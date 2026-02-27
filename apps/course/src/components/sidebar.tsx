'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { SidebarModule } from '@gyp/shared'

function ChevronIcon({ expanded }: { expanded: boolean }) {
  return (
    <svg
      className={`h-4 w-4 shrink-0 text-text-muted transition-transform duration-200 ${expanded ? 'rotate-90' : ''}`}
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
        clipRule="evenodd"
      />
    </svg>
  )
}

function CheckCircleIcon() {
  return (
    <svg className="h-4 w-4 shrink-0 text-primary" viewBox="0 0 20 20" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
        clipRule="evenodd"
      />
    </svg>
  )
}

function EmptyCircleIcon() {
  return (
    <svg className="h-4 w-4 shrink-0 text-text-light" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="10" cy="10" r="7" />
    </svg>
  )
}

function ResourcesIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path d="M3 3.5A1.5 1.5 0 014.5 2h6.879a1.5 1.5 0 011.06.44l4.122 4.12A1.5 1.5 0 0117 7.622V16.5a1.5 1.5 0 01-1.5 1.5h-11A1.5 1.5 0 013 16.5v-13z" />
    </svg>
  )
}

function ProfileIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
    </svg>
  )
}

export function Sidebar({ modules }: { modules: SidebarModule[] }) {
  const pathname = usePathname()
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>(() => {
    // Auto-expand the module that contains the current lesson
    const initial: Record<string, boolean> = {}
    for (const mod of modules) {
      const hasActiveLesson = mod.lessons.some(
        (l) => pathname === `/modules/${mod.slug}/${l.slug}`,
      )
      if (hasActiveLesson || pathname === `/modules/${mod.slug}`) {
        initial[mod.id] = true
      }
    }
    return initial
  })

  function toggleModule(moduleId: string) {
    setExpandedModules((prev) => ({ ...prev, [moduleId]: !prev[moduleId] }))
  }

  return (
    <aside className="flex h-screen w-[260px] shrink-0 flex-col border-r border-border bg-surface">
      {/* Logo */}
      <div className="border-b border-border px-5 py-4">
        <Link href="/dashboard" className="block">
          <h1 className="font-heading text-lg text-primary">Grow Your Practice</h1>
        </Link>
      </div>

      {/* Module/lesson tree */}
      <nav className="flex-1 overflow-y-auto py-2">
        {modules.map((mod) => {
          const isExpanded = expandedModules[mod.id] ?? false
          const isModuleActive = pathname === `/modules/${mod.slug}`
          const completedCount = mod.lessons.filter((l) => l.completed).length
          const totalCount = mod.lessons.length
          const allComplete = completedCount === totalCount && totalCount > 0

          return (
            <div key={mod.id}>
              {/* Module header */}
              <button
                onClick={() => toggleModule(mod.id)}
                className={`flex w-full items-center gap-2 px-5 py-2.5 text-left transition-colors duration-150 hover:bg-background ${isModuleActive ? 'bg-background' : ''}`}
              >
                {mod.iconEmoji && <span className="text-base">{mod.iconEmoji}</span>}
                <span className="flex-1 text-sm font-medium text-text">
                  {mod.title}
                </span>
                {allComplete ? (
                  <CheckCircleIcon />
                ) : (
                  <span className="text-xs text-text-muted">
                    {completedCount}/{totalCount}
                  </span>
                )}
                <ChevronIcon expanded={isExpanded} />
              </button>

              {/* Lesson list */}
              <div
                className={`overflow-hidden transition-all duration-200 ${isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
              >
                {mod.lessons.map((lesson) => {
                  const lessonPath = `/modules/${mod.slug}/${lesson.slug}`
                  const isActive = pathname === lessonPath

                  return (
                    <Link
                      key={lesson.id}
                      href={lessonPath}
                      className={`flex items-center gap-2.5 py-2 pl-10 pr-5 text-sm transition-colors duration-150 ${
                        isActive
                          ? 'border-l-2 border-primary bg-primary/10 pl-[38px] text-primary-dark'
                          : 'text-text-muted hover:bg-background hover:text-text'
                      }`}
                    >
                      {lesson.completed ? <CheckCircleIcon /> : <EmptyCircleIcon />}
                      <span className="leading-snug">{lesson.title}</span>
                    </Link>
                  )
                })}
              </div>
            </div>
          )
        })}
      </nav>

      {/* Bottom links */}
      <div className="border-t border-border px-3 py-3">
        <Link
          href="/resources"
          className={`flex items-center gap-3 rounded-button px-3 py-2 text-sm transition-colors duration-150 ${
            pathname === '/resources'
              ? 'bg-primary/10 text-primary'
              : 'text-text-muted hover:bg-background hover:text-text'
          }`}
        >
          <ResourcesIcon />
          Resources
        </Link>
        <Link
          href="/profile"
          className={`flex items-center gap-3 rounded-button px-3 py-2 text-sm transition-colors duration-150 ${
            pathname === '/profile'
              ? 'bg-primary/10 text-primary'
              : 'text-text-muted hover:bg-background hover:text-text'
          }`}
        >
          <ProfileIcon />
          Profile
        </Link>
      </div>
    </aside>
  )
}
