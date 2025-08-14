import { NextRequest, NextResponse } from 'next/server'
import { CosmicAuth } from '@/lib/cosmic-auth'
import { getSalesExecutiveByAuthId } from '@/lib/cosmic'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Try multiple token sources
    const authHeader = request.headers.get('Authorization')
    const headerToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null
    
    // Fallback to cookie token
    const isProduction = process.env.NODE_ENV === 'production'
    const secureCookieToken = request.cookies.get('__Secure-auth-token')?.value
    const regularCookieToken = request.cookies.get('auth-token')?.value
    
    const cookieToken = isProduction ? (secureCookieToken || regularCookieToken) : regularCookieToken
    const token = headerToken || cookieToken

    if (!token) {
      return NextResponse.json(
        { error: 'No valid authorization token' },
        { status: 401 }
      )
    }

    // Verify token
    const user = CosmicAuth.verifyToken(token)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    // Get user profile from Cosmic
    const profile = await getSalesExecutiveByAuthId(user.id)
    
    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ profile }, { status: 200 })

  } catch (error: any) {
    console.error('Get profile error:', error)
    return NextResponse.json(
      { error: 'Failed to get profile' },
      { status: 500 }
    )
  }
}