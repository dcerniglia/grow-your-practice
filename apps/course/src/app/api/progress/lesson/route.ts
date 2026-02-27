import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

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

    // TODO: When database is running, upsert LessonProgress via Prisma
    // try {
    //   const data: Record<string, unknown> = { userId: user.id, lessonId }
    //   if (completed) data.completedAt = new Date()
    //   if (videoWatchedPercent !== undefined) data.videoWatchedPercent = videoWatchedPercent
    //
    //   await prisma.lessonProgress.upsert({
    //     where: { userId_lessonId: { userId: user.id, lessonId } },
    //     create: data,
    //     update: data,
    //   })
    //
    //   // Auto-complete module if all lessons done
    //   if (completed) {
    //     const lesson = await prisma.lesson.findUnique({
    //       where: { id: lessonId },
    //       include: { module: { include: { lessons: true } } },
    //     })
    //     if (lesson) {
    //       const allLessonIds = lesson.module.lessons.map(l => l.id)
    //       const completedLessons = await prisma.lessonProgress.findMany({
    //         where: { userId: user.id, lessonId: { in: allLessonIds }, completedAt: { not: null } },
    //       })
    //       if (completedLessons.length === allLessonIds.length) {
    //         await prisma.moduleProgress.upsert({
    //           where: { userId_moduleId: { userId: user.id, moduleId: lesson.moduleId } },
    //           create: { userId: user.id, moduleId: lesson.moduleId, completedAt: new Date() },
    //           update: { completedAt: new Date() },
    //         })
    //       }
    //     }
    //   }
    // } catch (dbError) {
    //   console.error('Database error:', dbError)
    //   return NextResponse.json({ error: 'Failed to save progress' }, { status: 500 })
    // }

    // Placeholder response until database is connected
    console.log('Progress update:', { userId: user.id, lessonId, completed, videoWatchedPercent })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Progress API error:', error)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
