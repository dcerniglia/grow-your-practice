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
    const { moduleId } = body as { moduleId?: string }

    if (!moduleId) {
      return NextResponse.json({ error: 'moduleId is required' }, { status: 400 })
    }

    try {
      const mod = await prisma.module.findUnique({
        where: { id: moduleId },
        include: { lessons: true },
      })
      if (!mod) {
        return NextResponse.json({ error: 'Module not found' }, { status: 404 })
      }

      const allLessonIds = mod.lessons.map(l => l.id)
      const completedCount = await prisma.lessonProgress.count({
        where: { userId: user.id, lessonId: { in: allLessonIds }, completed: true },
      })

      if (completedCount === allLessonIds.length) {
        await prisma.moduleProgress.upsert({
          where: { userId_moduleId: { userId: user.id, moduleId } },
          create: { userId: user.id, moduleId, completed: true, completedAt: new Date() },
          update: { completed: true, completedAt: new Date() },
        })
      }
    } catch (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json({ error: 'Failed to check module progress' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Module progress API error:', error)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
