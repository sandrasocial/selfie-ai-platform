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
        <div className="absolute left-8 md:left-16 lg:left-24 top-0 bottom-0 w-px bg-white/10 lg:bg-white/20"></div>
        
        {/* Navigation Bar - Elevated */}
        <nav className="relative z-20 flex justify-between items-center px-6 sm:px-8 md:px-16 lg:px-24 py-6 md:py-8">
          {/* Logo with subtle animation hint */}
          <div className="relative group">
            <img 
              src="https://i.postimg.cc/L88db1fc/White-transperent-logo.png" 
              alt="SELFIE AI™" 
              className="h-8 md:h-10 w-auto opacity-95 hover:opacity-100 transition-all duration-500"
            />
            <div className="absolute -bottom-1 left-0 w-full h-px bg-white/40 scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left"></div>
          </div>
          
          {/* Navigation with refined spacing */}
          <div className="hidden md:flex items-center">
            <div className="flex gap-10 lg:gap-16 items-center mr-10 lg:mr-16">
              <Link href="/pricing" className="group relative font-['Neue_Einstellung'] text-[10px] lg:text-[11px] uppercase tracking-[0.2em] text-white/80 hover:text-white transition-all duration-300">
                About
                <span className="absolute -bottom-2 left-0 w-full h-px bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></span>
              </Link>
              <Link href="/studio" className="group relative font-['Neue_Einstellung'] text-[10px] lg:text-[11px] uppercase tracking-[0.2em] text-white/80 hover:text-white transition-all duration-300">
                Tools
                <span className="absolute -bottom-2 left-0 w-full h-px bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></span>
              </Link>
              <Link href="/dashboard" className="group relative font-['Neue_Einstellung'] text-[10px] lg:text-[11px] uppercase tracking-[0.2em] text-white/80 hover:text-white transition-all duration-300">
                Stories
                <span className="absolute -bottom-2 left-0 w-full h-px bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></span>
              </Link>
            </div>
            
            {/* Elevated CTA */}
            <Link href="/dashboard">
              <button className="group relative overflow-hidden">
                <div className="relative bg-white/5 backdrop-blur-sm border border-white/30 px-8 lg:px-10 py-2.5 lg:py-3 transition-all duration-500 group-hover:bg-white group-hover:border-white">
                  <span className="font-['Neue_Einstellung'] text-[10px] lg:text-[11px] uppercase tracking-[0.3em] text-white group-hover:text-[#171719] transition-colors duration-500">
                    Begin
                  </span>
                </div>
                {/* Subtle shine effect on hover */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
              </button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden relative w-6 h-6 flex flex-col justify-center gap-1.5">
            <span className="w-full h-px bg-white/80"></span>
            <span className="w-4 h-px bg-white/80 ml-auto"></span>
          </button>
        </nav>
        
        {/* Hero Content - Ultra Editorial Layout */}
        <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-96px)] md:min-h-[calc(100vh-120px)] px-6 sm:px-8 md:px-16 lg:px-24">
          <div className="max-w-7xl w-full">
            {/* Small accent text */}
            <div className="mb-6 md:mb-8 lg:mb-12 opacity-0 animate-fadeInUp">
              <p className="font-['Neue_Einstellung'] text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-white/60 lg:text-white/70">
                The Luxury Personal Brand Platform
              </p>
            </div>
            
            {/* Editorial Headline with refined spacing */}
            <h1 className="relative">
              <span className="block font-['Bordoni_FLF'] text-[48px] sm:text-[64px] md:text-[80px] lg:text-[112px] xl:text-[144px] leading-[0.85] text-white opacity-0 animate-fadeInUp animation-delay-200">
                Your selfie
              </span>
              <span className="block font-['Bordoni_FLF'] italic font-light text-[48px] sm:text-[64px] md:text-[80px] lg:text-[112px] xl:text-[144px] leading-[0.85] text-white ml-8 sm:ml-16 md:ml-24 lg:ml-32 opacity-0 animate-fadeInUp animation-delay-400">
                is your
              </span>
              <span className="block font-['Bordoni_FLF'] text-[48px] sm:text-[64px] md:text-[80px] lg:text-[112px] xl:text-[144px] leading-[0.85] text-white text-right mr-0 sm:mr-8 md:mr-16 lg:mr-32 opacity-0 animate-fadeInUp animation-delay-600">
                brand.
              </span>
              
              {/* Decorative elements */}
              <div className="absolute -right-4 lg:right-8 top-1/2 transform -translate-y-1/2 w-px h-20 md:h-32 bg-white/20 lg:bg-white/30 hidden sm:block"></div>
              <div className="absolute -left-4 bottom-0 w-20 lg:w-32 h-px bg-white/20 lg:bg-white/30 hidden sm:block"></div>
            </h1>
            
            {/* Subheadline with elegant positioning */}
            <div className="mt-12 sm:mt-16 md:mt-20 max-w-full md:max-w-3xl mx-auto md:mx-0 md:ml-auto md:mr-8 lg:mr-32 opacity-0 animate-fadeInUp animation-delay-800">
              <p className="font-['Neue_Einstellung'] text-[15px] sm:text-[18px] md:text-[20px] lg:text-[24px] leading-[1.5] md:leading-[1.6] text-white/80 lg:text-white/90 tracking-[0.02em]">
                You don't need to do more.<br className="hidden sm:block"/>
                You just need to show up with strategy.
              </p>
            </div>
            
            {/* CTAs - Ultra Refined */}
            <div className="mt-16 sm:mt-20 md:mt-24 flex flex-col sm:flex-row gap-6 md:gap-8 lg:gap-12 justify-center sm:justify-start md:justify-end md:mr-8 lg:mr-32 opacity-0 animate-fadeInUp animation-delay-1000">
              {/* Primary CTA - Editorial treatment */}
              <Link href="/dashboard">
                <button className="group relative w-full sm:w-auto">
                  <div className="bg-transparent border border-white/80 lg:border-white text-white px-10 sm:px-12 py-4 md:py-5 overflow-hidden relative transition-all duration-500 hover:bg-white hover:text-[#171719]">
                    <span className="relative z-10 font-['Neue_Einstellung'] text-[10px] lg:text-[11px] uppercase tracking-[0.25em] lg:tracking-[0.3em]">
                      Start Your Journey
                    </span>
                    {/* Magnetic effect on hover */}
                    <div className="absolute inset-0 bg-white transform scale-0 group-hover:scale-100 transition-transform duration-500 origin-center"></div>
                  </div>
                  {/* Glow effect */}
                  <div className="absolute -inset-px bg-white/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                </button>
              </Link>
              
              {/* Secondary CTA - Minimal */}
              <button className="group relative self-center">
                <span className="font-['Neue_Einstellung'] text-[10px] lg:text-[11px] uppercase tracking-[0.25em] lg:tracking-[0.3em] text-white/70 lg:text-white/80 group-hover:text-white transition-all duration-300">
                  Watch Story
                </span>
                <div className="mt-1.5 lg:mt-2 w-full h-px bg-white/30 lg:bg-white/40 transform origin-left group-hover:scale-x-110 group-hover:bg-white/60 transition-all duration-500"></div>
              </button>
            </div>
          </div>
        </div>
        
        {/* Sophisticated scroll indicator */}
        <div className="absolute bottom-8 md:bottom-12 left-1/2 transform -translate-x-1/2 opacity-0 animate-fadeIn animation-delay-1200">
          <div className="flex flex-col items-center gap-2">
            <p className="font-['Neue_Einstellung'] text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-white/50 lg:text-white/60">Scroll</p>
            <div className="w-px h-8 md:h-12 bg-gradient-to-b from-white/50 lg:from-white/60 to-transparent animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Section Transition - Luxury Detail */}
      <div className="relative h-px bg-gradient-to-r from-transparent via-[#171719]/20 to-transparent">
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-1.5 md:w-2 h-1.5 md:h-2 bg-[#171719]/20 rotate-45 animate-spin-slow"></div>
        </div>
      </div>

      {/* STATS SECTION - Ultra Refined Luxury Layout */}
      <section className="relative bg-white py-16 sm:py-20 md:py-28 overflow-hidden">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-[0.015] md:opacity-[0.02]" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #171719 0, #171719 1px, transparent 1px, transparent 15px)' }}></div>
        
        <div className="relative max-w-[1400px] mx-auto px-6 sm:px-8 md:px-16 lg:px-24">
          {/* Section identifier */}
          <div className="absolute -top-3 md:-top-4 left-6 sm:left-8 lg:left-24 font-['Neue_Einstellung'] text-[9px] md:text-[10px] uppercase tracking-[0.25em] lg:tracking-[0.3em] text-[#B5B5B3]">
            01 — Proof
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 lg:gap-20 items-center">
            
            {/* Stats Content - Ultra Elegant */}
            <div className="lg:col-span-8 order-2 lg:order-1">
              {/* Refined Stats with custom styling */}
              <div className="flex flex-wrap items-center gap-6 sm:gap-8 md:gap-16 mb-12 md:mb-16 justify-center lg:justify-start">
                {/* 120K */}
                <div className="relative group">
                  <div className="text-center lg:text-left transform transition-all duration-700 hover:translate-y-[-2px]">
                    <span className="relative font-['Lingerie_Typeface'] text-[48px] sm:text-[56px] md:text-[72px] leading-none text-[#171719]">
                      120K
                      {/* Subtle underline accent */}
                      <div className="absolute -bottom-1.5 md:-bottom-2 left-0 right-0 h-px bg-[#171719]/10 transition-all duration-500 group-hover:bg-[#171719]/30"></div>
                    </span>
                    <p className="font-['Neue_Einstellung'] text-[9px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.25em] text-[#4C4B4B] mt-3 md:mt-4">
                      Followers Built
                    </p>
                  </div>
                </div>
                
                {/* Elegant separator */}
                <div className="hidden sm:block">
                  <div className="w-6 md:w-8 h-px bg-[#B5B5B3]/30"></div>
                </div>
                
                {/* 1.7M */}
                <div className="relative group">
                  <div className="text-center lg:text-left transform transition-all duration-700 hover:translate-y-[-2px]">
                    <span className="relative font-['Lingerie_Typeface'] text-[48px] sm:text-[56px] md:text-[72px] leading-none text-[#171719]">
                      1.7M
                      <div className="absolute -bottom-1.5 md:-bottom-2 left-0 right-0 h-px bg-[#171719]/10 transition-all duration-500 group-hover:bg-[#171719]/30"></div>
                    </span>
                    <p className="font-['Neue_Einstellung'] text-[9px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.25em] text-[#4C4B4B] mt-3 md:mt-4">
                      Monthly Reach
                    </p>
                  </div>
                </div>
                
                {/* Elegant separator */}
                <div className="hidden sm:block">
                  <div className="w-6 md:w-8 h-px bg-[#B5B5B3]/30"></div>
                </div>
                
                {/* 90 */}
                <div className="relative group">
                  <div className="text-center lg:text-left transform transition-all duration-700 hover:translate-y-[-2px]">
                    <span className="relative font-['Lingerie_Typeface'] text-[48px] sm:text-[56px] md:text-[72px] leading-none text-[#171719]">
                      90
                      <div className="absolute -bottom-1.5 md:-bottom-2 left-0 right-0 h-px bg-[#171719]/10 transition-all duration-500 group-hover:bg-[#171719]/30"></div>
                    </span>
                    <p className="font-['Neue_Einstellung'] text-[9px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.25em] text-[#4C4B4B] mt-3 md:mt-4">
                      Days to Transform
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Quote with sophisticated treatment */}
              <div className="max-w-2xl mx-auto lg:mx-0">
                <div className="relative">
                  {/* Large decorative quote */}
                  <span className="absolute -top-6 md:-top-8 -left-4 md:-left-6 font-['Bordoni_FLF'] text-[60px] md:text-[80px] text-[#171719]/5 leading-none select-none transition-all duration-1000 hover:text-[#171719]/10">"</span>
                  
                  <p className="relative font-['Bordoni_FLF'] italic text-[20px] sm:text-[24px] md:text-[32px] leading-[1.2] md:leading-[1.3] text-[#171719] mb-8 md:mb-12 text-center lg:text-left tracking-[0.02em]">
                    This isn't hype. It's what's possible.
                  </p>
                </div>
                
                {/* Signature with refined styling */}
                <div className="text-center lg:text-left">
                  <div className="inline-block relative">
                    <p className="font-['Bordoni_FLF'] text-[16px] md:text-[18px] text-[#171719] mb-1">
                      — Sandra Sigurjonsdottir
                    </p>
                    <p className="font-['Neue_Einstellung'] text-[9px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.25em] text-[#4C4B4B]">
                      Founder & Creator
                    </p>
                    {/* Elegant underline */}
                    <div className="absolute -bottom-3 md:-bottom-4 left-0 w-12 md:w-16 h-px bg-[#171719]/20"></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Founder Image - Ultra Editorial */}
            <div className="lg:col-span-4 order-1 lg:order-2">
              <div className="relative max-w-[280px] sm:max-w-[320px] mx-auto">
                {/* Main image with artistic treatment */}
                <div className="relative overflow-hidden group">
                  <img 
                    src="https://i.postimg.cc/YC0mdvs0/IMG-3198.jpg" 
                    alt="Sandra Sigurjonsdottir" 
                    className="w-full h-[350px] sm:h-[400px] object-cover object-center filter contrast-110 transition-all duration-700 group-hover:contrast-125 group-hover:scale-[1.02]"
                  />
                  {/* Gradient overlay for editorial effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Hover reveal text */}
                  <div className="absolute bottom-6 md:bottom-8 left-6 md:left-8 right-6 md:right-8 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                    <p className="font-['Neue_Einstellung'] text-[9px] md:text-[10px] uppercase tracking-[0.25em] md:tracking-[0.3em] text-[#171719]/80 bg-white/90 backdrop-blur-sm px-3 md:px-4 py-1.5 md:py-2 text-center">
                      Founder Story
                    </p>
                  </div>
                </div>
                
                {/* Sophisticated frame elements */}
                <div className="absolute -top-3 md:-top-4 -left-3 md:-left-4 w-16 md:w-24 h-16 md:h-24 border-t border-l border-[#171719]/10"></div>
                <div className="absolute -bottom-3 md:-bottom-4 -right-3 md:-right-4 w-16 md:w-24 h-16 md:h-24 border-b border-r border-[#171719]/10"></div>
                
                {/* Caption */}
                <p className="mt-4 md:mt-6 font-['Neue_Einstellung'] text-[9px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.25em] text-[#4C4B4B] text-center">
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