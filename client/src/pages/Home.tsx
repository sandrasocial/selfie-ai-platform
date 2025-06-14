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
          <div className="absolute -top-4 left-24 font-['Neue_Einstellung'] text-[10px] uppercase tracking-[0.3em] text-[#B5B5B3]">
            01 — Proof
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
            
            {/* Stats Content - Ultra Elegant */}
            <div className="lg:col-span-8 order-2 lg:order-1">
              {/* Refined Stats with custom styling */}
              <div className="flex flex-wrap items-center gap-8 md:gap-16 mb-16 justify-center lg:justify-start">
                {/* 120K */}
                <div className="relative group">
                  <div className="text-center lg:text-left transform transition-all duration-700 hover:translate-y-[-2px]">
                    <span className="relative font-['Lingerie_Typeface'] text-[56px] md:text-[72px] leading-none text-[#171719]">
                      120K
                      {/* Subtle underline accent */}
                      <div className="absolute -bottom-2 left-0 right-0 h-px bg-[#171719]/10 transition-all duration-500 group-hover:bg-[#171719]/30"></div>
                    </span>
                    <p className="font-['Neue_Einstellung'] text-[10px] uppercase tracking-[0.25em] text-[#4C4B4B] mt-4">
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
                    <span className="relative font-['Lingerie_Typeface'] text-[56px] md:text-[72px] leading-none text-[#171719]">
                      1.7M
                      <div className="absolute -bottom-2 left-0 right-0 h-px bg-[#171719]/10 transition-all duration-500 group-hover:bg-[#171719]/30"></div>
                    </span>
                    <p className="font-['Neue_Einstellung'] text-[10px] uppercase tracking-[0.25em] text-[#4C4B4B] mt-4">
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
                    <span className="relative font-['Lingerie_Typeface'] text-[56px] md:text-[72px] leading-none text-[#171719]">
                      90
                      <div className="absolute -bottom-2 left-0 right-0 h-px bg-[#171719]/10 transition-all duration-500 group-hover:bg-[#171719]/30"></div>
                    </span>
                    <p className="font-['Neue_Einstellung'] text-[10px] uppercase tracking-[0.25em] text-[#4C4B4B] mt-4">
                      Days to Transform
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Quote with sophisticated treatment */}
              <div className="max-w-2xl mx-auto lg:mx-0">
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

      {/* About Section */}
      <section className="relative bg-[#FAFAF8] py-20 md:py-28 lg:py-36 overflow-hidden">
        {/* Section identifier */}
        <div className="absolute top-8 left-8 md:left-24 font-['Neue_Einstellung'] text-[10px] uppercase tracking-[0.3em] text-[#B5B5B3]">
          02 — Story
        </div>
        
        <div className="relative max-w-[1400px] mx-auto px-8 md:px-16 lg:px-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
            {/* Large Typography */}
            <div className="lg:col-span-2 order-1">
              <div className="font-['Lingerie_Typeface'] text-[120px] md:text-[200px] lg:text-[280px] leading-[0.8] text-[#171719]/5 select-none">
                02
              </div>
            </div>
            
            {/* Story Content */}
            <div className="lg:col-span-7 order-3 lg:order-2">
              <div className="space-y-8 md:space-y-12">
                <h2 className="font-['Bordoni_FLF'] text-[32px] md:text-[48px] lg:text-[56px] leading-[1.1] text-[#171719] tracking-[-0.01em]">
                  "I needed a way to show up."
                </h2>
                
                <div className="space-y-6 md:space-y-8 max-w-2xl">
                  <p className="font-['Neue_Einstellung'] text-[16px] md:text-[18px] leading-[1.6] text-[#171719]/80 tracking-[0.01em]">
                    I created this because I was done second-guessing myself online.
                  </p>
                  <p className="font-['Neue_Einstellung'] text-[16px] md:text-[18px] leading-[1.6] text-[#171719]/80 tracking-[0.01em]">
                    I wanted to post with confidence. To feel proud of what I was building.
                  </p>
                  <p className="font-['Neue_Einstellung'] text-[16px] md:text-[18px] leading-[1.6] text-[#171719]/80 tracking-[0.01em]">
                    After my divorce, I had nothing but my iPhone, a vision, and the nerve to start showing up anyway.
                  </p>
                  <p className="font-['Neue_Einstellung'] text-[16px] md:text-[18px] leading-[1.6] text-[#171719]/80 tracking-[0.01em]">
                    SELFIE AI™ is the exact system I wish I had back then.
                  </p>
                </div>
                
                <p className="font-['Bordoni_FLF'] italic text-[20px] md:text-[24px] leading-[1.3] text-[#171719] tracking-[0.02em] pt-4">
                  Let's do this together, shall we…
                </p>
                
                {/* Signature */}
                <div className="pt-8">
                  <img 
                    src="https://i.postimg.cc/NMsTRh2K/Sandra-Signature-homepage.png" 
                    alt="Sandra's Signature" 
                    className="h-12 md:h-16 opacity-70 hover:opacity-90 transition-opacity duration-300" 
                  />
                </div>
              </div>
            </div>
            
            {/* Image */}
            <div className="lg:col-span-3 order-2 lg:order-3">
              <div className="relative max-w-[280px] mx-auto">
                <div className="relative overflow-hidden group">
                  <img 
                    src="https://i.postimg.cc/0jv5My39/final-Quote-Image-1.png" 
                    alt="Sandra Quote" 
                    className="w-full h-[320px] md:h-[400px] object-cover filter contrast-110 transition-all duration-700 group-hover:contrast-125 group-hover:scale-[1.02]" 
                  />
                  {/* Subtle frame */}
                  <div className="absolute inset-0 border border-[#171719]/5"></div>
                </div>
                {/* Caption */}
                <p className="mt-4 font-['Neue_Einstellung'] text-[10px] uppercase tracking-[0.25em] text-[#4C4B4B] text-center">
                  The Beginning
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Audience Archetypes */}
      <section className="relative bg-white py-20 md:py-28 lg:py-36 overflow-hidden">
        {/* Section identifier */}
        <div className="absolute top-8 left-8 md:left-24 font-['Neue_Einstellung'] text-[10px] uppercase tracking-[0.3em] text-[#B5B5B3]">
          03 — Archetypes
        </div>
        
        <div className="relative max-w-[1400px] mx-auto px-8 md:px-16 lg:px-24">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-baseline gap-8 md:gap-12 mb-16 md:mb-24">
            <div className="font-['Lingerie_Typeface'] text-[80px] md:text-[120px] lg:text-[160px] leading-[0.8] text-[#171719]/5 select-none">
              03
            </div>
            <div className="flex-1">
              <h2 className="font-['Bordoni_FLF'] text-[32px] md:text-[48px] lg:text-[56px] leading-[1.1] text-[#171719] tracking-[-0.01em]">
                Who It's For
              </h2>
              <div className="w-16 md:w-24 h-px bg-[#171719]/20 mt-4"></div>
            </div>
          </div>
          
          {/* Archetype Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* The Coach */}
            <div className="group relative bg-white border border-[#171719]/5 overflow-hidden transition-all duration-700 hover:border-[#171719]/20 hover:shadow-lg">
              <div className="relative overflow-hidden">
                <img 
                  src="https://i.postimg.cc/sgxn9PZX/141.png" 
                  alt="The Coach" 
                  className="w-full h-[280px] md:h-[320px] object-cover filter contrast-110 transition-all duration-700 group-hover:contrast-125 group-hover:scale-[1.02]" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#171719]/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              </div>
              
              <div className="p-8 md:p-10">
                <div className="font-['Neue_Einstellung'] text-[10px] uppercase tracking-[0.25em] text-[#4C4B4B] mb-4">
                  The Coach
                </div>
                
                <h3 className="font-['Bordoni_FLF'] text-[24px] md:text-[28px] leading-[1.2] text-[#171719] mb-4 tracking-[-0.01em]">
                  You know your stuff
                </h3>
                
                <p className="font-['Neue_Einstellung'] text-[14px] md:text-[16px] leading-[1.6] text-[#171719]/70 tracking-[0.01em]">
                  Let's make sure your brand shows it.
                </p>
              </div>
            </div>
            
            {/* The Creator */}
            <div className="group relative bg-white border border-[#171719]/5 overflow-hidden transition-all duration-700 hover:border-[#171719]/20 hover:shadow-lg">
              <div className="relative overflow-hidden">
                <img 
                  src="https://i.postimg.cc/YqQMgyPp/106.png" 
                  alt="The Creator" 
                  className="w-full h-[280px] md:h-[320px] object-cover filter contrast-110 transition-all duration-700 group-hover:contrast-125 group-hover:scale-[1.02]" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#171719]/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              </div>
              
              <div className="p-8 md:p-10">
                <div className="font-['Neue_Einstellung'] text-[10px] uppercase tracking-[0.25em] text-[#4C4B4B] mb-4">
                  The Creator
                </div>
                
                <h3 className="font-['Bordoni_FLF'] text-[24px] md:text-[28px] leading-[1.2] text-[#171719] mb-4 tracking-[-0.01em]">
                  You've got taste, ideas, and a phone full of content
                </h3>
                
                <p className="font-['Neue_Einstellung'] text-[14px] md:text-[16px] leading-[1.6] text-[#171719]/70 tracking-[0.01em]">
                  Let's turn it into gold.
                </p>
              </div>
            </div>
            
            {/* The CEO */}
            <div className="group relative bg-white border border-[#171719]/5 overflow-hidden transition-all duration-700 hover:border-[#171719]/20 hover:shadow-lg">
              <div className="relative overflow-hidden">
                <img 
                  src="https://i.postimg.cc/Bng37Psk/107.png" 
                  alt="The CEO" 
                  className="w-full h-[280px] md:h-[320px] object-cover filter contrast-110 transition-all duration-700 group-hover:contrast-125 group-hover:scale-[1.02]" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#171719]/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              </div>
              
              <div className="p-8 md:p-10">
                <div className="font-['Neue_Einstellung'] text-[10px] uppercase tracking-[0.25em] text-[#4C4B4B] mb-4">
                  The CEO
                </div>
                
                <h3 className="font-['Bordoni_FLF'] text-[24px] md:text-[28px] leading-[1.2] text-[#171719] mb-4 tracking-[-0.01em]">
                  You're running the show
                </h3>
                
                <p className="font-['Neue_Einstellung'] text-[14px] md:text-[16px] leading-[1.6] text-[#171719]/70 tracking-[0.01em]">
                  I'll help you make it look effortless.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Ladder Section */}
      <section className="relative bg-black py-20 md:py-28 lg:py-36 overflow-hidden">
        {/* Section identifier */}
        <div className="absolute top-8 left-8 md:left-24 font-['Neue_Einstellung'] text-[10px] uppercase tracking-[0.3em] text-[#B5B5B3]">
          04 — Journey
        </div>
        
        {/* Background Design Element */}
        <div className="absolute top-0 right-0 font-['Lingerie_Typeface'] text-[400px] md:text-[600px] lg:text-[800px] leading-[0.8] select-none" style={{color: '#f5f5f5', opacity: 0.05}}>
          04
        </div>
        
        <div className="relative max-w-[1400px] mx-auto px-8 md:px-16 lg:px-24">
          {/* Section Header */}
          <div className="text-center mb-20 md:mb-28">
            <h2 className="font-['Bordoni_FLF'] text-[32px] md:text-[48px] lg:text-[56px] leading-[1.1] text-white mb-6 md:mb-8 tracking-[-0.01em]">
              Your Journey Starts Here
            </h2>
            <p className="font-['Neue_Einstellung'] text-[16px] md:text-[18px] leading-[1.6] text-white/70 max-w-2xl mx-auto tracking-[0.01em]">
              Choose your path. Each step builds on the last, creating your complete transformation.
            </p>
          </div>
          
          {/* Journey Path - Responsive Grid */}
          <div className="space-y-16 md:space-y-24">
            {/* Step 1: Free Guide */}
            <div className="relative group">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                <div className="lg:col-span-6 order-2 lg:order-1">
                  <div className="space-y-6">
                    <div className="font-['Lingerie_Typeface'] text-[60px] md:text-[80px] leading-[0.8] text-white/10 select-none">
                      01
                    </div>
                    <h3 className="font-['Bordoni_FLF'] text-[24px] md:text-[32px] lg:text-[36px] text-white leading-[1.1] tracking-[-0.01em] -mt-12 md:-mt-16">
                      Free Selfie Guide
                    </h3>
                    <p className="font-['Neue_Einstellung'] text-[16px] md:text-[18px] leading-[1.6] text-white/70 tracking-[0.01em] max-w-xl">
                      5 poses that work every time. The lighting secrets I use. Your first step to confidence.
                    </p>
                    <div className="font-['Neue_Einstellung'] text-[11px] uppercase tracking-[0.25em] text-white/50 pt-2">
                      Start Here • Free
                    </div>
                  </div>
                </div>
                
                <div className="lg:col-span-6 order-1 lg:order-2">
                  <div className="relative max-w-sm mx-auto">
                    <div className="aspect-square bg-white/5 border border-white/10 p-8 transition-all duration-700 group-hover:border-white/20 group-hover:bg-white/10">
                      <div className="h-full flex items-center justify-center">
                        <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Step 2: Starter Kit */}
            <div className="relative group">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                <div className="lg:col-span-6 order-1">
                  <div className="relative max-w-sm mx-auto">
                    <div className="aspect-square bg-white/5 border border-white/10 p-8 transition-all duration-700 group-hover:border-white/20 group-hover:bg-white/10">
                      <div className="h-full flex items-center justify-center">
                        <div className="w-3 h-3 bg-white/50 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="lg:col-span-6 order-2">
                  <div className="space-y-6">
                    <div className="font-['Lingerie_Typeface'] text-[60px] md:text-[80px] leading-[0.8] text-white/10 select-none">
                      02
                    </div>
                    <h3 className="font-['Bordoni_FLF'] text-[24px] md:text-[32px] lg:text-[36px] text-white leading-[1.1] tracking-[-0.01em] -mt-12 md:-mt-16">
                      Selfie Starter Kit
                    </h3>
                    <p className="font-['Neue_Einstellung'] text-[16px] md:text-[18px] leading-[1.6] text-white/70 tracking-[0.01em] max-w-xl">
                      30 days of prompts. Caption templates that convert. Your personal brand foundation.
                    </p>
                    <div className="font-['Neue_Einstellung'] text-[11px] uppercase tracking-[0.25em] text-white/50 pt-2">
                      Essentials • $67
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Step 3: Branded */}
            <div className="relative group">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                <div className="lg:col-span-6 order-2 lg:order-1">
                  <div className="space-y-6">
                    <div className="font-['Lingerie_Typeface'] text-[60px] md:text-[80px] leading-[0.8] text-white/10 select-none">
                      03
                    </div>
                    <h3 className="font-['Bordoni_FLF'] text-[24px] md:text-[32px] lg:text-[36px] text-white leading-[1.1] tracking-[-0.01em] -mt-12 md:-mt-16">
                      Branded By Selfie
                    </h3>
                    <p className="font-['Neue_Einstellung'] text-[16px] md:text-[18px] leading-[1.6] text-white/70 tracking-[0.01em] max-w-xl">
                      Complete transformation system. AI tools, pose library, weekly coaching. Everything you need.
                    </p>
                    <div className="font-['Neue_Einstellung'] text-[11px] uppercase tracking-[0.25em] text-white/50 pt-2">
                      Full Program • $397
                    </div>
                  </div>
                </div>
                
                <div className="lg:col-span-6 order-1 lg:order-2">
                  <div className="relative max-w-sm mx-auto">
                    <div className="aspect-square bg-white/5 border border-white/10 p-8 transition-all duration-700 group-hover:border-white/20 group-hover:bg-white/10">
                      <div className="h-full flex items-center justify-center">
                        <div className="w-3 h-3 bg-white/50 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Step 4: VIP */}
            <div className="relative group">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                <div className="lg:col-span-6 order-1">
                  <div className="relative max-w-sm mx-auto">
                    <div className="aspect-square bg-white/10 border border-white/20 p-8 transition-all duration-700 group-hover:border-white/30 group-hover:bg-white/15">
                      <div className="h-full flex items-center justify-center">
                        <div className="w-4 h-4 bg-white rounded-full relative">
                          <div className="absolute inset-0 bg-white/30 rounded-full scale-150 animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="lg:col-span-6 order-2">
                  <div className="space-y-6">
                    <div className="font-['Lingerie_Typeface'] text-[60px] md:text-[80px] leading-[0.8] text-white/10 select-none">
                      04
                    </div>
                    <h3 className="font-['Bordoni_FLF'] text-[24px] md:text-[32px] lg:text-[36px] text-white leading-[1.1] tracking-[-0.01em] -mt-12 md:-mt-16">
                      VIP Brand Builder
                    </h3>
                    <p className="font-['Neue_Einstellung'] text-[16px] md:text-[18px] leading-[1.6] text-white/70 tracking-[0.01em] max-w-xl">
                      Private mentorship. Custom strategy. Direct access to Sandra. For serious transformations only.
                    </p>
                    <div className="font-['Neue_Einstellung'] text-[11px] uppercase tracking-[0.25em] text-white/50 pt-2">
                      Application Only • Premium
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* CTA */}
          <div className="text-center mt-20 md:mt-28">
            <Link href="/dashboard">
              <button className="group relative overflow-hidden bg-white text-black px-12 md:px-16 py-4 md:py-6 transition-all duration-300 hover:shadow-xl">
                <span className="relative z-10 font-['Neue_Einstellung'] text-[11px] uppercase tracking-[0.3em]">
                  Start Your Journey
                </span>
                <div className="absolute inset-0 bg-black transform translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                <span className="absolute inset-0 flex items-center justify-center font-['Neue_Einstellung'] text-[11px] uppercase tracking-[0.3em] text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                  Start Your Journey
                </span>
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Carousel */}
      <section className="relative bg-black py-20 md:py-28 lg:py-36 overflow-hidden">
        {/* Section identifier */}
        <div className="absolute top-8 left-8 md:left-24 font-['Neue_Einstellung'] text-[10px] uppercase tracking-[0.3em] text-[#B5B5B3]">
          05 — Tools
        </div>
        
        <div className="relative max-w-[1400px] mx-auto px-8 md:px-16 lg:px-24">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-baseline gap-8 md:gap-12 mb-16 md:mb-24">
            <div className="font-['Lingerie_Typeface'] text-[80px] md:text-[120px] lg:text-[160px] leading-[0.8] text-white/5 select-none">
              05
            </div>
            <div className="flex-1">
              <h2 className="font-['Bordoni_FLF'] text-[32px] md:text-[48px] lg:text-[56px] leading-[1.1] text-white tracking-[-0.01em]">
                AI Tools
              </h2>
              <div className="w-16 md:w-24 h-px bg-white/20 mt-4"></div>
            </div>
          </div>
          
          {/* Tools Grid - Responsive */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 md:gap-8">
            {/* AI Studio */}
            <div className="group relative bg-white/5 backdrop-blur border border-white/10 p-8 md:p-10 transition-all duration-700 hover:bg-white/10 hover:border-white/20">
              <div className="font-['Lingerie_Typeface'] text-[60px] md:text-[70px] leading-[0.8] mb-6 text-white/10 select-none">
                01
              </div>
              
              <h3 className="font-['Bordoni_FLF'] text-[24px] md:text-[28px] text-white mb-4 leading-[1.2] tracking-[-0.01em] -mt-12 md:-mt-14">
                AI Studio
              </h3>
              
              <p className="font-['Neue_Einstellung'] text-[14px] md:text-[16px] leading-[1.6] text-white/70 tracking-[0.01em]">
                Make content that looks like you, but better.
              </p>
            </div>
            
            {/* Template Library */}
            <div className="group relative bg-white/5 backdrop-blur border border-white/10 p-8 md:p-10 transition-all duration-700 hover:bg-white/10 hover:border-white/20">
              <div className="font-['Lingerie_Typeface'] text-[60px] md:text-[70px] leading-[0.8] mb-6 text-white/10 select-none">
                02
              </div>
              
              <h3 className="font-['Bordoni_FLF'] text-[24px] md:text-[28px] text-white mb-4 leading-[1.2] tracking-[-0.01em] -mt-12 md:-mt-14">
                Template Library
              </h3>
              
              <p className="font-['Neue_Einstellung'] text-[14px] md:text-[16px] leading-[1.6] text-white/70 tracking-[0.01em]">
                Beautiful design, done-for-you. No stress, no guesswork.
              </p>
            </div>
            
            {/* Sandra AI Chat */}
            <div className="group relative bg-white/5 backdrop-blur border border-white/10 p-8 md:p-10 transition-all duration-700 hover:bg-white/10 hover:border-white/20">
              <div className="font-['Lingerie_Typeface'] text-[60px] md:text-[70px] leading-[0.8] mb-6 text-white/10 select-none">
                03
              </div>
              
              <h3 className="font-['Bordoni_FLF'] text-[24px] md:text-[28px] text-white mb-4 leading-[1.2] tracking-[-0.01em] -mt-12 md:-mt-14">
                Sandra AI Chat
              </h3>
              
              <p className="font-['Neue_Einstellung'] text-[14px] md:text-[16px] leading-[1.6] text-white/70 tracking-[0.01em]">
                Ask me anything. I'll help you show up like you mean it.
              </p>
            </div>
            
            {/* Workbooks */}
            <div className="group relative bg-white/5 backdrop-blur border border-white/10 p-8 md:p-10 transition-all duration-700 hover:bg-white/10 hover:border-white/20">
              <div className="font-['Lingerie_Typeface'] text-[60px] md:text-[70px] leading-[0.8] mb-6 text-white/10 select-none">
                04
              </div>
              
              <h3 className="font-['Bordoni_FLF'] text-[24px] md:text-[28px] text-white mb-4 leading-[1.2] tracking-[-0.01em] -mt-12 md:-mt-14">
                Workbooks
              </h3>
              
              <p className="font-['Neue_Einstellung'] text-[14px] md:text-[16px] leading-[1.6] text-white/70 tracking-[0.01em]">
                Structure, clarity, and space to build your brand with intention.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What's Inside Modules */}
      <section className="relative bg-white py-20 md:py-28 lg:py-36 overflow-hidden">
        {/* Section identifier */}
        <div className="absolute top-8 left-8 md:left-24 font-['Neue_Einstellung'] text-[10px] uppercase tracking-[0.3em] text-[#B5B5B3]">
          06 — Modules
        </div>
        
        <div className="relative max-w-[1400px] mx-auto px-8 md:px-16 lg:px-24">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-baseline gap-8 md:gap-12 mb-16 md:mb-24">
            <div className="font-['Lingerie_Typeface'] text-[80px] md:text-[120px] lg:text-[160px] leading-[0.8] text-[#171719]/5 select-none">
              06
            </div>
            <div className="flex-1">
              <h2 className="font-['Bordoni_FLF'] text-[32px] md:text-[48px] lg:text-[56px] leading-[1.1] text-[#171719] tracking-[-0.01em]">
                What's Inside
              </h2>
              <div className="w-16 md:w-24 h-px bg-[#171719]/20 mt-4"></div>
            </div>
          </div>
          
          {/* Module Grid */}
          <div className="space-y-4 md:space-y-6">
            {/* Module 1 */}
            <div className="group relative bg-[#FAFAF8] border border-[#171719]/5 p-8 md:p-12 lg:p-16 transition-all duration-700 hover:bg-[#171719] hover:text-white hover:border-[#171719]">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 lg:gap-8">
                <div className="flex-1">
                  <div className="font-['Neue_Einstellung'] text-[10px] uppercase tracking-[0.25em] text-[#4C4B4B] group-hover:text-white/60 mb-4">
                    Foundation — Week 1-3
                  </div>
                  
                  <h3 className="font-['Bordoni_FLF'] text-[28px] md:text-[36px] lg:text-[42px] leading-[1.2] text-[#171719] group-hover:text-white mb-4 tracking-[-0.01em]">
                    Brand Starter Kit
                  </h3>
                  
                  <p className="font-['Neue_Einstellung'] text-[16px] md:text-[18px] leading-[1.6] text-[#171719]/70 group-hover:text-white/80 max-w-2xl tracking-[0.01em]">
                    Find your look. Your voice. Your rhythm.
                  </p>
                </div>
                
                <div className="font-['Lingerie_Typeface'] text-[60px] md:text-[80px] lg:text-[100px] leading-[0.8] text-[#171719]/5 group-hover:text-white/10 select-none">
                  01
                </div>
              </div>
            </div>
            
            {/* Module 2 */}
            <div className="group relative bg-[#FAFAF8] border border-[#171719]/5 p-8 md:p-12 lg:p-16 transition-all duration-700 hover:bg-[#171719] hover:text-white hover:border-[#171719]">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 lg:gap-8">
                <div className="flex-1">
                  <div className="font-['Neue_Einstellung'] text-[10px] uppercase tracking-[0.25em] text-[#4C4B4B] group-hover:text-white/60 mb-4">
                    Creation — Week 4-6
                  </div>
                  
                  <h3 className="font-['Bordoni_FLF'] text-[28px] md:text-[36px] lg:text-[42px] leading-[1.2] text-[#171719] group-hover:text-white mb-4 tracking-[-0.01em]">
                    30-Day Visibility Sprint
                  </h3>
                  
                  <p className="font-['Neue_Einstellung'] text-[16px] md:text-[18px] leading-[1.6] text-[#171719]/70 group-hover:text-white/80 max-w-2xl tracking-[0.01em]">
                    One month of structure so you can stop stalling and start posting.
                  </p>
                </div>
                
                <div className="font-['Lingerie_Typeface'] text-[60px] md:text-[80px] lg:text-[100px] leading-[0.8] text-[#171719]/5 group-hover:text-white/10 select-none">
                  02
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="relative bg-white py-20 md:py-28 lg:py-36 overflow-hidden">
        {/* Section identifier */}
        <div className="absolute top-8 left-8 md:left-24 font-['Neue_Einstellung'] text-[10px] uppercase tracking-[0.3em] text-[#B5B5B3]">
          07 — Testimonials
        </div>
        
        <div className="relative max-w-[1400px] mx-auto px-8 md:px-16 lg:px-24">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-baseline gap-8 md:gap-12 mb-16 md:mb-24">
            <div className="font-['Lingerie_Typeface'] text-[80px] md:text-[120px] lg:text-[160px] leading-[0.8] text-[#171719]/5 select-none">
              07
            </div>
            <div className="flex-1">
              <h2 className="font-['Bordoni_FLF'] text-[32px] md:text-[48px] lg:text-[56px] leading-[1.1] text-[#171719] tracking-[-0.01em]">
                Their Words, Not Mine
              </h2>
              <div className="w-16 md:w-24 h-px bg-[#171719]/20 mt-4"></div>
            </div>
          </div>
          
          {/* Messages Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Message 1 - Large Feature */}
            <div className="group relative">
              <div className="bg-[#FAFAF8] border border-[#171719]/5 p-8 md:p-12 transition-all duration-700 hover:bg-[#171719] hover:text-white hover:border-[#171719]">
                <p className="font-['Neue_Einstellung'] text-[16px] md:text-[18px] leading-[1.6] text-[#171719]/80 group-hover:text-white/90 mb-6 tracking-[0.01em]">
                  "Sandra, thank you so much for each of your reels. 90%, it's sound like my life. Inspired by you, I started to take selfies of myself and recorded 3 stories of what I felt and what I did."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#171719]/10 group-hover:bg-white/20"></div>
                  <div>
                    <p className="font-['Neue_Einstellung'] text-[10px] uppercase tracking-[0.25em] text-[#4C4B4B] group-hover:text-white/60">
                      DM Received
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Message 2 - Offset */}
            <div className="group relative lg:mt-16">
              <div className="bg-[#171719] text-white border border-[#171719] p-8 md:p-12 transition-all duration-700 hover:bg-white hover:text-[#171719] hover:border-[#171719]/20">
                <p className="font-['Bordoni_FLF'] italic text-[18px] md:text-[22px] leading-[1.3] mb-6 tracking-[0.02em]">
                  "You have literally changed my picture taking from boring selfies to professional pictures!"
                </p>
                <p className="font-['Neue_Einstellung'] text-[10px] uppercase tracking-[0.25em] text-white/60 group-hover:text-[#4C4B4B]">
                  @follower
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
                    <span className="font-['Neue_Einstellung'] text-xs tracking-[0.15em] uppercase text-black/40">
                      Instagram DM
                    </span>
                    <span className="text-2xl">❤️</span>
                  </div>
                </div>
              </div>
              
              {/* Message 4 - Accent */}
              <div className="md:col-span-6 md:col-start-7">
                <div className="relative">
                  <div className="absolute -top-4 -left-4 font-['Lingerie_Typeface'] text-[120px] text-black/5 leading-none">
                    !
                  </div>
                  <div className="bg-[#FAFAF8] p-10 md:p-12">
                    <p className="font-['Neue_Einstellung'] text-[17px] md:text-[19px] leading-relaxed text-black/80">
                      "Oh my goodness! I need to hear this on repeat. I will start posting more even when I'm not ready."
                    </p>
                    <p className="font-['Neue_Einstellung'] text-xs tracking-[0.2em] uppercase text-black/40 mt-4">
                      Sarah Catherine
                    </p>
                  </div>
                </div>
              </div>
              
            </div>
            
            {/* Floating accent messages */}
            <div className="mt-16 flex flex-wrap gap-6 justify-center">
              <div className="bg-black/5 backdrop-blur px-8 py-4 inline-block">
                <p className="font-['Neue_Einstellung'] text-sm text-black/60">
                  "Love how you show the actual camera settings!"
                </p>
              </div>
              
              <div className="bg-black/5 backdrop-blur px-8 py-4 inline-block">
                <p className="font-['Neue_Einstellung'] text-sm text-black/60">
                  "I'm pursuing my dream! Thank you so much!"
                </p>
              </div>
              
              <div className="bg-black/5 backdrop-blur px-8 py-4 inline-block">
                <p className="font-['Neue_Einstellung'] text-sm text-black/60">
                  "Ready for next level at 41!"
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="relative min-h-screen bg-white flex items-center">
        {/* Background Typography */}
        <div className="absolute inset-0 opacity-10 z-0 text-[400px] flex items-center justify-center overflow-hidden">
          <div className="font-['Lingerie_Typeface'] text-[600px] md:text-[800px] text-black leading-none">
            S
          </div>
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
                  className="group w-full relative overflow-hidden bg-black text-white py-4 px-8"
                >
                  <span className="relative z-10 font-['Neue_Einstellung'] text-xs tracking-[0.3em] uppercase">Get On The List</span>
                  <div className="absolute inset-0 bg-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                  <span className="absolute inset-0 flex items-center justify-center font-['Neue_Einstellung'] text-xs tracking-[0.3em] uppercase text-black transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">Get On The List</span>
                </button>
              </form>
              
              <p className="font-['Neue_Einstellung'] text-xs text-black/40 mt-6">
                Let's do this together, shall we...
              </p>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
          <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8 border-t border-black/10 pt-8">
            <div className="font-['Neue_Einstellung'] text-xs tracking-[0.2em] uppercase text-black/40">
              © 2024 Selfie AI™ by Sandra Sigurjonsdottir
            </div>
            
            <div className="flex gap-8">
              <Link href="/privacy" className="font-['Neue_Einstellung'] text-xs tracking-[0.15em] uppercase text-black/40 hover:text-black/80 transition-colors">Privacy</Link>
              <Link href="/terms" className="font-['Neue_Einstellung'] text-xs tracking-[0.15em] uppercase text-black/40 hover:text-black/80 transition-colors">Terms</Link>
              <Link href="/contact" className="font-['Neue_Einstellung'] text-xs tracking-[0.15em] uppercase text-black/40 hover:text-black/80 transition-colors">Contact</Link>
            </div>
          </div>
        </div>
        
        {/* Final CTA Text */}
        <div className="absolute bottom-8 left-0 right-0 text-center z-10">
          <p className="font-['Bordoni_FLF'] text-lg sm:text-xl mt-6 mb-2 italic">
            Your Brand.
          </p>
        </div>
      </section>
    </div>
  );
}