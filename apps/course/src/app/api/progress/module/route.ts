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
    const { moduleId } = body as { moduleId?: string }

    if (!moduleId) {
      return NextResponse.json({ error: 'moduleId is required' }, { status: 400 })
    }

    // TODO: When database is running, check if all lessons complete and mark module
    // try {
    //   const mod = await prisma.module.findUnique({
    //     where: { id: moduleId },
    //     include: { lessons: true },
    //   })
    //   if (!mod) {
    //     return NextResponse.json({ error: 'Module not found' }, { status: 404 })
    //   }
    //
    //   const allLessonIds = mod.lessons.map(l => l.id)
    //   const completedLessons = await prisma.lessonProgress.findMany({
    //     where: { userId: user.id, lessonId: { in: allLessonIds }, completedAt: { not: null } },
    //   })
    //
    //   if (completedLessons.length === allLessonIds.length) {
    //     await prisma.moduleProgress.upsert({
    //       where: { userId_moduleId: { userId: user.id, moduleId } },
    //       create: { userId: user.id, moduleId, completedAt: new Date() },
    //       update: { completedAt: new Date() },
    //     })
    //   }
    // } catch (dbError) {
    //   console.error('Database error:', dbError)
    //   return NextResponse.json({ error: 'Failed to check module progress' }, { status: 500 })
    // }

    // Placeholder response until database is connected
    console.log('Module progress check:', { userId: user.id, moduleId })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Module progress API error:', error)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
