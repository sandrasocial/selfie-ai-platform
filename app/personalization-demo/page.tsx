'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from '@/app/components/ui/button';
import { Badge } from "@/app/components/ui/badge";
import { 
  Sparkles, 
  User, 
  MessageCircle, 
  FileText, 
  CheckCircle2,
  ArrowRight,
  Zap,
  Target,
  TrendingUp,
  Crown
} from 'lucide-react';
import Link from 'next/link';
import { useOnboardingStatus } from '@/hooks/useProfile';

export default function PersonalizationDemo() {
  const { hasProfile, isComplete, completionPercentage, profile, loading } = useOnboardingStatus();
  const [workbookLoading, setWorkbookLoading] = useState(false);
  const [workbookGenerated, setWorkbookGenerated] = useState(false);

  const generateWorkbook = async () => {
    setWorkbookLoading(true);
    
    try {
      const response = await fetch('/api/ai/generate-workbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseContent: 'Building confidence through authentic selfies and personal branding',
          moduleTitle: 'Confidence Building Module',
          lessonTitle: 'Showing Up Authentically'
        }),
        credentials: 'include'
      });

      const data = await response.json();
      
      if (data.success) {
        setWorkbookGenerated(true);
      }
    } catch (error) {
      console.error('Error generating workbook:', error);
    } finally {
      setWorkbookLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-100 flex items-center justify-center">
        <div className="animate-pulse text-rose-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Crown className="h-8 w-8 text-rose-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
              Personalized AI Experience
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            See how SELFIE AI creates a truly unique experience for each user based on their brand profile, goals, and aesthetic preferences.
          </p>
        </div>

        {/* Onboarding Status */}
        <div className="mb-12">
          <Card className={`border-2 ${isComplete ? 'border-green-200 bg-green-50' : 'border-rose-200 bg-rose-50'}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${isComplete ? 'bg-green-100' : 'bg-rose-100'}`}>
                    <User className={`h-5 w-5 ${isComplete ? 'text-green-600' : 'text-rose-600'}`} />
                  </div>
                  <div>
                    <CardTitle className={isComplete ? 'text-green-900' : 'text-rose-900'}>
                      Brand Profile Status
                    </CardTitle>
                    <CardDescription className={isComplete ? 'text-green-700' : 'text-rose-700'}>
                      {isComplete 
                        ? `Profile Complete - AI fully personalized`
                        : `${completionPercentage}% complete - ${hasProfile ? 'Continue setup' : 'Start onboarding'}`
                      }
                    </CardDescription>
                  </div>
                </div>
                {isComplete ? (
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Complete
                  </Badge>
                ) : (
                  <Link href="/onboarding/brand-hub">
                    <Button className="bg-rose-600 hover:bg-rose-700">
                      {hasProfile ? 'Complete Setup' : 'Start Onboarding'}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                )}
              </div>
              {hasProfile && !isComplete && (
                <div className="mt-4">
                  <div className="w-full bg-rose-200 rounded-full h-2">
                    <div 
                      className="bg-rose-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${completionPercentage}%` }}
                    />
                  </div>
                </div>
              )}
            </CardHeader>
          </Card>
        </div>

        {/* Profile Summary */}
        {isComplete && profile && (
          <div className="mb-12">
            <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardHeader>
                <CardTitle className="text-blue-900 flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Your Personalized Profile
                </CardTitle>
                <CardDescription className="text-blue-700">
                  Here's what makes your AI experience unique
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-medium text-blue-900 mb-2">Brand Focus</h4>
                    <p className="text-sm text-blue-700">
                      <strong>Industry:</strong> {profile.industry}<br/>
                      <strong>Experience:</strong> {profile.experience_level}<br/>
                      <strong>Aesthetic:</strong> {profile.visual_aesthetic}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-900 mb-2">Voice & Style</h4>
                    <p className="text-sm text-blue-700">
                      <strong>Tone:</strong> {profile.tone_voice}<br/>
                      <strong>Content Focus:</strong> {profile.content_focus?.slice(0, 2).join(', ')}<br/>
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-900 mb-2">Mission</h4>
                    <p className="text-sm text-blue-700">
                      "{profile.brand_mission?.slice(0, 100)}..."
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* AI Tools Demo */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          
          {/* Sandra AI Chat */}
          <Card className="hover:shadow-lg transition-all duration-200">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-rose-500 text-white rounded-lg">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    Sandra AI Chat
                    {isComplete && (
                      <Badge variant="secondary" className="text-xs">
                        <Sparkles className="h-3 w-3 mr-1" />
                        Personalized
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription>
                    {isComplete 
                      ? `Coaching tailored to your ${profile?.industry?.toLowerCase()} journey`
                      : 'General personal branding advice'
                    }
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-sm text-gray-600">
                  {isComplete ? (
                    <>
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle2 className="h-4 w-4" />
                        Knows your brand mission
                      </div>
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle2 className="h-4 w-4" />
                        Matches your communication style
                      </div>
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle2 className="h-4 w-4" />
                        Industry-specific advice
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-gray-400">• Generic branding advice</div>
                      <div className="text-gray-400">• No context about your goals</div>
                      <div className="text-gray-400">• Standard responses</div>
                    </>
                  )}
                </div>
                <Link href="/chat/sandra">
                  <Button className="w-full">
                    {isComplete ? 'Open Personalized Chat' : 'Try Sandra AI'}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Workbook Generator */}
          <Card className="hover:shadow-lg transition-all duration-200">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500 text-white rounded-lg">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    AI Workbooks
                    {isComplete && (
                      <Badge variant="secondary" className="text-xs">
                        <Zap className="h-3 w-3 mr-1" />
                        Custom
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription>
                    {isComplete 
                      ? `Workbooks built for your ${profile?.visual_aesthetic?.toLowerCase()} style`
                      : 'Generic course workbooks'
                    }
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-sm text-gray-600">
                  {isComplete ? (
                    <>
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle2 className="h-4 w-4" />
                        Brand-specific examples
                      </div>
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle2 className="h-4 w-4" />
                        Your industry focus
                      </div>
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle2 className="h-4 w-4" />
                        Experience level matched
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-gray-400">• One-size-fits-all content</div>
                      <div className="text-gray-400">• Generic examples</div>
                      <div className="text-gray-400">• Basic templates</div>
                    </>
                  )}
                </div>
                <Button 
                  onClick={generateWorkbook}
                  disabled={!isComplete || workbookLoading}
                  className="w-full"
                  variant={isComplete ? "default" : "outline"}
                >
                  {workbookLoading ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-b-2 border-white mr-2" />
                      Generating...
                    </>
                  ) : workbookGenerated ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Workbook Created!
                    </>
                  ) : isComplete ? (
                    'Generate Personalized Workbook'
                  ) : (
                    'Complete Profile to Unlock'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Content Strategy */}
          <Card className="hover:shadow-lg transition-all duration-200">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500 text-white rounded-lg">
                  <Target className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    Content Strategy
                    {isComplete && (
                      <Badge variant="secondary" className="text-xs">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Smart
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription>
                    {isComplete 
                      ? `Strategies for your ${profile?.tone_voice?.toLowerCase()} voice`
                      : 'Basic content templates'
                    }
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-sm text-gray-600">
                  {isComplete ? (
                    <>
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle2 className="h-4 w-4" />
                        Audience-specific content
                      </div>
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle2 className="h-4 w-4" />
                        Your hashtag strategy
                      </div>
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle2 className="h-4 w-4" />
                        Brand voice consistency
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-gray-400">• Generic content ideas</div>
                      <div className="text-gray-400">• Random hashtags</div>
                      <div className="text-gray-400">• No voice consistency</div>
                    </>
                  )}
                </div>
                <Button 
                  disabled={!isComplete}
                  className="w-full"
                  variant={isComplete ? "default" : "outline"}
                >
                  {isComplete ? 'Create Strategy' : 'Complete Profile to Unlock'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        {!isComplete && (
          <Card className="border-2 border-rose-300 bg-gradient-to-r from-rose-100 to-pink-100">
            <CardContent className="p-8 text-center">
              <div className="mb-4">
                <Crown className="h-12 w-12 text-rose-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-rose-900 mb-2">
                  Get Your Personalized AI Experience
                </h2>
                <p className="text-rose-700 max-w-2xl mx-auto">
                  Complete your brand profile to transform every AI tool, workbook, and strategy into something uniquely tailored to your brand, goals, and audience.
                </p>
              </div>
              <Link href="/onboarding/brand-hub">
                <Button size="lg" className="bg-rose-600 hover:bg-rose-700 text-white">
                  Complete Your Profile Now
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
