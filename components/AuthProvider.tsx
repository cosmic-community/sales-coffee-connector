'use client'

import { AuthProvider as AuthProviderComponent } from '@/lib/auth'
import { ReactNode } from 'react'

interface AuthProviderProps {
  children: ReactNode
}

// Default export for the component
export default function AuthProvider({ children }: AuthProviderProps) {
  return <AuthProviderComponent>{children}</AuthProviderComponent>
}

// Named export for backward compatibility
export { AuthProvider } from '@/lib/auth'

// Also export the hook for convenience
export { useAuth } from '@/lib/auth'