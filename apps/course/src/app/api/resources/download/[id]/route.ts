import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: resourceId } = await params

    // TODO: When database is running, create ResourceDownload record via Prisma
    // try {
    //   await prisma.resourceDownload.create({
    //     data: {
    //       userId: user.id,
    //       resourceId,
    //       downloadedAt: new Date(),
    //     },
    //   })
    // } catch (dbError) {
    //   console.error('Database error:', dbError)
    // }

    // Placeholder response until database is connected
    console.log('Resource download:', { userId: user.id, resourceId })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Resource download API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
