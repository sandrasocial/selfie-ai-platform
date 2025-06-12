import { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Check, Star, Play, Users, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleOptIn = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Connect to Flodesk
    setIsSubmitted(true);
  };

  const testimonials = [
    {
      name: "@daniellamerrill",
      title: "Community Member",
      content: "I manifest to be surrounded only by people like you, who uplift and inspire each other like this.",
      rating: 5
    },
    {
      name: "@flourish.n.flow.with.roxanne", 
      title: "Community Member",
      content: "You're helping me so much to develop my 'just do it' attitude -- Thank You!",
      rating: 5
    },
    {
      name: "@curatedcomfortsbysharene",
      title: "Community Member", 
      content: "Girl! Love this 🔥",
      rating: 5
    }
  ];

  const features = [
    "AI Studio - Generate content with your voice",
    "Smart Templates - 30+ proven content formats", 
    "Sandra AI Chat - Your personal branding coach",
    "Analytics Dashboard - Track your growth",
    "Content Planner - Never run out of ideas",
    "Workbooks - Step-by-step brand building"
  ];

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-white">
        {/* Navigation */}
        <nav className="border-b border-gray-100 px-6 py-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="font-bold text-xl">SELFIE AI™</div>
          </div>
        </nav>

        {/* Thank You Content */}
        <section className="w-full py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-8">
              <Check className="w-8 h-8 text-white" />
            </div>
            
            <h1 className="font-['Prata'] text-4xl lg:text-5xl mb-6 text-black">
              Check Your Inbox!
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
              Your free Ultimate Selfie Guide is on its way. Check your email for instant access.
            </p>

            {/* Immediate Upsell */}
            <div className="bg-gray-50 rounded-lg p-8 max-w-2xl mx-auto">
              <h2 className="font-['Prata'] text-3xl mb-4">Want to Go Deeper?</h2>
              <p className="text-gray-600 mb-6">
                Ready to transform your entire personal brand? Get the complete system that's helped thousands of women build profitable personal brands.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span>30+ Done-For-You Content Templates</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span>Signature Hook Formula That Converts</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span>Personal Brand Strategy Workbook</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span>Content Batching System</span>
                </div>
              </div>

              <div className="mb-6">
                <div className="text-3xl font-bold mb-2">$47</div>
                <div className="text-gray-600">One-time payment • Instant access</div>
              </div>

              <Link href="/products/starter-kit">
                <Button size="lg" className="bg-black text-white hover:bg-gray-800 text-lg px-12 py-4">
                  Get the Starter Kit Now
                </Button>
              </Link>

              <div className="mt-4 text-sm text-gray-500">
                30-day money-back guarantee
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-100 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="font-bold text-xl">SELFIE AI™</div>
          <div className="flex items-center gap-4">
            <Link href="/temp-admin">
              <Button variant="outline" size="sm">Admin</Button>
            </Link>
          </div>
        </div>
      </nav>
      
      {/* Hero Section */}
      <section className="w-full py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="space-y-8">
            <div>
              <h1 className="font-['Prata'] text-5xl md:text-6xl lg:text-7xl mb-6 text-black leading-tight">
                The AI Branding System<br />
                <span className="text-gray-700">for Women</span>
              </h1>
              <p className="text-xl text-gray-600 font-medium tracking-wide leading-relaxed mb-8 max-w-3xl mx-auto">
                Build your personal brand with the content system that helped me go from heartbreak to 120K followers
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-8 max-w-md mx-auto">
              <h3 className="font-['Prata'] text-2xl mb-4">Get the Free Selfie Guide</h3>
              <p className="text-gray-600 mb-6">
                The exact framework I used to build my following and transform my life
              </p>
              <form onSubmit={handleOptIn} className="space-y-4">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
                <Button type="submit" className="w-full bg-black text-white hover:bg-gray-800 py-3 text-lg">
                  Get Free Guide
                </Button>
              </form>
              <div className="text-sm text-gray-500 mt-4">
                Join 2,847+ women building their empires
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sandra's Story */}
      <section className="w-full py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div>
                <h2 className="font-['Prata'] text-4xl md:text-5xl mb-6 text-black">
                  From Heartbreak<br />
                  <span className="text-gray-700">to 120K</span>
                </h2>
                <p className="text-xl text-gray-600 font-medium tracking-wide leading-relaxed mb-6">
                  Two years ago, I was at rock bottom. Heartbroken, lost, and struggling to find my voice. 
                  Today, I've built a 120K+ community and turned my pain into purpose.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  The secret? A systematic approach to personal branding that turns your authentic story 
                  into magnetic content that builds real connections and drives real results.
                </p>
              </div>
            </div>
            
            <div className="relative">
              <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                <Play className="w-16 h-16 text-gray-400" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg"></div>
            </div>
          </div>
        </div>
      </section>

      {/* What's Inside */}
      <section className="w-full py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="font-['Prata'] text-4xl lg:text-5xl mb-12 text-black">
            What's Inside SELFIE AI™
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-['Prata'] text-xl mb-3 text-black">
                  {feature.split(' - ')[0]}
                </h3>
                <p className="text-gray-600">
                  {feature.split(' - ')[1]}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-12">
            <p className="text-lg text-gray-600 mb-6">Full platform launching soon</p>
            <Link href="/products/starter-kit">
              <Button size="lg" className="bg-black text-white hover:bg-gray-800 text-lg px-8 py-4">
                Start with the Starter Kit
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="w-full py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-['Prata'] text-4xl lg:text-5xl mb-12 text-black text-center">
            What Women Are Saying
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div>
                  <div className="font-semibold text-black">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.title}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Available Products */}
      <section className="w-full py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="font-['Prata'] text-4xl lg:text-5xl mb-12 text-black">
            Start Your Transformation Today
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="border border-gray-200 rounded-lg p-8">
              <h3 className="font-['Prata'] text-2xl mb-4">Starter Kit</h3>
              <div className="text-3xl font-bold mb-4">$47</div>
              <p className="text-gray-600 mb-6">Perfect for getting started with proven templates and strategies</p>
              <Link href="/products/starter-kit">
                <Button className="w-full bg-black text-white hover:bg-gray-800">
                  Get Started
                </Button>
              </Link>
            </div>
            
            <div className="border-2 border-black rounded-lg p-8 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-black text-white px-4 py-1 rounded-full text-sm">
                Most Popular
              </div>
              <h3 className="font-['Prata'] text-2xl mb-4">Branded By Selfie™</h3>
              <div className="text-3xl font-bold mb-4">$397</div>
              <p className="text-gray-600 mb-6">Complete 8-week transformation program for building your empire</p>
              <Link href="/products/branded-by-selfie">
                <Button className="w-full bg-black text-white hover:bg-gray-800">
                  Transform Now
                </Button>
              </Link>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-8">
              <h3 className="font-['Prata'] text-2xl mb-4">Preset Bundles</h3>
              <div className="text-3xl font-bold mb-4">$5-15</div>
              <p className="text-gray-600 mb-6">Professional Lightroom presets for consistent, stunning content</p>
              <Link href="/products/presets">
                <Button className="w-full bg-black text-white hover:bg-gray-800">
                  Shop Presets
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 border-t border-gray-100">
        <div className="max-w-6xl mx-auto text-center text-gray-600">
          <div className="font-bold text-lg mb-4">SELFIE AI™</div>
          <p>© 2024 SELFIE AI™. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}