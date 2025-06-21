'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/app/components/ui/button';
import { CheckCircle2 } from 'lucide-react';

export default function SelfieStarterKit() {
  const [imageError, setImageError] = useState<{ [key: string]: boolean }>({});

  const features = [
    '30+ caption templates that actually convert',
    'The 5-minute daily content system',
    'Mirror selfie pose guide (no more awkward)',
    'Ring light setup that works with any phone',
    'Edit-in-30-seconds workflow',
    'Personal brand workbook',
    'Content calendar template',
    'Hashtag strategy guide'
  ];

  const transformations = [
    {
      before: 'Posting randomly, hoping something sticks',
      after: 'Strategic content that builds your brand daily'
    },
    {
      before: 'Taking 100 selfies to get one good one',
      after: 'Confident poses that work every single time'
    },
    {
      before: 'Captions that sound like everyone else',
      after: 'Your unique voice that connects and converts'
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
          className="absolute -top-20 right-10 text-[#171719] pointer-events-none"
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
              ? 'url(https://i.postimg.cc/bwYKyKCW/122.png)' 
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
              src="https://i.postimg.cc/bwYKyKCW/122.png" 
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
            The Selfie<br />Starter Kit
          </h1>
          
          <p 
            className="text-xl md:text-2xl mb-8 text-[#171719] max-w-2xl mx-auto"
            style={{ 
              fontFamily: 'Inter, sans-serif',
              fontWeight: '200'
            }}
          >
            Your personal brand emergency kit. Templates, scripts, and tools 
            that actually make sense. Like having me in your pocket.
          </p>
          
          <div className="text-5xl mb-12 text-[#171719]" style={{ fontFamily: 'Bodoni Moda, serif' }}>
            $67
          </div>
          
          <Link href="/checkout/starter-kit">
            <Button 
              className="bg-[#171719] text-[#F1F1F1] hover:bg-[#171719]/90 text-lg px-12 py-6 h-auto uppercase tracking-widest rounded-none"
            >
              GET THE KIT
            </Button>
          </Link>
        </div>
      </section>

      {/* What's Inside Section */}
      <section className="px-6 py-32 bg-white relative">
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
          02
        </div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 
            className="text-7xl mb-16 text-center text-[#171719]"
            style={{ 
              fontFamily: 'Bodoni Moda, serif',
              fontWeight: '300',
              letterSpacing: '-0.04em',
              lineHeight: '0.9'
            }}
          >
            What You Get
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-3">
                <CheckCircle2 className="w-6 h-6 text-[#171719] mt-1 flex-shrink-0" />
                <p 
                  className="text-lg text-[#171719]"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  {feature}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Transformation Section */}
      <section className="px-6 py-20 bg-[#171719]">
        <div className="max-w-4xl mx-auto">
          <h2 
            className="text-5xl mb-16 text-center text-[#F1F1F1]"
            style={{ fontFamily: 'Bodoni Moda, serif' }}
          >
            Your Transformation
          </h2>
          
          <div className="space-y-12">
            {transformations.map((item, index) => (
              <div key={index} className="grid md:grid-cols-2 gap-8">
                <div className="text-center md:text-right">
                  <p 
                    className="text-sm uppercase tracking-widest text-[#B5B5B3] mb-2"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    Before
                  </p>
                  <p 
                    className="text-xl text-[#F1F1F1]/70"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {item.before}
                  </p>
                </div>
                <div className="text-center md:text-left">
                  <p 
                    className="text-sm uppercase tracking-widest text-[#B5B5B3] mb-2"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    After
                  </p>
                  <p 
                    className="text-xl text-[#F1F1F1]"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {item.after}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="px-6 py-20 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <blockquote 
            className="text-2xl md:text-3xl mb-8 text-[#171719] italic"
            style={{ fontFamily: 'Bodoni Moda, serif' }}
          >
            "I went from posting maybe once a month to showing up daily. 
            The templates make it so easy, I actually enjoy creating content now."
          </blockquote>
          <p 
            className="text-lg text-[#B5B5B3]"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            — Sarah M., Starter Kit Member
          </p>
        </div>
      </section>

      {/* Social Proof Grid */}
      <section className="px-6 py-24 bg-[#171719]">
        <div className="max-w-6xl mx-auto text-center">
          <h2 
            className="text-5xl mb-12 text-[#F1F1F1] font-light"
            style={{ fontFamily: 'Bodoni Moda, serif' }}
          >
            Real moments. Real confidence. Real content.
          </h2>

          <div className="grid md:grid-cols-2 gap-8 mb-16 max-w-4xl mx-auto">
            <div 
              className="aspect-square bg-cover bg-center"
              style={{ 
                backgroundImage: !imageError.social1 
                  ? 'url(https://i.postimg.cc/Fz2HJ2Dg/IMG-3479.jpg)' 
                  : 'none',
                backgroundColor: imageError.social1 ? '#B5B5B3' : 'transparent'
              }}
            >
              {!imageError.social1 && (
                <img 
                  src="https://i.postimg.cc/Fz2HJ2Dg/IMG-3479.jpg" 
                  alt="" 
                  className="hidden"
                  onError={() => handleImageError('social1')}
                />
              )}
            </div>
            <div 
              className="aspect-square bg-cover bg-center"
              style={{ 
                backgroundImage: !imageError.social2 
                  ? 'url(https://i.postimg.cc/wMP7QtTN/IMG-8435-jpg.jpg)' 
                  : 'none',
                backgroundColor: imageError.social2 ? '#B5B5B3' : 'transparent'
              }}
            >
              {!imageError.social2 && (
                <img 
                  src="https://i.postimg.cc/wMP7QtTN/IMG-8435-jpg.jpg" 
                  alt="" 
                  className="hidden"
                  onError={() => handleImageError('social2')}
                />
              )}
            </div>
          </div>

          <Link href="/checkout/starter-kit">
            <Button 
              className="bg-transparent border-2 border-[#F1F1F1] text-[#F1F1F1] hover:bg-[#F1F1F1] hover:text-[#171719] text-lg px-12 py-6 h-auto uppercase tracking-widest transition-all duration-300 rounded-none"
            >
              Start Your Kit → $67
            </Button>
          </Link>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-6 py-20 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 
            className="text-5xl mb-12 text-center text-[#171719]"
            style={{ fontFamily: 'Bodoni Moda, serif' }}
          >
            Questions?
          </h2>
          
          <div className="space-y-8">
            <div>
              <h3 
                className="text-2xl mb-3 text-[#171719]"
                style={{ fontFamily: 'Bodoni Moda, serif' }}
              >
                How do I access everything?
              </h3>
              <p 
                className="text-lg text-[#171719]"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                You get instant access to your member portal right after purchase. 
                Everything downloads straight to your phone or computer.
              </p>
            </div>
            
            <div>
              <h3 
                className="text-2xl mb-3 text-[#171719]"
                style={{ fontFamily: 'Bodoni Moda, serif' }}
              >
                Is this for beginners?
              </h3>
              <p 
                className="text-lg text-[#171719]"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Absolutely. The kit is designed for women who want to show up online 
                but don't know where to start. Everything is step-by-step.
              </p>
            </div>
            
            <div>
              <h3 
                className="text-2xl mb-3 text-[#171719]"
                style={{ fontFamily: 'Bodoni Moda, serif' }}
              >
                What if I'm not photogenic?
              </h3>
              <p 
                className="text-lg text-[#171719]"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Here's the thing - being photogenic is a skill, not a gift. 
                The pose guides and lighting tips will have you looking amazing in every shot.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 py-24 bg-[#F1F1F1]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 
            className="text-5xl mb-6 text-[#171719]"
            style={{ fontFamily: 'Bodoni Moda, serif' }}
          >
            Ready to show up?
          </h2>
          <p 
            className="text-xl mb-12 text-[#171719]"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Join thousands of women who are building their brands with confidence.
          </p>
          
          <Link href="/checkout/starter-kit">
            <Button 
              className="bg-[#171719] text-[#F1F1F1] hover:bg-[#171719]/90 text-lg px-12 py-6 h-auto uppercase tracking-widest rounded-none"
            >
              Get The Starter Kit - $67
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
} 