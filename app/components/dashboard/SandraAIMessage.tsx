'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface SandraMessage {
  message: string
  type: 'motivation' | 'tip' | 'celebration' | 'reminder'
  timestamp: string
}

interface SandraAIMessageProps {
  message: SandraMessage
}

export function SandraAIMessage({ message }: SandraAIMessageProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    // Show message after a brief delay
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const getMessageStyle = () => {
    switch (message.type) {
      case 'celebration':
        return 'bg-soft-white border-l-4 border-luxury-black'
      case 'motivation':
        return 'bg-luxury-black text-soft-white'
      case 'tip':
        return 'bg-warm-gray text-luxury-black'
      case 'reminder':
        return 'bg-soft-white border border-luxury-black'
      default:
        return 'bg-soft-white'
    }
  }

  const getMessageIcon = () => {
    switch (message.type) {
      case 'celebration':
        return '✨'
      case 'motivation':
        return '💪'
      case 'tip':
        return '💡'
      case 'reminder':
        return '⏰'
      default:
        return '💬'
    }
  }

  if (isDismissed) return null

  return (
    <div className={`px-6 md:px-15 py-6 transition-all duration-500 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}>
      <div className={`${getMessageStyle()} p-6 md:p-8 relative`}>
        {/* Sandra AI Badge */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-luxury-black text-soft-white flex items-center justify-center font-serif text-sm">
            SA
          </div>
          <div>
            <div className="font-serif text-lg">Sandra AI</div>
            <div className="text-xs tracking-wider uppercase opacity-70">Your Personal Brand Strategist</div>
          </div>
          <div className="ml-auto text-2xl">{getMessageIcon()}</div>
        </div>

        {/* Message Content */}
        <div className="font-sans text-lg leading-relaxed mb-4">
          {message.message}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <button className="bg-luxury-black text-soft-white px-6 py-2 text-sm tracking-wider uppercase hover:bg-warm-gray transition-colors">
            Tell Me More
          </button>
          <button className="border border-luxury-black text-luxury-black px-6 py-2 text-sm tracking-wider uppercase hover:bg-luxury-black hover:text-soft-white transition-all">
            Got It
          </button>
        </div>

        {/* Dismiss Button */}
        <button 
          onClick={() => setIsDismissed(true)}
          className="absolute top-4 right-4 text-2xl opacity-50 hover:opacity-100 transition-opacity"
        >
          ×
        </button>

        {/* Timestamp */}
        <div className="absolute bottom-2 right-4 text-xs opacity-50">
          {new Date(message.timestamp).toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </div>
      </div>
    </div>
  )
}
