// /lib/selfie-score/analyzer.ts
// Selfie Score Analysis Engine

export interface SubScores {
  lighting: number;
  composition: number;
  expression: number;
  background: number;
  styling: number;
}

export interface ScoreResult {
  overall_score: number;
  sub_scores: SubScores;
  recommendations: string[];
  badge: string;
  share_text: string;
}

export interface AnalysisParams {
  imageUrl: string;
  imageWidth?: number;
  imageHeight?: number;
  brightness?: number;
  contrast?: number;
}

/**
 * Mock AI analysis for selfie scoring
 * In production, this would integrate with real AI services
 */
export async function analyzeSelfie(params: AnalysisParams): Promise<ScoreResult> {
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000));

  // Generate realistic scores based on image characteristics
  const scores = generateRealisticScores(params);
  
  // Calculate overall score (weighted average)
  const overall_score = calculateOverallScore(scores);
  
  // Generate personalized recommendations
  const recommendations = generateRecommendations(scores, overall_score);
  
  // Determine badge
  const badge = getBadge(overall_score);
  
  // Generate share text
  const share_text = generateShareText(overall_score, badge);

  return {
    overall_score,
    sub_scores: scores,
    recommendations,
    badge,
    share_text
  };
}

function generateRealisticScores(params: AnalysisParams): SubScores {
  // Base scores with some randomness for realistic variation
  const baseScores = {
    lighting: 65 + Math.random() * 30,
    composition: 60 + Math.random() * 35,
    expression: 70 + Math.random() * 25,
    background: 55 + Math.random() * 40,
    styling: 50 + Math.random() * 45
  };

  // Adjust based on image characteristics
  if (params.brightness) {
    baseScores.lighting = Math.max(0, Math.min(100, 
      baseScores.lighting + (params.brightness - 0.5) * 40
    ));
  }

  if (params.contrast) {
    baseScores.composition = Math.max(0, Math.min(100,
      baseScores.composition + (params.contrast - 0.5) * 30
    ));
  }

  // Ensure scores are integers
  return {
    lighting: Math.round(baseScores.lighting),
    composition: Math.round(baseScores.composition),
    expression: Math.round(baseScores.expression),
    background: Math.round(baseScores.background),
    styling: Math.round(baseScores.styling)
  };
}

function calculateOverallScore(scores: SubScores): number {
  // Weighted scoring system
  const weights = {
    lighting: 0.25,      // Most important
    composition: 0.25,   // Most important
    expression: 0.20,    // Very important
    background: 0.15,    // Important
    styling: 0.15        // Important
  };

  const weightedSum = 
    scores.lighting * weights.lighting +
    scores.composition * weights.composition +
    scores.expression * weights.expression +
    scores.background * weights.background +
    scores.styling * weights.styling;

  return Math.round(weightedSum);
}

function generateRecommendations(scores: SubScores, overall_score: number): string[] {
  const recommendations: string[] = [];

  // Lighting recommendations
  if (scores.lighting < 60) {
    recommendations.push("Try facing natural light or use a ring light for better illumination");
  } else if (scores.lighting < 80) {
    recommendations.push("Your lighting is good! Try experimenting with golden hour for that warm glow");
  }

  // Composition recommendations
  if (scores.composition < 60) {
    recommendations.push("Follow the rule of thirds - position your eyes in the upper third of the frame");
  } else if (scores.composition < 80) {
    recommendations.push("Great composition! Try different angles to add variety to your feed");
  }

  // Expression recommendations
  if (scores.expression < 60) {
    recommendations.push("Practice your signature look in the mirror - confidence is key!");
  } else if (scores.expression < 80) {
    recommendations.push("Your expression is engaging! Try different moods to tell your story");
  }

  // Background recommendations
  if (scores.background < 60) {
    recommendations.push("Choose a clean, uncluttered background that complements your style");
  } else if (scores.background < 80) {
    recommendations.push("Your background works well! Consider adding depth with layered elements");
  }

  // Styling recommendations
  if (scores.styling < 60) {
    recommendations.push("Wear colors that complement your skin tone and match your brand aesthetic");
  } else if (scores.styling < 80) {
    recommendations.push("Your styling is on point! Try mixing textures for visual interest");
  }

  // Overall recommendations
  if (overall_score < 50) {
    recommendations.push("Don't worry! Every influencer started somewhere. Keep practicing and you'll see improvement");
  } else if (overall_score < 70) {
    recommendations.push("You're on the right track! Focus on one area at a time for steady improvement");
  } else if (overall_score < 90) {
    recommendations.push("Excellent work! You're building a strong personal brand foundation");
  } else {
    recommendations.push("Legendary! Your selfie game is elite. Share your secrets with the community!");
  }

  // Return top 3 most relevant recommendations
  return recommendations.slice(0, 3);
}

function getBadge(score: number): string {
  if (score >= 91) return 'Legend';
  if (score >= 71) return 'Icon';
  if (score >= 41) return 'Rising Star';
  return 'Beginner';
}

function generateShareText(score: number, badge: string): string {
  const messages = [
    `Just scored ${score}/100 on my selfie game! 📸 #SelfieAI #PersonalBrand`,
    `${score}/100 selfie score - ${badge} status unlocked! 🏆 #SelfieAI`,
    `My selfie got a ${score}/100! Time to level up my personal brand game 💪 #SelfieAI`,
    `${badge} level achieved with a ${score}/100 selfie score! 📸✨ #SelfieAI`,
    `Just discovered my selfie potential: ${score}/100! Ready to dominate social media 🚀 #SelfieAI`
  ];

  return messages[Math.floor(Math.random() * messages.length)];
}

/**
 * Rate limiting check for free users
 */
export function checkRateLimit(userScoresThisMonth: number, isProUser: boolean): boolean {
  if (isProUser) return true;
  return userScoresThisMonth < 1; // Free users get 1 score per month
}

/**
 * Get user's score history for improvement tracking
 */
export function calculateImprovement(previousScores: number[]): {
  trend: 'improving' | 'declining' | 'stable';
  average: number;
  best: number;
} {
  if (previousScores.length === 0) {
    return { trend: 'stable', average: 0, best: 0 };
  }

  const average = previousScores.reduce((a, b) => a + b, 0) / previousScores.length;
  const best = Math.max(...previousScores);
  
  // Simple trend calculation
  const recent = previousScores.slice(-3);
  const older = previousScores.slice(-6, -3);
  
  let trend: 'improving' | 'declining' | 'stable' = 'stable';
  
  if (recent.length >= 2 && older.length >= 2) {
    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const olderAvg = older.reduce((a, b) => a + b, 0) / older.length;
    
    if (recentAvg > olderAvg + 5) trend = 'improving';
    else if (recentAvg < olderAvg - 5) trend = 'declining';
  }

  return { trend, average: Math.round(average), best };
} 