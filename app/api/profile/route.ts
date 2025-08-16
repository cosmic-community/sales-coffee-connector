import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import { getSalesExecutiveByAuthId, updateSalesExecutive } from '@/lib/cosmic'

export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAuth(request)
    
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const profile = await getSalesExecutiveByAuthId(auth.userId)
    
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    return NextResponse.json({ profile })
  } catch (error) {
    console.error('Get profile error:', error)
    return NextResponse.json(
      { error: 'Failed to get profile' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const auth = await verifyAuth(request)
    
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const body = await request.json()
    
    // Get current profile
    const currentProfile = await getSalesExecutiveByAuthId(auth.userId)
    if (!currentProfile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // Ensure timezone and company_size have proper string values with explicit type safety
    const timezone: string = (typeof body.timezone === 'string' && body.timezone) ? body.timezone : 'EST'
    const companySize: string = (typeof body.company_size === 'string' && body.company_size) ? body.company_size : 'startup'

    // Transform form data to match Cosmic structure
    const updatedMetadata = {
      company_name: body.company_name || currentProfile.metadata.company_name,
      job_title: body.job_title || currentProfile.metadata.job_title,
      years_in_sales: body.years_in_sales,
      linkedin_url: body.linkedin_url || currentProfile.metadata.linkedin_url || '',
      timezone: { key: timezone, value: getTimezoneLabel(timezone) },
      company_size: { key: companySize, value: getCompanySizeLabel(companySize) },
      annual_quota: body.annual_quota || 0,
      willing_to_mentor: body.willing_to_mentor,
      seeking_mentorship: body.seeking_mentorship,
      max_meetings_per_week: { 
        key: body.max_meetings_per_week || '1', 
        value: `${body.max_meetings_per_week || '1'} meeting${body.max_meetings_per_week !== '1' ? 's' : ''} per week` 
      },
      preferred_meeting_days: body.preferred_meeting_days || null,
      profile_completed: true
    }

    // Update profile with new data
    const updatedProfile = await updateSalesExecutive(currentProfile.id, updatedMetadata)

    return NextResponse.json({ 
      message: 'Profile updated successfully',
      profile: updatedProfile 
    })
  } catch (error) {
    console.error('Update profile error:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}

function getTimezoneLabel(key: string): string {
  const timezones: Record<string, string> = {
    EST: 'Eastern Time (UTC-5)',
    CST: 'Central Time (UTC-6)',
    MST: 'Mountain Time (UTC-7)',
    PST: 'Pacific Time (UTC-8)',
    GMT: 'Greenwich Mean Time (UTC+0)',
    CET: 'Central European Time (UTC+1)'
  }
  return timezones[key] ?? timezones.EST
}

function getCompanySizeLabel(key: string): string {
  const sizes: Record<string, string> = {
    startup: 'Startup (1-50 employees)',
    smb: 'Small Business (50-200 employees)',
    midmarket: 'Mid-market (200-1000 employees)',
    enterprise: 'Enterprise (1000+ employees)'
  }
  return sizes[key] ?? sizes.startup
}