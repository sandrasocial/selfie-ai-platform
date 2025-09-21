import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering
export const dynamic = 'force-dynamic'

interface UserProfile {
  id: string;
  user_id: string;
  brand_mission: string | null;
  ideal_audience: string | null;
  brand_values: string | null;
  key_phrases: string | null;
  hashtags: string | null;
  visual_aesthetic: string | null;
  content_focus: string[] | null;
  tone_voice: string | null;
  industry: string | null;
  experience_level: string | null;
  main_goals: string | null;
  transformation_story: string | null;
  brand_voice: string | null;
  aesthetic_tone: string | null;
  offer: string | null;
  visibility_goals: string | null;
  is_complete: boolean;
  created_at: string;
  updated_at: string;
}

function calculateProfileCompleteness(profile: UserProfile | null): number {
  if (!profile) return 0;
  
  const requiredFields = [
    'brand_mission',
    'ideal_audience', 
    'visual_aesthetic',
    'tone_voice',
    'industry'
  ];
  
  const completedFields = requiredFields.filter(field => 
    profile[field as keyof UserProfile] && 
    String(profile[field as keyof UserProfile]).trim().length > 0
  ).length;
  
  return Math.round((completedFields / requiredFields.length) * 100);
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

    if (profileError && profileError.code !== 'PGRST116') { // PGRST116 = no rows returned
      throw profileError;
    }

    // Get basic user data
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (userError && userError.code !== 'PGRST116') {
      throw userError;
    }

    const completeness = calculateProfileCompleteness(profile);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        tier: userData?.tier || 'free',
        subscription_status: userData?.subscription_status,
        brand_onboarding_complete: profile?.is_complete || false,
        onboarding_completed_at: profile?.updated_at,
        brand_profile: profile,
        profile_completeness: completeness
      }
    });

  } catch (error) {
    console.error('Error in me-with-profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user data' }, 
      { status: 500 }
    );
  }
}
