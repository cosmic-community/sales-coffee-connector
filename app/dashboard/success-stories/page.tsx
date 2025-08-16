'use client'

import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import SuccessStoryCard from '@/components/dashboard/SuccessStoryCard'
import { Trophy, Loader2, Plus, Filter } from 'lucide-react'
import { SuccessStory } from '@/types'

export default function SuccessStoriesPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [stories, setStories] = useState<SuccessStory[]>([])
  const [loadingStories, setLoadingStories] = useState(true)
  const [filter, setFilter] = useState('all') // all, featured, my-stories

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [loading, user, router])

  useEffect(() => {
    if (user) {
      fetchStories()
    }
  }, [user])

  const fetchStories = async () => {
    try {
      const response = await fetch('/api/success-stories')
      if (response.ok) {
        const data = await response.json()
        setStories(data.stories || [])
      }
    } catch (error) {
      console.error('Failed to fetch success stories:', error)
    } finally {
      setLoadingStories(false)
    }
  }

  const filteredStories = stories.filter(story => {
    switch (filter) {
      case 'featured':
        return story.metadata?.is_featured
      case 'my-stories':
        // Check if current user is one of the participants
        return story.metadata?.participant_1?.metadata?.email === user?.email ||
               story.metadata?.participant_2?.metadata?.email === user?.email
      default:
        return story.metadata?.approval_status?.key === 'approved'
    }
  })

  if (loading || loadingStories) {
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
              <Trophy className="h-8 w-8 text-gray-400 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Success Stories</h1>
                <p className="mt-1 text-sm text-gray-600">
                  Inspiring stories from successful coffee chat connections.
                </p>
              </div>
            </div>
            
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <Plus className="h-4 w-4 mr-2" />
              Share Your Story
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { key: 'all', label: 'All Stories' },
                { key: 'featured', label: 'Featured' },
                { key: 'my-stories', label: 'My Stories' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    filter === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Stories Grid */}
        {filteredStories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredStories.map((story) => (
              <SuccessStoryCard key={story.id} story={story} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Trophy className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filter === 'my-stories' ? 'No stories yet' : 'No success stories available'}
            </h3>
            <p className="text-gray-500">
              {filter === 'my-stories'
                ? 'Share your first success story from a coffee chat connection.'
                : 'Success stories from coffee chat connections will appear here.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  )
}