'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState('');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setMounted(true);
    setTimeout(() => setHeroLoaded(true), 100);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mounted]);

  const handleEmailSubmit = () => {
    if (!email || !email.includes('@')) {
      console.log('Please enter a valid email');
      return;
    }
    console.log('Email submitted:', email);
    setEmail('');
  };

  // Safe parallax calculation
  const parallaxOffset = {
    x: mounted ? (mousePosition.x - (window?.innerWidth || 0) / 2) * 0.02 : 0,
    y: mounted ? (mousePosition.y - (window?.innerHeight || 0) / 2) * 0.02 : 0
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Custom styles - Add these to your globals.css file */}
      {/* 
        @import url('https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,wght@0,400;0,700;0,900;1,400;1,700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500&display=swap');
        
        .lingerie-number {
          font-family: 'Bodoni Moda', serif;
          font-weight: 900;
          font-style: italic;
          letter-spacing: -0.05em;
        }
        
        html {
          scroll-behavior: smooth;
        }
        
        .magnetic-hover {
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .magnetic-hover:hover {
          transform: scale(1.05);
        }
        
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        
        .shimmer {
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%);
          background-size: 1000px 100%;
          animation: shimmer 3s infinite;
        }
      */}

      {/* HERO SECTION - Full Bleed Editorial with Parallax */}
      <section className="relative min-h-screen bg-luxury-black overflow-hidden">
        {/* Background with Parallax */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-100 ease-out"
          style={{ 
            backgroundImage: `url('https://i.postimg.cc/RFwJMj9s/Herofullbleed-1.png')`,
            transform: `translate(${parallaxOffset.x}px, ${parallaxOffset.y}px) scale(1.1)`,
            filter: 'brightness(0.85) contrast(1.1)'
          }}
        />
        {/* Gradient Overlays for depth */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30" />
        {/* Navigation - Ultra Minimal */}
        <nav className="relative z-20 flex justify-between items-center px-8 md:px-16 lg:px-24 py-8 md:py-12">
          {/* Logo with magnetic hover */}
          <Link href="/">
            <div className="group cursor-pointer magnetic-hover">
              <h1 className="text-white font-bodoni font-light tracking-[0.3em] text-xs md:text-sm">
                SELFIE AI™
              </h1>
              <div className="h-px bg-white/40 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </div>
          </Link>
          {/* Navigation with stagger animation */}
          <div className="hidden md:flex items-center gap-12 lg:gap-16">
            {['ABOUT', 'TOOLS', 'STORIES'].map((item, i) => (
              <Link 
                key={item}
                href={`/${item.toLowerCase()}`} 
                className={`text-white/80 hover:text-white text-xs tracking-[0.3em] transition-all hover:tracking-[0.4em] ${
                  heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
                style={{ transitionDelay: `${300 + i * 100}ms` }}
              >
                {item}
              </Link>
            ))}
            <Link href="/dashboard">
              <button className={`relative overflow-hidden border border-white/40 hover:border-white text-white px-8 py-3 text-xs tracking-[0.3em] transition-all group ${
                heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: '600ms' }}>
                <span className="relative z-10">BEGIN</span>
                <div className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                <span className="absolute inset-0 flex items-center justify-center text-luxury-black opacity-0 group-hover:opacity-100 transition-opacity duration-500">BEGIN</span>
              </button>
            </Link>
          </div>

          {/* Mobile Menu - Minimal */}
          <button className="md:hidden text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          </button>
        </nav>

        {/* Hero Content with Floating Animation */}
        <div className="relative z-10 flex items-center min-h-[calc(100vh-120px)]">
          <div className="w-full px-8 md:px-16 lg:px-24 max-w-[1600px] mx-auto">
            <div className="max-w-5xl">
              {/* Floating Accent Number */}
              <div 
                className={`absolute -top-20 -right-20 lingerie-number text-[300px] md:text-[400px] lg:text-[500px] text-white/5 select-none transition-all duration-1000 ${
                  heroLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                style={{ transform: `translate(${parallaxOffset.x * 2}px, ${parallaxOffset.y * 2}px)` }}
              >
                01
              </div>

              {/* Editorial Headline with Stagger */}
              <h2 className="text-white relative">
                <span className={`block font-bodoni text-[56px] sm:text-[72px] md:text-[96px] lg:text-[120px] leading-[0.85] font-light transition-all duration-1000 ${
                  heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}>
                  Your selfie
                </span>
                <span className={`block font-bodoni text-[56px] sm:text-[72px] md:text-[96px] lg:text-[120px] leading-[0.85] font-light italic ml-0 md:ml-16 lg:ml-24 transition-all duration-1000 ${
                  heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`} style={{ transitionDelay: '200ms' }}>
                  is your
                </span>
                <span className={`block font-bodoni text-[56px] sm:text-[72px] md:text-[96px] lg:text-[120px] leading-[0.85] font-light transition-all duration-1000 ${
                  heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`} style={{ transitionDelay: '400ms' }}>
                  brand.
                </span>
              </h2>
              {/* Subheadline with refined copy */}
              <p className={`font-inter text-white/80 text-lg md:text-xl lg:text-2xl mt-8 md:mt-12 max-w-2xl leading-relaxed transition-all duration-1000 ${
                heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`} style={{ transitionDelay: '600ms' }}>
                Stop overthinking every photo.
                <br />Start showing up with confidence.
              </p>
              {/* CTAs with hover effects */}
              <div className={`flex flex-col sm:flex-row gap-4 md:gap-6 mt-12 md:mt-16 transition-all duration-1000 ${
                heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`} style={{ transitionDelay: '800ms' }}>
                <Link href="/free-guide">
                  <button className="group relative bg-white text-luxury-black px-12 py-4 text-xs tracking-[0.3em] overflow-hidden transition-all hover:shadow-2xl">
                    <span className="relative z-10">GET THE FREE GUIDE</span>
                    <div className="absolute inset-0 bg-luxury-black transform scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-bottom" />
                    <span className="absolute inset-0 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500">GET THE FREE GUIDE</span>
                  </button>
                </Link>
                <Link href="/tools/glow-check">
                  <button className="group relative border border-white text-white px-12 py-4 text-xs tracking-[0.3em] overflow-hidden transition-all">
                    <span className="relative z-10">TRY THE GLOW CHECK</span>
                    <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-all duration-1000 ${
          heroLoaded ? 'opacity-100' : 'opacity-0'
        }`} style={{ transitionDelay: '1200ms' }}>
          <div className="w-px h-16 bg-white/20 relative overflow-hidden">
            <div className="absolute top-0 w-full h-1/2 bg-white animate-pulse" />
          </div>
        </div>
      </section>

      {/* MANIFESTO SECTION - Editorial Typography */}
      <section className="bg-white py-24 md:py-32 relative overflow-hidden">
        {/* Background Number */}
        <div className="absolute top-0 right-0 lingerie-number text-[400px] md:text-[600px] text-[#171719]/3 select-none">
          02
        </div>

        <div className="max-w-[1400px] mx-auto px-8 md:px-16 lg:px-24 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            {/* Left - Large Quote */}
            <div className="flex items-center">
              <div className="relative">
                <span className="absolute -top-16 -left-12 text-[180px] leading-none text-[#171719]/5 font-serif">"</span>
                <h3 className="font-['Bodoni_Moda'] text-[40px] md:text-[56px] lg:text-[64px] leading-[0.9] text-[#171719] font-light">
                  I needed
                  <br />a way
                  <br />to show up.
                </h3>
              </div>
            </div>
            
            {/* Right - Story with Voice AI's copy */}
            <div className="flex items-center">
              <div className="space-y-6 text-[#4C4B4B]">
                <p className="text-lg leading-relaxed">
                  I was tired of second-guessing every photo. Exhausted from overthinking every post.
                </p>
                <p className="text-lg leading-relaxed">
                  So I built what I needed - simple tools that make showing up feel natural again.
                </p>
                <p className="text-lg leading-relaxed">
                  SELFIE AI™ is for when you're ready to stop hiding behind "not ready yet."
                </p>
                <div className="pt-8">
                  <p className="text-[#171719] text-lg italic">Ready to do this together?</p>
                  <div className="mt-4">
                    <p className="text-[#171719] text-base">— Sandra</p>
                    <p className="text-xs tracking-[0.3em] text-[#B5B5B3] mt-1">YOUR FRIEND WHO GETS IT</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES GRID - Luxury Flatlays */}
      <section className="bg-[#FAFAF8] py-24 md:py-32 relative">
        {/* Section Header with Number */}
        <div className="text-center mb-20 relative">
          <div className="lingerie-number text-[200px] md:text-[300px] text-[#171719]/5 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 select-none">
            03
          </div>
          <h2 className="text-[40px] md:text-[56px] lg:text-[72px] text-[#171719] font-light leading-tight mb-6 relative z-10">
            Tools that transform
          </h2>
          <p className="text-lg text-[#4C4B4B] max-w-2xl mx-auto relative z-10">
            Because showing up shouldn't feel so hard.
          </p>
        </div>

        {/* Features Grid with Flatlays */}
        <div className="max-w-[1400px] mx-auto px-8 md:px-16 lg:px-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* The Glow Check */}
            <div className="group bg-white overflow-hidden cursor-pointer transform transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
              <div className="relative h-[400px] overflow-hidden">
                <img 
                  src="https://i.postimg.cc/LXQsYDmV/cover-Image-Url-flatlay.png" 
                  alt="The Glow Check"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                  <p className="text-white text-sm tracking-[0.2em] mb-2">FORMERLY SELFIE SCORE</p>
                  <h3 className="text-white text-2xl">The Glow Check™</h3>
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl mb-3 text-[#171719]">
                  The Glow Check™
                </h3>
                <p className="text-[#4C4B4B]">
                  Like having me in your pocket. I'll tell you what's working and what we can make better.
                </p>
              </div>
            </div>

            {/* Future Self AI */}
            <div className="group bg-white overflow-hidden cursor-pointer transform transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
              <div className="relative h-[400px] overflow-hidden">
                <img 
                  src="https://i.postimg.cc/wxc1QX0g/3.png" 
                  alt="Future Self AI"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                  <p className="text-white text-sm tracking-[0.2em] mb-2">VISUALIZATION TOOL</p>
                  <h3 className="text-white text-2xl">Future Self AI</h3>
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl mb-3 text-[#171719]">
                  Future Self AI
                </h3>
                <p className="text-[#4C4B4B]">
                  See where you're headed. Sometimes we need to visualize it before we can become it.
                </p>
              </div>
            </div>

            {/* Content Calendar */}
            <div className="group bg-white overflow-hidden cursor-pointer transform transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
              <div className="relative h-[400px] overflow-hidden">
                <img 
                  src="https://i.postimg.cc/yYGsmW47/21.png" 
                  alt="Content Calendar"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                  <p className="text-white text-sm tracking-[0.2em] mb-2">30-DAY STRATEGY</p>
                  <h3 className="text-white text-2xl">Content Calendar</h3>
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl mb-3 text-[#171719]">
                  Content Calendar
                </h3>
                <p className="text-[#4C4B4B]">
                  30 days of "post this." No more blank screen panic. Just show up and follow the plan.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* REAL TESTIMONIALS SECTION */}
      <section className="bg-white py-24 md:py-32 overflow-hidden relative">
        {/* Background Number */}
        <div className="absolute top-0 left-0 lingerie-number text-[400px] md:text-[600px] text-[#171719]/3 select-none">
          04
        </div>

        <div className="max-w-[1600px] mx-auto px-8 md:px-16 lg:px-24 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-20">
            <h2 className="text-[40px] md:text-[56px] lg:text-[72px] text-[#171719] font-light">
              Real people. Real results.
            </h2>
          </div>

          {/* Testimonials Grid - Instagram Style */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-[#FAFAF8] p-8 transform transition-all duration-500 hover:-translate-y-2 hover:shadow-xl">
              <div className="mb-4">
                <svg className="w-8 h-8 text-[#171719]/20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>
              <p className="text-[#4C4B4B] text-lg mb-6 leading-relaxed">
                Sandra, thank you so much for each of your reels. 90%, it's sound like my life. Inspired by you, I started to take selfies of myself and recorded 3 stories of what I felt and what I did.
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#171719]/10 rounded-full" />
                <div>
                  <p className="text-[#171719] font-medium">Maria K.</p>
                  <p className="text-xs text-[#B5B5B3]">@mariabrand</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-[#FAFAF8] p-8 transform transition-all duration-500 hover:-translate-y-2 hover:shadow-xl">
              <div className="mb-4">
                <svg className="w-8 h-8 text-[#171719]/20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>
              <p className="text-[#4C4B4B] text-lg mb-6 leading-relaxed">
                Love it!!!! You have literally changed my picture taking from boring selfies to professional pictures !!! Thank you ❤️
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#171719]/10 rounded-full" />
                <div>
                  <p className="text-[#171719] font-medium">Sarah M.</p>
                  <p className="text-xs text-[#B5B5B3]">@sarahcreates</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-[#FAFAF8] p-8 transform transition-all duration-500 hover:-translate-y-2 hover:shadow-xl">
              <div className="mb-4">
                <svg className="w-8 h-8 text-[#171719]/20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>
              <p className="text-[#4C4B4B] text-lg mb-6 leading-relaxed">
                I'm so in love with your journey! Today was the day I decided to not use any more filters ever. I will definitely be using your tips for photos.
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#171719]/10 rounded-full" />
                <div>
                  <p className="text-[#171719] font-medium">Jessica L.</p>
                  <p className="text-xs text-[#B5B5B3]">@jessicaleads</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VALUE LADDER - Editorial Minimal */}
      <section className="bg-[#171719] py-24 md:py-32 relative overflow-hidden">
        {/* Background Design */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/5 to-transparent" />
        </div>

        <div className="max-w-[1400px] mx-auto px-8 md:px-16 lg:px-24 relative z-10">
          {/* Header with Number */}
          <div className="text-center mb-20 relative">
            <div className="lingerie-number text-[300px] md:text-[500px] text-white/5 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 select-none">
              05
            </div>
            <h2 className="text-[40px] md:text-[56px] lg:text-[72px] text-white font-light leading-tight mb-6 relative z-10">
              Your journey starts here
            </h2>
            <p className="text-lg text-white/60 max-w-2xl mx-auto relative z-10">
              Pick where you want to start. There's no wrong door.
            </p>
          </div>

          {/* Value Ladder with Hover Effects */}
          <div className="space-y-0 max-w-4xl mx-auto">
            {/* Free Guide */}
            <div className="border-t border-white/20 pt-8 pb-8 group cursor-pointer transition-all duration-500 hover:pl-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="text-xs tracking-[0.3em] text-white/40 mb-4 group-hover:text-white/60 transition-colors">STEP 01</p>
                  <h3 className="text-3xl text-white mb-4 group-hover:text-white transition-colors">The Selfie Queen Guide</h3>
                  <p className="text-white/60 max-w-xl group-hover:text-white/80 transition-colors">My gift to you. Everything I know about taking selfies that convert.</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl text-white/80 mb-4">FREE</p>
                  <Link href="/free-guide">
                    <button className="text-xs tracking-[0.2em] text-white/60 hover:text-white transition-all group-hover:tracking-[0.3em]">
                      GET IT NOW →
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Starter Kit */}
            <div className="border-t border-white/20 pt-8 pb-8 group cursor-pointer transition-all duration-500 hover:pl-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="text-xs tracking-[0.3em] text-white/40 mb-4 group-hover:text-white/60 transition-colors">STEP 02</p>
                  <h3 className="text-3xl text-white mb-4">The Starter Kit</h3>
                  <p className="text-white/60 max-w-xl group-hover:text-white/80 transition-colors">Your first month planned out. Show up, follow the prompts, watch what happens.</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl text-white/80 mb-4">$67</p>
                  <Link href="/products/starter-kit">
                    <button className="text-xs tracking-[0.2em] text-white/60 hover:text-white transition-all group-hover:tracking-[0.3em]">
                      START NOW →
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Branded */}
            <div className="border-t border-white/20 pt-8 pb-8 group cursor-pointer transition-all duration-500 hover:pl-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="text-xs tracking-[0.3em] text-white/40 mb-4 group-hover:text-white/60 transition-colors">STEP 03</p>
                  <h3 className="text-3xl text-white mb-4">Branded by Selfie</h3>
                  <p className="text-white/60 max-w-xl group-hover:text-white/80 transition-colors">The whole system. When you're done playing small and ready for real change.</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl text-white/80 mb-4">$397</p>
                  <Link href="/products/branded">
                    <button className="text-xs tracking-[0.2em] text-white/60 hover:text-white transition-all group-hover:tracking-[0.3em]">
                      TRANSFORM →
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            {/* VIP */}
            <div className="border-t border-white/20 pt-8 group cursor-pointer transition-all duration-500 hover:pl-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="text-xs tracking-[0.3em] text-white/40 mb-4 group-hover:text-white/60 transition-colors">BY APPLICATION</p>
                  <h3 className="text-3xl text-white mb-4">VIP</h3>
                  <p className="text-white/60 max-w-xl group-hover:text-white/80 transition-colors">When you need me personally. Limited spots, unlimited support.</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl text-white/80 mb-4">Apply</p>
                  <Link href="/vip-application">
                    <button className="text-xs tracking-[0.2em] text-white/60 hover:text-white transition-all group-hover:tracking-[0.3em]">
                      APPLY →
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA - Magnetic */}
      <section className="bg-white py-32 text-center relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#171719]/5 rounded-full blur-3xl animate-pulse" />
        </div>

        <div className="max-w-4xl mx-auto px-8 relative z-10">
          <h2 className="text-[40px] md:text-[56px] lg:text-[72px] text-[#171719] font-light leading-tight mb-8">
            One question.
          </h2>
          <p className="text-xl text-[#4C4B4B] mb-12 max-w-2xl mx-auto">
            Are you tired of waiting to feel ready? Good. That means you already are.
          </p>
          
          {/* Email Capture with Animation */}
          <div className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-4 group">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your best email"
                className="flex-1 bg-transparent border-b-2 border-[#171719]/20 text-[#171719] placeholder-[#B5B5B3] pb-3 focus:outline-none focus:border-[#171719] transition-all text-center sm:text-left"
              />
              <button
                onClick={handleEmailSubmit}
                className="bg-[#171719] text-white px-8 py-3 text-xs tracking-[0.3em] hover:tracking-[0.4em] transition-all relative overflow-hidden group"
              >
                <span className="relative z-10">BEGIN NOW</span>
                <div className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                <span className="absolute inset-0 flex items-center justify-center text-[#171719] opacity-0 group-hover:opacity-100 transition-opacity duration-500">BEGIN NOW</span>
              </button>
            </div>
          </div>
          
          <p className="text-xs text-[#B5B5B3] mt-8 tracking-[0.2em]">
            NO SPAM. JUST REAL TALK AND STRATEGY.
          </p>
        </div>
      </section>

      {/* Footer - Ultra Minimal */}
      <footer className="bg-[#171719] py-16">
        <div className="max-w-[1400px] mx-auto px-8 md:px-16 lg:px-24">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div>
              <h3 className="text-white tracking-[0.3em] text-xs mb-2">SELFIE AI™</h3>
              <p className="text-xs text-white/40">© 2025 Let's build something beautiful together</p>
            </div>
            
            <div className="flex gap-8">
              <Link href="/privacy" className="text-xs text-white/40 hover:text-white/60 transition-colors tracking-[0.2em]">
                PRIVACY
              </Link>
              <Link href="/terms" className="text-xs text-white/40 hover:text-white/60 transition-colors tracking-[0.2em]">
                TERMS
              </Link>
              <Link href="/contact" className="text-xs text-white/40 hover:text-white/60 transition-colors tracking-[0.2em]">
                CONTACT
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
