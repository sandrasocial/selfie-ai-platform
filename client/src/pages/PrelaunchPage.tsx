import { useState } from "react";
import { Check, Star } from "lucide-react";
import { Link } from "wouter";

export default function PrelaunchPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Connect to email service
    setIsSubmitted(true);
  };

  const testimonials = [
    {
      name: "@daniellamerrill",
      content: "I manifest to be surrounded only by people like you, who uplift and inspire each other like this.",
      platform: "Instagram"
    },
    {
      name: "@flourish.n.flow.with.roxanne", 
      content: "You're helping me so much to develop my 'just do it' attitude -- Thank You!",
      platform: "Instagram"
    },
    {
      name: "@curatedcomfortsbysharene",
      content: "Girl! Love this 🔥",
      platform: "Instagram"
    }
  ];

  const features = [
    "30-Day Content Generator",
    "Sandra AI Mentor", 
    "Magnetic Messaging System",
    "Photo Editor + Feed Planner",
    "Preset Packs + Lifestyle Studio",
    "Selfie Blueprint Course",
    "Monetization Funnels"
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-5xl lg:text-6xl xl:text-7xl font-light leading-tight text-black" style={{ fontFamily: 'Prata, serif' }}>
                  The AI Branding System for{" "}
                  <span className="italic">Women Rebuilding After Setbacks</span>
                </h1>
                <p className="text-xl text-gray-700 max-w-xl leading-relaxed">
                  A powerful platform that helps you go from invisible to irresistible using content, confidence, and identity-first digital tools.
                </p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
                <div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-6 py-4 border border-gray-300 rounded-none focus:ring-2 focus:ring-black focus:border-transparent text-lg"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-black text-white py-4 px-8 rounded-none hover:bg-gray-800 transition-colors font-medium text-lg tracking-wide"
                >
                  Get Early Access + Free Selfie Guide
                </button>
                {isSubmitted && (
                  <p className="text-green-600 text-sm">Thank you! Check your inbox for the free guide.</p>
                )}
              </form>
            </div>
            
            <div className="relative">
              <img 
                src="/api/placeholder/600/700" 
                alt="Sandra - Confident woman entrepreneur" 
                className="w-full h-auto shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* What's Inside Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-light text-black mb-6" style={{ fontFamily: 'Prata, serif' }}>
              What's Inside SELFIE AI™
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Tools to rebuild your confidence, visibility, and brand from the inside out
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-8 shadow-sm border border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-black rounded-full"></div>
                  <h3 className="text-lg font-medium text-black">{feature}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why I Built This Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-light text-black mb-8" style={{ fontFamily: 'Prata, serif' }}>
            Why I Built This
          </h2>
          <div className="prose prose-xl mx-auto text-gray-700 leading-relaxed">
            <p className="text-xl">
              I was 39, post-divorce, with 3 kids — and I had to rebuild my identity from scratch. I used storytelling, selfies, and digital branding to find myself again.
            </p>
            <p className="text-xl mt-6">
              Now, I'm handing you the exact tools that changed my life — powered by AI and built for women who are done playing small.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-light text-black mb-6" style={{ fontFamily: 'Prata, serif' }}>
              What Women Are Saying
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-8 shadow-sm border border-gray-100">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-black text-black" />
                  ))}
                </div>
                <blockquote className="text-gray-700 mb-6 italic">
                  "{testimonial.content}"
                </blockquote>
                <div className="border-t pt-4">
                  <div className="font-medium text-black">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.platform}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-light text-black mb-6" style={{ fontFamily: 'Prata, serif' }}>
              Start Your Transformation Today
            </h2>
            <p className="text-xl text-gray-700">
              Choose your path to building an irresistible personal brand
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Selfie Starter Kit */}
            <div className="border border-gray-200 p-8 hover:shadow-lg transition-shadow">
              <div className="text-center">
                <h3 className="text-2xl font-light text-black mb-4" style={{ fontFamily: 'Prata, serif' }}>
                  Selfie Starter Kit
                </h3>
                <div className="text-4xl font-light text-black mb-6">$47</div>
                <p className="text-gray-600 mb-8">
                  The complete guide to taking magnetic selfies that build your brand and attract your ideal audience.
                </p>
                <a
                  href="https://selfieai.myshopify.com/products/selfie-starter-kit"
                  className="block w-full bg-black text-white py-3 px-6 rounded-none hover:bg-gray-800 transition-colors font-medium text-center"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Get Started
                </a>
              </div>
            </div>

            {/* Branded By Selfie */}
            <div className="border border-gray-200 p-8 hover:shadow-lg transition-shadow bg-gray-50">
              <div className="text-center">
                <div className="bg-black text-white px-3 py-1 text-sm font-medium mb-4 inline-block">
                  MOST POPULAR
                </div>
                <h3 className="text-2xl font-light text-black mb-4" style={{ fontFamily: 'Prata, serif' }}>
                  Branded By Selfie™
                </h3>
                <div className="text-4xl font-light text-black mb-6">$397</div>
                <p className="text-gray-600 mb-8">
                  The complete personal branding system including content templates, messaging frameworks, and strategy workbooks.
                </p>
                <a
                  href="https://selfieai.myshopify.com/products/branded-by-selfie"
                  className="block w-full bg-black text-white py-3 px-6 rounded-none hover:bg-gray-800 transition-colors font-medium text-center"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Transform Your Brand
                </a>
              </div>
            </div>

            {/* Presets Bundle */}
            <div className="border border-gray-200 p-8 hover:shadow-lg transition-shadow">
              <div className="text-center">
                <h3 className="text-2xl font-light text-black mb-4" style={{ fontFamily: 'Prata, serif' }}>
                  Lightroom Presets
                </h3>
                <div className="text-4xl font-light text-black mb-6">$5-15</div>
                <p className="text-gray-600 mb-8">
                  Professional-grade Lightroom presets to give your photos that signature editorial look.
                </p>
                <Link
                  href="/products/presets"
                  className="block w-full bg-black text-white py-3 px-6 rounded-none hover:bg-gray-800 transition-colors font-medium text-center"
                >
                  Browse Presets
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-black text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-light mb-8" style={{ fontFamily: 'Prata, serif' }}>
            Join the Waitlist
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Be the first to experience the platform that's rewriting the rules of online confidence and digital wealth.
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-6 py-4 bg-white text-black rounded-none focus:ring-2 focus:ring-white focus:outline-none text-lg"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-white text-black py-4 px-8 rounded-none hover:bg-gray-100 transition-colors font-medium text-lg tracking-wide"
            >
              Join the Waitlist + Get the Free Selfie Guide
            </button>
            {isSubmitted && (
              <p className="text-green-400 text-sm">Thank you! Check your inbox for the free guide.</p>
            )}
          </form>
        </div>
      </section>
    </div>
  );
}