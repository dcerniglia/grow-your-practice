import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { syncUser } from '@/lib/auth/sync-user'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      // Decision: Sync Supabase user to Prisma on every auth callback (ADR TBD)
      const prismaUser = await syncUser(data.user)

      // If new user without onboarding, redirect to onboarding
      if (prismaUser && !prismaUser.onboardingComplete) {
        return NextResponse.redirect(`${origin}/onboarding`)
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Auth code exchange failed — redirect to login with error
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`)
}
