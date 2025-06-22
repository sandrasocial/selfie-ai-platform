import { formatProfileForAI, getPersonalizedPrompt } from '@/lib/profileIntegration';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerComponentClient({ cookies });
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { prompt, requirePersonalization = false } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt required' }, { status: 400 });
    }

    // Get user profile for personalization
    let enhancedPrompt = prompt;
    let hasProfile = false;

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (profile && profile.is_complete) {
      enhancedPrompt = getPersonalizedPrompt(prompt, profile);
      hasProfile = true;
    } else if (requirePersonalization) {
      return NextResponse.json({
        error: 'Brand profile required for personalized AI responses',
        onboardingUrl: '/onboarding/brand-hub',
        message: 'Complete your 3-minute brand setup for personalized results'
      }, { status: 428 });
    }

    // Add Sandra's brand voice and coaching style to all prompts
    const sandraPrompt = `
You are Sandra AI, the personal brand strategist behind SELFIE AI. You speak like Rachel from FRIENDS meets a business coach - warm, relatable, and direct. 

Your voice signature:
- Conversational and real (use contractions, natural flow)
- Empowering without being fake or corporate
- Start with things like "Okay, so here's the thing..." or "Listen, I get it..."
- No exclamation marks ever
- Mix coaching energy with practical strategy
- Speak TO her, not AT her

Voice Examples:
- "Okay, so here's what I learned after taking like 1,000 bad selfies..."
- "Listen, I get it. Showing up online feels weird at first"
- "Can we talk about how nobody teaches us this stuff"
- "You've got this. I know because I've been where you are"

${enhancedPrompt}

Respond in Sandra's natural, conversational style with practical advice that helps her show up powerfully online.
    `;

    // Make AI call (you would implement your AI service here)
    // For now, returning a mock response
    const aiResponse = {
      content: `I understand you want to create content that truly represents your brand. ${hasProfile ? 'Based on your brand profile, ' : ''}let me help you develop a strategy that feels authentic to who you are and connects with your ideal audience. What specific area would you like to focus on first?`,
      personalized: hasProfile,
      suggestions: hasProfile ? [
        'Create content pillars aligned with your brand values',
        'Develop signature phrases that match your tone',
        'Plan visuals that reflect your aesthetic'
      ] : [
        'Complete your brand profile for personalized guidance',
        'Define your brand mission and values',
        'Identify your target audience'
      ]
    };

    return NextResponse.json({
      success: true,
      response: aiResponse.content,
      personalized: hasProfile,
      suggestions: aiResponse.suggestions,
      profileStatus: {
        hasProfile,
        completionPrompt: !hasProfile ? 'Complete your brand profile to get personalized coaching from Sandra AI' : null
      }
    });

  } catch (error) {
    console.error('Error in Sandra AI chat:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' }, 
      { status: 500 }
    );
  }
}
