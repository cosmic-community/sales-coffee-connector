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

const validateCompanySize = (size: string): string => {
  const validSizes = ['startup', 'smb', 'midmarket', 'enterprise']
  return validSizes.includes(size) ? size : 'startup'
}

const validateTimezone = (timezone: string): string => {
  const validTimezones = ['EST', 'CST', 'MST', 'PST', 'GMT', 'CET']
  return validTimezones.includes(timezone) ? timezone : 'EST'
}

const validateMeetingsPerWeek = (meetings: string): string => {
  const validMeetings = ['1', '2', '3', '4', '5']
  return validMeetings.includes(meetings) ? meetings : '1'
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

    // Validate required fields with proper type safety
    const companySize = validateCompanySize(body.company_size || 'startup')
    const timezone = validateTimezone(body.timezone || 'EST')
    const maxMeetings = validateMeetingsPerWeek(body.max_meetings_per_week || '1')

    // Update profile with new data
    const updatedProfile = await updateSalesExecutive(currentProfile.id, {
      ...body,
      company_size: companySize,
      timezone: timezone,
      max_meetings_per_week: maxMeetings,
      profile_completed: true
    })

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