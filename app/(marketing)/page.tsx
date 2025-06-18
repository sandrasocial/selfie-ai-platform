'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    setTimeout(() => setHeroLoaded(true), 100);
  }, []);

  const handleEmailSubmit = () => {
    if (!email || !email.includes('@')) {
      console.log('Please enter a valid email');
      return;
    }
    // TODO: Connect to email service
    console.log('Email submitted:', email);
    setEmail('');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* HERO SECTION - Full Bleed Editorial */}
      <section className="relative min-h-screen bg-[#171719] overflow-hidden">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `url('https://i.postimg.cc/RFwJMj9s/Herofullbleed-1.png')`,
            filter: 'brightness(0.85) contrast(1.1)'
          }}
        />
        
        {/* Gradient Overlay for Text Legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
        
        {/* Navigation - Minimal Luxury */}
        <nav className="relative z-20 flex justify-between items-center px-8 md:px-16 lg:px-24 py-8 md:py-12">
          {/* Logo */}
          <Link href="/">
            <div className="group cursor-pointer">
              <h1 className="text-white font-light tracking-[0.2em] text-sm md:text-base">
                SELFIE AI™
              </h1>
              <div className="h-px bg-white/40 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </div>
          </Link>
          
          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-12 lg:gap-16">
            <Link href="/about" className="text-white/80 hover:text-white text-xs tracking-[0.2em] transition-colors">
              ABOUT
            </Link>
            <Link href="/tools" className="text-white/80 hover:text-white text-xs tracking-[0.2em] transition-colors">
              TOOLS
            </Link>
            <Link href="/stories" className="text-white/80 hover:text-white text-xs tracking-[0.2em] transition-colors">
              STORIES
            </Link>
            <Link href="/dashboard">
              <button className="border border-white/40 hover:border-white text-white px-8 py-3 text-xs tracking-[0.2em] transition-all hover:bg-white hover:text-[#171719] duration-500">
                BEGIN
              </button>
            </Link>
          </div>

          {/* Mobile Menu Icon */}
          <button className="md:hidden text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 flex items-center min-h-[calc(100vh-120px)]">
          <div className="w-full px-8 md:px-16 lg:px-24 max-w-[1600px] mx-auto">
            <div className="max-w-4xl">
              {/* Editorial Headline */}
              <h2 className={`text-white transition-all duration-1000 ${heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <span className="block text-[56px] sm:text-[72px] md:text-[96px] lg:text-[120px] leading-[0.9] font-light">
                  Your selfie
                </span>
                <span className="block text-[56px] sm:text-[72px] md:text-[96px] lg:text-[120px] leading-[0.9] font-light italic ml-0 md:ml-16 lg:ml-24">
                  is your
                </span>
                <span className="block text-[56px] sm:text-[72px] md:text-[96px] lg:text-[120px] leading-[0.9] font-light">
                  brand.
                </span>
              </h2>
              
              {/* Subheadline */}
              <p className={`text-white/80 text-lg md:text-xl lg:text-2xl mt-8 md:mt-12 max-w-2xl leading-relaxed transition-all duration-1000 delay-300 ${heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                You don't need to do more.
                <br />You just need to show up with strategy.
              </p>
              
              {/* CTAs */}
              <div className={`flex flex-col sm:flex-row gap-4 md:gap-6 mt-12 md:mt-16 transition-all duration-1000 delay-500 ${heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <Link href="/free-guide">
                  <button className="bg-white text-[#171719] px-10 py-4 text-xs tracking-[0.3em] hover:bg-[#F1F1F1] transition-colors">
                    START HERE
                  </button>
                </Link>
                <Link href="/tools">
                  <button className="border border-white text-white px-10 py-4 text-xs tracking-[0.3em] hover:bg-white hover:text-[#171719] transition-all">
                    EXPLORE TOOLS
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MANIFESTO SECTION */}
      <section className="bg-white py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto px-8 md:px-16 lg:px-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            {/* Left - Large Quote */}
            <div className="flex items-center">
              <div className="relative">
                <span className="absolute -top-12 -left-8 text-[120px] leading-none text-[#171719]/10">"</span>
                <h3 className="text-[32px] md:text-[40px] lg:text-[48px] leading-tight text-[#171719] font-light">
                  I needed
                  <br />a way
                  <br />to show up.
                </h3>
              </div>
            </div>
            
            {/* Right - Story */}
            <div className="flex items-center">
              <div className="space-y-6 text-[#4C4B4B]">
                <p className="text-lg leading-relaxed">
                  I built this because I was tired of overthinking my content.
                </p>
                <p className="text-lg leading-relaxed">
                  I wanted to feel confident posting. To look pro without spending hours.
                </p>
                <p className="text-lg leading-relaxed">
                  SELFIE AI™ makes it simple: tools, templates, and strategy. Everything you need to build a magnetic personal brand.
                </p>
                <div className="pt-8">
                  <p className="text-[#171719] text-base">— Sandra Sigurjonsdottir</p>
                  <p className="text-xs tracking-[0.2em] text-[#B5B5B3] mt-1">FOUNDER</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES GRID - Editorial Cards */}
      <section className="bg-[#FAFAF8] py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto px-8 md:px-16 lg:px-24">
          {/* Section Header */}
          <div className="text-center mb-20">
            <h2 className="text-[40px] md:text-[56px] lg:text-[72px] text-[#171719] font-light leading-tight mb-6">
              Tools for transformation
            </h2>
            <p className="text-lg text-[#4C4B4B] max-w-2xl mx-auto">
              Everything you need to elevate your personal brand. One platform. Endless possibilities.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Selfie Score */}
            <div className="group bg-white hover:bg-[#171719] transition-all duration-500 cursor-pointer">
              <div className="relative h-[400px] overflow-hidden">
                <img 
                  src="https://i.postimg.cc/tRDM6kxm/5.png" 
                  alt="Selfie Score"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <div className="p-8">
                <h3 className="text-2xl mb-3 text-[#171719] group-hover:text-white transition-colors">
                  Selfie Score™
                </h3>
                <p className="text-[#4C4B4B] group-hover:text-white/80 transition-colors">
                  AI-powered analysis to perfect your photos. Get instant feedback on lighting, angles, and presence.
                </p>
              </div>
            </div>

            {/* Future Self AI */}
            <div className="group bg-white hover:bg-[#171719] transition-all duration-500 cursor-pointer">
              <div className="relative h-[400px] overflow-hidden">
                <img 
                  src="https://i.postimg.cc/Bng37Psk/107.png" 
                  alt="Future Self AI"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <div className="p-8">
                <h3 className="text-2xl mb-3 text-[#171719] group-hover:text-white transition-colors">
                  Future Self AI
                </h3>
                <p className="text-[#4C4B4B] group-hover:text-white/80 transition-colors">
                  Visualize your brand evolution. See where strategic content can take you in 90 days.
                </p>
              </div>
            </div>

            {/* Content Calendar */}
            <div className="group bg-white hover:bg-[#171719] transition-all duration-500 cursor-pointer">
              <div className="relative h-[400px] overflow-hidden">
                <img 
                  src="https://i.postimg.cc/YC0mdvs0/IMG-3198.jpg" 
                  alt="Content Calendar"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <div className="p-8">
                <h3 className="text-2xl mb-3 text-[#171719] group-hover:text-white transition-colors">
                  Content Calendar
                </h3>
                <p className="text-[#4C4B4B] group-hover:text-white/80 transition-colors">
                  30 days of strategic prompts. Never wonder what to post again.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOUNDER SECTION */}
      <section className="bg-white py-24 md:py-32">
        <div className="max-w-[1200px] mx-auto px-8 md:px-16 lg:px-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Content */}
            <div>
              <p className="text-xs tracking-[0.3em] text-[#B5B5B3] mb-8">THE STORY</p>
              <h2 className="text-[40px] md:text-[56px] leading-tight text-[#171719] font-light mb-8">
                From Iceland
                <br />to 120K followers
                <br />in 90 days.
              </h2>
              <div className="space-y-6 text-[#4C4B4B]">
                <p className="text-lg leading-relaxed">
                  Single mom. Hairdresser. Starting over after divorce with nothing but an iPhone and determination.
                </p>
                <p className="text-lg leading-relaxed">
                  I discovered the power of strategic selfies. Not vanity. Strategy. Every photo told my story, built my brand, attracted my tribe.
                </p>
                <p className="text-lg leading-relaxed">
                  Now I teach what transformed my life. Because your selfie isn't just a photo. It's your future.
                </p>
              </div>
            </div>

            {/* Image */}
            <div className="relative">
              <img 
                src="https://i.postimg.cc/YC0mdvs0/IMG-3198.jpg" 
                alt="Sandra Sigurjonsdottir"
                className="w-full h-[600px] object-cover"
              />
              <div className="absolute -bottom-4 -right-4 bg-[#171719] text-white p-8">
                <p className="text-xs tracking-[0.3em] mb-2">ICELAND</p>
                <p className="text-2xl font-light">2025</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VALUE LADDER - Minimal Luxury */}
      <section className="bg-[#171719] py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto px-8 md:px-16 lg:px-24">
          {/* Header */}
          <div className="text-center mb-20">
            <h2 className="text-[40px] md:text-[56px] lg:text-[72px] text-white font-light leading-tight mb-6">
              Your journey starts here
            </h2>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">
              Choose your path. Each step builds on the last.
            </p>
          </div>

          {/* Value Ladder */}
          <div className="space-y-16 max-w-4xl mx-auto">
            {/* Free Guide */}
            <div className="border-t border-white/20 pt-8 group cursor-pointer">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs tracking-[0.3em] text-white/40 mb-4">STEP 01</p>
                  <h3 className="text-3xl text-white mb-4">The Selfie Queen Guide</h3>
                  <p className="text-white/60 max-w-xl">Your introduction to strategic content. 47 pages of pure transformation.</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl text-white/80">FREE</p>
                  <Link href="/free-guide">
                    <button className="mt-4 text-xs tracking-[0.2em] text-white/60 hover:text-white transition-colors">
                      GET IT NOW →
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Starter Kit */}
            <div className="border-t border-white/20 pt-8 group cursor-pointer">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs tracking-[0.3em] text-white/40 mb-4">STEP 02</p>
                  <h3 className="text-3xl text-white mb-4">The Starter Kit</h3>
                  <p className="text-white/60 max-w-xl">Templates, presets, and your first 30 days mapped out. Everything to begin.</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl text-white/80">$67</p>
                  <Link href="/products/starter-kit">
                    <button className="mt-4 text-xs tracking-[0.2em] text-white/60 hover:text-white transition-colors">
                      START NOW →
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Branded */}
            <div className="border-t border-white/20 pt-8 group cursor-pointer">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs tracking-[0.3em] text-white/40 mb-4">STEP 03</p>
                  <h3 className="text-3xl text-white mb-4">Branded by Selfie</h3>
                  <p className="text-white/60 max-w-xl">Complete transformation system. AI tools, weekly coaching, lifetime access.</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl text-white/80">$397</p>
                  <Link href="/products/branded">
                    <button className="mt-4 text-xs tracking-[0.2em] text-white/60 hover:text-white transition-colors">
                      TRANSFORM →
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            {/* VIP */}
            <div className="border-t border-white/20 pt-8 group cursor-pointer">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs tracking-[0.3em] text-white/40 mb-4">INVITATION ONLY</p>
                  <h3 className="text-3xl text-white mb-4">VIP</h3>
                  <p className="text-white/60 max-w-xl">Personal mentorship. Direct access. For those ready to lead.</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl text-white/80">Apply</p>
                  <Link href="/vip-application">
                    <button className="mt-4 text-xs tracking-[0.2em] text-white/60 hover:text-white transition-colors">
                      APPLY →
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS - Floating Cards */}
      <section className="bg-white py-24 md:py-32 overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-8 md:px-16 lg:px-24">
          <div className="text-center mb-20">
            <h2 className="text-[40px] md:text-[56px] text-[#171719] font-light">Real transformations</h2>
          </div>

          {/* Testimonial Cards */}
          <div className="relative">
            <div className="flex gap-8 animate-slide">
              {/* Testimonial 1 */}
              <div className="bg-[#FAFAF8] p-8 min-w-[400px]">
                <p className="text-[#4C4B4B] text-lg mb-6 italic">
                  "From boring selfies to professional pictures. You literally changed my picture taking game!"
                </p>
                <p className="text-[#171719] font-medium">Sarah M.</p>
                <p className="text-xs text-[#B5B5B3] tracking-[0.2em]">@SARAHCREATES</p>
              </div>

              {/* Testimonial 2 */}
              <div className="bg-[#FAFAF8] p-8 min-w-[400px]">
                <p className="text-[#4C4B4B] text-lg mb-6 italic">
                  "120K followers in 90 days following Sandra's system. My business exploded."
                </p>
                <p className="text-[#171719] font-medium">Maria K.</p>
                <p className="text-xs text-[#B5B5B3] tracking-[0.2em]">@MARIABRAND</p>
              </div>

              {/* Testimonial 3 */}
              <div className="bg-[#FAFAF8] p-8 min-w-[400px]">
                <p className="text-[#4C4B4B] text-lg mb-6 italic">
                  "The AI tools alone are worth 10x the investment. Game changer."
                </p>
                <p className="text-[#171719] font-medium">Jessica L.</p>
                <p className="text-xs text-[#B5B5B3] tracking-[0.2em]">@JESSICALEADS</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-[#171719] py-32 text-center">
        <div className="max-w-4xl mx-auto px-8">
          <h2 className="text-[40px] md:text-[56px] lg:text-[72px] text-white font-light leading-tight mb-8">
            Ready to transform?
          </h2>
          <p className="text-xl text-white/60 mb-12 max-w-2xl mx-auto">
            Join thousands who've discovered the power of strategic selfies. Your brand evolution starts now.
          </p>
          
          {/* Email Capture */}
          <div className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 bg-transparent border-b border-white/40 text-white placeholder-white/40 pb-3 focus:outline-none focus:border-white transition-colors"
              />
              <button
                onClick={handleEmailSubmit}
                className="bg-white text-[#171719] px-8 py-3 text-xs tracking-[0.3em] hover:bg-[#F1F1F1] transition-colors"
              >
                BEGIN NOW
              </button>
            </div>
          </div>
          
          <p className="text-xs text-white/40 mt-8 tracking-[0.2em]">
            START WITH THE FREE GUIDE. NO SPAM. JUST STRATEGY.
          </p>
        </div>
      </section>

      {/* Footer - Minimal Luxury */}
      <footer className="bg-white py-16 border-t border-[#E5E5E5]">
        <div className="max-w-[1400px] mx-auto px-8 md:px-16 lg:px-24">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div>
              <h3 className="text-[#171719] tracking-[0.2em] text-sm mb-2">SELFIE AI™</h3>
              <p className="text-xs text-[#B5B5B3]">© 2025 All rights reserved</p>
            </div>
            
            <div className="flex gap-8">
              <Link href="/privacy" className="text-xs text-[#4C4B4B] hover:text-[#171719] transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="text-xs text-[#4C4B4B] hover:text-[#171719] transition-colors">
                Terms
              </Link>
              <Link href="/contact" className="text-xs text-[#4C4B4B] hover:text-[#171719] transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes slide {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
        
        .animate-slide {
          animation: slide 30s linear infinite;
        }
      `}</style>
    </div>
  );
} 