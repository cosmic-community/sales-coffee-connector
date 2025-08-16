'use client'

import { SalesExecutive } from '@/types'
import { Building, MapPin, Clock, Coffee, MessageCircle } from 'lucide-react'
import { useState } from 'react'

interface MatchCardProps {
  match: SalesExecutive
}

export default function MatchCard({ match }: MatchCardProps) {
  const [requesting, setRequesting] = useState(false)

  const handleConnect = async () => {
    setRequesting(true)
    try {
      const response = await fetch('/api/matches/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          participant_2_id: match.id
        }),
      })

      if (response.ok) {
        // Handle success - maybe show a toast or update UI
        console.log('Connection request sent!')
      }
    } catch (error) {
      console.error('Failed to send connection request:', error)
    } finally {
      setRequesting(false)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
  }

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="p-6">
        {/* Profile Header */}
        <div className="flex items-center mb-4">
          <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-blue-600 font-semibold text-sm">
              {getInitials(match.title)}
            </span>
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-semibold text-gray-900">
              {match.title}
            </h3>
            <p className="text-sm text-gray-600">
              {match.metadata?.job_title}
            </p>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-2 mb-4">
          {match.metadata?.company_name && (
            <div className="flex items-center text-sm text-gray-600">
              <Building className="h-4 w-4 mr-2" />
              <span>{match.metadata.company_name}</span>
            </div>
          )}
          
          {match.metadata?.timezone && (
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="h-4 w-4 mr-2" />
              <span>
                {typeof match.metadata.timezone === 'string' 
                  ? match.metadata.timezone 
                  : match.metadata.timezone.value || match.metadata.timezone.key}
              </span>
            </div>
          )}
          
          {match.metadata?.years_in_sales && (
            <div className="flex items-center text-sm text-gray-600">
              <Coffee className="h-4 w-4 mr-2" />
              <span>{match.metadata.years_in_sales} years in sales</span>
            </div>
          )}
        </div>

        {/* Skills/Expertise Preview */}
        {match.metadata?.expertise_areas && match.metadata.expertise_areas.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-medium text-gray-700 mb-2">Expertise:</p>
            <div className="flex flex-wrap gap-1">
              {match.metadata.expertise_areas.slice(0, 3).map((skill: any, index: number) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {skill.title || skill.skill_name || skill}
                </span>
              ))}
              {match.metadata.expertise_areas.length > 3 && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                  +{match.metadata.expertise_areas.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Mentorship Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          {match.metadata?.willing_to_mentor && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Mentor
            </span>
          )}
          {match.metadata?.seeking_mentorship && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              Seeking Mentor
            </span>
          )}
        </div>

        {/* Connect Button */}
        <div className="flex space-x-2">
          <button
            onClick={handleConnect}
            disabled={requesting}
            className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <Coffee className="h-4 w-4 mr-2" />
            {requesting ? 'Requesting...' : 'Request Coffee Chat'}
          </button>
          
          <button className="inline-flex items-center justify-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <MessageCircle className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}