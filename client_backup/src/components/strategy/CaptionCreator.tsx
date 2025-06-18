import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Copy, RefreshCw } from 'lucide-react';

interface CaptionCreatorProps {
  user?: any;
}

export default function CaptionCreator({ user }: CaptionCreatorProps) {
  const [prompt, setPrompt] = useState('');
  const [generatedCaption, setGeneratedCaption] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const formatWithSandraTone = (text: string): string => {
    // Remove excessive emojis and replace with minimal, natural ones
    return text
      .replace(/[💋🔥👑💪🚀💯🎯]/g, '') // Remove flashy emojis
      .replace(/✨{2,}/g, '✨') // Limit sparkles to single use
      .replace(/😊{2,}/g, '😊') // Limit smileys
      .replace(/\s+/g, ' ') // Clean up extra spaces
      .trim();
  };

  const generateCaption = async () => {
    if (!prompt.trim()) {
      toast({ title: "Please enter a prompt", variant: "destructive" });
      return;
    }

    if (prompt.length < 10) {
      toast({ title: "Please provide more details in your prompt", variant: "destructive" });
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch('/api/generate-caption', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: prompt.trim(),
          framework: 'becoming-her' 
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate caption');
      }

      const data = await response.json();
      const formattedCaption = formatWithSandraTone(data.caption);
      setGeneratedCaption(formattedCaption);

      toast({ title: "Caption generated successfully!" });
    } catch (error) {
      console.error('Caption generation error:', error);
      toast({ 
        title: "Generation failed", 
        description: "Please try again with a different prompt",
        variant: "destructive" 
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    if (!generatedCaption) return;

    try {
      await navigator.clipboard.writeText(generatedCaption);
      toast({ title: "Caption copied to clipboard!" });
    } catch (error) {
      toast({ title: "Failed to copy caption", variant: "destructive" });
    }
  };

  const regenerateCaption = () => {
    if (generatedCaption) {
      generateCaption();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Framework Explanation */}
      <Card className="border-[#3C3A35]">
        <CardHeader>
          <CardTitle className="font-['Prata'] text-[#3C3A35] flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            6-Step "Becoming HER" Caption Framework
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-gray-700">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p><strong>1. Hook:</strong> Grab attention with a relatable opening</p>
              <p><strong>2. Before:</strong> Paint the struggle or old mindset</p>
              <p><strong>3. Shift:</strong> The moment everything changed</p>
            </div>
            <div>
              <p><strong>4. Now:</strong> Current reality and transformation</p>
              <p><strong>5. Takeaway:</strong> The lesson or insight</p>
              <p><strong>6. CTA:</strong> Clear next step for your audience</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Input Section */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <div>
            <Label htmlFor="caption-prompt" className="text-base font-medium text-[#3C3A35]">
              Caption Topic or Story Idea
            </Label>
            <Textarea
              id="caption-prompt"
              placeholder="Example: 'My journey from self-doubt to building a 6-figure business' or 'How I stopped comparing myself to others on social media'"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="mt-2 min-h-[100px] resize-none"
            />
            <p className="text-sm text-gray-500 mt-1">
              Describe your transformation, lesson learned, or story you want to share
            </p>
          </div>

          <Button 
            onClick={generateCaption}
            disabled={isGenerating || !prompt.trim()}
            className="w-full bg-[#3C3A35] hover:bg-[#2A2823] text-white"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Generating Caption...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Caption
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Generated Caption */}
      {generatedCaption && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="font-['Prata'] text-[#3C3A35]">
                Your Generated Caption
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  onClick={regenerateCaption}
                  size="sm"
                  variant="outline"
                  className="text-[#3C3A35] border-[#3C3A35]"
                >
                  <RefreshCw className="w-4 h-4 mr-1" />
                  Regenerate
                </Button>
                <Button
                  onClick={copyToClipboard}
                  size="sm"
                  className="bg-[#3C3A35] hover:bg-[#2A2823] text-white"
                >
                  <Copy className="w-4 h-4 mr-1" />
                  Copy
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-lg border">
              <pre className="whitespace-pre-wrap font-['Inter'] text-gray-800 leading-relaxed">
                {generatedCaption}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}