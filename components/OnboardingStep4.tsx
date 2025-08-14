'use client'

import { useState, useEffect } from 'react'
import { Skill } from '@/types'
import { X, Users, BookOpen } from 'lucide-react'

interface OnboardingStep4Props {
  data: any
  onDataChange: (data: any) => void
  skills: Skill[]
  industries?: any[]
}

export default function OnboardingStep4({ data, onDataChange, skills }: OnboardingStep4Props) {
  const [formData, setFormData] = useState({
    learning_goals: data.learning_goals || [],
    willing_to_mentor: data.willing_to_mentor || false,
    seeking_mentorship: data.seeking_mentorship || false
  })

  useEffect(() => {
    onDataChange(formData)
  }, [formData, onDataChange])

  const handleSkillToggle = (skill: Skill) => {
    const isSelected = formData.learning_goals.some((s: Skill) => s.id === skill.id)
    if (isSelected) {
      setFormData({
        ...formData,
        learning_goals: formData.learning_goals.filter((s: Skill) => s.id !== skill.id)
      })
    } else {
      setFormData({
        ...formData,
        learning_goals: [...formData.learning_goals, skill]
      })
    }
  }

  const removeSkill = (skillId: string) => {
    setFormData({
      ...formData,
      learning_goals: formData.learning_goals.filter((s: Skill) => s.id !== skillId)
    })
  }

  const handleToggle = (field: 'willing_to_mentor' | 'seeking_mentorship') => {
    setFormData({
      ...formData,
      [field]: !formData[field]
    })
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Learning Goals</h3>
        <p className="text-gray-600">What skills would you like to improve or learn?</p>
      </div>

      {/* Learning Goals */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Skills You Want to Learn or Improve
        </label>
        
        {/* Selected Skills */}
        {formData.learning_goals.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {formData.learning_goals.map((skill: Skill) => (
              <span
                key={skill.id}
                className="inline-flex items-center gap-1 bg-warning-100 text-warning-700 px-3 py-1 rounded-full text-sm"
              >
                {skill.metadata?.skill_name || skill.title}
                <button
                  type="button"
                  onClick={() => removeSkill(skill.id)}
                  className="hover:bg-warning-200 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Skill Options by Category */}
        <div className="space-y-4 max-h-60 overflow-y-auto">
          {skills.length === 0 ? (
            <p className="text-gray-500 text-sm">No skills available. Please add some skills in your CMS.</p>
          ) : (
            ['prospecting', 'discovery', 'presentation', 'negotiation', 'closing', 'management', 'strategy'].map((category) => {
              const categorySkills = skills.filter(skill => skill.metadata?.category === category)
              if (categorySkills.length === 0) return null
              
              return (
                <div key={category} className="border-b border-gray-100 pb-3">
                  <h4 className="text-sm font-medium text-gray-900 mb-2 capitalize">
                    {category}
                  </h4>
                  <div className="grid md:grid-cols-2 gap-2">
                    {categorySkills.map((skill) => (
                      <button
                        key={skill.id}
                        type="button"
                        onClick={() => handleSkillToggle(skill)}
                        className={`p-2 text-left rounded-lg border transition-colors ${
                          formData.learning_goals.some((s: Skill) => s.id === skill.id)
                            ? 'border-warning-500 bg-warning-50 text-warning-700'
                            : 'border-gray-200 hover:border-gray-300 text-gray-700'
                        }`}
                      >
                        <div className="font-medium text-sm">
                          {skill.metadata?.skill_name || skill.title}
                        </div>
                        {skill.metadata?.experience_level && (
                          <div className="text-xs text-gray-500 capitalize">
                            {skill.metadata.experience_level} level
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Mentorship Preferences */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center space-x-3 mb-3">
            <Users className="w-6 h-6 text-primary-600" />
            <h4 className="font-medium text-gray-900">Mentoring Others</h4>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Are you willing to share your expertise and mentor less experienced sales professionals?
          </p>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.willing_to_mentor}
              onChange={() => handleToggle('willing_to_mentor')}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">
              Yes, I'm willing to mentor others
            </span>
          </label>
        </div>

        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center space-x-3 mb-3">
            <BookOpen className="w-6 h-6 text-success-600" />
            <h4 className="font-medium text-gray-900">Seeking Mentorship</h4>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Are you looking for guidance and mentorship from senior sales professionals?
          </p>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.seeking_mentorship}
              onChange={() => handleToggle('seeking_mentorship')}
              className="h-4 w-4 text-success-600 focus:ring-success-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">
              Yes, I'm seeking mentorship
            </span>
          </label>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">💡 Smart Matching</h4>
        <p className="text-sm text-blue-700">
          Our algorithm will match you with professionals who excel in the skills you want to learn, 
          and vice versa. This creates mutually beneficial networking opportunities.
        </p>
      </div>
    </div>
  )
}