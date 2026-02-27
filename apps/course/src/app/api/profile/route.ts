import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // TODO: When database is running, fetch user profile + progress via Prisma
    // const dbUser = await prisma.user.findUnique({ where: { authId: user.id } })
    // const completedLessons = await prisma.lessonProgress.count({
    //   where: { userId: dbUser.id, completedAt: { not: null } },
    // })
    // const completedModules = await prisma.moduleProgress.count({
    //   where: { userId: dbUser.id, completedAt: { not: null } },
    // })

    // Placeholder response until database is connected
    return NextResponse.json({
      name: user.user_metadata?.name || '',
      techComfortLevel: user.user_metadata?.techComfortLevel || '',
      purchasedAt: null,
      lessonsCompleted: 0,
      modulesCompleted: 0,
      totalLessons: 30,
      totalModules: 6,
    })
  } catch (error) {
    console.error('Profile GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
