'use client'

import { PageTransition } from './page-transition'
import { ScrollProgress } from './scroll-progress'
import type { ReactNode } from 'react'

export function LessonPageClient({ children }: { children: ReactNode }) {
  return (
    <>
      <ScrollProgress />
      <PageTransition>{children}</PageTransition>
    </>
  )
}
