'use client'

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import dynamic from 'next/dynamic';

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

// Add a type-safe gtag function
function gtag(
  event: 'event',
  action: string,
  params: Record<string, unknown>
): void {
  if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
    (window as any).gtag(event, action, params);
  }
}

// ErrorBoundary component
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: any, info: any) {
    // Log error if needed
    // console.error(error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#F1F1F1] text-[#171719] p-8">
          <h1 className="text-3xl font-bodoni mb-4">Something went wrong</h1>
          <p className="text-lg mb-8">Sorry, an unexpected error occurred. Please refresh the page or try again later.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function HomeWithBoundary() {
  return <ErrorBoundary><Home /></ErrorBoundary>;
}

function Home() {
  const [email, setEmail] = useState('');
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  
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
    
    let lastUpdate = 0;
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastUpdate > 16) { // ~60fps
        setCursorPos({ x: e.clientX, y: e.clientY });
        lastUpdate = now;
      }
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Loading sequence with cleanup
  useEffect(() => {
    setIsLoading(false);
    setHeroLoaded(true);
    return () => {};
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
    setSubmitMessage('');
    setEmailError(null);
    // Validate email before submitting
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address.');
      return;
    }
    setIsSubmitting(true);
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
        gtag('event', 'conversion', {
          send_to: 'SELFIE_AI/homepage_signup',
          value: 1.0,
          currency: 'USD'
        });
      } else {
        const data = await response.json();
        setSubmitMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
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
    <div className="min-h-screen bg-white w-full">
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
      <section className="relative min-h-screen overflow-hidden">
        {/* Full-bleed background image with overlay */}
        <div className="absolute inset-0">
          <Image
            src="/images/hero-background.jpg"
            alt="Sandra hero image"
            fill
            className="w-full h-full object-cover"
            priority
            sizes="100vw"
          />
          {/* Gradient overlay for text readability (lighter for more image visibility) */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#171719]/60 via-[#171719]/30 to-transparent"></div>
        </div>

        {/* Navigation - absolute positioned */}
        <nav className="absolute top-0 left-0 right-0 z-50 px-6 md:px-16 lg:px-24 py-8">
          <div className="flex items-center justify-between">
            <div className="text-white">
              <img src="https://i.postimg.cc/L88db1fc/White-transperent-logo.png" alt="SELFIE AI Logo" className="h-8" />
            </div>
            <div className="hidden md:flex items-center gap-12">
              <a href="/about" className="font-inter text-[11px] uppercase tracking-[0.3em] text-white/80 hover:text-white transition-colors">About</a>
              <a href="/tools" className="font-inter text-[11px] uppercase tracking-[0.3em] text-white/80 hover:text-white transition-colors">Tools</a>
              <a href="/stories" className="font-inter text-[11px] uppercase tracking-[0.3em] text-white/80 hover:text-white transition-colors">Stories</a>
            </div>
            <a href="/start-here" className="hidden md:inline-block bg-white text-[#171719] px-8 py-3 font-inter text-[11px] uppercase tracking-[0.3em] hover:bg-[#F1F1F1] transition-colors" aria-label="Navigate to start page">
              Let's Begin
            </a>
            {/* Hamburger for mobile */}
            <button
              className="md:hidden flex items-center justify-center w-10 h-10 text-white focus:outline-none"
              aria-label="Open menu"
              onClick={() => setMobileMenuOpen(true)}
            >
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-menu"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
          </div>
          {/* Mobile Menu Drawer */}
          {mobileMenuOpen && (
            <div className="fixed inset-0 z-[100] bg-[#171719]/95 flex flex-col">
              <button
                className="absolute top-6 right-6 text-white text-3xl focus:outline-none"
                aria-label="Close menu"
                onClick={() => setMobileMenuOpen(false)}
              >
                &times;
              </button>
              <nav className="flex flex-col items-center justify-center flex-1 gap-10">
                <a href="/about" className="font-inter text-xl uppercase tracking-[0.3em] text-white/80 hover:text-white transition-colors" onClick={() => setMobileMenuOpen(false)}>About</a>
                <a href="/tools" className="font-inter text-xl uppercase tracking-[0.3em] text-white/80 hover:text-white transition-colors" onClick={() => setMobileMenuOpen(false)}>Tools</a>
                <a href="/stories" className="font-inter text-xl uppercase tracking-[0.3em] text-white/80 hover:text-white transition-colors" onClick={() => setMobileMenuOpen(false)}>Stories</a>
                <a href="/start-here" className="bg-white text-[#171719] px-8 py-3 font-inter text-[13px] uppercase tracking-[0.3em] hover:bg-[#F1F1F1] transition-colors" onClick={() => setMobileMenuOpen(false)} aria-label="Navigate to start page">
                  Let's Begin
                </a>
              </nav>
            </div>
          )}
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 min-h-screen flex items-center">
          <div className="max-w-[1400px] mx-auto px-6 md:px-16 lg:px-24 w-full">
            <div className="max-w-4xl">
              {/* Small accent text */}
              <p className="font-inter text-[11px] uppercase tracking-[0.35em] text-white/60 mb-8">
                The personal brand platform that works
              </p>

              {/* Main headline with proper typography */}
              <h1 className="font-bodoni text-[48px] sm:text-[72px] md:text-[96px] lg:text-[144px] leading-[0.85] text-white mb-8">
                Your selfie<br className="hidden sm:block"/>
                is your brand
              </h1>

              {/* Subheadline with better spacing */}
              <div className="space-y-4 mb-12 max-w-2xl">
                <p className="font-inter text-[20px] leading-relaxed text-white/80 italic">
                  You don't need another course telling you to "just be yourself."
                </p>
                <p className="font-inter text-[20px] leading-relaxed text-white/80">
                  You need a strategy that works with who you already are.
                </p>
              </div>

              {/* CTA Buttons with proper styling */}
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="/start-here" className="group relative overflow-hidden bg-white text-[#171719] px-10 py-4 font-inter text-[11px] uppercase tracking-[0.3em] hover:bg-[#F1F1F1] transition-all duration-300">
                  <span className="relative z-10">Let's Do This Together</span>
                </a>
                <a href="/stories" className="group relative border border-white/30 text-white px-10 py-4 font-inter text-[11px] uppercase tracking-[0.3em] hover:bg-white hover:text-[#171719] transition-all duration-300">
                  <span className="relative z-10">Here's What Happened</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Editorial number accent */}
        <div className="absolute bottom-20 right-20 pointer-events-none">
          <span className="font-bodoni italic text-[400px] text-white/[0.02] leading-none">01</span>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="w-px h-16 bg-white/20 relative">
            <div className="absolute top-0 w-px h-8 bg-white animate-scroll"></div>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className="py-20 md:py-32 bg-[#FAFAF8]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-24">
          {/* Editorial Number (repositioned) */}
          <div className="relative mb-16">
            <div style={{ fontFamily: 'Lingerie' }} className="text-[200px] md:text-[300px] text-[#171719]/[0.03] absolute -top-24 -left-8 select-none pointer-events-none">
              01
            </div>
          </div>
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start">
            {/* Story Content */}
            <div className="lg:col-span-7 relative z-10">
              <h3 className="story-opener">"I just needed a way to show up."</h3>
              <div className="space-y-6">
                <p className="story-body">
                  Three years ago, I was sitting in my car after my divorce, scrolling through Instagram, wondering how everyone else made it look so easy.
                </p>
                <p className="story-body">
                  I had an iPhone, three kids, and zero confidence. But I also had this feeling that I was meant for more. That my story could help someone else going through the same thing.
                </p>
                <div className="story-highlight">
                  "I figured out the light, the angles, the editing. More importantly, I figured out how to stop hiding."
                </div>
                <p className="story-body">
                  So I started taking selfies. Bad ones at first. Really bad. But I kept going. I figured out the light, the angles, the editing. More importantly, I figured out how to stop hiding.
                </p>
                <p className="story-body">
                  Now I help women build their entire personal brand from their camera roll. Because honestly? Your phone is all you need.
                </p>
              </div>
              <div className="mt-12">
                <p className="story-cta">Let's build something real together...</p>
                <img src="https://i.postimg.cc/NMsTRh2K/Sandra-Signature-homepage.png" alt="Sandra's signature" className="h-16 mt-6 opacity-80" />
              </div>
              {/* CTA Button */}
              <a href="/start-here" className="inline-flex items-center justify-center mt-8 px-8 py-4 bg-[#171719] text-white font-inter text-[11px] uppercase tracking-[0.2em] hover:bg-[#171719]/90 transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-[#171719]">
                Start Your Journey
              </a>
            </div>
            {/* Image Section */}
            <div className="lg:col-span-5 relative image-section">
              {/* Main Portrait */}
              <div className="relative">
                <Image
                  src="/images/sandra-portrait.jpg"
                  alt="Sandra - Founder of SELFIE AI™"
                  width={600}
                  height={800}
                  className="w-full h-auto"
                  priority={false}
                />
                {/* Floating Stats Card */}
                <div className="absolute -bottom-8 -left-8 bg-white p-6 shadow-2xl">
                  <div style={{ fontFamily: 'Lingerie' }} className="text-[48px] text-[#171719]/10">120K</div>
                  <p className="font-inter text-[10px] uppercase tracking-[0.2em] text-[#171719] -mt-4">
                    Followers in 90 days
                  </p>
                </div>
              </div>
              {/* Pull Quote */}
              <div className="mt-16 pl-8 border-l border-[#171719]/20">
                <p style={{ fontFamily: 'BodoniFLF', fontStyle: 'italic' }} className="text-[20px] text-[#171719]/80">
                  "Your phone is all you need to build a brand that works."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <TestimonialsSection />

      {/* STATS SECTION */}
      <section className="relative min-h-screen flex items-center bg-[#FAFAF8] overflow-hidden">
        {/* Background Number */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none z-0">
          <span style={{ fontFamily: 'Lingerie' }} className="text-[60vw] leading-[0.8] text-[#171719]/[0.02]">90</span>
        </div>
        <div className="stats-container relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-24 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
            {/* Content Side */}
            <div className="lg:col-span-6 stats-content">
              <div className="section-label fade-in-up mb-12 flex items-center gap-4 uppercase tracking-[0.3em] text-[11px] text-[#B5B5B3]">
                <span className="inline-block w-6 h-px bg-[#B5B5B3] mr-2"></span>
                The Truth
              </div>
              <div className="stats-numbers grid grid-cols-1 sm:grid-cols-3 gap-8 mb-12">
                <div className="stat-item fade-in-up">
                  <div className="font-bodoni text-[48px] sm:text-[56px] md:text-[72px] leading-[0.9] text-[#171719] mb-2 font-light tracking-[-0.02em]">120K</div>
                  <div className="stat-label text-[11px] uppercase tracking-[0.2em] text-[#B5B5B3] font-normal">Followers Built</div>
                </div>
                <div className="stat-item fade-in-up">
                  <div className="font-bodoni text-[48px] sm:text-[56px] md:text-[72px] leading-[0.9] text-[#171719] mb-2 font-light tracking-[-0.02em]">1.7M</div>
                  <div className="stat-label text-[11px] uppercase tracking-[0.2em] text-[#B5B5B3] font-normal">Monthly Reach</div>
                </div>
                <div className="stat-item fade-in-up">
                  <div className="font-bodoni text-[48px] sm:text-[56px] md:text-[72px] leading-[0.9] text-[#171719] mb-2 font-light tracking-[-0.02em]">90</div>
                  <div className="stat-label text-[11px] uppercase tracking-[0.2em] text-[#B5B5B3] font-normal">Days to Transform</div>
                </div>
              </div>
              <div className="stats-quote fade-in-up pl-6 border-l border-[#171719] mb-8">
                <p className="font-bodoni italic text-[20px] sm:text-[24px] text-[#171719] mb-6 leading-[1.5]">This isn't hype. These are real numbers from real women who stopped overthinking and started showing up.</p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-px bg-[#171719]"></div>
                  <div className="text-[12px] uppercase tracking-[0.2em] text-[#171719]">Sandra Sigurjonsdottir</div>
                </div>
              </div>
              <a href="/stories" className="stats-cta fade-in-up inline-block mt-8 px-10 py-4 bg-[#171719] text-white text-[11px] uppercase tracking-[0.2em] transition-all duration-500 hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#171719]">Read Their Stories</a>
            </div>
            {/* Image Side */}
            <div className="lg:col-span-6 stats-image fade-in-up relative h-[400px] md:h-[600px] flex items-center justify-center order-first lg:order-last">
              <div className="image-wrapper w-full h-full relative">
                <Image
                  src="/images/final-quote-image-1.png"
                  alt="Sandra Sigurjonsdottir - Founder & Former Overthinking Expert"
                  fill
                  className="portrait-image w-full h-full object-cover object-top"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                  priority={false}
                />
                <div className="image-overlay absolute bottom-6 right-6 bg-white p-8 max-w-xs shadow-2xl">
                  <div className="overlay-date text-[10px] uppercase tracking-[0.2em] text-[#B5B5B3] mb-2">Norway • 2025</div>
                  <div className="overlay-title font-bodoni italic text-[20px] text-[#171719] leading-[1.3]">Founder & Former Overthinking Expert</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

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

      {/* VALUE LADDER SECTION */}
      <OfferLadderSection />

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
            {emailError && (
              <p className="mt-2 text-sm text-red-600">{emailError}</p>
            )}
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

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "SELFIE AI™",
          "description": "Personal brand platform helping women show up confidently online",
          "url": "https://selfie-ai.com",
          "logo": "https://selfie-ai.com/logo.png",
          "founder": {
            "@type": "Person",
            "name": "Sandra Sigurjonsdottir",
            "jobTitle": "Founder & CEO"
          },
          "foundingDate": "2022",
          "sameAs": [
            "https://instagram.com/selfieai",
            "https://facebook.com/selfieai",
            "https://linkedin.com/company/selfie-ai"
          ]
        }) }}
      />
    </div>
  );
}

const TestimonialsSection = dynamic(() => import('./components/TestimonialsSection'), {
  loading: () => <div className="h-96 bg-gray-100 animate-pulse" />,
  ssr: false
});

const OfferLadderSection = dynamic(() => import('./components/OfferLadderSection'), {
  loading: () => <div className="h-[70vh] bg-gray-100 animate-pulse" />,
  ssr: false
});