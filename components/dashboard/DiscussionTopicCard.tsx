'use client'

import { DiscussionTopic } from '@/types'
import { Clock, Target, Bookmark, BookmarkCheck } from 'lucide-react'
import { useState } from 'react'

interface DiscussionTopicCardProps {
  topic: DiscussionTopic
}

export default function DiscussionTopicCard({ topic }: DiscussionTopicCardProps) {
  const [bookmarked, setBookmarked] = useState(false)

  const handleBookmark = () => {
    setBookmarked(!bookmarked)
    // TODO: Implement bookmark functionality
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800'
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800'
      case 'advanced':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
            {topic.metadata?.topic_title}
          </h3>
          <button
            onClick={handleBookmark}
            className="ml-2 p-1 text-gray-400 hover:text-gray-600"
          >
            {bookmarked ? (
              <BookmarkCheck className="h-5 w-5 text-blue-600" />
            ) : (
              <Bookmark className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
          {topic.metadata?.description}
        </p>

        {/* Categories */}
        {topic.metadata?.category && topic.metadata.category.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {topic.metadata.category.slice(0, 3).map((skill: any, index: number) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {skill.title || skill.metadata?.skill_name || skill}
                </span>
              ))}
              {topic.metadata.category.length > 3 && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                  +{topic.metadata.category.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Meta Information */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {topic.metadata?.difficulty_level && (
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                typeof topic.metadata.difficulty_level === 'string' 
                  ? topic.metadata.difficulty_level 
                  : topic.metadata.difficulty_level.key || topic.metadata.difficulty_level.value
              )}`}>
                <Target className="h-3 w-3 mr-1" />
                {typeof topic.metadata.difficulty_level === 'string' 
                  ? topic.metadata.difficulty_level 
                  : topic.metadata.difficulty_level.value || topic.metadata.difficulty_level.key}
              </span>
            )}
            
            {topic.metadata?.estimated_time && (
              <span className="inline-flex items-center text-xs text-gray-500">
                <Clock className="h-3 w-3 mr-1" />
                {topic.metadata.estimated_time} min
              </span>
            )}
          </div>
        </div>

        {/* Use in Chat Button */}
        <div className="mt-4">
          <button className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Use in Next Chat
          </button>
        </div>
      </div>
    </div>
  )
}