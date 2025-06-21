import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';

interface SharePageProps {
  params: {
    shareId: string;
  };
}

// Mock data - in production, this would fetch from the database
const mockScoreData = {
  'ABC123DEF456': {
    overall_score: 87,
    sub_scores: {
      lighting: 92,
      composition: 85,
      expression: 88,
      background: 82,
      styling: 90
    },
    badge: 'Icon',
    image_url: 'https://i.postimg.cc/RFwJMj9s/Herofullbleed-1.png',
    created_at: '2024-01-15T10:30:00Z'
  },
  'XYZ789GHI012': {
    overall_score: 94,
    sub_scores: {
      lighting: 96,
      composition: 92,
      expression: 95,
      background: 90,
      styling: 94
    },
    badge: 'Legend',
    image_url: 'https://i.postimg.cc/RFwJMj9s/Herofullbleed-1.png',
    created_at: '2024-01-14T15:45:00Z'
  }
};

export async function generateMetadata({ params }: SharePageProps): Promise<Metadata> {
  const scoreData = mockScoreData[params.shareId as keyof typeof mockScoreData];
  
  if (!scoreData) {
    return {
      title: 'Score Not Found - SELFIE AI™',
      description: 'This selfie score could not be found.'
    };
  }

  return {
    title: `${scoreData.overall_score}/100 Selfie Score - ${scoreData.badge} Status | SELFIE AI™`,
    description: `Check out this ${scoreData.overall_score}/100 selfie score! ${scoreData.badge} level achieved. Get your own score at SELFIE AI™.`,
    openGraph: {
      title: `${scoreData.overall_score}/100 Selfie Score - ${scoreData.badge} Status`,
      description: `Check out this ${scoreData.overall_score}/100 selfie score! ${scoreData.badge} level achieved.`,
      images: [
        {
          url: scoreData.image_url,
          width: 1200,
          height: 630,
          alt: `Selfie Score: ${scoreData.overall_score}/100`
        }
      ],
      type: 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title: `${scoreData.overall_score}/100 Selfie Score - ${scoreData.badge} Status`,
      description: `Check out this ${scoreData.overall_score}/100 selfie score! ${scoreData.badge} level achieved.`,
      images: [scoreData.image_url]
    }
  };
}

export default function ShareScorePage({ params }: SharePageProps) {
  const scoreData = mockScoreData[params.shareId as keyof typeof mockScoreData];
  
  if (!scoreData) {
    notFound();
  }

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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-[#171719] text-white py-6">
        <div className="max-w-6xl mx-auto px-8 md:px-16 lg:px-24">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white flex items-center justify-center">
                <span className="text-[#171719] font-['Bodoni_Moda'] font-bold text-xl">S</span>
              </div>
              <span className="font-['Bodoni_Moda'] text-xl">SELFIE AI™</span>
            </div>
            <Link href="/selfie-score">
              <button className="bg-white text-[#171719] font-['Inter'] font-medium px-6 py-2 hover:bg-[#F1F1F1] transition-colors duration-200">
                Get Your Score
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Score Display */}
      <main className="py-16 px-8 md:px-16 lg:px-24">
        <div className="max-w-4xl mx-auto">
          {/* Score Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-['Bodoni_Moda'] text-[#171719] mb-4">
              Selfie Score: {scoreData.overall_score}/100
            </h1>
            <div className="inline-block">
              <span className={`inline-block px-6 py-3 text-white font-['Inter'] font-medium text-lg ${getBadgeColor(scoreData.badge)}`}>
                {scoreData.badge} Status
              </span>
            </div>
          </div>

          {/* Score Details */}
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            {/* Image */}
            <div className="space-y-4">
              <img 
                src={scoreData.image_url} 
                alt="Selfie" 
                className="w-full h-80 object-cover border border-[#B5B5B3]"
              />
              <p className="text-sm text-[#B5B5B3] font-['Inter'] text-center">
                Scored on {new Date(scoreData.created_at).toLocaleDateString()}
              </p>
            </div>

            {/* Breakdown */}
            <div className="space-y-6">
              <h2 className="text-2xl font-['Bodoni_Moda'] text-[#171719]">
                Score Breakdown
              </h2>
              
              {Object.entries(scoreData.sub_scores).map(([key, score]) => (
                <div key={key} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-['Inter'] text-[#171719] capitalize">
                      {key}
                    </span>
                    <span className={`font-['Inter'] font-medium ${getScoreColor(score)}`}>
                      {score}/100
                    </span>
                  </div>
                  <div className="w-full bg-[#F1F1F1] h-3">
                    <div 
                      className={`h-3 transition-all duration-1000 ${getScoreColor(score).replace('text-', 'bg-')}`}
                      style={{ width: `${score}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-[#F1F1F1] border border-[#B5B5B3] p-12 text-center">
            <h2 className="text-3xl font-['Bodoni_Moda'] text-[#171719] mb-4">
              Think You Can Beat This Score?
            </h2>
            <p className="text-lg text-[#B5B5B3] font-['Inter'] mb-8 max-w-2xl mx-auto">
              Upload your best selfie and get your own AI-powered score. 
              Challenge your friends and see who has the best selfie game!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/selfie-score">
                <button className="bg-[#171719] text-white font-['Inter'] font-medium px-8 py-4 hover:bg-black transition-colors duration-200">
                  Get Your Score
                </button>
              </Link>
              
              <Link href="/products/starter-kit">
                <button className="border border-[#171719] text-[#171719] font-['Inter'] px-8 py-4 hover:bg-[#171719] hover:text-white transition-colors duration-200">
                  Upgrade to Pro
                </button>
              </Link>
            </div>
          </div>

          {/* Social Sharing */}
          <div className="mt-12 text-center">
            <h3 className="text-xl font-['Bodoni_Moda'] text-[#171719] mb-6">
              Share This Score
            </h3>
            <div className="flex justify-center gap-4">
              <button 
                onClick={() => {
                  const text = `Check out this ${scoreData.overall_score}/100 selfie score! ${scoreData.badge} status achieved! 📸 #SelfieAI`;
                  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`;
                  window.open(url, '_blank');
                }}
                className="flex items-center gap-2 bg-[#1DA1F2] text-white font-['Inter'] font-medium px-6 py-3 hover:bg-[#1a8cd8] transition-colors duration-200"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
                Share on X
              </button>
              
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Link copied to clipboard!');
                }}
                className="flex items-center gap-2 bg-[#171719] text-white font-['Inter'] font-medium px-6 py-3 hover:bg-black transition-colors duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
                Copy Link
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#171719] text-white py-12">
        <div className="max-w-6xl mx-auto px-8 md:px-16 lg:px-24 text-center">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-8 h-8 bg-white flex items-center justify-center">
              <span className="text-[#171719] font-['Bodoni_Moda'] font-bold">S</span>
            </div>
            <span className="font-['Bodoni_Moda'] text-lg">SELFIE AI™</span>
          </div>
          <p className="text-[#B5B5B3] font-['Inter'] text-sm">
            Transform your personal brand with AI-powered selfie analysis
          </p>
        </div>
      </footer>
    </div>
  );
} 