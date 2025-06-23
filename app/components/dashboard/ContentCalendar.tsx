'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface ContentItem {
  id: number
  title: string
  content: string
  platform: string
  engagement_prediction: number
  hashtag_set: string
  scheduled_time: string
  image_url: string
  status?: 'draft' | 'scheduled' | 'published'
  performance?: {
    likes?: number
    comments?: number
    shares?: number
  }
}

interface ContentCalendarProps {
  content: ContentItem[]
}

export function ContentCalendar({ content }: ContentCalendarProps) {
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null)
  const [showPreview, setShowPreview] = useState(false)

  // Mock additional content for demonstration
  const upcomingContent: ContentItem[] = [
    {
      id: 2,
      title: "Authenticity Over Perfection",
      content: "The day I stopped trying to be perfect was the day I became magnetic. Here's what I learned about showing up authentically...",
      platform: "LinkedIn",
      engagement_prediction: 7.8,
      hashtag_set: "Thought Leadership",
      scheduled_time: "2:00 PM",
      image_url: "/images/authentic-post.jpg",
      status: 'scheduled'
    },
    {
      id: 3,
      title: "Behind the Brand",
      content: "You asked, so here's the real story behind my transformation. It wasn't pretty, but it was necessary...",
      platform: "Instagram Stories",
      engagement_prediction: 9.1,
      hashtag_set: "Behind the Scenes",
      scheduled_time: "6:00 PM",
      image_url: "/images/behind-brand.jpg",
      status: 'draft'
    }
  ]

  const allContent = [...content, ...upcomingContent]

  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram':
        return 'bg-luxury-black text-soft-white'
      case 'linkedin':
        return 'bg-warm-gray text-luxury-black'
      case 'instagram stories':
        return 'bg-soft-white border border-luxury-black text-luxury-black'
      default:
        return 'bg-warm-gray text-luxury-black'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-luxury-black text-soft-white'
      case 'scheduled':
        return 'bg-warm-gray text-luxury-black'
      case 'draft':
        return 'bg-soft-white border border-luxury-black text-luxury-black'
      default:
        return 'bg-warm-gray text-luxury-black'
    }
  }

  const getEngagementColor = (score: number) => {
    if (score >= 8.5) return 'text-luxury-black'
    if (score >= 7.0) return 'text-warm-gray'
    return 'text-warm-gray/70'
  }

  return (
    <section className="mb-20">
      <div className="flex justify-between items-baseline mb-10">
        <h2 className="font-serif text-4xl md:text-5xl">Today's Content</h2>
        <span className="text-warm-gray text-sm tracking-wider uppercase">Ready to shine</span>
      </div>

      {/* Featured Content */}
      {content[0] && (
        <div className="bg-white p-10 md:p-15 relative overflow-hidden mb-10">
          <div className="absolute -top-10 right-10 font-serif text-[200px] text-luxury-black opacity-[0.03]">03</div>
          
          <div className="flex justify-between items-baseline mb-10 relative z-10">
            <h3 className="font-serif text-3xl md:text-4xl">Ready to Share</h3>
            <span className="text-warm-gray text-sm tracking-wider uppercase">Optimized for {content[0].scheduled_time}</span>
          </div>

          <div className="grid md:grid-cols-[400px_1fr] gap-10 md:gap-15 relative z-10">
            <div className="aspect-[4/5] bg-warm-gray relative overflow-hidden">
              <Image 
                src={content[0].image_url} 
                alt={content[0].title}
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            
            <div>
              <h4 className="font-serif text-2xl md:text-3xl mb-5">{content[0].title}</h4>
              <p className="text-lg leading-relaxed mb-8">
                {content[0].content}
              </p>
              
              <div className="flex flex-wrap gap-10 mb-10">
                <div>
                  <div className="text-warm-gray text-xs tracking-wider uppercase mb-1">Platform</div>
                  <div className="font-medium">{content[0].platform}</div>
                </div>
                <div>
                  <div className="text-warm-gray text-xs tracking-wider uppercase mb-1">Engagement Prediction</div>
                  <div className={`font-medium ${getEngagementColor(content[0].engagement_prediction)}`}>
                    High ({content[0].engagement_prediction}/10)
                  </div>
                </div>
                <div>
                  <div className="text-warm-gray text-xs tracking-wider uppercase mb-1">Hashtag Set</div>
                  <div className="font-medium">{content[0].hashtag_set}</div>
                </div>
              </div>
              
              <div className="flex gap-4">
                <button 
                  onClick={() => {
                    setSelectedContent(content[0])
                    setShowPreview(true)
                  }}
                  className="bg-luxury-black text-soft-white px-8 py-3 text-sm tracking-wider uppercase hover:bg-warm-gray hover:text-luxury-black transition-all"
                >
                  Preview Post
                </button>
                <Link 
                  href="/tools/scheduler"
                  className="border border-luxury-black text-luxury-black px-8 py-3 text-sm tracking-wider uppercase hover:bg-luxury-black hover:text-soft-white transition-all"
                >
                  Schedule Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content Pipeline */}
      <div className="bg-[#FAFAFA] p-8 md:p-10">
        <h3 className="font-serif text-2xl mb-6">Content Pipeline</h3>
        
        <div className="grid gap-4">
          {allContent.map((item) => (
            <div key={item.id} className="bg-white p-6 flex items-center gap-6 hover:shadow-md transition-shadow">
              <div className="w-20 h-20 bg-warm-gray relative overflow-hidden flex-shrink-0">
                <Image 
                  src={item.image_url}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>
              
              <div className="flex-1">
                <h4 className="font-medium mb-2">{item.title}</h4>
                <p className="text-sm text-warm-gray mb-3 line-clamp-2">
                  {item.content.slice(0, 120)}...
                </p>
                
                <div className="flex items-center gap-4">
                  <span className={`text-xs px-2 py-1 tracking-wider uppercase ${getPlatformColor(item.platform)}`}>
                    {item.platform}
                  </span>
                  <span className="text-xs text-warm-gray">{item.scheduled_time}</span>
                  <span className={`text-xs ${getEngagementColor(item.engagement_prediction)}`}>
                    {item.engagement_prediction}/10
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {item.status && (
                  <span className={`text-xs px-3 py-1 tracking-wider uppercase ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                )}
                <button className="text-2xl text-warm-gray hover:text-luxury-black transition-colors">
                  →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 flex flex-wrap gap-4">
          <Link 
            href="/tools/content-generator"
            className="bg-luxury-black text-soft-white px-6 py-3 text-sm tracking-wider uppercase hover:bg-warm-gray hover:text-luxury-black transition-all"
          >
            Generate New Content
          </Link>
          <Link 
            href="/tools/scheduler"
            className="border border-luxury-black text-luxury-black px-6 py-3 text-sm tracking-wider uppercase hover:bg-luxury-black hover:text-soft-white transition-all"
          >
            View Full Calendar
          </Link>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && selectedContent && (
        <div className="fixed inset-0 bg-luxury-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white max-w-lg w-full p-8 relative">
            <button 
              onClick={() => setShowPreview(false)}
              className="absolute top-4 right-4 text-2xl hover:text-warm-gray transition-colors"
            >
              ×
            </button>
            
            <h3 className="font-serif text-2xl mb-4">Post Preview</h3>
            
            <div className="aspect-square bg-warm-gray mb-4 relative overflow-hidden">
              <Image 
                src={selectedContent.image_url}
                alt={selectedContent.title}
                fill
                className="object-cover"
              />
            </div>
            
            <h4 className="font-medium mb-2">{selectedContent.title}</h4>
            <p className="text-sm mb-4">{selectedContent.content}</p>
            
            <div className="flex justify-between items-center">
              <span className={`text-xs px-2 py-1 tracking-wider uppercase ${getPlatformColor(selectedContent.platform)}`}>
                {selectedContent.platform}
              </span>
              <button className="bg-luxury-black text-soft-white px-6 py-2 text-sm tracking-wider uppercase">
                Post Now
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
