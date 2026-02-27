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
    const { name, techComfortLevel, goals } = body as {
      name?: string
      techComfortLevel?: string
      goals?: string[]
    }

    // TODO: When database is running, update user record via Prisma
    // try {
    //   await prisma.user.update({
    //     where: { authId: user.id },
    //     data: {
    //       name: name || undefined,
    //       techComfortLevel: techComfortLevel || undefined,
    //       goals: goals || undefined,
    //       onboardingComplete: true,
    //     },
    //   })
    // } catch (dbError) {
    //   console.error('Database error:', dbError)
    //   return NextResponse.json({ error: 'Failed to save onboarding' }, { status: 500 })
    // }

    // Placeholder response until database is connected
    console.log('Onboarding complete:', { userId: user.id, name, techComfortLevel, goals })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Onboarding API error:', error)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
