'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('30d')

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
              <Link href="/tools/analytics" className="font-neue text-black font-medium">
                Analytics
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
                Brand Analytics
              </h1>
              <p className="font-neue text-gray-600">
                Track your personal brand growth and engagement
              </p>
            </div>
            
            {/* Time Range Selector */}
            <div className="flex space-x-1 bg-white rounded-lg p-1 mt-4 md:mt-0">
              {[
                { value: '7d', label: '7 Days' },
                { value: '30d', label: '30 Days' },
                { value: '90d', label: '90 Days' },
                { value: '1y', label: '1 Year' }
              ].map((range) => (
                <button 
                  key={range.value}
                  onClick={() => setTimeRange(range.value)}
                  className={`px-4 py-2 rounded-md font-neue text-sm transition-colors ${
                    timeRange === range.value 
                      ? 'bg-black text-white' 
                      : 'text-gray-600 hover:text-black'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white border border-gray-200 rounded-3xl p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-neue text-sm text-gray-600">Total Reach</h3>
                <span className="text-green-500 font-neue text-xs">+12.5%</span>
              </div>
              <div className="font-cormorant text-3xl font-bold text-black mb-1">24.8K</div>
              <div className="font-neue text-xs text-gray-500">vs last period</div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-3xl p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-neue text-sm text-gray-600">Engagement Rate</h3>
                <span className="text-green-500 font-neue text-xs">+2.8%</span>
              </div>
              <div className="font-cormorant text-3xl font-bold text-black mb-1">6.8%</div>
              <div className="font-neue text-xs text-gray-500">Above industry avg</div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-3xl p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-neue text-sm text-gray-600">New Followers</h3>
                <span className="text-green-500 font-neue text-xs">+145</span>
              </div>
              <div className="font-cormorant text-3xl font-bold text-black mb-1">1,247</div>
              <div className="font-neue text-xs text-gray-500">This month</div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-3xl p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-neue text-sm text-gray-600">Brand Score</h3>
                <span className="text-blue-500 font-neue text-xs">Excellent</span>
              </div>
              <div className="font-cormorant text-3xl font-bold text-black mb-1">94</div>
              <div className="font-neue text-xs text-gray-500">AI-powered rating</div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid lg:grid-cols-2 gap-8">
            
            {/* Engagement Over Time */}
            <div className="bg-white border border-gray-200 rounded-3xl p-6">
              <h3 className="font-cormorant text-xl font-semibold mb-6">Engagement Trends</h3>
              <div className="h-64 bg-gradient-to-t from-blue-50 to-transparent rounded-xl flex items-end justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl">📈</span>
                  </div>
                  <p className="font-neue text-gray-600">Chart visualization coming soon</p>
                </div>
              </div>
            </div>

            {/* Platform Breakdown */}
            <div className="bg-white border border-gray-200 rounded-3xl p-6">
              <h3 className="font-cormorant text-xl font-semibold mb-6">Platform Performance</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                    <span className="font-neue">Instagram</span>
                  </div>
                  <div className="text-right">
                    <div className="font-neue font-semibold">68%</div>
                    <div className="font-neue text-xs text-gray-500">16.8K reach</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="font-neue">LinkedIn</span>
                  </div>
                  <div className="text-right">
                    <div className="font-neue font-semibold">22%</div>
                    <div className="font-neue text-xs text-gray-500">5.5K reach</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-black rounded-full"></div>
                    <span className="font-neue">Twitter</span>
                  </div>
                  <div className="text-right">
                    <div className="font-neue font-semibold">10%</div>
                    <div className="font-neue text-xs text-gray-500">2.5K reach</div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                <h4 className="font-neue font-semibold text-sm mb-2">Top Performing Platform</h4>
                <p className="font-neue text-sm text-gray-600">
                  Instagram drives 68% of your reach. Consider posting more frequently there.
                </p>
              </div>
            </div>
          </div>

          {/* Content Performance */}
          <div className="bg-white border border-gray-200 rounded-3xl p-6">
            <h3 className="font-cormorant text-xl font-semibold mb-6">Top Performing Content</h3>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="border border-gray-100 rounded-xl p-4">
                <div className="aspect-square bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-4xl">📸</span>
                </div>
                <div className="space-y-2">
                  <h4 className="font-neue font-semibold text-sm">Monday Motivation Selfie</h4>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <div className="font-neue text-gray-500">Likes</div>
                      <div className="font-neue font-semibold">1,247</div>
                    </div>
                    <div>
                      <div className="font-neue text-gray-500">Comments</div>
                      <div className="font-neue font-semibold">89</div>
                    </div>
                  </div>
                  <div className="flex items-center text-xs">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    <span className="font-neue text-green-600">High engagement</span>
                  </div>
                </div>
              </div>
              
              <div className="border border-gray-100 rounded-xl p-4">
                <div className="aspect-square bg-gradient-to-br from-blue-100 to-green-100 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-4xl">💼</span>
                </div>
                <div className="space-y-2">
                  <h4 className="font-neue font-semibold text-sm">Behind the Scenes Work</h4>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <div className="font-neue text-gray-500">Likes</div>
                      <div className="font-neue font-semibold">892</div>
                    </div>
                    <div>
                      <div className="font-neue text-gray-500">Comments</div>
                      <div className="font-neue font-semibold">156</div>
                    </div>
                  </div>
                  <div className="flex items-center text-xs">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    <span className="font-neue text-blue-600">High saves</span>
                  </div>
                </div>
              </div>
              
              <div className="border border-gray-100 rounded-xl p-4">
                <div className="aspect-square bg-gradient-to-br from-yellow-100 to-orange-100 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-4xl">🎯</span>
                </div>
                <div className="space-y-2">
                  <h4 className="font-neue font-semibold text-sm">Goal Achievement Post</h4>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <div className="font-neue text-gray-500">Likes</div>
                      <div className="font-neue font-semibold">756</div>
                    </div>
                    <div>
                      <div className="font-neue text-gray-500">Comments</div>
                      <div className="font-neue font-semibold">203</div>
                    </div>
                  </div>
                  <div className="flex items-center text-xs">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                    <span className="font-neue text-yellow-600">High shares</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Insights */}
          <div className="grid lg:grid-cols-2 gap-8">
            
            {/* Growth Opportunities */}
            <div className="bg-white border border-gray-200 rounded-3xl p-6">
              <h3 className="font-cormorant text-xl font-semibold mb-6">AI Growth Insights</h3>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-xl">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs">💡</span>
                    </div>
                    <div>
                      <h4 className="font-neue font-semibold text-sm mb-1">Optimal Posting Time</h4>
                      <p className="font-neue text-sm text-gray-600">
                        Your audience is most active between 2-4 PM. Consider scheduling more posts during this window.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-green-50 rounded-xl">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs">📸</span>
                    </div>
                    <div>
                      <h4 className="font-neue font-semibold text-sm mb-1">Content Mix</h4>
                      <p className="font-neue text-sm text-gray-600">
                        Your selfie posts get 40% higher engagement. Try increasing this content type.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-purple-50 rounded-xl">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs">🎯</span>
                    </div>
                    <div>
                      <h4 className="font-neue font-semibold text-sm mb-1">Audience Growth</h4>
                      <p className="font-neue text-sm text-gray-600">
                        Your growth rate is 15% above average. Keep posting consistently to maintain momentum.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Brand Health Score */}
            <div className="bg-white border border-gray-200 rounded-3xl p-6">
              <h3 className="font-cormorant text-xl font-semibold mb-6">Brand Health Score</h3>
              
              <div className="text-center mb-6">
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <div className="w-full h-full bg-gray-200 rounded-full"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="font-cormorant text-3xl font-bold text-black">94</div>
                      <div className="font-neue text-xs text-gray-600">Excellent</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-neue text-gray-600">Authenticity</span>
                    <span className="font-neue font-semibold">98%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{width: '98%'}}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-neue text-gray-600">Consistency</span>
                    <span className="font-neue font-semibold">89%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{width: '89%'}}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-neue text-gray-600">Engagement Quality</span>
                    <span className="font-neue font-semibold">96%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{width: '96%'}}></div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                <p className="font-neue text-sm text-gray-600">
                  Your brand is performing exceptionally well across all metrics. Keep up the authentic content and consistent posting schedule.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
