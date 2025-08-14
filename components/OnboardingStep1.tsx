'use client'

import { useState, useEffect } from 'react'

interface OnboardingStep1Props {
  data: any
  onDataChange: (data: any) => void
  skills?: any[]
  industries?: any[]
}

export default function OnboardingStep1({ data, onDataChange }: OnboardingStep1Props) {
  const [formData, setFormData] = useState({
    first_name: data.first_name || '',
    last_name: data.last_name || '',
    company_name: data.company_name || '',
    job_title: data.job_title || ''
  })

  useEffect(() => {
    onDataChange(formData)
  }, [formData, onDataChange])

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value })
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Let's start with the basics</h3>
        <p className="text-gray-600">Tell us about yourself and your current role</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">
            First Name *
          </label>
          <input
            id="first_name"
            type="text"
            required
            value={formData.first_name}
            onChange={(e) => handleChange('first_name', e.target.value)}
            className="input-field"
            placeholder="John"
          />
        </div>

        <div>
          <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
            Last Name *
          </label>
          <input
            id="last_name"
            type="text"
            required
            value={formData.last_name}
            onChange={(e) => handleChange('last_name', e.target.value)}
            className="input-field"
            placeholder="Doe"
          />
        </div>
      </div>

      <div>
        <label htmlFor="company_name" className="block text-sm font-medium text-gray-700 mb-1">
          Company Name *
        </label>
        <input
          id="company_name"
          type="text"
          required
          value={formData.company_name}
          onChange={(e) => handleChange('company_name', e.target.value)}
          className="input-field"
          placeholder="Acme Corporation"
        />
      </div>

      <div>
        <label htmlFor="job_title" className="block text-sm font-medium text-gray-700 mb-1">
          Job Title *
        </label>
        <input
          id="job_title"
          type="text"
          required
          value={formData.job_title}
          onChange={(e) => handleChange('job_title', e.target.value)}
          className="input-field"
          placeholder="Senior Sales Executive"
        />
      </div>
    </div>
  )
}