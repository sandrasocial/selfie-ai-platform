import React from 'react';
import { useProfile } from '@/contexts/ProfileContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, ArrowRight, Crown } from 'lucide-react';
import { useLocation } from 'wouter';

interface ProfileCompletionPromptProps {
  context?: 'content' | 'ai' | 'workbook' | 'general';
  compact?: boolean;
}

export function ProfileCompletionPrompt({ context = 'general', compact = false }: ProfileCompletionPromptProps) {
  const { hasProfile } = useProfile();
  const [, setLocation] = useLocation();

  if (hasProfile) return null;

  const contextMessages = {
    content: {
      title: "Get Content That Actually Sounds Like You",
      description: "Complete your brand profile to generate content that matches your voice, audience, and aesthetic instead of generic templates.",
      benefit: "2x more engaging content"
    },
    ai: {
      title: "Unlock Personalized AI Coaching",
      description: "Sandra AI will know your industry, goals, and brand voice to give you advice that's actually relevant to your business.",
      benefit: "Industry-specific guidance"
    },
    workbook: {
      title: "Get Workbooks Built for Your Brand",
      description: "Instead of generic examples, get workbooks with your industry context, audience insights, and brand-specific action steps.",
      benefit: "Tailored learning materials"
    },
    general: {
      title: "Unlock Personalized Brand Experience",
      description: "Complete your brand profile to get AI content, coaching, and materials that actually fit your business and audience.",
      benefit: "Fully personalized platform"
    }
  };

  const message = contextMessages[context];

  if (compact) {
    return (
      <div className="bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/20 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-full">
              <Crown className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h4 className="font-medium text-sm">{message.title}</h4>
              <p className="text-xs text-muted-foreground">{message.benefit}</p>
            </div>
          </div>
          <Button size="sm" onClick={() => setLocation('/profile')}>
            Complete
            <ArrowRight className="h-3 w-3 ml-1" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Card className="border-l-4 border-l-primary bg-gradient-to-r from-primary/5 to-transparent">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-primary/10 rounded-full">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold">{message.title}</h3>
              <Badge variant="secondary" className="text-xs">
                <Crown className="h-3 w-3 mr-1" />
                {message.benefit}
              </Badge>
            </div>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              {message.description}
            </p>
            <div className="flex gap-3">
              <Button onClick={() => setLocation('/profile')}>
                <Sparkles className="h-4 w-4 mr-2" />
                Complete Profile (2 min)
              </Button>
              <Button variant="ghost" size="sm" className="text-xs">
                Learn more about personalization
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}