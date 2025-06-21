'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/app/components/ui/button';
import { CheckCircle2, Calendar, MessageCircle, Clock } from 'lucide-react';

// Extend the Window interface to include gtag
declare global {
  interface Window {
    gtag: (
      event: string,
      action: string,
      params: { [key: string]: any }
    ) => void;
  }
}

export default function VIPApplicationThankYou() {
  const router = useRouter();

  useEffect(() => {
    // Track conversion if you have analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'conversion', {
        'send_to': 'YOUR_CONVERSION_ID',
        'value': 10000.0,
        'currency': 'USD'
      });
    }
  }, []);

  const nextSteps = [
    {
      icon: Clock,
      title: 'Within 48 Hours',
      description: "I'll personally review your application"
    },
    {
      icon: MessageCircle,
      title: 'Personal Response',
      description: "You'll hear directly from me via email"
    },
    {
      icon: Calendar,
      title: 'Strategy Call',
      description: "If we're a fit, we'll schedule your VIP onboarding"
    }
  ];

  return (
    <div className="min-h-screen bg-[#F1F1F1]">
      {/* Success Hero */}
      <section className="relative px-6 py-32 bg-white overflow-hidden">
        {/* Editorial Number */}
        <div 
          className="absolute -top-20 right-10 text-[#F1F1F1] pointer-events-none"
          style={{ 
            fontFamily: 'Bodoni Moda, serif',
            fontSize: '300px',
            fontWeight: '700',
            opacity: '0.03',
            lineHeight: '1'
          }}
        >
          ✓
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="mb-8 flex justify-center">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </div>
          </div>
          
          <h1 
            className="text-6xl md:text-7xl mb-8 text-[#171719]"
            style={{ 
              fontFamily: 'Bodoni Moda, serif',
              fontWeight: '300',
              letterSpacing: '-0.04em',
              lineHeight: '0.9'
            }}
          >
            Application Received
          </h1>
          
          <p 
            className="text-xl md:text-2xl text-[#171719] max-w-2xl mx-auto"
            style={{ 
              fontFamily: 'Inter, sans-serif',
              fontWeight: '200'
            }}
          >
            Okay, this is exciting. I just got your application and I'm 
            genuinely looking forward to reading it.
          </p>
        </div>
      </section>

      {/* What Happens Next */}
      <section className="px-6 py-32 bg-[#171719] relative">
        {/* Editorial Number */}
        <div 
          className="absolute -top-20 left-10 text-[#F1F1F1] pointer-events-none"
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
        
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 
            className="text-5xl md:text-6xl mb-16 text-[#F1F1F1] text-center"
            style={{ 
              fontFamily: 'Bodoni Moda, serif',
              fontWeight: '300',
              letterSpacing: '-0.04em',
              lineHeight: '0.9'
            }}
          >
            What Happens Next
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {nextSteps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="mb-6 flex justify-center">
                  <div className="w-16 h-16 bg-[#F1F1F1]/10 flex items-center justify-center">
                    <step.icon className="w-8 h-8 text-[#F1F1F1]" />
                  </div>
                </div>
                <h3 
                  className="text-2xl mb-3 text-[#F1F1F1]"
                  style={{ fontFamily: 'Bodoni Moda, serif' }}
                >
                  {step.title}
                </h3>
                <p 
                  className="text-[#F1F1F1]/70"
                  style={{ 
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: '200'
                  }}
                >
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Check Your Email */}
      <section className="px-6 py-32 bg-white relative">
        {/* Editorial Number */}
        <div 
          className="absolute -top-20 right-10 text-[#F1F1F1] pointer-events-none"
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
        
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 
            className="text-5xl md:text-6xl mb-8 text-[#171719]"
            style={{ 
              fontFamily: 'Bodoni Moda, serif',
              fontWeight: '300',
              letterSpacing: '-0.04em',
              lineHeight: '0.9'
            }}
          >
            Check Your Email
          </h2>
          
          <p 
            className="text-xl mb-12 text-[#171719]"
            style={{ 
              fontFamily: 'Inter, sans-serif',
              fontWeight: '200'
            }}
          >
            I just sent you a confirmation with some things to think about 
            before our call. Make sure to check your spam folder too.
          </p>
          
          <div className="p-8 bg-[#F1F1F1] mb-12">
            <p 
              className="text-lg text-[#171719] mb-4"
              style={{ 
                fontFamily: 'Inter, sans-serif',
                fontWeight: '300'
              }}
            >
              <strong>Quick tip:</strong> While you wait, start thinking about:
            </p>
            <ul 
              className="text-left max-w-md mx-auto space-y-2 text-[#171719]"
              style={{ 
                fontFamily: 'Inter, sans-serif',
                fontWeight: '200'
              }}
            >
              <li>→ Your biggest win this year</li>
              <li>→ What's really holding you back</li>
              <li>→ Where you see yourself in 90 days</li>
              <li>→ Why this matters to you now</li>
            </ul>
          </div>
        </div>
      </section>

      {/* While You Wait */}
      <section className="px-6 py-32 bg-[#F1F1F1] relative">
        {/* Editorial Number */}
        <div 
          className="absolute -top-20 left-10 text-white pointer-events-none"
          style={{ 
            fontFamily: 'Bodoni Moda, serif',
            fontSize: '300px',
            fontWeight: '700',
            opacity: '0.03',
            lineHeight: '1'
          }}
        >
          03
        </div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 
            className="text-5xl md:text-6xl mb-12 text-[#171719] text-center"
            style={{ 
              fontFamily: 'Bodoni Moda, serif',
              fontWeight: '300',
              letterSpacing: '-0.04em',
              lineHeight: '0.9'
            }}
          >
            While You Wait
          </h2>
          
          <p 
            className="text-xl text-center mb-16 text-[#171719]"
            style={{ 
              fontFamily: 'Inter, sans-serif',
              fontWeight: '200'
            }}
          >
            Want to get a head start? Here are some resources to dive into:
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Link href="/tools/glow-check">
              <div className="bg-white p-8 hover:shadow-lg transition-shadow cursor-pointer">
                <h3 
                  className="text-2xl mb-3 text-[#171719]"
                  style={{ fontFamily: 'Bodoni Moda, serif' }}
                >
                  The Glow Check™
                </h3>
                <p 
                  className="text-[#171719]/70"
                  style={{ 
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: '200'
                  }}
                >
                  See how your current selfies are performing
                </p>
              </div>
            </Link>
            
            <Link href="/products/starter-kit">
              <div className="bg-white p-8 hover:shadow-lg transition-shadow cursor-pointer">
                <h3 
                  className="text-2xl mb-3 text-[#171719]"
                  style={{ fontFamily: 'Bodoni Moda, serif' }}
                >
                  Starter Kit
                </h3>
                <p 
                  className="text-[#171719]/70"
                  style={{ 
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: '200'
                  }}
                >
                  Get the basics down while you wait
                </p>
              </div>
            </Link>
            
            <Link href="/products/branded-by-selfie">
              <div className="bg-white p-8 hover:shadow-lg transition-shadow cursor-pointer">
                <h3 
                  className="text-2xl mb-3 text-[#171719]"
                  style={{ fontFamily: 'Bodoni Moda, serif' }}
                >
                  Branded Program
                </h3>
                <p 
                  className="text-[#171719]/70"
                  style={{ 
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: '200'
                  }}
                >
                  See what's included in our signature program
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Personal Note */}
      <section className="px-6 py-32 bg-[#171719] relative">
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 
            className="text-4xl md:text-5xl mb-8 text-[#F1F1F1]"
            style={{ 
              fontFamily: 'Bodoni Moda, serif',
              fontWeight: '300',
              letterSpacing: '-0.04em',
              lineHeight: '0.9'
            }}
          >
            One More Thing
          </h2>
          
          <div 
            className="space-y-4 text-lg text-[#F1F1F1]/80"
            style={{ 
              fontFamily: 'Inter, sans-serif',
              fontWeight: '200'
            }}
          >
            <p>
              I know applying for something like this takes courage.
            </p>
            <p>
              The fact that you're here, ready to invest in yourself at this 
              level, tells me everything I need to know about you.
            </p>
            <p>
              You're ready for more. And I can't wait to help you get it.
            </p>
            <p className="pt-4 text-[#F1F1F1]/60 italic">
              Talk soon,<br />
              Sandra
            </p>
          </div>
        </div>
      </section>

      {/* Return Home */}
      <section className="px-6 py-16 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <Link href="/">
            <Button 
              className="bg-[#171719] text-[#F1F1F1] hover:bg-[#171719]/90 text-lg px-12 py-6 uppercase tracking-widest rounded-none"
            >
              RETURN HOME
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
} 