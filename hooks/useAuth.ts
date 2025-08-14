'use client'

import { useState, useEffect } from 'react'
import { AuthUser } from '@/lib/cosmic-auth'

interface UseAuthReturn {
  user: AuthUser | null
  loading: boolean
  token: string | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, firstName: string, lastName: string) => Promise<void>
  logout: () => Promise<void>
  refreshToken: () => Promise<boolean>
  updateProfile: (data: any) => Promise<void>
  error: string | null
  clearError: () => void
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check for existing token on mount
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const storedToken = localStorage.getItem('auth_token')
      if (!storedToken) {
        setLoading(false)
        return
      }

      setToken(storedToken)

      // Verify token with server
      const response = await fetch('/api/auth/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${storedToken}`
        }
      })

      if (response.ok) {
        const { user: userData } = await response.json()
        setUser(userData)
      } else {
        // Token is invalid, remove it
        localStorage.removeItem('auth_token')
        setToken(null)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      localStorage.removeItem('auth_token')
      setToken(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string): Promise<void> => {
    try {
      setError(null)
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to sign in')
      }

      const { user: userData, token: userToken } = await response.json()
      
      // Store token and update state
      localStorage.setItem('auth_token', userToken)
      setToken(userToken)
      setUser(userData)
    } catch (error: any) {
      setError(error.message || 'Failed to sign in')
      throw error
    }
  }

  const signup = async (
    email: string, 
    password: string, 
    firstName: string, 
    lastName: string
  ): Promise<void> => {
    try {
      setError(null)
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
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create account')
      }

      const { user: userData, token: userToken } = await response.json()
      
      // Store token and update state
      localStorage.setItem('auth_token', userToken)
      setToken(userToken)
      setUser(userData)
    } catch (error: any) {
      setError(error.message || 'Failed to create account')
      throw error
    }
  }

  const logout = async (): Promise<void> => {
    try {
      if (token) {
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
      setToken(null)
      setUser(null)
    }
  }

  const refreshToken = async (): Promise<boolean> => {
    try {
      if (!token) return false

      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        await logout()
        return false
      }

      const { user: userData, token: newToken } = await response.json()
      
      localStorage.setItem('auth_token', newToken)
      setToken(newToken)
      setUser(userData)
      
      return true
    } catch (error) {
      console.error('Token refresh failed:', error)
      await logout()
      return false
    }
  }

  const updateProfile = async (data: any): Promise<void> => {
    try {
      if (!token) throw new Error('Not authenticated')

      setError(null)
      const response = await fetch('/api/users/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update profile')
      }

      // Refresh user data
      await checkAuthStatus()
    } catch (error: any) {
      setError(error.message || 'Failed to update profile')
      throw error
    }
  }

  const clearError = () => {
    setError(null)
  }

  return {
    user,
    loading,
    token,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    refreshToken,
    updateProfile,
    error,
    clearError
  }
}