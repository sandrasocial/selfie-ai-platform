'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'

interface DashboardAnalytics {
  dailyVisits: number
  avgSessionTime: number
  mostUsedTool: string
  engagementScore: number
  weeklyProgress: number[]
}

export function DashboardInsights({ userId }: { userId: string }) {
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    fetchAnalytics()
  }, [userId])

  const fetchAnalytics = async () => {
    try {
      // Mock analytics data - in real app, fetch from analytics service
      const mockAnalytics: DashboardAnalytics = {
        dailyVisits: 23,
        avgSessionTime: 8.5,
        mostUsedTool: 'Selfie Score',
        engagementScore: 94,
        weeklyProgress: [65, 72, 78, 81, 85, 89, 94]
      }

      setAnalytics(mockAnalytics)
      
      // Show insights after user has been active
      setTimeout(() => setIsVisible(true), 5000)
    } catch (error) {
      console.error('Error fetching analytics:', error)
    }
  }

  if (!analytics || !isVisible) return null

  return (
    <div className="fixed bottom-20 right-6 bg-luxury-black text-soft-white p-6 w-80 transform transition-all duration-500 translate-x-0">
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-serif text-lg">Dashboard Insights</h3>
        <button 
          onClick={() => setIsVisible(false)}
          className="text-warm-gray hover:text-soft-white"
        >
          ×
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between">
          <span className="text-warm-gray">Today's visits</span>
          <span className="font-semibold">{analytics.dailyVisits}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-warm-gray">Avg. session</span>
          <span className="font-semibold">{analytics.avgSessionTime}m</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-warm-gray">Top tool</span>
          <span className="font-semibold">{analytics.mostUsedTool}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-warm-gray">Engagement</span>
          <span className="font-semibold">{analytics.engagementScore}%</span>
        </div>

        {/* Weekly Progress Chart */}
        <div className="mt-4">
          <div className="text-warm-gray text-sm mb-2">7-day progress</div>
          <div className="flex items-end gap-1 h-8">
            {analytics.weeklyProgress.map((value, index) => (
              <div
                key={index}
                className="bg-soft-white flex-1 transition-all duration-1000"
                style={{ 
                  height: `${(value / 100) * 100}%`,
                  animationDelay: `${index * 100}ms`
                }}
              />
            ))}
          </div>
          <div className="flex justify-between text-xs text-warm-gray mt-1">
            <span>Mon</span>
            <span>Sun</span>
          </div>
        </div>

        <button className="w-full bg-soft-white text-luxury-black py-2 text-sm tracking-wider uppercase hover:bg-warm-gray transition-colors mt-4">
          View Full Analytics
        </button>
      </div>
    </div>
  )
}
