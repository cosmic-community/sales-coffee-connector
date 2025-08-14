import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

// Paths that require authentication
const protectedPaths = [
  '/dashboard',
  '/profile',
  '/onboarding',
  '/matching',
  '/sessions',
  '/settings'
]

// Paths that should redirect authenticated users away
const authPaths = [
  '/login',
  '/signup',
  '/forgot-password'
]

// API routes that require authentication
const protectedApiPaths = [
  '/api/users',
  '/api/auth/me',
  '/api/auth/update-password',
  '/api/auth/refresh'
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for static files and api routes that don't need auth
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/auth/login') ||
    pathname.startsWith('/api/auth/signup') ||
    pathname.startsWith('/api/auth/verify') ||
    pathname.startsWith('/api/auth/logout') ||
    pathname.includes('.') // static files
  ) {
    return NextResponse.next()
  }

  // Get token from Authorization header or cookie
  const authHeader = request.headers.get('Authorization')
  let token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null
  
  if (!token) {
    token = request.cookies.get('auth_token')?.value || null
  }

  let isAuthenticated = false
  
  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret')
      await jwtVerify(token, secret)
      isAuthenticated = true
    } catch (error) {
      // Token is invalid, treat as unauthenticated
      isAuthenticated = false
    }
  }

  // Handle protected paths
  if (protectedPaths.some(path => pathname.startsWith(path))) {
    if (!isAuthenticated) {
      // Redirect to login with return URL
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('returnUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Handle auth paths (redirect authenticated users)
  if (authPaths.some(path => pathname.startsWith(path))) {
    if (isAuthenticated) {
      // Redirect to dashboard if already authenticated
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  // Handle protected API routes
  if (protectedApiPaths.some(path => pathname.startsWith(path))) {
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}