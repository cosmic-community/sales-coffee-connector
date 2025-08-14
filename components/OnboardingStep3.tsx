'use client'

import { useState, useEffect } from 'react'
import { Skill, Industry } from '@/types'
import { X } from 'lucide-react'

interface OnboardingStep3Props {
  data: any
  onDataChange: (data: any) => void
  skills: Skill[]
  industries: Industry[]
}

export default function OnboardingStep3({ data, onDataChange, skills, industries }: OnboardingStep3Props) {
  const [formData, setFormData] = useState({
    industries: data.industries || [],
    expertise_areas: data.expertise_areas || []
  })

  useEffect(() => {
    onDataChange(formData)
  }, [formData, onDataChange])

  const handleIndustryToggle = (industry: Industry) => {
    const isSelected = formData.industries.some((i: Industry) => i.id === industry.id)
    if (isSelected) {
      setFormData({
        ...formData,
        industries: formData.industries.filter((i: Industry) => i.id !== industry.id)
      })
    } else {
      setFormData({
        ...formData,
        industries: [...formData.industries, industry]
      })
    }
  }

  const handleSkillToggle = (skill: Skill) => {
    const isSelected = formData.expertise_areas.some((s: Skill) => s.id === skill.id)
    if (isSelected) {
      setFormData({
        ...formData,
        expertise_areas: formData.expertise_areas.filter((s: Skill) => s.id !== skill.id)
      })
    } else {
      setFormData({
        ...formData,
        expertise_areas: [...formData.expertise_areas, skill]
      })
    }
  }

  const removeIndustry = (industryId: string) => {
    setFormData({
      ...formData,
      industries: formData.industries.filter((i: Industry) => i.id !== industryId)
    })
  }

  const removeSkill = (skillId: string) => {
    setFormData({
      ...formData,
      expertise_areas: formData.expertise_areas.filter((s: Skill) => s.id !== skillId)
    })
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Industry & Expertise</h3>
        <p className="text-gray-600">Select the industries and skills where you excel</p>
      </div>

      {/* Industries Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Industries You Work In
        </label>
        
        {/* Selected Industries */}
        {formData.industries.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {formData.industries.map((industry: Industry) => (
              <span
                key={industry.id}
                className="inline-flex items-center gap-1 bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm"
              >
                {industry.metadata?.industry_name || industry.title}
                <button
                  type="button"
                  onClick={() => removeIndustry(industry.id)}
                  className="hover:bg-primary-200 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Industry Options */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-40 overflow-y-auto">
          {industries.length === 0 ? (
            <p className="text-gray-500 text-sm col-span-full">No industries available. Please add some industries in your CMS.</p>
          ) : (
            industries.map((industry) => (
              <button
                key={industry.id}
                type="button"
                onClick={() => handleIndustryToggle(industry)}
                className={`p-2 text-left rounded-lg border transition-colors ${
                  formData.industries.some((i: Industry) => i.id === industry.id)
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <div className="font-medium text-sm">
                  {industry.metadata?.industry_name || industry.title}
                </div>
                {industry.metadata?.category && typeof industry.metadata.category === 'object' && 'value' in industry.metadata.category && (
                  <div className="text-xs text-gray-500 capitalize">
                    {industry.metadata.category.value}
                  </div>
                )}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Skills Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Your Areas of Expertise
        </label>
        
        {/* Selected Skills */}
        {formData.expertise_areas.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {formData.expertise_areas.map((skill: Skill) => (
              <span
                key={skill.id}
                className="inline-flex items-center gap-1 bg-success-100 text-success-700 px-3 py-1 rounded-full text-sm"
              >
                {skill.metadata?.skill_name || skill.title}
                <button
                  type="button"
                  onClick={() => removeSkill(skill.id)}
                  className="hover:bg-success-200 rounded-full p-0.5"
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
              const categorySkills = skills.filter(skill => 
                skill.metadata?.category && 
                typeof skill.metadata.category === 'object' && 
                'key' in skill.metadata.category &&
                skill.metadata.category.key === category
              )
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
                          formData.expertise_areas.some((s: Skill) => s.id === skill.id)
                            ? 'border-success-500 bg-success-50 text-success-700'
                            : 'border-gray-200 hover:border-gray-300 text-gray-700'
                        }`}
                      >
                        <div className="font-medium text-sm">
                          {skill.metadata?.skill_name || skill.title}
                        </div>
                        {skill.metadata?.experience_level && typeof skill.metadata.experience_level === 'object' && 'value' in skill.metadata.experience_level && (
                          <div className="text-xs text-gray-500 capitalize">
                            {skill.metadata.experience_level.value} level
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

      <p className="text-sm text-gray-500">
        Select the industries and skills where you have experience. This helps us match you with professionals who can benefit from your expertise.
      </p>
    </div>
  )
}