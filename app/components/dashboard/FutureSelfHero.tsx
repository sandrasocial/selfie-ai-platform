'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import type { FutureSelfImage } from '@/types/user'

interface FutureSelfHeroProps {
  userName: string
  futureSelfImage: FutureSelfImage | null
  confidenceScore: number
}

export function FutureSelfHero({ userName, futureSelfImage, confidenceScore }: FutureSelfHeroProps) {
  const [currentTime, setCurrentTime] = useState('')

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      }))
    }
    
    updateTime()
    const interval = setInterval(updateTime, 1000)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative h-screen min-h-[600px] bg-luxury-black overflow-hidden">
      <div className="grid md:grid-cols-2 h-full">
        {/* Content Side */}
        <div className="flex flex-col justify-center px-8 md:px-20 pt-24 md:pt-32 pb-10 relative z-10">
          <div className="text-warm-gray text-xs tracking-[0.2em] uppercase mb-5">
            {currentTime} • Your Personal HQ
          </div>
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-soft-white leading-[0.9] mb-8">
            Good morning,<br />
            {userName}
          </h1>
          <p className="text-warm-gray text-lg md:text-xl max-w-lg font-light mb-8">
            Your confidence is radiating at {confidenceScore}%. Today's the day to step fully into your power.
          </p>
          
          {/* Quick Stats */}
          <div className="flex gap-8 text-soft-white">
            <div>
              <div className="font-serif text-3xl">{confidenceScore}%</div>
              <div className="text-warm-gray text-xs tracking-wider uppercase">Confidence</div>
            </div>
            <div>
              <div className="font-serif text-3xl">65</div>
              <div className="text-warm-gray text-xs tracking-wider uppercase">Day of 90</div>
            </div>
            <div>
              <div className="font-serif text-3xl">3</div>
              <div className="text-warm-gray text-xs tracking-wider uppercase">Posts Ready</div>
            </div>
          </div>
        </div>

        {/* Future Self Image Side */}
        <div className="relative h-[400px] md:h-full">
          <div className="absolute inset-0 bg-warm-gray">
            {futureSelfImage?.image_url ? (
              <Image 
                src={futureSelfImage.image_url}
                alt="Your Future Self"
                fill
                className="object-cover grayscale hover:grayscale-0 transition-all duration-1000"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center text-soft-white/50">
                  <div className="font-serif text-6xl mb-4">✨</div>
                  <p className="text-lg">Your Future Self</p>
                  <p className="text-sm">Create your vision</p>
                </div>
              </div>
            )}
          </div>
          <div className="absolute bottom-10 md:bottom-15 left-10 md:left-15 text-soft-white">
            <div className="font-serif text-[120px] md:text-[180px] leading-none opacity-10 mb-5">01</div>
            <div className="text-xs tracking-[0.2em] uppercase">Your Vision Realized</div>
          </div>
          
          {/* Future Self Quote Overlay */}
          {futureSelfImage?.scenario && (
            <div className="absolute top-10 right-10 bg-luxury-black/80 text-soft-white p-6 max-w-sm">
              <p className="font-serif italic text-lg mb-2">"{futureSelfImage.scenario}"</p>
              <p className="text-warm-gray text-sm">— Your Future Self</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
