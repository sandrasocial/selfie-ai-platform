import Image from 'next/image'
import Link from 'next/link'

export default function AboutPage() {
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
              <Link href="/" className="font-neue text-gray-700 hover:text-black transition-colors">
                Home
              </Link>
              <Link href="/about" className="font-neue text-black font-medium">
                About
              </Link>
              <Link href="/freebie/selfie-guide" className="font-neue text-gray-700 hover:text-black transition-colors">
                Free Guide
              </Link>
              <Link href="/login" className="font-neue text-gray-700 hover:text-black transition-colors">
                Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-cormorant text-5xl md:text-7xl font-bold text-black mb-6">
            Meet Sandra
          </h1>
          <p className="font-neue text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
            The woman behind SELFIE AI™ and your new personal brand bestie
          </p>
        </div>
      </section>

      {/* Main Story */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div className="order-2 md:order-1">
              <h2 className="font-cormorant text-4xl font-semibold text-black mb-6">
                From Camera Roll to Empire
              </h2>
              <div className="font-neue text-lg text-gray-700 space-y-4">
                <p>
                  I used to think my selfies were just pictures. Then I realized they were my brand waiting to happen.
                </p>
                <p>
                  After building multiple six-figure businesses using nothing but my phone camera and authentic storytelling, I knew other women needed this exact system.
                </p>
                <p>
                  SELFIE AI™ was born from hundreds of late-night strategy sessions, countless client transformations, and one simple truth: your selfie is already your brand—you just need to own it.
                </p>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <div className="aspect-square bg-gradient-to-br from-pink-100 to-purple-100 rounded-2xl p-8 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 bg-white rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="font-cormorant text-4xl">👑</span>
                  </div>
                  <p className="font-neue text-sm text-gray-600">Sandra's Photo</p>
                </div>
              </div>
            </div>
          </div>

          {/* Values */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">💎</span>
              </div>
              <h3 className="font-cormorant text-xl font-semibold mb-2">Authentic Over Perfect</h3>
              <p className="font-neue text-gray-600">
                Real beats polished every time. Your authentic self is your superpower.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="font-cormorant text-xl font-semibold mb-2">Built for Real Life</h3>
              <p className="font-neue text-gray-600">
                Strategies that work with your busy schedule, not against it.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">🤝</span>
              </div>
              <h3 className="font-cormorant text-xl font-semibold mb-2">Women Supporting Women</h3>
              <p className="font-neue text-gray-600">
                We rise by lifting each other. Community over competition, always.
              </p>
            </div>
          </div>

          {/* Story Continues */}
          <div className="bg-gray-50 rounded-3xl p-8 md:p-12 mb-16">
            <h2 className="font-cormorant text-3xl font-semibold text-black mb-6">
              Why SELFIE AI™ Exists
            </h2>
            <div className="font-neue text-lg text-gray-700 space-y-4">
              <p>
                After working with over 500 women entrepreneurs, I noticed the same pattern: brilliant women hiding behind generic stock photos while their authentic stories collected dust in their camera rolls.
              </p>
              <p>
                That's when I realized the problem wasn't that women didn't know how to build brands—it's that no one was teaching them how to build brands that actually felt like them.
              </p>
              <p>
                SELFIE AI™ changes that. We're not just building pretty profiles; we're building empires rooted in authenticity. One selfie at a time.
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-8 text-center mb-16">
            <div>
              <div className="font-cormorant text-4xl font-bold text-black mb-2">10,000+</div>
              <div className="font-neue text-gray-600">Women Transformed</div>
            </div>
            <div>
              <div className="font-cormorant text-4xl font-bold text-black mb-2">$2M+</div>
              <div className="font-neue text-gray-600">Revenue Generated</div>
            </div>
            <div>
              <div className="font-cormorant text-4xl font-bold text-black mb-2">90 Days</div>
              <div className="font-neue text-gray-600">Average Transformation</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-black text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-cormorant text-4xl md:text-6xl font-bold mb-6">
            Ready to Build Your Empire?
          </h2>
          <p className="font-neue text-xl text-gray-300 mb-8">
            Start with our free guide and see what's possible when you own your story
          </p>
          <Link 
            href="/freebie/selfie-guide"
            className="inline-block bg-white text-black font-neue font-semibold px-8 py-4 rounded-full hover:bg-gray-100 transition-colors"
          >
            Get the Free Guide
          </Link>
        </div>
      </section>
    </div>
  )
} 