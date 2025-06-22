import Link from 'next/link'
import { useState } from 'react'

export default function PhotoStudioPage() {
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
              <Link href="/tools/photo-studio" className="font-neue text-black font-medium">
                Photo Studio
              </Link>
              <Link href="/chat/sandra" className="font-neue text-gray-700 hover:text-black transition-colors">
                Sandra AI
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="font-cormorant text-4xl md:text-6xl font-bold text-black mb-6">
              AI Photo Studio
            </h1>
            <p className="font-neue text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Transform your selfies into professional brand photos with AI-powered editing tools
            </p>
          </div>
        </div>
      </section>

      {/* Main Studio Interface */}
      <section className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Upload & Preview */}
            <div className="lg:col-span-2">
              <div className="bg-gray-50 rounded-3xl p-8 mb-8">
                <h2 className="font-cormorant text-2xl font-semibold mb-6">Upload Your Photo</h2>
                
                {/* Upload Area */}
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center mb-6">
                  <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl">📸</span>
                  </div>
                  <h3 className="font-neue font-semibold text-lg mb-2">Drop your selfie here</h3>
                  <p className="font-neue text-gray-600 mb-4">Or click to browse your files</p>
                  <button className="bg-black text-white font-neue font-medium px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors">
                    Choose Photo
                  </button>
                </div>

                {/* Photo Preview */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-neue font-semibold mb-4">Original</h3>
                    <div className="aspect-square bg-gray-100 rounded-xl flex items-center justify-center">
                      <span className="font-neue text-gray-500">Upload a photo to start</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-neue font-semibold mb-4">AI Enhanced</h3>
                    <div className="aspect-square bg-gray-100 rounded-xl flex items-center justify-center">
                      <span className="font-neue text-gray-500">Preview will appear here</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhancement Controls */}
              <div className="bg-white border border-gray-200 rounded-3xl p-8">
                <h2 className="font-cormorant text-2xl font-semibold mb-6">Enhancement Controls</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block font-neue font-medium text-gray-700 mb-2">
                      Skin Smoothing
                    </label>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      defaultValue="30"
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  
                  <div>
                    <label className="block font-neue font-medium text-gray-700 mb-2">
                      Brightness
                    </label>
                    <input 
                      type="range" 
                      min="-50" 
                      max="50" 
                      defaultValue="0"
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  
                  <div>
                    <label className="block font-neue font-medium text-gray-700 mb-2">
                      Contrast
                    </label>
                    <input 
                      type="range" 
                      min="-50" 
                      max="50" 
                      defaultValue="0"
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  
                  <div>
                    <label className="block font-neue font-medium text-gray-700 mb-2">
                      Warmth
                    </label>
                    <input 
                      type="range" 
                      min="-50" 
                      max="50" 
                      defaultValue="10"
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>

                <div className="flex gap-4 mt-8">
                  <button className="flex-1 bg-gray-100 text-gray-700 font-neue font-medium py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors">
                    Reset
                  </button>
                  <button className="flex-1 bg-black text-white font-neue font-medium py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors">
                    Apply AI Magic
                  </button>
                </div>
              </div>
            </div>

            {/* AI Presets & Tools */}
            <div className="space-y-8">
              
              {/* AI Presets */}
              <div className="bg-white border border-gray-200 rounded-3xl p-6">
                <h3 className="font-cormorant text-xl font-semibold mb-4">AI Presets</h3>
                <div className="space-y-3">
                  <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-black transition-colors">
                    <div className="font-neue font-medium">Professional Headshot</div>
                    <div className="font-neue text-sm text-gray-600">LinkedIn & business ready</div>
                  </button>
                  <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-black transition-colors">
                    <div className="font-neue font-medium">Instagram Ready</div>
                    <div className="font-neue text-sm text-gray-600">Warm & engaging</div>
                  </button>
                  <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-black transition-colors">
                    <div className="font-neue font-medium">Brand Ambassador</div>
                    <div className="font-neue text-sm text-gray-600">Authoritative & polished</div>
                  </button>
                  <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-black transition-colors">
                    <div className="font-neue font-medium">Natural Glow</div>
                    <div className="font-neue text-sm text-gray-600">Subtle enhancement</div>
                  </button>
                </div>
              </div>

              {/* Background Tools */}
              <div className="bg-white border border-gray-200 rounded-3xl p-6">
                <h3 className="font-cormorant text-xl font-semibold mb-4">Background</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button className="aspect-video bg-gradient-to-br from-white to-gray-100 rounded-lg border-2 border-transparent hover:border-black transition-colors flex items-center justify-center">
                    <span className="font-neue text-xs">Clean White</span>
                  </button>
                  <button className="aspect-video bg-gradient-to-br from-gray-800 to-black rounded-lg border-2 border-transparent hover:border-gray-400 transition-colors flex items-center justify-center">
                    <span className="font-neue text-xs text-white">Dark Pro</span>
                  </button>
                  <button className="aspect-video bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg border-2 border-transparent hover:border-blue-400 transition-colors flex items-center justify-center">
                    <span className="font-neue text-xs text-white">Gradient</span>
                  </button>
                  <button className="aspect-video bg-gradient-to-br from-pink-200 to-rose-300 rounded-lg border-2 border-transparent hover:border-pink-400 transition-colors flex items-center justify-center">
                    <span className="font-neue text-xs">Soft Pink</span>
                  </button>
                </div>
                <button className="w-full mt-3 p-3 border border-gray-200 rounded-lg hover:border-black transition-colors">
                  <span className="font-neue text-sm">Remove Background</span>
                </button>
              </div>

              {/* Export Options */}
              <div className="bg-white border border-gray-200 rounded-3xl p-6">
                <h3 className="font-cormorant text-xl font-semibold mb-4">Export & Save</h3>
                <div className="space-y-3">
                  <button className="w-full bg-black text-white font-neue font-medium py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors">
                    Save to Photo Vault
                  </button>
                  <button className="w-full bg-blue-600 text-white font-neue font-medium py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                    Download High-Res
                  </button>
                  <button className="w-full bg-green-600 text-white font-neue font-medium py-3 px-4 rounded-lg hover:bg-green-700 transition-colors">
                    Share to Social
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tips Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-cormorant text-3xl font-semibold text-center text-black mb-12">
            Pro Tips for Better Results
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">💡</span>
              </div>
              <h3 className="font-neue font-semibold mb-2">Good Lighting</h3>
              <p className="font-neue text-gray-600 text-sm">
                Natural light works best. Face a window for even lighting.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">📐</span>
              </div>
              <h3 className="font-neue font-semibold mb-2">Square Format</h3>
              <p className="font-neue text-gray-600 text-sm">
                Square photos work best for most social platforms.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="font-neue font-semibold mb-2">Eye Contact</h3>
              <p className="font-neue text-gray-600 text-sm">
                Look directly at the camera for maximum connection.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
