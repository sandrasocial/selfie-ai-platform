'use client';

import { useState } from 'react';

interface SubScores {
  lighting: number;
  composition: number;
  expression: number;
  background: number;
  styling: number;
}

interface ScoreDisplayProps {
  overall_score: number;
  sub_scores: SubScores;
  recommendations: string[];
  badge: string;
  share_id: string;
  share_url: string;
  share_text: string;
  image_url: string;
}

export default function ScoreDisplay({
  overall_score,
  sub_scores,
  recommendations,
  badge,
  share_id,
  share_url,
  share_text,
  image_url
}: ScoreDisplayProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(share_url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const shareToTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(share_text)}&url=${encodeURIComponent(share_url)}`;
    window.open(url, '_blank');
  };

  const shareToInstagram = () => {
    // Instagram doesn't support direct sharing via URL
    // This would typically open a modal with the image and text
    alert('Share this image to Instagram with the caption: ' + share_text);
  };

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'Legend': return 'bg-gradient-to-r from-yellow-400 to-orange-500';
      case 'Icon': return 'bg-gradient-to-r from-purple-400 to-pink-500';
      case 'Rising Star': return 'bg-gradient-to-r from-blue-400 to-cyan-500';
      default: return 'bg-gradient-to-r from-gray-400 to-gray-500';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Main Score Display */}
      <div className="bg-white border border-[#B5B5B3] p-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Image */}
          <div className="space-y-4">
            <img 
              src={image_url} 
              alt="Your selfie" 
              className="w-full h-64 object-cover border border-[#B5B5B3]"
            />
            <div className="text-center">
              <span className={`inline-block px-4 py-2 text-white font-['Inter'] font-medium ${getBadgeColor(badge)}`}>
                {badge}
              </span>
            </div>
          </div>

          {/* Score Details */}
          <div className="space-y-6">
            {/* Overall Score */}
            <div className="text-center">
              <div className="text-6xl md:text-8xl font-['Bodoni_Moda'] text-[#171719] mb-2">
                {overall_score}
              </div>
              <div className="text-2xl font-['Inter'] text-[#B5B5B3]">
                out of 100
              </div>
            </div>

            {/* Sub Scores */}
            <div className="space-y-4">
              <h3 className="text-xl font-['Bodoni_Moda'] text-[#171719]">
                Breakdown
              </h3>
              
              {sub_scores && Object.entries(sub_scores).map(([key, score]) => (
                <div key={key} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-['Inter'] text-[#171719] capitalize">
                      {key}
                    </span>
                    <span className={`font-['Inter'] font-medium ${getScoreColor(score)}`}>
                      {score}/100
                    </span>
                  </div>
                  <div className="w-full bg-[#F1F1F1] h-2">
                    <div 
                      className={`h-2 transition-all duration-1000 ${getScoreColor(score).replace('text-', 'bg-')}`}
                      style={{ width: `${score}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-[#F1F1F1] border border-[#B5B5B3] p-8">
        <h3 className="text-2xl font-['Bodoni_Moda'] text-[#171719] mb-6">
          Personalized Tips
        </h3>
        <div className="space-y-4">
          {recommendations && recommendations.map((recommendation, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className="w-8 h-8 bg-[#171719] text-white flex items-center justify-center font-['Inter'] font-medium text-sm">
                {index + 1}
              </div>
              <p className="font-['Inter'] text-[#171719] leading-relaxed">
                {recommendation}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Share Section */}
      <div className="bg-white border border-[#B5B5B3] p-8">
        <h3 className="text-2xl font-['Bodoni_Moda'] text-[#171719] mb-6">
          Share Your Score
        </h3>
        
        <div className="space-y-4">
          {/* Share URL */}
          <div className="flex gap-2">
            <input 
              type="text" 
              value={share_url} 
              readOnly 
              className="flex-1 px-4 py-3 border border-[#B5B5B3] font-['Inter'] text-sm"
            />
            <button 
              onClick={copyToClipboard}
              className="bg-[#171719] text-white font-['Inter'] font-medium px-6 py-3 hover:bg-black transition-colors duration-200"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>

          {/* Social Share Buttons */}
          <div className="flex gap-4">
            <button 
              onClick={shareToTwitter}
              className="flex items-center gap-2 bg-[#1DA1F2] text-white font-['Inter'] font-medium px-6 py-3 hover:bg-[#1a8cd8] transition-colors duration-200"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
              Share on X
            </button>
            
            <button 
              onClick={shareToInstagram}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-['Inter'] font-medium px-6 py-3 hover:from-purple-600 hover:to-pink-600 transition-colors duration-200"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              Share on Instagram
            </button>
          </div>

          {/* Share Text Preview */}
          <div className="p-4 bg-[#F1F1F1] border border-[#B5B5B3]">
            <p className="font-['Inter'] text-sm text-[#171719]">
              <strong>Share this:</strong> {share_text}
            </p>
          </div>
        </div>
      </div>

      {/* Upgrade CTA */}
      <div className="bg-[#171719] text-white p-8 text-center">
        <h3 className="text-2xl font-['Bodoni_Moda'] mb-4">
          Want Unlimited Scores?
        </h3>
        <p className="font-['Inter'] text-[#B5B5B3] mb-6 max-w-2xl mx-auto">
          Upgrade to Pro and get unlimited selfie scores, detailed analytics, 
          and personalized coaching to level up your personal brand.
        </p>
        <button className="bg-white text-[#171719] font-['Inter'] font-medium px-8 py-4 hover:bg-[#F1F1F1] transition-colors duration-200">
          Upgrade to Pro
        </button>
      </div>
    </div>
  );
} 