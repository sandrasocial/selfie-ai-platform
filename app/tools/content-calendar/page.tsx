'use client'

import Link from 'next/link'
import { useState } from 'react'

const samplePosts = [
  {
    id: 1,
    date: '2024-01-15',
    time: '09:00',
    platform: 'Instagram',
    type: 'Selfie + Story',
    caption: 'Monday motivation: Your authentic self is your superpower. What story are you telling today?',
    image: '/api/placeholder/300/300',
    status: 'scheduled'
  },
  {
    id: 2,
    date: '2024-01-16',
    time: '14:30',
    platform: 'LinkedIn',
    type: 'Professional Headshot',
    caption: 'Building authentic connections in business starts with showing up as yourself...',
    image: '/api/placeholder/300/300',
    status: 'draft'
  },
  {
    id: 3,
    date: '2024-01-17',
    time: '18:00',
    platform: 'Instagram',
    type: 'Behind the Scenes',
    caption: 'Real talk: This is what building a personal brand actually looks like...',
    image: '/api/placeholder/300/300',
    status: 'scheduled'
  }
]

export default function ContentCalendarPage() {
  const [view, setView] = useState('calendar')
  const [selectedDate, setSelectedDate] = useState(new Date())

  return (
    <div className="min-h-screen bg-white">
      
      {/* Navigation */}
      <nav className="w-full bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="font-cormorant text-2xl font-semibold text-black">
              SELFIE AI™
            </Link>
            <div className="hidden md:flex space-x-8">
              <Link href="/dashboard" className="font-neue text-gray-700 hover:text-black transition-colors">
                Dashboard
              </Link>
              <Link href="/tools/content-calendar" className="font-neue text-black font-medium">
                Content Calendar
              </Link>
              <Link href="/chat/sandra" className="font-neue text-gray-700 hover:text-black transition-colors">
                Sandra AI
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="py-8 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h1 className="font-cormorant text-4xl font-bold text-black mb-2">
                Content Calendar
              </h1>
              <p className="font-neue text-gray-600">
                Plan, schedule, and track your personal brand content
              </p>
            </div>
            <button className="bg-black text-white font-neue font-medium px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors mt-4 md:mt-0">
              Create New Post
            </button>
          </div>

          {/* View Toggle */}
          <div className="flex space-x-1 bg-white rounded-lg p-1 w-fit">
            <button 
              onClick={() => setView('calendar')}
              className={`px-4 py-2 rounded-md font-neue text-sm transition-colors ${
                view === 'calendar' 
                  ? 'bg-black text-white' 
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              Calendar View
            </button>
            <button 
              onClick={() => setView('list')}
              className={`px-4 py-2 rounded-md font-neue text-sm transition-colors ${
                view === 'list' 
                  ? 'bg-black text-white' 
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              List View
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          
          {view === 'calendar' && (
            <div className="grid lg:grid-cols-4 gap-8">
              
              {/* Calendar */}
              <div className="lg:col-span-3">
                <div className="bg-white border border-gray-200 rounded-3xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-cormorant text-2xl font-semibold">January 2024</h2>
                    <div className="flex space-x-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg">
                        <span className="sr-only">Previous month</span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg">
                        <span className="sr-only">Next month</span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-1 mb-4">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <div key={day} className="p-2 text-center font-neue text-sm font-medium text-gray-600">
                        {day}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: 35 }, (_, i) => {
                      const day = i - 6 + 1
                      const hasPost = [15, 16, 17, 20, 23, 25, 28].includes(day)
                      const isToday = day === 15
                      
                      return (
                        <div 
                          key={i} 
                          className={`p-2 min-h-[80px] border border-gray-100 ${
                            day > 0 && day <= 31 ? 'bg-white hover:bg-gray-50' : 'bg-gray-50'
                          } ${isToday ? 'ring-2 ring-black' : ''} cursor-pointer`}
                        >
                          {day > 0 && day <= 31 && (
                            <>
                              <div className={`font-neue text-sm ${isToday ? 'font-bold' : ''}`}>
                                {day}
                              </div>
                              {hasPost && (
                                <div className="mt-1 space-y-1">
                                  <div className="w-full h-2 bg-blue-500 rounded-full"></div>
                                  {day === 16 && <div className="w-full h-2 bg-green-500 rounded-full"></div>}
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                
                {/* Quick Stats */}
                <div className="bg-white border border-gray-200 rounded-3xl p-6">
                  <h3 className="font-cormorant text-xl font-semibold mb-4">This Month</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="font-neue text-gray-600">Scheduled</span>
                      <span className="font-neue font-semibold">12</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-neue text-gray-600">Drafts</span>
                      <span className="font-neue font-semibold">5</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-neue text-gray-600">Published</span>
                      <span className="font-neue font-semibold">8</span>
                    </div>
                  </div>
                </div>

                {/* Content Ideas */}
                <div className="bg-white border border-gray-200 rounded-3xl p-6">
                  <h3 className="font-cormorant text-xl font-semibold mb-4">AI Content Ideas</h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="font-neue text-sm font-medium">Monday Motivation</div>
                      <div className="font-neue text-xs text-gray-600 mt-1">Share your morning routine</div>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="font-neue text-sm font-medium">Behind the Scenes</div>
                      <div className="font-neue text-xs text-gray-600 mt-1">Show your workspace setup</div>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <div className="font-neue text-sm font-medium">Client Win</div>
                      <div className="font-neue text-xs text-gray-600 mt-1">Celebrate a success story</div>
                    </div>
                  </div>
                  <button className="w-full mt-4 p-2 border border-gray-200 rounded-lg hover:border-black transition-colors">
                    <span className="font-neue text-sm">Get More Ideas</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {view === 'list' && (
            <div className="grid lg:grid-cols-3 gap-8">
              
              {/* Posts List */}
              <div className="lg:col-span-2">
                <div className="bg-white border border-gray-200 rounded-3xl p-6">
                  <h2 className="font-cormorant text-2xl font-semibold mb-6">Upcoming Posts</h2>
                  
                  <div className="space-y-4">
                    {samplePosts.map((post) => (
                      <div key={post.id} className="flex space-x-4 p-4 border border-gray-100 rounded-xl hover:border-gray-200 transition-colors">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center">
                          <span className="text-2xl">📸</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-neue ${
                              post.status === 'scheduled' 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {post.status}
                            </span>
                            <span className="font-neue text-sm text-gray-600">
                              {post.platform}
                            </span>
                          </div>
                          <h3 className="font-neue font-medium text-sm mb-1">{post.type}</h3>
                          <p className="font-neue text-sm text-gray-600 truncate">
                            {post.caption}
                          </p>
                          <div className="font-neue text-xs text-gray-500 mt-2">
                            {post.date} at {post.time}
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          <button className="p-2 hover:bg-gray-100 rounded-lg">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tools Sidebar */}
              <div className="space-y-6">
                
                {/* Post Templates */}
                <div className="bg-white border border-gray-200 rounded-3xl p-6">
                  <h3 className="font-cormorant text-xl font-semibold mb-4">Post Templates</h3>
                  <div className="space-y-3">
                    <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-black transition-colors">
                      <div className="font-neue font-medium text-sm">Monday Motivation</div>
                      <div className="font-neue text-xs text-gray-600">Inspirational selfie + quote</div>
                    </button>
                    <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-black transition-colors">
                      <div className="font-neue font-medium text-sm">Work in Progress</div>
                      <div className="font-neue text-xs text-gray-600">Behind-the-scenes content</div>
                    </button>
                    <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-black transition-colors">
                      <div className="font-neue font-medium text-sm">Achievement Post</div>
                      <div className="font-neue text-xs text-gray-600">Celebrate wins & milestones</div>
                    </button>
                  </div>
                </div>

                {/* Analytics Preview */}
                <div className="bg-white border border-gray-200 rounded-3xl p-6">
                  <h3 className="font-cormorant text-xl font-semibold mb-4">Performance</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="font-neue text-sm text-gray-600">Engagement Rate</span>
                        <span className="font-neue text-sm font-semibold">6.8%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{width: '68%'}}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="font-neue text-sm text-gray-600">Reach Growth</span>
                        <span className="font-neue text-sm font-semibold">+24%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{width: '24%'}}></div>
                      </div>
                    </div>
                  </div>
                  <Link 
                    href="/tools/analytics"
                    className="block w-full mt-4 p-2 text-center border border-gray-200 rounded-lg hover:border-black transition-colors"
                  >
                    <span className="font-neue text-sm">View Full Analytics</span>
                  </Link>
                </div>

              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
