'use client'

import { useState, useEffect } from 'react'
import type { UserProgress } from '@/types/user'
import { ProgressAnimation, CircularProgress, ProgressBar } from './ProgressAnimations'

interface ProgressTrackerProps {
  progress: UserProgress | null
}

interface Milestone {
  id: string
  title: string
  description: string
  targetDay: number
  completed: boolean
  completedDate?: string
  category: 'confidence' | 'content' | 'engagement' | 'brand'
}

export function ProgressTracker({ progress }: ProgressTrackerProps) {
  const [currentDay, setCurrentDay] = useState(65)
  const [animatedProgress, setAnimatedProgress] = useState(0)

  useEffect(() => {
    // Animate progress bar
    const timer = setTimeout(() => {
      setAnimatedProgress(72)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  const milestones: Milestone[] = [
    {
      id: 'first-selfie',
      title: 'First Confident Selfie',
      description: 'Posted your first selfie with confidence',
      targetDay: 7,
      completed: true,
      completedDate: '2024-11-15',
      category: 'confidence'
    },
    {
      id: 'brand-voice',
      title: 'Brand Voice Established',
      description: 'Defined your unique voice and messaging',
      targetDay: 21,
      completed: true,
      completedDate: '2024-11-29',
      category: 'brand'
    },
    {
      id: 'content-consistency',
      title: 'Content Consistency',
      description: '30 days of consistent posting',
      targetDay: 30,
      completed: true,
      completedDate: '2024-12-08',
      category: 'content'
    },
    {
      id: 'engagement-boost',
      title: 'Engagement Breakthrough',
      description: 'Achieved 5x engagement increase',
      targetDay: 45,
      completed: true,
      completedDate: '2024-12-23',
      category: 'engagement'
    },
    {
      id: 'confidence-peak',
      title: 'Confidence Peak',
      description: 'Reached 90% confidence score',
      targetDay: 60,
      completed: false,
      category: 'confidence'
    },
    {
      id: 'brand-mastery',
      title: 'Brand Mastery',
      description: 'Complete brand transformation',
      targetDay: 90,
      completed: false,
      category: 'brand'
    }
  ]

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'confidence':
        return 'bg-luxury-black text-soft-white'
      case 'content':
        return 'bg-warm-gray text-luxury-black'
      case 'engagement':
        return 'bg-soft-white border border-luxury-black text-luxury-black'
      case 'brand':
        return 'bg-luxury-black text-soft-white'
      default:
        return 'bg-warm-gray text-luxury-black'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'confidence':
        return '✨'
      case 'content':
        return '📝'
      case 'engagement':
        return '💬'
      case 'brand':
        return '🎯'
      default:
        return '📍'
    }
  }

  const completedMilestones = milestones.filter(m => m.completed)
  const upcomingMilestones = milestones.filter(m => !m.completed)

  return (
    <section className="mb-20">
      <div className="flex justify-between items-baseline mb-10">
        <h2 className="font-serif text-4xl md:text-5xl">Your 90-Day Journey</h2>
        <span className="text-warm-gray text-sm tracking-wider uppercase">Day {currentDay} of 90</span>
      </div>

      {/* Progress Bar */}
      <div className="bg-luxury-black text-soft-white p-10 mb-10 relative overflow-hidden">
        <div className="absolute -top-10 right-10 font-serif text-[200px] text-soft-white opacity-[0.03]">02</div>
        
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-serif text-2xl">Transformation Progress</h3>
            <span className="text-warm-gray">
              <ProgressAnimation targetValue={animatedProgress} suffix="%" /> Complete
            </span>
          </div>
          
          <ProgressBar 
            percentage={animatedProgress}
            height={16}
            color="#F1F1F1"
            backgroundColor="rgba(241, 241, 241, 0.1)"
            showText={false}
            className="mb-5"
          />
          
          <div className="flex justify-between text-sm">
            <span>Day <ProgressAnimation targetValue={currentDay} /></span>
            <span><ProgressAnimation targetValue={25} /> days remaining</span>
          </div>
        </div>
      </div>

      {/* Milestones Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Completed Milestones */}
        <div>
          <h3 className="font-serif text-2xl mb-6">Completed Milestones</h3>
          <div className="space-y-4">
            {completedMilestones.map((milestone) => (
              <div key={milestone.id} className="flex items-start gap-4 p-4 bg-[#FAFAFA] hover:bg-luxury-black hover:text-soft-white transition-all duration-300">
                <div className="text-2xl">{getCategoryIcon(milestone.category)}</div>
                <div className="flex-1">
                  <div className="font-medium mb-1">{milestone.title}</div>
                  <div className="text-sm opacity-70 mb-2">{milestone.description}</div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 tracking-wider uppercase ${getCategoryColor(milestone.category)}`}>
                      {milestone.category}
                    </span>
                    {milestone.completedDate && (
                      <span className="text-xs opacity-50">
                        {new Date(milestone.completedDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-2xl opacity-50">✓</div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Milestones */}
        <div>
          <h3 className="font-serif text-2xl mb-6">Upcoming Milestones</h3>
          <div className="space-y-4">
            {upcomingMilestones.map((milestone) => (
              <div key={milestone.id} className="flex items-start gap-4 p-4 border border-warm-gray/20 hover:border-luxury-black transition-all">
                <div className="text-2xl opacity-50">{getCategoryIcon(milestone.category)}</div>
                <div className="flex-1">
                  <div className="font-medium mb-1">{milestone.title}</div>
                  <div className="text-sm text-warm-gray mb-2">{milestone.description}</div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 tracking-wider uppercase opacity-50 ${getCategoryColor(milestone.category)}`}>
                      {milestone.category}
                    </span>
                    <span className="text-xs text-warm-gray">
                      Target: Day {milestone.targetDay}
                    </span>
                  </div>
                </div>
                <div className="text-sm text-warm-gray">
                  {milestone.targetDay - currentDay} days
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-10 bg-[#FAFAFA] p-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h4 className="font-serif text-xl mb-2">Ready for Your Next Breakthrough?</h4>
          <p className="text-warm-gray">You're only 5 points away from your next confidence milestone.</p>
        </div>
        <button className="bg-luxury-black text-soft-white px-8 py-3 text-sm tracking-wider uppercase hover:bg-warm-gray hover:text-luxury-black transition-all">
          Take Action
        </button>
      </div>
    </section>
  )
}
