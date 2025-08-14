import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    // For now, logout is handled client-side by removing the token
    // In a more advanced implementation, you might maintain a token blacklist
    
    return NextResponse.json(
      { message: 'Logged out successfully' },
      { status: 200 }
    )

  } catch (error: any) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to logout' },
      { status: 500 }
    )
  }
}