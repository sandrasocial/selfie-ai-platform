import React, { useState } from 'react';
import { useProfile } from '@/contexts/ProfileContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Copy, Hash, MessageSquare, Target, Loader2, Sparkles } from 'lucide-react';

interface GeneratedContent {
  caption?: string;
  strategy?: string;
  hashtags?: string[];
  hooks?: string[];
  callToActions?: string[];
}

const contentTypes = [
  { value: 'caption', label: 'Instagram Caption', icon: MessageSquare },
  { value: 'strategy', label: 'Content Strategy', icon: Target },
  { value: 'hashtags', label: 'Hashtag Set', icon: Hash },
  { value: 'hooks', label: 'Hook Collection', icon: Sparkles }
];

export function EnhancedContentGenerator() {
  const { profile, hasProfile } = useProfile();
  const [contentType, setContentType] = useState('caption');
  const [userInput, setUserInput] = useState('');
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateContent = async () => {
    if (!userInput.trim()) return;

    setIsGenerating(true);
    try {
      let basePrompt = '';
      
      switch (contentType) {
        case 'caption':
          basePrompt = `Create an engaging Instagram caption based on: "${userInput}"`;
          break;
        case 'strategy':
          basePrompt = `Create a content strategy recommendation for: "${userInput}"`;
          break;
        case 'hashtags':
          basePrompt = `Generate relevant hashtags for: "${userInput}"`;
          break;
        case 'hooks':
          basePrompt = `Create attention-grabbing hooks for: "${userInput}"`;
          break;
      }

      // Enhance with profile data if available
      if (hasProfile && profile) {
        basePrompt += `

BRAND PERSONALIZATION:
- Tone: ${profile.toneVoice || 'authentic'} 
- Audience: ${profile.idealAudience || 'their audience'}
- Values: ${profile.brandValues || 'authenticity and empowerment'}
- Aesthetic: ${profile.visualAesthetic || 'clean'}
- Industry: ${profile.industry || 'their industry'}
- Goals: ${profile.mainGoals || 'building their brand'}`;
        
        if (profile.hashtags && contentType === 'hashtags') {
          basePrompt += `\nExisting hashtags to incorporate: ${profile.hashtags}`;
        }
      }

      const response = await fetch('/api/ai/personalized-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: profile?.userId || 'anonymous',
          contentType,
          prompt: basePrompt
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        // Map the response to our expected format
        const content: GeneratedContent = {};
        
        if (contentType === 'caption') {
          content.caption = data.contentSuggestions?.captions?.[0] || data.personalizedPrompt;
        } else if (contentType === 'strategy') {
          content.strategy = data.personalizedPrompt;
        } else if (contentType === 'hashtags') {
          content.hashtags = data.contentSuggestions?.hashtags || [];
        } else if (contentType === 'hooks') {
          content.hooks = data.contentSuggestions?.hooks || [];
        }
        
        content.callToActions = data.contentSuggestions?.callToActions || [];
        
        setGeneratedContent(content);
      }
    } catch (error) {
      console.error('Content generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const ProfilePrompt = () => (
    <Card className="mb-6 border-l-4 border-l-primary">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <Sparkles className="h-5 w-5 text-primary" />
          <div>
            <h4 className="font-medium">Unlock Personalized Content</h4>
            <p className="text-sm text-muted-foreground">
              Complete your profile to get content tailored to your brand voice and audience.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {!hasProfile && <ProfilePrompt />}
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            AI Content Generator
            {hasProfile && (
              <Badge variant="secondary" className="ml-2">
                Personalized for {profile?.industry}
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            {hasProfile 
              ? `Generate content aligned with your ${profile?.toneVoice?.toLowerCase()} brand voice`
              : 'Create engaging content with AI assistance'
            }
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Content Type</label>
              <Select value={contentType} onValueChange={setContentType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {contentTypes.map(type => {
                    const Icon = type.icon;
                    return (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          {type.label}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            
            {hasProfile && (
              <div>
                <label className="block text-sm font-medium mb-2">Brand Context</label>
                <div className="flex gap-2">
                  <Badge variant="outline">{profile?.toneVoice}</Badge>
                  <Badge variant="outline">{profile?.visualAesthetic}</Badge>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Content Topic or Brief
            </label>
            <Textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder={`Describe what you want to create (e.g., "Announce new service launch" or "Share behind-the-scenes content")`}
              className="min-h-[100px]"
            />
          </div>

          <Button 
            onClick={generateContent}
            disabled={!userInput.trim() || isGenerating}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Generating {contentTypes.find(t => t.value === contentType)?.label}...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate {contentTypes.find(t => t.value === contentType)?.label}
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {generatedContent && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Content</CardTitle>
            {hasProfile && (
              <CardDescription>
                Personalized for your {profile?.idealAudience?.toLowerCase() || 'target audience'}
              </CardDescription>
            )}
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="content" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="content">Primary Content</TabsTrigger>
                <TabsTrigger value="extras">Extras & CTAs</TabsTrigger>
              </TabsList>
              
              <TabsContent value="content" className="space-y-4">
                {generatedContent.caption && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Instagram Caption</h4>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(generatedContent.caption!)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="whitespace-pre-wrap">{generatedContent.caption}</p>
                    </div>
                  </div>
                )}

                {generatedContent.strategy && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Content Strategy</h4>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(generatedContent.strategy!)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="whitespace-pre-wrap">{generatedContent.strategy}</p>
                    </div>
                  </div>
                )}

                {generatedContent.hooks && generatedContent.hooks.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Content Hooks</h4>
                    <div className="space-y-2">
                      {generatedContent.hooks.map((hook, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <p className="flex-1">{hook}</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(hook)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {generatedContent.hashtags && generatedContent.hashtags.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Hashtag Collection</h4>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(generatedContent.hashtags!.join(' '))}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {generatedContent.hashtags.map((hashtag, index) => (
                        <Badge key={index} variant="secondary" className="cursor-pointer"
                               onClick={() => copyToClipboard(hashtag)}>
                          {hashtag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="extras" className="space-y-4">
                {generatedContent.callToActions && generatedContent.callToActions.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Call-to-Action Options</h4>
                    <div className="space-y-2">
                      {generatedContent.callToActions.map((cta, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <p className="flex-1">{cta}</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(cta)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {hasProfile && (
                  <div className="p-4 bg-primary/5 rounded-lg">
                    <h4 className="font-medium mb-2">Brand Alignment Check</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Target Audience:</span>
                        <p className="text-muted-foreground">{profile?.idealAudience}</p>
                      </div>
                      <div>
                        <span className="font-medium">Brand Values:</span>
                        <p className="text-muted-foreground">{profile?.brandValues}</p>
                      </div>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}