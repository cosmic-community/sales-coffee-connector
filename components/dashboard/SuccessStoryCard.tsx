'use client'

import { SuccessStory } from '@/types'
import { Star, Users, Calendar } from 'lucide-react'

interface SuccessStoryCardProps {
  story: SuccessStory
}

export default function SuccessStoryCard({ story }: SuccessStoryCardProps) {
  const getInitials = (name: string) => {
    if (!name) return '??'
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
            {story.metadata?.story_title}
          </h3>
          {story.metadata?.is_featured && (
            <Star className="h-5 w-5 text-yellow-500 fill-current ml-2" />
          )}
        </div>

        {/* Participants */}
        <div className="flex items-center mb-4">
          <Users className="h-4 w-4 text-gray-400 mr-2" />
          <div className="flex items-center space-x-2">
            {story.metadata?.participant_1 && (
              <div className="flex items-center">
                <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 font-medium text-xs">
                    {getInitials(story.metadata.participant_1.title || 'Unknown')}
                  </span>
                </div>
                <span className="ml-1 text-sm text-gray-600">
                  {story.metadata.participant_1.title || 'Anonymous'}
                </span>
              </div>
            )}
            
            {story.metadata?.participant_2 && (
              <>
                <span className="text-gray-400">•</span>
                <div className="flex items-center">
                  <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-green-600 font-medium text-xs">
                      {getInitials(story.metadata.participant_2.title || 'Unknown')}
                    </span>
                  </div>
                  <span className="ml-1 text-sm text-gray-600">
                    {story.metadata.participant_2.title || 'Anonymous'}
                  </span>
                </div>
              </>
            )}
            
            {!story.metadata?.participant_1 && !story.metadata?.participant_2 && (
              <span className="text-sm text-gray-500">Anonymous</span>
            )}
          </div>
        </div>

        {/* Story Content Preview */}
        <div className="mb-4">
          <div 
            className="text-sm text-gray-600 line-clamp-4"
            dangerouslySetInnerHTML={{ 
              __html: story.metadata?.story_content?.slice(0, 200) + '...' || '' 
            }}
          />
        </div>

        {/* Outcome */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-900 mb-1">Outcome Achieved:</h4>
          <p className="text-sm text-gray-600 line-clamp-2">
            {story.metadata?.outcome_achieved}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex items-center text-xs text-gray-500">
            <Calendar className="h-3 w-3 mr-1" />
            {story.created_at && formatDate(story.created_at)}
          </div>
          
          <button className="text-sm font-medium text-blue-600 hover:text-blue-500">
            Read Full Story
          </button>
        </div>
      </div>
    </div>
  )
}