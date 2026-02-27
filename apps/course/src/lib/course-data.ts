import type { SidebarModule, UserProgress, LessonWithModule, NextLessonInfo } from '@gyp/shared'

const PLACEHOLDER_CONTENT = `## Welcome to this lesson

This is placeholder content for the lesson. When the database and admin CMS are set up, this will be replaced with real content managed through the admin interface.

:::tip
This is a helpful tip callout. These are used throughout the course to highlight key takeaways and practical advice.
:::

### Key Concepts

Here are some important things to remember:

- **Be specific** when giving AI instructions
- **Review everything** AI generates before using it
- **Start small** and build your comfort over time

:::warning
Always review AI-generated content before using it in a clinical context. AI can make mistakes, and you are ultimately responsible for the accuracy of your documentation.
:::

### Try It Yourself

:::try-this
Open ChatGPT or Claude and try this prompt:

\`\`\`
I'm a licensed therapist in private practice. Help me draft a professional
email to a client confirming their appointment next Tuesday at 2pm.
Keep it warm but professional.
\`\`\`

Notice how the AI adapts to your professional context when you include relevant details about your role.
:::

### Summary

Great work completing this lesson! Each small step builds your confidence with AI tools. Remember, you don't need to master everything at once.
`

const PLACEHOLDER_MODULES: SidebarModule[] = [
  {
    id: 'mod-1',
    title: 'Your AI Foundation',
    slug: 'your-ai-foundation',
    order: 1,
    iconEmoji: '🌱',
    isGated: false,
    lessons: [
      { id: 'l-1-1', title: 'Your First AI Win', slug: 'your-first-ai-win', order: 1, moduleSlug: 'your-ai-foundation', completed: false, durationMinutes: 8, content: PLACEHOLDER_CONTENT },
      { id: 'l-1-2', title: 'What AI Actually Is (and Isn\'t)', slug: 'what-ai-actually-is', order: 2, moduleSlug: 'your-ai-foundation', completed: false, durationMinutes: 12, content: PLACEHOLDER_CONTENT },
      { id: 'l-1-3', title: 'Setting Up Your AI Toolkit', slug: 'setting-up-your-ai-toolkit', order: 3, moduleSlug: 'your-ai-foundation', completed: false, durationMinutes: 15, content: PLACEHOLDER_CONTENT },
      { id: 'l-1-4', title: 'Your First Real Conversation with AI', slug: 'your-first-real-conversation', order: 4, moduleSlug: 'your-ai-foundation', completed: false, durationMinutes: 10, content: PLACEHOLDER_CONTENT },
      { id: 'l-1-5', title: 'Building the Habit', slug: 'building-the-habit', order: 5, moduleSlug: 'your-ai-foundation', completed: false, durationMinutes: 7, content: PLACEHOLDER_CONTENT },
    ],
  },
  {
    id: 'mod-2',
    title: 'AI + HIPAA: The Truth',
    slug: 'ai-hipaa-the-truth',
    order: 2,
    iconEmoji: '🔒',
    isGated: true,
    lessons: [
      { id: 'l-2-1', title: 'The Real Rules', slug: 'the-real-rules', order: 1, moduleSlug: 'ai-hipaa-the-truth', completed: false, durationMinutes: 14, content: PLACEHOLDER_CONTENT },
      { id: 'l-2-2', title: 'De-identification Techniques', slug: 'de-identification-techniques', order: 2, moduleSlug: 'ai-hipaa-the-truth', completed: false, durationMinutes: 18, content: PLACEHOLDER_CONTENT },
      { id: 'l-2-3', title: 'BAA-Ready Tools', slug: 'baa-ready-tools', order: 3, moduleSlug: 'ai-hipaa-the-truth', completed: false, durationMinutes: 11, content: PLACEHOLDER_CONTENT },
      { id: 'l-2-4', title: 'The Ethical Decision Tree', slug: 'the-ethical-decision-tree', order: 4, moduleSlug: 'ai-hipaa-the-truth', completed: false, durationMinutes: 13, content: PLACEHOLDER_CONTENT },
      { id: 'l-2-5', title: 'Your Compliance Checklist', slug: 'your-compliance-checklist', order: 5, moduleSlug: 'ai-hipaa-the-truth', completed: false, durationMinutes: 9, content: PLACEHOLDER_CONTENT },
    ],
  },
  {
    id: 'mod-3',
    title: 'Eliminate Your Admin Nightmare',
    slug: 'eliminate-your-admin-nightmare',
    order: 3,
    iconEmoji: '📋',
    isGated: false,
    lessons: [
      { id: 'l-3-1', title: 'AI for SOAP Notes & DAP Notes', slug: 'ai-for-soap-notes', order: 1, moduleSlug: 'eliminate-your-admin-nightmare', completed: false, durationMinutes: 16, content: PLACEHOLDER_CONTENT },
      { id: 'l-3-2', title: 'AI for Treatment Plans & Intake Forms', slug: 'ai-for-treatment-plans', order: 2, moduleSlug: 'eliminate-your-admin-nightmare', completed: false, durationMinutes: 14, content: PLACEHOLDER_CONTENT },
      { id: 'l-3-3', title: 'AI for Insurance & Billing Language', slug: 'ai-for-insurance-billing', order: 3, moduleSlug: 'eliminate-your-admin-nightmare', completed: false, durationMinutes: 12, content: PLACEHOLDER_CONTENT },
      { id: 'l-3-4', title: 'AI for Email & Client Communication', slug: 'ai-for-email-communication', order: 4, moduleSlug: 'eliminate-your-admin-nightmare', completed: false, durationMinutes: 10, content: PLACEHOLDER_CONTENT },
      { id: 'l-3-5', title: 'Building Your Personal Prompt Library', slug: 'building-your-prompt-library', order: 5, moduleSlug: 'eliminate-your-admin-nightmare', completed: false, durationMinutes: 15, content: PLACEHOLDER_CONTENT },
    ],
  },
  {
    id: 'mod-4',
    title: 'Fill Your Practice',
    slug: 'fill-your-practice',
    order: 4,
    iconEmoji: '📈',
    isGated: false,
    lessons: [
      { id: 'l-4-1', title: 'AI-Written Website Copy', slug: 'ai-written-website-copy', order: 1, moduleSlug: 'fill-your-practice', completed: false, durationMinutes: 14, content: PLACEHOLDER_CONTENT },
      { id: 'l-4-2', title: 'Optimizing Your Directory Profiles', slug: 'optimizing-directory-profiles', order: 2, moduleSlug: 'fill-your-practice', completed: false, durationMinutes: 11, content: PLACEHOLDER_CONTENT },
      { id: 'l-4-3', title: 'Social Media Content Without the Burnout', slug: 'social-media-content', order: 3, moduleSlug: 'fill-your-practice', completed: false, durationMinutes: 13, content: PLACEHOLDER_CONTENT },
      { id: 'l-4-4', title: 'AI for SEO', slug: 'ai-for-seo', order: 4, moduleSlug: 'fill-your-practice', completed: false, durationMinutes: 16, content: PLACEHOLDER_CONTENT },
      { id: 'l-4-5', title: 'Your 30-Day Marketing Plan', slug: 'your-30-day-marketing-plan', order: 5, moduleSlug: 'fill-your-practice', completed: false, durationMinutes: 10, content: PLACEHOLDER_CONTENT },
    ],
  },
  {
    id: 'mod-5',
    title: 'Build New Income Streams',
    slug: 'build-new-income-streams',
    order: 5,
    iconEmoji: '💡',
    isGated: false,
    lessons: [
      { id: 'l-5-1', title: 'Group Therapy Programs', slug: 'group-therapy-programs', order: 1, moduleSlug: 'build-new-income-streams', completed: false, durationMinutes: 13, content: PLACEHOLDER_CONTENT },
      { id: 'l-5-2', title: 'Creating Online Courses & Workshops', slug: 'creating-online-courses', order: 2, moduleSlug: 'build-new-income-streams', completed: false, durationMinutes: 15, content: PLACEHOLDER_CONTENT },
      { id: 'l-5-3', title: 'Digital Products', slug: 'digital-products', order: 3, moduleSlug: 'build-new-income-streams', completed: false, durationMinutes: 11, content: PLACEHOLDER_CONTENT },
      { id: 'l-5-4', title: 'AI for Psychoeducation Materials', slug: 'ai-for-psychoeducation', order: 4, moduleSlug: 'build-new-income-streams', completed: false, durationMinutes: 14, content: PLACEHOLDER_CONTENT },
      { id: 'l-5-5', title: 'Mapping Your First Alternate Income Stream', slug: 'mapping-first-income-stream', order: 5, moduleSlug: 'build-new-income-streams', completed: false, durationMinutes: 12, content: PLACEHOLDER_CONTENT },
    ],
  },
  {
    id: 'mod-6',
    title: 'Your AI-Powered Practice',
    slug: 'your-ai-powered-practice',
    order: 6,
    iconEmoji: '🚀',
    isGated: false,
    lessons: [
      { id: 'l-6-1', title: 'Putting It All Together', slug: 'putting-it-all-together', order: 1, moduleSlug: 'your-ai-powered-practice', completed: false, durationMinutes: 10, content: PLACEHOLDER_CONTENT },
      { id: 'l-6-2', title: 'Simple Automations & Ethical Guardrails', slug: 'simple-automations', order: 2, moduleSlug: 'your-ai-powered-practice', completed: false, durationMinutes: 14, content: PLACEHOLDER_CONTENT },
      { id: 'l-6-3', title: 'Staying Current Without Getting Overwhelmed', slug: 'staying-current', order: 3, moduleSlug: 'your-ai-powered-practice', completed: false, durationMinutes: 8, content: PLACEHOLDER_CONTENT },
      { id: 'l-6-4', title: 'Your 30-Day Implementation Plan', slug: 'your-30-day-implementation-plan', order: 4, moduleSlug: 'your-ai-powered-practice', completed: false, durationMinutes: 12, content: PLACEHOLDER_CONTENT },
      { id: 'l-6-5', title: 'Final Reflection & Next Steps', slug: 'final-reflection', order: 5, moduleSlug: 'your-ai-powered-practice', completed: false, durationMinutes: 7, content: PLACEHOLDER_CONTENT },
    ],
  },
]

/**
 * Returns modules with nested lessons. Tries Prisma first, falls back to placeholder data.
 */
export async function getModulesWithLessons(): Promise<SidebarModule[]> {
  // TODO: When database is running, fetch from Prisma here
  return PLACEHOLDER_MODULES
}

/**
 * Returns user progress (completed lesson/module IDs). Falls back to empty progress.
 */
export async function getUserProgress(_userId?: string): Promise<UserProgress> {
  // TODO: When database is running, fetch from Prisma here
  return { completedLessonIds: [], completedModuleIds: [] }
}

/**
 * Merges progress into module/lesson data for sidebar display.
 */
export function mergeProgressIntoModules(
  modules: SidebarModule[],
  progress: UserProgress,
): SidebarModule[] {
  return modules.map((mod) => ({
    ...mod,
    lessons: mod.lessons.map((lesson) => ({
      ...lesson,
      completed: progress.completedLessonIds.includes(lesson.id),
    })),
  }))
}

/**
 * Returns a specific lesson by module and lesson slugs, with its parent module.
 */
export async function getLessonBySlug(
  moduleSlug: string,
  lessonSlug: string,
): Promise<LessonWithModule | null> {
  const modules = await getModulesWithLessons()
  const mod = modules.find((m) => m.slug === moduleSlug)
  if (!mod) return null
  const lesson = mod.lessons.find((l) => l.slug === lessonSlug)
  if (!lesson) return null
  return { ...lesson, module: mod }
}

/**
 * Returns the next lesson after the given one, or null if at the end of the course.
 */
export async function getNextLesson(
  moduleSlug: string,
  lessonSlug: string,
): Promise<NextLessonInfo> {
  const modules = await getModulesWithLessons()
  const modIndex = modules.findIndex((m) => m.slug === moduleSlug)
  if (modIndex === -1) return null
  const mod = modules[modIndex] as SidebarModule
  const lessonIndex = mod.lessons.findIndex((l) => l.slug === lessonSlug)
  if (lessonIndex === -1) return null

  // Next lesson in same module
  const nextLessonInModule = mod.lessons[lessonIndex + 1]
  if (nextLessonInModule) {
    return { lesson: nextLessonInModule, module: mod }
  }

  // First lesson of next module
  const nextMod = modules[modIndex + 1]
  if (nextMod) {
    const firstLesson = nextMod.lessons[0]
    if (firstLesson) {
      return { lesson: firstLesson, module: nextMod }
    }
  }

  return null
}

/**
 * Gets the first uncompleted lesson across all modules.
 */
export function getNextUncompletedLesson(
  modules: SidebarModule[],
): NextLessonInfo {
  for (const mod of modules) {
    for (const lesson of mod.lessons) {
      if (!lesson.completed) {
        return { lesson, module: mod }
      }
    }
  }
  return null
}

/**
 * Checks if a gated module is unlocked (previous module fully complete).
 */
export function isModuleUnlocked(
  modules: SidebarModule[],
  moduleSlug: string,
): boolean {
  const mod = modules.find((m) => m.slug === moduleSlug)
  if (!mod) return false
  if (!mod.isGated) return true

  const prevMod = modules.find((m) => m.order === mod.order - 1)
  if (!prevMod) return true

  return prevMod.lessons.every((l) => l.completed)
}
