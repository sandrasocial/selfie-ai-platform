'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'
import Image from 'next/image'
import { FutureSelfHero } from '@/app/components/dashboard/FutureSelfHero'
import { SandraAIMessage } from '@/app/components/dashboard/SandraAIMessage'
import { QuickActions } from '@/app/components/dashboard/QuickActions'
import { ProgressTracker } from '@/app/components/dashboard/ProgressTracker'
import { ContentCalendar } from '@/app/components/dashboard/ContentCalendar'
import { RealtimeNotifications } from '@/app/components/dashboard/RealtimeNotifications'
import { DashboardLayout } from '@/app/components/dashboard/DashboardLayout'
import { ProgressAnimation } from '@/app/components/dashboard/ProgressAnimations'
import { DashboardSearch } from '@/app/components/dashboard/DashboardSearch'
import { PerformanceMonitor, InteractionTracker } from '@/app/components/dashboard/PerformanceMonitor'
import { DashboardInsights } from '@/app/components/dashboard/DashboardInsights'
import type { UserProfile, FutureSelfImage, UserProgress } from '@/types/user'

interface DashboardData {
  user: any
  profile: UserProfile | null
  futureSelf: FutureSelfImage | null
  progress: UserProgress | null
  todaysContent: any[]
  stats: {
    newFollowers: number
    confidenceScore: number
    postsThisMonth: number
    monthlyGrowth: string
  }
  sandraMessage: {
    message: string
    type: 'motivation' | 'tip' | 'celebration' | 'reminder'
    timestamp: string
  }
}

export default function PersonalizedDashboard() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<DashboardData | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    fetchDashboardData()
    
    // Keyboard shortcut for search
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Fetch user profile
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      // Fetch future self image
      const { data: futureSelf } = await supabase
        .from('future_self_images')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      // Fetch user progress
      const { data: progress } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .single()

      // Mock data for today's content (replace with real data)
      const todaysContent = [
        {
          id: 1,
          title: "The Power of Quiet Confidence",
          content: "I used to think being seen meant being loud. Then I realized the most magnetic people in the room are often the ones who speak with intention, not volume...",
          platform: "Instagram",
          engagement_prediction: 8.2,
          hashtag_set: "Authority Builder",
          scheduled_time: "10:30 AM",
          image_url: "/images/todays-post.jpg"
        }
      ]

      // Calculate stats
      const stats = {
        newFollowers: 847,
        confidenceScore: progress?.confidence_score || 89,
        postsThisMonth: 47,
        monthlyGrowth: '3x'
      }

      // Generate Sandra AI message
      const sandraMessage = {
        message: `${profile?.full_name?.split(' ')[0] || 'Beautiful'}, your confidence score jumped 12 points this week! Your "expertise without ego" content is resonating powerfully. Ready for today's breakthrough moment?`,
        type: 'celebration' as const,
        timestamp: new Date().toISOString()
      }

      setData({
        user,
        profile,
        futureSelf,
        progress,
        todaysContent,
        stats,
        sandraMessage
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-soft-white flex items-center justify-center">
        <div className="text-luxury-black font-serif text-2xl">Loading your personalized HQ...</div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-soft-white flex items-center justify-center">
        <div className="text-luxury-black">Unable to load dashboard. Please try again.</div>
      </div>
    )
  }

  const userName = data.profile?.full_name?.split(' ')[0] || data.user?.user_metadata?.full_name?.split(' ')[0] || 'Beautiful'
  const userInitial = userName.charAt(0).toUpperCase()

  return (
    <InteractionTracker>
      <DashboardLayout userId={data.user.id}>
        <div className="min-h-screen bg-soft-white">
          {/* Performance Monitor */}
          <PerformanceMonitor />

          {/* Real-time Notifications */}
          <RealtimeNotifications userId={data.user.id} />

          {/* Dashboard Insights */}
          <DashboardInsights userId={data.user.id} />

        {/* Navigation */}
        <nav className="absolute top-0 left-0 right-0 z-50 px-6 md:px-15 py-5 flex justify-between items-center">
          <Link href="/" className="font-serif text-xl md:text-2xl text-luxury-black tracking-wider">
            SELFIE AI™
          </Link>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10">
            <Link href="/dashboard" className="text-luxury-black hover:text-warm-gray transition-colors text-sm tracking-wider uppercase">
              Dashboard
            </Link>
            <Link href="/tools" className="text-luxury-black hover:text-warm-gray transition-colors text-sm tracking-wider uppercase">
              Tools
            </Link>
            <Link href="/content" className="text-luxury-black hover:text-warm-gray transition-colors text-sm tracking-wider uppercase">
              Content
            </Link>
            <Link href="/learn" className="text-luxury-black hover:text-warm-gray transition-colors text-sm tracking-wider uppercase">
              Learn
            </Link>
            
            {/* Search Button */}
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 text-warm-gray hover:text-luxury-black transition-colors text-sm tracking-wider uppercase"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
              <span className="text-xs">⌘K</span>
            </button>
            
            <div className="w-10 h-10 bg-luxury-black text-soft-white flex items-center justify-center font-semibold">
              {userInitial}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex flex-col gap-1 p-2"
          >
            <span className="w-6 h-0.5 bg-luxury-black transition-all" />
            <span className="w-6 h-0.5 bg-luxury-black transition-all" />
            <span className="w-6 h-0.5 bg-luxury-black transition-all" />
          </button>
        </nav>

        {/* Search Modal */}
        <DashboardSearch 
          isOpen={searchOpen} 
          onClose={() => setSearchOpen(false)} 
        />

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 bg-luxury-black/90 z-40 md:hidden">
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-center p-6 border-b border-warm-gray/20">
                <span className="font-serif text-xl text-soft-white tracking-wider">
                  SELFIE AI™
                </span>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-soft-white text-2xl"
                >
                  ×
                </button>
              </div>
              
              <nav className="flex-1 p-6">
                <div className="space-y-6">
                  <Link 
                    href="/dashboard" 
                    className="block text-soft-white text-lg tracking-wider uppercase border-b border-warm-gray/20 pb-4"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    href="/tools" 
                    className="block text-soft-white text-lg tracking-wider uppercase border-b border-warm-gray/20 pb-4"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Tools
                  </Link>
                  <Link 
                    href="/content" 
                    className="block text-soft-white text-lg tracking-wider uppercase border-b border-warm-gray/20 pb-4"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Content
                  </Link>
                  <Link 
                    href="/learn" 
                    className="block text-soft-white text-lg tracking-wider uppercase border-b border-warm-gray/20 pb-4"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Learn
                  </Link>
                </div>
                
                {/* Mobile User Profile */}
                <div className="mt-8 p-4 border border-warm-gray/20">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-soft-white text-luxury-black flex items-center justify-center font-semibold">
                      {userInitial}
                    </div>
                    <div>
                      <div className="text-soft-white font-medium">
                        {userName}
                      </div>
                      <div className="text-warm-gray text-sm">
                        {data.stats.confidenceScore}% Confidence
                      </div>
                    </div>
                  </div>
                </div>
              </nav>
            </div>
          </div>
        )}

        {/* Future Self Hero */}
        <FutureSelfHero 
          userName={userName}
          futureSelfImage={data.futureSelf}
          confidenceScore={data.stats.confidenceScore}
        />

        {/* Sandra AI Message */}
        <SandraAIMessage message={data.sandraMessage} />

        {/* Personal Milestone Strip */}
        <div className="bg-luxury-black text-soft-white px-6 md:px-15 py-8 flex flex-col md:flex-row justify-between items-center gap-5">
          <div className="text-center md:text-left">
            <div className="text-xl mb-2">You've posted <ProgressAnimation targetValue={data.stats.postsThisMonth} /> times this month. That's {data.stats.monthlyGrowth} more than last month!</div>
            <div className="text-warm-gray text-sm tracking-wider uppercase">Your consistency is paying off</div>
          </div>
          <div className="text-center">
            <span className="font-serif text-4xl block">+<ProgressAnimation targetValue={data.stats.newFollowers} /></span>
            <span className="text-xs tracking-wider uppercase text-warm-gray">New followers this month</span>
          </div>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid lg:grid-cols-[1fr_380px] gap-0">
          {/* Main Content Area */}
          <main className="p-8 md:p-15">
            {/* Content Calendar */}
            <ContentCalendar content={data.todaysContent} />

            {/* Progress Tracker */}
            <ProgressTracker progress={data.progress} />
          </main>

          {/* Sidebar */}
          <aside className="bg-white border-t lg:border-t-0 lg:border-l border-warm-gray/20 p-8 md:p-10">
            {/* Quick Actions */}
            <QuickActions />

            {/* Stats */}
            <div className="mb-15">
              <h3 className="font-serif text-3xl mb-8">Your Impact</h3>
              
              <div className="space-y-5">
                <div className="bg-[#FAFAFA] p-8 hover:bg-luxury-black hover:text-soft-white transition-all duration-300 cursor-pointer">
                  <div className="font-serif text-5xl mb-1">
                    <ProgressAnimation targetValue={data.stats.newFollowers} />
                  </div>
                  <div className="text-xs tracking-wider uppercase opacity-70">New Connections</div>
                </div>
                
                <div className="bg-[#FAFAFA] p-8 hover:bg-luxury-black hover:text-soft-white transition-all duration-300 cursor-pointer">
                  <div className="font-serif text-5xl mb-1">
                    <ProgressAnimation targetValue={data.stats.confidenceScore} suffix="%" />
                  </div>
                  <div className="text-xs tracking-wider uppercase opacity-70">Confidence Score</div>
                </div>
                
                <div className="bg-[#FAFAFA] p-8 hover:bg-luxury-black hover:text-soft-white transition-all duration-300 cursor-pointer">
                  <div className="font-serif text-5xl mb-1">
                    <ProgressAnimation targetValue={data.stats.postsThisMonth} />
                  </div>
                  <div className="text-xs tracking-wider uppercase opacity-70">Posts This Month</div>
                </div>
              </div>
            </div>

            {/* Daily Affirmation */}
            <div className="bg-[#FAFAFA] p-10">
              <p className="font-serif italic text-2xl mb-5">"You're not building a brand. You're revealing who you've always been."</p>
              <p className="text-right text-warm-gray text-sm">— Your Future Self</p>
            </div>
          </aside>
        </div>

        {/* Floating Action Button */}
        <Link href="/tools/selfie">
          <button className="fixed bottom-5 md:bottom-10 right-5 md:right-10 w-14 h-14 md:w-16 md:h-16 bg-luxury-black text-soft-white flex items-center justify-center hover:scale-110 transition-transform shadow-2xl group">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            <span className="absolute right-20 bg-luxury-black text-soft-white px-4 py-2 text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity hidden md:block">
              Take Today's Selfie
            </span>
          </button>
        </Link>
      </div>
    </DashboardLayout>
  </InteractionTracker>
  )
}
