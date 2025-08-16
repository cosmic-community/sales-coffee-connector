import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import { getSalesExecutives, getSalesExecutiveByAuthId } from '@/lib/cosmic'
import { calculateMatchScore } from '@/utils/matching'

export async function GET(request: NextRequest) {
  try {
    const { user } = await verifyAuth(request)
    
    // Get current user's profile
    const currentUserProfile = await getSalesExecutiveByAuthId(user.uid)
    if (!currentUserProfile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 })
    }

    // Get all other sales executives
    const allProfiles = await getSalesExecutives()
    
    // Filter out current user and inactive profiles
    const potentialMatches = allProfiles.filter(profile => 
      profile.id !== currentUserProfile.id && 
      profile.metadata?.account_status?.key === 'active'
    )

    // Calculate match scores and sort
    const matchesWithScores = potentialMatches.map(profile => ({
      ...profile,
      matchScore: calculateMatchScore(currentUserProfile, profile)
    })).sort((a, b) => b.matchScore - a.matchScore)

    // Return top matches
    const topMatches = matchesWithScores.slice(0, 20)

    return NextResponse.json({ matches: topMatches })
  } catch (error) {
    console.error('Get matches error:', error)
    return NextResponse.json(
      { error: 'Failed to get matches' },
      { status: 500 }
    )
  }
}