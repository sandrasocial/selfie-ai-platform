import React, { useState, useEffect } from 'react';
import { Link } from "wouter";
import { ArrowLeft, Wand2, Save, Sparkles } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SupabaseService } from '@/lib/supabaseService';

interface VisualStrategyResponse {
  id: string;
  visualConcepts: string[];
  designElements: string[];
  colorPalette: string[];
  layoutSuggestions: string[];
  copyOptions: string[];
  brandingNotes: string[];
  technicalSpecs?: {
    dimensions?: string;
    format?: string;
    resolution?: string;
  };
}

export default function VisualStrategy() {
  const [prompt, setPrompt] = useState('');
  const [selectedPromptType, setSelectedPromptType] = useState<string>('brand-photoshoot');
  const [selectedEditingMode, setSelectedEditingMode] = useState<string>('generate');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedStrategy, setGeneratedStrategy] = useState<VisualStrategyResponse | null>(null);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get current user data
  const { data: user } = useQuery({
    queryKey: ["/api/me"],
    retry: false,
  });

  // Get user's saved strategies
  const { data: userStrategies, isLoading: strategiesLoading } = useQuery({
    queryKey: ['user-ai-strategies', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      return await SupabaseService.getUserAIStrategies(user.id);
    },
    enabled: !!user?.id,
  });

  // AI Enhancement Options
  const promptTypes = [
    { value: 'brand-photoshoot', label: 'Brand Photoshoot' },
    { value: 'content-calendar', label: 'Content Calendar' },
    { value: 'social-media-post', label: 'Social Media Post' },
    { value: 'story-template', label: 'Story Template' },
    { value: 'reel-concept', label: 'Reel Concept' },
    { value: 'carousel-design', label: 'Carousel Design' },
    { value: 'custom', label: 'Custom Strategy' }
  ];

  const editingModes = [
    { value: 'generate', label: 'Generate New' },
    { value: 'enhance', label: 'Enhance Existing' },
    { value: 'redesign', label: 'Redesign' },
    { value: 'optimize', label: 'Optimize' }
  ];

  // Auto-populate form with user profile data when component mounts
  useEffect(() => {
    if (user?.profileData && !prompt) {
      const userProfile = user.profileData;
      const autoPrompt = `Create a comprehensive visual strategy for my ${userProfile.industry || 'personal branding'} business. 
      My target audience is ${userProfile.targetAudience || 'professional women entrepreneurs'}. 
      My brand style is ${userProfile.brandStyle || 'luxury minimalist'} with a ${userProfile.brandPersonality || 'confident and approachable'} personality.
      Focus on ${userProfile.primaryPlatform || 'Instagram'} content that aligns with my brand values: ${userProfile.brandValues?.join(', ') || 'authenticity, expertise, empowerment'}.`;
      
      setPrompt(autoPrompt);
    }
  }, [user]);

  // Generate AI visual strategy mutation
  const generateStrategyMutation = useMutation({
    mutationFn: async (requestData: {
      title: string;
      promptType: string;
      editingMode: string;
      prompt: string;
      context?: any;
      brandProfileSnapshot?: any;
      tags?: string[];
    }) => {
      const response = await fetch('/api/visual-studio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate strategy');
      }

      return await response.json();
    },
    onSuccess: (data) => {
      setGeneratedStrategy(data);
      setIsGenerating(false);
      toast({
        title: "Strategy Generated!",
        description: "Your visual strategy is ready.",
        className: "bg-white border-black text-black",
      });
    },
    onError: (error: Error) => {
      setIsGenerating(false);
      toast({
        title: "Generation Failed",
        description: error.message || "Unable to generate strategy. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Save strategy to Content Vault
  const saveStrategyMutation = useMutation({
    mutationFn: async (strategy: VisualStrategyResponse) => {
      if (!user?.id) throw new Error('User not authenticated');

      return await SupabaseService.saveAIVisualStrategy({
        id: strategy.id,
        user_id: user.id,
        type: selectedPromptType,
        brand_profile_snapshot: user.profileData || {},
        content_generated: strategy,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-ai-strategies', user?.id] });
      setShowSaveSuccess(true);
      setTimeout(() => setShowSaveSuccess(false), 3000);
      toast({
        title: "Strategy Saved!",
        description: "Your strategy has been saved to your Studio Vault.",
        className: "bg-white border-black text-black",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Save Failed",
        description: error.message || "Unable to save strategy.",
        variant: "destructive",
      });
    },
  });

  // Handle strategy generation
  const handleGenerate = () => {
    if (!prompt.trim()) {
      toast({
        title: "Prompt Required",
        description: "Please enter a description for your visual strategy.",
        variant: "destructive",
      });
      return;
    }

    if (!user?.id) {
      toast({
        title: "Login Required",
        description: "Please log in to use AI features.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    // Auto-populate context from user's brand profile
    const userProfile = user?.profileData || {};
    const context = {
      brandStyle: userProfile.brandStyle || 'Professional minimalist',
      targetAudience: userProfile.targetAudience || 'Female entrepreneurs',
      platform: userProfile.primaryPlatform || 'Instagram',
      colorScheme: userProfile.colorScheme || 'Neutral tones',
      mood: userProfile.brandPersonality || 'Confident and approachable',
      industry: userProfile.industry || 'Personal branding',
      brandValues: userProfile.brandValues || [],
      contentGoals: userProfile.contentGoals || []
    };

    const requestData = {
      title: `${selectedPromptType.replace('-', ' ').toUpperCase()} Strategy - ${new Date().toLocaleDateString()}`,
      promptType: selectedPromptType,
      editingMode: selectedEditingMode,
      prompt,
      context,
      brandProfileSnapshot: userProfile,
      tags: ['ai-generated', selectedPromptType, selectedEditingMode]
    };

    generateStrategyMutation.mutate(requestData);
  };

  // Handle save strategy
  const handleSaveStrategy = () => {
    if (!generatedStrategy) return;
    saveStrategyMutation.mutate(generatedStrategy);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Navigation */}
      <section className="bg-white border-b border-gray-200 py-4">
        <div className="max-w-6xl mx-auto px-4">
          <Link 
            href="/studio"
            className="inline-flex items-center text-[#4C4B4B] hover:text-[#171719] transition-colors mb-4"
            className="font-neue"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Studio
          </Link>
          
          <nav className="flex gap-8">
            <Link 
              href="/studio/editor" 
              className="text-[#4C4B4B] hover:text-[#171719] transition-colors"
              style={{ fontFamily: 'Neue Einstellung, sans-serif', fontSize: '14px' }}
            >
              Selfie Editor
            </Link>
            <span 
              className="text-[#171719] font-medium border-b-2 border-[#171719] pb-1"
              style={{ fontFamily: 'Neue Einstellung, sans-serif', fontSize: '14px' }}
            >
              AI Visual Strategy
            </span>
          </nav>
        </div>
      </section>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 
            className="text-5xl md:text-6xl font-normal mb-8 uppercase tracking-wide text-[#171719]"
            className="font-cormorant"
          >
            AI Visual Strategy
          </h1>
          <div className="w-24 h-px mx-auto mb-8 bg-[#171719]"></div>
          <p 
            className="text-lg mb-12 max-w-2xl mx-auto text-[#4C4B4B]"
            style={{ fontFamily: 'Neue Einstellung, sans-serif', fontWeight: '300' }}
          >
            Generate comprehensive visual branding strategies powered by your brand profile
          </p>
        </div>
      </section>

      {/* Strategy Generator */}
      <section className="px-4 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white border border-black p-8 mb-8">
            <h2 
              className="text-2xl mb-6 text-black"
              className="font-cormorant"
            >
              Create Your Strategy
            </h2>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <Label className="text-black font-medium mb-2 block">Strategy Type</Label>
                <Select value={selectedPromptType} onValueChange={setSelectedPromptType}>
                  <SelectTrigger className="border-black">
                    <SelectValue placeholder="Select strategy type" />
                  </SelectTrigger>
                  <SelectContent>
                    {promptTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-black font-medium mb-2 block">Mode</Label>
                <Select value={selectedEditingMode} onValueChange={setSelectedEditingMode}>
                  <SelectTrigger className="border-black">
                    <SelectValue placeholder="Select mode" />
                  </SelectTrigger>
                  <SelectContent>
                    {editingModes.map((mode) => (
                      <SelectItem key={mode.value} value={mode.value}>
                        {mode.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mb-6">
              <Label className="text-black font-medium mb-2 block">
                Strategy Description
                {user?.profileData && (
                  <span className="text-sm font-normal text-gray-600 ml-2">
                    (Auto-populated from your brand profile)
                  </span>
                )}
              </Label>
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your visual strategy needs..."
                className="border-black min-h-[120px] resize-none"
                rows={5}
              />
            </div>

            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="bg-black text-white hover:bg-gray-800 px-8 py-3 text-sm font-bold uppercase tracking-wider border-none rounded-none w-full md:w-auto"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 mr-2" />
                  Generate Strategy
                </>
              )}
            </Button>
          </div>

          {/* Generated Strategy Display */}
          {generatedStrategy && (
            <div className="bg-white border border-black p-8 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 
                  className="text-2xl text-black"
                  className="font-cormorant"
                >
                  Your Visual Strategy
                </h2>
                <Button
                  onClick={handleSaveStrategy}
                  disabled={saveStrategyMutation.isPending}
                  className="bg-black text-white hover:bg-gray-800 px-6 py-2 text-sm font-bold uppercase tracking-wider border-none rounded-none"
                >
                  {saveStrategyMutation.isPending ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save to Vault
                    </>
                  )}
                </Button>
              </div>

              {showSaveSuccess && (
                <div className="bg-green-50 border border-green-200 p-4 mb-6 text-center">
                  <p className="text-green-800 font-medium">
                    Strategy saved to your Studio Vault!
                  </p>
                </div>
              )}

              <div className="space-y-8">
                {/* Visual Concepts */}
                <div>
                  <h3 className="text-lg font-medium text-black mb-3">Visual Concepts</h3>
                  <ul className="space-y-2">
                    {generatedStrategy.visualConcepts?.map((concept, index) => (
                      <li key={index} className="text-gray-700 flex items-start">
                        <span className="text-black mr-3">•</span>
                        {concept}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Design Elements */}
                <div>
                  <h3 className="text-lg font-medium text-black mb-3">Design Elements</h3>
                  <ul className="space-y-2">
                    {generatedStrategy.designElements?.map((element, index) => (
                      <li key={index} className="text-gray-700 flex items-start">
                        <span className="text-black mr-3">•</span>
                        {element}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Color Palette */}
                <div>
                  <h3 className="text-lg font-medium text-black mb-3">Color Palette</h3>
                  <div className="flex gap-3 mb-3">
                    {generatedStrategy.colorPalette?.map((color, index) => (
                      <div key={index} className="text-center">
                        <div 
                          className="w-16 h-16 border border-gray-300 mb-2"
                          style={{ backgroundColor: color }}
                        ></div>
                        <span className="text-xs text-gray-600 font-mono">{color}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Layout Suggestions */}
                <div>
                  <h3 className="text-lg font-medium text-black mb-3">Layout Suggestions</h3>
                  <ul className="space-y-2">
                    {generatedStrategy.layoutSuggestions?.map((suggestion, index) => (
                      <li key={index} className="text-gray-700 flex items-start">
                        <span className="text-black mr-3">•</span>
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Copy Options */}
                <div>
                  <h3 className="text-lg font-medium text-black mb-3">Copy Options</h3>
                  <ul className="space-y-2">
                    {generatedStrategy.copyOptions?.map((option, index) => (
                      <li key={index} className="text-gray-700 flex items-start">
                        <span className="text-black mr-3">•</span>
                        {option}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Branding Notes */}
                <div>
                  <h3 className="text-lg font-medium text-black mb-3">Branding Notes</h3>
                  <ul className="space-y-2">
                    {generatedStrategy.brandingNotes?.map((note, index) => (
                      <li key={index} className="text-gray-700 flex items-start">
                        <span className="text-black mr-3">•</span>
                        {note}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Technical Specs */}
                {generatedStrategy.technicalSpecs && (
                  <div>
                    <h3 className="text-lg font-medium text-black mb-3">Technical Specifications</h3>
                    <div className="bg-gray-50 p-4 space-y-2">
                      {generatedStrategy.technicalSpecs.dimensions && (
                        <p className="text-sm"><strong>Dimensions:</strong> {generatedStrategy.technicalSpecs.dimensions}</p>
                      )}
                      {generatedStrategy.technicalSpecs.format && (
                        <p className="text-sm"><strong>Format:</strong> {generatedStrategy.technicalSpecs.format}</p>
                      )}
                      {generatedStrategy.technicalSpecs.resolution && (
                        <p className="text-sm"><strong>Resolution:</strong> {generatedStrategy.technicalSpecs.resolution}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Saved Strategies */}
          {user?.id && (
            <div className="bg-white border border-black p-8">
              <h2 
                className="text-2xl mb-6 text-black"
                className="font-cormorant"
              >
                Your Saved Strategies
              </h2>

              {strategiesLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin w-6 h-6 border-2 border-black border-t-transparent rounded-full mx-auto mb-2"></div>
                  <p className="text-sm text-gray-600">Loading your strategies...</p>
                </div>
              ) : userStrategies && userStrategies.length > 0 ? (
                <div className="space-y-4">
                  {userStrategies.slice(0, 5).map((strategy: any) => (
                    <div key={strategy.id} className="border border-gray-200 p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-black">{strategy.type.replace('-', ' ').toUpperCase()}</h4>
                        <span className="text-xs text-gray-500">
                          {new Date(strategy.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      {strategy.content_generated?.visualConcepts && (
                        <p className="text-sm text-gray-600">
                          {strategy.content_generated.visualConcepts[0]}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Sparkles className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">No saved strategies yet. Generate your first one above!</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}