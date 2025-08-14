import jwt, { SignOptions, JwtPayload } from 'jsonwebtoken'

export interface TokenPayload extends JwtPayload {
  id: string
  uid: string
  email: string
  firstName: string
  lastName: string
}

// Get JWT secret with fallbacks
function getJwtSecret(): string {
  const secret = process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET
  if (!secret) {
    throw new Error('Missing NEXTAUTH_SECRET or JWT_SECRET environment variable')
  }
  if (secret.length < 32) {
    throw new Error('JWT secret must be at least 32 characters long')
  }
  return secret
}

// Sign JWT token
export function signJwt(
  payload: Omit<TokenPayload, 'iat' | 'exp'>, 
  options: SignOptions = { expiresIn: '7d' }
): string {
  try {
    const secret = getJwtSecret()
    // Ensure expiresIn is properly typed for JWT library - use fallback if env var is undefined
    const expiresIn: string = process.env.JWT_EXPIRES_IN || '7d'
    const signOptions: SignOptions = { ...options, expiresIn }
    return jwt.sign(payload, secret, signOptions)
  } catch (error) {
    console.error('JWT signing error:', error)
    throw new Error('Failed to sign JWT token')
  }
}

// Verify JWT token
export function verifyJwt<T = TokenPayload>(token: string): T {
  try {
    const secret = getJwtSecret()
    return jwt.verify(token, secret) as T
  } catch (error) {
    console.error('JWT verification error:', error)
    throw new Error('Invalid or expired token')
  }
}

// Decode JWT token without verification (for debugging)
export function decodeJwt(token: string): any {
  try {
    return jwt.decode(token, { complete: true })
  } catch (error) {
    console.error('JWT decode error:', error)
    return null
  }
}

// Check if token is expired
export function isTokenExpired(token: string): boolean {
  try {
    const decoded = jwt.decode(token) as JwtPayload
    if (!decoded || !decoded.exp) return true
    
    const now = Math.floor(Date.now() / 1000)
    return decoded.exp < now
  } catch (error) {
    return true
  }
}

// Refresh token if it's close to expiring
export function shouldRefreshToken(token: string): boolean {
  try {
    const decoded = jwt.decode(token) as JwtPayload
    if (!decoded || !decoded.exp) return true
    
    const now = Math.floor(Date.now() / 1000)
    const timeUntilExpiry = decoded.exp - now
    
    // Refresh if less than 1 hour remaining
    return timeUntilExpiry < 3600
  } catch (error) {
    return true
  }
}