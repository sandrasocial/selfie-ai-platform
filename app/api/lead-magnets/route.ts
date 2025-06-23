import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { leadTrackingService } from '@/lib/auth'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { email, magnetType, source, metadata } = await request.json()

    if (!email || !magnetType) {
      return NextResponse.json(
        { error: 'Email and magnet type are required' },
        { status: 400 }
      )
    }

    // Track the lead magnet download
    const { data, error } = await leadTrackingService.trackLeadMagnet(
      email,
      magnetType,
      source,
      metadata
    )

    if (error) {
      console.error('Error tracking lead magnet:', error)
      return NextResponse.json(
        { error: 'Failed to track lead magnet' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true,
      leadId: data
    })

  } catch (error) {
    console.error('Lead tracking API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    const magnetType = searchParams.get('type')

    const supabase = createClient()

    let query = supabase
      .from('lead_magnets')
      .select('*')
      .order('downloaded_at', { ascending: false })

    if (email) {
      query = query.eq('email', email)
    }

    if (magnetType) {
      query = query.eq('magnet_type', magnetType)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching lead magnets:', error)
      return NextResponse.json(
        { error: 'Failed to fetch lead magnets' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true,
      data
    })

  } catch (error) {
    console.error('Lead magnets fetch API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
