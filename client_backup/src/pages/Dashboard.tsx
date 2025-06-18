import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Badge } from "@/components/ui/badge";
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SubscriptionStatusWidget from '@/components/SubscriptionStatusWidget';
import TierAccessGuard from '@/components/TierAccessGuard';
import { PDFGenerator } from '@/components/PDFGenerator';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { useSessionReady } from '@/hooks/useSessionReady';
import { 
  Calendar,
  Camera, 
  FileText, 
  MessageCircle, 
  Crown, 
  Sparkles,
  ArrowRight,
  Upload,
  Edit3,
  Target,
  TrendingUp,
  CheckCircle2,
  Download,
  Play,
  Lock,
  Star,
  Clock,
  Gift,
  Archive,
  Bot
} from 'lucide-react';

export default function Dashboard() {
  const { user: supabaseUser, sessionReady } = useSupabaseAuth();
  const { isReady } = useSessionReady();
  
  const { data: user } = useQuery({
    queryKey: ['/api/me'],
    queryFn: async () => {
      const response = await fetch('/api/me', {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch user');
      return response.json();
    },
    enabled: isReady && sessionReady && !!supabaseUser?.id,
    retry: false
  });

  const { data: brandHubStatus } = useQuery({
    queryKey: ['/api/brand-hub/status'],
    queryFn: async () => {
      const response = await fetch('/api/brand-hub/status', {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch brand hub status');
      return response.json();
    },
    enabled: isReady && sessionReady && !!supabaseUser?.id,
    retry: false
  });

  const [userPurchases, setUserPurchases] = useState({
    starterKit: false,
    brandedBySelfie: false,
    vipAccess: false
  });

  useEffect(() => {
    if (user) {
      setUserPurchases({
        starterKit: user.purchases?.includes('starter-kit') || false,
        brandedBySelfie: user.purchases?.includes('branded-by-selfie') || false,
        vipAccess: user.vipStatus || false
      });
    }
  }, [user]);

  const scrollToTools = () => {
    document.getElementById('tools-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const offerLadderCards = [
    {
      id: 'freebie',
      title: 'Free Guide',
      subtitle: 'Show Your Face™',
      tagline: 'Start showing up with confidence—even if you\'ve been hiding.',
      cta: 'Download Guide',
      link: '/freebie/selfie-guide',
      status: 'open',
      bgImage: 'https://i.postimg.cc/dQ5q8mbb/22.png',
      cardStyle: 'light'
    },
    {
      id: 'starter-kit',
      title: 'Selfie Starter Kit',
      subtitle: '$67',
      tagline: 'Your selfie system for lighting, posing, editing + content.',
      cta: userPurchases.starterKit ? 'Start the Kit' : 'Get the Kit',
      link: userPurchases.starterKit ? '/courses/starter-kit' : '/products/starter-kit',
      status: userPurchases.starterKit ? 'purchased' : 'available',
      bgImage: 'https://i.postimg.cc/bwYKyKCW/122.png',
      cardStyle: 'gray'
    },
    {
      id: 'branded',
      title: 'Branded by Selfie™',
      subtitle: '$397',
      tagline: 'Show up as the brand. Boldly, beautifully, strategically.',
      cta: userPurchases.brandedBySelfie ? 'Start Branded Course' : 'Unlock Brand Builder',
      link: userPurchases.brandedBySelfie ? '/courses/branded' : '/products/branded-by-selfie',
      status: userPurchases.brandedBySelfie ? 'purchased' : 'available',
      bgImage: 'https://i.postimg.cc/nhDpf8Xx/35.png',
      cardStyle: 'dark'
    },
    {
      id: 'vip',
      title: 'VIP Empire Builder',
      subtitle: 'Elite Access',
      tagline: 'Your business. Your brand. Fully activated.',
      cta: 'Apply Now',
      link: '/vip/apply',
      status: 'open',
      bgImage: 'https://i.postimg.cc/bYB7yCcw/128.png',
      cardStyle: 'luxury'
    }
  ];

  const tools = [
    { name: 'Sandra AI Chat', link: '/sandra-ai', icon: MessageCircle },
    { name: 'Selfie Uploader', link: '/studio', icon: Camera },
    { name: 'Caption Generator', link: '/studio', icon: Edit3 },
    { name: 'Strategy Workbooks', link: '/workbooks', icon: FileText },
    { name: 'Content Calendar', link: '/calendar', icon: Calendar },
    { name: 'Pose Coach', link: '/pose-coach', icon: Target }
  ];

  const weeklyPlan = [
    { day: 'Mon', content: 'Morning selfie + power quote', status: 'planned' },
    { day: 'Tue', content: 'Behind-the-scenes story', status: 'planned' },
    { day: 'Wed', content: 'Educational carousel', status: 'empty' },
    { day: 'Thu', content: 'Client transformation', status: 'empty' },
    { day: 'Fri', content: 'Personal story post', status: 'empty' },
    { day: 'Sat', content: 'Weekend inspiration', status: 'empty' },
    { day: 'Sun', content: 'Weekly reflection', status: 'empty' }
  ];

  const userName = user?.name || user?.firstName || 'Queen';
  const dailyQuote = "Your brand is your mirror. Make it magnetic.";

  const getCardStyles = (cardStyle: string, status: string) => {
    const baseStyles = "relative overflow-hidden transition-all duration-500 cursor-pointer group h-80";

    switch (cardStyle) {
      case 'light':
        return `${baseStyles} border border-[#B5B5B3] hover:shadow-xl`;
      case 'gray':
        return `${baseStyles} border-2 ${status === 'purchased' ? 'border-[#171719]' : 'border-[#B5B5B3]'} hover:shadow-xl hover:border-[#171719]`;
      case 'dark':
        return `${baseStyles} border-2 ${status === 'purchased' ? 'border-yellow-400' : 'border-[#4C4B4B]'} hover:border-yellow-400`;
      case 'luxury':
        return `${baseStyles} border-2 border-[#171719] hover:shadow-2xl`;
      default:
        return baseStyles;
    }
  };

  const getCardBackground = (cardStyle: string) => {
    switch (cardStyle) {
      case 'light':
        return '#F1F1F1';
      case 'gray':
        return '#F1F1F1';
      case 'dark':
        return '#4C4B4B';
      case 'luxury':
        return '#171719';
      default:
        return '#F1F1F1';
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F1F1F1' }}>
      <Header user={user} />

      {/* Hero Welcome Block */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center animate-slow-zoom"
          style={{
            backgroundImage: 'url(https://i.postimg.cc/fLSsQQth/IMG-6384-jpg.jpg)'
          }}
        />
        <div 
          className="absolute inset-0"
          style={{ 
            background: 'linear-gradient(to top, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.2))' 
          }} 
        />

        <div className="relative z-10 text-center text-white max-w-5xl px-6 animate-fade-in">
          {/* Section Label */}
          <div className="mb-8">
            <p 
              className="text-xs uppercase tracking-widest mb-2"
              style={{ 
                fontFamily: 'Neue Einstellung, sans-serif',
                letterSpacing: '0.3em',
                color: '#F1F1F1'
              }}
            >
              DASHBOARD
            </p>
            <div 
              className="w-16 h-px mx-auto"
              style={{ backgroundColor: '#F1F1F1', opacity: '0.6' }}
            />
          </div>

          {/* Main Headline */}
          <h1 
            className="text-6xl font-light mb-6"
            style={{ 
              fontFamily: 'Cormorant Garamond, serif',
              fontWeight: '300',
              color: '#F1F1F1',
              lineHeight: '1.1'
            }}
          >
            Hey {userName}.
          </h1>

          {/* Subheadline */}
          <h2 
            className="text-2xl italic mb-16"
            style={{ 
              fontFamily: 'Cormorant Garamond, serif',
              color: '#F1F1F1',
              opacity: '0.9',
              fontWeight: '400'
            }}
          >
            Your empire starts here.
          </h2>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/studio">
              <Button 
                className="px-12 py-4 text-sm font-normal uppercase tracking-wide border-2 transition-all duration-300 hover:scale-105 hover:opacity-85"
                style={{ 
                  backgroundColor: 'transparent',
                  color: '#F1F1F1',
                  border: '1.5px solid #F1F1F1',
                  borderRadius: '0px',
                  fontFamily: 'Neue Einstellung, sans-serif',
                  letterSpacing: '0.5px'
                }}
              >
                START WHERE YOU LEFT OFF
              </Button>
            </Link>
            <Button 
              onClick={scrollToTools}
              className="px-12 py-4 text-sm font-normal uppercase tracking-wide border-2 transition-all duration-300 hover:scale-105 hover:opacity-85"
              style={{ 
                backgroundColor: 'transparent',
                color: '#F1F1F1',
                border: '1.5px solid #F1F1F1',
                borderRadius: '0px',
                fontFamily: 'Neue Einstellung, sans-serif',
                letterSpacing: '0.5px'
              }}
            >
              SEE ALL TOOLS
            </Button>
          </div>
        </div>
      </section>

      {/* Subscription Status */}
      <section className="py-8 px-6" style={{ backgroundColor: '#F1F1F1' }}>
        <div className="max-w-4xl mx-auto">
          <SubscriptionStatusWidget />
        </div>
      </section>

      {/* Brand Hub Block */}
      <section className="py-12 px-6" style={{ backgroundColor: '#F1F1F1' }}>
        <div className="max-w-4xl mx-auto">
          <Card 
            className="border-0 shadow-sm"
            style={{ 
              backgroundColor: '#FFFFFF',
              borderRadius: '0px'
            }}
          >
            <CardContent className="p-8">
              <div className="text-center">
                <h3 
                  className="text-2xl font-normal mb-4"
                  style={{ 
                    fontFamily: 'Cormorant Garamond, serif',
                    color: '#171719'
                  }}
                >
                  Brand Hub
                </h3>
                <p 
                  className="text-sm mb-6"
                  style={{ 
                    fontFamily: 'Neue Einstellung, sans-serif',
                    color: '#4C4B4B',
                    letterSpacing: '0.5px'
                  }}
                >
                  {brandHubStatus?.isComplete 
                    ? "Your personalized AI experience is active"
                    : brandHubStatus?.hasProfile 
                      ? `Profile ${brandHubStatus.completionPercentage}% complete`
                      : "Activate your personalized AI experience"
                  }
                </p>
                {brandHubStatus?.completionPercentage > 0 && !brandHubStatus?.isComplete && (
                  <div className="mb-6">
                    <div 
                      className="w-full h-1 mx-auto"
                      style={{ backgroundColor: '#F1F1F1', width: '200px' }}
                    >
                      <div 
                        className="h-1 transition-all duration-300"
                        style={{ 
                          backgroundColor: '#171719',
                          width: `${brandHubStatus.completionPercentage}%`
                        }}
                      />
                    </div>
                  </div>
                )}
                <Link href={brandHubStatus?.isComplete ? "/profile" : "/onboarding/brand-hub"}>
                  <Button 
                    className="px-8 py-3 text-xs uppercase tracking-wide transition-all duration-300"
                    style={{ 
                      backgroundColor: brandHubStatus?.isComplete ? '#4C4B4B' : '#171719',
                      color: '#F1F1F1',
                      border: 'none',
                      borderRadius: '0px',
                      fontFamily: 'Neue Einstellung, sans-serif',
                      letterSpacing: '1px'
                    }}
                  >
                    {brandHubStatus?.isComplete ? 'Manage Profile' : 'Configure Profile'}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Offer Ladder Cards */}
      <section className="py-20 px-6" style={{ backgroundColor: '#F1F1F1' }}>
        <div className="max-w-7xl mx-auto">
          <h2 
            className="text-4xl font-normal text-center mb-16"
            style={{ 
              fontFamily: 'Cormorant Garamond, serif',
              color: '#171719'
            }}
          >
            Your Empire Building Path
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {offerLadderCards.map((card, index) => (
              <Link key={card.id} href={card.link}>
                <Card 
                  className={getCardStyles(card.cardStyle, card.status)}
                  style={{ 
                    backgroundColor: getCardBackground(card.cardStyle),
                    borderRadius: '0px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.02)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  {/* Background Image */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    style={{
                      backgroundImage: `url(${card.bgImage})`
                    }}
                  />

                  {/* Overlay */}
                  <div 
                    className="absolute inset-0 transition-all duration-500" 
                    style={{ 
                      backgroundColor: 'rgba(0, 0, 0, 0.3)'
                    }}
                  />

                  {/* Status Badge */}
                  {card.status === 'purchased' && (
                    <div className="absolute top-4 right-4 z-20">
                      <Badge 
                        className="uppercase tracking-wide"
                        style={{ 
                          backgroundColor: '#F1F1F1',
                          color: '#171719',
                          fontFamily: 'Neue Einstellung, sans-serif',
                          borderRadius: '0px'
                        }}
                      >
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Owned
                      </Badge>
                    </div>
                  )}

                  {/* VIP Stars */}
                  {card.id === 'vip' && (
                    <div className="absolute top-4 left-4 z-20 flex space-x-1">
                      <Star className="w-4 h-4" style={{ color: '#F1F1F1' }} />
                      <Star className="w-4 h-4" style={{ color: '#F1F1F1' }} />
                      <Star className="w-4 h-4" style={{ color: '#F1F1F1' }} />
                    </div>
                  )}

                  {/* Content */}
                  <CardContent className="relative z-10 p-8 h-full flex flex-col justify-end">
                    <div className="mb-4">
                      <h3 
                        className="text-3xl font-normal mb-2"
                        style={{ 
                          fontFamily: 'Cormorant Garamond, serif',
                          color: '#F1F1F1'
                        }}
                      >
                        {card.title}
                      </h3>
                      <p 
                        className="text-lg mb-4 opacity-90"
                        style={{ 
                          fontFamily: 'Neue Einstellung, sans-serif',
                          color: '#F1F1F1'
                        }}
                      >
                        {card.subtitle}
                      </p>
                    </div>

                    <p 
                      className="text-sm mb-6 leading-relaxed"
                      style={{ 
                        fontFamily: 'Neue Einstellung, sans-serif',
                        color: '#F1F1F1',
                        opacity: '0.9'
                      }}
                    >
                      {card.tagline}
                    </p>

                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div 
                        className="flex items-center"
                        style={{ color: '#F1F1F1' }}
                      >
                        <span 
                          className="text-sm font-medium uppercase tracking-wide"
                          style={{ 
                            fontFamily: 'Neue Einstellung, sans-serif',
                            letterSpacing: '0.5px'
                          }}
                        >
                          {card.cta}
                        </span>
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Progress Tracker */}
      <section className="py-16 px-6" style={{ backgroundColor: '#171719' }}>
        <div className="max-w-4xl mx-auto text-center">
          <h3 
            className="text-2xl font-normal mb-8"
            style={{ 
              fontFamily: 'Cormorant Garamond, serif',
              color: '#F1F1F1'
            }}
          >
            Your Journey
          </h3>

          <div className="flex items-center justify-center space-x-8">
            <div className="flex items-center">
              <CheckCircle2 className="w-6 h-6" style={{ color: '#F1F1F1' }} />
              <span 
                className="ml-2 text-sm uppercase tracking-wide"
                style={{ 
                  fontFamily: 'Neue Einstellung, sans-serif',
                  color: '#F1F1F1'
                }}
              >
                Freebie
              </span>
            </div>

            <div className="w-12 h-0.5" style={{ backgroundColor: '#B5B5B3' }} />

            <div className="flex items-center">
              {userPurchases.starterKit ? (
                <CheckCircle2 className="w-6 h-6" style={{ color: '#F1F1F1' }} />
              ) : (
                <div className="w-6 h-6 rounded-full border-2" style={{ borderColor: '#B5B5B3' }} />
              )}
              <span 
                className="ml-2 text-sm uppercase tracking-wide"
                style={{ 
                  fontFamily: 'Neue Einstellung, sans-serif',
                  color: userPurchases.starterKit ? '#F1F1F1' : '#B5B5B3'
                }}
              >
                Kit
              </span>
            </div>

            <div className="w-12 h-0.5" style={{ backgroundColor: '#B5B5B3' }} />

            <div className="flex items-center">
              {userPurchases.brandedBySelfie ? (
                <CheckCircle2 className="w-6 h-6" style={{ color: '#F1F1F1' }} />
              ) : (
                <div className="w-6 h-6 rounded-full border-2" style={{ borderColor: '#B5B5B3' }} />
              )}
              <span 
                className="ml-2 text-sm uppercase tracking-wide"
                style={{ 
                  fontFamily: 'Neue Einstellung, sans-serif',
                  color: userPurchases.brandedBySelfie ? '#F1F1F1' : '#B5B5B3'
                }}
              >
                Branded
              </span>
            </div>

            <div className="w-12 h-0.5" style={{ backgroundColor: '#B5B5B3' }} />

            <div className="flex items-center">
              {userPurchases.vipAccess ? (
                <Crown className="w-6 h-6" style={{ color: '#F1F1F1' }} />
              ) : (
                <div className="w-6 h-6 rounded-full border-2" style={{ borderColor: '#B5B5B3' }} />
              )}
              <span 
                className="ml-2 text-sm uppercase tracking-wide"
                style={{ 
                  fontFamily: 'Neue Einstellung, sans-serif',
                  color: userPurchases.vipAccess ? '#F1F1F1' : '#B5B5B3'
                }}
              >
                VIP
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section id="tools-section" className="py-20 px-6" style={{ backgroundColor: '#F1F1F1' }}>
        <div className="max-w-6xl mx-auto">
          <h3 
            className="text-3xl font-normal text-center mb-12"
            style={{ 
              fontFamily: 'Cormorant Garamond, serif',
              color: '#171719'
            }}
          >
            Your Tools
          </h3>

          <div className="grid md:grid-cols-3 gap-6">
            {tools.map((tool) => (
              <Link key={tool.name} href={tool.link}>
                <Card 
                  className="h-32 flex items-center justify-center transition-all duration-300 hover:shadow-lg cursor-pointer"
                  style={{ 
                    backgroundColor: '#FFFFFF',
                    borderRadius: '0px',
                    border: '1px solid #B5B5B3'
                  }}
                >
                  <CardContent className="p-6 text-center">
                    <tool.icon className="w-8 h-8 mx-auto mb-3" style={{ color: '#171719' }} />
                    <p 
                      className="text-sm font-medium"
                      style={{ 
                        fontFamily: 'Neue Einstellung, sans-serif',
                        color: '#171719'
                      }}
                    >
                      {tool.name}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Weekly Content Plan */}
      <section className="py-20 px-6" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="max-w-4xl mx-auto">
          <h3 
            className="text-3xl font-normal text-center mb-12"
            style={{ 
              fontFamily: 'Cormorant Garamond, serif',
              color: '#171719'
            }}
          >
            This Week's Content Plan
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
            {weeklyPlan.map((day, index) => (
              <Card 
                key={index}
                className="p-4 transition-all duration-300 hover:shadow-lg"
                style={{ 
                  backgroundColor: day.status === 'planned' ? '#F1F1F1' : '#FFFFFF',
                  borderRadius: '0px',
                  border: '1px solid #B5B5B3'
                }}
              >
                <CardContent className="p-2">
                  <div className="text-center">
                    <p 
                      className="text-xs uppercase tracking-wide mb-2"
                      style={{ 
                        fontFamily: 'Neue Einstellung, sans-serif',
                        color: '#171719'
                      }}
                    >
                      {day.day}
                    </p>
                    {day.status === 'planned' ? (
                      <CheckCircle2 className="w-4 h-4 mx-auto mb-2" style={{ color: '#171719' }} />
                    ) : (
                      <div className="w-4 h-4 mx-auto mb-2 rounded-full border" style={{ borderColor: '#B5B5B3' }} />
                    )}
                    <p 
                      className="text-xs leading-tight"
                      style={{ 
                        fontFamily: 'Neue Einstellung, sans-serif',
                        color: day.status === 'planned' ? '#171719' : '#B5B5B3'
                      }}
                    >
                      {day.content}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Daily Quote */}
      <section className="py-16 px-6" style={{ backgroundColor: '#171719' }}>
        <div className="max-w-3xl mx-auto text-center">
          <p 
            className="text-3xl font-normal italic mb-6"
            style={{ 
              fontFamily: 'Cormorant Garamond, serif',
              color: '#F1F1F1'
            }}
          >
            "{dailyQuote}"
          </p>
          <p 
            className="text-sm uppercase tracking-widest"
            style={{ 
              fontFamily: 'Neue Einstellung, sans-serif',
              color: '#B5B5B3',
              letterSpacing: '0.3em'
            }}
          >
            — SANDRA
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}