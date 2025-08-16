'use client'

import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Users, Coffee, Calendar, TrendingUp, AlertCircle, Trophy, Sparkles, Target, Rocket, ArrowRight } from 'lucide-react'
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
    // For now, using mock data for new user experience
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
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-8 text-white">
            <div className="flex items-center mb-4">
              <Sparkles className="w-8 h-8 mr-3 text-yellow-300" />
              <h1 className="text-3xl font-bold">
                Welcome to Your Sales Journey, {user.firstName}!
              </h1>
            </div>
            <p className="text-xl text-blue-100 mb-6">
              You're about to join thousands of sales professionals who are transforming their careers 
              through meaningful connections. Your networking adventure starts here!
            </p>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center bg-white/20 rounded-lg px-3 py-2">
                <Target className="w-5 h-5 mr-2" />
                <span className="font-medium">Smart Matching Ready</span>
              </div>
              <div className="flex items-center bg-white/20 rounded-lg px-3 py-2">
                <Rocket className="w-5 h-5 mr-2" />
                <span className="font-medium">Growth Opportunities Awaiting</span>
              </div>
              <div className="flex items-center bg-white/20 rounded-lg px-3 py-2">
                <Trophy className="w-5 h-5 mr-2" />
                <span className="font-medium">Success Stories in the Making</span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Completion Alert */}
        <div className="mb-8 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <Rocket className="h-8 w-8 text-amber-500" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-bold text-amber-900 mb-2">
                🚀 Launch Your Networking Potential!
              </h3>
              <div className="text-amber-800 mb-4">
                <p className="mb-2">
                  Complete your profile to unlock the full power of our matching algorithm. 
                  Here's what you'll gain access to:
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>AI-powered matches with professionals who share your goals</li>
                  <li>Access to exclusive discussion topics and conversation starters</li>
                  <li>Priority matching with industry leaders and mentors</li>
                  <li>Invitations to special networking events and masterclasses</li>
                </ul>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/onboarding"
                  className="inline-flex items-center bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Complete Your Journey
                </Link>
                <Link
                  href="/dashboard/profile"
                  className="inline-flex items-center text-amber-800 font-semibold hover:text-amber-900 transition-colors"
                >
                  Or update profile manually →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Potential Stats Grid - What's Possible */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl shadow-sm">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-blue-700 truncate">
                      Potential Connections
                    </dt>
                    <dd className="text-2xl font-bold text-blue-800">10,000+</dd>
                    <dd className="text-xs text-blue-600">Sales professionals waiting to connect</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl shadow-sm">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Coffee className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-green-700 truncate">
                      Coffee Chats Available
                    </dt>
                    <dd className="text-2xl font-bold text-green-800">Unlimited</dd>
                    <dd className="text-xs text-green-600">15-minute career-changing conversations</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl shadow-sm">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Calendar className="h-8 w-8 text-purple-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-purple-700 truncate">
                      Your Schedule
                    </dt>
                    <dd className="text-2xl font-bold text-purple-800">Your Choice</dd>
                    <dd className="text-xs text-purple-600">Network on your terms</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl shadow-sm">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TrendingUp className="h-8 w-8 text-orange-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-orange-700 truncate">
                      Success Potential
                    </dt>
                    <dd className="text-2xl font-bold text-orange-800">Limitless</dd>
                    <dd className="text-xs text-orange-600">Your network is your net worth</dd>
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
            className="group relative bg-gradient-to-br from-blue-500 to-blue-600 p-8 rounded-2xl text-white hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
          >
            <div>
              <span className="rounded-xl inline-flex p-4 bg-white/20 text-white ring-4 ring-white/10">
                <Users className="h-8 w-8" />
              </span>
            </div>
            <div className="mt-6">
              <h3 className="text-2xl font-bold mb-2">
                Discover Your Perfect Matches
              </h3>
              <p className="text-blue-100 mb-4">
                Meet sales professionals whose experience complements your goals. Every connection is a potential breakthrough.
              </p>
              <div className="flex items-center text-white font-semibold">
                <span>Start Exploring</span>
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          <Link
            href="/dashboard/discussions"
            className="group relative bg-gradient-to-br from-green-500 to-green-600 p-8 rounded-2xl text-white hover:from-green-600 hover:to-green-700 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
          >
            <div>
              <span className="rounded-xl inline-flex p-4 bg-white/20 text-white ring-4 ring-white/10">
                <Coffee className="h-8 w-8" />
              </span>
            </div>
            <div className="mt-6">
              <h3 className="text-2xl font-bold mb-2">
                Master Conversation Starters
              </h3>
              <p className="text-green-100 mb-4">
                Never run out of things to discuss. Explore topics that spark meaningful conversations and build lasting connections.
              </p>
              <div className="flex items-center text-white font-semibold">
                <span>Browse Topics</span>
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          <Link
            href="/dashboard/success-stories"
            className="group relative bg-gradient-to-br from-purple-500 to-purple-600 p-8 rounded-2xl text-white hover:from-purple-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
          >
            <div>
              <span className="rounded-xl inline-flex p-4 bg-white/20 text-white ring-4 ring-white/10">
                <Trophy className="h-8 w-8" />
              </span>
            </div>
            <div className="mt-6">
              <h3 className="text-2xl font-bold mb-2">
                Get Inspired by Success
              </h3>
              <p className="text-purple-100 mb-4">
                Read amazing stories from professionals who transformed their careers through networking. Your story could be next!
              </p>
              <div className="flex items-center text-white font-semibold">
                <span>Read Stories</span>
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        </div>

        {/* Inspirational Activity Section */}
        <div className="bg-gradient-to-r from-gray-50 to-white rounded-2xl shadow-xl border border-gray-200">
          <div className="px-8 py-12">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Your Networking Journey Begins</h3>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                Right now, thousands of sales professionals are having career-changing conversations. 
                Success stories are being written, deals are being closed, and careers are being launched. 
                The question is: when will you write yours?
              </p>
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div className="bg-white rounded-xl p-6 shadow-sm border">
                  <div className="text-3xl font-bold text-blue-600 mb-2">Step 1</div>
                  <h4 className="font-semibold text-gray-900 mb-2">Complete Your Profile</h4>
                  <p className="text-sm text-gray-600">Share your goals, expertise, and what you want to learn</p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border">
                  <div className="text-3xl font-bold text-green-600 mb-2">Step 2</div>
                  <h4 className="font-semibold text-gray-900 mb-2">Get Matched</h4>
                  <p className="text-sm text-gray-600">Our AI finds perfect conversation partners for you</p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border">
                  <div className="text-3xl font-bold text-purple-600 mb-2">Step 3</div>
                  <h4 className="font-semibold text-gray-900 mb-2">Transform Your Career</h4>
                  <p className="text-sm text-gray-600">Watch your network and opportunities multiply</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}