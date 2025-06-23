'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface RealtimeUpdate {
  type: 'new_content' | 'progress_update' | 'sandra_message' | 'stats_update'
  data: any
  timestamp: string
}

export function useRealtimeDashboard(userId: string) {
  const [updates, setUpdates] = useState<RealtimeUpdate[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const supabase = createClientComponentClient()

  useEffect(() => {
    if (!userId) return

    // Subscribe to realtime updates
    const channel = supabase.channel('dashboard-updates')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'user_progress',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          const update: RealtimeUpdate = {
            type: 'progress_update',
            data: payload.new,
            timestamp: new Date().toISOString()
          }
          setUpdates(prev => [update, ...prev.slice(0, 9)]) // Keep last 10 updates
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'content_posts',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          const update: RealtimeUpdate = {
            type: 'new_content',
            data: payload.new,
            timestamp: new Date().toISOString()
          }
          setUpdates(prev => [update, ...prev.slice(0, 9)])
        }
      )
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED')
      })

    // Simulate Sandra AI messages (replace with actual AI logic)
    const sandraInterval = setInterval(() => {
      const messages = [
        "Your engagement is up 15% today! Keep showing up authentically.",
        "I noticed you haven't posted in 2 days. Your audience is waiting for your wisdom.",
        "Your confidence score just hit a new high! Time to celebrate this milestone.",
        "Perfect time to share that behind-the-scenes content you've been crafting."
      ]
      
      const randomMessage = messages[Math.floor(Math.random() * messages.length)]
      const update: RealtimeUpdate = {
        type: 'sandra_message',
        data: {
          message: randomMessage,
          type: 'tip',
          timestamp: new Date().toISOString()
        },
        timestamp: new Date().toISOString()
      }
      
      // Only send message occasionally (10% chance every 30 seconds)
      if (Math.random() < 0.1) {
        setUpdates(prev => [update, ...prev.slice(0, 9)])
      }
    }, 30000) // Check every 30 seconds

    return () => {
      channel.unsubscribe()
      clearInterval(sandraInterval)
    }
  }, [userId, supabase])

  const dismissUpdate = (timestamp: string) => {
    setUpdates(updates.filter(update => update.timestamp !== timestamp))
  }

  const clearAllUpdates = () => {
    setUpdates([])
  }

  return {
    updates,
    isConnected,
    dismissUpdate,
    clearAllUpdates
  }
}
