'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { AuthUser } from '@/lib/cosmic-auth'

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<AuthUser>
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<AuthUser>
  signInWithGoogle: () => Promise<AuthUser> // Added missing method
  signOut: () => Promise<void>
  logout: () => Promise<void>
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>
  isAuthenticated: boolean
  isFirebaseAvailable: boolean // Keep for compatibility
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing token on mount
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) {
        setLoading(false)
        return
      }

      // Verify token with server
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const { user: verifiedUser } = await response.json()
        setUser(verifiedUser)
      } else {
        // Token is invalid, remove it
        localStorage.removeItem('auth_token')
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      localStorage.removeItem('auth_token')
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string): Promise<AuthUser> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to sign in')
      }

      const { user, token } = await response.json()
      
      // Store token in localStorage
      localStorage.setItem('auth_token', token)
      setUser(user)
      
      return user
    } catch (error: any) {
      throw new Error(error.message || 'Failed to sign in')
    }
  }

  const signUp = async (
    email: string, 
    password: string, 
    firstName: string, 
    lastName: string
  ): Promise<AuthUser> => {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          email, 
          password, 
          firstName, 
          lastName 
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create account')
      }

      const { user, token } = await response.json()
      
      // Store token in localStorage
      localStorage.setItem('auth_token', token)
      setUser(user)
      
      return user
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create account')
    }
  }

  // Added Google sign-in method
  const signInWithGoogle = async (): Promise<AuthUser> => {
    try {
      // For now, throw an error as Google OAuth is not implemented
      // This can be implemented later with proper OAuth flow
      throw new Error('Google sign-in is not yet implemented')
    } catch (error: any) {
      throw new Error(error.message || 'Failed to sign in with Google')
    }
  }

  const signOut = async (): Promise<void> => {
    try {
      const token = localStorage.getItem('auth_token')
      if (token) {
        // Call logout endpoint
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Always clear local state
      localStorage.removeItem('auth_token')
      setUser(null)
    }
  }

  const updatePassword = async (
    currentPassword: string, 
    newPassword: string
  ): Promise<void> => {
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) {
        throw new Error('Not authenticated')
      }

      const response = await fetch('/api/auth/update-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update password')
      }
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update password')
    }
  }

  // Alias for signOut to support both naming conventions
  const logout = signOut

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signInWithGoogle, // Added to context value
    signOut,
    logout,
    updatePassword,
    isAuthenticated: !!user,
    isFirebaseAvailable: true // Always true for our Cosmic auth
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}