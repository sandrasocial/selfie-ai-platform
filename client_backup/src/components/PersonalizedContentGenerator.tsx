import React, { useState } from 'react';
import { useProfile, usePersonalization } from '@/contexts/ProfileContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Sparkles, User, Target } from 'lucide-react';

interface ContentSuggestions {
  hooks: string[];
  captions: string[];
  hashtags: string[];
  callToActions: string[];
}

export function PersonalizedContentGenerator() {
  const { profile, hasProfile, loading } = useProfile();
  const { getPersonalizedContent, getBrandHashtags, getToneGuidelines } = usePersonalization();
  const [prompt, setPrompt] = useState('');
  const [generatedContent, setGeneratedContent] = useState<{
    personalizedPrompt: string;
    contentSuggestions: ContentSuggestions;
  } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePersonalizedContent = async () => {
    if (!profile || !prompt.trim()) return;

    setIsGenerating(true);
    try {
      const response = await fetch('/api/ai/personalized-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: profile.userId,
          contentType: 'post',
          prompt: prompt.trim()
        })
      });

      const data = await response.json();
      if (data.success) {
        setGeneratedContent(data);
      }
    } catch (error) {
      console.error('Failed to generate content:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  if (loading) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          Loading profile...
        </CardContent>
      </Card>
    );
  }

  if (!hasProfile) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Complete Your Brand Profile
          </CardTitle>
          <CardDescription>
            Create your brand profile to unlock personalized AI content generation
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Profile Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            AI Content Generator
          </CardTitle>
          <CardDescription>
            Powered by your brand profile: {profile.brandMission}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-2">Industry</h4>
              <Badge variant="secondary">{profile.industry}</Badge>
            </div>
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-2">Tone & Voice</h4>
              <Badge variant="secondary">{profile.toneVoice}</Badge>
            </div>
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-2">Visual Style</h4>
              <Badge variant="secondary">{profile.visualAesthetic}</Badge>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Content Prompt
              </label>
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the content you want to create (e.g., 'Create an inspiring post about overcoming business challenges')"
                className="min-h-[100px]"
              />
            </div>

            <Button 
              onClick={generatePersonalizedContent}
              disabled={!prompt.trim() || isGenerating}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Generating Personalized Content...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Brand-Aligned Content
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Generated Content */}
      {generatedContent && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Content Hooks</CardTitle>
              <CardDescription>
                Personalized opening lines for your {profile.toneVoice?.toLowerCase()} brand voice
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {generatedContent.contentSuggestions.hooks.map((hook, index) => (
                  <div key={index} className="p-3 bg-muted rounded-lg">
                    <p className="text-sm">{hook}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Caption Ideas</CardTitle>
              <CardDescription>
                Aligned with your brand values: {profile.brandValues}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {generatedContent.contentSuggestions.captions.slice(0, 3).map((caption, index) => (
                  <div key={index} className="p-3 bg-muted rounded-lg">
                    <p className="text-sm">{caption.length > 120 ? caption.substring(0, 120) + '...' : caption}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Brand Hashtags</CardTitle>
              <CardDescription>
                Your signature hashtag collection
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {generatedContent.contentSuggestions.hashtags.map((hashtag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {hashtag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Call-to-Actions</CardTitle>
              <CardDescription>
                Engagement drivers for {profile.idealAudience}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {generatedContent.contentSuggestions.callToActions.map((cta, index) => (
                  <div key={index} className="p-2 bg-primary/5 rounded border-l-2 border-primary">
                    <p className="text-sm font-medium">{cta}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Brand Guidelines Reference */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Your Brand Guidelines
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Content Focus Areas</h4>
              <div className="flex flex-wrap gap-2">
                {profile.contentFocus?.map((focus, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {focus}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Tone Guidelines</h4>
              <div className="space-y-1">
                {getToneGuidelines().map((guideline, index) => (
                  <p key={index} className="text-sm text-muted-foreground">
                    • {guideline}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}