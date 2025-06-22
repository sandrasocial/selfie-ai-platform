'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/app/components/ui/button';
import { CheckCircle2, Play, Download, Sparkles } from 'lucide-react';

export default function SelfieStarterKit() {
  const [imageError, setImageError] = useState<{ [key: string]: boolean }>({});

  const whatYouGet = [
    {
      title: 'Lighting Like a Pro',
      description: 'Natural and artificial light setups that make every selfie editorial-worthy'
    },
    {
      title: 'Confident Poses That Convert',
      description: 'Body language decoded—never feel awkward in front of the camera again'
    },
    {
      title: 'The 5-Stage Edit Workflow',
      description: 'From phone to professional, create consistency across all your content'
    },
    {
      title: 'Caption Psychology',
      description: 'Storytelling formulas that turn scrollers into engaged followers'
    },
    {
      title: 'Personal Brand System',
      description: 'Your visual DNA—create cohesive content that builds recognition'
    },
    {
      title: 'Selfie Glow-Up Presets',
      description: '7 custom Lightroom presets for an instant editorial look'
    }
  ];

  const bonusResources = [
    'Caption Templates Bank (50+ proven formulas)',
    'Ring Light Setup Guide (every budget covered)',
    'Personal Brand Workbook (AI-powered exercises)',
    'Content Calendar Template',
    'Hashtag Strategy Guide'
  ];

  const handleImageError = (imageId: string) => {
    setImageError(prev => ({ ...prev, [imageId]: true }));
  };

  return (
    <div className="min-h-screen bg-[#F1F1F1]">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: !imageError.hero 
              ? 'url(https://i.postimg.cc/wMP7QtTN/IMG-8435-jpg.jpg)' 
              : `linear-gradient(135deg, #171719 0%, #4C4B4B 100%)`
          }}
        >
          {!imageError.hero && (
            <img 
              src="https://i.postimg.cc/wMP7QtTN/IMG-8435-jpg.jpg" 
              alt="" 
              className="hidden"
              onError={() => handleImageError('hero')}
            />
          )}
        </div>
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-40" />
        
        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <h1 
            className="text-6xl lg:text-8xl mb-8 text-white leading-tight font-normal tracking-tight font-cormorant"
          >
            Selfie smarter.<br />
            Show up bolder.
          </h1>
          
          <p 
            className="text-xl lg:text-2xl mb-12 text-white font-light max-w-3xl mx-auto leading-relaxed opacity-90 font-neue"
          >
            The exact system I use to create selfies that build brands, boost confidence, and convert followers into clients.
          </p>
          
          <Link href="#checkout">
            <Button 
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#171719] text-lg px-12 py-4 font-normal uppercase tracking-wide transition-all duration-300 font-neue"
            >
              Get the Kit – $67
            </Button>
          </Link>
        </div>
      </section>

      {/* Before & After Transformation */}
      <section className="px-6 py-24 bg-[#F1F1F1]">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center mb-20">
            <div className="text-center">
              <div className="mb-8">
                {!imageError.before ? (
                  <img 
                    src="https://i.postimg.cc/XNt6zt4j/1.png" 
                    alt="Before the kit"
                    className="w-full max-w-md mx-auto"
                    onError={() => handleImageError('before')}
                  />
                ) : (
                  <div className="w-full max-w-md mx-auto aspect-square bg-[#B5B5B3] flex items-center justify-center">
                    <span 
                      className="text-white text-lg font-neue"
                    >
                      IMAGE COMING SOON
                    </span>
                  </div>
                )}
              </div>
              <h3 
                className="text-2xl mb-4 text-[#4C4B4B] font-light font-cormorant"
              >
                Before: overwhelmed, hiding, unsure
              </h3>
            </div>
            
            <div className="text-center">
              <div className="mb-8">
                {!imageError.after ? (
                  <img 
                    src="https://i.postimg.cc/d05zmx5K/2.png" 
                    alt="After the kit"
                    className="w-full max-w-md mx-auto"
                    onError={() => handleImageError('after')}
                  />
                ) : (
                  <div className="w-full max-w-md mx-auto aspect-square bg-[#B5B5B3] flex items-center justify-center">
                    <span 
                      className="text-white text-lg font-neue"
                    >
                      IMAGE COMING SOON
                    </span>
                  </div>
                )}
              </div>
              <h3 
                className="text-2xl mb-4 text-[#4C4B4B] font-light font-cormorant"
              >
                After: branded, bold, booked.
              </h3>
            </div>
          </div>

          {/* Quote */}
          <div className="text-center">
            <blockquote 
              className="text-3xl lg:text-4xl text-[#171719] italic leading-relaxed font-light max-w-4xl mx-auto font-cormorant"
            >
              "Your camera roll tells your story. Let's rewrite it."
            </blockquote>
          </div>
        </div>
      </section>

      {/* What's Inside the Kit */}
      <section className="px-6 py-24 bg-[#171719] text-white">
        <div className="max-w-6xl mx-auto">
          <h2 
            className="text-5xl lg:text-6xl text-center mb-20 font-light leading-tight font-cormorant"
          >
            What's Inside Your Kit
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {whatYouGet.map((item, index) => (
              <div 
                key={index}
                className="group cursor-pointer transition-transform hover:scale-105 duration-300"
              >
                <div className="bg-[#4C4B4B] p-8 h-full transition-all duration-300 group-hover:bg-[#2A2A2A]">
                  <div className="mb-6">
                    <Play className="w-8 h-8 text-white opacity-75" />
                  </div>
                  <h3 
                    className="text-xl mb-4 font-light leading-tight font-cormorant"
                  >
                    {item.title}
                  </h3>
                  <p 
                    className="text-[#B5B5B3] font-light leading-relaxed font-neue"
                  >
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Your Story Matters */}
      <section className="px-6 py-24 bg-[#F1F1F1]">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Image */}
            <div className="relative">
              {!imageError.story ? (
                <img 
                  src="https://i.postimg.cc/0jv5My39/final-Quote-Image-1.png" 
                  alt="Your story matters"
                  className="w-full"
                  onError={() => handleImageError('story')}
                />
              ) : (
                <div className="w-full aspect-[4/5] bg-[#B5B5B3] flex items-center justify-center">
                  <span 
                    className="text-white text-lg font-neue"
                  >
                    IMAGE COMING SOON
                  </span>
                </div>
              )}
              <div className="absolute inset-0 bg-black bg-opacity-20" />
              <div className="absolute inset-0 flex items-center justify-center p-8">
                <h3 
                  className="text-white text-2xl lg:text-3xl text-center leading-tight font-light font-cormorant"
                >
                  "I started with one mirror selfie at 11PM—just to feel something again."
                </h3>
              </div>
            </div>

            {/* Text */}
            <div className="space-y-8">
              <p 
                className="text-xl text-[#4C4B4B] leading-relaxed font-light font-neue"
              >
                What came next wasn't magic—it was small steps. Lighting tricks. Posing hacks. Finally pressing POST.
              </p>
              <p 
                className="text-xl text-[#4C4B4B] leading-relaxed font-light font-neue"
              >
                That's what this kit gives you: a way back to yourself, one selfie at a time.
              </p>
              <p 
                className="text-xl text-[#4C4B4B] leading-relaxed font-light font-neue"
              >
                You don't need to become someone else. You just need to remember who you already are.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bonus Resources */}
      <section className="px-6 py-24 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-12">
            <Sparkles className="w-12 h-12 mx-auto mb-6 text-[#4C4B4B]" />
            <h2 
              className="text-4xl lg:text-5xl mb-6 font-light text-[#171719] leading-tight font-cormorant"
            >
              Plus These Bonuses
            </h2>
            <p 
              className="text-xl text-[#4C4B4B] font-light max-w-2xl mx-auto leading-relaxed font-neue"
            >
              Everything you need to implement what you learn, from presets to templates.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 text-left">
            {bonusResources.map((resource, index) => (
              <div key={index} className="flex items-start space-x-4 p-6">
                <Download className="w-6 h-6 text-[#171719] mt-1 flex-shrink-0" />
                <p 
                  className="text-lg text-[#171719] font-light font-neue"
                >
                  {resource}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="px-6 py-24 bg-[#171719] text-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 
            className="text-4xl lg:text-5xl mb-12 font-light leading-tight font-cormorant"
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

          <div className="max-w-3xl mx-auto mb-12">
            <blockquote 
              className="text-2xl lg:text-3xl italic font-light leading-relaxed mb-6 font-cormorant"
            >
              "I went from taking 100 selfies to get one good one, to nailing it in 3 shots every time. This kit changed everything."
            </blockquote>
            <p 
              className="text-[#B5B5B3] font-light font-neue"
            >
              — Maria K., Life Coach & Starter Kit Graduate
            </p>
          </div>

          <Link href="#checkout">
            <Button 
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#171719] text-lg px-12 py-4 font-normal uppercase tracking-wide transition-all duration-300 font-['Neue_Einstellung']"
            >
              Start Yours → $67
            </Button>
          </Link>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-6 py-24 bg-[#F1F1F1]">
        <div className="max-w-4xl mx-auto">
          <h2 
            className="text-4xl lg:text-5xl mb-16 text-center font-light text-[#171719] leading-tight font-cormorant"
          >
            Questions I Always Get
          </h2>
          
          <div className="space-y-12">
            <div>
              <h3 
                className="text-2xl lg:text-3xl mb-4 font-light text-[#171719] font-cormorant"
              >
                "But I'm not photogenic..."
              </h3>
              <p 
                className="text-xl text-[#4C4B4B] font-light leading-relaxed font-neue"
              >
                Neither was I. "Photogenic" is a skill, not a gift. The pose guides, lighting tricks, and editing workflow in this kit will have you looking like yourself—but elevated. That's all this is.
              </p>
            </div>
            
            <div>
              <h3 
                className="text-2xl lg:text-3xl mb-4 font-light text-[#171719] font-cormorant"
              >
                "Is this for beginners?"
              </h3>
              <p 
                className="text-xl text-[#4C4B4B] font-light leading-relaxed font-neue"
              >
                Yes. This is for women who want to show up online but don't know where to start. Everything is step-by-step, no experience needed. I built it for the version of me that was hiding behind her phone.
              </p>
            </div>
            
            <div>
              <h3 
                className="text-2xl lg:text-3xl mb-4 font-light text-[#171719] font-cormorant"
              >
                "How quickly will I see results?"
              </h3>
              <p 
                className="text-xl text-[#4C4B4B] font-light leading-relaxed font-neue"
              >
                You'll feel different after your first selfie using the lighting and pose guides. Your confidence will shift immediately. Building a consistent brand takes time, but the tools work from day one.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section id="checkout" className="px-6 py-24 bg-[#171719] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 
            className="text-5xl lg:text-6xl mb-8 font-light leading-tight font-cormorant"
          >
            Ready to Stop Hiding?
          </h2>
          
          <p 
            className="text-xl lg:text-2xl mb-12 font-light max-w-3xl mx-auto leading-relaxed opacity-90 font-neue"
          >
            Join thousands of women who've transformed their relationship with the camera—and with themselves.
          </p>
          
          <div className="mb-12">
            <div 
              className="text-5xl lg:text-6xl mb-4 font-light font-cormorant"
            >
              $67
            </div>
            <p 
              className="text-[#B5B5B3] font-light font-neue"
            >
              One-time payment • Lifetime access • 30-day guarantee
            </p>
          </div>
          
          <Link href="/checkout/starter-kit">
            <Button 
              className="bg-white border-2 border-white text-[#171719] hover:bg-transparent hover:text-white text-lg px-12 py-6 font-normal uppercase tracking-wide transition-all duration-300 mb-8 font-['Neue_Einstellung']"
            >
              Get The Complete Kit
            </Button>
          </Link>
          
          <div className="border-t border-[#4C4B4B] pt-8">
            <p 
              className="text-[#B5B5B3] font-light italic text-lg font-cormorant"
            >
              "Your face is your brand. Show it boldly."
            </p>
            <p 
              className="text-[#B5B5B3] font-light mt-2 font-neue"
            >
              — Sandra, SELFIE AI™ Founder
            </p>
          </div>
        </div>
      </section>

      {/* Next Level Teaser */}
      <section className="px-6 py-24 bg-[#4C4B4B] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <Sparkles className="w-12 h-12 mx-auto mb-6 opacity-75" />
          
          <h2 
            className="text-4xl lg:text-5xl mb-6 font-light leading-tight font-cormorant"
          >
            Ready for the Next Level?
          </h2>
          
          <p 
            className="text-xl mb-8 font-light max-w-2xl mx-auto leading-relaxed opacity-90 font-neue"
          >
            Branded by Selfie takes this foundation and scales it into a premium personal brand system.
          </p>
          
          <Link href="/products/branded-by-selfie">
            <Button 
              className="bg-transparent border border-white text-white hover:bg-white hover:text-[#4C4B4B] px-8 py-3 font-light uppercase tracking-wide transition-all duration-300 font-['Neue_Einstellung']"
            >
              Explore Branded by Selfie
            </Button>
          </Link>
          
          <p 
            className="text-sm font-light opacity-75 mt-4 font-neue"
          >
            Complete brand strategy + premium AI tools
          </p>
        </div>
      </section>
    </div>
  );
} 