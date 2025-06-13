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

      {/* Hero Section */}
      <section className="relative min-h-screen bg-white overflow-hidden">
        {/* Hero Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(https://i.postimg.cc/T30rkYjR/IMG-5635.jpg)' }}
        ></div>
        
        {/* Dark Overlay for Text Readability */}
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        
        <div className="relative max-w-[1600px] mx-auto px-8 md:px-16 lg:px-24 pt-32 pb-24">
          {/* Navigation */}
          <nav className="flex justify-between items-center mb-32">
            <div className="font-['Neue_Einstellung'] text-xs tracking-[0.3em] uppercase text-white">
              Selfie AI™
            </div>
            <div className="flex gap-12">
              <Link href="/pricing" className="font-['Neue_Einstellung'] text-xs tracking-[0.2em] uppercase text-white hover:opacity-60 transition-opacity">About</Link>
              <Link href="/studio" className="font-['Neue_Einstellung'] text-xs tracking-[0.2em] uppercase text-white hover:opacity-60 transition-opacity">Tools</Link>
              <Link href="/dashboard" className="font-['Neue_Einstellung'] text-xs tracking-[0.2em] uppercase text-white hover:opacity-60 transition-opacity">Start</Link>
            </div>
          </nav>
          
          {/* Hero Content */}
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-12 lg:col-span-8">
              <h1 className="font-['Bordoni_FLF'] text-[80px] md:text-[120px] lg:text-[160px] leading-[0.9] tracking-[-0.03em] mb-12 text-white text-left">
                <div className="leading-[1.1]">Your selfie</div>
                <span className="italic font-light">is your</span><br/>
                <div className="leading-[1.1]">brand.</div>
              </h1>
              
              <div className="max-w-xl">
                <p className="font-['Neue_Einstellung'] text-lg leading-relaxed text-white/80 mb-4">
                  Let's make it work for you.
                </p>
                <p className="font-['Neue_Einstellung'] text-lg leading-relaxed text-white/80 mb-12">
                  You don't need to do more. You just need to show up with strategy.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Link href="/dashboard">
                    <button className="group relative overflow-hidden bg-white text-black px-12 py-5">
                      <span className="relative z-10 font-['Neue_Einstellung'] text-xs tracking-[0.2em] uppercase">Start Here</span>
                      <div className="absolute inset-0 bg-black transform translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                      <span className="absolute inset-0 flex items-center justify-center font-['Neue_Einstellung'] text-xs tracking-[0.2em] uppercase text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">Start Here</span>
                    </button>
                  </Link>
                  
                  <button className="group relative overflow-hidden bg-transparent border border-white text-white px-12 py-5 hover:bg-white hover:text-black transition-all duration-300">
                    <span className="font-['Neue_Einstellung'] text-xs tracking-[0.2em] uppercase">Explore Tools</span>
                  </button>
                </div>
              </div>
            </div>
            
            <div className="col-span-12 lg:col-span-4 relative">
              <img src="/sandra-portrait-editorial.jpg" alt="Sandra Sigurjonsdottir" className="w-full h-[600px] object-cover grayscale" />
              <div className="absolute bottom-8 left-8 right-8 bg-white/90 backdrop-blur p-6">
                <p className="font-['Bordoni_FLF'] italic text-lg">— Sandra Sigurjonsdottir</p>
                <p className="font-['Neue_Einstellung'] text-xs tracking-wider uppercase mt-1">Founder & Creator</p>
              </div>
            </div>
          </div>
          
          {/* Hero Tagline */}
          <div className="text-center mt-24">
            <p className="font-['Bordoni_FLF'] italic text-white text-lg md:text-xl">
              This is how we turn your camera roll into your brand.
            </p>
          </div>
        </div>
      </section>

      {/* Proof Section */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-[1400px] mx-auto px-8 md:px-16 lg:px-24 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="font-['Bordoni_FLF'] text-[48px] md:text-[64px] leading-tight">120K</div>
              <div className="font-['Neue_Einstellung'] text-xs tracking-[0.3em] uppercase text-black/60">Followers</div>
            </div>
            <div>
              <div className="font-['Bordoni_FLF'] text-[48px] md:text-[64px] leading-tight">1.7M</div>
              <div className="font-['Neue_Einstellung'] text-xs tracking-[0.3em] uppercase text-black/60">Monthly Reach</div>
            </div>
            <div>
              <div className="font-['Bordoni_FLF'] text-[48px] md:text-[64px] leading-tight">90</div>
              <div className="font-['Neue_Einstellung'] text-xs tracking-[0.3em] uppercase text-black/60">Days</div>
            </div>
          </div>
          <p className="font-['Bordoni_FLF'] italic text-xl text-black/80">
            This isn't hype. It's what's possible.
          </p>
        </div>
      </section>

      {/* About Section */}
      <section className="min-h-screen flex items-center bg-[#FAFAF8]">
        <div className="max-w-[1600px] mx-auto px-8 md:px-16 lg:px-24 py-32">
          <div className="grid grid-cols-12 gap-16 items-center">
            {/* Large Typography */}
            <div className="col-span-12 lg:col-span-3">
              <div className="font-['Lingerie_Typeface'] text-[300px] md:text-[400px] leading-none -ml-8">
                01
              </div>
            </div>
            
            {/* Story Content */}
            <div className="col-span-12 lg:col-span-6">
              <div className="space-y-8">
                <p className="font-['Bordoni_FLF'] text-[48px] md:text-[64px] leading-tight">
                  "I needed a way to show up."
                </p>
                
                <div className="space-y-6 text-black/80">
                  <p className="font-['Neue_Einstellung'] text-lg leading-relaxed">
                    I created this because I was done second-guessing myself online.
                  </p>
                  <p className="font-['Neue_Einstellung'] text-lg leading-relaxed">
                    I wanted to post with confidence. To feel proud of what I was building.
                  </p>
                  <p className="font-['Neue_Einstellung'] text-lg leading-relaxed">
                    After my divorce, I had nothing but my iPhone, a vision, and the nerve to start showing up anyway.
                  </p>
                  <p className="font-['Neue_Einstellung'] text-lg leading-relaxed">
                    SELFIE AI™ is the exact system I wish I had back then.
                  </p>
                </div>
                
                <p className="font-['Bordoni_FLF'] italic text-2xl pt-4">
                  Let's do this together, shall we…
                </p>
              </div>
              
              <div className="mt-12">
                <img src="https://i.postimg.cc/NMsTRh2K/Sandra-Signature-homepage.png" alt="Sandra's Signature" className="h-16 opacity-80" />
              </div>
            </div>
            
            {/* Image */}
            <div className="col-span-12 lg:col-span-3">
              <img src="/sandra-working.jpg" alt="Sandra at work" className="w-full h-[500px] object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="min-h-screen flex items-center bg-[#FAFAF8]">
        <div className="max-w-[1600px] mx-auto px-8 md:px-16 lg:px-24 py-32">
          <div className="grid grid-cols-12 gap-16 items-center">
            {/* Large Typography */}
            <div className="col-span-12 lg:col-span-3">
              <div className="font-['Lingerie_Typeface'] text-[300px] md:text-[400px] leading-none -ml-8">
                01
              </div>
            </div>
            
            {/* Story Content */}
            <div className="col-span-12 lg:col-span-6">
              <h2 className="font-['Bordoni_FLF'] text-[48px] md:text-[64px] leading-tight mb-8">
                From Heartbreak<br/>
                <span className="italic font-light">to Headlines</span>
              </h2>
              
              <div className="space-y-6 font-['Neue_Einstellung'] text-lg leading-relaxed text-black/80">
                <p>
                  I built my first personal brand from rock bottom. After my divorce, I had a camera, a vision, and the audacity to believe I could turn selfies into a six-figure business.
                </p>
                
                <p>
                  Today, I help women skip the struggle and go straight to strategy. SELFIE AI™ is everything I wish I had when I started—the tools, templates, and confidence to show up like the luxury brand you already are.
                </p>
                
                <p className="font-['Bordoni_FLF'] italic text-2xl pt-4">
                  "Your camera roll is a goldmine. Let me show you how to refine it."
                </p>
              </div>
              
              <div className="mt-12">
                <img src="https://i.postimg.cc/NMsTRh2K/Sandra-Signature-homepage.png" alt="Sandra's Signature" className="h-16 opacity-80" />
              </div>
            </div>
            
            {/* Image */}
            <div className="col-span-12 lg:col-span-3">
              <img src="/sandra-working.jpg" alt="Sandra at work" className="w-full h-[500px] object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Audience Archetypes */}
      <section className="bg-white py-32">
        <div className="max-w-[1600px] mx-auto px-8 md:px-16 lg:px-24">
          {/* Section Header */}
          <div className="flex items-baseline gap-8 mb-24">
            <div className="font-['Lingerie_Typeface'] text-[120px] leading-none">02</div>
            <div>
              <h2 className="font-['Bordoni_FLF'] text-[48px] md:text-[64px] tracking-tight">
                Who It's For
              </h2>
              <div className="w-32 h-px bg-black mt-4"></div>
            </div>
          </div>
          
          {/* Archetype Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-black/10">
            {/* The Visionary */}
            <div className="bg-white p-12 group hover:bg-black hover:text-white transition-all duration-700">
              <div className="mb-8">
                <img src="https://i.postimg.cc/sgxn9PZX/141.png" alt="The Visionary" className="w-full h-[400px] object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
              </div>
              
              <div className="font-['Neue_Einstellung'] text-xs tracking-[0.3em] uppercase mb-4 opacity-60">
                The Visionary
              </div>
              
              <h3 className="font-['Bordoni_FLF'] text-[32px] leading-tight mb-6">
                You see the bigger picture
              </h3>
              
              <p className="font-['Neue_Einstellung'] text-base leading-relaxed opacity-80">
                But your brand doesn't reflect your vision yet. You need sophisticated tools that match your ambition.
              </p>
            </div>
            
            {/* The Phoenix */}
            <div className="bg-white p-12 group hover:bg-black hover:text-white transition-all duration-700">
              <div className="mb-8">
                <img src="https://i.postimg.cc/YqQMgyPp/106.png" alt="The Phoenix" className="w-full h-[400px] object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
              </div>
              
              <div className="font-['Neue_Einstellung'] text-xs tracking-[0.3em] uppercase mb-4 opacity-60">
                The Phoenix
              </div>
              
              <h3 className="font-['Bordoni_FLF'] text-[32px] leading-tight mb-6">
                You're rebuilding stronger
              </h3>
              
              <p className="font-['Neue_Einstellung'] text-base leading-relaxed opacity-80">
                After life's plot twist, you're ready to show up differently. Let's make your comeback your best chapter.
              </p>
            </div>
            
            {/* The Luminary */}
            <div className="bg-white p-12 group hover:bg-black hover:text-white transition-all duration-700">
              <div className="mb-8">
                <img src="https://i.postimg.cc/Bng37Psk/107.png" alt="The Luminary" className="w-full h-[400px] object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
              </div>
              
              <div className="font-['Neue_Einstellung'] text-xs tracking-[0.3em] uppercase mb-4 opacity-60">
                The Luminary
              </div>
              
              <h3 className="font-['Bordoni_FLF'] text-[32px] leading-tight mb-6">
                You're ready to shine
              </h3>
              
              <p className="font-['Neue_Einstellung'] text-base leading-relaxed opacity-80">
                You have wisdom to share but need the right aesthetic. Time to package your brilliance beautifully.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Value Ladder Section */}
      <section className="bg-black py-32 md:py-48 relative overflow-hidden">
        {/* Background Design Element */}
        <div className="absolute top-0 right-0 font-['Lingerie_Typeface'] text-[600px] md:text-[800px] text-white/5 leading-none select-none">
          06
        </div>
        
        <div className="relative max-w-[1400px] mx-auto px-8 md:px-16 lg:px-24">
          {/* Section Header */}
          <div className="text-center mb-32">
            <h2 className="font-['Bordoni_FLF'] text-[48px] md:text-[72px] tracking-tight text-white mb-8">
              Your Journey Starts Here
            </h2>
            <p className="font-['Neue_Einstellung'] text-lg text-white/60 max-w-2xl mx-auto">
              Choose your path. Each step builds on the last, creating your complete transformation.
            </p>
          </div>
          
          {/* Journey Path */}
          <div className="relative">
            {/* Connecting Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/10 transform -translate-x-1/2 hidden md:block"></div>
            
            {/* Step 1: Free Guide */}
            <div className="relative mb-24 md:mb-32">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                <div className="md:col-span-5 text-left md:text-right">
                  <div className="space-y-4">
                    <div className="font-['Lingerie_Typeface'] text-[80px] md:text-[120px] leading-none text-white/10">
                      01
                    </div>
                    <h3 className="font-['Bordoni_FLF'] text-[32px] md:text-[40px] text-white -mt-16 md:-mt-20">
                      Free Selfie Guide
                    </h3>
                    <p className="font-['Neue_Einstellung'] text-white/60 leading-relaxed">
                      5 poses that work every time. The lighting secrets I use. Your first step to confidence.
                    </p>
                    <div className="font-['Neue_Einstellung'] text-xs tracking-[0.3em] uppercase text-white/40">
                      Start Here • Free
                    </div>
                  </div>
                </div>
                
                {/* Center Node */}
                <div className="md:col-span-2 flex justify-center">
                  <div className="w-4 h-4 bg-white rounded-full relative">
                    <div className="absolute inset-0 bg-white rounded-full animate-ping"></div>
                  </div>
                </div>
                
                <div className="md:col-span-5">
                  {/* Empty for alternating layout */}
                </div>
              </div>
            </div>
            
            {/* Step 2: Starter Kit */}
            <div className="relative mb-24 md:mb-32">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                <div className="md:col-span-5 order-2 md:order-1">
                  {/* Empty for alternating layout */}
                </div>
                
                {/* Center Node */}
                <div className="md:col-span-2 flex justify-center order-1 md:order-2">
                  <div className="w-4 h-4 bg-white/50 rounded-full"></div>
                </div>
                
                <div className="md:col-span-5 text-left order-3">
                  <div className="space-y-4">
                    <div className="font-['Lingerie_Typeface'] text-[80px] md:text-[120px] leading-none text-white/10">
                      02
                    </div>
                    <h3 className="font-['Bordoni_FLF'] text-[32px] md:text-[40px] text-white -mt-16 md:-mt-20">
                      Selfie Starter Kit
                    </h3>
                    <p className="font-['Neue_Einstellung'] text-white/60 leading-relaxed">
                      30 days of prompts. Caption templates that convert. Your personal brand foundation.
                    </p>
                    <div className="font-['Neue_Einstellung'] text-xs tracking-[0.3em] uppercase text-white/40">
                      Essentials • $67
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Step 3: Branded */}
            <div className="relative mb-24 md:mb-32">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                <div className="md:col-span-5 text-left md:text-right">
                  <div className="space-y-4">
                    <div className="font-['Lingerie_Typeface'] text-[80px] md:text-[120px] leading-none text-white/10">
                      03
                    </div>
                    <h3 className="font-['Bordoni_FLF'] text-[32px] md:text-[40px] text-white -mt-16 md:-mt-20">
                      Branded By Selfie
                    </h3>
                    <p className="font-['Neue_Einstellung'] text-white/60 leading-relaxed">
                      Complete transformation system. AI tools, pose library, weekly coaching. Everything you need.
                    </p>
                    <div className="font-['Neue_Einstellung'] text-xs tracking-[0.3em] uppercase text-white/40">
                      Full Program • $397
                    </div>
                  </div>
                </div>
                
                {/* Center Node */}
                <div className="md:col-span-2 flex justify-center">
                  <div className="w-4 h-4 bg-white/50 rounded-full"></div>
                </div>
                
                <div className="md:col-span-5">
                  {/* Empty for alternating layout */}
                </div>
              </div>
            </div>
            
            {/* Step 4: VIP */}
            <div className="relative">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                <div className="md:col-span-5 order-2 md:order-1">
                  {/* Empty for alternating layout */}
                </div>
                
                {/* Center Node */}
                <div className="md:col-span-2 flex justify-center order-1 md:order-2">
                  <div className="w-6 h-6 bg-white rounded-full relative">
                    <div className="absolute inset-0 bg-white/20 rounded-full scale-150"></div>
                  </div>
                </div>
                
                <div className="md:col-span-5 text-left order-3">
                  <div className="space-y-4">
                    <div className="font-['Lingerie_Typeface'] text-[80px] md:text-[120px] leading-none text-white/10">
                      04
                    </div>
                    <h3 className="font-['Bordoni_FLF'] text-[32px] md:text-[40px] text-white -mt-16 md:-mt-20">
                      VIP Brand Builder
                    </h3>
                    <p className="font-['Neue_Einstellung'] text-white/60 leading-relaxed">
                      Private mentorship. Custom strategy. Direct access to Sandra. For serious transformations only.
                    </p>
                    <div className="font-['Neue_Einstellung'] text-xs tracking-[0.3em] uppercase text-white/40">
                      Application Only • Premium
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* CTA */}
          <div className="text-center mt-32">
            <button className="group relative overflow-hidden bg-white text-black px-16 py-6">
              <span className="relative z-10 font-['Neue_Einstellung'] text-xs tracking-[0.3em] uppercase">
                Start Your Journey
              </span>
              <div className="absolute inset-0 bg-black transform translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
              <span className="absolute inset-0 flex items-center justify-center font-['Neue_Einstellung'] text-xs tracking-[0.3em] uppercase text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                Start Your Journey
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Benefits Carousel */}
      <section className="bg-black py-32 overflow-hidden">
        <div className="max-w-[1600px] mx-auto px-8 md:px-16 lg:px-24">
          {/* Section Header */}
          <div className="flex items-baseline gap-8 mb-24">
            <div className="font-['Lingerie_Typeface'] text-[120px] leading-none text-white/10">03</div>
            <div>
              <h2 className="font-['Bordoni_FLF'] text-[48px] md:text-[64px] tracking-tight text-white">
                Your Luxury Toolkit
              </h2>
              <div className="w-32 h-px bg-white/20 mt-4"></div>
            </div>
          </div>
          
          {/* Carousel Container */}
          <div className="relative">
            <div className="flex gap-8 overflow-x-auto scrollbar-hide pb-8">
              {/* AI Caption Studio */}
              <div className="min-w-[400px] bg-white/5 backdrop-blur border border-white/10 p-12">
                <div className="font-['Lingerie_Typeface'] text-[80px] leading-none text-white/20 mb-8">
                  01
                </div>
                
                <h3 className="font-['Bordoni_FLF'] text-[32px] text-white mb-4">
                  AI Caption Studio
                </h3>
                
                <p className="font-['Neue_Einstellung'] text-base text-white/70 leading-relaxed mb-8">
                  Transform one selfie into 30 days of content. Our AI writes in your voice, not like a robot.
                </p>
                
                <div className="font-['Neue_Einstellung'] text-xs tracking-[0.2em] uppercase text-white/40">
                  Included in all plans
                </div>
              </div>
              
              {/* Template Vault */}
              <div className="min-w-[400px] bg-white/5 backdrop-blur border border-white/10 p-12">
                <div className="font-['Lingerie_Typeface'] text-[80px] leading-none text-white/20 mb-8">
                  02
                </div>
                
                <h3 className="font-['Bordoni_FLF'] text-[32px] text-white mb-4">
                  Template Vault
                </h3>
                
                <p className="font-['Neue_Einstellung'] text-base text-white/70 leading-relaxed mb-8">
                  200+ luxury post templates. Canva-ready, brand-aligned, designed to stop the scroll.
                </p>
                
                <div className="font-['Neue_Einstellung'] text-xs tracking-[0.2em] uppercase text-white/40">
                  Updated monthly
                </div>
              </div>
              
              {/* Sandra AI */}
              <div className="min-w-[400px] bg-white/5 backdrop-blur border border-white/10 p-12">
                <div className="font-['Lingerie_Typeface'] text-[80px] leading-none text-white/20 mb-8">
                  03
                </div>
                
                <h3 className="font-['Bordoni_FLF'] text-[32px] text-white mb-4">
                  Sandra AI Chat
                </h3>
                
                <p className="font-['Neue_Einstellung'] text-base text-white/70 leading-relaxed mb-8">
                  Your 24/7 brand strategist. Ask me anything about poses, captions, or confidence.
                </p>
                
                <div className="font-['Neue_Einstellung'] text-xs tracking-[0.2em] uppercase text-white/40">
                  Exclusive feature
                </div>
              </div>
              
              {/* Pose Library */}
              <div className="min-w-[400px] bg-white/5 backdrop-blur border border-white/10 p-12">
                <div className="font-['Lingerie_Typeface'] text-[80px] leading-none text-white/20 mb-8">
                  04
                </div>
                
                <h3 className="font-['Bordoni_FLF'] text-[32px] text-white mb-4">
                  Pose & Presence Library
                </h3>
                
                <p className="font-['Neue_Einstellung'] text-base text-white/70 leading-relaxed mb-8">
                  500+ poses that work. Video tutorials, angle guides, and confidence coaching included.
                </p>
                
                <div className="font-['Neue_Einstellung'] text-xs tracking-[0.2em] uppercase text-white/40">
                  With video guides
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modules Section */}
      <section className="bg-[#FAFAF8] py-32">
        <div className="max-w-[1400px] mx-auto px-8 md:px-16 lg:px-24">
          {/* Section Header */}
          <div className="text-center mb-24">
            <div className="font-['Lingerie_Typeface'] text-[200px] leading-none text-black/5">
              04
            </div>
            <h2 className="font-['Bordoni_FLF'] text-[48px] md:text-[64px] tracking-tight -mt-24">
              The Transformation Path
            </h2>
          </div>
          
          {/* Modules Grid */}
          <div className="space-y-px bg-black/10">
            {/* Module 1 */}
            <div className="bg-[#FAFAF8] p-16 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 group hover:bg-black hover:text-white transition-all duration-500">
              <div className="flex-1">
                <div className="font-['Neue_Einstellung'] text-xs tracking-[0.3em] uppercase opacity-60 mb-4">
                  Foundation — Week 1-2
                </div>
                
                <h3 className="font-['Bordoni_FLF'] text-[36px] md:text-[48px] leading-tight mb-4">
                  Brand DNA Discovery
                </h3>
                
                <p className="font-['Neue_Einstellung'] text-lg leading-relaxed opacity-80 max-w-2xl">
                  Uncover your authentic brand essence. Define your visual identity, voice, and values with precision.
                </p>
              </div>
              
              <div className="font-['Lingerie_Typeface'] text-[80px] opacity-10 group-hover:opacity-20">
                01
              </div>
            </div>
            
            {/* Module 2 */}
            <div className="bg-[#FAFAF8] p-16 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 group hover:bg-black hover:text-white transition-all duration-500">
              <div className="flex-1">
                <div className="font-['Neue_Einstellung'] text-xs tracking-[0.3em] uppercase opacity-60 mb-4">
                  Creation — Week 3-6
                </div>
                
                <h3 className="font-['Bordoni_FLF'] text-[36px] md:text-[48px] leading-tight mb-4">
                  Content Mastery Sprint
                </h3>
                
                <p className="font-['Neue_Einstellung'] text-lg leading-relaxed opacity-80 max-w-2xl">
                  30 days of guided content creation. Daily prompts, templates, and AI assistance to build your library.
                </p>
              </div>
              
              <div className="font-['Lingerie_Typeface'] text-[80px] opacity-10 group-hover:opacity-20">
                02
              </div>
            </div>
            
            {/* Module 3 */}
            <div className="bg-[#FAFAF8] p-16 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 group hover:bg-black hover:text-white transition-all duration-500">
              <div className="flex-1">
                <div className="font-['Neue_Einstellung'] text-xs tracking-[0.3em] uppercase opacity-60 mb-4">
                  Amplification — Week 7-12
                </div>
                
                <h3 className="font-['Bordoni_FLF'] text-[36px] md:text-[48px] leading-tight mb-4">
                  Visibility & Growth Lab
                </h3>
                
                <p className="font-['Neue_Einstellung'] text-lg leading-relaxed opacity-80 max-w-2xl">
                  Strategic visibility tactics. Engagement strategies, collaboration templates, and growth tracking.
                </p>
              </div>
              
              <div className="font-['Lingerie_Typeface'] text-[80px] opacity-10 group-hover:opacity-20">
                03
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="bg-white py-32 md:py-48 overflow-hidden">
        <div className="max-w-[1600px] mx-auto px-8 md:px-16 lg:px-24">
          {/* Section Header */}
          <div className="text-center mb-24">
            <div className="font-['Lingerie_Typeface'] text-[180px] md:text-[240px] leading-none text-black/5 select-none">
              05
            </div>
            <h2 className="font-['Bordoni_FLF'] text-[48px] md:text-[64px] tracking-tight -mt-32 mb-8">
              Their Words, Not Mine
            </h2>
            <div className="w-32 h-px bg-black/20 mx-auto"></div>
          </div>
          
          {/* Messages Grid */}
          <div className="relative">
            {/* Background Quote Mark */}
            <div className="absolute -top-20 -left-10 font-['Lingerie_Typeface'] text-[300px] text-black/3 leading-none select-none">
              "
            </div>
            
            {/* Messages Layout */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
              
              {/* Message 1 - Large Feature */}
              <div className="md:col-span-7 relative">
                <div className="bg-[#FAFAF8] p-12 md:p-16 border-l-4 border-black/10">
                  <p className="font-['Neue_Einstellung'] text-[18px] md:text-[22px] leading-relaxed text-black/80 mb-6">
                    "Sandra, thank you so much for each of your reels. 90%, it's sound like my life. Inspired by you, I started to take selfies of myself and recorded 3 stories of what I felt and what I did."
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-black/10"></div>
                    <div>
                      <p className="font-['Neue_Einstellung'] text-xs tracking-[0.2em] uppercase text-black/40">
                        DM Received
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Message 2 - Offset */}
              <div className="md:col-span-5 md:mt-24">
                <div className="bg-black text-white p-10 md:p-12">
                  <p className="font-['Bordoni_FLF'] italic text-[20px] md:text-[24px] leading-tight mb-6">
                    "You have literally changed my picture taking from boring selfies to professional pictures!"
                  </p>
                  <p className="font-['Neue_Einstellung'] text-xs tracking-[0.2em] uppercase opacity-60">
                    @follower
                  </p>
                </div>
              </div>
              
              {/* Message 3 - Floating */}
              <div className="md:col-span-5 md:col-start-2">
                <div className="border border-black/10 p-8 md:p-10 hover:border-black/30 transition-colors duration-500">
                  <p className="font-['Neue_Einstellung'] text-[16px] md:text-[18px] leading-relaxed text-black/70 mb-4">
                    "I'm so in love with your journey! Today was the day I decided to not use any more filters ever."
                  </p>
                  <div className="flex justify-between items-center">
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
            <h2 className="font-['Bordoni_FLF'] text-[64px] md:text-[96px] lg:text-[120px] leading-[0.9] tracking-tight">
              Let's build<br/>
              <span className="italic font-light">your luxury brand</span><br/>
              from your<br/>
              camera roll.
            </h2>
            
            <p className="font-['Neue_Einstellung'] text-xl text-black/70 max-w-2xl mx-auto">
              Join 10,000+ women who transformed their selfies into sophisticated personal brands that attract opportunities.
            </p>
            
            <div className="max-w-lg mx-auto">
              <form className="space-y-8" onSubmit={handleEmailSubmit}>
                <input
                  type="email"
                  placeholder="Your best email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent border-b-2 border-black py-4 px-2 font-['Neue_Einstellung'] text-lg placeholder:text-black/30 focus:outline-none focus:border-black/60 transition-colors"
                />
                
                <button 
                  type="submit"
                  className="w-full bg-black text-white py-6 font-['Neue_Einstellung'] text-xs tracking-[0.3em] uppercase hover:bg-black/90 transition-colors"
                >
                  Begin Your Transformation
                </button>
              </form>
              
              <p className="font-['Neue_Einstellung'] text-xs text-black/40 mt-6">
                Instant access. Cancel anytime. Transform forever.
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