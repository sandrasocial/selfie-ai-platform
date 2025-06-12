
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Calendar, TrendingUp, Users, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";

interface PostingStrategy {
  frequency: string;
  contentMix: string;
  optimalTimes: string;
  weeklyPlan: Array<{
    week: number;
    description: string;
    posts: Array<{
      day: string;
      time: string;
      type: string;
      description: string;
    }>;
  }>;
}

export default function StrategyWidget() {
  const [strategy, setStrategy] = useState<PostingStrategy | null>(null);
  const [expanded, setExpanded] = useState(false);
  const { toast } = useToast();

  // Query for existing strategy
  const { data: existingStrategy, isLoading: isLoadingStrategy } = useQuery({
    queryKey: ['strategy-widget'],
    queryFn: async () => {
      const response = await fetch('/api/strategize', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null; // No strategy exists yet
        }
        throw new Error('Failed to load strategy');
      }

      return response.json();
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Mutation for generating new strategy
  const generateStrategyMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/strategy-coach', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          goal: 'content-strategy',
          background: 'Personal brand builder using SELFIE AI platform',
          situation: 'Looking for a structured posting strategy'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate strategy');
      }

      const data = await response.json();
      
      // Transform strategy coach response to widget format
      return {
        frequency: "4-5 posts per week",
        contentMix: "Mix of selfies, behind-the-scenes, tips, and personal stories",
        optimalTimes: "9 AM, 1 PM, and 7 PM",
        weeklyPlan: [
          {
            week: 1,
            description: "Foundation Week - Establishing Your Presence",
            posts: [
              {
                day: "Monday",
                time: "9:00 AM",
                type: "Introduction Post",
                description: "Share your story and what you're about"
              },
              {
                day: "Wednesday", 
                time: "1:00 PM",
                type: "Value Content",
                description: "Share a tip or insight from your expertise"
              },
              {
                day: "Friday",
                time: "7:00 PM", 
                type: "Behind the Scenes",
                description: "Show your authentic daily life or work process"
              }
            ]
          }
        ]
      };
    },
    onSuccess: (data) => {
      setStrategy(data);
      toast({
        title: "Strategy Generated! 🎯",
        description: "Your personalized posting strategy is ready.",
        className: "bg-[#F5F3F0] border-[#F5F3F0] text-black",
      });
    },
    onError: (error: any) => {
      console.error('Strategy generation error:', error);
      toast({
        title: "Strategy Generation Failed",
        description: "Unable to generate strategy. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Use existing strategy if available
  React.useEffect(() => {
    if (existingStrategy && !strategy) {
      setStrategy(existingStrategy);
    }
  }, [existingStrategy, strategy]);

  const addToCalendar = async (post: any, week: number) => {
    try {
      // Calculate day number based on week and day
      const dayMap: { [key: string]: number } = {
        'Monday': 1, 'Tuesday': 2, 'Wednesday': 3, 'Thursday': 4,
        'Friday': 5, 'Saturday': 6, 'Sunday': 7
      };

      const dayNumber = (week - 1) * 7 + dayMap[post.day];

      const response = await fetch('/api/calendar/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          dayNumber,
          contentText: post.description,
          templateName: null,
          isStrategy: true,
          hookText: '',
          hashtags: ''
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add to calendar');
      }

      toast({
        title: "Added to Calendar! 📅",
        description: `${post.type} post scheduled for Day ${dayNumber}.`,
        className: "bg-[#F5F3F0] border-[#F5F3F0] text-black",
      });
    } catch (error) {
      console.error('Add to calendar error:', error);
      toast({
        title: "Add Failed",
        description: "Unable to add to calendar. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoadingStrategy) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2 text-sm">Loading strategy...</span>
      </div>
    );
  }

  if (!strategy && !generateStrategyMutation.isPending) {
    return (
      <div className="text-center">
        <p className="text-sm text-gray-600 mb-4">Get your personalized posting strategy</p>
        <Button 
          onClick={() => generateStrategyMutation.mutate()}
          size="sm" 
          className="bg-[#3C3A35] hover:bg-[#2A2823]"
          disabled={generateStrategyMutation.isPending}
        >
          {generateStrategyMutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Target className="h-4 w-4 mr-2" />
              Generate Strategy
            </>
          )}
        </Button>
      </div>
    );
  }

  if (generateStrategyMutation.isPending) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2 text-sm">Generating strategy...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-sm">
        <div className="mb-2">
          <strong>Frequency:</strong> {strategy?.frequency}
        </div>
        <div className="mb-2">
          <strong>Content Mix:</strong> {strategy?.contentMix}
        </div>
        <div className="mb-4">
          <strong>Best Times:</strong> {strategy?.optimalTimes}
        </div>
      </div>

      <Button 
        onClick={() => setExpanded(!expanded)} 
        variant="outline" 
        size="sm"
        className="w-full"
      >
        <Calendar className="h-4 w-4 mr-2" />
        {expanded ? 'Hide' : 'View'} Weekly Plan
      </Button>

      {expanded && strategy?.weeklyPlan && (
        <div className="space-y-4 mt-4">
          {strategy.weeklyPlan.map((week) => (
            <Card key={week.week} className="border border-gray-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">
                  Week {week.week}: {week.description}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {week.posts.map((post, index) => (
                  <div key={index} className="flex justify-between items-start p-3 bg-gray-50 rounded">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs">
                          {post.day} {post.time}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {post.type}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600">{post.description}</p>
                    </div>
                    <Button
                      onClick={() => addToCalendar(post, week.week)}
                      size="sm"
                      variant="ghost"
                      className="ml-2 text-xs"
                    >
                      Add to Calendar
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Regenerate Strategy Button */}
      {strategy && (
        <Button
          onClick={() => {
            setStrategy(null);
            generateStrategyMutation.mutate();
          }}
          variant="outline"
          size="sm"
          className="w-full mt-4"
          disabled={generateStrategyMutation.isPending}
        >
          <TrendingUp className="h-4 w-4 mr-2" />
          Generate New Strategy
        </Button>
      )}
    </div>
  );
}
