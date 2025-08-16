import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import { cosmic } from '@/lib/cosmic'

export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAuth(request)
    
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const { objects: topics } = await cosmic.objects
      .find({ type: 'discussion-topics' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)

    return NextResponse.json({ topics: topics || [] })
  } catch (error: unknown) {
    const cosmicError = error as { status?: number }
    if (cosmicError.status === 404) {
      return NextResponse.json({ topics: [] })
    }
    
    console.error('Get discussions error:', error)
    return NextResponse.json(
      { error: 'Failed to get discussion topics' },
      { status: 500 }
    )
  }
}