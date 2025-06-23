import { formatProfileForAI, getPersonalizedPrompt } from '@/lib/profileIntegration';
import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { courseContent, moduleTitle, lessonTitle } = await request.json();

    if (!courseContent || !moduleTitle) {
      return NextResponse.json({ error: 'Course content and module title required' }, { status: 400 });
    }

    // Get user profile for personalization
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (!profile || !profile.is_complete) {
      return NextResponse.json({
        error: 'Complete brand profile required for personalized workbooks',
        onboardingUrl: '/onboarding/brand-hub',
        message: 'Complete your brand profile to generate personalized workbooks'
      }, { status: 428 });
    }

    const profileContext = formatProfileForAI(profile);

    const workbookPrompt = `
${profileContext}

COURSE CONTENT:
Module: ${moduleTitle}
${lessonTitle ? `Lesson: ${lessonTitle}` : ''}
Content: ${courseContent}

Generate a comprehensive, personalized workbook that combines the course material with the user's specific brand profile. 

The workbook should include:

1. **Personal Brand Application**
   - How this lesson applies specifically to their ${profile.industry} industry
   - Examples relevant to their ${profile.visual_aesthetic} aesthetic
   - Action steps written in their ${profile.tone_voice} style

2. **Customized Exercises**
   - Worksheets that incorporate their brand mission: "${profile.brand_mission}"
   - Prompts for their target audience: "${profile.ideal_audience}"
   - Content ideas that match their focus areas: ${profile.content_focus?.join(', ')}

3. **Implementation Strategy**
   - 30-day action plan based on their experience level: ${profile.experience_level}
   - Specific tactics for their goals: "${profile.main_goals}"
   - Hashtag strategy building on: ${profile.hashtags}

4. **Brand-Aligned Templates**
   - Caption templates in their voice
   - Content pillars based on their values: "${profile.brand_values}"
   - Visual direction for their ${profile.visual_aesthetic} style

Format as a structured workbook with clear sections, actionable worksheets, reflection questions, and space for notes. Make it feel like it was created specifically for their unique brand and journey.

Write in Sandra's empowering, direct coaching style - be practical, encouraging, and focused on building their brand power.
    `;

    // Generate AI workbook (mock response for now)
    const workbookContent = {
      title: `${moduleTitle} - Personalized Workbook for ${profile.brand_mission?.split(' ')[0] || 'Your Brand'}`,
      sections: [
        {
          title: "Your Brand Foundation",
          content: `Based on your mission "${profile.brand_mission}", this workbook is designed specifically for someone in ${profile.industry} who wants to ${profile.main_goals}...`,
          exercises: [
            {
              title: "Brand Alignment Check",
              prompt: `How does this lesson connect to your ${profile.visual_aesthetic} aesthetic and ${profile.tone_voice} voice?`,
              worksheet: true
            }
          ]
        },
        {
          title: "Personalized Action Plan",
          content: `As someone with ${profile.experience_level} experience level, here's your tailored approach...`,
          exercises: [
            {
              title: "30-Day Implementation",
              prompt: "Your step-by-step plan customized for your goals and audience",
              worksheet: true
            }
          ]
        },
        {
          title: "Brand-Specific Templates",
          content: `Templates designed for your ${profile.tone_voice} voice and ${profile.visual_aesthetic} style...`,
          templates: profile.hashtags ? profile.hashtags.split(' ').slice(0, 5) : []
        }
      ]
    };

    // Save workbook to database
    const { data: savedWorkbook, error: saveError } = await supabase
      .from('content_vault')
      .insert({
        user_id: user.id,
        type: 'workbook',
        title: workbookContent.title,
        body: JSON.stringify(workbookContent),
        tags: [moduleTitle, 'personalized', 'ai-generated']
      })
      .select()
      .single();

    if (saveError) {
      console.error('Error saving workbook:', saveError);
    }

    return NextResponse.json({
      success: true,
      workbook: workbookContent,
      workbookId: savedWorkbook?.id,
      message: 'Personalized workbook generated successfully',
      personalization: {
        basedOnProfile: true,
        industry: profile.industry,
        aesthetic: profile.visual_aesthetic,
        experience: profile.experience_level
      }
    });

  } catch (error) {
    console.error('Error generating workbook:', error);
    return NextResponse.json(
      { error: 'Failed to generate workbook' }, 
      { status: 500 }
    );
  }
}
