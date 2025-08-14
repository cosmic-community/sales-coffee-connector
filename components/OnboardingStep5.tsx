'use client'

import { useState, useEffect } from 'react'
import { Calendar, Clock } from 'lucide-react'

interface OnboardingStep5Props {
  data: any
  onDataChange: (data: any) => void
  skills?: any[]
  industries?: any[]
}

export default function OnboardingStep5({ data, onDataChange }: OnboardingStep5Props) {
  const [formData, setFormData] = useState({
    max_meetings_per_week: data.max_meetings_per_week || '',
    preferred_meeting_days: data.preferred_meeting_days || []
  })

  useEffect(() => {
    onDataChange(formData)
  }, [formData, onDataChange])

  const handleMeetingChange = (value: string) => {
    setFormData({ ...formData, max_meetings_per_week: value })
  }

  const handleDayToggle = (day: string) => {
    const isSelected = formData.preferred_meeting_days.includes(day)
    if (isSelected) {
      setFormData({
        ...formData,
        preferred_meeting_days: formData.preferred_meeting_days.filter((d: string) => d !== day)
      })
    } else {
      setFormData({
        ...formData,
        preferred_meeting_days: [...formData.preferred_meeting_days, day]
      })
    }
  }

  const meetingOptions = [
    { value: '1', label: '1 meeting per week', description: 'Light networking' },
    { value: '2', label: '2 meetings per week', description: 'Moderate networking' },
    { value: '3', label: '3 meetings per week', description: 'Active networking' },
    { value: '4', label: '4 meetings per week', description: 'Heavy networking' },
    { value: '5', label: '5 meetings per week', description: 'Maximum networking' }
  ]

  const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Availability Preferences</h3>
        <p className="text-gray-600">Set your networking schedule and preferences</p>
      </div>

      {/* Maximum Meetings Per Week */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          <Clock className="inline w-4 h-4 mr-1" />
          Maximum Meetings Per Week *
        </label>
        <div className="space-y-3">
          {meetingOptions.map((option) => (
            <label
              key={option.value}
              className={`block p-4 border rounded-lg cursor-pointer transition-colors ${
                formData.max_meetings_per_week === option.value
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <input
                  type="radio"
                  name="max_meetings"
                  value={option.value}
                  checked={formData.max_meetings_per_week === option.value}
                  onChange={(e) => handleMeetingChange(e.target.value)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                />
                <div className="ml-3">
                  <div className="font-medium text-sm">{option.label}</div>
                  <div className="text-xs text-gray-500">{option.description}</div>
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Preferred Meeting Days */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          <Calendar className="inline w-4 h-4 mr-1" />
          Preferred Meeting Days
        </label>
        <p className="text-sm text-gray-600 mb-3">
          Select the days when you're typically available for networking calls
        </p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {weekdays.map((day) => (
            <label
              key={day}
              className={`block p-3 text-center border rounded-lg cursor-pointer transition-colors ${
                formData.preferred_meeting_days.includes(day)
                  ? 'border-success-500 bg-success-50 text-success-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="checkbox"
                checked={formData.preferred_meeting_days.includes(day)}
                onChange={() => handleDayToggle(day)}
                className="sr-only"
              />
              <div className="font-medium text-sm">{day}</div>
            </label>
          ))}
        </div>
        {formData.preferred_meeting_days.length === 0 && (
          <p className="text-xs text-gray-500 mt-2">
            No specific preference? That's okay - you'll be matched based on mutual availability.
          </p>
        )}
      </div>

      {/* Summary */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
        <h4 className="font-medium text-green-900 mb-2">🎉 Almost There!</h4>
        <p className="text-sm text-green-700 mb-3">
          You're about to join a community of {' '}
          <span className="font-semibold">5,000+ sales professionals</span> who are already growing their networks.
        </p>
        <div className="text-xs text-green-600">
          <p>✓ Profile setup complete</p>
          <p>✓ Skills and preferences configured</p>
          <p>✓ Ready to start networking</p>
        </div>
      </div>

      {/* Privacy Note */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">🔒 Privacy & Control</h4>
        <p className="text-sm text-gray-700">
          Your profile information will only be shared with matched professionals. 
          You can update your preferences, pause networking, or modify your profile anytime from your dashboard.
        </p>
      </div>
    </div>
  )
}