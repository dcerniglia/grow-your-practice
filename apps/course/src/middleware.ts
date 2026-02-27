import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

const PUBLIC_PATHS = ['/login', '/signup', '/callback']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for static files, API routes, and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') // static files
  ) {
    return NextResponse.next()
  }

  const { user, supabaseResponse } = await updateSession(request)
  const isPublicPath = PUBLIC_PATHS.some((p) => pathname.startsWith(p))

  // Authenticated users on auth pages -> redirect to dashboard
  if (user && isPublicPath) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Unauthenticated users on protected pages -> redirect to login
  if (!user && !isPublicPath && pathname !== '/') {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Purchase and onboarding gating (gracefully degrades without DB)
  // Decision: skip purchase/onboarding checks if Prisma is unavailable
  if (user && !isPublicPath && pathname !== '/' && pathname !== '/onboarding') {
    try {
      const { getPrismaUser } = await import('@/lib/auth/sync-user')
      const prismaUser = user.email ? await getPrismaUser(user.email) : null

      if (prismaUser) {
        // No purchase -> redirect to marketing/purchase page
        if (!prismaUser.purchasedAt) {
          return NextResponse.redirect(new URL('/', request.url))
        }

        // Not onboarded -> redirect to onboarding
        if (!prismaUser.onboardingComplete && pathname !== '/onboarding') {
          return NextResponse.redirect(new URL('/onboarding', request.url))
        }
      }
    } catch {
      // Database unavailable — let authenticated users through
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
