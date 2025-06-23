import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { serverAuthService } from '@/lib/server-auth'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function PUT(request: NextRequest) {
  try {
    const user = await serverAuthService.getCurrentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { step_data } = await request.json()

    if (!step_data) {
      return NextResponse.json(
        { error: 'Step data is required' },
        { status: 400 }
      )
    }

    const supabase = createClient()

    // Update onboarding status
    const { error } = await supabase.rpc('update_onboarding_step', {
      user_id_input: user.id,
      step_data: step_data
    })

    if (error) {
      console.error('Error updating onboarding status:', error)
      return NextResponse.json(
        { error: 'Failed to update onboarding status' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true
    })

  } catch (error) {
    console.error('Onboarding API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
