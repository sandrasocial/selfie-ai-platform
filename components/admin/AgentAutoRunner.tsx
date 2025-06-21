'use client'

import { useState, useEffect } from 'react'
import { Zap } from 'lucide-react'

export default function AgentAutoRunner() {
  const [isPolling, setIsPolling] = useState(false)
  const [lastRun, setLastRun] = useState<Date | null>(null)

  useEffect(() => {
    const intervalId = setInterval(async () => {
      if (document.hidden) return // Don't run if the tab is not active
      
      console.log('Auto-checking for agent tasks...')
      setIsPolling(true)
      try {
        await fetch('/api/agents/auto-check')
        setLastRun(new Date())
      } catch (error) {
        console.error('Failed to run auto-check:', error)
      } finally {
        setIsPolling(false)
      }
    }, 30000) // 30 seconds

    return () => clearInterval(intervalId)
  }, [])

  return (
    <div className="fixed bottom-4 right-4 bg-luxury-black text-soft-white p-2 shadow-lg flex items-center gap-2 border border-warm-gray/20">
      <Zap className={`w-4 h-4 ${isPolling ? 'animate-pulse text-yellow-400' : 'text-green-400'}`} />
      <span className="text-xs">
        {isPolling ? 'Agents active...' : 'Agents idle.'}
      </span>
    </div>
  )
} 