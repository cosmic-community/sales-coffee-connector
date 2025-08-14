import { NextRequest, NextResponse } from 'next/server'
import { CosmicAuth } from '@/lib/cosmic-auth'
import { authLogger } from '@/utils/auth-logger'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Enhanced logging for debugging
    authLogger.logAuthAttempt({
      route: '/api/auth/login',
      method: 'POST',
      email: email || '[no email provided]'
    })

    // Validate input
    if (!email || !password) {
      authLogger.logSignInFailure(email || '', 'Missing email or password', '/api/auth/login')
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      authLogger.logSignInFailure(email, 'Invalid email format', '/api/auth/login')
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      )
    }

    // Sign in user
    const authResponse = await CosmicAuth.signIn(email, password)

    // Create response with enhanced cookie settings for production
    const response = NextResponse.json(authResponse, { status: 200 })
    
    // Set secure cookies for production
    const isProduction = process.env.NODE_ENV === 'production'
    const cookieName = isProduction ? '__Secure-auth-token' : 'auth-token'
    
    response.cookies.set(cookieName, authResponse.token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    })

    // Additional logging for successful login
    authLogger.logSignInSuccess(authResponse.user.id, email, '/api/auth/login')
    
    if (process.env.LOG_AUTH === '1') {
      console.log('Login successful:', {
        userId: authResponse.user.id,
        email: authResponse.user.email,
        tokenLength: authResponse.token.length,
        cookieSet: cookieName
      })
    }

    return response

  } catch (error: any) {
    console.error('Login API error:', error)
    
    // Try to extract email from request for logging
    let email = ''
    try {
      const body = await request.json()
      email = body.email || ''
    } catch {}
    
    authLogger.logSignInFailure(email, error.message, '/api/auth/login')
    
    return NextResponse.json(
      { 
        error: error.message || 'Failed to sign in',
        code: 'SIGN_IN_FAILED'
      },
      { status: 401 }
    )
  }
}