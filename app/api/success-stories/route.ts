import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import { cosmic } from '@/lib/cosmic'

export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAuth(request)
    
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const { objects: stories } = await cosmic.objects
      .find({ 
        type: 'success-stories',
        'metadata.approval_status': 'approved'
      })
      .props(['id', 'title', 'slug', 'metadata', 'created_at'])
      .depth(1)

    return NextResponse.json({ stories: stories || [] })
  } catch (error: unknown) {
    const cosmicError = error as { status?: number }
    if (cosmicError.status === 404) {
      return NextResponse.json({ stories: [] })
    }
    
    console.error('Get success stories error:', error)
    return NextResponse.json(
      { error: 'Failed to get success stories' },
      { status: 500 }
    )
  }
}