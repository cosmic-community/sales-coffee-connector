'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Calendar, 
  Users, 
  TrendingUp, 
  Clock, 
  Star,
  Plus,
  Settings,
  LogOut
} from 'lucide-react'
import { getSalesExecutiveByAuthId, getUserSessions } from '@/lib/cosmic'
import { SalesExecutive, MatchingSession, DashboardStats } from '@/types'

// Force dynamic rendering to prevent SSR issues
export const dynamic = 'force-dynamic'

function DashboardLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading your dashboard...</p>
      </div>
    </div>
  )
}

function DashboardContent() {
  const { user, logout, loading: authLoading } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState<SalesExecutive | null>(null)
  const [sessions, setSessions] = useState<MatchingSession[]>([])
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [authLoading, user, router])

  useEffect(() => {
    if (user) {
      loadDashboardData()
    }
  }, [user])

  const loadDashboardData = async () => {
    if (!user) return

    try {
      setLoading(true)
      
      // Load user profile using the auth user ID from our Cosmic auth system
      const userProfile = await getSalesExecutiveByAuthId(user.id)
      setProfile(userProfile)

      if (userProfile) {
        // Load user sessions
        const userSessions = await getUserSessions(userProfile.id)
        setSessions(userSessions)

        // Calculate stats
        const completedSessions = userSessions.filter(
          (session) => session.metadata?.session_status?.value === 'Completed' || 
                      session.metadata?.session_status === 'completed'
        )
        
        const upcomingSessions = userSessions.filter(
          (session) => session.metadata?.session_status?.value === 'Confirmed' || 
                      session.metadata?.session_status === 'confirmed'
        )

        // Calculate average rating
        let totalRating = 0
        let ratingCount = 0
        userSessions.forEach((session) => {
          if (session.metadata?.session_rating_p1) {
            const rating1 = typeof session.metadata.session_rating_p1 === 'string' 
              ? parseInt(session.metadata.session_rating_p1) 
              : session.metadata.session_rating_p1.key 
                ? parseInt(session.metadata.session_rating_p1.key) 
                : 0
            if (!isNaN(rating1)) {
              totalRating += rating1
              ratingCount++
            }
          }
          if (session.metadata?.session_rating_p2) {
            const rating2 = typeof session.metadata.session_rating_p2 === 'string' 
              ? parseInt(session.metadata.session_rating_p2) 
              : session.metadata.session_rating_p2.key 
                ? parseInt(session.metadata.session_rating_p2.key) 
                : 0
            if (!isNaN(rating2)) {
              totalRating += rating2
              ratingCount++
            }
          }
        })

        const averageRating = ratingCount > 0 ? totalRating / ratingCount : 0
        const profileCompletion = calculateProfileCompletion(userProfile)

        setStats({
          total_sessions: userSessions.length,
          completed_sessions: completedSessions.length,
          average_rating: averageRating,
          profile_completion: profileCompletion,
          upcoming_sessions: upcomingSessions.length,
        })
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateProfileCompletion = (profile: SalesExecutive): number => {
    const requiredFields = [
      'first_name',
      'last_name',
      'company_name',
      'job_title',
      'years_in_sales',
      'timezone',
      'company_size',
      'max_meetings_per_week'
    ]
    
    let completedFields = 0
    requiredFields.forEach(field => {
      const value = profile.metadata?.[field as keyof typeof profile.metadata]
      if (value && value !== '' && value !== 0) {
        completedFields++
      }
    })

    return Math.round((completedFields / requiredFields.length) * 100)
  }

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  if (authLoading || loading) {
    return <DashboardLoading />
  }

  if (!user) {
    return null // Will redirect to login
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Complete Your Profile</h2>
          <p className="text-gray-600 mb-6">Let's set up your sales professional profile to start networking.</p>
          <Link href="/onboarding" className="btn-primary">
            Complete Profile
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-2">
              <div className="bg-primary-500 text-white p-2 rounded-lg">
                <Users className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {user?.firstName || 'User'}!
              </span>
              <Link href="/profile" className="text-gray-600 hover:text-gray-900">
                <Settings className="w-5 h-5" />
              </Link>
              <button 
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-900"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {profile.metadata?.first_name || user?.firstName}!
          </h2>
          <p className="text-gray-600">Here's what's happening with your networking.</p>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <div className="card">
              <div className="flex items-center">
                <div className="bg-primary-100 text-primary-600 p-3 rounded-full">
                  <Users className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{stats.total_sessions}</p>
                  <p className="text-gray-600 text-sm">Total Sessions</p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center">
                <div className="bg-success-100 text-success-600 p-3 rounded-full">
                  <Calendar className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{stats.completed_sessions}</p>
                  <p className="text-gray-600 text-sm">Completed</p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center">
                <div className="bg-warning-100 text-warning-600 p-3 rounded-full">
                  <Clock className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{stats.upcoming_sessions}</p>
                  <p className="text-gray-600 text-sm">Upcoming</p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center">
                <div className="bg-purple-100 text-purple-600 p-3 rounded-full">
                  <Star className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.average_rating.toFixed(1)}
                  </p>
                  <p className="text-gray-600 text-sm">Avg Rating</p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center">
                <div className="bg-indigo-100 text-indigo-600 p-3 rounded-full">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{stats.profile_completion}%</p>
                  <p className="text-gray-600 text-sm">Profile Complete</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link href="/matching" className="card hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Find Matches</h3>
                <p className="text-gray-600 text-sm">Discover new networking opportunities</p>
              </div>
              <Plus className="w-8 h-8 text-primary-600" />
            </div>
          </Link>

          <Link href="/sessions" className="card hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">My Sessions</h3>
                <p className="text-gray-600 text-sm">View upcoming and past meetings</p>
              </div>
              <Calendar className="w-8 h-8 text-primary-600" />
            </div>
          </Link>

          <Link href="/profile" className="card hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Update Profile</h3>
                <p className="text-gray-600 text-sm">Keep your information current</p>
              </div>
              <Settings className="w-8 h-8 text-primary-600" />
            </div>
          </Link>
        </div>

        {/* Recent Sessions */}
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Recent Sessions</h3>
            <Link href="/sessions" className="text-primary-600 hover:text-primary-500 text-sm font-medium">
              View All
            </Link>
          </div>

          {sessions.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No sessions yet. Start networking to see your sessions here.</p>
              <Link href="/matching" className="btn-primary mt-4">
                Find Your First Match
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {sessions.slice(0, 3).map((session) => (
                <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        Session #{session.metadata?.session_id || session.id}
                      </p>
                      <p className="text-sm text-gray-600">
                        {session.metadata?.scheduled_datetime 
                          ? new Date(session.metadata.scheduled_datetime).toLocaleDateString()
                          : 'Date TBD'
                        }
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      session.metadata?.session_status?.value === 'Completed' || session.metadata?.session_status === 'completed'
                        ? 'bg-success-100 text-success-700'
                        : session.metadata?.session_status?.value === 'Confirmed' || session.metadata?.session_status === 'confirmed'
                        ? 'bg-primary-100 text-primary-700'
                        : 'bg-warning-100 text-warning-700'
                    }`}>
                      {session.metadata?.session_status?.value || session.metadata?.session_status || 'Pending'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return <DashboardContent />
}