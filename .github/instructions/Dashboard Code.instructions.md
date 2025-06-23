'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function UserDashboard() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const supabase = createClientComponentClient()

  useEffect(() => {
    // Fetch user data
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        // Fetch additional user data from your users table
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single()
        
        setUser({ ...user, ...profile })
      }
      setLoading(false)
    }
    
    fetchUserData()
  }, [supabase])

  if (loading) {
    return <div className="min-h-screen bg-soft-white flex items-center justify-center">
      <div className="text-luxury-black">Loading your dashboard...</div>
    </div>
  }

  const userInitial = user?.full_name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'
  const userName = user?.full_name?.split(' ')[0] || 'there'
  
  // Sample data - replace with real data from Supabase
  const stats = {
    newFollowers: 847,
    confidenceScore: 89,
    postsThisMonth: 47,
    monthlyGrowth: '3x'
  }

  const visionBoard = [
    { id: 1, type: 'image', content: 'CEO Energy', image: '/images/vision-1.jpg' },
    { id: 2, type: 'quote', content: 'She remembered who she was and the game changed', author: 'Lalah Delia' },
    { id: 3, type: 'image', content: 'Keynote Speaker', image: '/images/vision-2.jpg' },
    { id: 4, type: 'stats', number: '10K', label: 'Community Members', sublabel: 'BY DECEMBER 2025' },
    { id: 5, type: 'personal-quote', content: 'I am magnetic to the right opportunities' },
    { id: 6, type: 'image', content: 'Work From Anywhere', image: '/images/vision-3.jpg' }
  ]

  return (
    <div className="min-h-screen bg-soft-white">
      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 z-50 px-6 md:px-15 py-5 flex justify-between items-center">
        <Link href="/" className="font-bodoni text-xl md:text-2xl text-soft-white tracking-wider">
          SSELFIE
        </Link>
        
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-10">
          <Link href="/dashboard" className="text-warm-gray hover:text-soft-white transition-colors text-sm tracking-wider uppercase">
            Dashboard
          </Link>
          <Link href="/tools" className="text-warm-gray hover:text-soft-white transition-colors text-sm tracking-wider uppercase">
            Tools
          </Link>
          <Link href="/content" className="text-warm-gray hover:text-soft-white transition-colors text-sm tracking-wider uppercase">
            Content
          </Link>
          <Link href="/learn" className="text-warm-gray hover:text-soft-white transition-colors text-sm tracking-wider uppercase">
            Learn
          </Link>
          <div className="w-10 h-10 bg-soft-white text-luxury-black flex items-center justify-center font-semibold">
            {userInitial}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden flex flex-col gap-1 p-2"
        >
          <span className="w-6 h-0.5 bg-soft-white transition-all" />
          <span className="w-6 h-0.5 bg-soft-white transition-all" />
          <span className="w-6 h-0.5 bg-soft-white transition-all" />
        </button>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen min-h-[600px] bg-luxury-black overflow-hidden">
        <div className="grid md:grid-cols-2 h-full">
          {/* Content Side */}
          <div className="flex flex-col justify-center px-8 md:px-20 pt-24 md:pt-32 pb-10 relative z-10">
            <div className="text-warm-gray text-xs tracking-[0.2em] uppercase mb-5">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </div>
            <h1 className="font-bodoni text-5xl md:text-6xl lg:text-7xl text-soft-white leading-[0.9] mb-8">
              Good morning,<br />{userName}
            </h1>
            <p className="text-warm-gray text-lg md:text-xl max-w-lg font-light">
              Your future self is 72% realized. Let's make today count toward that final 28%.
            </p>
          </div>

          {/* Image Side */}
          <div className="relative h-[400px] md:h-full">
            <div className="absolute inset-0 bg-warm-gray">
              {/* Future Self Image */}
              <Image 
                src="/images/future-self-main.jpg" 
                alt="Your Future Self Vision" 
                fill
                className="object-cover grayscale hover:grayscale-0 transition-all duration-1000"
              />
            </div>
            <div className="absolute bottom-10 md:bottom-15 left-10 md:left-15 text-soft-white">
              <div className="font-lingerie text-[120px] md:text-[180px] leading-none opacity-10 mb-5">01</div>
              <div className="text-xs tracking-[0.2em] uppercase">Your Vision Realized</div>
            </div>
          </div>
        </div>
      </section>

      {/* Daily Focus Strip */}
      <div className="bg-white px-6 md:px-15 py-10 flex flex-col md:flex-row justify-between items-center gap-5 border-b border-warm-gray/20">
        <div className="text-center md:text-left">
          <h3 className="font-bodoni text-2xl md:text-3xl mb-2">Today's Focus</h3>
          <p className="text-warm-gray">Three strategic posts scheduled. Your "expertise without ego" series continues.</p>
        </div>
        <Link href="/content" className="bg-luxury-black text-soft-white px-10 py-4 text-sm tracking-wider uppercase hover:bg-transparent hover:text-luxury-black border border-luxury-black transition-all">
          Review Content
        </Link>
      </div>

      {/* Personal Milestone Strip */}
      <div className="bg-luxury-black text-soft-white px-6 md:px-15 py-8 flex flex-col md:flex-row justify-between items-center gap-5">
        <div className="text-center md:text-left">
          <div className="text-xl mb-2">You've posted {stats.postsThisMonth} times this month. That's {stats.monthlyGrowth} more than last month!</div>
          <div className="text-warm-gray text-sm tracking-wider uppercase">Your consistency is paying off</div>
        </div>
        <div className="text-center">
          <span className="font-lingerie text-4xl block">+{stats.newFollowers}</span>
          <span className="text-xs tracking-wider uppercase text-warm-gray">New followers this month</span>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="grid lg:grid-cols-[1fr_380px]">
        {/* Main Content Area */}
        <main className="p-8 md:p-15">
          {/* Vision Board */}
          <section className="mb-20">
            <div className="flex justify-between items-baseline mb-10">
              <h2 className="font-bodoni text-4xl md:text-5xl">Your Vision Board</h2>
              <span className="text-warm-gray text-sm tracking-wider uppercase">Curated for your brand</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {visionBoard.map((item) => (
                <div key={item.id} className={`
                  ${item.id === 1 ? 'md:col-span-2 md:row-span-2' : ''}
                  ${item.type === 'personal-quote' ? 'md:col-span-2' : ''}
                  aspect-[3/4] relative overflow-hidden
                `}>
                  {item.type === 'image' ? (
                    <>
                      <Image 
                        src={item.image || '/placeholder.jpg'} 
                        alt={item.content}
                        fill
                        className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                      />
                      <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-luxury-black/90 to-transparent text-soft-white transform translate-y-full hover:translate-y-0 transition-transform duration-300">
                        <p>{item.content}</p>
                      </div>
                    </>
                  ) : item.type === 'quote' ? (
                    <div className="bg-luxury-black text-soft-white p-10 flex items-center justify-center hover:bg-soft-white hover:text-luxury-black transition-all duration-700">
                      <div className="text-center">
                        <div className="font-lingerie text-7xl opacity-30 mb-5">"</div>
                        <p className="font-playfair italic text-2xl mb-5">{item.content}</p>
                        <div className="text-sm tracking-wider uppercase opacity-70">— {item.author}</div>
                      </div>
                    </div>
                  ) : item.type === 'stats' ? (
                    <div className="bg-white border-2 border-luxury-black p-10 flex items-center justify-center hover:bg-luxury-black hover:text-soft-white transition-all duration-700">
                      <div className="text-center">
                        <div className="font-lingerie text-7xl mb-2">{item.number}</div>
                        <div className="text-lg font-medium mb-2">{item.label}</div>
                        <div className="text-xs tracking-wider uppercase opacity-60">{item.sublabel}</div>
                      </div>
                    </div>
                  ) : item.type === 'personal-quote' ? (
                    <div className="bg-soft-white border border-luxury-black p-10 flex items-center justify-center hover:bg-luxury-black hover:text-soft-white transition-all duration-700">
                      <div className="text-center">
                        <p className="text-xl font-medium mb-5">{item.content}</p>
                        <div className="text-xs tracking-wider uppercase opacity-60">Daily Affirmation</div>
                      </div>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </section>

          {/* Today's Content */}
          <section className="bg-white p-10 md:p-15 relative overflow-hidden">
            <div className="absolute -top-10 right-10 font-lingerie text-[200px] text-luxury-black opacity-[0.03]">02</div>
            
            <div className="flex justify-between items-baseline mb-10 relative z-10">
              <h2 className="font-bodoni text-4xl md:text-5xl">Ready to Share</h2>
              <span className="text-warm-gray text-sm tracking-wider uppercase">Optimized for 10:30 AM</span>
            </div>

            <div className="grid md:grid-cols-[400px_1fr] gap-10 md:gap-15 relative z-10">
              <div className="aspect-[4/5] bg-warm-gray relative overflow-hidden">
                <Image 
                  src="/images/todays-post.jpg" 
                  alt="Today's content"
                  fill
                  className="object-cover"
                />
              </div>
              
              <div>
                <h3 className="font-bodoni text-3xl md:text-4xl mb-5">The Power of Quiet Confidence</h3>
                <p className="text-lg leading-relaxed mb-8">
                  "I used to think being seen meant being loud. Then I realized the most magnetic people in the room are often the ones who speak with intention, not volume. Here's what changed when I stopped trying to prove myself..."
                </p>
                
                <div className="flex flex-wrap gap-10 mb-10">
                  <div>
                    <div className="text-warm-gray text-xs tracking-wider uppercase mb-1">Platform</div>
                    <div className="font-medium">Instagram</div>
                  </div>
                  <div>
                    <div className="text-warm-gray text-xs tracking-wider uppercase mb-1">Engagement Prediction</div>
                    <div className="font-medium">High (8.2/10)</div>
                  </div>
                  <div>
                    <div className="text-warm-gray text-xs tracking-wider uppercase mb-1">Hashtag Set</div>
                    <div className="font-medium">Authority Builder</div>
                  </div>
                </div>
                
                <button className="bg-luxury-black text-soft-white px-10 py-4 text-sm tracking-wider uppercase hover:bg-transparent hover:text-luxury-black border border-luxury-black transition-all">
                  Schedule Post
                </button>
              </div>
            </div>
          </section>
        </main>

        {/* Sidebar */}
        <aside className="bg-white border-t lg:border-t-0 lg:border-l border-warm-gray/20 p-8 md:p-10">
          {/* Stats */}
          <div className="mb-15">
            <h3 className="font-bodoni text-3xl mb-8">Your Impact</h3>
            
            <div className="space-y-5">
              <div className="bg-[#FAFAFA] p-8 hover:bg-luxury-black hover:text-soft-white transition-all duration-300 cursor-pointer">
                <div className="font-lingerie text-5xl mb-1">{stats.newFollowers}</div>
                <div className="text-xs tracking-wider uppercase opacity-70">New Connections</div>
              </div>
              
              <div className="bg-[#FAFAFA] p-8 hover:bg-luxury-black hover:text-soft-white transition-all duration-300 cursor-pointer">
                <div className="font-lingerie text-5xl mb-1">{stats.confidenceScore}%</div>
                <div className="text-xs tracking-wider uppercase opacity-70">Confidence Score</div>
              </div>
              
              <div className="bg-[#FAFAFA] p-8 hover:bg-luxury-black hover:text-soft-white transition-all duration-300 cursor-pointer">
                <div className="font-lingerie text-5xl mb-1">{stats.postsThisMonth}</div>
                <div className="text-xs tracking-wider uppercase opacity-70">Posts This Month</div>
              </div>
            </div>
          </div>

          {/* Quick Tools */}
          <div className="mb-15">
            <h3 className="font-bodoni text-3xl mb-8">Quick Tools</h3>
            
            <div className="space-y-px">
              {[
                { name: 'Take Today\'s Selfie', href: '/tools/selfie' },
                { name: 'Run Glow Check', href: '/tools/glow-check' },
                { name: 'Generate Caption', href: '/tools/caption' },
                { name: 'Brand Guidelines', href: '/brand' }
              ].map((tool) => (
                <Link 
                  key={tool.name}
                  href={tool.href}
                  className="flex justify-between items-center py-6 border-b border-warm-gray/20 hover:pl-4 transition-all group"
                >
                  <span className="font-medium">{tool.name}</span>
                  <span className="text-2xl text-warm-gray group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Progress */}
          <div className="bg-luxury-black text-soft-white p-10 mb-10">
            <h3 className="font-bodoni text-2xl mb-2">90-Day Journey</h3>
            <p className="text-warm-gray mb-6">Your transformation timeline</p>
            
            <div className="relative h-2 bg-soft-white/10 mb-5">
              <div className="absolute left-0 top-0 h-full bg-soft-white transition-all duration-1000" style={{ width: '72%' }} />
            </div>
            
            <div className="flex justify-between text-sm">
              <span>Day 65 of 90</span>
              <span>72% Complete</span>
            </div>
          </div>

          {/* Daily Affirmation */}
          <div className="bg-[#FAFAFA] p-10">
            <p className="font-playfair italic text-2xl mb-5">"You're not building a brand. You're revealing who you've always been."</p>
            <p className="text-right text-warm-gray text-sm">— Your Future Self</p>
          </div>
        </aside>
      </div>

      {/* Floating Action Button */}
      <button className="fixed bottom-5 md:bottom-10 right-5 md:right-10 w-14 h-14 md:w-16 md:h-16 bg-luxury-black text-soft-white flex items-center justify-center hover:scale-110 transition-transform shadow-2xl group">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" />
          <circle cx="12" cy="12" r="3" />
        </svg>
        <span className="absolute right-20 bg-luxury-black text-soft-white px-4 py-2 text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity hidden md:block">
          Take Today's Selfie
        </span>
      </button>
    </div>
  )
}