import { NextRequest, NextResponse } from 'next/server'
import { CosmicAuth } from '@/lib/cosmic-auth'
import { getSalesExecutiveByAuthId } from '@/lib/cosmic'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No valid authorization header' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7) // Remove "Bearer " prefix

    // Verify token
    const user = CosmicAuth.verifyToken(token)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    // Get full user profile from Cosmic
    const profile = await getSalesExecutiveByAuthId(user.id)
    
    if (!profile) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      )
    }

    // Return user data with profile information
    return NextResponse.json({ 
      user: {
        ...user,
        profile: profile
      }
    }, { status: 200 })

  } catch (error: any) {
    console.error('Get current user error:', error)
    return NextResponse.json(
      { error: 'Failed to get user information' },
      { status: 500 }
    )
  }
}