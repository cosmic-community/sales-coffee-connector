import { NextRequest, NextResponse } from 'next/server'
import { CosmicAuth } from '@/lib/cosmic-auth'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Try to get token from Authorization header first
    const authHeader = request.headers.get('authorization')
    const headerToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null
    
    // Fallback to cookie token
    const cookieToken = request.cookies.get('auth-token')?.value
    
    const token = headerToken || cookieToken

    if (!token) {
      return NextResponse.json({ error: 'No authentication token' }, { status: 401 })
    }

    // Verify the token
    const user = CosmicAuth.verifyToken(token)
    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Get full user profile from Cosmic
    const fullProfile = await CosmicAuth.getUserByAuthId(user.id)
    if (!fullProfile) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if account is still active
    const accountStatus = fullProfile.metadata.account_status
    const statusValue = typeof accountStatus === 'object' && accountStatus !== null 
      ? (accountStatus as any).value || (accountStatus as any).key
      : accountStatus

    if (statusValue?.toLowerCase() !== 'active') {
      return NextResponse.json({ error: 'Account is not active' }, { status: 401 })
    }

    return NextResponse.json(user, { status: 200 })

  } catch (error: any) {
    console.error('Auth verification error:', error)
    return NextResponse.json({ error: 'Authentication failed' }, { status: 401 })
  }
}