'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { getSkills, getIndustries } from '@/lib/cosmic'
import { Skill, Industry } from '@/types'
import { ArrowRight, ArrowLeft, Users, CheckCircle } from 'lucide-react'
import OnboardingStep1 from '@/components/OnboardingStep1'
import OnboardingStep2 from '@/components/OnboardingStep2'
import OnboardingStep3 from '@/components/OnboardingStep3'
import OnboardingStep4 from '@/components/OnboardingStep4'
import OnboardingStep5 from '@/components/OnboardingStep5'

// Force dynamic rendering to prevent SSR issues
export const dynamic = 'force-dynamic'

export default function OnboardingPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<any>({})
  const [skills, setSkills] = useState<Skill[]>([])
  const [industries, setIndustries] = useState<Industry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [authLoading, user, router])

  useEffect(() => {
    if (user) {
      loadOnboardingData()
    }
  }, [user])

  const loadOnboardingData = async () => {
    try {
      const [skillsData, industriesData] = await Promise.all([
        getSkills(),
        getIndustries()
      ])
      
      setSkills(skillsData as Skill[])
      setIndustries(industriesData as Industry[])
    } catch (error) {
      console.error('Error loading onboarding data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStepData = (stepData: any) => {
    setFormData({ ...formData, ...stepData })
  }

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = async () => {
    if (!user) return

    try {
      // Create user profile in Cosmic
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          authUserId: user.uid,
          email: user.email,
          ...formData,
          profile_completed: true,
          account_status: 'active'
        }),
      })

      if (response.ok) {
        router.push('/dashboard')
      } else {
        throw new Error('Failed to create profile')
      }
    } catch (error) {
      console.error('Error completing onboarding:', error)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Setting up your onboarding...</p>
        </div>
      </div>
    )
  }

  const steps = [
    { number: 1, title: 'Basic Information', component: OnboardingStep1 },
    { number: 2, title: 'Professional Details', component: OnboardingStep2 },
    { number: 3, title: 'Industry & Skills', component: OnboardingStep3 },
    { number: 4, title: 'Learning Goals', component: OnboardingStep4 },
    { number: 5, title: 'Availability', component: OnboardingStep5 },
  ]

  const CurrentStepComponent = steps[currentStep - 1]?.component

  if (!CurrentStepComponent) {
    return <div>Invalid step</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-2">
            <div className="bg-primary-500 text-white p-2 rounded-lg">
              <Users className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Complete Your Profile</h1>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step) => (
              <div key={step.number} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  step.number === currentStep
                    ? 'border-primary-500 bg-primary-500 text-white'
                    : step.number < currentStep
                    ? 'border-success-500 bg-success-500 text-white'
                    : 'border-gray-300 bg-white text-gray-400'
                }`}>
                  {step.number < currentStep ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <span className="text-sm font-medium">{step.number}</span>
                  )}
                </div>
                {step.number < steps.length && (
                  <div className={`w-16 h-1 ml-4 ${
                    step.number < currentStep ? 'bg-success-500' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-1">
              Step {currentStep}: {steps[currentStep - 1]?.title}
            </h2>
            <p className="text-gray-600">
              {currentStep} of {steps.length} steps completed
            </p>
          </div>
        </div>

        {/* Step Content */}
        <div className="card max-w-2xl mx-auto">
          <CurrentStepComponent
            data={formData}
            onDataChange={handleStepData}
            skills={skills}
            industries={industries}
          />

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex items-center btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </button>

            {currentStep < 5 ? (
              <button
                onClick={handleNext}
                className="flex items-center btn-primary"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            ) : (
              <button
                onClick={handleComplete}
                className="flex items-center btn-primary"
              >
                Complete Profile
                <CheckCircle className="w-4 h-4 ml-2" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}