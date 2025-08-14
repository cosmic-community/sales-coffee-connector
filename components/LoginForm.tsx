'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { Users, Mail, Lock, Eye, EyeOff, AlertCircle, RefreshCw } from 'lucide-react'
import { validateLoginForm } from '@/utils/validation'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [retryCount, setRetryCount] = useState(0)
  
  const { login } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Get return URL from query params
  const returnUrl = searchParams.get('returnUrl') || '/dashboard'

  // Exponential backoff retry logic
  const getRetryDelay = (attempt: number): number => {
    return Math.min(1000 * Math.pow(2, attempt), 10000) // Max 10 second delay
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validate form
    const validation = validateLoginForm(email, password)
    if (!validation.isValid) {
      setError(validation.error || 'Please check your input')
      return
    }

    setLoading(true)
    
    try {
      console.log('Attempting login with:', { 
        email, 
        hasPassword: !!password,
        attempt: retryCount + 1
      })
      
      await login(email, password)
      
      // Reset retry count on success
      setRetryCount(0)
      router.push(returnUrl)
      
    } catch (error: any) {
      console.error('Login error:', error)
      
      // Handle different error types
      let errorMessage = error.message || 'Failed to sign in'
      let shouldRetry = false
      
      // Network errors might be retryable
      if (error.message?.includes('fetch') || error.message?.includes('network')) {
        shouldRetry = true
        errorMessage = 'Network error. Please check your connection and try again.'
      }
      
      // Show appropriate error message
      if (error.message?.includes('Invalid email or password')) {
        setError('Invalid email or password. Please check your credentials and try again.')
      } else if (error.message?.includes('pending')) {
        setError('Your account is pending approval. Please wait for account activation.')
      } else if (error.message?.includes('suspended')) {
        setError('Your account has been suspended. Please contact support.')
      } else if (error.message?.includes('inactive')) {
        setError('Your account is inactive. Please contact support.')
      } else {
        setError(`${errorMessage}${shouldRetry && retryCount < 3 ? ' (Will retry automatically)' : ''}`)
      }
      
      // Auto-retry for network errors
      if (shouldRetry && retryCount < 3) {
        const delay = getRetryDelay(retryCount)
        setRetryCount(prev => prev + 1)
        
        setTimeout(() => {
          handleSubmit(e)
        }, delay)
      }
      
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setLoading(true)
    setError('Google sign-in is coming soon! Please use email login for now.')
    setLoading(false)
  }

  const handleRetry = () => {
    setError('')
    setRetryCount(0)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-primary-500 text-white p-3 rounded-full">
              <Users className="w-8 h-8" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
          <p className="mt-2 text-gray-600">Sign in to continue networking</p>
        </div>

        {/* Sign In Form */}
        <div className="card">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="text-red-700 text-sm">{error}</div>
                  {retryCount > 0 && (
                    <div className="text-red-600 text-xs mt-1">
                      Retry attempt: {retryCount}/3
                    </div>
                  )}
                  {retryCount >= 3 && (
                    <button
                      onClick={handleRetry}
                      className="text-red-600 text-xs mt-2 underline hover:no-underline"
                    >
                      Try again
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value.trim())}
                  className="input-field pl-10"
                  placeholder="your@email.com"
                  autoComplete="email"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-10 pr-10"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  disabled={loading}
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>

              <Link href="/forgot-password" className="text-sm text-primary-600 hover:text-primary-500">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading && <RefreshCw className="w-4 h-4 animate-spin" />}
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="mt-3 w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 text-gray-700 font-medium disabled:opacity-50"
            >
              <img 
                src="https://developers.google.com/identity/images/g-logo.png" 
                alt="Google" 
                className="w-5 h-5 mr-3" 
              />
              Sign in with Google
            </button>
          </div>

          <p className="mt-4 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link href="/signup" className="text-primary-600 hover:text-primary-500 font-medium">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}