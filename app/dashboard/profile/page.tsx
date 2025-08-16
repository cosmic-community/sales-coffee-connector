'use client'

import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import ProfileForm from '@/components/dashboard/ProfileForm'
import { User, Loader2 } from 'lucide-react'

export default function ProfilePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [profileData, setProfileData] = useState(null)
  const [loadingProfile, setLoadingProfile] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [loading, user, router])

  useEffect(() => {
    if (user) {
      // TODO: Fetch full profile data from API
      setLoadingProfile(false)
    }
  }, [user])

  if (loading || loadingProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="py-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center">
            <User className="h-8 w-8 text-gray-400 mr-3" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
              <p className="mt-1 text-sm text-gray-600">
                Manage your profile information and preferences.
              </p>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <ProfileForm user={user} />
      </div>
    </div>
  )
}