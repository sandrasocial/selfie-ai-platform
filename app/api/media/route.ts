import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const mediaType = searchParams.get('type') || 'all'
    const limit = parseInt(searchParams.get('limit') || '20')

    // For now, return empty media array
    // This will be expanded later when media features are implemented
    const mediaData = {
      success: true,
      media: [],
      user_id: user.id,
      type: mediaType,
      total: 0,
      message: 'Media endpoint is working - ready for implementation'
    }

    return NextResponse.json(mediaData)

  } catch (error) {
    console.error('Media API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch media' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    // For now, just acknowledge the upload
    // This will be expanded later when media upload features are implemented
    const uploadResult = {
      success: true,
      media_id: `media_${Date.now()}`,
      user_id: user.id,
      uploaded_at: new Date().toISOString(),
      message: 'Media upload endpoint is working - ready for implementation'
    }

    return NextResponse.json(uploadResult)

  } catch (error) {
    console.error('Media upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload media' },
      { status: 500 }
    )
  }
}
