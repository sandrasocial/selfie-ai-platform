'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Check, Star } from 'lucide-react';

export default function StartHerePage() {
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const journeyPaths = [
    {
      id: 'freebie',
      title: 'Free Guide',
      subtitle: 'Show Your Face™',
      description: 'Perfect for beginners ready to start showing up confidently online.',
      features: [
        'Selfie confidence basics',
        'Lighting & angles guide', 
        'First post framework',
        'Brand foundation worksheet'
      ],
      cta: 'Get Free Guide',
      link: '/freebie/selfie-guide',
      bgImage: 'https://i.postimg.cc/7Z08QgRY/80.png',
      price: 'FREE',
      ideal: 'New to personal branding'
    },
    {
      id: 'starter-kit',
      title: 'Selfie Starter Kit',
      subtitle: 'Essential Tools',
      description: 'Everything you need to create content that converts and builds your brand.',
      features: [
        'Complete photo vault system',
        'AI caption generator',
        'Content calendar planning',
        'Basic brand kit creation'
      ],
      cta: 'Start Building',
      link: '/products/starter-kit',
      bgImage: 'https://i.postimg.cc/Bbn4rXK7/3.png',
      price: '$47',
      ideal: 'Ready to create consistently'
    },
    {
      id: 'branded',
      title: 'Branded by Selfie',
      subtitle: 'Complete Transformation',
      description: 'Full brand transformation with advanced tools and strategy.',
      features: [
        'Advanced studio suite',
        'Sandra AI coaching',
        'Custom brand development',
        'Feed design mastery'
      ],
      cta: 'Transform Now',
      link: '/products/branded-by-selfie',
      bgImage: 'https://i.postimg.cc/nhDpf8Xx/35.png',
      price: '$297',
      ideal: 'Serious about building your empire'
    },
    {
      id: 'vip',
      title: 'VIP Experience',
      subtitle: 'White Glove Service',
      description: 'Personal guidance to build your empire with done-with-you support.',
      features: [
        'Everything in Branded',
        '1:1 strategy sessions',
        'Personal brand audit',
        'Priority support & feedback'
      ],
      cta: 'Apply for VIP',
      link: '/vip/apply',
      bgImage: 'https://i.postimg.cc/V673b4J4/81.png',
      price: '$997',
      ideal: 'Want personalized guidance'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 px-6 md:px-16 lg:px-24 py-8 transition-all duration-300 ${
        isScrolled ? 'bg-[#171719] backdrop-blur-sm' : 'bg-transparent'
      }`}>
        <div className="flex items-center justify-between">
          <Link href="/" className="text-white">
            <img 
              src="https://i.postimg.cc/L88db1fc/White-transperent-logo.png" 
              alt="SELFIE AI Logo" 
              className="h-8" 
            />
          </Link>
          <Link 
            href="/auth/login"
            className="hidden md:inline-block bg-white text-[#171719] px-8 py-3 font-inter text-[11px] uppercase tracking-[0.3em] hover:bg-[#F1F1F1] transition-colors"
          >
            Sign In
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://i.postimg.cc/JnzLVfJ7/Heroimagehomaepage.png"
            alt="Sandra - Your personal brand starts here"
            fill
            className="w-full h-full object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#171719]/70 via-[#171719]/40 to-transparent"></div>
        </div>

        <div className="relative z-10 min-h-screen flex items-center">
          <div className="max-w-[1400px] mx-auto px-6 md:px-16 lg:px-24 w-full">
            <div className="max-w-4xl">
              <p className="font-inter text-[11px] uppercase tracking-[0.35em] text-white/60 mb-8">
                Choose your path
              </p>

              <h1 className="font-cormorant text-[48px] sm:text-[72px] md:text-[96px] lg:text-[120px] leading-[0.85] text-white mb-8">
                Your journey<br className="hidden sm:block"/>
                starts here
              </h1>

              <div className="space-y-4 mb-12 max-w-2xl">
                <p className="font-inter text-[20px] leading-relaxed text-white/80 italic">
                  Four ways to build your brand. One goal: stop hiding.
                </p>
                <p className="font-inter text-[20px] leading-relaxed text-white/80">
                  Pick the path that feels right for where you are today.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => document.getElementById('paths-section')?.scrollIntoView({ behavior: 'smooth' })}
                  className="group relative overflow-hidden bg-white text-[#171719] px-10 py-4 font-inter text-[11px] uppercase tracking-[0.3em] hover:bg-[#F1F1F1] transition-all duration-300"
                >
                  <span className="relative z-10">Show Me My Options</span>
                </button>
                <Link 
                  href="/guide/selfie-basics"
                  className="group relative border border-white/30 text-white px-10 py-4 font-inter text-[11px] uppercase tracking-[0.3em] hover:bg-white hover:text-[#171719] transition-all duration-300"
                >
                  <span className="relative z-10">Just Give Me The Guide</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-20 right-20 pointer-events-none">
          <span className="font-cormorant italic text-[300px] text-white/[0.03] leading-none">01</span>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="w-px h-16 bg-white/20 relative">
            <div className="absolute top-0 w-px h-8 bg-white animate-bounce"></div>
          </div>
        </div>
      </section>

      {/* Your Story Section */}
      <section className="py-20 md:py-32 bg-[#F1F1F1]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center">
            <div className="lg:col-span-7">
              <div className="mb-8">
                <div className="font-inter text-[11px] uppercase tracking-[0.3em] text-[#B5B5B3] mb-6 flex items-center gap-4">
                  <span className="inline-block w-6 h-px bg-[#B5B5B3]"></span>
                  Your story matters
                </div>
                <h2 className="font-cormorant text-[40px] sm:text-[56px] md:text-[72px] leading-[0.9] text-[#171719] mb-8">
                  I know exactly<br/>where you are
                </h2>
              </div>

              <div className="space-y-6 mb-12">
                <p className="font-inter text-[18px] leading-relaxed text-[#4C4B4B]">
                  Three years ago, I was sitting in my car after my divorce, scrolling through Instagram, 
                  wondering how everyone else made it look so easy.
                </p>
                <p className="font-inter text-[18px] leading-relaxed text-[#4C4B4B]">
                  I had an iPhone, three kids, and zero confidence. But I also had this feeling that 
                  I was meant for more. That my story could help someone else.
                </p>
                <div className="pl-6 border-l-2 border-[#171719] my-8">
                  <p className="font-cormorant italic text-[24px] leading-relaxed text-[#171719]">
                    "I figured out that your phone is all you need. But more importantly, 
                    I figured out how to stop hiding."
                  </p>
                </div>
                <p className="font-inter text-[18px] leading-relaxed text-[#4C4B4B]">
                  Now I help women build their entire personal brand from their camera roll. 
                  Because honestly? Your phone really is all you need.
                </p>
              </div>

              <img 
                src="https://i.postimg.cc/NMsTRh2K/Sandra-Signature-homepage.png" 
                alt="Sandra's signature" 
                className="h-16 opacity-80" 
              />
            </div>

            <div className="lg:col-span-5 relative">
              <div className="relative">
                <Image
                  src="https://i.postimg.cc/dQ5q8mbb/22.png"
                  alt="Sandra's transformation"
                  width={600}
                  height={800}
                  className="w-full h-auto"
                  priority={false}
                />
                <div className="absolute -bottom-8 -left-8 bg-white p-6 shadow-xl">
                  <div className="font-cormorant text-[48px] text-[#171719]/10">120K</div>
                  <p className="font-inter text-[10px] uppercase tracking-[0.2em] text-[#171719] -mt-4">
                    Followers in 90 days
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Paths Section */}
      <section id="paths-section" className="py-20 md:py-32 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 md:px-24">
          <div className="text-center mb-16">
            <div className="font-inter text-[11px] uppercase tracking-[0.3em] text-[#B5B5B3] mb-6 flex items-center justify-center gap-4">
              <span className="inline-block w-6 h-px bg-[#B5B5B3]"></span>
              Four paths to transformation
              <span className="inline-block w-6 h-px bg-[#B5B5B3]"></span>
            </div>
            <h2 className="font-cormorant text-[40px] sm:text-[56px] md:text-[64px] leading-[0.9] text-[#171719] mb-8">
              Choose your journey
            </h2>
            <p className="font-inter text-[18px] leading-relaxed text-[#4C4B4B] max-w-2xl mx-auto">
              Each path is designed for where you are right now. No overwhelm. No pressure. 
              Just the exact tools you need to start showing up.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {journeyPaths.map((path, index) => (
              <div 
                key={path.id}
                className={`group relative overflow-hidden cursor-pointer transition-all duration-500 ${
                  selectedPath === path.id ? 'scale-105 shadow-2xl' : 'hover:scale-102 hover:shadow-xl'
                }`}
                onClick={() => setSelectedPath(selectedPath === path.id ? null : path.id)}
              >
                <div className="relative h-[600px]">
                  <Image
                    src={path.bgImage}
                    alt={path.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#171719] via-[#171719]/60 to-transparent"></div>
                  
                  <div className="absolute top-8 left-8 right-8">
                    <div className="flex items-center justify-between mb-4">
                      <div className="bg-white text-[#171719] px-4 py-2">
                        <span className="font-inter text-[11px] uppercase tracking-[0.3em] font-semibold">
                          {path.price}
                        </span>
                      </div>
                      <div className="text-[48px] font-cormorant text-white/10">
                        {String(index + 1).padStart(2, '0')}
                      </div>
                    </div>
                    <p className="font-inter text-[11px] uppercase tracking-[0.3em] text-white/60">
                      {path.ideal}
                    </p>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <h3 className="font-cormorant text-[32px] leading-tight text-white mb-2">
                      {path.title}
                    </h3>
                    <p className="font-inter text-[14px] uppercase tracking-[0.2em] text-white/80 mb-4">
                      {path.subtitle}
                    </p>
                    <p className="font-inter text-[16px] leading-relaxed text-white/90 mb-6">
                      {path.description}
                    </p>

                    {selectedPath === path.id && (
                      <div className="animate-fadeIn">
                        <div className="space-y-2 mb-6">
                          {path.features.map((feature, i) => (
                            <div key={i} className="flex items-center gap-3">
                              <Check className="w-4 h-4 text-white" />
                              <span className="font-inter text-[14px] text-white/90">
                                {feature}
                              </span>
                            </div>
                          ))}
                        </div>
                        
                        <Link 
                          href={path.link}
                          className="inline-flex items-center gap-3 bg-white text-[#171719] px-8 py-4 font-inter text-[11px] uppercase tracking-[0.3em] hover:bg-[#F1F1F1] transition-colors"
                        >
                          {path.cta}
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    )}

                    {selectedPath !== path.id && (
                      <button className="w-full h-px bg-white/20 group-hover:bg-white transition-colors duration-300"></button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <p className="font-inter text-[14px] text-[#B5B5B3] mb-8">
              Not sure which path to choose? Start with the free guide and upgrade anytime.
            </p>
            <Link 
              href="/guide/selfie-basics"
              className="inline-flex items-center gap-3 border border-[#171719] text-[#171719] px-10 py-4 font-inter text-[11px] uppercase tracking-[0.3em] hover:bg-[#171719] hover:text-white transition-all duration-300"
            >
              Get Free Guide First
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 md:py-32 bg-[#F1F1F1]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-24">
          <div className="text-center mb-16">
            <h2 className="font-cormorant text-[40px] sm:text-[56px] md:text-[64px] leading-[0.9] text-[#171719] mb-8">
              You're in good company
            </h2>
            <p className="font-inter text-[18px] leading-relaxed text-[#4C4B4B] max-w-2xl mx-auto">
              Join thousands of women who stopped waiting for perfect and started showing up as themselves.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="font-cormorant text-[64px] leading-none text-[#171719] mb-4">
                10K+
              </div>
              <p className="font-inter text-[14px] uppercase tracking-[0.3em] text-[#B5B5B3]">
                Women Transformed
              </p>
            </div>
            <div className="text-center">
              <div className="font-cormorant text-[64px] leading-none text-[#171719] mb-4">
                1.7M
              </div>
              <p className="font-inter text-[14px] uppercase tracking-[0.3em] text-[#B5B5B3]">
                Monthly Reach
              </p>
            </div>
            <div className="text-center">
              <div className="font-cormorant text-[64px] leading-none text-[#171719] mb-4">
                90
              </div>
              <p className="font-inter text-[14px] uppercase tracking-[0.3em] text-[#B5B5B3]">
                Days Average Transformation
              </p>
            </div>
          </div>

          <div className="bg-white p-12 text-center">
            <div className="max-w-3xl mx-auto">
              <div className="flex justify-center mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-[#171719] fill-current" />
                ))}
              </div>
              <blockquote className="font-cormorant italic text-[24px] leading-relaxed text-[#171719] mb-6">
                "Sandra, I'm not going to lie, I just took the BEST photo of myself that I've taken in YEARS. 
                The confidence boost is real."
              </blockquote>
              <cite className="font-inter text-[14px] uppercase tracking-[0.3em] text-[#B5B5B3]">
                — Sarah, Marketing Consultant
              </cite>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 md:py-32 bg-[#171719]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-24 text-center">
          <h2 className="font-cormorant text-[40px] sm:text-[56px] md:text-[64px] leading-[0.9] text-white mb-8">
            Your story is waiting
          </h2>
          <p className="font-inter text-[18px] leading-relaxed text-white/80 max-w-2xl mx-auto mb-12">
            Stop scrolling through other people's highlight reels. Start creating your own.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/guide/selfie-basics"
              className="bg-white text-[#171719] px-10 py-4 font-inter text-[11px] uppercase tracking-[0.3em] hover:bg-[#F1F1F1] transition-colors"
            >
              Start with Free Guide
            </Link>
            <Link 
              href="/tools/starter-kit"
              className="border border-white text-white px-10 py-4 font-inter text-[11px] uppercase tracking-[0.3em] hover:bg-white hover:text-[#171719] transition-all duration-300"
            >
              Build Your Brand Now
            </Link>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        
        .hover\\:scale-102:hover {
          transform: scale(1.02);
        }
        
        .font-cormorant {
          font-family: 'Cormorant Garamond', serif;
        }
        
        .font-inter {
          font-family: 'Inter', 'Neue Einstellung', sans-serif;
        }
      `}</style>
    </div>
  );
} 