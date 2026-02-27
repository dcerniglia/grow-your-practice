import type { User as SupabaseUser } from '@supabase/supabase-js'

/**
 * Syncs a Supabase auth user to the Prisma User table.
 * Creates a new record if one doesn't exist, returns the existing one if it does.
 * Gracefully degrades if the database is unavailable.
 */
export async function syncUser(supabaseUser: SupabaseUser) {
  try {
    const { PrismaClient } = await import('@gyp/database')
    const prisma = new PrismaClient()

    try {
      const email = supabaseUser.email
      if (!email) return null

      const existing = await prisma.user.findUnique({ where: { email } })
      if (existing) return existing

      const newUser = await prisma.user.create({
        data: {
          email,
          name: supabaseUser.user_metadata?.full_name ?? null,
          avatarUrl: supabaseUser.user_metadata?.avatar_url ?? null,
        },
      })
      return newUser
    } finally {
      await prisma.$disconnect()
    }
  } catch (error) {
    // Database unavailable — log and continue without sync
    console.warn('[sync-user] Failed to sync user to database:', error)
    return null
  }
}

/**
 * Fetches the Prisma user by email. Returns null if DB is unavailable.
 */
export async function getPrismaUser(email: string) {
  try {
    const { PrismaClient } = await import('@gyp/database')
    const prisma = new PrismaClient()

    try {
      return await prisma.user.findUnique({ where: { email } })
    } finally {
      await prisma.$disconnect()
    }
  } catch {
    return null
  }
}
