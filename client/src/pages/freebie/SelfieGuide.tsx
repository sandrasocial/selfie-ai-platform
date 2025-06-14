// FINAL PRODUCTION PUSH CONFIRMATION
import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { submitSelfieGuideLead } from '@/lib/selfieGuideApi';
import { supabase } from '@/lib/supabaseClient';

export default function SelfieGuide() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [elementsLoaded, setElementsLoaded] = useState(false);
  const [, setLocation] = useLocation();

  React.useEffect(() => {
    const timer = setTimeout(() => setElementsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      alert('Please enter your email address');
      return;
    }

    console.log('Form submission started:', { email, name });
    setIsSubmitting(true);
    
    try {
      console.log('Calling submitSelfieGuideLead...');
      const result = await submitSelfieGuideLead({ email, name });
      console.log('Submission result:', result);
      
      if (result && result.pdfUrl) {
        console.log('PDF URL received:', result.pdfUrl);
        const redirectUrl = `/freebie/selfieguide/thankyou?pdf=${encodeURIComponent(result.pdfUrl)}`;
        console.log('Redirecting to:', redirectUrl);
        window.location.href = redirectUrl;
      } else if (result && result.success) {
        console.log('Success but no PDF URL, redirecting anyway');
        window.location.href = '/freebie/selfieguide/thankyou';
      } else {
        throw new Error('Invalid response from submission');
      }
    } catch (error: any) {
      console.error('Form submission error:', error);
      const errorMessage = error?.message || 'Unknown error occurred';
      alert(`Submission failed: ${errorMessage}`);
      setShowSuccess(true); // Show fallback success state
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }

        @keyframes fadeInScale {
          from { 
            opacity: 0; 
            transform: scale(0.95);
          }
          to { 
            opacity: 1; 
            transform: scale(1);
          }
        }

        .animate-shimmer {
          animation: shimmer 3s infinite;
        }

        .animate-fadeInScale {
          animation: fadeInScale 0.8s ease-out forwards;
        }
      `}</style>

      {/* Premium loading line */}
      <div className="fixed top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#171719]/20 to-transparent animate-shimmer z-50"></div>

      {/* Hero Section - Editorial Impact */}
      <section className="relative min-h-[80vh] md:min-h-screen flex items-center overflow-hidden">
        {/* Background gradient for luxury depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#FAFAF8] via-white to-[#F1F1F1]"></div>

        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-[0.015]" 
          style={{ 
            backgroundImage: 'repeating-linear-gradient(45deg, #171719 0, #171719 1px, transparent 1px, transparent 20px)' 
          }}
        ></div>

        {/* Large decorative number */}
        <div className="absolute -right-20 top-0 font-['Lingerie_Typeface'] text-[400px] md:text-[600px] leading-none text-[#171719]/[0.02] select-none pointer-events-none">
          01
        </div>

        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 sm:px-8 md:px-16 lg:px-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7">
              {/* Small accent */}
              <div className={`mb-8 transition-all duration-1000 ease-out transform ${elementsLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <p className="font-['Neue_Einstellung'] text-[11px] uppercase tracking-[0.35em] text-[#4C4B4B]">
                  Free Guide — Start Today
                </p>
              </div>

              {/* Headline */}
              <h1 className={`font-['Bordoni_FLF'] text-[48px] sm:text-[64px] md:text-[80px] lg:text-[96px] leading-[0.9] text-[#171719] mb-8 transition-all duration-1000 ease-out delay-200 transform ${elementsLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                Not loving your selfies?
                <span className="block font-['Bordoni_FLF'] italic font-light text-[#4C4B4B]/80 text-[40px] sm:text-[56px] md:text-[72px] lg:text-[88px] mt-2">
                  Let's change that.
                </span>
              </h1>

              {/* What they'll get */}
              <div className={`space-y-6 mb-12 transition-all duration-1000 ease-out delay-400 transform ${elementsLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <p className="font-['Neue_Einstellung'] text-[18px] md:text-[20px] leading-[1.6] text-[#171719]/80">
                  This free guide shows you how to take better selfies—with just your phone. No filters. No weird angles. No second guessing.
                </p>

                <div className="space-y-4 ml-0 md:ml-8">
                  <p className="font-['Neue_Einstellung'] text-[16px] md:text-[18px] text-[#4C4B4B] mb-6">
                    Inside, I'll show you:
                  </p>

                  {[
                    'The camera settings that make a big difference',
                    'How to get good lighting (yes, even indoors)',
                    'Easy editing tips to make your photos pop',
                    'A 7-day challenge to boost your confidence'
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-4 group">
                      <span className="font-['Neue_Einstellung'] text-[14px] text-[#171719]/40 mt-1">✓</span>
                      <p className="font-['Neue_Einstellung'] text-[16px] md:text-[17px] leading-relaxed text-[#171719]/70 group-hover:text-[#171719] transition-colors duration-300">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>

                <p className="font-['Bordoni_FLF'] text-[22px] md:text-[26px] text-[#171719] mt-8 italic">
                  It's simple. It works. And you'll actually like how you look.
                </p>
              </div>
            </div>

            {/* Right Content - Form */}
            <div className="lg:col-span-5">
              <div className={`bg-[#FAFAF8] p-8 md:p-12 border border-[#171719]/10 transition-all duration-1000 ease-out delay-600 transform ${elementsLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                {/* Mini about */}
                <div className="mb-10">
                  <div className="w-16 h-px bg-[#171719]/20 mb-6"></div>
                  <p className="font-['Neue_Einstellung'] text-[15px] md:text-[16px] leading-relaxed text-[#4C4B4B]">
                    I made this because I used to hate every photo of myself. Now? I take selfies I'm proud to post—and help other women do the same. This is where we start.
                  </p>
                </div>

                {/* Form */}
                {!showSuccess ? (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your first name"
                        className="w-full px-0 py-4 text-[18px] bg-transparent border-0 border-b-2 border-[#171719]/20 placeholder:text-[#B5B5B3] focus:border-[#171719] focus:outline-none font-['Neue_Einstellung'] transition-colors duration-300"
                      />
                    </div>
                    <div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Your best email"
                        required
                        className="w-full px-0 py-4 text-[18px] bg-transparent border-0 border-b-2 border-[#171719]/20 placeholder:text-[#B5B5B3] focus:border-[#171719] focus:outline-none font-['Neue_Einstellung'] transition-colors duration-300"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#171719] text-white py-5 font-['Neue_Einstellung'] text-[11px] uppercase tracking-[0.3em] transition-all duration-500 hover:bg-[#171719]/90 disabled:opacity-50 relative overflow-hidden group"
                    >
                      <span className="relative z-10">
                        {isSubmitting ? 'SENDING...' : 'GET INSTANT ACCESS'}
                      </span>
                      <div className="absolute inset-0 bg-white/10 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                    </button>
                  </form>
                ) : (
                  <div className="text-center py-8 animate-fadeInScale">
                    <div className="w-16 h-16 bg-[#171719] rounded-full flex items-center justify-center mx-auto mb-6">
                      <span className="text-white text-2xl">✓</span>
                    </div>
                    <p className="font-['Bordoni_FLF'] text-[24px] text-[#171719] mb-2">
                      Check your inbox!
                    </p>
                    <p className="font-['Neue_Einstellung'] text-[14px] text-[#4C4B4B]">
                      Your guide is on its way.
                    </p>
                  </div>
                )}

                {/* Trust elements */}
                <div className="mt-8 pt-8 border-t border-[#171719]/10">
                  <p className="font-['Neue_Einstellung'] text-[11px] text-[#B5B5B3] text-center uppercase tracking-[0.2em]">
                    Join 10,000+ women taking better selfies
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#171719]/10 to-transparent"></div>
      </section>

      {/* Love Notes Section */}
      <section className="py-20 md:py-32 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAFAF8]/50 to-transparent"></div>

        <div className="relative max-w-[1400px] mx-auto px-6 sm:px-8 md:px-16 lg:px-24">
          {/* Section header */}
          <div className="text-center mb-16 md:mb-24">
            <div className="font-['Lingerie_Typeface'] text-[120px] md:text-[180px] leading-none text-[#171719]/[0.03] select-none">
              Love
            </div>
            <h2 className="font-['Bordoni_FLF'] text-[36px] md:text-[48px] text-[#171719] -mt-16 md:-mt-24">
              What They're Saying
            </h2>
          </div>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#171719]/10 max-w-6xl mx-auto">
            {[
              '"I\'ve taken some of my best selfies thanks to you."',
              '"You made me stop using filters. I actually like what I see now."',
              '"Your tips turned my boring selfies into real photos I\'m proud of."',
              '"Love how you show the actual camera settings—so helpful!"',
              '"This gave me the push to show up more."'
            ].map((quote, index) => (
              <div key={index} className="bg-white p-8 md:p-10 group hover:bg-[#FAFAF8] transition-all duration-500">
                <p className="font-['Neue_Einstellung'] text-[16px] md:text-[18px] leading-relaxed text-[#171719]/70 group-hover:text-[#171719] transition-colors duration-300">
                  {quote}
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#171719]/10 rounded-full"></div>
                  <div className="font-['Neue_Einstellung'] text-[11px] uppercase tracking-[0.2em] text-[#B5B5B3]">
                    Verified
                  </div>
                </div>
              </div>
            ))}

            {/* Empty cell for layout on desktop */}
            <div className="hidden lg:block bg-[#171719] p-10 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
              <div className="relative z-10">
                <p className="font-['Bordoni_FLF'] text-[28px] text-white italic">
                  Join them.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Next Step Teaser */}
      <section className="py-24 md:py-40 bg-[#171719] text-white relative overflow-hidden">
        {/* Background texture */}
        <div className="absolute inset-0 opacity-[0.03]" 
          style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.5'/%3E%3C/svg%3E")` 
          }}
        ></div>

        {/* Large background text */}
        <div className="absolute -left-20 top-1/2 transform -translate-y-1/2 font-['Lingerie_Typeface'] text-[300px] md:text-[500px] leading-none text-white/[0.02] select-none pointer-events-none">
          AI
        </div>

        <div className="relative z-10 max-w-[1000px] mx-auto px-6 sm:px-8 md:px-16 text-center">
          <div className="mb-8">
            <p className="font-['Neue_Einstellung'] text-[11px] uppercase tracking-[0.35em] text-white/60 mb-8">
              What Happens Next
            </p>

            <h3 className="font-['Bordoni_FLF'] text-[32px] sm:text-[40px] md:text-[56px] leading-tight mb-8">
              Your first AI-powered
              <span className="block font-['Bordoni_FLF'] italic font-light">selfie session awaits</span>
            </h3>

            <p className="font-['Neue_Einstellung'] text-[18px] md:text-[20px] leading-relaxed text-white/80 max-w-2xl mx-auto">
              Once you go through the guide, you'll unlock your first AI-powered selfie session—made to help you show up like the woman you know you are.
            </p>
          </div>

          {/* Visual element */}
          <div className="mt-16 flex justify-center">
            <div className="relative">
              <div className="w-32 h-32 border border-white/20 rotate-45 animate-spin-slow"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="py-12 bg-white border-t border-[#171719]/10">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-8 md:px-16 lg:px-24 text-center">
          <img 
            src="https://i.postimg.cc/L88db1fc/White-transperent-logo.png" 
            alt="SELFIE AI™" 
            className="h-8 mx-auto mb-6 opacity-80 invert"
          />
          <p className="font-['Neue_Einstellung'] text-[11px] uppercase tracking-[0.2em] text-[#B5B5B3]">
            © 2024 Selfie AI™ by Sandra Sigurjonsdottir
          </p>
        </div>
      </footer>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(45deg); }
          to { transform: rotate(405deg); }
        }

        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </div>
  );
}
// redirect ready for deploy