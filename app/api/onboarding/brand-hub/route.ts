import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

interface BrandProfileData {
  brand_mission?: string;
  ideal_audience?: string;
  brand_values?: string;
  key_phrases?: string;
  hashtags?: string;
  visual_aesthetic?: string;
  content_focus?: string[];
  tone_voice?: string;
  industry?: string;
  experience_level?: string;
  main_goals?: string;
  transformation_story?: string;
  brand_voice?: string;
  aesthetic_tone?: string;
  offer?: string;
  visibility_goals?: string;
}

function calculateProfileCompleteness(profileData: BrandProfileData): number {
  const requiredFields = [
    'brand_mission',
    'ideal_audience', 
    'visual_aesthetic',
    'tone_voice',
    'industry'
  ];
  
  const completedFields = requiredFields.filter(field => 
    profileData[field as keyof BrandProfileData] && 
    String(profileData[field as keyof BrandProfileData]).trim().length > 0
  ).length;
  
  return Math.round((completedFields / requiredFields.length) * 100);
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { profileData, onboardingStep } = await request.json();

    if (!profileData) {
      return NextResponse.json({ error: 'Profile data required' }, { status: 400 });
    }

    const completeness = calculateProfileCompleteness(profileData);

    // Save or update brand profile
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .upsert({
        user_id: user.id,
        ...profileData,
        is_complete: completeness >= 80, // Consider profile complete if 80%+ filled
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (profileError) {
      throw profileError;
    }

    // Track onboarding completion if profile is now complete
    if (completeness >= 80) {
      console.log(`Brand onboarding completed for user ${user.id} with ${completeness}% completeness`);
    }

    return NextResponse.json({
      success: true,
      profile,
      completeness,
      message: completeness >= 80 ? 'Brand onboarding completed successfully' : 'Profile updated'
    });

  } catch (error) {
    console.error('Error completing brand onboarding:', error);
    return NextResponse.json(
      { error: 'Failed to complete onboarding' }, 
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (profileError && profileError.code !== 'PGRST116') {
      throw profileError;
    }

    const completeness = profile ? calculateProfileCompleteness(profile) : 0;

    return NextResponse.json({
      success: true,
      hasProfile: !!profile,
      profile: profile || null,
      completionPercentage: completeness,
      isComplete: profile?.is_complete || false,
      completedAt: profile?.updated_at
    });

  } catch (error) {
    console.error('Error fetching onboarding status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch onboarding status' }, 
      { status: 500 }
    );
  }
}
