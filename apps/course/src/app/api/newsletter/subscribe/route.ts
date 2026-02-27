import { NextRequest, NextResponse } from 'next/server'
import { addSubscriber } from '@/lib/convertkit'

const VALID_SOURCES = ['purchase', 'course-complete', 'newsletter'] as const
type Source = (typeof VALID_SOURCES)[number]

const SOURCE_TAG_MAP: Record<Source, string> = {
  purchase: 'gyp-purchased',
  'course-complete': 'gyp-completed',
  newsletter: 'gyp-newsletter-only',
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (
    typeof body !== 'object' ||
    body === null ||
    !('email' in body) ||
    typeof (body as Record<string, unknown>).email !== 'string'
  ) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 })
  }

  const email = (body as Record<string, unknown>).email as string
  if (!isValidEmail(email)) {
    return NextResponse.json(
      { error: 'Invalid email address' },
      { status: 400 },
    )
  }

  const rawSource = (body as Record<string, unknown>).source
  const source: Source =
    typeof rawSource === 'string' &&
    VALID_SOURCES.includes(rawSource as Source)
      ? (rawSource as Source)
      : 'newsletter'

  const tagName = SOURCE_TAG_MAP[source]

  try {
    await addSubscriber(email, [tagName])
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Newsletter subscribe error:', error)
    return NextResponse.json(
      { error: 'Failed to subscribe. Please try again.' },
      { status: 500 },
    )
  }
}
