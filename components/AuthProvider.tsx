'use client'

import { AuthProvider as AuthProviderComponent } from '@/lib/auth'
import { ReactNode } from 'react'

interface AuthProviderProps {
  children: ReactNode
}

// Re-export the AuthProvider from lib/auth for backward compatibility
export default function AuthProvider({ children }: AuthProviderProps) {
  return <AuthProviderComponent>{children}</AuthProviderComponent>
}

// Also export the hook for convenience
export { useAuth } from '@/lib/auth'