'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/app/components/ui/button';
import { CheckCircle2, Star } from 'lucide-react';

export default function BrandedBySelfie() {
  const [imageError, setImageError] = useState<{ [key: string]: boolean }>({});

  const modules = [
    {
      week: '1-2',
      title: 'Confidence',
      description: 'Master your mindset, overcome visibility fears, and build unshakeable confidence'
    },
    {
      week: '3-4',
      title: 'Clarity',
      description: 'Define your brand message, identify your ideal client, and craft your unique voice'
    },
    {
      week: '5-6',
      title: 'Content',
      description: 'Create strategic content that converts, build your signature style, and show up consistently'
    },
    {
      week: '7-8',
      title: 'Conversion',
      description: 'Turn followers into clients, master sales without being salesy, and scale your impact'
    }
  ];

  const includes = [
    '45+ video lessons (lifetime access)',
    'Weekly implementation workbooks',
    'Content creation templates & scripts',
    'Personal brand photography guide',
    'Signature style development',
    'Client attraction strategies',
    'Private community access',
    'Monthly Q&A calls with Sandra'
  ];

  const testimonials = [
    {
      name: 'Maria K.',
      role: 'Life Coach',
      quote: 'I went from 800 followers to 15K in 3 months. But more importantly, I\'m booking clients consistently.',
      rating: 5
    },
    {
      name: 'Jessica T.',
      role: 'Interior Designer',
      quote: 'Sandra taught me how to show up as myself. My brand finally feels authentic and clients are noticing.',
      rating: 5
    },
    {
      name: 'Rachel S.',
      role: 'Wellness Coach',
      quote: 'The confidence module alone was worth the entire investment. I\'m finally visible and loving it.',
      rating: 5
    }
  ];

  const handleImageError = (imageId: string) => {
    setImageError(prev => ({ ...prev, [imageId]: true }));
  };

  return (
    <div className="min-h-screen bg-[#F1F1F1]">
      {/* Hero Section */}
      <section className="relative px-6 py-32 overflow-hidden">
        {/* Editorial Number */}
        <div 
          className="absolute -top-20 left-10 text-[#171719] pointer-events-none"
          style={{ 
            fontFamily: 'Bodoni Moda, serif',
            fontSize: '300px',
            fontWeight: '700',
            opacity: '0.03',
            lineHeight: '1'
          }}
        >
          01
        </div>
        
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: !imageError.hero 
              ? 'url(https://i.postimg.cc/nhDpf8Xx/35.png)' 
              : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.1
          }}
        >
          {imageError.hero && (
            <div className="w-full h-full bg-[#B5B5B3]" />
          )}
          {!imageError.hero && (
            <img 
              src="https://i.postimg.cc/nhDpf8Xx/35.png" 
              alt="" 
              className="hidden"
              onError={() => handleImageError('hero')}
            />
          )}
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h1 
            className="text-7xl md:text-8xl mb-8 text-[#171719]"
            style={{ 
              fontFamily: 'Bodoni Moda, serif',
              fontWeight: '300',
              letterSpacing: '-0.04em',
              lineHeight: '0.9'
            }}
          >
            Branded by<br />Selfie™
          </h1>
          
          <p 
            className="text-xl md:text-2xl mb-8 text-[#171719] max-w-2xl mx-auto"
            style={{ 
              fontFamily: 'Inter, sans-serif',
              fontWeight: '200'
            }}
          >
            Not just another brand course. This is your complete system for 
            showing up as the expert you already are. Strategy meets selfies.
          </p>
          
          <div className="text-5xl mb-12 text-[#171719]" style={{ fontFamily: 'Bodoni Moda, serif' }}>
            $397
          </div>
          
          <Link href="/checkout/branded-by-selfie">
            <Button 
              className="bg-[#171719] text-[#F1F1F1] hover:bg-[#171719]/90 text-lg px-12 py-6 h-auto uppercase tracking-widest rounded-none"
            >
              START TODAY
            </Button>
          </Link>
        </div>
      </section>

      {/* The Problem Section */}
      <section className="px-6 py-20 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 
            className="text-4xl md:text-5xl mb-8 text-[#171719]"
            style={{ fontFamily: 'Bodoni Moda, serif' }}
          >
            Here's what I know about you...
          </h2>
          <div className="space-y-4 text-lg text-[#171719]" style={{ fontFamily: 'Inter, sans-serif' }}>
            <p>You have so much value to offer but struggle to communicate it online.</p>
            <p>You see others showing up confidently and wonder what their secret is.</p>
            <p>You're tired of playing small and ready to build something real.</p>
            <p className="pt-4 text-xl font-medium">
              Good news? You're in the right place.
            </p>
          </div>
        </div>
      </section>

      {/* 8-Week Journey */}
      <section className="px-6 py-20 bg-[#171719]">
        <div className="max-w-5xl mx-auto">
          <h2 
            className="text-5xl mb-16 text-center text-[#F1F1F1]"
            style={{ fontFamily: 'Bodoni Moda, serif' }}
          >
            Your 8-Week Journey
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {modules.map((module, index) => (
              <div key={index} className="border border-[#F1F1F1] p-8">
                <div className="flex items-baseline justify-between mb-4">
                  <span 
                    className="text-sm uppercase tracking-widest text-[#B5B5B3]"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    Week {module.week}
                  </span>
                  <h3 
                    className="text-3xl text-[#F1F1F1]"
                    style={{ fontFamily: 'Bodoni Moda, serif' }}
                  >
                    {module.title}
                  </h3>
                </div>
                <p 
                  className="text-[#F1F1F1]/80"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  {module.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="px-6 py-20 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 
            className="text-5xl mb-12 text-center text-[#171719]"
            style={{ fontFamily: 'Bodoni Moda, serif' }}
          >
            Everything You Get
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {includes.map((item, index) => (
              <div key={index} className="flex items-start space-x-3">
                <CheckCircle2 className="w-6 h-6 text-[#171719] mt-1 flex-shrink-0" />
                <p 
                  className="text-lg text-[#171719]"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  {item}
                </p>
              </div>
            ))}
          </div>
          
          <div className="mt-12 p-8 bg-[#171719] text-[#F1F1F1]">
            <h3 
              className="text-2xl mb-4"
              style={{ fontFamily: 'Bodoni Moda, serif' }}
            >
              Bonus: The AI Content Suite
            </h3>
            <p style={{ fontFamily: 'Inter, sans-serif' }}>
              Get exclusive access to our AI-powered content tools that help you 
              create strategic content in minutes, not hours. 
              Valued at $197, included free.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-6 py-20 bg-[#F1F1F1]">
        <div className="max-w-5xl mx-auto">
          <h2 
            className="text-5xl mb-16 text-center text-[#171719]"
            style={{ fontFamily: 'Bodoni Moda, serif' }}
          >
            Success Stories
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-8">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-[#171719] text-[#171719]" />
                  ))}
                </div>
                <blockquote 
                  className="text-lg mb-6 text-[#171719]"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  "{testimonial.quote}"
                </blockquote>
                <div>
                  <p 
                    className="font-medium text-[#171719]"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {testimonial.name}
                  </p>
                  <p 
                    className="text-sm text-[#B5B5B3]"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {testimonial.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Investment Section */}
      <section className="px-6 py-20 bg-[#171719]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 
            className="text-5xl mb-8 text-[#F1F1F1]"
            style={{ fontFamily: 'Bodoni Moda, serif' }}
          >
            Your Investment
          </h2>
          
          <div className="mb-12">
            <p 
              className="text-6xl mb-4 text-[#F1F1F1]"
              style={{ fontFamily: 'Bodoni Moda, serif' }}
            >
              $397
            </p>
            <p 
              className="text-xl text-[#F1F1F1]/80"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              One payment. Lifetime access. Unlimited potential.
            </p>
          </div>
          
          <Link href="/checkout/branded-by-selfie">
            <Button 
              className="bg-[#F1F1F1] text-[#171719] hover:bg-[#F1F1F1]/90 text-lg px-12 py-6 h-auto uppercase tracking-widest rounded-none"
            >
              Start Today
            </Button>
          </Link>
          
          <p 
            className="mt-6 text-sm text-[#B5B5B3]"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Payment plans available at checkout
          </p>
        </div>
      </section>

      {/* Sandra's Message */}
      <section className="px-6 py-20 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 
              className="text-4xl mb-4 text-[#171719]"
              style={{ fontFamily: 'Bodoni Moda, serif' }}
            >
              A Note from Sandra
            </h2>
          </div>
          
          <div className="space-y-4 text-lg text-[#171719]" style={{ fontFamily: 'Inter, sans-serif' }}>
            <p>
              Hey, it's me. I know what it's like to have a message burning inside you 
              but feel stuck when it comes to sharing it online.
            </p>
            <p>
              After my divorce, I rebuilt everything through the power of showing up 
              authentically online. In 90 days, I grew to 120K followers and built a 
              business that supports my three kids and the life we love.
            </p>
            <p>
              But here's what matters: I didn't do it by being perfect. I did it by 
              being real, strategic, and consistent. That's exactly what I'll teach you.
            </p>
            <p>
              This isn't just about pretty pictures. It's about building a brand that 
              works as hard as you do. Ready?
            </p>
            <p className="text-right italic">
              — Sandra
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-6 py-20 bg-[#F1F1F1]">
        <div className="max-w-3xl mx-auto">
          <h2 
            className="text-5xl mb-12 text-center text-[#171719]"
            style={{ fontFamily: 'Bodoni Moda, serif' }}
          >
            Common Questions
          </h2>
          
          <div className="space-y-8">
            <div>
              <h3 
                className="text-2xl mb-3 text-[#171719]"
                style={{ fontFamily: 'Bodoni Moda, serif' }}
              >
                How much time do I need?
              </h3>
              <p 
                className="text-lg text-[#171719]"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Plan for 2-3 hours per week. The lessons are designed to fit into 
                busy schedules, and you have lifetime access to go at your own pace.
              </p>
            </div>
            
            <div>
              <h3 
                className="text-2xl mb-3 text-[#171719]"
                style={{ fontFamily: 'Bodoni Moda, serif' }}
              >
                What if I'm not tech-savvy?
              </h3>
              <p 
                className="text-lg text-[#171719]"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Perfect. Everything is explained step-by-step with video tutorials. 
                If you can use Instagram, you can do this program.
              </p>
            </div>
            
            <div>
              <h3 
                className="text-2xl mb-3 text-[#171719]"
                style={{ fontFamily: 'Bodoni Moda, serif' }}
              >
                Is there a guarantee?
              </h3>
              <p 
                className="text-lg text-[#171719]"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Yes. Show me you've done the work for 30 days and if you're not 
                seeing results, I'll refund your investment. I believe in this that much.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 py-24 bg-[#171719]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 
            className="text-5xl mb-6 text-[#F1F1F1]"
            style={{ fontFamily: 'Bodoni Moda, serif' }}
          >
            Your brand is waiting.
          </h2>
          <p 
            className="text-xl mb-12 text-[#F1F1F1]/80"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Stop overthinking. Start building. Join us inside.
          </p>
          
          <Link href="/checkout/branded-by-selfie">
            <Button 
              className="bg-transparent border-2 border-[#F1F1F1] text-[#F1F1F1] hover:bg-[#F1F1F1] hover:text-[#171719] text-lg px-12 py-6 h-auto uppercase tracking-widest transition-all duration-300 rounded-none"
            >
              Begin Your Transformation - $397
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
} 