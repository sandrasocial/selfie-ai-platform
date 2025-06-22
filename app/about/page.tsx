'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

export default function AboutPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Handle scroll for nav backdrop
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  return (
    <div className="min-h-screen bg-[#F1F1F1]">
      
      {/* Navigation - Matching homepage design */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-[#171719]/95 backdrop-blur-md' : 'bg-transparent'
      }`}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-24">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="font-bodoni text-[28px] text-white tracking-[-0.02em]">
              SELFIE AI™
            </Link>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-12">
              <Link href="/" className="font-neue text-[11px] uppercase tracking-[0.3em] text-white/80 hover:text-white transition-colors">
                Home
              </Link>
              <Link href="/about" className="font-neue text-[11px] uppercase tracking-[0.3em] text-white">
                About
              </Link>
              <Link href="/freebie/selfie-guide" className="font-neue text-[11px] uppercase tracking-[0.3em] text-white/80 hover:text-white transition-colors">
                Free Guide
              </Link>
              <Link href="/login" className="font-neue text-[11px] uppercase tracking-[0.3em] text-white/80 hover:text-white transition-colors">
                Login
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-white hover:text-white/80 transition-colors"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-[#171719]/95 backdrop-blur-md">
            <div className="px-6 py-8 space-y-6">
              <Link 
                href="/" 
                className="block font-inter text-xl uppercase tracking-[0.3em] text-white/80 hover:text-white transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/about" 
                className="block font-inter text-xl uppercase tracking-[0.3em] text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                href="/freebie/selfie-guide" 
                className="block font-inter text-xl uppercase tracking-[0.3em] text-white/80 hover:text-white transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Free Guide
              </Link>
              <Link 
                href="/login" 
                className="block font-inter text-xl uppercase tracking-[0.3em] text-white/80 hover:text-white transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-[#171719] overflow-hidden">
        {/* Background Editorial Number */}
        <div className="absolute font-bodoni text-[60vw] font-bold opacity-[0.03] text-[#F1F1F1] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 leading-[0.8] select-none pointer-events-none">
          01
        </div>
        
        <div className="relative z-10 text-center text-[#F1F1F1] px-6 md:px-24 max-w-[1400px] mx-auto">
          <div className="section-label mb-12 flex items-center justify-center gap-4 uppercase tracking-[0.3em] text-[11px] text-[#F1F1F1]/60">
            <span className="inline-block w-6 h-px bg-[#F1F1F1]/60"></span>
            About Sandra
            <span className="inline-block w-6 h-px bg-[#F1F1F1]/60"></span>
          </div>
          
          <h1 className="font-bodoni text-[48px] md:text-[72px] lg:text-[96px] font-light tracking-[-0.02em] leading-[0.9] mb-8">
            THE WOMAN BEHIND<br />
            THE PLATFORM
          </h1>
          
          <p className="font-inter text-[16px] md:text-[18px] text-[#F1F1F1]/80 max-w-[600px] mx-auto leading-[1.6]">
            From divorce to empire. From hiding to helping thousands of women show up authentically online.
          </p>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="w-px h-16 bg-[#F1F1F1]/20 relative">
            <div className="absolute top-0 w-px h-8 bg-[#F1F1F1] animate-bounce"></div>
          </div>
        </div>
      </section>

      {/* Main Story Section - Expanded from homepage */}
      <section className="py-20 md:py-32 bg-[#F1F1F1]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-24">
          {/* Editorial Number Positioned */}
          <div className="relative mb-16">
            <div className="font-bodoni text-[200px] md:text-[300px] text-[#171719]/[0.03] absolute -top-24 -left-8 select-none pointer-events-none">
              02
            </div>
          </div>
          
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start relative z-10">
            {/* Story Content */}
            <div className="lg:col-span-7">
              <h3 className="font-bodoni italic text-[32px] md:text-[40px] text-[#171719] mb-12 leading-[1.3]">
                "I just needed a way to show up."
              </h3>
              
              <div className="space-y-8">
                <p className="font-inter text-[16px] md:text-[18px] text-[#171719] leading-[1.7]">
                  Three years ago, I was sitting in my car after my divorce, scrolling through Instagram, wondering how everyone else made it look so easy.
                </p>
                
                <p className="font-inter text-[16px] md:text-[18px] text-[#171719] leading-[1.7]">
                  I had an iPhone, three kids, and zero confidence. But I also had this feeling that I was meant for more. That my story could help someone else going through the same thing.
                </p>
                
                <div className="my-12 pl-8 border-l-2 border-[#171719]">
                  <p className="font-bodoni italic text-[24px] md:text-[28px] text-[#171719] leading-[1.4]">
                    "I figured out the light, the angles, the editing. More importantly, I figured out how to stop hiding."
                  </p>
                </div>
                
                <p className="font-inter text-[16px] md:text-[18px] text-[#171719] leading-[1.7]">
                  So I started taking selfies. Bad ones at first. Really bad. But I kept going. I figured out the light, the angles, the editing. More importantly, I figured out how to stop hiding.
                </p>
                
                <p className="font-inter text-[16px] md:text-[18px] text-[#171719] leading-[1.7]">
                  Within 90 days, I had 120,000 followers. Within six months, I had built my first six-figure business. Not because I was special, but because I finally understood something most people miss.
                </p>
                
                <div className="my-12 pl-8 border-l-2 border-[#171719]">
                  <p className="font-bodoni italic text-[24px] md:text-[28px] text-[#171719] leading-[1.4]">
                    "Your phone is all you need to build a brand that works."
                  </p>
                </div>
                
                <p className="font-inter text-[16px] md:text-[18px] text-[#171719] leading-[1.7]">
                  Now I help women build their entire personal brand from their camera roll. Because honestly? Your phone is all you need.
                </p>
              </div>
              
              <div className="mt-16">
                <p className="font-inter text-[14px] uppercase tracking-[0.2em] text-[#B5B5B3] mb-6">
                  Let's build something real together
                </p>
                <Image 
                  src="https://i.postimg.cc/NMsTRh2K/Sandra-Signature-homepage.png" 
                  alt="Sandra's signature" 
                  width={200}
                  height={64}
                  className="h-16 w-auto opacity-80" 
                />
              </div>
            </div>
            
            {/* Image Section */}
            <div className="lg:col-span-5 relative">
              {/* Main Portrait */}
              <div className="relative mb-16">
                <Image
                  src="/images/sandra-portrait.jpg"
                  alt="Sandra Sigurjonsdottir - Founder of SELFIE AI™"
                  width={600}
                  height={800}
                  className="w-full h-auto"
                  priority={false}
                />
                
                {/* Floating Stats Card */}
                <div className="absolute -bottom-8 -left-8 bg-[#F1F1F1] p-8 shadow-2xl max-w-[200px]">
                  <div className="font-bodoni text-[48px] text-[#171719]/10 leading-[0.8]">120K</div>
                  <p className="font-inter text-[10px] uppercase tracking-[0.2em] text-[#171719] -mt-2">
                    Followers in 90 days
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Truth Section - Stats */}
      <section className="relative min-h-screen flex items-center bg-[#F1F1F1] overflow-hidden">
        {/* Background Number */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none z-0">
          <span className="font-bodoni text-[60vw] leading-[0.8] text-[#171719]/[0.02]">03</span>
        </div>
        
        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-24 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
            {/* Content Side */}
            <div className="lg:col-span-6">
              <div className="section-label mb-12 flex items-center gap-4 uppercase tracking-[0.3em] text-[11px] text-[#B5B5B3]">
                <span className="inline-block w-6 h-px bg-[#B5B5B3]"></span>
                The Numbers
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
                <div>
                  <div className="font-bodoni text-[48px] sm:text-[56px] md:text-[72px] leading-[0.9] text-[#171719] mb-2 font-light tracking-[-0.02em]">120K</div>
                  <div className="text-[11px] uppercase tracking-[0.2em] text-[#B5B5B3]">Followers Built</div>
                </div>
                <div>
                  <div className="font-bodoni text-[48px] sm:text-[56px] md:text-[72px] leading-[0.9] text-[#171719] mb-2 font-light tracking-[-0.02em]">1.7M</div>
                  <div className="text-[11px] uppercase tracking-[0.2em] text-[#B5B5B3]">Monthly Reach</div>
                </div>
                <div>
                  <div className="font-bodoni text-[48px] sm:text-[56px] md:text-[72px] leading-[0.9] text-[#171719] mb-2 font-light tracking-[-0.02em]">10K+</div>
                  <div className="text-[11px] uppercase tracking-[0.2em] text-[#B5B5B3]">Women Helped</div>
                </div>
                <div>
                  <div className="font-bodoni text-[48px] sm:text-[56px] md:text-[72px] leading-[0.9] text-[#171719] mb-2 font-light tracking-[-0.02em]">90</div>
                  <div className="text-[11px] uppercase tracking-[0.2em] text-[#B5B5B3]">Days to Transform</div>
                </div>
              </div>
              
              <div className="pl-6 border-l border-[#171719] mb-8">
                <p className="font-bodoni italic text-[20px] sm:text-[24px] text-[#171719] mb-6 leading-[1.5]">
                  This isn't hype. These are real numbers from real women who stopped overthinking and started showing up.
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-px bg-[#171719]"></div>
                  <div className="text-[12px] uppercase tracking-[0.2em] text-[#171719]">Sandra Sigurjonsdottir</div>
                </div>
              </div>
            </div>
            
            {/* Image Side */}
            <div className="lg:col-span-6 relative h-[400px] md:h-[600px] flex items-center justify-center">
              <div className="w-full h-full relative">
                <Image
                  src="/images/final-quote-image-1.png"
                  alt="Sandra teaching personal branding"
                  fill
                  className="w-full h-full object-cover object-center"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                  priority={false}
                />
                <div className="absolute bottom-6 right-6 bg-[#F1F1F1] p-8 max-w-xs shadow-2xl">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-[#B5B5B3] mb-2">Norway • 2025</div>
                  <p className="font-inter text-[14px] text-[#171719]">Teaching women to own their story</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-20 md:py-32 bg-[#171719]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-24">
          {/* Editorial Number */}
          <div className="relative mb-16">
            <div className="font-bodoni text-[200px] md:text-[300px] text-[#F1F1F1]/[0.03] absolute -top-24 -left-8 select-none pointer-events-none">
              04
            </div>
          </div>
          
          <div className="relative z-10">
            <div className="section-label mb-12 flex items-center gap-4 uppercase tracking-[0.3em] text-[11px] text-[#F1F1F1]/60">
              <span className="inline-block w-6 h-px bg-[#F1F1F1]/60"></span>
              The Philosophy
            </div>
            
            <h2 className="font-bodoni text-[48px] md:text-[64px] font-light tracking-[-0.02em] text-[#F1F1F1] mb-16 leading-[1.1]">
              WHY SELFIE AI™ EXISTS
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
              <div className="space-y-8">
                <p className="font-inter text-[16px] md:text-[18px] text-[#F1F1F1]/80 leading-[1.7]">
                  After working with thousands of women, I noticed the same pattern everywhere. Brilliant women hiding behind generic stock photos while their authentic stories collected dust in their camera rolls.
                </p>
                
                <p className="font-inter text-[16px] md:text-[18px] text-[#F1F1F1]/80 leading-[1.7]">
                  The problem wasn't that women didn't know how to build brands. The problem was that nobody was teaching them how to build brands that actually felt like them.
                </p>
                
                <div className="pl-6 border-l border-[#F1F1F1]/40">
                  <p className="font-bodoni italic text-[20px] md:text-[24px] text-[#F1F1F1] leading-[1.4]">
                    "We're not building pretty profiles. We're building empires rooted in authenticity."
                  </p>
                </div>
              </div>
              
              <div className="space-y-12">
                <div>
                  <h3 className="font-inter text-[12px] uppercase tracking-[0.3em] text-[#F1F1F1] mb-4">Authentic Over Perfect</h3>
                  <p className="font-inter text-[14px] text-[#F1F1F1]/60 leading-[1.6]">
                    Real beats polished every time. Your authentic self is your superpower, not something to hide behind filters.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-inter text-[12px] uppercase tracking-[0.3em] text-[#F1F1F1] mb-4">Built for Real Life</h3>
                  <p className="font-inter text-[14px] text-[#F1F1F1]/60 leading-[1.6]">
                    Strategies that work with your busy schedule, not against it. No complicated systems or unrealistic expectations.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-inter text-[12px] uppercase tracking-[0.3em] text-[#F1F1F1] mb-4">Women Supporting Women</h3>
                  <p className="font-inter text-[14px] text-[#F1F1F1]/60 leading-[1.6]">
                    Community over competition, always. We rise by lifting each other up, not tearing each other down.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-[#F1F1F1]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-24 text-center">
          <div className="section-label mb-12 flex items-center justify-center gap-4 uppercase tracking-[0.3em] text-[11px] text-[#B5B5B3]">
            <span className="inline-block w-6 h-px bg-[#B5B5B3]"></span>
            Ready to Begin
            <span className="inline-block w-6 h-px bg-[#B5B5B3]"></span>
          </div>
          
          <h2 className="font-bodoni text-[48px] md:text-[64px] lg:text-[72px] font-light tracking-[-0.02em] text-[#171719] mb-8 leading-[1.1]">
            YOUR STORY STARTS NOW
          </h2>
          
          <p className="font-inter text-[16px] md:text-[18px] text-[#171719]/70 max-w-[600px] mx-auto leading-[1.6] mb-12">
            Get the free guide that started it all. See what happens when you stop hiding and start showing up as yourself.
          </p>
          
          <Link 
            href="/freebie/selfie-guide"
            className="inline-flex items-center justify-center px-12 py-5 bg-[#171719] text-[#F1F1F1] font-inter text-[11px] uppercase tracking-[0.2em] hover:bg-[#171719]/90 transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-[#171719]"
          >
            Get Free Guide
          </Link>
        </div>
      </section>
    </div>
  )
} 