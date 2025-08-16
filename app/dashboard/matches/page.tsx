'use client'

import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import MatchCard from '@/components/dashboard/MatchCard'
import { Users, Loader2, Search } from 'lucide-react'
import { SalesExecutive } from '@/types'

export default function MatchesPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [matches, setMatches] = useState<SalesExecutive[]>([])
  const [loadingMatches, setLoadingMatches] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [loading, user, router])

  useEffect(() => {
    if (user) {
      fetchMatches()
    }
  }, [user])

  const fetchMatches = async () => {
    try {
      const response = await fetch('/api/matches')
      if (response.ok) {
        const data = await response.json()
        setMatches(data.matches || [])
      }
    } catch (error) {
      console.error('Failed to fetch matches:', error)
    } finally {
      setLoadingMatches(false)
    }
  }

  const filteredMatches = matches.filter(match =>
    match.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    match.metadata?.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    match.metadata?.job_title?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading || loadingMatches) {
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-gray-400 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Find Matches</h1>
                <p className="mt-1 text-sm text-gray-600">
                  Connect with sales professionals who share your interests.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name, company, or job title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Matches Grid */}
        {filteredMatches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'No matches found' : 'No matches available'}
            </h3>
            <p className="text-gray-500">
              {searchTerm 
                ? 'Try adjusting your search terms.'
                : 'Complete your profile to start getting matched with other sales professionals.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  )
}