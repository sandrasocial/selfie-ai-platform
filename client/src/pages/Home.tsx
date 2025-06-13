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
        {/* Dramatic Typography Background */}
        <div className="absolute top-0 right-0 text-[400px] font-['Lingerie_Typeface'] text-black/5 leading-none select-none">
          S
        </div>
        
        <div className="relative max-w-[1600px] mx-auto px-8 md:px-16 lg:px-24 pt-32 pb-24">
          {/* Navigation */}
          <nav className="flex justify-between items-center mb-32">
            <div className="font-['Neue_Einstellung'] text-xs tracking-[0.3em] uppercase">
              Selfie AI™
            </div>
            <div className="flex gap-12">
              <Link href="/pricing" className="font-['Neue_Einstellung'] text-xs tracking-[0.2em] uppercase hover:opacity-60 transition-opacity">About</Link>
              <Link href="/studio" className="font-['Neue_Einstellung'] text-xs tracking-[0.2em] uppercase hover:opacity-60 transition-opacity">Tools</Link>
              <Link href="/dashboard" className="font-['Neue_Einstellung'] text-xs tracking-[0.2em] uppercase hover:opacity-60 transition-opacity">Start</Link>
            </div>
          </nav>
          
          {/* Hero Content */}
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-12 lg:col-span-8">
              <h1 className="font-['Bordoni_FLF'] text-[80px] md:text-[120px] lg:text-[160px] leading-[0.8] tracking-[-0.03em] mb-12">
                Your Selfie<br/>
                <span className="italic font-light">is Your</span><br/>
                Brand.
              </h1>
              
              <div className="max-w-xl">
                <p className="font-['Neue_Einstellung'] text-lg leading-relaxed text-black/70 mb-12">
                  Let's make it work for you. Transform your camera roll into a luxury personal brand that opens doors, builds trust, and attracts your dream opportunities.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-6">
                  <Link href="/dashboard">
                    <button className="group relative overflow-hidden bg-black text-white px-12 py-5">
                      <span className="relative z-10 font-['Neue_Einstellung'] text-xs tracking-[0.2em] uppercase">Begin Your Journey</span>
                      <div className="absolute inset-0 bg-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                      <span className="absolute inset-0 flex items-center justify-center font-['Neue_Einstellung'] text-xs tracking-[0.2em] uppercase text-black transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">Begin Your Journey</span>
                    </button>
                  </Link>
                  
                  <button className="font-['Neue_Einstellung'] text-xs tracking-[0.2em] uppercase border-b border-black pb-1 hover:pb-2 transition-all">
                    Watch My Story
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
        </div>
      </section>

      {/* Proof Section */}
      <section className="bg-black py-24">
        <div className="max-w-[1400px] mx-auto px-8 md:px-16 lg:px-24">
          <div className="flex flex-col md:flex-row justify-between items-center gap-16">
            <div className="text-center md:text-left">
              <div className="font-['Lingerie_Typeface'] text-[100px] md:text-[120px] leading-none text-white mb-2">
                120K
              </div>
              <p className="font-['Neue_Einstellung'] text-xs tracking-[0.2em] uppercase text-white/60">
                Followers Built
              </p>
            </div>
            
            <div className="text-center">
              <div className="font-['Lingerie_Typeface'] text-[100px] md:text-[120px] leading-none text-white mb-2">
                1.7M
              </div>
              <p className="font-['Neue_Einstellung'] text-xs tracking-[0.2em] uppercase text-white/60">
                Monthly Reach
              </p>
            </div>
            
            <div className="text-center md:text-right">
              <div className="font-['Lingerie_Typeface'] text-[100px] md:text-[120px] leading-none text-white mb-2">
                90
              </div>
              <p className="font-['Neue_Einstellung'] text-xs tracking-[0.2em] uppercase text-white/60">
                Days to Transform
              </p>
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <p className="font-['Bordoni_FLF'] italic text-2xl text-white/80">
              Proof, not promises. Results, not rhetoric.
            </p>
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
                <img src="/sandra-signature.png" alt="Sandra's Signature" className="h-16 opacity-80" />
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
                <img src="/archetype-visionary.jpg" alt="The Visionary" className="w-full h-[400px] object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
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
                <img src="/archetype-phoenix.jpg" alt="The Phoenix" className="w-full h-[400px] object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
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
                <img src="/archetype-luminary.jpg" alt="The Luminary" className="w-full h-[400px] object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
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

      {/* Footer CTA */}
      <section className="relative min-h-screen bg-white flex items-center">
        {/* Background Typography */}
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
          <div className="font-['Lingerie_Typeface'] text-[600px] md:text-[800px] text-black/3 leading-none">
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
      </section>
    </div>
  );
}