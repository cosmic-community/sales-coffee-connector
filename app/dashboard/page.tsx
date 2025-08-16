'use client'

import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Users, Coffee, Calendar, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react'
import Link from 'next/link'

interface DashboardStats {
  totalConnections: number
  coffeeChats: number
  scheduled: number
  successRate: string
}

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats>({
    totalConnections: 0,
    coffeeChats: 0,
    scheduled: 0,
    successRate: '-'
  })
  const [profileComplete, setProfileComplete] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [loading, user, router])

  useEffect(() => {
    // TODO: Fetch user stats from API
    // For now, using mock data
    setStats({
      totalConnections: 0,
      coffeeChats: 0,
      scheduled: 0,
      successRate: '-'
    })
    setProfileComplete(false)
  }, [user])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user.firstName}!
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Here's what's happening with your sales connections.
          </p>
        </div>

        {/* Profile Completion Alert */}
        {!profileComplete && (
          <div className="mb-6 bg-amber-50 border border-amber-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-amber-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-amber-800">
                  Complete your profile to get matched!
                </h3>
                <div className="mt-2 text-sm text-amber-700">
                  <p>
                    Add your skills, experience, and preferences to start connecting with other sales professionals.
                  </p>
                </div>
                <div className="mt-4">
                  <Link
                    href="/dashboard/profile"
                    className="text-sm font-medium text-amber-800 underline hover:text-amber-600"
                  >
                    Complete your profile →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Connections
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.totalConnections}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Coffee className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Coffee Chats
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.coffeeChats}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Calendar className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Scheduled
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.scheduled}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TrendingUp className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Success Rate
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.successRate}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link
            href="/dashboard/matches"
            className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 shadow rounded-lg hover:shadow-md transition-shadow"
          >
            <div>
              <span className="rounded-lg inline-flex p-3 bg-blue-50 text-blue-600 ring-4 ring-white">
                <Users className="h-6 w-6" />
              </span>
            </div>
            <div className="mt-8">
              <h3 className="text-lg font-medium">
                <span className="absolute inset-0" aria-hidden="true" />
                Find Matches
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Discover sales professionals who share your interests and goals.
              </p>
            </div>
            <span className="pointer-events-none absolute top-6 right-6 text-gray-300 group-hover:text-gray-400">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
              </svg>
            </span>
          </Link>

          <Link
            href="/dashboard/discussions"
            className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 shadow rounded-lg hover:shadow-md transition-shadow"
          >
            <div>
              <span className="rounded-lg inline-flex p-3 bg-green-50 text-green-600 ring-4 ring-white">
                <Coffee className="h-6 w-6" />
              </span>
            </div>
            <div className="mt-8">
              <h3 className="text-lg font-medium">
                <span className="absolute inset-0" aria-hidden="true" />
                Discussion Topics
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Browse conversation starters for your next coffee chat.
              </p>
            </div>
            <span className="pointer-events-none absolute top-6 right-6 text-gray-300 group-hover:text-gray-400">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
              </svg>
            </span>
          </Link>

          <Link
            href="/dashboard/success-stories"
            className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 shadow rounded-lg hover:shadow-md transition-shadow"
          >
            <div>
              <span className="rounded-lg inline-flex p-3 bg-purple-50 text-purple-600 ring-4 ring-white">
                <Trophy className="h-6 w-6" />
              </span>
            </div>
            <div className="mt-8">
              <h3 className="text-lg font-medium">
                <span className="absolute inset-0" aria-hidden="true" />
                Success Stories
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Read inspiring stories from successful connections.
              </p>
            </div>
            <span className="pointer-events-none absolute top-6 right-6 text-gray-300 group-hover:text-gray-400">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
              </svg>
            </span>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
            <div className="text-center py-8">
              <Coffee className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500">No recent activity</p>
              <p className="text-sm text-gray-400 mt-2">
                Start connecting with fellow sales professionals to see your activity here.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}