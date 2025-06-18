import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Copy, Sparkles, MessageSquare, Hash, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface ContentGeneration {
  captions: string[];
  poseTips: string[];
  lightingAdvice: string;
  storyCaption: string;
  hashtags: string;
  recommendedFormat: string;
}

interface ContentCreatorProps {
  user?: any;
}

export default function ContentCreator({ user }: ContentCreatorProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [mood, setMood] = useState<string>("confident");
  const [customPrompt, setCustomPrompt] = useState<string>("");
  const [generatedContent, setGeneratedContent] = useState<ContentGeneration | null>(null);
  const { toast } = useToast();

  const contentMutation = useMutation({
    mutationFn: async (data: { image: File; mood: string; customPrompt?: string }) => {
      const formData = new FormData();
      formData.append("image", data.image);
      formData.append("mood", data.mood);
      formData.append("enhanceImage", "false"); // No image processing, just content
      formData.append("filterStyle", "natural");
      formData.append("brightnessAdjust", "0");
      formData.append("contrastAdjust", "0");
      if (data.customPrompt) {
        formData.append("customPrompt", data.customPrompt);
      }

      const response = await fetch("/api/generate", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to generate content");
      }

      return response.json();
    },
    onSuccess: (data) => {
      setGeneratedContent(data);
      toast({
        title: "Content Generated!",
        description: "Your authentic Sandra-style content is ready.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Generation Failed",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateContent = () => {
    if (!selectedImage) {
      toast({
        title: "Upload Required",
        description: "Please upload a photo first.",
        variant: "destructive",
      });
      return;
    }

    contentMutation.mutate({
      image: selectedImage,
      mood,
      customPrompt,
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Content copied to clipboard.",
    });
  };

  const moods = [
    { value: "confident", label: "Confident", description: "Bold, empowered energy" },
    { value: "soft", label: "Soft", description: "Gentle strength and grace" },
    { value: "radiant", label: "Radiant", description: "Joyful, glowing vibes" },
    { value: "emotional", label: "Emotional", description: "Raw, authentic moments" },
    { value: "boss", label: "Boss", description: "Leader energy and authority" },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Content Creator - Sandra's Authentic Voice
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Image Upload */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Upload Your Photo</h3>
            {!selectedImage ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600 mb-3">Upload a photo to generate authentic content</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="content-image-upload"
                />
                <Button asChild size="sm">
                  <label htmlFor="content-image-upload" className="cursor-pointer">
                    Choose Photo
                  </label>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="aspect-square max-w-xs mx-auto rounded-lg overflow-hidden bg-gray-100">
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Upload preview"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="new-content-image"
                />
                <Button asChild variant="outline" size="sm" className="w-full">
                  <label htmlFor="new-content-image" className="cursor-pointer">
                    Change Photo
                  </label>
                </Button>
              </div>
            )}
          </div>

          {/* Mood Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Select Your Energy</h3>
            <Select value={mood} onValueChange={setMood}>
              <SelectTrigger>
                <SelectValue placeholder="Choose your mood" />
              </SelectTrigger>
              <SelectContent>
                {moods.map((moodOption) => (
                  <SelectItem key={moodOption.value} value={moodOption.value}>
                    <div>
                      <div className="font-medium">{moodOption.label}</div>
                      <div className="text-xs text-gray-500">{moodOption.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Custom Prompt */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Custom Context (Optional)</h3>
            <Textarea
              placeholder="Add any specific context or story you want included in your content..."
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              rows={3}
            />
          </div>

          {/* Generate Button */}
          <Button 
            onClick={generateContent} 
            disabled={!selectedImage || contentMutation.isPending}
            className="w-full"
            size="lg"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            {contentMutation.isPending ? "Creating Your Content..." : "Generate Content"}
          </Button>
        </CardContent>
      </Card>

      {/* Generated Content */}
      {generatedContent && (
        <div className="space-y-6">
          {/* Captions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Instagram Captions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {generatedContent.captions.map((caption, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">Caption {index + 1}</Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(caption)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-sm bg-gray-50 p-3 rounded-lg">{caption}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Story Caption */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Story Caption
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="outline">Full Story</Badge>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(generatedContent.storyCaption)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-sm bg-gray-50 p-4 rounded-lg leading-relaxed">
                  {generatedContent.storyCaption}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Hashtags */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hash className="w-5 h-5" />
                SEO Hashtags
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="outline">Optimized Tags</Badge>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(Array.isArray(generatedContent.hashtags) ? generatedContent.hashtags.join(' ') : generatedContent.hashtags)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-600">
                    {Array.isArray(generatedContent.hashtags) 
                      ? generatedContent.hashtags.join(' ')
                      : generatedContent.hashtags}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Format Recommendation */}
          <Card>
            <CardHeader>
              <CardTitle>Recommended Format</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm bg-amber-50 p-3 rounded-lg border border-amber-200">
                {generatedContent.recommendedFormat}
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}