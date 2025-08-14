import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

export interface TokenPayload {
  id: string
  uid: string
  email: string
  firstName: string
  lastName: string
  iat?: number
  exp?: number
}

export function signJwt(payload: Omit<TokenPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '7d',
  })
}

export function verifyJwt<T = TokenPayload>(token: string): T {
  try {
    return jwt.verify(token, JWT_SECRET) as T
  } catch (error) {
    throw new Error('Invalid or expired token')
  }
}