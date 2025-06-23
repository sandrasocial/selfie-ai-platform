'use client'

import { useState, useEffect } from 'react'

interface ProgressAnimationProps {
  targetValue: number
  duration?: number
  suffix?: string
  prefix?: string
  className?: string
}

export function ProgressAnimation({ 
  targetValue, 
  duration = 2000, 
  suffix = '', 
  prefix = '',
  className = ''
}: ProgressAnimationProps) {
  const [currentValue, setCurrentValue] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    let animationFrame: number
    let startTime: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // Easing function for smooth animation
      const easeOutCubic = 1 - Math.pow(1 - progress, 3)
      const newValue = Math.floor(targetValue * easeOutCubic)
      
      setCurrentValue(newValue)
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      } else {
        setIsAnimating(false)
      }
    }

    // Start animation after a brief delay
    const startAnimation = () => {
      setIsAnimating(true)
      animationFrame = requestAnimationFrame(animate)
    }

    const timer = setTimeout(startAnimation, 300)

    return () => {
      clearTimeout(timer)
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [targetValue, duration])

  return (
    <span className={`${className} ${isAnimating ? 'animate-pulse' : ''}`}>
      {prefix}{currentValue.toLocaleString()}{suffix}
    </span>
  )
}

interface CircularProgressProps {
  percentage: number
  size?: number
  strokeWidth?: number
  color?: string
  backgroundColor?: string
  showText?: boolean
  duration?: number
}

export function CircularProgress({
  percentage,
  size = 120,
  strokeWidth = 8,
  color = '#171719',
  backgroundColor = '#B5B5B3',
  showText = true,
  duration = 2000
}: CircularProgressProps) {
  const [animatedPercentage, setAnimatedPercentage] = useState(0)
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (animatedPercentage / 100) * circumference

  useEffect(() => {
    let animationFrame: number
    let startTime: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      const easeOutCubic = 1 - Math.pow(1 - progress, 3)
      const newPercentage = percentage * easeOutCubic
      
      setAnimatedPercentage(newPercentage)
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    const timer = setTimeout(() => {
      animationFrame = requestAnimationFrame(animate)
    }, 500)

    return () => {
      clearTimeout(timer)
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [percentage, duration])

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="transparent"
          opacity={0.3}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
        />
      </svg>
      {showText && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-serif text-2xl font-medium">
            {Math.round(animatedPercentage)}%
          </span>
        </div>
      )}
    </div>
  )
}

interface ProgressBarProps {
  percentage: number
  height?: number
  color?: string
  backgroundColor?: string
  showText?: boolean
  duration?: number
  className?: string
}

export function ProgressBar({
  percentage,
  height = 8,
  color = '#171719',
  backgroundColor = '#F1F1F1',
  showText = true,
  duration = 2000,
  className = ''
}: ProgressBarProps) {
  const [animatedWidth, setAnimatedWidth] = useState(0)

  useEffect(() => {
    let animationFrame: number
    let startTime: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      const easeOutCubic = 1 - Math.pow(1 - progress, 3)
      const newWidth = percentage * easeOutCubic
      
      setAnimatedWidth(newWidth)
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    const timer = setTimeout(() => {
      animationFrame = requestAnimationFrame(animate)
    }, 300)

    return () => {
      clearTimeout(timer)
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [percentage, duration])

  return (
    <div className={className}>
      <div 
        className="relative overflow-hidden"
        style={{ 
          height: `${height}px`,
          backgroundColor 
        }}
      >
        <div
          className="absolute left-0 top-0 h-full transition-all duration-500 ease-out"
          style={{ 
            width: `${animatedWidth}%`,
            backgroundColor: color
          }}
        />
      </div>
      {showText && (
        <div className="flex justify-between text-sm mt-2">
          <span>{Math.round(animatedWidth)}% Complete</span>
          <span>{100 - Math.round(animatedWidth)}% Remaining</span>
        </div>
      )}
    </div>
  )
}
