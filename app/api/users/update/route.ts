import { NextRequest, NextResponse } from 'next/server'
import { CosmicAuth } from '@/lib/cosmic-auth'
import { getSalesExecutiveByAuthId } from '@/lib/cosmic'
import { cosmic } from '@/lib/cosmic'
import { validateProfileUpdate } from '@/utils/validation'

export const dynamic = 'force-dynamic'

export async function PUT(request: NextRequest) {
  try {
    // Try multiple token sources
    const authHeader = request.headers.get('Authorization')
    const headerToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null
    
    // Fallback to cookie token
    const isProduction = process.env.NODE_ENV === 'production'
    const secureCookieToken = request.cookies.get('__Secure-auth-token')?.value
    const regularCookieToken = request.cookies.get('auth-token')?.value
    
    const cookieToken = isProduction ? (secureCookieToken || regularCookieToken) : regularCookieToken
    const token = headerToken || cookieToken

    if (!token) {
      return NextResponse.json(
        { error: 'No valid authorization token' },
        { status: 401 }
      )
    }

    // Verify token
    const user = CosmicAuth.verifyToken(token)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    // Get current profile
    const currentProfile = await getSalesExecutiveByAuthId(user.id)
    
    if (!currentProfile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      )
    }

    // Get update data from request
    const updateData = await request.json()

    // Validate update data
    const validationResult = validateProfileUpdate(updateData)
    if (!validationResult.isValid) {
      return NextResponse.json(
        { error: validationResult.error },
        { status: 400 }
      )
    }

    // Prepare metadata update (merge with existing)
    const updatedMetadata = {
      ...currentProfile.metadata,
      ...updateData,
      // Ensure auth_user_id is never overwritten
      auth_user_id: currentProfile.metadata.auth_user_id
    }

    // Update profile in Cosmic
    const updatedProfile = await cosmic.objects.updateOne(currentProfile.id, {
      title: updateData.first_name && updateData.last_name 
        ? `${updateData.first_name} ${updateData.last_name}`
        : currentProfile.title,
      metadata: updatedMetadata
    })

    return NextResponse.json({ 
      message: 'Profile updated successfully',
      profile: updatedProfile.object
    }, { status: 200 })

  } catch (error: any) {
    console.error('Update profile error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update profile' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { authUserId, email, ...profileData } = await request.json()

    // Validate required fields
    if (!authUserId || !email) {
      return NextResponse.json(
        { error: 'Auth user ID and email are required' },
        { status: 400 }
      )
    }

    // Check if profile already exists
    const existingProfile = await getSalesExecutiveByAuthId(authUserId)
    if (existingProfile) {
      return NextResponse.json(
        { error: 'Profile already exists' },
        { status: 409 }
      )
    }

    // Create new profile
    const newProfile = await cosmic.objects.insertOne({
      title: `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim() || email,
      type: 'sales-executives',
      status: 'published',
      metadata: {
        auth_user_id: authUserId,
        email: email,
        account_status: { key: 'active', value: 'Active' },
        profile_completed: false,
        willing_to_mentor: false,
        seeking_mentorship: false,
        max_meetings_per_week: { key: '2', value: '2 meetings per week' }, // default
        years_in_sales: 0,
        annual_quota: 0,
        timezone: { key: 'EST', value: 'Eastern Time (UTC-5)' },
        company_size: { key: 'startup', value: 'Startup (1-50 employees)' },
        industries: [],
        expertise_areas: [],
        learning_goals: [],
        preferred_meeting_days: [],
        ...profileData
      }
    })

    return NextResponse.json({ 
      message: 'Profile created successfully',
      profile: newProfile.object
    }, { status: 201 })

  } catch (error: any) {
    console.error('Create profile error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create profile' },
      { status: 500 }
    )
  }
}