import jwt, { SignOptions, JwtPayload } from 'jsonwebtoken';
import ms from 'ms';

export interface TokenPayload extends JwtPayload {
  id: string
  uid: string
  email: string
  firstName: string
  lastName: string
}

function getJwtSecret(): string {
  const s = process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET;
  if (!s) throw new Error('Missing NEXTAUTH_SECRET/JWT_SECRET');
  return s;
}

// Convert env like "3600" or "1h" into a NUMBER OF SECONDS for jsonwebtoken
function resolveExpiresIn(envValue?: string, fallbackSeconds = 3600): number {
  if (!envValue || envValue.trim() === '') return fallbackSeconds;
  // If it's a plain number string (seconds)
  const n = Number(envValue);
  if (!Number.isNaN(n)) return Math.max(1, Math.floor(n));
  // Otherwise parse duration like "1h", "7d", etc.
  const msValue = ms(envValue); // returns milliseconds | undefined
  if (typeof msValue === 'number' && msValue > 0) {
    return Math.max(1, Math.floor(msValue / 1000)); // convert to seconds
  }
  throw new Error(`Invalid JWT_EXPIRES_IN value: ${envValue}`);
}

const DEFAULT_EXPIRES_SEC = 604800; // 7 days in seconds

// Sign JWT token
export function signJwt(
  payload: Omit<TokenPayload, 'iat' | 'exp'>, 
  options: Omit<SignOptions, 'expiresIn' | 'algorithm'> = {}
): string {
  try {
    const secret = getJwtSecret();
    const expiresInSec = resolveExpiresIn(process.env.JWT_EXPIRES_IN, DEFAULT_EXPIRES_SEC);
    
    // IMPORTANT: pass a NUMBER to satisfy the type: number | StringValue
    const signOptions: SignOptions = { 
      ...options,
      algorithm: 'HS256',
      expiresIn: expiresInSec
    };
    
    return jwt.sign(payload, secret, signOptions);
  } catch (error) {
    console.error('JWT signing error:', error);
    throw new Error('Failed to sign JWT token');
  }
}

// Verify JWT token
export function verifyJwt<T = TokenPayload>(token: string): T {
  try {
    const secret = getJwtSecret();
    return jwt.verify(token, secret) as T;
  } catch (error) {
    console.error('JWT verification error:', error);
    throw new Error('Invalid or expired token');
  }
}

// Sign access token (alias for compatibility)
export function signAccessToken(
  payload: object,
  options: Omit<SignOptions, 'expiresIn' | 'algorithm'> = {}
): string {
  const secret = getJwtSecret();
  const expiresInSec = resolveExpiresIn(process.env.JWT_EXPIRES_IN, DEFAULT_EXPIRES_SEC);
  
  const signOpts: SignOptions = {
    ...options,
    algorithm: 'HS256',
    expiresIn: expiresInSec,
  };
  return jwt.sign(payload, secret, signOpts);
}

// Verify access token (alias for compatibility)
export function verifyAccessToken<T = any>(token: string): T {
  const secret = getJwtSecret();
  return jwt.verify(token, secret) as T;
}

// Decode JWT token without verification (for debugging)
export function decodeJwt(token: string): any {
  try {
    return jwt.decode(token, { complete: true });
  } catch (error) {
    console.error('JWT decode error:', error);
    return null;
  }
}

// Check if token is expired
export function isTokenExpired(token: string): boolean {
  try {
    const decoded = jwt.decode(token) as JwtPayload;
    if (!decoded || !decoded.exp) return true;
    
    const now = Math.floor(Date.now() / 1000);
    return decoded.exp < now;
  } catch (error) {
    return true;
  }
}

// Refresh token if it's close to expiring
export function shouldRefreshToken(token: string): boolean {
  try {
    const decoded = jwt.decode(token) as JwtPayload;
    if (!decoded || !decoded.exp) return true;
    
    const now = Math.floor(Date.now() / 1000);
    const timeUntilExpiry = decoded.exp - now;
    
    // Refresh if less than 1 hour remaining
    return timeUntilExpiry < 3600;
  } catch (error) {
    return true;
  }
}