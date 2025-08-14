import { createBucketClient } from '@cosmicjs/sdk'
import bcrypt from 'bcryptjs'
import { signJwt, verifyJwt, TokenPayload } from '@/lib/jwt'
import { authLogger } from '@/utils/auth-logger'
import { SalesExecutive } from '@/types'

// Create Cosmic client with write permissions for server-side auth operations
const cosmic = createBucketClient({
  bucketSlug: process.env.COSMIC_BUCKET_SLUG as string,
  readKey: process.env.COSMIC_READ_KEY as string,
  writeKey: process.env.COSMIC_WRITE_KEY as string,
  apiEnvironment: 'staging'
})

export interface AuthUser {
  id: string
  uid: string
  email: string
  firstName: string
  lastName: string
}

export interface AuthResponse {
  user: AuthUser
  token: string
}

// Simple error helper for Cosmic SDK
function hasStatus(error: unknown): error is { status: number } {
  return typeof error === 'object' && error !== null && 'status' in error;
}

export class CosmicAuth {
  
  // Sign up a new user
  static async signUp(
    email: string, 
    password: string, 
    firstName: string, 
    lastName: string
  ): Promise<AuthResponse> {
    try {
      authLogger.logAuthAttempt({
        route: '/api/auth/signup',
        method: 'POST',
        email
      })

      // Check if user already exists
      const existingUser = await this.getUserByEmail(email)
      if (existingUser) {
        authLogger.logSignInFailure(email, 'User already exists', '/api/auth/signup')
        throw new Error('User with this email already exists')
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 12)
      
      // Generate unique auth user ID
      const authUserId = `cosmic_${Date.now()}_${Math.random().toString(36).substring(2)}`

      // Create the user in Cosmic CMS
      const userPayload = {
        title: `${firstName} ${lastName}`,
        type: 'sales-executives',
        status: 'published',
        metadata: {
          auth_user_id: authUserId,
          first_name: firstName,
          last_name: lastName,
          email: email,
          password_hash: hashedPassword,
          account_status: 'active', // Set to active by default for now
          profile_completed: false,
          willing_to_mentor: false,
          seeking_mentorship: false,
          max_meetings_per_week: '2',
          years_in_sales: 0,
          annual_quota: 0,
          company_name: '',
          job_title: '',
          timezone: '',
          company_size: ''
        }
      }

      const response = await cosmic.objects.insertOne(userPayload)
      
      // Create auth response
      const user: AuthUser = {
        id: authUserId,
        uid: authUserId,
        email: email,
        firstName: firstName,
        lastName: lastName
      }

      const token = this.generateToken(user)

      authLogger.logSignInSuccess(authUserId, email, '/api/auth/signup')
      return { user, token }

    } catch (error: any) {
      console.error('Signup error:', error)
      authLogger.logSignInFailure(email, error.message, '/api/auth/signup')
      throw new Error(error.message || 'Failed to create user')
    }
  }

  // Sign in existing user - Enhanced with better logging and error handling
  static async signIn(email: string, password: string): Promise<AuthResponse> {
    try {
      authLogger.logAuthAttempt({
        route: '/api/auth/login',
        method: 'POST',
        email
      })

      // Find user by email
      const cosmicUser = await this.getUserByEmail(email)
      if (!cosmicUser) {
        authLogger.logSignInFailure(email, 'User not found', '/api/auth/login')
        throw new Error('Invalid email or password')
      }

      // Enhanced debug logging
      if (process.env.LOG_AUTH === '1') {
        console.log('Found user for sign-in:', {
          id: cosmicUser.id,
          email: cosmicUser.metadata?.email,
          hasPassword: !!cosmicUser.metadata?.password_hash,
          accountStatus: cosmicUser.metadata?.account_status,
          authUserId: cosmicUser.metadata?.auth_user_id
        })
      }

      // Verify password
      const passwordHash = cosmicUser.metadata?.password_hash
      if (!passwordHash) {
        authLogger.logSignInFailure(email, 'No password hash found', '/api/auth/login')
        throw new Error('User account is not properly configured')
      }

      const isPasswordValid = await bcrypt.compare(password, passwordHash)
      if (!isPasswordValid) {
        authLogger.logSignInFailure(email, 'Invalid password', '/api/auth/login')
        throw new Error('Invalid email or password')
      }

      // Check account status - handle both string values and object format
      const accountStatus = cosmicUser.metadata.account_status
      let statusValue: string

      // Handle different account status formats from Cosmic CMS
      if (typeof accountStatus === 'string') {
        statusValue = accountStatus
      } else if (typeof accountStatus === 'object' && accountStatus !== null) {
        statusValue = (accountStatus as any).value || (accountStatus as any).key || ''
      } else {
        statusValue = ''
      }

      // Normalize status comparison - accept both 'active' and 'Active'
      const normalizedStatus = statusValue.toLowerCase()
      if (normalizedStatus !== 'active') {
        const errorMsg = this.getAccountStatusError(normalizedStatus)
        authLogger.logSignInFailure(email, `Account status: ${normalizedStatus}`, '/api/auth/login')
        throw new Error(errorMsg)
      }

      // Create auth response for active users
      const authUserId = cosmicUser.metadata.auth_user_id || cosmicUser.id
      const user: AuthUser = {
        id: authUserId,
        uid: authUserId,
        email: cosmicUser.metadata.email || email,
        firstName: cosmicUser.metadata.first_name || '',
        lastName: cosmicUser.metadata.last_name || ''
      }

      const token = this.generateToken(user)

      authLogger.logSignInSuccess(authUserId, email, '/api/auth/login')
      return { user, token }

    } catch (error: any) {
      console.error('Sign in error:', error)
      authLogger.logSignInFailure(email, error.message, '/api/auth/login')
      throw new Error(error.message || 'Failed to sign in')
    }
  }

  // Helper to get appropriate error message for account status
  private static getAccountStatusError(status: string): string {
    switch (status) {
      case 'pending':
        return 'Your account is pending approval. Please wait for account activation.'
      case 'suspended':
        return 'Your account has been suspended. Please contact support.'
      case 'inactive':
        return 'Your account is inactive. Please contact support.'
      default:
        return 'Account status not recognized. Please contact support.'
    }
  }

  // Get user by email
  static async getUserByEmail(email: string): Promise<SalesExecutive | null> {
    try {
      const response = await cosmic.objects
        .find({ 
          type: 'sales-executives',
          'metadata.email': email
        })
        .props(['id', 'title', 'metadata'])
        .depth(1)

      return response.objects[0] as SalesExecutive || null
    } catch (error) {
      if (hasStatus(error) && error.status === 404) {
        return null
      }
      console.error('Get user by email error:', error)
      throw new Error('Failed to fetch user')
    }
  }

  // Get user by auth ID
  static async getUserByAuthId(authUserId: string): Promise<SalesExecutive | null> {
    try {
      const response = await cosmic.objects
        .find({ 
          type: 'sales-executives',
          'metadata.auth_user_id': authUserId
        })
        .props(['id', 'title', 'metadata'])
        .depth(1)

      return response.objects[0] as SalesExecutive || null
    } catch (error) {
      if (hasStatus(error) && error.status === 404) {
        return null
      }
      throw new Error('Failed to fetch user profile')
    }
  }

  // Generate JWT token using new jwt utils
  static generateToken(user: AuthUser): string {
    try {
      return signJwt({
        id: user.id,
        uid: user.uid,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      })
    } catch (error) {
      console.error('Token generation error:', error)
      throw new Error('Failed to generate authentication token')
    }
  }

  // Verify JWT token using new jwt utils
  static verifyToken(token: string): AuthUser | null {
    try {
      const decoded = verifyJwt<TokenPayload>(token)
      
      authLogger.logTokenVerification(true, decoded.id)
      
      return {
        id: decoded.id,
        uid: decoded.uid || decoded.id,
        email: decoded.email,
        firstName: decoded.firstName,
        lastName: decoded.lastName
      }
    } catch (error) {
      console.error('Token verification error:', error)
      authLogger.logTokenVerification(false)
      return null
    }
  }

  // Update user password
  static async updatePassword(
    authUserId: string, 
    currentPassword: string, 
    newPassword: string
  ): Promise<boolean> {
    try {
      const user = await this.getUserByAuthId(authUserId)
      if (!user) {
        throw new Error('User not found')
      }

      // Verify current password
      const isCurrentPasswordValid = await bcrypt.compare(
        currentPassword,
        user.metadata.password_hash || ''
      )

      if (!isCurrentPasswordValid) {
        throw new Error('Current password is incorrect')
      }

      // Hash new password
      const hashedNewPassword = await bcrypt.hash(newPassword, 12)

      // Update user in Cosmic
      await cosmic.objects.updateOne(user.id, {
        metadata: {
          ...user.metadata,
          password_hash: hashedNewPassword
        }
      })

      return true
    } catch (error) {
      throw new Error('Failed to update password')
    }
  }

  // Delete user account
  static async deleteUser(authUserId: string): Promise<boolean> {
    try {
      const user = await this.getUserByAuthId(authUserId)
      if (!user) {
        throw new Error('User not found')
      }

      await cosmic.objects.deleteOne(user.id)
      return true
    } catch (error) {
      throw new Error('Failed to delete user')
    }
  }
}