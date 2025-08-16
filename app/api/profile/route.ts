import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import { getSalesExecutiveByAuthId, updateSalesExecutive } from '@/lib/cosmic'

export async function GET(request: NextRequest) {
  try {
    const { user } = await verifyAuth(request)
    
    const profile = await getSalesExecutiveByAuthId(user.uid)
    
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
    const { user } = await verifyAuth(request)
    const body = await request.json()
    
    // Get current profile
    const currentProfile = await getSalesExecutiveByAuthId(user.uid)
    if (!currentProfile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // Update profile with new data
    const updatedProfile = await updateSalesExecutive(currentProfile.id, {
      ...body,
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