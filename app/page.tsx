'use client'

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import TestimonialsSection from "./components/TestimonialsSection";

// Lazy loaded image component with error handling
function LazyImage({ src, alt, className = '', priority = false, width, height, fill = false }) {
  const [error, setError] = useState(false);
  
  if (error) {
    return (
      <div className={`${className} bg-gray-200 flex items-center justify-center`}>
        <span className="text-gray-400 text-sm">Image unavailable</span>
      </div>
    );
  }

  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        className={className}
        onError={() => setError(true)}
        priority={priority}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={() => setError(true)}
      priority={priority}
    />
  );
}

export default function Home() {
  const [email, setEmail] = useState('');
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Refs for cleanup
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const loadingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const heroTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Handle scroll for nav backdrop
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cursor follower effect (desktop only)
  useEffect(() => {
    if (window.innerWidth < 768) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Loading sequence with cleanup
  useEffect(() => {
    let cancelled = false;
    loadingTimerRef.current = setTimeout(() => {
      if (!cancelled) {
        setIsLoading(false);
        heroTimerRef.current = setTimeout(() => setHeroLoaded(true), 100);
      }
    }, 2000);
    
    return () => {
      cancelled = true;
      if (loadingTimerRef.current) clearTimeout(loadingTimerRef.current);
      if (heroTimerRef.current) clearTimeout(heroTimerRef.current);
    };
  }, []);

  // Intersection Observer for animations
  useEffect(() => {
    if (isLoading) return;
    
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }
      });
    }, observerOptions);

    const elementsToObserve = document.querySelectorAll('.observe-me');
    elementsToObserve.forEach(el => observer.observe(el));

    return () => {
      elementsToObserve.forEach(el => observer.unobserve(el));
      observer.disconnect();
    };
  }, [isLoading]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Handle email form submission
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, source: 'homepage' }),
      });

      if (response.ok) {
        setSubmitMessage('Check your email for your free guide!');
        setEmail('');
        
        // Track conversion
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'conversion', {
            'send_to': 'SELFIE_AI/homepage_signup',
            'value': 1.0,
            'currency': 'USD'
          });
        }
      } else {
        setSubmitMessage('Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Signup error:', error);
      setSubmitMessage('Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading Screen
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-[#F1F1F1] z-50 flex items-center justify-center">
        <div className="relative">
          <div className="font-playfair italic text-[120px] text-[#171719] opacity-0 animate-fadeIn">
            S
          </div>
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-32 h-[1px] bg-[#171719]/20">
            <div className="h-full bg-[#171719] animate-loadingLine"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        
        @keyframes loadingLine {
          from { width: 0; }
          to { width: 100%; }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        
        .animate-loadingLine {
          animation: loadingLine 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        
        @keyframes revealUp {
          from { 
            opacity: 0; 
            transform: translateY(30px);
          }
          to { 
            opacity: 1; 
            transform: translateY(0);
          }
        }
        
        .letter-reveal span {
          display: inline-block;
          opacity: 0;
          animation: revealUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          animation-delay: calc(var(--index) * 50ms);
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .animate-shimmer {
          animation: shimmer 3s infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        * {
          border-radius: 0 !important;
        }
        
        .film-grain::after {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E");
          pointer-events: none;
          mix-blend-mode: overlay;
        }
        
        .blur-load {
          filter: blur(20px);
          transition: filter 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .blur-load.loaded {
          filter: blur(0);
        }
        
        .observe-me {
          opacity: 0;
          transform: translateY(40px);
          transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .observe-me.in-view {
          opacity: 1;
          transform: translateY(0);
        }
        
        *:focus {
          outline: none;
        }
        
        *:focus-visible {
          outline: 2px solid currentColor;
          outline-offset: 4px;
        }
      `}</style>

      {/* Skip Navigation */}
      <a href="#main-content" className="absolute top-[-40px] left-0 bg-[#171719] text-white p-2 z-[100] focus:top-0">Skip to main content</a>

      {/* Subtle Cursor Follower (Desktop Only) */}
      {typeof window !== 'undefined' && window.innerWidth >= 768 && (
        <div 
          className="fixed w-96 h-96 pointer-events-none z-50 opacity-5 hidden md:block"
          style={{
            background: `radial-gradient(circle at center, #171719 0%, transparent 70%)`,
            transform: `translate(${cursorPos.x - 192}px, ${cursorPos.y - 192}px)`,
            transition: 'transform 0.2s ease-out'
          }}
          aria-hidden="true"
        />
      )}



      {/* HERO SECTION */}
      <section 
        id="main-content"
        className="relative min-h-screen w-full overflow-hidden bg-cover bg-center pb-[120px]"
        style={{ backgroundImage: `url('https://i.postimg.cc/T30rkYjR/IMG_5635.jpg')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#171719]/40 via-[#171719]/20 to-[#171719]/50"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#171719]/60 via-[#171719]/10 to-transparent"></div>
        <div className="absolute inset-0 lg:w-1/2 bg-gradient-to-r from-[#171719]/80 to-transparent"></div>

        {/* Premium loading line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>

        {/* Film grain texture overlay */}
        <div className="absolute inset-0 film-grain"></div>

        {/* Navigation Bar */}
        <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${scrolled ? 'bg-[#171719]/95 backdrop-blur-sm' : 'bg-transparent'}`}>
          <div className="flex justify-between items-center px-4 sm:px-8 md:px-16 lg:px-24 py-6 md:py-8">
            {/* Logo */}
            <Link href="/" className="relative group" aria-label="SELFIE AI™ Home">
              <LazyImage 
                src="https://i.postimg.cc/L88db1fc/White-transperent-logo.png" 
                alt="SELFIE AI™" 
                width={120}
                height={40}
                className="h-8 md:h-10 w-auto opacity-95 hover:opacity-100 transition-all duration-500"
                priority
              />
              <div className="absolute -bottom-1 left-0 w-full h-px bg-white/40 scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left"></div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center">
              <div className="flex gap-10 lg:gap-16 items-center mr-10 lg:mr-16">
                <Link href="/about" className="group relative font-inter text-[10px] lg:text-[11px] uppercase tracking-[0.2em] text-white/90 hover:text-white transition-all duration-300">
                  About
                  <div className="absolute -bottom-1 left-0 w-full h-px bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                </Link>
                <div className="relative group">
                  <button className="group relative font-inter text-[10px] lg:text-[11px] uppercase tracking-[0.2em] text-white/90 hover:text-white transition-all duration-300 flex items-center gap-1 bg-transparent">
                    TOOLS
                    <svg className="w-4 h-4 transform group-hover:rotate-180 transition-transform duration-300">{/* chevron down icon */}</svg>
                    <div className="absolute -bottom-1 left-0 w-full h-px bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                  </button>
                  <div className="absolute top-full left-0 w-64 bg-white border border-[#171719] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 mt-2">
                    <Link href="/tools/glow-check" className="block px-6 py-4 hover:bg-[#F1F1F1] transition-colors">
                      The Glow Check™
                    </Link>
                    {/* More tools */}
                  </div>
                </div>
                <Link href="/stories" className="group relative font-inter text-[10px] lg:text-[11px] uppercase tracking-[0.2em] text-white/90 hover:text-white transition-all duration-300">
                  Stories
                  <div className="absolute -bottom-1 left-0 w-full h-px bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                </Link>
              </div>

              <Link href="/start-here">
                <button className="group relative overflow-hidden">
                  <div className="relative bg-white/5 backdrop-blur-sm border border-white/30 px-8 lg:px-10 py-2.5 lg:py-3 transition-all duration-500 group-hover:bg-white group-hover:border-white">
                    <span className="font-inter text-[10px] lg:text-[11px] uppercase tracking-[0.3em] text-white group-hover:text-[#171719] transition-colors duration-500">
                      Let's Begin
                    </span>
                  </div>
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                </button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden relative w-6 h-6 flex flex-col justify-center gap-1.5 group"
              aria-label="Toggle mobile menu"
            >
              <span className={`w-full h-px bg-white/80 transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-2' : 'group-hover:w-4'}`}></span>
              <span className={`w-4 h-px bg-white/80 ml-auto transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : 'group-hover:w-full'}`}></span>
              <span className={`w-full h-px bg-white/80 transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden absolute top-full left-0 right-0 bg-[#171719] border-t border-white/10">
              <div className="px-6 py-8 space-y-6">
                <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="block font-inter text-[12px] uppercase tracking-[0.2em] text-white/80 hover:text-white transition-colors">
                  About
                </Link>
                <Link href="/tools" onClick={() => setMobileMenuOpen(false)} className="block font-inter text-[12px] uppercase tracking-[0.2em] text-white/80 hover:text-white transition-colors">
                  Tools
                </Link>
                <Link href="/stories" onClick={() => setMobileMenuOpen(false)} className="block font-inter text-[12px] uppercase tracking-[0.2em] text-white/80 hover:text-white transition-colors">
                  Stories
                </Link>
                <Link href="/start-here" onClick={() => setMobileMenuOpen(false)}>
                  <button className="w-full bg-white text-[#171719] px-8 py-3 font-inter text-[11px] uppercase tracking-[0.3em] transition-all duration-300 hover:bg-[#F1F1F1]">
                    Let's Begin
                  </button>
                </Link>
              </div>
            </div>
          )}
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-8 md:px-16 lg:px-24">
          <div className="flex flex-col justify-center min-h-screen">
            <div className="mt-[45vh]">
              <h1 className="font-['Bordoni_FLF'] text-[40px] sm:text-[72px] md:text-[96px] lg:text-[120px] leading-[0.9] text-white mb-8 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                {'Your selfie is your brand'.split('').map((char, i) => (
                  <span key={i} style={{'--index': i} as any}>{char === ' ' ? '\u00A0' : char}</span>
                ))}
              </h1>
              <p className="font-['Neue_Einstellung'] italic text-[18px] sm:text-[20px] md:text-[24px] lg:text-[28px] text-white/80 mb-16 max-w-2xl drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
                You don't need another course telling you to "just be yourself."
                <br/>You need a strategy that works with who you already are.
              </p>
              <div className={`flex flex-col sm:flex-row gap-4 md:gap-6 mt-12 md:mt-16 mb-24 md:mb-32 transition-all duration-1200 ease-out delay-[1000ms] transform ${heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}> 
                <Link href="/start-here">
                  <button className="group relative overflow-hidden w-full sm:w-auto">
                    <div className="bg-transparent border border-white text-white px-12 py-5 transition-all duration-500 hover:bg-white hover:text-[#171719]">
                      <span className="relative z-10 font-inter text-[11px] uppercase tracking-[0.3em]">
                        Let's Do This Together
                      </span>
                    </div>
                  </button>
                </Link>

                <button className="group relative">
                  <span className="font-inter text-[11px] uppercase tracking-[0.3em] text-white/80 group-hover:text-white transition-colors duration-300">
                    Here's What Happened
                  </span>
                  <div className="mt-2 w-full h-px bg-white/40 transform origin-left group-hover:scale-x-110 group-hover:bg-white/60 transition-all duration-500"></div>
                </button>
              </div>
            </div>
          </div>
          {/* Ensure 96px gap below buttons and next section */}
          <div className="h-24 md:h-24" />
        </div>

        {/* Scroll indicator */}
        <div className={`absolute bottom-12 left-6 sm:left-8 md:left-16 lg:left-24 transition-all duration-1200 ease-out delay-[1200ms] ${heroLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex flex-col items-center gap-2">
            <p className="font-inter text-[10px] uppercase tracking-[0.3em] text-white/60">Scroll</p>
            <div className="w-px h-12 bg-gradient-to-b from-white/60 to-transparent animate-float"></div>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className="min-h-screen flex items-center bg-[#FAFAF8] py-20 sm:py-24 md:py-32 observe-me">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 md:px-16 lg:px-24 w-full">
          <div className="grid grid-cols-12 gap-8 md:gap-12 lg:gap-16 items-center">
            <div className="col-span-12 lg:col-span-3 text-center lg:text-left">
              <div className="font-playfair italic text-[200px] sm:text-[250px] md:text-[300px] lg:text-[400px] leading-none -ml-0 lg:-ml-8 opacity-5 lg:opacity-100">
                01
              </div>
            </div>

            <div className="col-span-12 lg:col-span-6 -mt-20 sm:-mt-32 lg:mt-0">
              <div className="space-y-6 md:space-y-8">
                <p className="font-bodoni text-[36px] sm:text-[48px] md:text-[64px] leading-tight text-center lg:text-left">
                  "I just needed a way to show up."
                </p>

                <div className="space-y-4 md:space-y-6 text-black/80">
                  <p className="font-inter text-base md:text-lg leading-relaxed">
                    Three years ago, I was sitting in my car after my divorce, scrolling through Instagram, wondering how everyone else made it look so easy.
                  </p>
                  <p className="font-inter text-base md:text-lg leading-relaxed">
                    I had an iPhone, three kids, and zero confidence. But I also had this feeling that I was meant for more. That my story could help someone else going through the same thing.
                  </p>
                  <p className="font-inter text-base md:text-lg leading-relaxed">
                    So I started taking selfies. Bad ones at first. Really bad. But I kept going. I figured out the light, the angles, the editing. More importantly, I figured out how to stop hiding.
                  </p>
                  <p className="font-inter text-base md:text-lg leading-relaxed">
                    Now I help women build their entire personal brand from their camera roll. Because honestly? Your phone is all you need.
                  </p>
                </div>

                <p className="font-bodoni italic text-xl md:text-2xl pt-2 md:pt-4">
                  Let's build something real together...
                </p>
              </div>

              <div className="mt-8 md:mt-12 text-center lg:text-left">
                <LazyImage 
                  src="https://i.postimg.cc/NMsTRh2K/Sandra-Signature-homepage.png" 
                  alt="Sandra's Signature" 
                  width={200}
                  height={60}
                  className="h-12 md:h-16"
                />
              </div>
            </div>

            <div className="col-span-12 lg:col-span-3 mt-8 lg:mt-0">
              <div className="relative overflow-hidden group max-w-[400px] mx-auto lg:max-w-none film-grain">
                <LazyImage 
                  src="https://i.postimg.cc/0jv5My39/final-Quote-Image-1.png" 
                  alt="Sandra Quote" 
                  width={400}
                  height={500}
                  className="w-full h-[400px] md:h-[500px] object-cover object-top"
                />
                <div className="absolute inset-2 border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="relative bg-white py-16 sm:py-20 md:py-28 overflow-hidden observe-me">
        <div className="absolute inset-0 opacity-[0.015] md:opacity-[0.02]" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #171719 0, #171719 1px, transparent 1px, transparent 15px)' }}></div>

        <div className="relative max-w-[1400px] mx-auto px-4 sm:px-8 md:px-16 lg:px-24">
          <div className="absolute -top-3 md:-top-4 left-6 sm:left-8 lg:left-24 font-inter text-[9px] md:text-[10px] uppercase tracking-[0.25em] lg:tracking-[0.3em] text-[#B5B5B3]">
            01 — The Truth
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 lg:gap-20 items-center">
            <div className="lg:col-span-8 order-2 lg:order-1">
              <div className="flex flex-wrap items-center gap-6 sm:gap-8 md:gap-16 mb-12 md:mb-16 justify-center lg:justify-start">
                <div className="relative group">
                  <div className="text-center lg:text-left transform transition-all duration-700 hover:translate-y-[-4px]">
                    <span className="relative font-playfair italic text-[48px] sm:text-[56px] md:text-[72px] leading-none text-[#171719]">
                      120K
                      <div className="absolute -bottom-1.5 md:-bottom-2 left-0 right-0 h-px bg-[#171719]/10 transition-all duration-500 group-hover:bg-[#171719]/30"></div>
                    </span>
                    <p className="font-inter text-[9px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.25em] text-[#4C4B4B] mt-3 md:mt-4">
                      Followers Built
                    </p>
                  </div>
                </div>

                <div className="hidden sm:block">
                  <div className="w-6 md:w-8 h-px bg-[#B5B5B3]/30"></div>
                </div>

                <div className="relative group">
                  <div className="text-center lg:text-left transform transition-all duration-700 hover:translate-y-[-4px]">
                    <span className="relative font-playfair italic text-[48px] sm:text-[56px] md:text-[72px] leading-none text-[#171719]">
                      1.7M
                      <div className="absolute -bottom-1.5 md:-bottom-2 left-0 right-0 h-px bg-[#171719]/10 transition-all duration-500 group-hover:bg-[#171719]/30"></div>
                    </span>
                    <p className="font-inter text-[9px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.25em] text-[#4C4B4B] mt-3 md:mt-4">
                      Monthly Reach
                    </p>
                  </div>
                </div>

                <div className="hidden sm:block">
                  <div className="w-6 md:w-8 h-px bg-[#B5B5B3]/30"></div>
                </div>

                <div className="relative group">
                  <div className="text-center lg:text-left transform transition-all duration-700 hover:translate-y-[-4px]">
                    <span className="relative font-playfair italic text-[48px] sm:text-[56px] md:text-[72px] leading-none text-[#171719]">
                      90
                      <div className="absolute -bottom-1.5 md:-bottom-2 left-0 right-0 h-px bg-[#171719]/10 transition-all duration-500 group-hover:bg-[#171719]/30"></div>
                    </span>
                    <p className="font-inter text-[9px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.25em] text-[#4C4B4B] mt-3 md:mt-4">
                      Days to Transform
                    </p>
                  </div>
                </div>
              </div>

              <div className="max-w-2xl mx-auto lg:mx-0">
                <div className="relative">
                  <span className="absolute -top-6 md:-top-8 -left-4 md:-left-6 font-bodoni text-[60px] md:text-[80px] text-[#171719]/5 leading-none select-none transition-all duration-1000 hover:text-[#171719]/10">"</span>

                  <p className="relative font-bodoni italic text-[20px] sm:text-[24px] md:text-[32px] leading-[1.2] md:leading-[1.3] text-[#171719] mb-8 md:mb-12 text-center lg:text-left tracking-[0.02em]">
                    This isn't hype. These are real numbers from real women who stopped overthinking and started showing up.
                  </p>
                </div>

                <div className="text-center lg:text-left">
                  <div className="inline-block relative">
                    <p className="font-bodoni text-[16px] md:text-[18px] text-[#171719] mb-1">
                      — Sandra Sigurjonsdottir
                    </p>
                    <p className="font-inter text-[9px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.25em] text-[#4C4B4B]">
                      Founder & Former Overthinking Expert
                    </p>
                    <div className="absolute -bottom-3 md:-bottom-4 left-0 w-12 md:w-16 h-px bg-[#171719]/20"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 order-1 lg:order-2">
              <div className="relative max-w-[280px] sm:max-w-[320px] mx-auto">
                <div className="relative overflow-hidden group film-grain">
                  <LazyImage 
                    src="https://i.postimg.cc/YC0mdvs0/IMG-3198.jpg" 
                    alt="Sandra Sigurjonsdottir" 
                    width={320}
                    height={400}
                    className="w-full h-[350px] sm:h-[400px] object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  <div className="absolute bottom-6 md:bottom-8 left-6 md:left-8 right-6 md:right-8 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                    <p className="font-inter text-[9px] md:text-[10px] uppercase tracking-[0.25em] md:tracking-[0.3em] text-[#171719]/80 bg-white/90 px-3 md:px-4 py-1.5 md:py-2 text-center">
                      Founder Story
                    </p>
                  </div>
                </div>

                <div className="absolute -top-3 md:-top-4 -left-3 md:-left-4 w-16 md:w-24 h-16 md:h-24 border-t border-l border-[#171719]/10"></div>
                <div className="absolute -bottom-3 md:-bottom-4 -right-3 md:-right-4 w-16 md:w-24 h-16 md:h-24 border-b border-r border-[#171719]/10"></div>

                <p className="mt-4 md:mt-6 font-inter text-[9px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.25em] text-[#4C4B4B] text-center">
                  Norway · 2025
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <TestimonialsSection />

      {/* WHO IT'S FOR SECTION */}
      <section className="bg-white py-20 sm:py-24 md:py-32 observe-me">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 md:px-16 lg:px-24">
          <div className="flex flex-col sm:flex-row items-center sm:items-baseline gap-4 sm:gap-8 mb-16 md:mb-24">
            <div className="font-playfair italic text-[80px] sm:text-[100px] md:text-[120px] leading-none opacity-10 sm:opacity-100">02</div>
            <div className="text-center sm:text-left">
              <h2 className="font-bodoni text-[36px] sm:text-[48px] md:text-[64px] tracking-tight">
                Who Shows Up Here
              </h2>
              <div className="w-24 md:w-32 h-px bg-black mt-3 md:mt-4 mx-auto sm:mx-0"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-black/10">
            {/* The Coach */}
            <div className="bg-white p-8 sm:p-10 md:p-12 group hover:bg-black hover:text-white transition-all duration-700 relative overflow-hidden observe-me">
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>

              <div className="mb-6 md:mb-8 group relative overflow-hidden cursor-pointer film-grain">
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500 ease-out" />
                <LazyImage 
                  src="https://i.postimg.cc/tRDM6kxm/5.png" 
                  alt="The Coach" 
                  width={400}
                  height={400}
                  className="w-full h-[350px] md:h-[400px] object-cover grayscale group-hover:grayscale-0 transition-all duration-700 transform transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              </div>

              <div className="font-inter text-[10px] md:text-xs tracking-[0.25em] md:tracking-[0.3em] uppercase mb-3 md:mb-4 opacity-60">
                The Coach
              </div>

              <h3 className="font-bodoni text-[28px] md:text-[32px] leading-tight mb-4 md:mb-6">
                You know your stuff. Now let's make sure everyone else does too.
              </h3>

              <p className="font-inter text-[15px] md:text-base leading-relaxed opacity-80">
                Your expertise deserves better than another Canva template.
              </p>
            </div>

            {/* The Creator */}
            <div className="bg-white p-8 sm:p-10 md:p-12 group hover:bg-black hover:text-white transition-all duration-700 relative overflow-hidden observe-me">
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>

              <div className="mb-6 md:mb-8 group relative overflow-hidden cursor-pointer film-grain">
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500 ease-out" />
                <LazyImage 
                  src="https://i.postimg.cc/022hXFvs/2.png" 
                  alt="The Creator" 
                  width={400}
                  height={400}
                  className="w-full h-[350px] md:h-[400px] object-cover grayscale group-hover:grayscale-0 transition-all duration-700 transform transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              </div>

              <div className="font-inter text-[10px] md:text-xs tracking-[0.25em] md:tracking-[0.3em] uppercase mb-3 md:mb-4 opacity-60">
                The Creator
              </div>

              <h3 className="font-bodoni text-[28px] md:text-[32px] leading-tight mb-4 md:mb-6">
                You've got the vision. You've got the phone. Let's put them together.
              </h3>

              <p className="font-inter text-[15px] md:text-base leading-relaxed opacity-80">
                Turn those random photos into a brand that pays.
              </p>
            </div>

            {/* The CEO */}
            <div className="bg-white p-8 sm:p-10 md:p-12 group hover:bg-black hover:text-white transition-all duration-700 relative overflow-hidden observe-me">
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>

              <div className="mb-6 md:mb-8 group relative overflow-hidden cursor-pointer film-grain">
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500 ease-out" />
                <LazyImage 
                  src="https://i.postimg.cc/MTmrdbrH/3.png" 
                  alt="The CEO" 
                  width={400}
                  height={400}
                  className="w-full h-[350px] md:h-[400px] object-cover grayscale group-hover:grayscale-0 transition-all duration-700 transform transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              </div>

              <div className="font-inter text-[10px] md:text-xs tracking-[0.25em] md:tracking-[0.3em] uppercase mb-3 md:mb-4 opacity-60">
                The CEO
              </div>

              <h3 className="font-bodoni text-[28px] md:text-[32px] leading-tight mb-4 md:mb-6">
                You're building something bigger than yourself.
              </h3>

              <p className="font-inter text-[15px] md:text-base leading-relaxed opacity-80">
                Let me help you look the part without the photoshoot budget.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* VALUE LADDER SECTION */}
      <section className="bg-black py-24 sm:py-32 md:py-48 relative overflow-hidden observe-me">
        <div className="absolute top-0 right-0 font-playfair italic text-[400px] sm:text-[600px] md:text-[800px] leading-none text-[#F1F1F1] opacity-[0.05] select-none pointer-events-none">
          06
        </div>

        <div className="relative max-w-[1400px] mx-auto px-4 sm:px-8 md:px-16 lg:px-24">
          <div className="text-center mb-20 sm:mb-24 md:mb-32">
            <h2 className="font-bodoni text-[36px] sm:text-[48px] md:text-[72px] tracking-tight text-white mb-6 md:mb-8">
              Your Path to Showing Up
            </h2>
            <p className="font-inter text-base md:text-lg text-white/60 max-w-2xl mx-auto">
              Choose your path. Each step builds on the last, creating your complete transformation.
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-px bg-white/10 transform md:-translate-x-1/2"></div>

            {/* Step 1: Free Guide */}
            <div className="relative mb-16 sm:mb-20 md:mb-32 observe-me">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center">
                <div className="md:col-span-5 text-left pl-12 md:pl-0 md:text-right">
                  <div className="space-y-3 md:space-y-4">
                    <div className="font-playfair italic text-[60px] sm:text-[80px] md:text-[120px] leading-none text-[#F1F1F1] opacity-[0.15]">
                      01
                    </div>
                    <h3 className="font-bodoni text-[28px] sm:text-[32px] md:text-[40px] text-white -mt-12 sm:-mt-16 md:-mt-20">
                      Free Selfie Guide
                    </h3>
                    <p className="font-inter text-sm md:text-base text-white/60 leading-relaxed">
                      The basics that changed everything. Five poses, proper lighting, and why your bathroom mirror is lying to you.
                    </p>
                    <div className="font-inter text-[10px] md:text-xs tracking-[0.25em] md:tracking-[0.3em] uppercase text-white/40">
                      Start Here • Free
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2 flex justify-start md:justify-center absolute left-4 top-8 md:relative md:left-auto md:top-auto">
                  <div className="w-3 h-3 md:w-4 md:h-4 bg-white rounded-full relative">
                    <div className="absolute inset-0 bg-white rounded-full animate-ping"></div>
                  </div>
                </div>

                <div className="md:col-span-5"></div>
              </div>
            </div>

            {/* Step 2: Starter Kit */}
            <div className="relative mb-16 sm:mb-20 md:mb-32 observe-me">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center">
                <div className="md:col-span-5 order-2 md:order-1"></div>

                <div className="md:col-span-2 flex justify-start md:justify-center order-1 md:order-2 absolute left-4 top-8 md:relative md:left-auto md:top-auto">
                  <div className="w-3 h-3 md:w-4 md:h-4 bg-white/50 rounded-full"></div>
                </div>

                <div className="md:col-span-5 text-left pl-12 md:pl-0 order-3">
                  <div className="space-y-3 md:space-y-4">
                    <div className="font-playfair italic text-[60px] sm:text-[80px] md:text-[120px] leading-none text-[#F1F1F1] opacity-[0.15]">
                      02
                    </div>
                    <h3 className="font-bodoni text-[28px] sm:text-[32px] md:text-[40px] text-white -mt-12 sm:-mt-16 md:-mt-20">
                      Selfie Starter Kit • $67
                    </h3>
                    <p className="font-inter text-sm md:text-base text-white/60 leading-relaxed">
                      30 days of showing up. Daily poses, caption templates, and the exact editing workflow I use. No more second-guessing.
                    </p>
                    <div className="font-inter text-[10px] md:text-xs tracking-[0.25em] md:tracking-[0.3em] uppercase text-white/40">
                      Level Up • Most Popular
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Branded */}
            <div className="relative mb-16 sm:mb-20 md:mb-32 observe-me">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center">
                <div className="md:col-span-5 text-left pl-12 md:pl-0 md:text-right">
                  <div className="space-y-3 md:space-y-4">
                    <div className="font-playfair italic text-[60px] sm:text-[80px] md:text-[120px] leading-none text-[#F1F1F1] opacity-[0.15]">
                      03
                    </div>
                    <h3 className="font-bodoni text-[28px] sm:text-[32px] md:text-[40px] text-white -mt-12 sm:-mt-16 md:-mt-20">
                      Branded By Selfie • $397
                    </h3>
                    <p className="font-inter text-sm md:text-base text-white/60 leading-relaxed">
                      Your complete brand transformation. 12 weeks of strategy, tools, and the confidence to charge what you're worth.
                    </p>
                    <div className="font-inter text-[10px] md:text-xs tracking-[0.25em] md:tracking-[0.3em] uppercase text-white/40">
                      Full Transformation • Best Value
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2 flex justify-start md:justify-center absolute left-4 top-8 md:relative md:left-auto md:top-auto">
                  <div className="w-3 h-3 md:w-4 md:h-4 bg-white/50 rounded-full"></div>
                </div>

                <div className="md:col-span-5"></div>
              </div>
            </div>

            {/* Step 4: VIP */}
            <div className="relative observe-me">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center">
                <div className="md:col-span-5 order-2 md:order-1"></div>

                <div className="md:col-span-2 flex justify-start md:justify-center order-1 md:order-2 absolute left-4 top-8 md:relative md:left-auto md:top-auto">
                  <div className="w-4 md:w-6 h-4 md:h-6 bg-white rounded-full relative">
                    <div className="absolute inset-0 bg-white/20 rounded-full scale-125 md:scale-150"></div>
                  </div>
                </div>

                <div className="md:col-span-5 text-left pl-12 md:pl-0 order-3">
                  <div className="space-y-3 md:space-y-4">
                    <div className="font-playfair italic text-[60px] sm:text-[80px] md:text-[120px] leading-none text-[#F1F1F1] opacity-[0.15]">
                      04
                    </div>
                    <h3 className="font-bodoni text-[28px] sm:text-[32px] md:text-[40px] text-white -mt-12 sm:-mt-16 md:-mt-20">
                      VIP Automated Brand • Apply
                    </h3>
                    <p className="font-inter text-sm md:text-base text-white/60 leading-relaxed">
                      I'll build your entire system with you. From first selfie to six figures. This is for women ready to go all in.
                    </p>
                    <div className="font-inter text-[10px] md:text-xs tracking-[0.25em] md:tracking-[0.3em] uppercase text-white/40">
                      Apply Only • Limited Spots
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-20 sm:mt-24 md:mt-32">
            <Link href="/start-here">
              <button className="group relative overflow-hidden bg-white text-black px-12 sm:px-16 py-5 md:py-6">
                <span className="relative z-10 font-inter text-[10px] md:text-xs tracking-[0.25em] md:tracking-[0.3em] uppercase">
                  Okay, I'm Ready
                </span>
                <div className="absolute inset-0 bg-black transform translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                <span className="absolute inset-0 flex items-center justify-center font-inter text-[10px] md:text-xs tracking-[0.25em] md:tracking-[0.3em] uppercase text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                  Okay, I'm Ready
                </span>
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* TOOLS Section */}
      <section id="tools" className="py-32 relative">
        <div className="editorial-number top-40 right-0 translate-x-1/4">03</div>
        <div className="container mx-auto px-4 md:px-12">
          <div className="text-center mb-20">
            <p className="text-xs tracking-[0.3em] uppercase text-white/50 mb-6">Your Tools</p>
            <h2 className="font-bodoni text-5xl md:text-7xl tracking-[-0.04em]">
              Everything you need<br/>
              <span className="font-playfair italic">to start showing up.</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* The Glow Check */}
            <Link href="/tools/glow-check" className="group relative overflow-hidden luxury-hover">
              <article className="relative h-[600px]">
                <Image 
                  src="/images/tools/glow-check.jpg" 
                  alt="The Glow Check tool interface" 
                  fill
                  className="object-cover scale-110 group-hover:scale-100 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#171719] via-[#171719]/50 to-transparent" />
                <div className="absolute top-8 left-8 w-16 h-16 border border-white/20 flex items-center justify-center">
                  <span className="text-xs font-bodoni text-white">01</span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-12">
                  <p className="text-xs tracking-[0.3em] uppercase text-white mb-4">Get real feedback</p>
                  <h3 className="font-bodoni text-3xl tracking-[-0.02em] mb-4 text-white">The Glow Check™</h3>
                  <p className="text-white font-light mb-6">Upload a selfie. Get honest feedback. Actually helpful, not harsh.</p>
                  <div className="w-full h-px bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
                </div>
              </article>
            </Link>
            {/* Future Self AI */}
            <Link href="/tools/future-self" className="group relative overflow-hidden luxury-hover">
              <article className="relative h-[600px]">
                <Image 
                  src="/images/tools/future-self.jpg" 
                  alt="Future Self AI visualization tool" 
                  fill
                  className="object-cover scale-110 group-hover:scale-100 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#171719] via-[#171719]/50 to-transparent" />
                <div className="absolute top-8 left-8 w-16 h-16 border border-white/20 flex items-center justify-center">
                  <span className="text-xs font-bodoni text-white">02</span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-12">
                  <p className="text-xs tracking-[0.3em] uppercase text-white mb-4">See your potential</p>
                  <h3 className="font-bodoni text-3xl tracking-[-0.02em] mb-4 text-white">Future Self AI</h3>
                  <p className="text-white font-light mb-6">Visualize where you're going. Sometimes we need to see it to believe it.</p>
                  <div className="w-full h-px bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
                </div>
              </article>
            </Link>
            {/* Content Calendar */}
            <Link href="/tools/content-calendar" className="group relative overflow-hidden luxury-hover">
              <article className="relative h-[600px]">
                <Image 
                  src="/images/tools/content-calendar.jpg" 
                  alt="Content Calendar tool" 
                  fill
                  className="object-cover scale-110 group-hover:scale-100 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#171719] via-[#171719]/50 to-transparent" />
                <div className="absolute top-8 left-8 w-16 h-16 border border-white/20 flex items-center justify-center">
                  <span className="text-xs font-bodoni text-white">03</span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-12">
                  <p className="text-xs tracking-[0.3em] uppercase text-white mb-4">Plan with ease</p>
                  <h3 className="font-bodoni text-3xl tracking-[-0.02em] mb-4 text-white">Content Calendar</h3>
                  <p className="text-white font-light mb-6">Never run out of content ideas. AI-powered planning for real results.</p>
                  <div className="w-full h-px bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
                </div>
              </article>
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER CTA SECTION */}
      <section className="relative bg-white py-24 sm:py-32 md:py-48 overflow-hidden observe-me">
        <div className="absolute top-0 left-0 font-playfair italic text-[600px] md:text-[800px] text-[#171719]/[0.02] leading-none select-none pointer-events-none">
          S
        </div>

        <div className="relative max-w-[1000px] mx-auto px-4 sm:px-8 md:px-16 text-center">
          <h2 className="font-bodoni text-[40px] sm:text-[56px] md:text-[80px] leading-[0.9] text-[#171719] mb-8 md:mb-12">
            Ready to build your brand<br/>
            from your camera roll?
          </h2>

          <p className="font-inter text-lg md:text-xl text-[#4C4B4B] leading-relaxed mb-12 md:mb-16 max-w-2xl mx-auto">
            I built this platform because I was tired of watching brilliant women hide behind bad photos and borrowed quotes. You have something to say. Let's make sure people listen.
          </p>

          <p className="font-inter text-[10px] md:text-xs uppercase tracking-[0.3em] text-[#B5B5B3] mb-8">
            Join 10,000+ women who stopped waiting for perfect and started showing up as themselves.
          </p>

          <form onSubmit={handleEmailSubmit} className="max-w-md mx-auto">
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your best email"
                required
                disabled={isSubmitting}
                aria-label="Email address"
                className="w-full px-0 py-4 text-lg bg-transparent border-0 border-b-2 border-[#171719]/20 placeholder:text-[#B5B5B3] focus:border-[#171719] focus:outline-none font-inter transition-colors duration-300 disabled:opacity-50"
              />
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-8 bg-[#171719] text-white py-5 font-inter text-[11px] uppercase tracking-[0.3em] transition-all duration-500 hover:translate-y-[-2px] hover:shadow-lg disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {isSubmitting ? 'SENDING...' : 'YES, SEND ME THE GUIDE'}
            </button>

            {submitMessage && (
              <p className={`mt-4 text-sm ${submitMessage.includes('Check') ? 'text-green-600' : 'text-red-600'}`}>
                {submitMessage}
              </p>
            )}
          </form>

          <p className="mt-6 font-inter text-[10px] uppercase tracking-[0.2em] text-[#B5B5B3]">
            Join 10,000+ women building real brands
          </p>
        </div>
      </section>
    </div>
  );
}