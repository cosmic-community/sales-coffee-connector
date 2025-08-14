'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { 
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile
} from 'firebase/auth'
import { auth } from './firebase'

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<User>
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<User>
  signOut: () => Promise<void>
  isFirebaseAvailable: boolean
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
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isFirebaseAvailable, setIsFirebaseAvailable] = useState(false)

  useEffect(() => {
    // Check if Firebase is available
    if (!auth) {
      setLoading(false)
      setIsFirebaseAvailable(false)
      return
    }

    setIsFirebaseAvailable(true)

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const signIn = async (email: string, password: string): Promise<User> => {
    if (!auth) {
      throw new Error('Firebase is not available. Please check your configuration.')
    }
    
    const result = await signInWithEmailAndPassword(auth, email, password)
    return result.user
  }

  const signUp = async (email: string, password: string, firstName: string, lastName: string): Promise<User> => {
    if (!auth) {
      throw new Error('Firebase is not available. Please check your configuration.')
    }
    
    const result = await createUserWithEmailAndPassword(auth, email, password)
    
    // Update the user profile with name
    await updateProfile(result.user, {
      displayName: `${firstName} ${lastName}`
    })
    
    return result.user
  }

  const signOut = async (): Promise<void> => {
    if (!auth) {
      throw new Error('Firebase is not available. Please check your configuration.')
    }
    
    await firebaseSignOut(auth)
  }

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    isFirebaseAvailable
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}