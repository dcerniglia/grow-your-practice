'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import type { SidebarModule } from '@gyp/shared'

function ChevronIcon({ expanded }: { expanded: boolean }) {
  return (
    <motion.svg
      className="h-4 w-4 shrink-0 text-text-muted"
      viewBox="0 0 20 20"
      fill="currentColor"
      animate={{ rotate: expanded ? 90 : 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      <path
        fillRule="evenodd"
        d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
        clipRule="evenodd"
      />
    </motion.svg>
  )
}

function CheckCircleIcon({ animated }: { animated?: boolean }) {
  if (animated) {
    return (
      <motion.svg
        className="h-4 w-4 shrink-0 text-primary"
        viewBox="0 0 20 20"
        fill="currentColor"
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.3, 1] }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
          clipRule="evenodd"
        />
      </motion.svg>
    )
  }
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
        {modules.map((mod, modIndex) => {
          const isExpanded = expandedModules[mod.id] ?? false
          const isModuleActive = pathname === `/modules/${mod.slug}`
          const completedCount = mod.lessons.filter((l) => l.completed).length
          const totalCount = mod.lessons.length
          const allComplete = completedCount === totalCount && totalCount > 0

          return (
            <motion.div
              key={mod.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: modIndex * 0.05 }}
            >
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
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="overflow-hidden"
                  >
                    {mod.lessons.map((lesson, lessonIndex) => {
                      const lessonPath = `/modules/${mod.slug}/${lesson.slug}`
                      const isActive = pathname === lessonPath

                      return (
                        <motion.div
                          key={lesson.id}
                          initial={{ opacity: 0, x: -6 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.2, delay: lessonIndex * 0.04 }}
                        >
                          <Link
                            href={lessonPath}
                            className={`group relative flex items-center gap-2.5 py-2 pl-10 pr-5 text-sm transition-all duration-150 ${
                              isActive
                                ? 'border-l-2 border-primary bg-primary/10 pl-[38px] text-primary-dark'
                                : 'text-text-muted hover:bg-background hover:pl-11 hover:text-text'
                            }`}
                          >
                            {/* Subtle teal accent on hover */}
                            {!isActive && (
                              <span className="absolute left-0 top-0 h-full w-0.5 bg-primary opacity-0 transition-opacity duration-150 group-hover:opacity-40" />
                            )}
                            {lesson.completed ? <CheckCircleIcon /> : <EmptyCircleIcon />}
                            <span className="leading-snug">{lesson.title}</span>
                          </Link>
                        </motion.div>
                      )
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
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
