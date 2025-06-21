'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/app/components/ui/button';
import { 
  Camera, 
  Calendar, 
  Target, 
  Edit3, 
  FileText, 
  MessageCircle,
  CheckCircle2,
  Lock,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface OfferCard {
  id: string;
  title: string;
  subtitle: string;
  tagline: string;
  cta: string;
  link: string;
  status: 'open' | 'available' | 'purchased' | 'locked';
  bgImage?: string;
  cardStyle: 'light' | 'gray' | 'dark' | 'luxury';
}

interface Tool {
  name: string;
  link: string;
  icon: any;
  available: boolean;
}

interface WeekDay {
  day: string;
  content: string;
  status: 'planned' | 'completed' | 'empty';
}

export default function Dashboard() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [user, setUser] = useState<any>(null);
  const [userPurchases, setUserPurchases] = useState({
    starterKit: false,
    brandedBySelfie: false,
    vip: false
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/login');
        return;
      }

      setUser(user);
      
      // Check user purchases
      const { data: purchases } = await supabase
        .from('purchases')
        .select('product_id')
        .eq('user_id', user.id);

      if (purchases) {
        setUserPurchases({
          starterKit: purchases.some(p => p.product_id === 'starter-kit'),
          brandedBySelfie: purchases.some(p => p.product_id === 'branded-by-selfie'),
          vip: purchases.some(p => p.product_id === 'vip')
        });
      }
    } catch (error) {
      console.error('Error checking user:', error);
    } finally {
      setLoading(false);
    }
  };

  const offers: OfferCard[] = [
    {
      id: 'free-guide',
      title: 'Selfie Success Guide',
      subtitle: 'Free',
      tagline: 'Your quick-start guide to confident content',
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
      cta: userPurchases.starterKit ? 'Access Course' : 'Get the Kit',
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
      cta: userPurchases.brandedBySelfie ? 'Access Course' : 'Unlock Brand Builder',
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

  const tools: Tool[] = [
    { name: 'The Glow Check™', link: '/tools/glow-check', icon: Sparkles, available: true },
    { name: 'Feed Designer', link: '/studio/feed-designer', icon: Camera, available: true },
    { name: 'Caption Writer', link: '/studio/caption-generator', icon: Edit3, available: userPurchases.starterKit },
    { name: 'Content Calendar', link: '/calendar', icon: Calendar, available: userPurchases.brandedBySelfie },
    { name: 'Brand Voice Finder', link: '/workbooks', icon: FileText, available: userPurchases.brandedBySelfie },
    { name: 'Pose Coach', link: '/pose-coach', icon: Target, available: userPurchases.starterKit }
  ];

  const weeklyPlan: WeekDay[] = [
    { day: 'Mon', content: 'Morning selfie + power quote', status: 'planned' },
    { day: 'Tue', content: 'Behind-the-scenes story', status: 'planned' },
    { day: 'Wed', content: 'Educational carousel', status: 'empty' },
    { day: 'Thu', content: 'Client transformation', status: 'empty' },
    { day: 'Fri', content: 'Personal story post', status: 'empty' },
    { day: 'Sat', content: 'Weekend inspiration', status: 'empty' },
    { day: 'Sun', content: 'Weekly reflection', status: 'empty' }
  ];

  const userName = user?.user_metadata?.full_name || 'Queen';
  const dailyQuote = "Your brand is your mirror. Make it magnetic.";

  const getCardStyles = (cardStyle: string, status: string) => {
    const baseStyles = "relative overflow-hidden transition-all duration-500 cursor-pointer group h-80";

    switch (cardStyle) {
      case 'light':
        return `${baseStyles} border border-[#B5B5B3] hover:shadow-xl`;
      case 'gray':
        return `${baseStyles} border-2 ${status === 'purchased' ? 'border-green-500' : 'border-[#171719]'} hover:shadow-xl`;
      case 'dark':
        return `${baseStyles} bg-[#171719] text-[#F1F1F1] hover:shadow-xl`;
      case 'luxury':
        return `${baseStyles} bg-gradient-to-br from-[#171719] to-[#B5B5B3] text-[#F1F1F1] hover:shadow-xl`;
      default:
        return baseStyles;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F1F1F1] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#171719] mx-auto mb-4"></div>
          <p style={{ fontFamily: 'Inter, sans-serif' }}>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F1F1F1]">
      {/* Welcome Header */}
      <div className="bg-white border-b border-[#B5B5B3] px-6 py-32 relative overflow-hidden">
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
          01
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex justify-between items-start">
            <div>
              <h1 
                className="text-7xl mb-4 text-[#171719]"
                style={{ 
                  fontFamily: 'Bodoni Moda, serif',
                  fontWeight: '300',
                  letterSpacing: '-0.04em',
                  lineHeight: '0.9'
                }}
              >
                Hey gorgeous,<br />welcome back
              </h1>
              <p 
                className="text-2xl text-[#171719]/70 mt-6"
                style={{ 
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: '200'
                }}
              >
                What are we creating today?
              </p>
            </div>
            <Button
              onClick={() => router.push('/profile')}
              variant="outline"
              className="border-[#171719] text-[#171719] uppercase tracking-widest rounded-none"
            >
              PROFILE
            </Button>
          </div>
        </div>
      </div>

      {/* Your Journey Section */}
      <div className="px-6 py-32 relative">
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
        
        <div className="max-w-7xl mx-auto relative z-10">
          <h2 
            className="text-7xl mb-16 text-[#171719]"
            style={{ 
              fontFamily: 'Bodoni Moda, serif',
              fontWeight: '300',
              letterSpacing: '-0.04em',
              lineHeight: '0.9'
            }}
          >
            Your Journey
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {offers.map((offer) => (
              <Link key={offer.id} href={offer.link}>
                <div className={getCardStyles(offer.cardStyle, offer.status)}>
                  {offer.bgImage && (
                    <div 
                      className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity"
                      style={{
                        backgroundImage: `url(${offer.bgImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    />
                  )}
                  
                  <div className="relative z-10 p-6 h-full flex flex-col justify-between">
                    <div>
                      <h3 
                        className="text-2xl mb-1"
                        style={{ fontFamily: 'Bodoni Moda, serif' }}
                      >
                        {offer.title}
                      </h3>
                      <p 
                        className="text-lg mb-4 opacity-80"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      >
                        {offer.subtitle}
                      </p>
                      <p 
                        className="text-sm opacity-70"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      >
                        {offer.tagline}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between mt-6">
                      <span 
                        className="text-sm uppercase tracking-wider"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      >
                        {offer.cta}
                      </span>
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                    
                    {offer.status === 'purchased' && (
                      <CheckCircle2 className="absolute top-4 right-4 w-6 h-6 text-green-500" />
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Tools Section */}
      <div className="px-6 py-32 bg-white relative">
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
          03
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <h2 
            className="text-7xl mb-16 text-[#171719]"
            style={{ 
              fontFamily: 'Bodoni Moda, serif',
              fontWeight: '300',
              letterSpacing: '-0.04em',
              lineHeight: '0.9'
            }}
          >
            Your Tools
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tools.map((tool) => (
              <Link 
                key={tool.name} 
                href={tool.available ? tool.link : '#'}
                className={!tool.available ? 'cursor-not-allowed' : ''}
              >
                <div className={`
                  border border-[#B5B5B3] p-6 hover:border-[#171719] transition-colors
                  ${!tool.available ? 'opacity-50' : ''}
                `}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <tool.icon className="w-5 h-5 text-[#171719]" />
                      <span 
                        className="text-lg text-[#171719]"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      >
                        {tool.name}
                      </span>
                    </div>
                    {!tool.available && <Lock className="w-4 h-4 text-[#B5B5B3]" />}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Weekly Content Plan */}
      <div className="px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 
              className="text-3xl text-[#171719]"
              style={{ fontFamily: 'Bodoni Moda, serif' }}
            >
              This Week's Content
            </h2>
            <Link href="/calendar">
              <Button
                variant="outline"
                className="border-[#171719] text-[#171719] rounded-none"
              >
                Full Calendar
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-7 gap-2">
            {weeklyPlan.map((day) => (
              <div 
                key={day.day}
                className={`
                  p-4 text-center border
                  ${day.status === 'planned' ? 'border-[#171719] bg-[#171719] text-[#F1F1F1]' : 
                    day.status === 'completed' ? 'border-green-500 bg-green-50' : 
                    'border-[#B5B5B3] bg-white'}
                `}
              >
                <p 
                  className="text-sm font-medium mb-2"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  {day.day}
                </p>
                <p 
                  className="text-xs"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  {day.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-6 py-12 bg-[#171719]">
        <div className="max-w-7xl mx-auto text-center">
          <h2 
            className="text-3xl mb-8 text-[#F1F1F1]"
            style={{ fontFamily: 'Bodoni Moda, serif' }}
          >
            Ready to create today?
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/tools/glow-check">
              <Button
                className="bg-[#F1F1F1] text-[#171719] hover:bg-[#F1F1F1]/90 uppercase tracking-widest rounded-none"
              >
                TAKE SELFIE
              </Button>
            </Link>
            <Link href="/studio/feed-designer">
              <Button
                variant="outline"
                className="border-[#F1F1F1] text-[#F1F1F1] hover:bg-[#F1F1F1] hover:text-[#171719] uppercase tracking-widest rounded-none"
              >
                DESIGN FEED
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 