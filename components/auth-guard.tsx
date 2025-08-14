'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { onAuthStateChanged, User } from 'firebase/auth'
import { auth, isFirebaseAvailable, getMissingFirebaseEnvVars } from '@/lib/firebase'

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
}

export default function AuthGuard({ children, requireAuth = true }: AuthGuardProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [firebaseError, setFirebaseError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Check if Firebase is available
    if (!isFirebaseAvailable()) {
      const missingVars = getMissingFirebaseEnvVars()
      setFirebaseError(`Firebase is not configured. Missing environment variables: ${missingVars.join(', ')}`)
      setLoading(false)
      return
    }

    if (!auth) {
      setFirebaseError('Firebase auth is not available')
      setLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)

      if (requireAuth && !user) {
        router.push('/login')
      }
    })

    return () => unsubscribe()
  }, [requireAuth, router])

  // Show Firebase configuration error
  if (firebaseError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.99-.833-2.598 0L3.732 19c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Firebase Configuration Required</h3>
            <p className="mt-1 text-sm text-gray-500">{firebaseError}</p>
            <div className="mt-4 text-xs text-gray-400">
              <p>To fix this:</p>
              <ol className="mt-2 text-left list-decimal list-inside space-y-1">
                <li>Create a Firebase project at <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-500">console.firebase.google.com</a></li>
                <li>Copy your Firebase config values</li>
                <li>Add them to your .env.local file</li>
                <li>Restart your development server</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Show children if auth requirements are met
  if (!requireAuth || user) {
    return <>{children}</>
  }

  // This shouldn't happen, but just in case
  return null
}