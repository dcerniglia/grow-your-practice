'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { SidebarModule, NextLessonInfo } from '@gyp/shared'
import { Sidebar } from './sidebar'

function HamburgerIcon() {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}

function PlayIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M2 10a8 8 0 1116 0 8 8 0 01-16 0zm6.39-2.908a.75.75 0 01.766.027l3.5 2.25a.75.75 0 010 1.262l-3.5 2.25A.75.75 0 018 12.25v-4.5a.75.75 0 01.39-.658z" clipRule="evenodd" />
    </svg>
  )
}

function CheckCircleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
    </svg>
  )
}

function ArrowRightIcon() {
  return (
    <svg className="h-3.5 w-3.5 animate-nudge-right" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638l-3.96-4.158a.75.75 0 011.08-1.04l5.25 5.5a.75.75 0 010 1.04l-5.25 5.5a.75.75 0 11-1.08-1.04l3.96-4.158H3.75A.75.75 0 013 10z" clipRule="evenodd" />
    </svg>
  )
}

type MobileNavProps = {
  modules: SidebarModule[]
  nextLesson: NextLessonInfo
  completedLessons: number
}

export function MobileNav({ modules, nextLesson, completedLessons }: MobileNavProps) {
  const pathname = usePathname()
  const [drawerOpen, setDrawerOpen] = useState(false)

  const allComplete = !nextLesson
  const learnHref = nextLesson
    ? `/modules/${nextLesson.module.slug}/${nextLesson.lesson.slug}`
    : '/dashboard'
  const learnLabel = allComplete
    ? 'Complete!'
    : completedLessons === 0
      ? 'Start Learning'
      : 'Keep Learning'
  const isOnLesson = pathname.startsWith('/modules/')

  return (
    <>
      {/* Top bar — mobile only */}
      <header className="flex items-center justify-between border-b border-border bg-surface px-4 py-3 lg:hidden">
        <button
          onClick={() => setDrawerOpen(true)}
          className="flex h-11 w-11 items-center justify-center rounded-button text-text-muted hover:bg-background hover:text-text"
          aria-label="Open menu"
        >
          <HamburgerIcon />
        </button>
        <span className="font-heading text-base text-primary">Grow Your Practice</span>
        <div className="w-8" /> {/* Spacer for centering */}
      </header>

      {/* Drawer overlay */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/30 transition-opacity"
            onClick={() => setDrawerOpen(false)}
          />
          {/* Drawer */}
          <div className="relative z-10 h-full w-[min(280px,85vw)] animate-slide-in overflow-hidden">
            <div className="absolute right-3 top-3 z-20">
              <button
                onClick={() => setDrawerOpen(false)}
                className="flex h-11 w-11 items-center justify-center rounded-button text-text-muted hover:bg-background hover:text-text"
                aria-label="Close menu"
              >
                <CloseIcon />
              </button>
            </div>
            <div onClick={() => setDrawerOpen(false)}>
              <Sidebar modules={modules} />
            </div>
          </div>
        </div>
      )}

      {/* Bottom nav bar — mobile only */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-border bg-surface pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 lg:hidden">
        <Link
          href="/dashboard"
          className={`flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-0.5 px-3 py-1 text-xs transition-colors ${
            pathname === '/dashboard' ? 'text-primary' : 'text-text-muted'
          }`}
        >
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 11h-1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-.707-1.707l7-7z" clipRule="evenodd" />
          </svg>
          <span>Dashboard</span>
          {pathname === '/dashboard' && <span className="h-1 w-1 rounded-full bg-primary" />}
        </Link>

        {/* Keep Learning / Start Learning — accent CTA */}
        <Link
          href={learnHref}
          className={`flex min-h-[44px] flex-col items-center justify-center gap-0.5 rounded-full px-5 py-1 text-xs font-medium transition-all ${
            allComplete
              ? 'text-primary'
              : isOnLesson
                ? 'bg-accent text-white'
                : 'animate-soft-glow bg-accent text-white'
          }`}
        >
          <span className="flex items-center gap-1.5">
            {allComplete ? <CheckCircleIcon /> : <PlayIcon />}
            {!allComplete && <ArrowRightIcon />}
          </span>
          <span>{learnLabel}</span>
        </Link>

        <Link
          href="/resources"
          className={`flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-0.5 px-3 py-1 text-xs transition-colors ${
            pathname === '/resources' ? 'text-primary' : 'text-text-muted'
          }`}
        >
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M3 3.5A1.5 1.5 0 014.5 2h6.879a1.5 1.5 0 011.06.44l4.122 4.12A1.5 1.5 0 0117 7.622V16.5a1.5 1.5 0 01-1.5 1.5h-11A1.5 1.5 0 013 16.5v-13z" />
          </svg>
          <span>Resources</span>
          {pathname === '/resources' && <span className="h-1 w-1 rounded-full bg-primary" />}
        </Link>

        <Link
          href="/profile"
          className={`flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-0.5 px-3 py-1 text-xs transition-colors ${
            pathname === '/profile' ? 'text-primary' : 'text-text-muted'
          }`}
        >
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
          </svg>
          <span>Profile</span>
          {pathname === '/profile' && <span className="h-1 w-1 rounded-full bg-primary" />}
        </Link>
      </nav>
    </>
  )
}
