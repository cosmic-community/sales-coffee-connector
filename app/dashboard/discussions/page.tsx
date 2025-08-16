'use client'

import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import DiscussionTopicCard from '@/components/dashboard/DiscussionTopicCard'
import { MessageCircle, Loader2, Filter, Search } from 'lucide-react'
import { DiscussionTopic } from '@/types'

export default function DiscussionsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [topics, setTopics] = useState<DiscussionTopic[]>([])
  const [loadingTopics, setLoadingTopics] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [difficultyFilter, setDifficultyFilter] = useState('all')

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [loading, user, router])

  useEffect(() => {
    if (user) {
      fetchTopics()
    }
  }, [user])

  const fetchTopics = async () => {
    try {
      const response = await fetch('/api/discussions')
      if (response.ok) {
        const data = await response.json()
        setTopics(data.topics || [])
      }
    } catch (error) {
      console.error('Failed to fetch discussion topics:', error)
    } finally {
      setLoadingTopics(false)
    }
  }

  const filteredTopics = topics.filter(topic => {
    const matchesSearch = topic.metadata?.topic_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         topic.metadata?.description?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesDifficulty = difficultyFilter === 'all' || 
                             topic.metadata?.difficulty_level?.key === difficultyFilter

    return matchesSearch && matchesDifficulty
  })

  if (loading || loadingTopics) {
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
              <MessageCircle className="h-8 w-8 text-gray-400 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Discussion Topics</h1>
                <p className="mt-1 text-sm text-gray-600">
                  Explore conversation starters for your next coffee chat.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search discussion topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div className="sm:w-48">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>
        </div>

        {/* Topics Grid */}
        {filteredTopics.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTopics.map((topic) => (
              <DiscussionTopicCard key={topic.id} topic={topic} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <MessageCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || difficultyFilter !== 'all' ? 'No topics found' : 'No discussion topics available'}
            </h3>
            <p className="text-gray-500">
              {searchTerm || difficultyFilter !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : 'Discussion topics will appear here once they are added to the system.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  )
}