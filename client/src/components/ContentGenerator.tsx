import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Download, RefreshCw, Sparkles, History } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from "@/hooks/use-toast";

interface ContentGeneratorProps {
  day: number;
  isPro: boolean;
  userProfile?: any;
  dayTitle: string;
  dayDescription: string;
}

interface GeneratedContent {
  id: string;
  contentType: string;
  ai_content: {
    captions?: string[];
    hooks?: string[];
    story_slides?: string[];
    hashtags?: string[];
    seo_keywords?: string[];
    cta?: string;
    signature?: string;
    reel_prompt?: string;
    caption_template?: string;
  };
  createdAt: string;
}

interface ContentHistory {
  id: string;
  contentType: string;
  createdAt: string;
  ai_content: any;
}

function ContentGenerator({ day, isPro, userProfile, dayTitle, dayDescription }: ContentGeneratorProps) {
  const [content, setContent] = useState<GeneratedContent | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const queryClient = useQueryClient();

  // Fetch content history
  const { data: history, isLoading: historyLoading } = useQuery<ContentHistory[]>({
    queryKey: ['/api/content-generator/history'],
    queryFn: async () => {
      const response = await fetch('/api/content-generator/history?limit=10', {
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Failed to fetch history');
      }
      const data = await response.json();
      return data.data || [];
    },
    enabled: showHistory
  });

  // Content generation mutation
  const contentMutation = useMutation({
    mutationFn: async (requestData: any) => {
      const response = await fetch('/api/content-generator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate content');
      }

      return response.json();
    },
    onSuccess: (data) => {
      setContent(data.data);
      queryClient.invalidateQueries({ queryKey: ['/api/content-generator/history'] });

      toast({
        title: "Content Generated! 🎉",
        description: `Your Day ${day} content is ready to use!`,
      });
    },
    onError: (error: any) => {
      console.error('Error generating content:', error);
      toast({
        title: "Generation Failed",
        description: error.message || 'Please try again',
        variant: "destructive",
      });
    }
  });

  const generateContent = async () => {
    if (!userProfile) {
      toast({
        title: "Profile Required",
        description: 'Please set up your brand profile first',
        variant: "destructive",
      });
      return;
    }

    const requestData = {
      contentType: 'post',
      inputContext: {
        audience: userProfile.targetAudience || 'General audience',
        tone: userProfile.brandVoice || 'Professional and engaging',
        topic: `Day ${day}: ${dayTitle}`,
        contentGoal: dayDescription,
        callToAction: 'Engage with this content',
        brandVoice: userProfile.brandVoice || 'Authentic and supportive',
        platform: 'Instagram',
        length: 'Medium length (100-150 words)',
        keywords: userProfile.keywords || [`day${day}`, 'content', 'branding'],
        mood: 'Motivational and inspiring',
        industry: userProfile.industry || 'Personal branding',
        day: day,
        userProfile: userProfile
      }
    };

    contentMutation.mutate(requestData);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    });
  };

  const formatHashtags = (hashtags: string[]) => {
    if (!hashtags || !Array.isArray(hashtags)) return '';
    return hashtags.map(tag => tag.startsWith('#') ? tag : `#${tag}`).join(' ');
  };

  const loadHistoryItem = (item: ContentHistory) => {
    const formattedContent: GeneratedContent = {
      id: item.id,
      contentType: item.contentType,
      ai_content: item.ai_content,
      createdAt: item.createdAt
    };
    setContent(formattedContent);
    setShowHistory(false);

    toast({
      title: "Content Loaded",
      description: "Previous content loaded successfully",
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <Badge className="bg-black text-white">
          Day {day} • Sandra's Template System
        </Badge>
        <h1 className="font-prata text-2xl md:text-3xl text-brand-text">
          {dayTitle}
        </h1>
        <p className="text-gray-600 font-inter max-w-2xl mx-auto">
          {dayDescription}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center">
        {!content && (
          <Button 
            onClick={generateContent}
            disabled={contentMutation.isPending || !userProfile}
            className="btn-primary text-lg px-8 py-4"
            size="lg"
          >
            {contentMutation.isPending ? (
              <>
                <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                Generating Your Content...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5" />
                Generate My Day {day} Content
              </>
            )}
          </Button>
        )}

        <Button
          onClick={() => setShowHistory(!showHistory)}
          variant="outline"
          size="lg"
          className="px-8 py-4"
        >
          <History className="mr-2 h-5 w-5" />
          {showHistory ? 'Hide History' : 'Show History'}
        </Button>
      </div>

      {!userProfile && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-700 text-center">
              Please set up your brand profile first to generate personalized content
            </p>
          </CardContent>
        </Card>
      )}

      {/* History */}
      {showHistory && (
        <Card>
          <CardHeader>
            <CardTitle className="font-prata">Previous Content</CardTitle>
          </CardHeader>
          <CardContent>
            {historyLoading ? (
              <p className="text-center text-gray-500">Loading history...</p>
            ) : history && history.length > 0 ? (
              <div className="space-y-3">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => loadHistoryItem(item)}
                  >
                    <div>
                      <p className="font-medium">{item.contentType}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Button size="sm" variant="ghost">
                      Load
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">No previous content found</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Generated Content Display */}
      {content && content.ai_content && (
        <div className="space-y-6">
          {/* Regenerate Button */}
          <div className="flex justify-between items-center">
            <h2 className="font-prata text-xl text-brand-text">Your Personalized Content</h2>
            <Button 
              onClick={generateContent}
              disabled={contentMutation.isPending}
              variant="outline"
              size="sm"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Regenerate
            </Button>
          </div>

          <Tabs defaultValue="reel" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="reel">Reel</TabsTrigger>
              <TabsTrigger value="caption">Caption</TabsTrigger>
              <TabsTrigger value="stories">Stories</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
            </TabsList>

            <TabsContent value="reel" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="font-prata">Reel Instructions</span>
                    <Button
                      onClick={() => copyToClipboard(
                        content.ai_content.reel_prompt || content.ai_content.hooks?.[0] || 'No reel content available',
                        'Reel prompt'
                      )}
                      variant="outline"
                      size="sm"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="whitespace-pre-wrap font-inter text-gray-700 leading-relaxed">
                      {content.ai_content.reel_prompt || content.ai_content.hooks?.[0] || 'No reel content available'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="caption" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="font-prata">Caption Template</span>
                    <Button
                      onClick={() => copyToClipboard(
                        content.ai_content.caption_template || content.ai_content.captions?.[0] || 'No caption available',
                        'Caption'
                      )}
                      variant="outline"
                      size="sm"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="whitespace-pre-wrap font-inter text-gray-700 leading-relaxed">
                      {content.ai_content.caption_template || content.ai_content.captions?.[0] || 'No caption available'}
                    </p>
                  </div>

                  {content.ai_content.signature && (
                    <div className="mt-4 pt-4 border-t">
                      <h4 className="font-medium text-brand-text mb-2">Signature</h4>
                      <div className="bg-white p-3 rounded border">
                        <p className="text-sm font-inter text-gray-700">{content.ai_content.signature}</p>
                      </div>
                    </div>
                  )}

                  {content.ai_content.cta && (
                    <div className="mt-4 pt-4 border-t">
                      <h4 className="font-medium text-brand-text mb-2">Call to Action</h4>
                      <div className="bg-white p-3 rounded border">
                        <p className="text-sm font-inter text-gray-700">{content.ai_content.cta}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="stories" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-prata">Story Slides</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {content.ai_content.story_slides && content.ai_content.story_slides.length > 0 ? (
                      content.ai_content.story_slides.map((slide, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-brand-text">Slide {index + 1}</h4>
                            <Button
                              onClick={() => copyToClipboard(slide, `Slide ${index + 1}`)}
                              variant="outline"
                              size="sm"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="text-sm font-inter text-gray-700 leading-relaxed">
                            {slide}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-gray-500">No story slides available</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="details" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-prata text-lg">Hashtags</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm font-inter text-gray-700 break-words">
                        {content.ai_content.hashtags ? formatHashtags(content.ai_content.hashtags) : 'No hashtags available'}
                      </p>
                    </div>
                    {content.ai_content.hashtags && (
                      <Button
                        onClick={() => copyToClipboard(formatHashtags(content.ai_content.hashtags!), 'Hashtags')}
                        variant="outline"
                        size="sm"
                        className="mt-2"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Hashtags
                      </Button>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="font-prata text-lg">SEO Keywords</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      {content.ai_content.seo_keywords && content.ai_content.seo_keywords.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {content.ai_content.seo_keywords.map((keyword, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No SEO keywords available</p>
                      )}
                    </div>
                    {content.ai_content.seo_keywords && content.ai_content.seo_keywords.length > 0 && (
                      <Button
                        onClick={() => copyToClipboard(content.ai_content.seo_keywords!.join(', '), 'SEO Keywords')}
                        variant="outline"
                        size="sm"
                        className="mt-2"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Keywords
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}

export default ContentGenerator;