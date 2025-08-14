import { createBucketClient } from '@cosmicjs/sdk'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { SalesExecutive } from '@/types'

// Create Cosmic client with write permissions for server-side auth operations
const cosmic = createBucketClient({
  bucketSlug: process.env.COSMIC_BUCKET_SLUG as string,
  readKey: process.env.COSMIC_READ_KEY as string,
  writeKey: process.env.COSMIC_WRITE_KEY as string,
  apiEnvironment: 'staging'
})

// JWT secret from environment variables
const JWT_SECRET = process.env.JWT_SECRET as string
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

export interface AuthUser {
  id: string
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
      // Check if user already exists
      const existingUser = await this.getUserByEmail(email)
      if (existingUser) {
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
          account_status: 'active',
          profile_completed: false,
          willing_to_mentor: false,
          seeking_mentorship: false,
          max_meetings_per_week: '2' // default value
        }
      }

      const response = await cosmic.objects.insertOne(userPayload)
      
      // Create auth response
      const user: AuthUser = {
        id: authUserId,
        email: email,
        firstName: firstName,
        lastName: lastName
      }

      const token = this.generateToken(user)

      return { user, token }

    } catch (error: any) {
      throw new Error(error.message || 'Failed to create user')
    }
  }

  // Sign in existing user
  static async signIn(email: string, password: string): Promise<AuthResponse> {
    try {
      // Find user by email
      const cosmicUser = await this.getUserByEmail(email)
      if (!cosmicUser) {
        throw new Error('Invalid email or password')
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(
        password, 
        cosmicUser.metadata.password_hash || ''
      )

      if (!isPasswordValid) {
        throw new Error('Invalid email or password')
      }

      // Check account status
      if (cosmicUser.metadata.account_status !== 'active') {
        throw new Error('Account is not active. Please contact support.')
      }

      // Create auth response
      const user: AuthUser = {
        id: cosmicUser.metadata.auth_user_id || cosmicUser.id,
        email: cosmicUser.metadata.email || email,
        firstName: cosmicUser.metadata.first_name || '',
        lastName: cosmicUser.metadata.last_name || ''
      }

      const token = this.generateToken(user)

      return { user, token }

    } catch (error: any) {
      throw new Error(error.message || 'Failed to sign in')
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

      return response.objects[0] as SalesExecutive || null
    } catch (error) {
      if (hasStatus(error) && error.status === 404) {
        return null
      }
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

  // Generate JWT token
  static generateToken(user: AuthUser): string {
    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET environment variable is required')
    }

    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    )
  }

  // Verify JWT token
  static verifyToken(token: string): AuthUser | null {
    try {
      if (!JWT_SECRET) {
        throw new Error('JWT_SECRET environment variable is required')
      }

      const decoded = jwt.verify(token, JWT_SECRET) as any
      return {
        id: decoded.id,
        email: decoded.email,
        firstName: decoded.firstName,
        lastName: decoded.lastName
      }
    } catch (error) {
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