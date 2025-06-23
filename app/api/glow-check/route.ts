import { NextRequest, NextResponse } from 'next/server'
import { leadTrackingService } from '@/lib/auth'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { 
      email, 
      imageUrl, 
      analysis, 
      score, 
      recommendations 
    } = await request.json()

    if (!email || !analysis || typeof score !== 'number') {
      return NextResponse.json(
        { error: 'Email, analysis, and score are required' },
        { status: 400 }
      )
    }

    // Save the glow check result
    const { data, error } = await leadTrackingService.saveGlowCheckResult(
      email,
      imageUrl,
      analysis,
      score,
      recommendations || []
    )

    if (error) {
      console.error('Error saving glow check result:', error)
      return NextResponse.json(
        { error: 'Failed to save glow check result' },
        { status: 500 }
      )
    }

    // Also track as lead magnet
    await leadTrackingService.trackLeadMagnet(
      email,
      'glow_check',
      'glow_check_tool',
      { score, has_image: !!imageUrl }
    )

    return NextResponse.json({ 
      success: true,
      resultId: data
    })

  } catch (error) {
    console.error('Glow check API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
