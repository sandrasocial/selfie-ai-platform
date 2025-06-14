import React, { useState } from 'react';
import { Link } from 'wouter';
import DevLoginButton from '@/components/DevLoginButton';

export default function Home() {
  const [email, setEmail] = useState('');

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Connect to email signup
    console.log('Email signup:', email);
  };

  return (
    <div className="min-h-screen bg-white">
      <DevLoginButton />

      {/* HERO SECTION - Ultra Luxury Editorial Design */}
      <section 
        className="relative min-h-screen w-full overflow-hidden"
        style={{ backgroundImage: `url('https://i.postimg.cc/RFwJMj9s/Herofullbleed-1.png')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        {/* Multi-layer gradient for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#171719]/40 via-transparent to-[#171719]/60"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#171719]/30 via-transparent to-transparent"></div>
        
        {/* Premium loading line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
        
        {/* Film grain texture overlay for premium feel */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" 
          style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.5'/%3E%3C/svg%3E")` 
          }}
        ></div>
        
        {/* Vertical accent line */}
        <div className="absolute left-24 top-0 bottom-0 w-px bg-white/20 hidden lg:block"></div>
        
        {/* Navigation Bar - Elevated */}
        <nav className="relative z-20 flex justify-between items-center px-8 md:px-16 lg:px-24 py-8">
          {/* Logo with subtle animation hint */}
          <div className="relative group">
            <img 
              src="https://i.postimg.cc/L88db1fc/White-transperent-logo.png" 
              alt="SELFIE AI™" 
              className="h-10 w-auto opacity-100 hover:opacity-90 transition-all duration-500"
            />
            <div className="absolute -bottom-1 left-0 w-full h-px bg-white/40 scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left"></div>
          </div>
          
          {/* Navigation with refined spacing */}
          <div className="hidden md:flex items-center">
            <div className="flex gap-16 items-center mr-16">
              <Link href="/pricing" className="group relative font-['Neue_Einstellung'] text-[11px] uppercase tracking-[0.2em] text-white/90 hover:text-white transition-colors">
                About
                <span className="absolute -bottom-2 left-0 w-full h-px bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></span>
              </Link>
              <Link href="/studio" className="group relative font-['Neue_Einstellung'] text-[11px] uppercase tracking-[0.2em] text-white/90 hover:text-white transition-colors">
                Tools
                <span className="absolute -bottom-2 left-0 w-full h-px bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></span>
              </Link>
              <Link href="/dashboard" className="group relative font-['Neue_Einstellung'] text-[11px] uppercase tracking-[0.2em] text-white/90 hover:text-white transition-colors">
                Stories
                <span className="absolute -bottom-2 left-0 w-full h-px bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></span>
              </Link>
            </div>
            
            {/* Elevated CTA */}
            <Link href="/dashboard">
              <button className="group relative overflow-hidden">
                <div className="relative bg-white/5 backdrop-blur-sm border border-white/40 px-10 py-3 transition-all duration-500 group-hover:bg-white group-hover:border-white">
                  <span className="font-['Neue_Einstellung'] text-[11px] uppercase tracking-[0.3em] text-white group-hover:text-[#171719] transition-colors duration-500">
                    Begin
                  </span>
                </div>
              </button>
            </Link>
          </div>
        </nav>
        
        {/* Hero Content - Ultra Editorial Layout */}
        <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-120px)] px-8 md:px-16 lg:px-24">
          <div className="max-w-7xl w-full">
            {/* Small accent text */}
            <div className="mb-8 md:mb-12">
              <p className="font-['Neue_Einstellung'] text-[10px] uppercase tracking-[0.3em] text-white/70">
                The Luxury Personal Brand Platform
              </p>
            </div>
            
            {/* Editorial Headline with refined spacing */}
            <h1 className="relative">
              <span className="block font-['Bordoni_FLF'] text-[56px] md:text-[80px] lg:text-[112px] xl:text-[144px] leading-[0.85] text-white">
                Your selfie
              </span>
              <span className="block font-['Bordoni_FLF'] italic font-light text-[56px] md:text-[80px] lg:text-[112px] xl:text-[144px] leading-[0.85] text-white ml-0 md:ml-24 lg:ml-32">
                is your
              </span>
              <span className="block font-['Bordoni_FLF'] text-[56px] md:text-[80px] lg:text-[112px] xl:text-[144px] leading-[0.85] text-white text-right mr-0 md:mr-16 lg:mr-32">
                brand.
              </span>
              
              {/* Decorative element */}
              <div className="absolute -right-8 top-1/2 transform -translate-y-1/2 w-px h-32 bg-white/30 hidden lg:block"></div>
            </h1>
            
            {/* Subheadline with elegant positioning */}
            <div className="mt-16 md:mt-20 max-w-3xl mx-auto md:mx-0 md:ml-auto md:mr-32">
              <p className="font-['Neue_Einstellung'] text-[16px] md:text-[20px] lg:text-[24px] leading-[1.6] text-white/90 tracking-[0.02em]">
                You don't need to do more.<br/>
                You just need to show up with strategy.
              </p>
            </div>
            
            {/* CTAs - Ultra Refined */}
            <div className="mt-20 md:mt-24 flex flex-col md:flex-row gap-8 md:gap-12 justify-start md:justify-end md:mr-32">
              {/* Primary CTA - Editorial treatment */}
              <Link href="/dashboard">
                <button className="group relative">
                  <div className="bg-transparent border border-white text-white px-12 py-5 overflow-hidden relative transition-all duration-500 hover:bg-white hover:text-[#171719]">
                    <span className="relative z-10 font-['Neue_Einstellung'] text-[11px] uppercase tracking-[0.3em]">
                      Start Your Journey
                    </span>
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left"></div>
                  </div>
                </button>
              </Link>
              
              {/* Secondary CTA - Minimal */}
              <button className="group relative self-center">
                <span className="font-['Neue_Einstellung'] text-[11px] uppercase tracking-[0.3em] text-white/80 group-hover:text-white transition-colors duration-300">
                  Watch Story
                </span>
                <div className="mt-2 w-full h-px bg-white/40 transform origin-left group-hover:scale-x-110 transition-transform duration-500"></div>
              </button>
            </div>
          </div>
        </div>
        
        {/* Sophisticated scroll indicator */}
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2">
          <div className="flex flex-col items-center gap-2">
            <p className="font-['Neue_Einstellung'] text-[10px] uppercase tracking-[0.3em] text-white/60">Scroll</p>
            <div className="w-px h-12 bg-gradient-to-b from-white/60 to-transparent"></div>
          </div>
        </div>
      </section>

      {/* Section Transition - Luxury Detail */}
      <div className="relative h-px bg-gradient-to-r from-transparent via-[#171719]/20 to-transparent">
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-2 h-2 bg-[#171719]/20 rotate-45"></div>
        </div>
      </div>

      {/* STATS SECTION - Ultra Refined Luxury Layout */}
      <section className="relative bg-white py-20 md:py-28 overflow-hidden">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #171719 0, #171719 1px, transparent 1px, transparent 15px)' }}></div>
        
        <div className="relative max-w-[1400px] mx-auto px-8 md:px-16 lg:px-24">
          {/* Section identifier */}
          <div className="absolute -top-8 left-8 md:left-24 font-['Neue_Einstellung'] text-[10px] uppercase tracking-[0.3em] text-[#B5B5B3]">
            01 — Proof
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
            
            {/* Stats Content - Ultra Elegant */}
            <div className="lg:col-span-8 order-2 lg:order-1">
              {/* Refined Stats with custom styling */}
              <div className="flex flex-col md:flex-row md:items-baseline gap-12 md:gap-16 justify-center lg:justify-start">
                {/* 120K */}
                <div className="relative group">
                  <div className="text-center lg:text-left transform transition-all duration-700 hover:translate-y-[-2px]">
                    <span className="relative font-['Lingerie_Typeface'] text-[48px] md:text-[64px] lg:text-[72px] leading-[1] text-[#171719]">
                      120K
                      {/* Subtle underline accent */}
                      <div className="absolute -bottom-2 left-0 right-0 h-px bg-[#171719]/10 transition-all duration-500 group-hover:bg-[#171719]/30"></div>
                    </span>
                    <p className="font-['Neue_Einstellung'] text-[11px] uppercase tracking-[0.2em] text-[#4C4B4B] mt-3">
                      Followers Built
                    </p>
                  </div>
                </div>
                
                {/* Elegant separator */}
                <div className="hidden md:block">
                  <div className="w-8 h-px bg-[#B5B5B3]/30"></div>
                </div>
                
                {/* 1.7M */}
                <div className="relative group">
                  <div className="text-center lg:text-left transform transition-all duration-700 hover:translate-y-[-2px]">
                    <span className="relative font-['Lingerie_Typeface'] text-[48px] md:text-[64px] lg:text-[72px] leading-[1] text-[#171719]">
                      1.7M
                      <div className="absolute -bottom-2 left-0 right-0 h-px bg-[#171719]/10 transition-all duration-500 group-hover:bg-[#171719]/30"></div>
                    </span>
                    <p className="font-['Neue_Einstellung'] text-[11px] uppercase tracking-[0.2em] text-[#4C4B4B] mt-3">
                      Monthly Reach
                    </p>
                  </div>
                </div>
                
                {/* Elegant separator */}
                <div className="hidden md:block">
                  <div className="w-8 h-px bg-[#B5B5B3]/30"></div>
                </div>
                
                {/* 90 */}
                <div className="relative group">
                  <div className="text-center lg:text-left transform transition-all duration-700 hover:translate-y-[-2px]">
                    <span className="relative font-['Lingerie_Typeface'] text-[48px] md:text-[64px] lg:text-[72px] leading-[1] text-[#171719]">
                      90
                      <div className="absolute -bottom-2 left-0 right-0 h-px bg-[#171719]/10 transition-all duration-500 group-hover:bg-[#171719]/30"></div>
                    </span>
                    <p className="font-['Neue_Einstellung'] text-[11px] uppercase tracking-[0.2em] text-[#4C4B4B] mt-3">
                      Days to Transform
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Quote with sophisticated treatment */}
              <div className="max-w-2xl mx-auto lg:mx-0 mt-16">
                <div className="relative">
                  {/* Large decorative quote */}
                  <span className="absolute -top-8 -left-6 font-['Bordoni_FLF'] text-[80px] text-[#171719]/5 leading-none select-none transition-all duration-1000 hover:text-[#171719]/10">"</span>
                  
                  <p className="relative font-['Bordoni_FLF'] italic text-[24px] md:text-[32px] leading-[1.3] text-[#171719] mb-12 text-center lg:text-left tracking-[0.02em]">
                    This isn't hype. It's what's possible.
                  </p>
                </div>
                
                {/* Signature with refined styling */}
                <div className="text-center lg:text-left">
                  <div className="inline-block relative">
                    <p className="font-['Bordoni_FLF'] text-[18px] text-[#171719] mb-1">
                      — Sandra Sigurjonsdottir
                    </p>
                    <p className="font-['Neue_Einstellung'] text-[10px] uppercase tracking-[0.25em] text-[#4C4B4B]">
                      Founder & Creator
                    </p>
                    {/* Elegant underline */}
                    <div className="absolute -bottom-4 left-0 w-16 h-px bg-[#171719]/20"></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Founder Image - Ultra Editorial */}
            <div className="lg:col-span-4 order-1 lg:order-2">
              <div className="relative max-w-[320px] mx-auto">
                {/* Main image with artistic treatment */}
                <div className="relative overflow-hidden group">
                  <img 
                    src="https://i.postimg.cc/YC0mdvs0/IMG-3198.jpg" 
                    alt="Sandra Sigurjonsdottir" 
                    className="w-full h-[400px] object-cover object-center filter contrast-110 transition-all duration-700 group-hover:contrast-125 group-hover:scale-[1.02]"
                  />
                  {/* Gradient overlay for editorial effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-white/20 via-transparent to-transparent"></div>
                  
                  {/* Hover reveal text */}
                  <div className="absolute bottom-8 left-8 right-8 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                    <p className="font-['Neue_Einstellung'] text-[10px] uppercase tracking-[0.3em] text-[#171719]/80 bg-white/90 backdrop-blur-sm px-4 py-2 text-center">
                      Founder Story
                    </p>
                  </div>
                </div>
                
                {/* Sophisticated frame elements */}
                <div className="absolute -top-4 -left-4 w-24 h-24 border-t border-l border-[#171719]/10"></div>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b border-r border-[#171719]/10"></div>
                
                {/* Caption */}
                <p className="mt-6 font-['Neue_Einstellung'] text-[10px] uppercase tracking-[0.25em] text-[#4C4B4B] text-center">
                  Norway · 2025
                </p>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative min-h-screen bg-[#FAFAF8] flex items-center justify-center overflow-hidden">
        {/* Background Design Element */}
        <div className="absolute top-0 right-0 font-['Lingerie_Typeface'] text-[400px] md:text-[600px] lg:text-[800px] leading-[0.8] select-none" style={{color: '#171719', opacity: 0.02}}>
          08
        </div>
        
        <div className="relative max-w-[1200px] mx-auto px-8 md:px-16 lg:px-24 text-center">
          <div className="space-y-12">
            <h2 className="font-['Bordoni_FLF'] text-[64px] md:text-[96px] lg:text-[120px] leading-[0.9] tracking-[-0.01em]">
              <span className="block mb-2">Let's build</span>
              <span className="block italic font-light mb-2">your brand</span>
              <span className="block mb-2">from your</span>
              <span className="block">camera roll.</span>
            </h2>
            
            <p className="font-['Neue_Einstellung'] text-xl text-black/70 max-w-2xl mx-auto">
              I'll send you the tools and the clarity—straight to your inbox.
            </p>
            
            <div className="max-w-lg mx-auto">
              <form className="space-y-8" onSubmit={handleEmailSubmit}>
                <input
                  type="email"
                  placeholder="Your best email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-0 py-4 text-lg bg-transparent border-0 border-b border-black/20 placeholder:text-black/40 focus:border-black focus:outline-none font-['Neue_Einstellung']"
                />
                <button
                  type="submit"
                  className="w-full bg-black text-white py-4 px-8 font-['Neue_Einstellung'] text-xs tracking-[0.3em] uppercase hover:bg-black/80 transition-colors duration-300"
                >
                  Get Started Free
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}