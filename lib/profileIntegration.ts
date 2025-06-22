interface UserProfile {
  brand_mission?: string | null;
  ideal_audience?: string | null;
  brand_values?: string | null;
  key_phrases?: string | null;
  hashtags?: string | null;
  visual_aesthetic?: string | null;
  content_focus?: string[] | null;
  tone_voice?: string | null;
  industry?: string | null;
  experience_level?: string | null;
  main_goals?: string | null;
  transformation_story?: string | null;
  brand_voice?: string | null;
  aesthetic_tone?: string | null;
  offer?: string | null;
  visibility_goals?: string | null;
}

/**
 * Format user profile data for AI context injection
 */
export function formatProfileForAI(profile: UserProfile | null): string {
  if (!profile) return '';

  return `
BRAND PROFILE CONTEXT:
- Mission: ${profile.brand_mission || 'Not specified'}
- Target Audience: ${profile.ideal_audience || 'Not specified'}
- Brand Values: ${profile.brand_values || 'Not specified'}
- Visual Aesthetic: ${profile.visual_aesthetic || 'Not specified'}
- Content Focus: ${profile.content_focus?.join(', ') || 'Not specified'}
- Tone & Voice: ${profile.tone_voice || 'Not specified'}
- Key Phrases: ${profile.key_phrases || 'Not specified'}
- Industry: ${profile.industry || 'Not specified'}
- Experience Level: ${profile.experience_level || 'Not specified'}
- Current Goals: ${profile.main_goals || 'Not specified'}
- Hashtags: ${profile.hashtags || 'Not specified'}

Use this profile information to personalize all content generation, ensuring it aligns with the user's brand identity, voice, and goals.
  `.trim();
}

/**
 * Get personalized prompt by injecting profile context
 */
export function getPersonalizedPrompt(basePrompt: string, profile: UserProfile | null): string {
  const profileContext = formatProfileForAI(profile);
  if (!profileContext) return basePrompt;
  
  return `${profileContext}\n\n${basePrompt}`;
}

/**
 * Check if profile has minimum required fields for AI personalization
 */
export function hasMinimumProfileData(profile: UserProfile | null): boolean {
  if (!profile) return false;
  
  const requiredFields = ['brand_mission', 'ideal_audience', 'tone_voice'];
  return requiredFields.every(field => 
    profile[field as keyof UserProfile] && 
    String(profile[field as keyof UserProfile]).trim().length > 0
  );
}

/**
 * Generate personalized content recommendations based on profile
 */
export function getPersonalizedRecommendations(profile: UserProfile | null): Array<{
  title: string;
  description: string;
  action: string;
}> {
  const recs = [];
  
  if (!profile) {
    return [{
      title: 'Complete Your Brand Profile',
      description: 'Get personalized AI recommendations',
      action: 'Start Onboarding'
    }];
  }
  
  if (profile.content_focus?.includes('Video Content')) {
    recs.push({
      title: 'Video Content Templates',
      description: 'Perfect for your video-focused brand',
      action: 'Get Video Templates'
    });
  }
  
  if (profile.experience_level === 'Just Starting Out') {
    recs.push({
      title: 'Brand Foundation Workbook',
      description: 'Build your foundation step by step',
      action: 'Start Building'
    });
  }
  
  if (profile.visual_aesthetic?.includes('Luxury')) {
    recs.push({
      title: 'Luxury Brand Strategy',
      description: 'Elevate your high-end positioning',
      action: 'Get Strategy'
    });
  }
  
  // Default recommendations if no specific matches
  if (recs.length === 0) {
    recs.push({
      title: 'AI Content Generator',
      description: 'Create content that matches your brand voice',
      action: 'Generate Content'
    });
  }
  
  return recs;
}
