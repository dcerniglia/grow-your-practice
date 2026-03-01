import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { PrismaClient } from '@gyp/database'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    // Auth check
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { lessonId, completed, videoWatchedPercent } = body as {
      lessonId?: string
      completed?: boolean
      videoWatchedPercent?: number
    }

    if (!lessonId) {
      return NextResponse.json({ error: 'lessonId is required' }, { status: 400 })
    }

    try {
      await prisma.lessonProgress.upsert({
        where: { userId_lessonId: { userId: user.id, lessonId } },
        create: {
          userId: user.id,
          lessonId,
          completed: completed ?? false,
          completedAt: completed ? new Date() : null,
          videoWatchedPercent: videoWatchedPercent ?? 0,
        },
        update: {
          ...(completed && { completed: true, completedAt: new Date() }),
          ...(videoWatchedPercent !== undefined && { videoWatchedPercent }),
        },
      })

      // Auto-complete module if all lessons done
      if (completed) {
        const lesson = await prisma.lesson.findUnique({
          where: { id: lessonId },
          include: { module: { include: { lessons: true } } },
        })
        if (lesson) {
          const allLessonIds = lesson.module.lessons.map(l => l.id)
          const completedCount = await prisma.lessonProgress.count({
            where: { userId: user.id, lessonId: { in: allLessonIds }, completed: true },
          })
          if (completedCount === allLessonIds.length) {
            await prisma.moduleProgress.upsert({
              where: { userId_moduleId: { userId: user.id, moduleId: lesson.moduleId } },
              create: { userId: user.id, moduleId: lesson.moduleId, completed: true, completedAt: new Date() },
              update: { completed: true, completedAt: new Date() },
            })
          }
        }
      }
    } catch (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json({ error: 'Failed to save progress' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Progress API error:', error)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
