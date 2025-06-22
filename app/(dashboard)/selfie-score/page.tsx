'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SelfieScoreHero from '../../components/SelfieScoreHero';
import SelfieUploader from '../../components/SelfieUploader';
import ScoreDisplay from '../../components/ScoreDisplay';

interface ScoreResult {
  overall_score: number;
  sub_scores: {
    lighting: number;
    composition: number;
    expression: number;
    background: number;
    styling: number;
  };
  recommendations: string[];
  badge: string;
  share_id: string;
  share_url: string;
  share_text: string;
  created_at: string;
}

export default function SelfieScorePage() {
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [scoreResult, setScoreResult] = useState<ScoreResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userStats, setUserStats] = useState<any>(null);

  const handleImageUpload = async (imageUrl: string) => {
    setCurrentImage(imageUrl);
    setIsUploading(true);
    setError(null);

    try {
      const response = await fetch('/api/selfie-score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          setError(data.message || 'Rate limit reached. Upgrade to Pro for unlimited scores.');
        } else {
          setError(data.error || 'Failed to analyze selfie');
        }
        return;
      }

      setScoreResult(data.score);
      setUserStats(data.user_stats);

    } catch (error) {
      console.error('Error analyzing selfie:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const resetScore = () => {
    setCurrentImage(null);
    setScoreResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <SelfieScoreHero />

      {/* Upload Section */}
      <section id="upload" className="py-24 px-8 md:px-16 lg:px-24 bg-[#F1F1F1]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-['Bodoni_Moda'] text-[#171719] mb-4">
              Get Your Score
            </h2>
            <p className="text-lg text-[#B5B5B3] font-['Inter'] max-w-2xl mx-auto">
              Upload your best selfie and get instant AI-powered feedback on your 
              lighting, composition, expression, background, and styling.
            </p>
          </div>

          {/* User Stats */}
          {userStats && (
            <div className="mb-8 p-6 bg-white border border-[#B5B5B3]">
              <div className="flex flex-wrap justify-center gap-8 text-center">
                <div>
                  <div className="text-2xl font-['Bodoni_Moda'] text-[#171719]">
                    {userStats.scores_this_month}
                  </div>
                  <div className="text-sm text-[#B5B5B3] font-['Inter'] uppercase tracking-wider">
                    Scores This Month
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-['Bodoni_Moda'] text-[#171719]">
                    {userStats.monthly_limit}
                  </div>
                  <div className="text-sm text-[#B5B5B3] font-['Inter'] uppercase tracking-wider">
                    Monthly Limit
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-['Bodoni_Moda'] text-[#171719]">
                    {userStats.total_scores}
                  </div>
                  <div className="text-sm text-[#B5B5B3] font-['Inter'] uppercase tracking-wider">
                    Total Scores
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="mb-8 p-6 bg-red-50 border border-red-200">
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h3 className="font-['Inter'] font-medium text-red-800">
                    {error.includes('Rate limit') ? 'Monthly Limit Reached' : 'Error'}
                  </h3>
                  <p className="text-red-700 font-['Inter'] text-sm mt-1">
                    {error}
                  </p>
                  {error.includes('Rate limit') && (
                    <button className="mt-3 bg-red-600 text-white font-['Inter'] font-medium px-4 py-2 hover:bg-red-700 transition-colors duration-200">
                      Upgrade to Pro
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Upload or Score Display */}
          {!scoreResult ? (
            <SelfieUploader 
              onImageUpload={handleImageUpload}
              isUploading={isUploading}
            />
          ) : (
            <div className="space-y-8">
              <div className="text-center">
                <button 
                  onClick={resetScore}
                  className="bg-[#171719] text-white font-['Inter'] font-medium px-6 py-3 hover:bg-black transition-colors duration-200"
                >
                  Score Another Selfie
                </button>
              </div>
              
              <ScoreDisplay
                overall_score={scoreResult.overall_score}
                sub_scores={scoreResult.sub_scores}
                recommendations={scoreResult.recommendations}
                badge={scoreResult.badge}
                share_id={scoreResult.share_id}
                share_url={scoreResult.share_url}
                share_text={scoreResult.share_text}
                image_url={currentImage!}
              />
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-8 md:px-16 lg:px-24 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-['Bodoni_Moda'] text-[#171719] mb-4">
              Why Choose SELFIE AI™?
            </h2>
            <p className="text-lg text-[#B5B5B3] font-['Inter'] max-w-2xl mx-auto">
              Our AI analyzes 5 key factors that make your selfies stand out and 
              provides personalized recommendations to level up your personal brand.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 border border-[#B5B5B3]">
              <div className="w-16 h-16 bg-[#171719] mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl">✨</span>
              </div>
              <h3 className="text-xl font-['Bodoni_Moda'] text-[#171719] mb-2">
                AI-Powered Analysis
              </h3>
              <p className="text-[#B5B5B3] font-['Inter']">
                Advanced algorithms analyze lighting, composition, expression, 
                background, and styling for comprehensive feedback.
              </p>
            </div>

            <div className="text-center p-8 border border-[#B5B5B3]">
              <div className="w-16 h-16 bg-[#171719] mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-['Bodoni_Moda'] text-[#171719] mb-2">
                Detailed Breakdown
              </h3>
              <p className="text-[#B5B5B3] font-['Inter']">
                Get scores for each factor plus personalized recommendations 
                to improve your selfie game.
              </p>
            </div>

            <div className="text-center p-8 border border-[#B5B5B3]">
              <div className="w-16 h-16 bg-[#171719] mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl">🚀</span>
              </div>
              <h3 className="text-xl font-['Bodoni_Moda'] text-[#171719] mb-2">
                Viral Sharing
              </h3>
              <p className="text-[#B5B5B3] font-['Inter']">
                Share your scores on social media and challenge friends to 
                beat your selfie game score.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 