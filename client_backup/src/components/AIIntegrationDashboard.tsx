import React from 'react';
import { useProfile } from '@/contexts/ProfileContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MessageCircle, 
  Sparkles, 
  Camera, 
  FileText, 
  Calendar,
  Target,
  User,
  Crown,
  Palette,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import { SandraAIChat } from './SandraAIChat';
import { EnhancedContentGenerator } from './EnhancedContentGenerator';
import { ProfileAwarePoseCoach } from './ProfileAwarePoseCoach';

export function AIIntegrationDashboard() {
  const { profile, hasProfile } = useProfile();

  const aiFeatures = [
    {
      id: 'sandra-chat',
      title: 'Sandra AI Chat',
      description: 'Conversational AI coach that knows your brand inside and out',
      icon: MessageCircle,
      status: hasProfile ? 'personalized' : 'general',
      capabilities: [
        'Brand-aware conversations',
        'Strategic business advice',
        'Industry-specific guidance',
        'Goal-oriented recommendations'
      ]
    },
    {
      id: 'content-generator',
      title: 'Smart Content Generator',
      description: 'Create social media content aligned with your brand voice',
      icon: Sparkles,
      status: hasProfile ? 'personalized' : 'general',
      capabilities: [
        'Instagram captions',
        'Content strategies',
        'Hashtag collections',
        'Hook variations'
      ]
    },
    {
      id: 'pose-coach',
      title: 'AI Pose Coach',
      description: 'Photography guidance tailored to your visual aesthetic',
      icon: Camera,
      status: hasProfile ? 'personalized' : 'general',
      capabilities: [
        'Brand-aligned poses',
        'Aesthetic considerations',
        'Professional guidance',
        'Confidence building'
      ]
    },
    {
      id: 'workbook-generator',
      title: 'Personalized Workbooks',
      description: 'Custom learning materials with your brand context',
      icon: FileText,
      status: hasProfile ? 'personalized' : 'general',
      capabilities: [
        'Industry examples',
        'Brand integration',
        'PDF generation',
        'Progress tracking'
      ]
    }
  ];

  const FeatureCard = ({ feature }) => {
    const Icon = feature.icon;
    const isPersonalized = feature.status === 'personalized';
    
    return (
      <Card className={`relative ${isPersonalized ? 'border-primary/50 bg-primary/5' : ''}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${isPersonalized ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </div>
            </div>
            <Badge variant={isPersonalized ? 'default' : 'secondary'}>
              {isPersonalized ? 'Personalized' : 'General'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              {feature.capabilities.map((capability, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  <span>{capability}</span>
                </div>
              ))}
            </div>
            {isPersonalized && profile && (
              <div className="mt-4 p-3 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground mb-2">Personalized for:</p>
                <div className="flex flex-wrap gap-1">
                  {profile.industry && (
                    <Badge variant="outline" className="text-xs">{profile.industry}</Badge>
                  )}
                  {profile.toneVoice && (
                    <Badge variant="outline" className="text-xs">{profile.toneVoice}</Badge>
                  )}
                  {profile.visualAesthetic && (
                    <Badge variant="outline" className="text-xs">{profile.visualAesthetic}</Badge>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-light" style={{ fontFamily: 'Cormorant Garamond' }}>
                AI Integration Hub
              </h1>
              <p className="text-muted-foreground mt-2">
                Powerful AI tools that understand your brand and help you create consistently
              </p>
            </div>
            {hasProfile ? (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium">AI Personalization Active</p>
                  <p className="text-xs text-muted-foreground">
                    All features tailored to your {profile?.industry?.toLowerCase() || 'brand'}
                  </p>
                </div>
                <div className="p-2 bg-primary/10 rounded-full">
                  <Crown className="h-5 w-5 text-primary" />
                </div>
              </div>
            ) : (
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Complete Your Profile</p>
                    <p className="text-xs text-muted-foreground">Unlock personalized AI features</p>
                  </div>
                  <Button size="sm">
                    Get Started
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="sandra-chat">Sandra AI</TabsTrigger>
            <TabsTrigger value="content-gen">Content</TabsTrigger>
            <TabsTrigger value="pose-coach">Pose Coach</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Feature Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {aiFeatures.map((feature) => (
                <FeatureCard key={feature.id} feature={feature} />
              ))}
            </div>

            {/* Profile Impact */}
            {hasProfile && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Your Brand Profile Impact
                  </CardTitle>
                  <CardDescription>
                    How your profile enhances AI features across the platform
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Palette className="h-4 w-4 text-primary" />
                        <span className="font-medium">Visual Identity</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Your {profile?.visualAesthetic?.toLowerCase() || 'chosen'} aesthetic guides pose suggestions and visual content recommendations.
                      </p>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <MessageCircle className="h-4 w-4 text-primary" />
                        <span className="font-medium">Brand Voice</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Your {profile?.toneVoice?.toLowerCase() || 'unique'} tone shapes all generated content and Sandra AI conversations.
                      </p>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-primary" />
                        <span className="font-medium">Strategic Focus</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Your {profile?.industry || 'industry'} context ensures relevant examples and actionable advice.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-16 flex-col gap-2">
                <MessageCircle className="h-5 w-5" />
                <span className="text-xs">Ask Sandra</span>
              </Button>
              <Button variant="outline" className="h-16 flex-col gap-2">
                <Sparkles className="h-5 w-5" />
                <span className="text-xs">Generate Content</span>
              </Button>
              <Button variant="outline" className="h-16 flex-col gap-2">
                <Camera className="h-5 w-5" />
                <span className="text-xs">Get Pose Ideas</span>
              </Button>
              <Button variant="outline" className="h-16 flex-col gap-2">
                <FileText className="h-5 w-5" />
                <span className="text-xs">Create Workbook</span>
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="sandra-chat">
            <SandraAIChat />
          </TabsContent>

          <TabsContent value="content-gen">
            <EnhancedContentGenerator />
          </TabsContent>

          <TabsContent value="pose-coach">
            <ProfileAwarePoseCoach />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>AI Usage Analytics</CardTitle>
                <CardDescription>
                  Track how AI features are helping your brand development
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold">127</div>
                    <div className="text-sm text-muted-foreground">Content Pieces Generated</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">43</div>
                    <div className="text-sm text-muted-foreground">Sandra Conversations</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">18</div>
                    <div className="text-sm text-muted-foreground">Pose Sessions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">8</div>
                    <div className="text-sm text-muted-foreground">Workbooks Created</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Personalization Effectiveness</CardTitle>
                <CardDescription>
                  How profile completion improves AI output quality
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Profile Completeness</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-muted rounded-full">
                        <div className="w-28 h-2 bg-primary rounded-full"></div>
                      </div>
                      <span className="text-sm font-medium">87%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Content Relevance Score</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-muted rounded-full">
                        <div className="w-30 h-2 bg-green-500 rounded-full"></div>
                      </div>
                      <span className="text-sm font-medium">94%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Brand Alignment</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-muted rounded-full">
                        <div className="w-29 h-2 bg-blue-500 rounded-full"></div>
                      </div>
                      <span className="text-sm font-medium">91%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}