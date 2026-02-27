import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, techComfortLevel } = body as {
      name?: string
      techComfortLevel?: string
    }

    // TODO: When database is running, update user via Prisma
    // try {
    //   await prisma.user.update({
    //     where: { authId: user.id },
    //     data: {
    //       name: name || undefined,
    //       techComfortLevel: techComfortLevel || undefined,
    //     },
    //   })
    // } catch (dbError) {
    //   console.error('Database error:', dbError)
    //   return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
    // }

    // Placeholder response until database is connected
    console.log('Profile update:', { userId: user.id, name, techComfortLevel })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Profile API error:', error)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
