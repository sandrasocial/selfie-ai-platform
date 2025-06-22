'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { CheckCircle2, Lock, PlayCircle, Download, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface User {
  id: string;
  tier: string;
}

export default function StarterKitTools() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState<{ [key: string]: boolean }>({});
  const supabase = createClient();

  useEffect(() => {
    async function getUser() {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        
        if (!authUser) {
          setUser(null);
          return;
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authUser.id)
          .single();

        setUser({
          id: authUser.id,
          tier: profile?.tier || 'free'
        });
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    }

    getUser();
  }, [supabase]);

  const handleImageError = (imageId: string) => {
    setImageError(prev => ({ ...prev, [imageId]: true }));
  };

  const hasAccess = user && user.tier !== 'free';

  const modules = [
    {
      id: 1,
      title: 'Welcome & Foundation',
      subtitle: 'Your transformation starts here',
      description: 'Set your intention and understand the psychology of confidence on camera.',
      duration: '12 min',
      type: 'video',
      locked: false
    },
    {
      id: 2,
      title: 'Lighting Like a Pro',
      subtitle: 'Master natural & artificial light',
      description: 'The exact lighting setups that make every selfie editorial-worthy.',
      duration: '18 min',
      type: 'video',
      locked: !hasAccess
    },
    {
      id: 3,
      title: 'Poses That Convert',
      subtitle: 'Confident body language decoded',
      description: 'Never feel awkward again—poses for every mood and platform.',
      duration: '15 min',
      type: 'video',
      locked: !hasAccess
    },
    {
      id: 4,
      title: 'Editing Workflow',
      subtitle: 'From phone to professional',
      description: 'The 5-stage editing process that creates consistency across your content.',
      duration: '22 min',
      type: 'video',
      locked: !hasAccess
    },
    {
      id: 5,
      title: 'Caption Psychology',
      subtitle: 'Words that build connection',
      description: 'The storytelling formulas that turn scrollers into followers.',
      duration: '16 min',
      type: 'video',
      locked: !hasAccess
    },
    {
      id: 6,
      title: 'Brand Identity System',
      subtitle: 'Your visual DNA',
      description: 'Create cohesive content that builds recognition and trust.',
      duration: '20 min',
      type: 'video',
      locked: !hasAccess
    }
  ];

  const bonusResources = [
    {
      title: 'Selfie Glow-Up Presets',
      description: '7 custom Lightroom presets for instant editorial look',
      type: 'download',
      locked: !hasAccess
    },
    {
      title: 'Caption Templates Bank',
      description: '50+ proven caption formulas for every type of post',
      type: 'pdf',
      locked: !hasAccess
    },
    {
      title: 'Ring Light Setup Guide',
      description: 'Equipment recommendations for every budget',
      type: 'pdf',
      locked: !hasAccess
    },
    {
      title: 'Personal Brand Workbook',
      description: 'AI-powered brand clarity exercises',
      type: 'interactive',
      locked: !hasAccess
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F1F1F1] flex items-center justify-center">
        <div className="animate-pulse text-[#171719] font-neue">
          Loading your kit...
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F1F1F1] flex items-center justify-center px-6">
        <Card className="w-full max-w-md bg-white border-[#171719]">
          <CardHeader>
            <CardTitle className="text-[#171719] font-cormorant">
              Access Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[#4C4B4B] mb-6 font-neue">
              Please sign in to access your Starter Kit.
            </p>
            <Link href="/auth/login">
              <Button className="w-full bg-[#171719] text-white hover:bg-[#2A2A2A] border-0">
                Sign In
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F1F1F1]">
      {/* Hero Section */}
      <section className="relative px-6 py-24 bg-[#171719] text-white">
        {!imageError.hero && (
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{ backgroundImage: 'url(https://i.postimg.cc/rwgGZ6jy/flatlay-overlay-Url.png)' }}
            onError={() => handleImageError('hero')}
          />
        )}
        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <h1 
            className="text-5xl lg:text-7xl mb-6 font-normal leading-tight tracking-tight font-cormorant"
          >
            Your Selfie Starter Kit
          </h1>
          <p 
            className="text-xl lg:text-2xl mb-8 font-light max-w-3xl mx-auto leading-relaxed opacity-90 font-neue"
          >
            Master the art of confident selfies that build your personal brand. 
            {!hasAccess && ' Unlock now to access all modules and bonuses.'}
          </p>
          
          {!hasAccess && (
            <div className="mb-8">
              <Link href="/products/starter-kit">
                <Button 
                  className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#171719] text-lg px-12 py-4 font-normal uppercase tracking-wide transition-all duration-300 font-['Neue_Einstellung']"
                >
                  Unlock Full Kit → $67
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Progress Overview */}
      {hasAccess && (
        <section className="px-6 py-16 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div 
                  className="text-4xl font-light mb-2 text-[#171719] font-cormorant"
                >
                  6
                </div>
                <p 
                  className="text-[#4C4B4B] font-light font-neue"
                >
                  Video Modules
                </p>
              </div>
              <div>
                <div 
                  className="text-4xl font-light mb-2 text-[#171719] font-cormorant"
                >
                  4
                </div>
                <p 
                  className="text-[#4C4B4B] font-light font-neue"
                >
                  Bonus Resources
                </p>
              </div>
              <div>
                <div 
                  className="text-4xl font-light mb-2 text-[#171719] font-cormorant"
                >
                  ∞
                </div>
                <p 
                  className="text-[#4C4B4B] font-light font-neue"
                >
                  Lifetime Access
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Course Modules */}
      <section className="px-6 py-24 bg-[#F1F1F1]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 
              className="text-4xl lg:text-5xl mb-6 font-light text-[#171719] leading-tight font-cormorant"
            >
              What's Inside Your Kit
            </h2>
            <p 
              className="text-xl text-[#4C4B4B] font-light max-w-3xl mx-auto leading-relaxed font-neue"
            >
              A step-by-step system to transform your selfies from random to strategic. 
              Build confidence, create content, grow your brand.
            </p>
          </div>

          <div className="space-y-6">
            {modules.map((module, index) => (
              <Card 
                key={module.id} 
                className={`bg-white border transition-all duration-300 hover:shadow-lg ${
                  module.locked ? 'border-[#B5B5B3] opacity-60' : 'border-[#171719] hover:border-[#4C4B4B]'
                }`}
                style={{ borderRadius: '0px' }}
              >
                <CardContent className="p-8">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-4">
                        <div 
                          className="w-12 h-12 bg-[#171719] text-white flex items-center justify-center text-xl font-light mr-4"
                          style={{ 
                            fontFamily: 'Cormorant Garamond, serif',
                            borderRadius: '0px'
                          }}
                        >
                          {module.id}
                        </div>
                        <div>
                          <h3 
                            className="text-2xl font-light text-[#171719] mb-1 font-cormorant"
                          >
                            {module.title}
                          </h3>
                          <p 
                            className="text-[#4C4B4B] font-light italic font-neue"
                          >
                            {module.subtitle}
                          </p>
                        </div>
                      </div>
                      
                      <p 
                        className="text-[#4C4B4B] mb-4 leading-relaxed font-light font-neue"
                      >
                        {module.description}
                      </p>
                      
                      <div className="flex items-center text-sm text-[#4C4B4B] font-light">
                        <PlayCircle className="w-4 h-4 mr-2" />
                        <span className="font-neue">
                          {module.duration}
                        </span>
                      </div>
                    </div>

                    <div className="ml-8">
                      {module.locked ? (
                        <div className="flex items-center text-[#B5B5B3]">
                          <Lock className="w-5 h-5 mr-2" />
                          <span 
                            className="text-sm font-light font-neue"
                          >
                            Locked
                          </span>
                        </div>
                      ) : (                      <Button 
                        className="bg-[#171719] text-white hover:bg-[#2A2A2A] border-0 px-6 py-2 font-['Neue_Einstellung']"
                      >
                        {module.id === 1 ? 'Start Here' : 'Watch'}
                      </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Bonus Resources */}
      <section className="px-6 py-24 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 
              className="text-4xl lg:text-5xl mb-6 font-light text-[#171719] leading-tight font-cormorant"
            >
              Bonus Resources
            </h2>
            <p 
              className="text-xl text-[#4C4B4B] font-light max-w-3xl mx-auto leading-relaxed font-neue"
            >
              Everything you need to implement what you learn, from presets to templates.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {bonusResources.map((resource, index) => (
              <Card 
                key={index}
                className={`bg-[#F1F1F1] transition-all duration-300 hover:shadow-lg ${
                  resource.locked ? 'border-[#B5B5B3] opacity-60' : 'border-[#171719] hover:border-[#4C4B4B]'
                }`}
                style={{ borderRadius: '0px' }}
              >
                <CardContent className="p-8">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 
                        className="text-xl font-light text-[#171719] mb-2 font-cormorant"
                      >
                        {resource.title}
                      </h3>
                      <p 
                        className="text-[#4C4B4B] font-light leading-relaxed font-neue"
                      >
                        {resource.description}
                      </p>
                    </div>

                    <div className="ml-8">
                      {resource.locked ? (
                        <div className="flex items-center text-[#B5B5B3]">
                          <Lock className="w-5 h-5 mr-2" />
                          <span 
                            className="text-sm font-light font-neue"
                          >
                            Locked
                          </span>
                        </div>
                      ) : (
                        <Button 
                          className="bg-transparent border border-[#171719] text-[#171719] hover:bg-[#171719] hover:text-white px-6 py-2 font-['Neue_Einstellung']"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Transformation Quote */}
      <section className="px-6 py-24 bg-[#171719] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <blockquote 
            className="text-3xl lg:text-4xl italic font-light leading-relaxed mb-8 font-cormorant"
          >
            "Your camera roll tells your story. Let's rewrite it."
          </blockquote>
          <div 
            className="text-lg font-light opacity-75 font-neue"
          >
            — Sandra, SELFIE AI™ Founder
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!hasAccess && (
        <section className="px-6 py-24 bg-[#F1F1F1]">
          <div className="max-w-4xl mx-auto text-center">
            <h2 
              className="text-4xl lg:text-5xl mb-6 font-light text-[#171719] leading-tight font-cormorant"
            >
              Ready to Transform Your Selfies?
            </h2>
            <p 
              className="text-xl text-[#4C4B4B] font-light mb-12 max-w-2xl mx-auto leading-relaxed font-neue"
            >
              Join thousands of women who've stopped hiding and started building their brands with confidence.
            </p>
            
            <div className="space-y-4">
              <Link href="/products/starter-kit">
                <Button 
                  className="bg-[#171719] text-white hover:bg-[#2A2A2A] border-0 text-lg px-12 py-4 font-normal uppercase tracking-wide transition-all duration-300 font-['Neue_Einstellung']"
                >
                  Get the Complete Kit → $67
                </Button>
              </Link>
              <div 
                className="text-sm text-[#4C4B4B] font-light font-neue"
              >
                One-time payment • Lifetime access • 30-day guarantee
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Next Level Upsell */}
      {hasAccess && (
        <section className="px-6 py-24 bg-[#4C4B4B] text-white">
          <div className="max-w-4xl mx-auto text-center">
            <Sparkles className="w-12 h-12 mx-auto mb-6 opacity-75" />
            <h2 
              className="text-4xl lg:text-5xl mb-6 font-light leading-tight font-cormorant"
            >
              Ready for the Next Level?
            </h2>
            <p 
              className="text-xl font-light mb-8 max-w-2xl mx-auto leading-relaxed opacity-90 font-neue"
            >
              Branded by Selfie takes this foundation and scales it into a premium personal brand system.
            </p>
            
            <div className="space-y-4">
              <Link href="/products/branded-by-selfie">
                <Button 
                  className="bg-white text-[#4C4B4B] hover:bg-[#F1F1F1] border-0 text-lg px-12 py-4 font-normal uppercase tracking-wide transition-all duration-300 font-['Neue_Einstellung']"
                >
                  Explore Branded by Selfie
                </Button>
              </Link>
              <div 
                className="text-sm font-light opacity-75 font-neue"
              >
                Complete brand strategy + premium AI tools
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
