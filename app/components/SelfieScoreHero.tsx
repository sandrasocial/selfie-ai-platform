import Link from 'next/link';

export default function SelfieScoreHero() {
  return (
    <section className="relative min-h-screen bg-[#171719] overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      {/* Vertical Accent Line */}
      <div className="absolute left-8 md:left-16 lg:left-24 top-0 bottom-0 w-px bg-white/10"></div>

      {/* Content */}
      <div className="relative z-10 flex items-center min-h-screen px-8 md:px-16 lg:px-24">
        <div className="max-w-4xl">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-white/10 border border-white/20 mb-8">
            <span className="text-white/80 font-['Inter'] text-sm uppercase tracking-wider">
              New Feature
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-['Bodoni_Moda'] text-white leading-tight mb-6">
            Discover Your
            <br />
            <span className="text-[#B5B5B3]">Selfie Potential</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-white/80 font-['Inter'] mb-8 max-w-2xl">
            Get AI-powered insights on your selfie game. Score your lighting, composition, 
            expression, and more. Join thousands building their personal brand.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap gap-8 mb-12">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-['Bodoni_Moda'] text-white mb-2">
                50K+
              </div>
              <div className="text-[#B5B5B3] font-['Inter'] text-sm uppercase tracking-wider">
                Selfies Scored
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-['Bodoni_Moda'] text-white mb-2">
                94%
              </div>
              <div className="text-[#B5B5B3] font-['Inter'] text-sm uppercase tracking-wider">
                Accuracy Rate
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-['Bodoni_Moda'] text-white mb-2">
                5
              </div>
              <div className="text-[#B5B5B3] font-['Inter'] text-sm uppercase tracking-wider">
                Scoring Factors
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Link href="#upload">
              <button className="bg-white text-[#171719] hover:bg-[#F1F1F1] font-['Inter'] font-medium px-8 py-4 text-lg transition-colors duration-200">
                Score Your Selfie
              </button>
            </Link>
            
            <Link href="/products/starter-kit">
              <button className="border border-white text-white hover:bg-white hover:text-[#171719] font-['Inter'] px-8 py-4 text-lg transition-colors duration-200">
                Upgrade to Pro
              </button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="flex items-center gap-6 text-white/60 font-['Inter'] text-sm">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>AI-Powered Analysis</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Instant Results</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Share & Compare</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="animate-bounce">
          <svg className="w-6 h-6 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  );
} 