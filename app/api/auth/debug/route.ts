import { NextRequest, NextResponse } from 'next/server'
import { authLogger } from '@/utils/auth-logger'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Only enable debug endpoint when LOG_AUTH is enabled
    if (process.env.LOG_AUTH !== '1') {
      return NextResponse.json(
        { error: 'Debug endpoint disabled' },
        { status: 404 }
      )
    }

    // Get environment info (safe values only)
    const envInfo = {
      NODE_ENV: process.env.NODE_ENV,
      VERCEL_URL: process.env.VERCEL_URL,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL ? '[SET]' : '[NOT SET]',
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? '[SET]' : '[NOT SET]',
      JWT_SECRET: process.env.JWT_SECRET ? '[SET]' : '[NOT SET]',
      AUTH_TRUST_HOST: process.env.AUTH_TRUST_HOST,
      COSMIC_BUCKET_SLUG: process.env.COSMIC_BUCKET_SLUG ? '[SET]' : '[NOT SET]',
      COSMIC_READ_KEY: process.env.COSMIC_READ_KEY ? '[SET]' : '[NOT SET]',
      COSMIC_WRITE_KEY: process.env.COSMIC_WRITE_KEY ? '[SET]' : '[NOT SET]',
      LOG_AUTH: process.env.LOG_AUTH
    }

    // Get cookies info (names only, no values)
    const cookies = request.cookies.getAll()
    const cookiesSummary = cookies.map(cookie => ({
      name: cookie.name,
      hasValue: !!cookie.value,
      secure: request.url.startsWith('https://'),
      sameSite: 'lax' // Default sameSite setting
    }))

    // Check for auth token
    const authToken = request.cookies.get('auth-token')?.value
    const authHeader = request.headers.get('authorization')
    
    const sessionStatus = {
      hasCookieToken: !!authToken,
      hasHeaderToken: !!authHeader,
      cookieTokenLength: authToken ? authToken.length : 0,
      headerTokenLength: authHeader ? authHeader.length : 0
    }

    // Get request info
    const requestInfo = {
      url: request.url,
      method: request.method,
      userAgent: request.headers.get('user-agent'),
      host: request.headers.get('host'),
      origin: request.headers.get('origin'),
      referer: request.headers.get('referer')
    }

    const debugInfo = {
      timestamp: new Date().toISOString(),
      env: envInfo,
      cookiesSummary,
      sessionStatus,
      requestInfo,
      authConfigStatus: {
        hasJwtSecret: !!(process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET),
        jwtSecretLength: (process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET || '').length,
        isProduction: process.env.NODE_ENV === 'production',
        hasCosmicConfig: !!(process.env.COSMIC_BUCKET_SLUG && process.env.COSMIC_READ_KEY),
      }
    }

    // Log debug access
    authLogger.logAuthAttempt({
      route: '/api/auth/debug',
      method: 'GET',
      email: 'system',
      timestamp: new Date().toISOString()
    })

    return NextResponse.json(debugInfo, { status: 200 })

  } catch (error: any) {
    console.error('Auth debug error:', error)
    
    authLogger.logAuthAttempt({
      route: '/api/auth/debug',
      method: 'GET',
      email: 'system',
      timestamp: new Date().toISOString()
    })

    return NextResponse.json(
      { 
        error: 'Debug endpoint error',
        message: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}