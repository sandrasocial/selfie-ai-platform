
import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Badge } from "@/components/ui/badge";
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SubscriptionStatusWidget from '@/components/SubscriptionStatusWidget';
import TierAccessGuard from '@/components/TierAccessGuard';
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

export default function DashboardDev() {
  const [user, setUser] = useState<any>(null);
  const [userPurchases, setUserPurchases] = useState({
    starterKit: false,
    brandedBySelfie: false,
    vipAccess: false
  });

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userResponse = await fetch("/api/me", {
          credentials: "include",
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUser(userData);

          // Mock user purchases for design implementation
          setUserPurchases({
            starterKit: userData.purchases?.includes('starter-kit') || false,
            brandedBySelfie: userData.purchases?.includes('branded-by-selfie') || false,
            vipAccess: userData.vipStatus || false
          });
        }
      } catch (error) {
        console.log("User not authenticated");
      }
    };

    loadUserData();
  }, []);

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

      {/* Development Badge */}
      <div className="bg-yellow-400 text-black text-center py-2 px-4">
        <p className="text-sm font-medium">🚧 DEVELOPMENT VERSION - /dashboard-dev</p>
      </div>

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
              <Crown className="w-6 h-6" style={{ color: '#F1F1F1' }} />
              <span 
                className="ml-2 text-sm uppercase tracking-wide"
                style={{ 
                  fontFamily: 'Neue Einstellung, sans-serif',
                  color: '#F1F1F1'
                }}
              >
                VIP
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Sandra Says Daily Prompt */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://i.postimg.cc/d0MV1PLq/IMG-8465-jpg.jpg)'
          }}
        />
        <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }} />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h3 
            className="text-2xl font-normal mb-6"
            style={{ 
              fontFamily: 'Cormorant Garamond, serif',
              color: '#F1F1F1'
            }}
          >
            Sandra Says...
          </h3>

          <p 
            className="text-3xl font-normal italic mb-8"
            style={{ 
              fontFamily: 'Cormorant Garamond, serif',
              color: '#F1F1F1'
            }}
          >
            "{dailyQuote}"
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/studio">
              <Button 
                className="px-8 py-3 font-medium uppercase tracking-wide"
                style={{ 
                  backgroundColor: 'transparent',
                  color: '#F1F1F1',
                  border: '2px solid #F1F1F1',
                  borderRadius: '0px',
                  fontFamily: 'Neue Einstellung, sans-serif',
                  letterSpacing: '0.5px'
                }}
              >
                POST IT NOW
              </Button>
            </Link>
            <Link href="/calendar">
              <Button 
                className="px-8 py-3 font-medium uppercase tracking-wide"
                style={{ 
                  backgroundColor: 'transparent',
                  color: '#F1F1F1',
                  border: '2px solid #F1F1F1',
                  borderRadius: '0px',
                  fontFamily: 'Neue Einstellung, sans-serif',
                  letterSpacing: '0.5px'
                }}
              >
                SAVE TO CALENDAR
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Tool Hub Section */}
      <section id="tools-section" className="relative py-20 px-6" style={{ backgroundColor: '#171719' }}>
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{
            backgroundImage: 'url(https://i.postimg.cc/wxc1QX0g/3.png)'
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto">
          <h2 
            className="text-4xl font-normal text-center mb-16"
            style={{ 
              fontFamily: 'Cormorant Garamond, serif',
              color: '#F1F1F1'
            }}
          >
            Your Tools
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {/* Studio Access - Free */}
              <Card 
                className="bg-white hover:scale-[1.03] transition-transform duration-300 animate-fadeInUp"
                style={{ border: '1px solid #B5B5B3', borderRadius: '0px' }}
              >
                <CardContent className="p-8">
                  <div className="text-center space-y-6">
                    <div 
                      className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
                      style={{ backgroundColor: '#F1F1F1' }}
                    >
                      <Camera className="w-8 h-8" style={{ color: '#171719' }} />
                    </div>
                    <div>
                      <h3 
                        className="text-xl font-normal mb-3 uppercase tracking-wide" 
                        style={{ fontFamily: 'Cormorant Garamond, serif', color: '#171719' }}
                      >
                        Your Studio
                      </h3>
                      <p 
                        className="text-sm leading-relaxed" 
                        style={{ fontFamily: 'Inter, sans-serif', fontWeight: '300', color: '#4C4B4B' }}
                      >
                        Upload, edit, and enhance your selfies with AI-powered tools.
                      </p>
                    </div>
                    <Link href="/studio">
                      <Button 
                        className="w-full min-h-[56px] text-base uppercase tracking-wide transition-all duration-300"
                        style={{ 
                          backgroundColor: 'transparent',
                          color: '#171719',
                          border: '1px solid #171719',
                          fontFamily: 'Neue Einstellung, sans-serif',
                          borderRadius: '0px'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#171719';
                          e.currentTarget.style.color = 'white';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = '#171719';
                        }}
                      >
                        START IN STUDIO
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Sandra AI - Starter Tier */}
              <TierAccessGuard 
                requiredTier="starter"
                fallbackComponent={
                  <Card 
                    className="bg-white hover:scale-[1.03] transition-transform duration-300 animate-fadeInUp animate-delay-100 relative"
                    style={{ border: '1px solid #B5B5B3', borderRadius: '0px' }}
                  >
                    <div className="absolute top-4 right-4 z-10">
                      <Badge 
                        className="uppercase tracking-wide"
                        style={{ 
                          backgroundColor: '#B5B5B3',
                          color: '#171719',
                          fontFamily: 'Neue Einstellung, sans-serif',
                          fontSize: '12px',
                          letterSpacing: '0.5px',
                          borderRadius: '0px',
                          border: 'none'
                        }}
                      >
                        <Lock className="w-3 h-3 mr-1" />
                        PRO
                      </Badge>
                    </div>
                    <CardContent className="p-8" style={{ opacity: '0.6' }}>
                      <div className="text-center space-y-6">
                        <div 
                          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
                          style={{ backgroundColor: '#F1F1F1' }}
                        >
                          <MessageCircle className="w-8 h-8" style={{ color: '#171719' }} />
                        </div>
                        <div>
                          <h3 
                            className="text-xl font-normal mb-3 uppercase tracking-wide" 
                            style={{ fontFamily: 'Cormorant Garamond, serif', color: '#171719' }}
                          >
                            Sandra AI
                          </h3>
                          <p 
                            className="text-sm leading-relaxed" 
                            style={{ fontFamily: 'Inter, sans-serif', fontWeight: '300', color: '#4C4B4B' }}
                          >
                            Get personalized content strategy and brand guidance.
                          </p>
                        </div>
                        <div className="group">
                          <p 
                            className="text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            style={{ 
                              fontFamily: 'Neue Einstellung, sans-serif',
                              color: '#171719',
                              letterSpacing: '0.5px',
                              textTransform: 'uppercase'
                            }}
                          >
                            Unlock This Tool
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                }
              >
                <Card 
                  className="bg-white hover:scale-[1.03] transition-transform duration-300 animate-fadeInUp animate-delay-100"
                  style={{ border: '1px solid #B5B5B3', borderRadius: '0px' }}
                >
                  <CardContent className="p-8">
                    <div className="text-center space-y-6">
                      <div 
                        className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
                        style={{ backgroundColor: '#F1F1F1' }}
                      >
                        <MessageCircle className="w-8 h-8" style={{ color: '#171719' }} />
                      </div>
                      <div>
                        <h3 
                          className="text-xl font-normal mb-3 uppercase tracking-wide" 
                          style={{ fontFamily: 'Cormorant Garamond, serif', color: '#171719' }}
                        >
                          Sandra AI
                        </h3>
                        <p 
                          className="text-sm leading-relaxed" 
                          style={{ fontFamily: 'Inter, sans-serif', fontWeight: '300', color: '#4C4B4B' }}
                        >
                          Get personalized content strategy and brand guidance.
                        </p>
                      </div>
                      <Link href="/sandra-ai">
                        <Button 
                          className="w-full min-h-[56px] text-base uppercase tracking-wide transition-all duration-300"
                          style={{ 
                            backgroundColor: 'transparent',
                            color: '#171719',
                            border: '1px solid #171719',
                            fontFamily: 'Neue Einstellung, sans-serif',
                            borderRadius: '0px'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#171719';
                            e.currentTarget.style.color = 'white';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = '#171719';
                          }}
                        >
                          ASK SANDRA
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </TierAccessGuard>

              {/* Weekly Planner - Starter Tier */}
              <TierAccessGuard 
                requiredTier="starter"
                fallbackComponent={
                  <Card 
                    className="bg-white hover:scale-[1.03] transition-transform duration-300 animate-fadeInUp animate-delay-200 relative"
                    style={{ border: '1px solid #B5B5B3', borderRadius: '0px' }}
                  >
                    <div className="absolute top-4 right-4 z-10">
                      <Badge 
                        className="uppercase tracking-wide"
                        style={{ 
                          backgroundColor: '#B5B5B3',
                          color: '#171719',
                          fontFamily: 'Neue Einstellung, sans-serif',
                          fontSize: '12px',
                          letterSpacing: '0.5px',
                          borderRadius: '0px',
                          border: 'none'
                        }}
                      >
                        <Lock className="w-3 h-3 mr-1" />
                        PRO
                      </Badge>
                    </div>
                    <CardContent className="p-8" style={{ opacity: '0.6' }}>
                      <div className="text-center space-y-6">
                        <div 
                          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
                          style={{ backgroundColor: '#F1F1F1' }}
                        >
                          <Calendar className="w-8 h-8" style={{ color: '#171719' }} />
                        </div>
                        <div>
                          <h3 
                            className="text-xl font-normal mb-3 uppercase tracking-wide" 
                            style={{ fontFamily: 'Cormorant Garamond, serif', color: '#171719' }}
                          >
                            Weekly Planner
                          </h3>
                          <p 
                            className="text-sm leading-relaxed" 
                            style={{ fontFamily: 'Inter, sans-serif', fontWeight: '300', color: '#4C4B4B' }}
                          >
                            Track your posting schedule and consistency.
                          </p>
                        </div>
                        <div className="group">
                          <p 
                            className="text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            style={{ 
                              fontFamily: 'Neue Einstellung, sans-serif',
                              color: '#171719',
                              letterSpacing: '0.5px',
                              textTransform: 'uppercase'
                            }}
                          >
                            Unlock This Tool
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                }
              >
                <Card 
                  className="bg-white hover:scale-[1.03] transition-transform duration-300 animate-fadeInUp animate-delay-200"
                  style={{ border: '1px solid #B5B5B3', borderRadius: '0px' }}
                >
                  <CardContent className="p-8">
                    <div className="text-center space-y-6">
                      <div 
                        className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
                        style={{ backgroundColor: '#F1F1F1' }}
                      >
                        <Calendar className="w-8 h-8" style={{ color: '#171719' }} />
                      </div>
                      <div>
                        <h3 
                          className="text-xl font-normal mb-3 uppercase tracking-wide" 
                          style={{ fontFamily: 'Cormorant Garamond, serif', color: '#171719' }}
                        >
                          Weekly Planner
                        </h3>
                        <p 
                          className="text-sm leading-relaxed" 
                          style={{ fontFamily: 'Inter, sans-serif', fontWeight: '300', color: '#4C4B4B' }}
                        >
                          Track your posting schedule and consistency.
                        </p>
                      </div>
                      <Link href="/planner">
                        <Button 
                          className="w-full min-h-[56px] text-base uppercase tracking-wide transition-all duration-300"
                          style={{ 
                            backgroundColor: 'transparent',
                            color: '#171719',
                            border: '1px solid #171719',
                            fontFamily: 'Neue Einstellung, sans-serif',
                            borderRadius: '0px'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#171719';
                            e.currentTarget.style.color = 'white';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = '#171719';
                          }}
                        >
                          OPEN PLANNER
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </TierAccessGuard>

              {/* Monthly Drops - Branded Tier */}
              <TierAccessGuard 
                requiredTier="branded"
                fallbackComponent={
                  <Card 
                    className="bg-white hover:scale-[1.03] transition-transform duration-300 animate-fadeInUp animate-delay-300 relative"
                    style={{ border: '1px solid #B5B5B3', borderRadius: '0px' }}
                  >
                    <div className="absolute top-4 right-4 z-10">
                      <Badge 
                        className="uppercase tracking-wide"
                        style={{ 
                          backgroundColor: '#B5B5B3',
                          color: '#171719',
                          fontFamily: 'Neue Einstellung, sans-serif',
                          fontSize: '12px',
                          letterSpacing: '0.5px',
                          borderRadius: '0px',
                          border: 'none'
                        }}
                      >
                        <Lock className="w-3 h-3 mr-1" />
                        PRO
                      </Badge>
                    </div>
                    <CardContent className="p-8" style={{ opacity: '0.6' }}>
                      <div className="text-center space-y-6">
                        <div 
                          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
                          style={{ backgroundColor: '#F1F1F1' }}
                        >
                          <Download className="w-8 h-8" style={{ color: '#171719' }} />
                        </div>
                        <div>
                          <h3 
                            className="text-xl font-normal mb-3 uppercase tracking-wide" 
                            style={{ fontFamily: 'Cormorant Garamond, serif', color: '#171719' }}
                          >
                            Monthly Drops
                          </h3>
                          <p 
                            className="text-sm leading-relaxed" 
                            style={{ fontFamily: 'Inter, sans-serif', fontWeight: '300', color: '#4C4B4B' }}
                          >
                            Fresh content templates and brand resources.
                          </p>
                        </div>
                        <div className="group">
                          <p 
                            className="text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            style={{ 
                              fontFamily: 'Neue Einstellung, sans-serif',
                              color: '#171719',
                              letterSpacing: '0.5px',
                              textTransform: 'uppercase'
                            }}
                          >
                            Unlock This Tool
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                }
              >
                <Card 
                  className="bg-white hover:scale-[1.03] transition-transform duration-300 animate-fadeInUp animate-delay-300"
                  style={{ border: '1px solid #B5B5B3', borderRadius: '0px' }}
                >
                  <CardContent className="p-8">
                    <div className="text-center space-y-6">
                      <div 
                        className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
                        style={{ backgroundColor: '#F1F1F1' }}
                      >
                        <Download className="w-8 h-8" style={{ color: '#171719' }} />
                      </div>
                      <div>
                        <h3 
                          className="text-xl font-normal mb-3 uppercase tracking-wide" 
                          style={{ fontFamily: 'Cormorant Garamond, serif', color: '#171719' }}
                        >
                          Monthly Drops
                        </h3>
                        <p 
                          className="text-sm leading-relaxed" 
                          style={{ fontFamily: 'Inter, sans-serif', fontWeight: '300', color: '#4C4B4B' }}
                        >
                          Fresh content templates and brand resources.
                        </p>
                      </div>
                      <Link href="/drops">
                        <Button 
                          className="w-full min-h-[56px] text-base uppercase tracking-wide transition-all duration-300"
                          style={{ 
                            backgroundColor: 'transparent',
                            color: '#171719',
                            border: '1px solid #171719',
                            fontFamily: 'Neue Einstellung, sans-serif',
                            borderRadius: '0px'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#171719';
                            e.currentTarget.style.color = 'white';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = '#171719';
                          }}
                        >
                          VIEW THIS MONTH'S DROP
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </TierAccessGuard>

              {/* Content Vault - Branded Tier */}
              <TierAccessGuard 
                requiredTier="branded"
                fallbackComponent={
                  <Card 
                    className="bg-white hover:scale-[1.03] transition-transform duration-300 animate-fadeInUp animate-delay-400 relative"
                    style={{ border: '1px solid #B5B5B3', borderRadius: '0px' }}
                  >
                    <div className="absolute top-4 right-4 z-10">
                      <Badge 
                        className="uppercase tracking-wide"
                        style={{ 
                          backgroundColor: '#B5B5B3',
                          color: '#171719',
                          fontFamily: 'Neue Einstellung, sans-serif',
                          fontSize: '12px',
                          letterSpacing: '0.5px',
                          borderRadius: '0px',
                          border: 'none'
                        }}
                      >
                        <Lock className="w-3 h-3 mr-1" />
                        PRO
                      </Badge>
                    </div>
                    <CardContent className="p-8" style={{ opacity: '0.6' }}>
                      <div className="text-center space-y-6">
                        <div 
                          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
                          style={{ backgroundColor: '#F1F1F1' }}
                        >
                          <FileText className="w-8 h-8" style={{ color: '#171719' }} />
                        </div>
                        <div>
                          <h3 
                            className="text-xl font-normal mb-3 uppercase tracking-wide" 
                            style={{ fontFamily: 'Cormorant Garamond, serif', color: '#171719' }}
                          >
                            Content Vault
                          </h3>
                          <p 
                            className="text-sm leading-relaxed" 
                            style={{ fontFamily: 'Inter, sans-serif', fontWeight: '300', color: '#4C4B4B' }}
                          >
                            Access templates and saved content pieces.
                          </p>
                        </div>
                        <div className="group">
                          <p 
                            className="text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            style={{ 
                              fontFamily: 'Neue Einstellung, sans-serif',
                              color: '#171719',
                              letterSpacing: '0.5px',
                              textTransform: 'uppercase'
                            }}
                          >
                            Unlock This Tool
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                }
              >
                <Card 
                  className="bg-white hover:scale-[1.03] transition-transform duration-300 animate-fadeInUp animate-delay-400"
                  style={{ border: '1px solid #B5B5B3', borderRadius: '0px' }}
                >
                  <CardContent className="p-8">
                    <div className="text-center space-y-6">
                      <div 
                        className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
                        style={{ backgroundColor: '#F1F1F1' }}
                      >
                        <FileText className="w-8 h-8" style={{ color: '#171719' }} />
                      </div>
                      <div>
                        <h3 
                          className="text-xl font-normal mb-3 uppercase tracking-wide" 
                          style={{ fontFamily: 'Cormorant Garamond, serif', color: '#171719' }}
                        >
                          Content Vault
                        </h3>
                        <p 
                          className="text-sm leading-relaxed" 
                          style={{ fontFamily: 'Inter, sans-serif', fontWeight: '300', color: '#4C4B4B' }}
                        >
                          Access templates and saved content pieces.
                        </p>
                      </div>
                      <Link href="/content-vault">
                        <Button 
                          className="w-full min-h-[56px] text-base uppercase tracking-wide transition-all duration-300"
                          style={{ 
                            backgroundColor: 'transparent',
                            color: '#171719',
                            border: '1px solid #171719',
                            fontFamily: 'Neue Einstellung, sans-serif',
                            borderRadius: '0px'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#171719';
                            e.currentTarget.style.color = 'white';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = '#171719';
                          }}
                        >
                          EXPLORE VAULT
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </TierAccessGuard>

              {/* Course Access - VIP Tier */}
              <TierAccessGuard 
                requiredTier="vip"
                fallbackComponent={
                  <Card 
                    className="bg-white hover:scale-[1.03] transition-transform duration-300 animate-fadeInUp animate-delay-500 relative"
                    style={{ border: '1px solid #B5B5B3', borderRadius: '0px' }}
                  >
                    <div className="absolute top-4 right-4 z-10">
                      <Badge 
                        className="uppercase tracking-wide"
                        style={{ 
                          backgroundColor: '#171719',
                          color: 'white',
                          fontFamily: 'Neue Einstellung, sans-serif',
                          fontSize: '12px',
                          letterSpacing: '0.5px',
                          borderRadius: '0px',
                          border: 'none'
                        }}
                      >
                        <Crown className="w-3 h-3 mr-1" />
                        VIP
                      </Badge>
                    </div>
                    <CardContent className="p-8" style={{ opacity: '0.6' }}>
                      <div className="text-center space-y-6">
                        <div 
                          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
                          style={{ backgroundColor: '#F1F1F1' }}
                        >
                          <Play className="w-8 h-8" style={{ color: '#171719' }} />
                        </div>
                        <div>
                          <h3 
                            className="text-xl font-normal mb-3 uppercase tracking-wide" 
                            style={{ fontFamily: 'Cormorant Garamond, serif', color: '#171719' }}
                          >
                            Brand Training
                          </h3>
                          <p 
                            className="text-sm leading-relaxed" 
                            style={{ fontFamily: 'Inter, sans-serif', fontWeight: '300', color: '#4C4B4B' }}
                          >
                            Access your course content and brand training.
                          </p>
                        </div>
                        <div className="group">
                          <p 
                            className="text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            style={{ 
                              fontFamily: 'Neue Einstellung, sans-serif',
                              color: '#171719',
                              letterSpacing: '0.5px',
                              textTransform: 'uppercase'
                            }}
                          >
                            Unlock This Tool
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                }
              >
                <Card 
                  className="bg-white hover:scale-[1.03] transition-transform duration-300 animate-fadeInUp animate-delay-500"
                  style={{ border: '1px solid #B5B5B3', borderRadius: '0px' }}
                >
                  <CardContent className="p-8">
                    <div className="text-center space-y-6">
                      <div 
                        className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
                        style={{ backgroundColor: '#F1F1F1' }}
                      >
                        <Play className="w-8 h-8" style={{ color: '#171719' }} />
                      </div>
                      <div>
                        <h3 
                          className="text-xl font-normal mb-3 uppercase tracking-wide" 
                          style={{ fontFamily: 'Cormorant Garamond, serif', color: '#171719' }}
                        >
                          Brand Training
                        </h3>
                        <p 
                          className="text-sm leading-relaxed" 
                          style={{ fontFamily: 'Inter, sans-serif', fontWeight: '300', color: '#4C4B4B' }}
                        >
                          Access your course content and brand training.
                        </p>
                      </div>
                      <Link href="/courses">
                        <Button 
                          className="w-full min-h-[56px] text-base uppercase tracking-wide transition-all duration-300"
                          style={{ 
                            backgroundColor: 'transparent',
                            color: '#171719',
                            border: '1px solid #171719',
                            fontFamily: 'Neue Einstellung, sans-serif',
                            borderRadius: '0px'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#171719';
                            e.currentTarget.style.color = 'white';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = '#171719';
                          }}
                        >
                          RESUME COURSE
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </TierAccessGuard>
            </div>

          {/* Aesthetic Widgets */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Moodboard Preview */}
            <Card 
              className="border transition-all duration-300"
              style={{ 
                backgroundColor: '#171719',
                borderColor: '#4C4B4B',
                borderRadius: '0px'
              }}
            >
              <CardContent className="p-6">
                <h3 
                  className="text-2xl font-normal mb-6"
                  style={{ 
                    fontFamily: 'Cormorant Garamond, serif',
                    color: '#F1F1F1'
                  }}
                >
                  This Week's Vibe
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    'https://i.postimg.cc/rwgGZ6jy/flatlay-overlay-Url.png',
                    'https://i.postimg.cc/PxvRkfVQ/story-Image1.png',
                    'https://i.postimg.cc/dQ5q8mbb/22.png'
                  ].map((image, index) => (
                    <div 
                      key={index}
                      className="aspect-square bg-cover bg-center"
                      style={{
                        backgroundImage: `url(${image})`,
                        borderRadius: '0px'
                      }}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Daily Motivation Card */}
            <Card 
              className="relative overflow-hidden border transition-all duration-300"
              style={{ 
                backgroundColor: '#171719',
                borderColor: '#4C4B4B',
                borderRadius: '0px'
              }}
            >
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-20"
                style={{
                  backgroundImage: 'url(https://i.postimg.cc/d0MV1PLq/IMG-8465-jpg.jpg)'
                }}
              />
              <CardContent className="relative z-10 p-6">
                <h3 
                  className="text-2xl font-normal mb-4"
                  style={{ 
                    fontFamily: 'Cormorant Garamond, serif',
                    color: '#F1F1F1'
                  }}
                >
                  Daily Power
                </h3>
                <p 
                  className="text-lg italic mb-4"
                  style={{ 
                    fontFamily: 'Cormorant Garamond, serif',
                    color: '#F1F1F1',
                    opacity: '0.9'
                  }}
                >
                  "Stop hiding. Your empire is waiting for your face to be its foundation."
                </p>
                <div className="flex items-center mt-4">
                  <CheckCircle2 className="w-4 h-4 mr-2" style={{ color: '#F1F1F1' }} />
                  <span 
                    className="text-sm uppercase tracking-wide"
                    style={{ 
                      fontFamily: 'Neue Einstellung, sans-serif',
                      color: '#F1F1F1',
                      opacity: '0.8'
                    }}
                  >
                    Powered by Sandra AI
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Weekly Planner */}
      <section className="relative py-20 px-6">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://i.postimg.cc/Fs2XZPDB/78.png)'
          }}
        />
        <div className="absolute inset-0" style={{ backgroundColor: 'rgba(241, 241, 241, 0.9)' }} />

        <div className="relative z-10 max-w-6xl mx-auto">
          <h2 
            className="text-4xl font-normal text-center mb-16"
            style={{ 
              fontFamily: 'Cormorant Garamond, serif',
              color: '#171719'
            }}
          >
            This Week's Content
          </h2>

          <div className="grid grid-cols-7 gap-4">
            {weeklyPlan.map((day, index) => (
              <div 
                key={day.day}
                className="group cursor-pointer"
              >
                <Card 
                  className="border transition-all duration-300 h-32"
                  style={{ 
                    backgroundColor: '#F1F1F1',
                    borderColor: day.status === 'planned' ? '#171719' : '#B5B5B3',
                    borderRadius: '0px'
                  }}
                >
                  <CardContent className="p-4 h-full flex flex-col justify-between">
                    <div className="text-center">
                      <h4 
                        className="text-sm font-medium uppercase tracking-wide mb-2"
                        style={{ 
                          fontFamily: 'Neue Einstellung, sans-serif',
                          color: '#171719'
                        }}
                      >
                        {day.day}
                      </h4>
                      <div 
                        className="w-3 h-3 rounded-full mx-auto"
                        style={{ 
                          backgroundColor: day.status === 'planned' ? '#171719' : '#B5B5B3'
                        }}
                      />
                    </div>

                    {day.status === 'planned' && (
                      <p 
                        className="text-xs leading-tight opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ 
                          fontFamily: 'Neue Einstellung, sans-serif',
                          color: '#4C4B4B'
                        }}
                      >
                        {day.content}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/calendar">
              <Button 
                className="px-8 py-3 font-medium uppercase tracking-wide"
                style={{ 
                  backgroundColor: 'transparent',
                  color: '#171719',
                  border: '2px solid #171719',
                  borderRadius: '0px',
                  fontFamily: 'Neue Einstellung, sans-serif',
                  letterSpacing: '0.5px'
                }}
              >
                MANAGE CALENDAR
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer Progress Bar */}
      <section className="relative py-12" style={{ backgroundColor: '#171719' }}>
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{
            backgroundImage: 'url(https://i.postimg.cc/Xqq62mRT/48.png)'
          }}
        />

        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-center space-x-12">
            {offerLadderCards.map((card, index) => (
              <div key={card.id} className="flex items-center">
                <div className="text-center">
                  <div 
                    className={`w-12 h-12 rounded-full border-2 flex items-center justify-center mb-2 ${
                      card.status === 'purchased' || card.status === 'open' 
                        ? 'border-[#F1F1F1] bg-[#F1F1F1]' 
                        : 'border-[#B5B5B3]'
                    }`}
                  >
                    {card.status === 'purchased' ? (
                      <CheckCircle2 className="w-6 h-6" style={{ color: '#171719' }} />
                    ) : card.id === 'vip' ? (
                      <Crown className="w-6 h-6" style={{ color: '#171719' }} />
                    ) : (
                      <div 
                        className="w-6 h-6 rounded-full"
                        style={{ backgroundColor: card.status === 'open' ? '#171719' : '#B5B5B3' }}
                      />
                    )}
                  </div>
                  <p 
                    className="text-xs uppercase tracking-wide"
                    style={{ 
                      fontFamily: 'Neue Einstellung, sans-serif',
                      color: card.status === 'purchased' || card.status === 'open' ? '#F1F1F1' : '#B5B5B3'
                    }}
                  >
                    {card.title.split(' ')[0]}
                  </p>
                </div>

                {index < offerLadderCards.length - 1 && (
                  <div 
                    className="w-16 h-0.5 mx-6"
                    style={{ backgroundColor: '#B5B5B3' }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
