import { NextRequest, NextResponse } from 'next/server'
import { CosmicAuth } from '@/lib/cosmic-auth'
import { authLogger } from '@/utils/auth-logger'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Try to get token from Authorization header first
    const authHeader = request.headers.get('authorization')
    const headerToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null
    
    // Fallback to cookie token - check both secure and non-secure versions
    const isProduction = process.env.NODE_ENV === 'production'
    const secureCookieToken = request.cookies.get('__Secure-auth-token')?.value
    const regularCookieToken = request.cookies.get('auth-token')?.value
    
    const cookieToken = isProduction ? (secureCookieToken || regularCookieToken) : regularCookieToken
    const token = headerToken || cookieToken

    authLogger.logAuthAttempt({
      route: '/api/auth/me',
      method: 'GET'
    })

    if (!token) {
      authLogger.logSessionCheck(false)
      return NextResponse.json({ error: 'No authentication token' }, { status: 401 })
    }

    // Verify the token
    const user = CosmicAuth.verifyToken(token)
    if (!user) {
      authLogger.logSessionCheck(false)
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Get full user profile from Cosmic to verify account is still active
    const fullProfile = await CosmicAuth.getUserByAuthId(user.id)
    if (!fullProfile) {
      authLogger.logSessionCheck(false, user.id)
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if account is still active
    const accountStatus = fullProfile.metadata.account_status
    const statusValue = typeof accountStatus === 'object' && accountStatus !== null 
      ? (accountStatus as any).value || (accountStatus as any).key
      : accountStatus

    if (statusValue?.toLowerCase() !== 'active') {
      authLogger.logSessionCheck(false, user.id)
      return NextResponse.json({ 
        error: 'Account is not active',
        accountStatus: statusValue 
      }, { status: 401 })
    }

    authLogger.logSessionCheck(true, user.id)
    
    if (process.env.LOG_AUTH === '1') {
      console.log('Session check successful:', {
        userId: user.id,
        email: user.email,
        accountStatus: statusValue
      })
    }

    return NextResponse.json(user, { status: 200 })

  } catch (error: any) {
    console.error('Auth verification error:', error)
    authLogger.logSessionCheck(false)
    
    return NextResponse.json({ 
      error: 'Authentication failed',
      code: 'AUTH_VERIFICATION_FAILED'
    }, { status: 401 })
  }
}