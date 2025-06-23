'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface QuickAction {
  id: string
  name: string
  href: string
  icon: string
  description: string
  isNew?: boolean
  isHot?: boolean
}

export function QuickActions() {
  const [recentlyUsed, setRecentlyUsed] = useState<string[]>([])
  const [userId, setUserId] = useState<string | null>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const getUserAndLoadPreferences = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserId(user.id)
        await loadRecentActions(user.id)
      }
    }
    
    getUserAndLoadPreferences()
  }, [supabase])

  const loadRecentActions = async (userId: string) => {
    try {
      const { data } = await supabase
        .from('user_preferences')
        .select('recent_actions')
        .eq('user_id', userId)
        .single()
      
      if (data?.recent_actions) {
        setRecentlyUsed(data.recent_actions)
      }
    } catch (error) {
      console.error('Error loading recent actions:', error)
    }
  }

  const saveRecentActions = async (actions: string[]) => {
    if (!userId) return
    
    try {
      await supabase
        .from('user_preferences')
        .upsert({
          user_id: userId,
          recent_actions: actions,
          updated_at: new Date().toISOString()
        })
    } catch (error) {
      console.error('Error saving recent actions:', error)
    }
  }

  const actions: QuickAction[] = [
    {
      id: 'selfie',
      name: "Take Today's Selfie",
      href: '/tools/selfie',
      icon: '📸',
      description: 'Daily confidence boost',
      isHot: true
    },
    {
      id: 'glow-check',
      name: 'Run Glow Check',
      href: '/tools/glow-check',
      icon: '✨',
      description: 'AI-powered beauty analysis'
    },
    {
      id: 'caption',
      name: 'Generate Caption',
      href: '/tools/caption',
      icon: '✍️',
      description: 'Perfect captions, instantly'
    },
    {
      id: 'brand-guidelines',
      name: 'Brand Guidelines',
      href: '/brand',
      icon: '📋',
      description: 'Your visual identity rules'
    },
    {
      id: 'content-planner',
      name: 'Content Planner',
      href: '/tools/planner',
      icon: '📅',
      description: 'Schedule your posts',
      isNew: true
    },
    {
      id: 'analytics',
      name: 'Analytics Deep Dive',
      href: '/analytics',
      icon: '📊',
      description: 'Track your growth'
    }
  ]

  const handleActionClick = (actionId: string) => {
    const newRecentActions = [actionId, ...recentlyUsed.filter(id => id !== actionId)].slice(0, 3)
    setRecentlyUsed(newRecentActions)
    saveRecentActions(newRecentActions)
  }

  return (
    <div className="mb-15">
      <h3 className="font-serif text-3xl mb-8">Quick Actions</h3>
      
      <div className="space-y-px">
        {actions.map((action) => (
          <Link 
            key={action.id}
            href={action.href}
            onClick={() => handleActionClick(action.id)}
            className="flex items-center justify-between py-6 px-4 -mx-4 border-b border-warm-gray/20 hover:bg-[#FAFAFA] hover:pl-8 transition-all group relative"
          >
            <div className="flex items-center gap-4">
              <span className="text-2xl">{action.icon}</span>
              <div>
                <div className="font-medium flex items-center gap-2">
                  {action.name}
                  {action.isNew && (
                    <span className="bg-luxury-black text-soft-white text-xs px-2 py-1 tracking-wider uppercase">
                      New
                    </span>
                  )}
                  {action.isHot && (
                    <span className="bg-warm-gray text-luxury-black text-xs px-2 py-1 tracking-wider uppercase">
                      Hot
                    </span>
                  )}
                </div>
                <div className="text-sm text-warm-gray">{action.description}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {recentlyUsed.includes(action.id) && (
                <span className="text-xs text-warm-gray">Recent</span>
              )}
              <span className="text-2xl text-warm-gray group-hover:translate-x-1 transition-transform">→</span>
            </div>

            {/* Hover tooltip */}
            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-4 bg-luxury-black text-soft-white px-3 py-2 text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
              {action.description}
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Access Buttons */}
      <div className="mt-8 grid grid-cols-2 gap-3">
        <Link 
          href="/tools/selfie"
          className="bg-luxury-black text-soft-white p-4 text-center hover:bg-warm-gray hover:text-luxury-black transition-all"
        >
          <div className="text-2xl mb-1">📸</div>
          <div className="text-xs tracking-wider uppercase">Quick Selfie</div>
        </Link>
        <Link 
          href="/tools/caption"
          className="border border-luxury-black text-luxury-black p-4 text-center hover:bg-luxury-black hover:text-soft-white transition-all"
        >
          <div className="text-2xl mb-1">✍️</div>
          <div className="text-xs tracking-wider uppercase">AI Caption</div>
        </Link>
      </div>
    </div>
  )
}
