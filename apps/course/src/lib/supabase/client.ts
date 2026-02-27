import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // During build/prerender, env vars may not be available. The browser client
  // won't make real requests during SSR prerender, so placeholder values are safe.
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co'
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'placeholder'

  return createBrowserClient(url, key)
}
