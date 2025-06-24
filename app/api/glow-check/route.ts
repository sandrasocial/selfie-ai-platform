import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { email, imageUrl, analysis, score, recommendations } = await request.json()

    if (!email || !analysis || typeof score !== 'number') {
      return NextResponse.json(
        { error: 'Email, analysis, and score are required' },
        { status: 400 }
      )
    }

    const supabase = createClient()

    // Save the glow check result
    const { data, error } = await supabase.rpc('save_glow_check_result', {
      email_input: email,
      image_url_input: imageUrl,
      analysis_input: analysis,
      score_input: score,
      recommendations_input: recommendations || []
    })

    if (error) {
      console.error('Error saving glow check result:', error)
      return NextResponse.json({ error: 'Failed to save glow check result' }, { status: 500 })
    }

    // Also track as lead magnet
    await supabase.rpc('track_lead_magnet', {
      email_input: email,
      magnet_type_input: 'glow_check',
      source_input: 'glow_check_tool',
      metadata_input: {
        score,
        has_image: !!imageUrl,
      }
    })

    return NextResponse.json({
      success: true,
      resultId: data,
    })
  } catch (error) {
    console.error('Glow check API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
