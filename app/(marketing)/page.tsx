import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'SELFIE AI™ - Transform Your Personal Brand with AI',
  description: 'Luxury AI-powered platform for personal branding through selfies. Join 120K+ creators building their brand.',
  keywords: 'selfie, personal branding, AI, social media, content creation',
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* HERO SECTION - Ultra Luxury Editorial Design */}
      <section 
        className="relative min-h-screen w-full overflow-hidden"
        style={{ 
          backgroundImage: `url('https://i.postimg.cc/RFwJMj9s/Herofullbleed-1.png')`, 
          backgroundSize: 'cover', 
          backgroundPosition: 'center' 
        }}
      >
        {/* Multi-layer gradient for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#171719]/40 via-transparent to-[#171719]/60"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#171719]/30 via-transparent to-transparent"></div>
        
        {/* Premium loading line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
        
        {/* Vertical accent line */}
        <div className="absolute left-8 md:left-16 lg:left-24 top-0 bottom-0 w-px bg-white/10 lg:bg-white/20"></div>
        
        {/* Content */}
        <div className="relative z-10 flex items-center min-h-screen px-8 md:px-16 lg:px-24">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-['Bodoni_Moda'] text-white leading-tight mb-6">
              Transform Your
              <br />
              <span className="text-[#B5B5B3]">Personal Brand</span>
              <br />
              with AI
            </h1>
            
            <p className="text-lg md:text-xl text-white/80 font-['Inter'] mb-8 max-w-lg">
              Join 120K+ creators who've built their empire using our luxury AI platform. 
              From selfie to brand in 90 days.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/products/starter-kit">
                <button className="bg-white text-[#171719] hover:bg-[#F1F1F1] font-['Inter'] font-medium px-8 py-4 text-lg transition-colors duration-200">
                  Start Your Journey
                </button>
              </Link>
              
              <Link href="/freebie/selfie-guide">
                <button className="border border-white text-white hover:bg-white hover:text-[#171719] font-['Inter'] px-8 py-4 text-lg transition-colors duration-200">
                  Get Free Guide
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-24 px-8 md:px-16 lg:px-24 bg-[#F1F1F1]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-['Bodoni_Moda'] text-[#171719] mb-4">
              Why SELFIE AI™?
            </h2>
            <p className="text-lg text-[#B5B5B3] font-['Inter'] max-w-2xl mx-auto">
              The only platform that combines luxury aesthetics with cutting-edge AI 
              to transform your personal brand.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#171719] mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl">✨</span>
              </div>
              <h3 className="text-xl font-['Bodoni_Moda'] text-[#171719] mb-2">
                AI-Powered Insights
              </h3>
              <p className="text-[#B5B5B3] font-['Inter']">
                Get personalized recommendations for your brand strategy and content creation.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-[#171719] mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-['Bodoni_Moda'] text-[#171719] mb-2">
                Luxury Design System
              </h3>
              <p className="text-[#B5B5B3] font-['Inter']">
                Access premium templates and design tools that elevate your brand aesthetic.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-[#171719] mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl">🚀</span>
              </div>
              <h3 className="text-xl font-['Bodoni_Moda'] text-[#171719] mb-2">
                Proven Results
              </h3>
              <p className="text-[#B5B5B3] font-['Inter']">
                Join creators who've grown from 0 to 120K followers in just 90 days.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 px-8 md:px-16 lg:px-24 bg-[#171719]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-['Bodoni_Moda'] text-white mb-6">
            Ready to Transform Your Brand?
          </h2>
          <p className="text-lg text-[#B5B5B3] font-['Inter'] mb-8 max-w-2xl mx-auto">
            Start with our free guide and discover how AI can revolutionize your personal brand.
          </p>
          <Link href="/products/starter-kit">
            <button className="bg-white text-[#171719] hover:bg-[#F1F1F1] font-['Inter'] font-medium px-8 py-4 text-lg transition-colors duration-200">
              Get Started Today
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
} 