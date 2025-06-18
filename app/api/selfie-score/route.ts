import { NextRequest, NextResponse } from 'next/server';
import { analyzeSelfie } from '@/lib/selfie-score/analyzer';

export async function POST(request: NextRequest) {
  try {
    const { imageUrl } = await request.json();

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Image URL is required' },
        { status: 400 }
      );
    }

    // For now, return mock data since Supabase isn't configured
    const mockScore = await analyzeSelfie({ imageUrl });
    
    // Generate share data
    const share_id = Math.random().toString(36).substring(2, 15);
    const share_url = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/share/score/${share_id}`;
    
    // Combine the score data with share information
    const result = {
      ...mockScore,
      share_id,
      share_url,
      created_at: new Date().toISOString()
    };
    
    return NextResponse.json({
      success: true,
      score: result,
      message: 'Selfie analyzed successfully (demo mode)'
    });

  } catch (error) {
    console.error('Selfie score API error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze selfie. Please try again.' },
      { status: 500 }
    );
  }
}
