'use client'

import { useState, useEffect } from 'react'
import { AuthUser } from '@/types'
import { Save, Loader2, User, Building, Target, Clock, CheckCircle } from 'lucide-react'

interface ProfileFormProps {
  user: AuthUser
}

interface ProfileData {
  company_name: string
  job_title: string
  years_in_sales: number
  linkedin_url: string
  timezone: string
  company_size: string
  annual_quota: number
  willing_to_mentor: boolean
  seeking_mentorship: boolean
  max_meetings_per_week: string
  preferred_meeting_days: string[]
}

export default function ProfileForm({ user }: ProfileFormProps) {
  const [formData, setFormData] = useState<ProfileData>({
    company_name: '',
    job_title: '',
    years_in_sales: 0,
    linkedin_url: '',
    timezone: 'EST',
    company_size: 'startup',
    annual_quota: 0,
    willing_to_mentor: false,
    seeking_mentorship: false,
    max_meetings_per_week: '2',
    preferred_meeting_days: []
  })
  
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error'>('success')
  const [initialLoading, setInitialLoading] = useState(true)

  // Load existing profile data
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await fetch('/api/profile')
        if (response.ok) {
          const data = await response.json()
          if (data.profile?.metadata) {
            const metadata = data.profile.metadata
            setFormData({
              company_name: metadata.company_name || '',
              job_title: metadata.job_title || '',
              years_in_sales: metadata.years_in_sales || 0,
              linkedin_url: metadata.linkedin_url || '',
              timezone: metadata.timezone?.key || 'EST',
              company_size: metadata.company_size?.key || 'startup',
              annual_quota: metadata.annual_quota || 0,
              willing_to_mentor: metadata.willing_to_mentor || false,
              seeking_mentorship: metadata.seeking_mentorship || false,
              max_meetings_per_week: metadata.max_meetings_per_week?.key || '2',
              preferred_meeting_days: metadata.preferred_meeting_days || []
            })
          }
        }
      } catch (error) {
        console.error('Error loading profile:', error)
      } finally {
        setInitialLoading(false)
      }
    }

    loadProfile()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage('Profile saved successfully!')
        setMessageType('success')
        // Clear message after 5 seconds
        setTimeout(() => setMessage(''), 5000)
      } else {
        throw new Error(data.error || 'Failed to update profile')
      }
    } catch (error) {
      console.error('Profile update error:', error)
      setMessage(error instanceof Error ? error.message : 'Failed to update profile. Please try again.')
      setMessageType('error')
      // Clear error message after 5 seconds
      setTimeout(() => setMessage(''), 5000)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleDayToggle = (day: string) => {
    setFormData(prev => ({
      ...prev,
      preferred_meeting_days: prev.preferred_meeting_days.includes(day)
        ? prev.preferred_meeting_days.filter(d => d !== day)
        : [...prev.preferred_meeting_days, day]
    }))
  }

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Success/Error Message */}
      {message && (
        <div className={`rounded-md p-4 ${
          messageType === 'success' 
            ? 'bg-green-50 border border-green-200' 
            : 'bg-red-50 border border-red-200'
        }`}>
          <div className="flex">
            <div className="flex-shrink-0">
              {messageType === 'success' ? (
                <CheckCircle className="h-5 w-5 text-green-400" />
              ) : (
                <div className="h-5 w-5 text-red-400">⚠</div>
              )}
            </div>
            <div className="ml-3">
              <p className={`text-sm font-medium ${
                messageType === 'success' ? 'text-green-800' : 'text-red-800'
              }`}>
                {message}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Basic Information */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center mb-4">
            <User className="h-5 w-5 text-gray-400 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Company Name *
              </label>
              <input
                type="text"
                required
                value={formData.company_name}
                onChange={(e) => handleInputChange('company_name', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Job Title *
              </label>
              <input
                type="text"
                required
                value={formData.job_title}
                onChange={(e) => handleInputChange('job_title', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Years in Sales *
              </label>
              <input
                type="number"
                required
                min="0"
                max="50"
                value={formData.years_in_sales}
                onChange={(e) => handleInputChange('years_in_sales', parseInt(e.target.value) || 0)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                LinkedIn URL
              </label>
              <input
                type="url"
                value={formData.linkedin_url}
                onChange={(e) => handleInputChange('linkedin_url', e.target.value)}
                placeholder="https://linkedin.com/in/yourname"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Company Information */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center mb-4">
            <Building className="h-5 w-5 text-gray-400 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Company Information</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Company Size *
              </label>
              <select
                required
                value={formData.company_size}
                onChange={(e) => handleInputChange('company_size', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="startup">Startup (1-50 employees)</option>
                <option value="smb">Small Business (50-200 employees)</option>
                <option value="midmarket">Mid-market (200-1000 employees)</option>
                <option value="enterprise">Enterprise (1000+ employees)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Annual Quota (Optional)
              </label>
              <input
                type="number"
                min="0"
                value={formData.annual_quota || ''}
                onChange={(e) => handleInputChange('annual_quota', parseInt(e.target.value) || 0)}
                placeholder="e.g. 1000000"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Meeting Preferences */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center mb-4">
            <Clock className="h-5 w-5 text-gray-400 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Meeting Preferences</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Timezone *
              </label>
              <select
                required
                value={formData.timezone}
                onChange={(e) => handleInputChange('timezone', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="EST">Eastern Time (UTC-5)</option>
                <option value="CST">Central Time (UTC-6)</option>
                <option value="MST">Mountain Time (UTC-7)</option>
                <option value="PST">Pacific Time (UTC-8)</option>
                <option value="GMT">Greenwich Mean Time (UTC+0)</option>
                <option value="CET">Central European Time (UTC+1)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Max Meetings Per Week *
              </label>
              <select
                required
                value={formData.max_meetings_per_week}
                onChange={(e) => handleInputChange('max_meetings_per_week', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="1">1 meeting per week</option>
                <option value="2">2 meetings per week</option>
                <option value="3">3 meetings per week</option>
                <option value="4">4 meetings per week</option>
                <option value="5">5 meetings per week</option>
              </select>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Preferred Meeting Days
            </label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => (
                <label key={day} className="relative flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      type="checkbox"
                      checked={formData.preferred_meeting_days.includes(day)}
                      onChange={() => handleDayToggle(day)}
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <span className="font-medium text-gray-700">{day}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mentorship */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center mb-4">
            <Target className="h-5 w-5 text-gray-400 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Mentorship</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="willing_to_mentor"
                checked={formData.willing_to_mentor}
                onChange={(e) => handleInputChange('willing_to_mentor', e.target.checked)}
                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <label htmlFor="willing_to_mentor" className="ml-3 block text-sm font-medium text-gray-700">
                I'm willing to mentor less experienced sales professionals
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="seeking_mentorship"
                checked={formData.seeking_mentorship}
                onChange={(e) => handleInputChange('seeking_mentorship', e.target.checked)}
                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <label htmlFor="seeking_mentorship" className="ml-3 block text-sm font-medium text-gray-700">
                I'm looking for guidance from senior sales professionals
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
              Saving Profile...
            </>
          ) : (
            <>
              <Save className="-ml-1 mr-3 h-5 w-5" />
              Save Profile
            </>
          )}
        </button>
      </div>
    </form>
  )
}