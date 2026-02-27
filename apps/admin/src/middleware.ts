import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || '').split(',').map((e) => e.trim().toLowerCase())

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for static files, API routes, and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // Allow the login page
  if (pathname === '/login' || pathname === '/callback') {
    return NextResponse.next()
  }

  const { user, supabaseResponse } = await updateSession(request)

  // Not authenticated -> login
  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Authenticated but not an admin -> 403
  if (ADMIN_EMAILS.length > 0 && !ADMIN_EMAILS.includes(user.email?.toLowerCase() || '')) {
    return new NextResponse('Forbidden', { status: 403 })
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
