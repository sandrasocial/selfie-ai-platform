'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from '@/app/components/ui/button';
import { Badge } from "@/app/components/ui/badge";
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
  Bot,
  User,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { useOnboardingStatus } from '@/hooks/useProfile';

interface UserData {
  id: string;
  email: string;
  tier: 'free' | 'starter' | 'branded' | 'vip';
  created_at: string;
  subscription_status?: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();
  const { hasProfile, isComplete, completionPercentage, profile, loading: profileLoading } = useOnboardingStatus();

  useEffect(() => {
    async function getUser() {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        
        if (authUser) {
          // Get user profile data
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authUser.id)
            .single();

          setUser({
            id: authUser.id,
            email: authUser.email || '',
            tier: profile?.tier || 'free',
            created_at: authUser.created_at,
            subscription_status: profile?.subscription_status
          });
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    }

    getUser();
  }, [supabase]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-100 flex items-center justify-center">
        <div className="animate-pulse text-rose-600">Loading your dashboard...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Required</CardTitle>
            <CardDescription>Please sign in to access your dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/auth/login">
              <Button className="w-full">Sign In</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const offerLadderCards = [
    {
      id: 'freebie',
      title: 'Free Guide',
      subtitle: 'Show Your Face™',
      tagline: 'Start showing up with confidence—even if you\'ve been hiding.',
      cta: 'Download Guide',
      link: '/freebie/selfie-guide',
      status: 'open',
      bgImage: '/images/free-guide-bg.jpg',
      tier: 'free',
      price: 'FREE'
    },
    {
      id: 'starter-kit',
      title: 'Selfie Starter Kit',
      subtitle: 'Essential Tools',
      tagline: 'Master confident selfies that build your personal brand.',
      cta: user.tier !== 'free' ? 'Access Kit' : 'Unlock Kit',
      link: user.tier !== 'free' ? '/tools/starter-kit' : '/products/starter-kit',
      status: user.tier !== 'free' ? 'open' : 'locked',
      bgImage: '/images/starter-kit-bg.jpg',
      tier: 'starter',
      price: '$67'
    },
    {
      id: 'branded-by-selfie',
      title: 'Branded by Selfie',
      subtitle: 'Complete Brand Kit',
      tagline: 'Build a cohesive brand that attracts your dream clients.',
      cta: 'Access Studio',
      link: '/studio',
      status: ['branded', 'vip'].includes(user.tier) ? 'open' : 'locked',
      bgImage: '/images/branded-bg.jpg',
      tier: 'branded',
      price: '$397'
    },
    {
      id: 'vip',
      title: 'VIP Experience',
      subtitle: 'Personal Brand Mastery',
      tagline: 'White-glove service to build your empire.',
      cta: 'Enter VIP',
      link: '/vip',
      status: user.tier === 'vip' ? 'open' : 'locked',
      bgImage: '/images/vip-bg.jpg',
      tier: 'vip',
      price: 'Apply'
    }
  ];

  const quickAccessTools = [
    {
      title: 'Photo Vault',
      description: 'Upload, organize, and enhance your photos',
      icon: Camera,
      href: '/tools/photo-vault',
      tier: 'starter',
      color: 'bg-pink-500'
    },
    {
      title: 'Photo Studio',
      description: 'AI-powered photo editing and enhancement',
      icon: Edit3,
      href: '/tools/photo-studio',
      tier: 'starter',
      color: 'bg-blue-500'
    },
    {
      title: 'Caption Generator',
      description: 'AI-powered captions that convert',
      icon: MessageCircle,
      href: '/tools/caption-generator',
      tier: 'free',
      color: 'bg-purple-500'
    },
    {
      title: 'Brand Kit',
      description: 'Colors, fonts, and style guide',
      icon: Sparkles,
      href: '/tools/brand-kit',
      tier: 'branded',
      color: 'bg-rose-500'
    },
    {
      title: 'Content Calendar',
      description: 'Plan and schedule your content',
      icon: Calendar,
      href: '/tools/content-calendar',
      tier: 'starter',
      color: 'bg-indigo-500'
    },
    {
      title: 'Sandra AI Chat',
      description: 'Personal brand coaching',
      icon: Bot,
      href: '/chat/sandra',
      tier: 'branded',
      color: 'bg-emerald-500'
    },
    {
      title: 'Analytics',
      description: 'Track your growth and engagement',
      icon: TrendingUp,
      href: '/tools/analytics',
      tier: 'starter',
      color: 'bg-orange-500'
    }
  ];

  const getTierAccess = (toolTier: string) => {
    const tierLevels = { free: 0, starter: 1, branded: 2, vip: 3 };
    const userLevel = tierLevels[user.tier as keyof typeof tierLevels];
    const toolLevel = tierLevels[toolTier as keyof typeof tierLevels];
    return userLevel >= toolLevel;
  };

  const getTierBadge = (tier: string) => {
    const badges = {
      free: { label: 'Free', color: 'bg-gray-100 text-gray-800' },
      starter: { label: 'Starter Kit', color: 'bg-blue-100 text-blue-800' },
      branded: { label: 'Branded', color: 'bg-rose-100 text-rose-800' },
      vip: { label: 'VIP', color: 'bg-purple-100 text-purple-800' }
    };
    return badges[tier as keyof typeof badges] || badges.free;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-100">
      {/* Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                Selfie AI
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge className={getTierBadge(user.tier).color}>
                {getTierBadge(user.tier).label}
              </Badge>
              <Button variant="outline" size="sm" onClick={() => supabase.auth.signOut()}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back
          </h1>
          <p className="text-gray-600">
            Ready to create content that converts? Let's make today amazing.
          </p>
        </div>

        {/* Brand Profile Onboarding */}
        {!profileLoading && !isComplete && (
          <div className="mb-8">
            <Card className="border-2 border-rose-200 bg-gradient-to-r from-rose-50 to-pink-50">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-rose-100 rounded-lg">
                    <User className="h-5 w-5 text-rose-600" />
                  </div>
                  <div>
                    <CardTitle className="text-rose-900">Complete Your Brand Profile</CardTitle>
                    <CardDescription className="text-rose-700">
                      {hasProfile 
                        ? `${completionPercentage}% complete - Unlock personalized AI tools` 
                        : 'Get AI-powered content tailored to your unique brand'
                      }
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-rose-600">
                    {hasProfile 
                      ? 'Complete your profile to unlock fully personalized AI recommendations'
                      : 'Just 4 quick steps to get your personalized AI experience'
                    }
                  </div>
                  <Link href="/onboarding/brand-hub">
                    <Button className="bg-rose-600 hover:bg-rose-700 text-white">
                      {hasProfile ? 'Complete Profile' : 'Start Setup'}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
                {hasProfile && completionPercentage > 0 && (
                  <div className="mt-4">
                    <div className="w-full bg-rose-200 rounded-full h-2">
                      <div 
                        className="bg-rose-600 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${completionPercentage}%` }}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Personalized Recommendations */}
        {isComplete && profile && (
          <div className="mb-8">
            <Card className="border-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Sparkles className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-green-900">
                      Personalized for {profile.visual_aesthetic || 'Your Brand'}
                    </CardTitle>
                    <CardDescription className="text-green-700">
                      AI tools now know your {profile.tone_voice?.toLowerCase()} voice and {profile.industry?.toLowerCase()} focus
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-green-600">
                  All your AI tools are now personalized to your brand mission: "{profile.brand_mission?.slice(0, 80)}..."
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Quick Access Tools */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Quick Access {isComplete && <Badge variant="secondary" className="ml-2">Personalized</Badge>}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickAccessTools.map((tool) => {
              const hasAccess = getTierAccess(tool.tier);
              const Icon = tool.icon;
              const isPersonalized = isComplete && ['Caption Generator', 'Brand Kit', 'Sandra AI Chat'].includes(tool.title);
              
              return (
                <Card key={tool.title} className={`transition-all duration-200 hover:shadow-lg ${hasAccess ? 'cursor-pointer hover:scale-105' : 'opacity-60'}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className={`p-2 rounded-lg ${tool.color} text-white flex items-center gap-2`}>
                        <Icon className="h-5 w-5" />
                        {isPersonalized && <Sparkles className="h-3 w-3" />}
                      </div>
                      {!hasAccess && <Lock className="h-4 w-4 text-gray-400" />}
                    </div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {tool.title}
                      {isPersonalized && (
                        <Badge variant="secondary" className="text-xs">
                          AI
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription>
                      {isPersonalized 
                        ? `${tool.description} - tailored to your ${profile?.visual_aesthetic?.toLowerCase() || 'brand'} style`
                        : tool.description
                      }
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {hasAccess ? (
                      <Link href={tool.href}>
                        <Button className="w-full" size="sm">
                          {isPersonalized ? 'Open Personalized Tool' : 'Open Tool'}
                        </Button>
                      </Link>
                    ) : (
                      <Button variant="outline" className="w-full" size="sm" disabled>
                        Upgrade to Access
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Offer Ladder */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Journey</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {offerLadderCards.map((offer, index) => (
              <Card key={offer.id} className={`relative overflow-hidden transition-all duration-200 ${offer.status === 'open' ? 'hover:shadow-xl cursor-pointer' : 'opacity-70'}`}>
                <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 to-pink-500/10" />
                <CardHeader className="relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="text-xs">
                      {offer.price}
                    </Badge>
                    {offer.status === 'open' ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <Lock className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                  <CardTitle className="text-lg">{offer.title}</CardTitle>
                  <CardDescription className="text-sm font-medium text-rose-600">
                    {offer.subtitle}
                  </CardDescription>
                  <CardDescription className="text-xs">
                    {offer.tagline}
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative z-10">
                  {offer.status === 'open' ? (
                    <Link href={offer.link}>
                      <Button className="w-full" size="sm">
                        {offer.cta}
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  ) : (
                    <Button variant="outline" className="w-full" size="sm">
                      Coming Soon
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Your latest actions and achievements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-medium text-sm">Welcome to Selfie AI</p>
                  <p className="text-xs text-gray-600">Account created successfully</p>
                </div>
              </div>
              {user.tier !== 'free' && (
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <Star className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="font-medium text-sm">Tier Upgrade</p>
                    <p className="text-xs text-gray-600">Now have access to {getTierBadge(user.tier).label} features</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                <Sparkles className="h-5 w-5 text-purple-500" />
                <div className="flex-1">
                  <p className="font-medium text-sm">See Personalization in Action</p>
                  <p className="text-xs text-gray-600">Demo how AI adapts to your unique brand</p>
                </div>
                <Link href="/personalization-demo">
                  <Button size="sm" variant="outline">
                    View Demo
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
