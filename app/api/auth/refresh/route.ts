import { NextRequest, NextResponse } from 'next/server'
import { CosmicAuth } from '@/lib/cosmic-auth'
import { getSalesExecutiveByAuthId } from '@/lib/cosmic'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No valid authorization header' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7) // Remove "Bearer " prefix

    // Verify current token
    const user = CosmicAuth.verifyToken(token)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    // Check if user still exists and is active
    const profile = await getSalesExecutiveByAuthId(user.id)
    
    if (!profile || profile.metadata?.account_status !== 'active') {
      return NextResponse.json(
        { error: 'User account is not active' },
        { status: 401 }
      )
    }

    // Generate new token
    const newToken = CosmicAuth.generateToken(user)

    return NextResponse.json({ 
      user: user,
      token: newToken 
    }, { status: 200 })

  } catch (error: any) {
    console.error('Token refresh error:', error)
    return NextResponse.json(
      { error: 'Failed to refresh token' },
      { status: 401 }
    )
  }
}