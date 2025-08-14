'use client'

import { useState, useEffect } from 'react'

interface OnboardingStep2Props {
  data: any
  onDataChange: (data: any) => void
  skills?: any[]
  industries?: any[]
}

export default function OnboardingStep2({ data, onDataChange }: OnboardingStep2Props) {
  const [formData, setFormData] = useState({
    years_in_sales: data.years_in_sales || '',
    company_size: data.company_size || '',
    annual_quota: data.annual_quota || '',
    timezone: data.timezone || ''
  })

  useEffect(() => {
    onDataChange(formData)
  }, [formData, onDataChange])

  const handleChange = (field: string, value: string | number) => {
    setFormData({ ...formData, [field]: value })
  }

  const companySizes = [
    { value: 'startup', label: 'Startup (1-50 employees)' },
    { value: 'smb', label: 'Small Business (50-200 employees)' },
    { value: 'midmarket', label: 'Mid-market (200-1000 employees)' },
    { value: 'enterprise', label: 'Enterprise (1000+ employees)' }
  ]

  const timezones = [
    { value: 'EST', label: 'Eastern Time (UTC-5)' },
    { value: 'CST', label: 'Central Time (UTC-6)' },
    { value: 'MST', label: 'Mountain Time (UTC-7)' },
    { value: 'PST', label: 'Pacific Time (UTC-8)' },
    { value: 'GMT', label: 'Greenwich Mean Time (UTC+0)' },
    { value: 'CET', label: 'Central European Time (UTC+1)' }
  ]

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Professional Details</h3>
        <p className="text-gray-600">Help us understand your sales background</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="years_in_sales" className="block text-sm font-medium text-gray-700 mb-1">
            Years in Sales *
          </label>
          <input
            id="years_in_sales"
            type="number"
            required
            min="0"
            max="50"
            value={formData.years_in_sales}
            onChange={(e) => handleChange('years_in_sales', parseInt(e.target.value) || '')}
            className="input-field"
            placeholder="5"
          />
        </div>

        <div>
          <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 mb-1">
            Timezone *
          </label>
          <select
            id="timezone"
            required
            value={formData.timezone}
            onChange={(e) => handleChange('timezone', e.target.value)}
            className="input-field"
          >
            <option value="">Select your timezone</option>
            {timezones.map((tz) => (
              <option key={tz.value} value={tz.value}>
                {tz.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="company_size" className="block text-sm font-medium text-gray-700 mb-1">
          Company Size *
        </label>
        <select
          id="company_size"
          required
          value={formData.company_size}
          onChange={(e) => handleChange('company_size', e.target.value)}
          className="input-field"
        >
          <option value="">Select company size</option>
          {companySizes.map((size) => (
            <option key={size.value} value={size.value}>
              {size.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="annual_quota" className="block text-sm font-medium text-gray-700 mb-1">
          Annual Quota (Optional)
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
          <input
            id="annual_quota"
            type="number"
            min="0"
            value={formData.annual_quota}
            onChange={(e) => handleChange('annual_quota', parseInt(e.target.value) || '')}
            className="input-field pl-8"
            placeholder="500000"
          />
        </div>
        <p className="text-sm text-gray-500 mt-1">This information helps us match you with similar professionals</p>
      </div>
    </div>
  )
}