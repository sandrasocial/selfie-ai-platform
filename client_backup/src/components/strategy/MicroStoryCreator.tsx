import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Copy, RefreshCw, FileText } from 'lucide-react';

interface MicroStoryCreatorProps {
  user?: any;
}

interface StorySequence {
  post1: string; // Struggle & Epiphany
  post2: string; // Turnaround
  post3: string; // Victory
}

export default function MicroStoryCreator({ user }: MicroStoryCreatorProps) {
  const [storyInput, setStoryInput] = useState('');
  const [generatedSequence, setGeneratedSequence] = useState<StorySequence | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const formatWithSandraTone = (text: string): string => {
    return text
      .replace(/[💋🔥👑💪🚀💯🎯]/g, '') // Remove flashy emojis
      .replace(/✨{2,}/g, '✨') // Limit sparkles to single use
      .replace(/😊{2,}/g, '😊') // Limit smileys
      .replace(/\s+/g, ' ') // Clean up extra spaces
      .trim();
  };

  const generateMicroStory = async () => {
    if (!storyInput.trim()) {
      toast({ title: "Please enter your story", variant: "destructive" });
      return;
    }

    if (storyInput.length < 20) {
      toast({ 
        title: "Story too short", 
        description: "Please provide at least 20 characters to create a meaningful story sequence",
        variant: "destructive" 
      });
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch('/api/generate-micro-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          story: storyInput.trim(),
          format: '3-act-narrative' 
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate story sequence');
      }

      const data = await response.json();

      // Format each post with Sandra's tone
      const formattedSequence: StorySequence = {
        post1: formatWithSandraTone(data.post1),
        post2: formatWithSandraTone(data.post2),
        post3: formatWithSandraTone(data.post3)
      };

      setGeneratedSequence(formattedSequence);
      toast({ title: "Story sequence generated successfully!" });
    } catch (error) {
      console.error('Story generation error:', error);
      toast({ 
        title: "Generation failed", 
        description: "Please try again with a different story",
        variant: "destructive" 
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyPost = async (postContent: string, postNumber: number) => {
    try {
      await navigator.clipboard.writeText(postContent);
      toast({ title: `Post ${postNumber} copied to clipboard!` });
    } catch (error) {
      toast({ title: "Failed to copy post", variant: "destructive" });
    }
  };

  const copyAllPosts = async () => {
    if (!generatedSequence) return;

    const allPosts = `POST 1 - STRUGGLE & EPIPHANY:\n${generatedSequence.post1}\n\n---\n\nPOST 2 - TURNAROUND:\n${generatedSequence.post2}\n\n---\n\nPOST 3 - VICTORY:\n${generatedSequence.post3}`;

    try {
      await navigator.clipboard.writeText(allPosts);
      toast({ title: "All posts copied to clipboard!" });
    } catch (error) {
      toast({ title: "Failed to copy posts", variant: "destructive" });
    }
  };

  const regenerateSequence = () => {
    if (generatedSequence) {
      generateMicroStory();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Framework Explanation */}
      <Card className="border-[#3C3A35]">
        <CardHeader>
          <CardTitle className="font-['Prata'] text-[#3C3A35] flex items-center gap-2">
            <FileText className="h-5 w-5" />
            3-Act Micro-Story Sequence
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-gray-700">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded">
              <h4 className="font-semibold text-[#3C3A35]">Act 1: Struggle & Epiphany</h4>
              <p className="text-xs mt-1">The challenge and the moment of realization</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded">
              <h4 className="font-semibold text-[#3C3A35]">Act 2: Turnaround</h4>
              <p className="text-xs mt-1">Taking action and making changes</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded">
              <h4 className="font-semibold text-[#3C3A35]">Act 3: Victory</h4>
              <p className="text-xs mt-1">The transformation and new reality</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Input Section */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <div>
            <Label htmlFor="story-input" className="text-base font-medium text-[#3C3A35]">
              Your Transformation Story
            </Label>
            <Textarea
              id="story-input"
              placeholder="Example: 'I used to be terrified of showing up on social media. I would delete posts minutes after posting them. But then I realized that my fear was keeping me from helping the women who needed to hear my message...'"
              value={storyInput}
              onChange={(e) => setStoryInput(e.target.value)}
              className="mt-2 min-h-[120px] resize-none"
            />
            <div className="flex justify-between text-sm text-gray-500 mt-1">
              <span>Minimum 20 characters required</span>
              <span className={storyInput.length < 20 ? 'text-red-500' : 'text-green-600'}>
                {storyInput.length} characters
              </span>
            </div>
          </div>

          <Button 
            onClick={generateMicroStory}
            disabled={isGenerating || storyInput.length < 20}
            className="w-full bg-[#3C3A35] hover:bg-[#2A2823] text-white"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Generating Story Sequence...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate 3-Post Sequence
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Generated Sequence */}
      {generatedSequence && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-['Prata'] text-xl text-[#3C3A35]">Your Story Sequence</h3>
            <div className="flex gap-2">
              <Button
                onClick={regenerateSequence}
                size="sm"
                variant="outline"
                className="text-[#3C3A35] border-[#3C3A35]"
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                Regenerate
              </Button>
              <Button
                onClick={copyAllPosts}
                size="sm"
                className="bg-[#3C3A35] hover:bg-[#2A2823] text-white"
              >
                <Copy className="w-4 h-4 mr-1" />
                Copy All
              </Button>
            </div>
          </div>

          {/* Post 1: Struggle & Epiphany */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-['Prata'] text-[#3C3A35]">
                  Post 1: Struggle & Epiphany
                </CardTitle>
                <Button
                  onClick={() => copyPost(generatedSequence.post1, 1)}
                  size="sm"
                  variant="outline"
                  className="text-[#3C3A35] border-[#3C3A35]"
                >
                  <Copy className="w-4 h-4 mr-1" />
                  Copy
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded-lg border">
                <pre className="whitespace-pre-wrap font-['Inter'] text-gray-800 leading-relaxed">
                  {generatedSequence.post1}
                </pre>
              </div>
            </CardContent>
          </Card>

          {/* Post 2: Turnaround */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-['Prata'] text-[#3C3A35]">
                  Post 2: Turnaround
                </CardTitle>
                <Button
                  onClick={() => copyPost(generatedSequence.post2, 2)}
                  size="sm"
                  variant="outline"
                  className="text-[#3C3A35] border-[#3C3A35]"
                >
                  <Copy className="w-4 h-4 mr-1" />
                  Copy
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded-lg border">
                <pre className="whitespace-pre-wrap font-['Inter'] text-gray-800 leading-relaxed">
                  {generatedSequence.post2}
                </pre>
              </div>
            </CardContent>
          </Card>

          {/* Post 3: Victory */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-['Prata'] text-[#3C3A35]">
                  Post 3: Victory
                </CardTitle>
                <Button
                  onClick={() => copyPost(generatedSequence.post3, 3)}
                  size="sm"
                  variant="outline"
                  className="text-[#3C3A35] border-[#3C3A35]"
                >
                  <Copy className="w-4 h-4 mr-1" />
                  Copy
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded-lg border">
                <pre className="whitespace-pre-wrap font-['Inter'] text-gray-800 leading-relaxed">
                  {generatedSequence.post3}
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}