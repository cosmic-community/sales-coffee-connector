import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import { getSalesExecutiveByAuthId, cosmic } from '@/lib/cosmic'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: NextRequest) {
  try {
    const { user } = await verifyAuth(request)
    const { participant_2_id } = await request.json()
    
    // Get current user's profile
    const currentUserProfile = await getSalesExecutiveByAuthId(user.uid)
    if (!currentUserProfile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 })
    }

    // Create a new matching session
    const sessionId = `session_${uuidv4()}`
    
    const { object: matchingSession } = await cosmic.objects.insertOne({
      title: `Session: ${currentUserProfile.title} & Participant`,
      type: 'matching-sessions',
      status: 'published',
      metadata: {
        session_id: sessionId,
        participant_1: currentUserProfile.id,
        participant_2: participant_2_id,
        session_status: { key: 'pending', value: 'Pending' },
        scheduled_datetime: '', // Will be set when scheduled
        meeting_platform: { key: 'zoom', value: 'Zoom' },
        match_score: 85, // TODO: Calculate actual match score
        followup_planned: false
      }
    })

    return NextResponse.json({ 
      message: 'Connection request sent successfully',
      session: matchingSession 
    })
  } catch (error) {
    console.error('Create match error:', error)
    return NextResponse.json(
      { error: 'Failed to create connection request' },
      { status: 500 }
    )
  }
}