
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Target, Users, Lightbulb, TrendingUp, Copy, Instagram, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";

interface StrategyResponse {
  nicheRecommendation: string;
  contentPillars: string[];
  targetAudience: string;
  postingStrategy: string;
  instagramOptimization: string[];
  gettingStartedSteps: string[];
  personalNote: string;
}

interface StrategyCoachProps {
  user?: any;
}

export default function StrategyCoach({ user }: StrategyCoachProps) {
  const [selectedGoal, setSelectedGoal] = useState<string>("build-brand");
  const [userBackground, setUserBackground] = useState<string>("");
  const [currentSituation, setCurrentSituation] = useState<string>("");
  const [strategyResponse, setStrategyResponse] = useState<StrategyResponse | null>(null);
  const { toast } = useToast();

  const strategyMutation = useMutation({
    mutationFn: async (data: { goal: string; background?: string; situation?: string }) => {
      const response = await fetch("/api/strategy-coach", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json"
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || "Failed to get strategy advice");
      }

      return response.json();
    },
    onSuccess: (data: StrategyResponse) => {
      setStrategyResponse(data);
      toast({
        title: "Strategy Ready!",
        description: "Your personalized Instagram strategy is here.",
      });
    },
    onError: (error: any) => {
      console.error('Strategy generation error:', error);
      toast({
        title: "Strategy Failed",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    },
  });

  // Query to check if user has existing strategy data
  const { data: existingStrategy } = useQuery({
    queryKey: ['strategy-coach', user?.id],
    queryFn: async () => {
      // This would fetch any cached strategy if the backend supports it
      // For now, we'll return null to always generate fresh
      return null;
    },
    enabled: !!user?.id,
    retry: false,
    staleTime: 0,
  });

  const getStrategy = () => {
    if (!selectedGoal) {
      toast({
        title: "Goal Required",
        description: "Please select your main goal first.",
        variant: "destructive",
      });
      return;
    }

    strategyMutation.mutate({
      goal: selectedGoal,
      background: userBackground || undefined,
      situation: currentSituation || undefined,
    });
  };

  const copyToClipboard = (text: string | string[]) => {
    const textToCopy = Array.isArray(text) ? text.join('\n') : text;
    navigator.clipboard.writeText(textToCopy);
    toast({
      title: "Copied!",
      description: "Strategy content copied to clipboard.",
    });
  };

  const goals = [
    { value: "build-brand", label: "Build Personal Brand", description: "Create a strong personal brand from scratch" },
    { value: "grow-following", label: "Grow My Following", description: "Increase Instagram followers and engagement" },
    { value: "find-niche", label: "Find My Niche", description: "Discover what makes me unique and marketable" },
    { value: "monetize", label: "Start Monetizing", description: "Turn my content into income streams" },
    { value: "restart", label: "Fresh Start", description: "Completely rebrand and start over" },
    { value: "content-strategy", label: "Content Strategy", description: "Plan what to post and when" },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Niche & Strategy Coach - Build Your Instagram Empire
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Goal Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">What's your main goal?</h3>
            <Select value={selectedGoal} onValueChange={setSelectedGoal}>
              <SelectTrigger>
                <SelectValue placeholder="Choose your primary goal" />
              </SelectTrigger>
              <SelectContent>
                {goals.map((goal) => (
                  <SelectItem key={goal.value} value={goal.value}>
                    <div>
                      <div className="font-medium">{goal.label}</div>
                      <div className="text-xs text-gray-500">{goal.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Background Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Tell me about yourself</h3>
            <Textarea
              placeholder="What do you do? What are you passionate about? What's your background or expertise? (e.g., I'm a working mom, fitness enthusiast, started my own business...)"
              value={userBackground}
              onChange={(e) => setUserBackground(e.target.value)}
              rows={3}
              disabled={strategyMutation.isPending}
            />
          </div>

          {/* Current Situation */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Where are you now with Instagram?</h3>
            <Textarea
              placeholder="What's your current situation? Complete beginner? Have an account but struggling? Inconsistent posting? Not sure what to share? The more you tell me, the better I can help..."
              value={currentSituation}
              onChange={(e) => setCurrentSituation(e.target.value)}
              rows={3}
              disabled={strategyMutation.isPending}
            />
            <p className="text-sm text-gray-600">
              💡 Be honest about your challenges - that's how we create a strategy that actually works for you!
            </p>
          </div>

          {/* Get Strategy Button */}
          <Button 
            onClick={getStrategy} 
            disabled={strategyMutation.isPending || !selectedGoal}
            className="w-full"
            size="lg"
          >
            {strategyMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating Your Strategy...
              </>
            ) : (
              <>
                <Target className="w-4 h-4 mr-2" />
                Get My Instagram Strategy
              </>
            )}
          </Button>

          {/* Error Display */}
          {strategyMutation.isError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">
                Failed to generate strategy. Please try again or contact support if the issue persists.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Strategy Response */}
      {strategyResponse && (
        <div className="space-y-6">
          {/* Niche Recommendation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                Your Unique Niche
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="outline">Personalized Recommendation</Badge>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(strategyResponse.nicheRecommendation)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-sm bg-blue-50 p-4 rounded-lg border border-blue-200 leading-relaxed">
                  {strategyResponse.nicheRecommendation}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Content Pillars */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Your Content Pillars
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {strategyResponse.contentPillars.map((pillar, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">Pillar {index + 1}</Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(pillar)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-sm bg-green-50 p-3 rounded-lg border border-green-200">{pillar}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Target Audience */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Your Ideal Audience
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="outline">Target Audience</Badge>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(strategyResponse.targetAudience)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-sm bg-purple-50 p-4 rounded-lg border border-purple-200 leading-relaxed">
                  {strategyResponse.targetAudience}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Posting Strategy */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Instagram className="w-5 h-5" />
                Posting Strategy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="outline">Content Schedule</Badge>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(strategyResponse.postingStrategy)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-sm bg-amber-50 p-4 rounded-lg border border-amber-200 leading-relaxed">
                  {strategyResponse.postingStrategy}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Instagram Optimization */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Instagram className="w-5 h-5" />
                Profile Optimization
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {strategyResponse.instagramOptimization.map((tip, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">Optimization {index + 1}</Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(tip)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-sm bg-indigo-50 p-3 rounded-lg border border-indigo-200">{tip}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Getting Started Steps */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Your Action Plan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {strategyResponse.gettingStartedSteps.map((step, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">Step {index + 1}</Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(step)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-sm bg-rose-50 p-3 rounded-lg border border-rose-200">{step}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Personal Note */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Personal Note from Sandra
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm bg-pink-50 p-4 rounded-lg border border-pink-200 leading-relaxed italic">
                {strategyResponse.personalNote}
              </p>
            </CardContent>
          </Card>

          {/* Action Button */}
          <Card>
            <CardContent className="pt-6">
              <Button 
                onClick={() => {
                  setStrategyResponse(null);
                  setUserBackground("");
                  setCurrentSituation("");
                  setSelectedGoal("build-brand");
                }}
                variant="outline"
                className="w-full"
              >
                Generate New Strategy
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
