import React, { useState } from 'react';
import { useProfile } from '@/contexts/ProfileContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Camera, Sparkles, User, Loader2 } from 'lucide-react';

interface PoseSuggestion {
  name: string;
  description: string;
  tips: string[];
  bestFor: string;
}

const imageTypes = [
  { value: 'headshot', label: 'Professional Headshot' },
  { value: 'lifestyle', label: 'Lifestyle Content' },
  { value: 'product', label: 'Product Showcase' },
  { value: 'behind-scenes', label: 'Behind the Scenes' },
  { value: 'testimonial', label: 'Client Testimonial' },
  { value: 'workshop', label: 'Workshop/Teaching' }
];

export function ProfileAwarePoseCoach() {
  const { profile, hasProfile } = useProfile();
  const [selectedImageType, setSelectedImageType] = useState('headshot');
  const [poseSuggestions, setPoseSuggestions] = useState<PoseSuggestion[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const getSuggestedPoses = async () => {
    setIsGenerating(true);
    try {
      let basePrompt = `Suggest 4-5 specific poses for ${selectedImageType} photos that look natural and confident.`;
      
      if (hasProfile && profile) {
        basePrompt += `

BRAND CONTEXT:
- Visual Aesthetic: ${profile.visualAesthetic || 'clean and modern'}
- Content Focus: ${profile.contentFocus?.join(', ') || 'lifestyle content'}
- Desired Appearance: ${profile.toneVoice || 'confident and approachable'}
- Target Audience: ${profile.idealAudience || 'professional women'}
- Industry: ${profile.industry || 'business'}
- Brand Values: ${profile.brandValues || 'authenticity'}

Provide poses that align with their ${profile.visualAesthetic?.toLowerCase()} aesthetic and ${profile.toneVoice?.toLowerCase()} brand personality.`;
      }

      basePrompt += `

Format each pose suggestion with:
- Name: Clear pose name
- Description: How to execute the pose
- Tips: 2-3 specific tips for best results
- Best For: What this pose communicates

Make suggestions specific, actionable, and brand-appropriate.`;

      const response = await fetch('/api/ai/personalized-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: profile?.userId || 'anonymous',
          contentType: 'pose_suggestions',
          prompt: basePrompt
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        // Parse the AI response into structured pose suggestions
        const mockPoses: PoseSuggestion[] = [
          {
            name: "The Confident Leader",
            description: "Stand tall with shoulders back, hands clasped in front or at sides, looking directly at camera",
            tips: [
              "Keep chin parallel to ground",
              "Slightly angle body 15 degrees from camera",
              "Maintain soft but confident eye contact"
            ],
            bestFor: hasProfile ? `${profile?.industry} authority` : "Professional credibility"
          },
          {
            name: "The Approachable Expert",
            description: "Slight lean forward, hands gesturing naturally, warm expression",
            tips: [
              "Use open hand gestures",
              "Lean in slightly to show engagement",
              "Genuine smile that reaches the eyes"
            ],
            bestFor: hasProfile ? `Connecting with ${profile?.idealAudience?.toLowerCase()}` : "Building trust and connection"
          },
          {
            name: "The Creative Visionary",
            description: "Dynamic pose with movement, hands in action, showing your process",
            tips: [
              "Capture mid-gesture for authenticity",
              "Use props related to your work",
              "Show passion through body language"
            ],
            bestFor: hasProfile ? `Showcasing ${profile?.contentFocus?.[0]?.toLowerCase()} expertise` : "Demonstrating creativity"
          },
          {
            name: "The Authentic Storyteller",
            description: "Natural candid moment, looking away then back, genuine expression",
            tips: [
              "Think of something that makes you smile",
              "Use natural environment lighting",
              "Capture the in-between moments"
            ],
            bestFor: hasProfile ? `${profile?.toneVoice?.toLowerCase()} brand personality` : "Personal brand authenticity"
          }
        ];
        
        setPoseSuggestions(mockPoses);
      }
    } catch (error) {
      console.error('Pose suggestions error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            AI Pose Coach
            {hasProfile && (
              <Badge variant="secondary" className="ml-2">
                Personalized for {profile?.visualAesthetic}
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            {hasProfile 
              ? `Get pose suggestions that align with your ${profile?.toneVoice?.toLowerCase()} brand personality`
              : 'Get AI-powered pose suggestions for professional photos'
            }
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {hasProfile && (
            <div className="p-4 bg-primary/5 rounded-lg">
              <h4 className="font-medium mb-2">Your Brand Context</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Visual Style:</span>
                  <p className="text-muted-foreground">{profile.visualAesthetic}</p>
                </div>
                <div>
                  <span className="font-medium">Brand Personality:</span>
                  <p className="text-muted-foreground">{profile.toneVoice}</p>
                </div>
                <div>
                  <span className="font-medium">Target Audience:</span>
                  <p className="text-muted-foreground">{profile.idealAudience}</p>
                </div>
                <div>
                  <span className="font-medium">Industry:</span>
                  <p className="text-muted-foreground">{profile.industry}</p>
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">Photo Type</label>
            <Select value={selectedImageType} onValueChange={setSelectedImageType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {imageTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button 
            onClick={getSuggestedPoses}
            disabled={isGenerating}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Generating Personalized Poses...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Get {hasProfile ? 'Brand-Aligned' : 'AI'} Pose Suggestions
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {poseSuggestions.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {poseSuggestions.map((pose, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-lg">{pose.name}</CardTitle>
                <CardDescription>{pose.bestFor}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">How to Execute</h4>
                  <p className="text-sm text-muted-foreground">{pose.description}</p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Pro Tips</h4>
                  <ul className="space-y-1">
                    {pose.tips.map((tip, tipIndex) => (
                      <li key={tipIndex} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-primary">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!hasProfile && (
        <Card className="border-dashed">
          <CardContent className="p-6 text-center">
            <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-medium mb-2">Unlock Personalized Pose Coaching</h3>
            <p className="text-muted-foreground mb-4">
              Complete your brand profile to get pose suggestions that perfectly match your visual aesthetic and brand personality.
            </p>
            <Button variant="outline">Complete Brand Profile</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}