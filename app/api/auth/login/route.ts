import { NextRequest, NextResponse } from 'next/server'
import { CosmicAuth } from '@/lib/cosmic-auth'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Sign in user
    const authResponse = await CosmicAuth.signIn(email, password)

    // Create session cookie for client-side auth state
    const response = NextResponse.json(authResponse, { status: 200 })
    response.cookies.set('auth-token', authResponse.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    return response

  } catch (error: any) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to sign in' },
      { status: 401 }
    )
  }
}