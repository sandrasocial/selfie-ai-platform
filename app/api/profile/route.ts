import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { serverAuthService, serverUserProfileService } from '@/lib/server-auth'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const user = await serverAuthService.getCurrentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const profile = await serverUserProfileService.getUserProfile(user.id)

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ 
      success: true,
      data: profile
    })

  } catch (error) {
    console.error('Profile fetch API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await serverAuthService.getCurrentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const updates = await request.json()

    // Remove fields that shouldn't be updated directly
    const allowedUpdates = {
      full_name: updates.full_name,
      phone: updates.phone,
      birth_date: updates.birth_date,
      location: updates.location,
      instagram_handle: updates.instagram_handle,
      website_url: updates.website_url,
      bio: updates.bio,
      brand_vibe: updates.brand_vibe,
      goals: updates.goals,
      preferences: updates.preferences,
      avatar_url: updates.avatar_url
    }

    // Remove undefined values
    const cleanUpdates = Object.fromEntries(
      Object.entries(allowedUpdates).filter(([_, value]) => value !== undefined)
    )
    
    const result = await serverUserProfileService.updateUserProfile(user.id, cleanUpdates)
    
    if (!result) {
      return NextResponse.json(
        { error: 'Failed to update profile' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true,
      data: result
    })

  } catch (error) {
    console.error('Profile update API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
