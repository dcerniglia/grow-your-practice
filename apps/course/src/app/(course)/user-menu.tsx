'use client'

import { useAuth } from '@/lib/auth/use-auth'

export function UserMenu() {
  const { user, loading, signOut } = useAuth()

  if (loading) {
    return <div className="h-8 w-24 animate-pulse rounded-[6px] bg-border" />
  }

  if (!user) return null

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-text-muted">{user.email}</span>
      <button
        onClick={signOut}
        className="rounded-[8px] border border-border px-3 py-1.5 text-sm text-text-muted hover:bg-background-dark hover:text-text"
      >
        Sign out
      </button>
    </div>
  )
}
