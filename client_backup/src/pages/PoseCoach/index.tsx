
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Camera, Copy, ArrowLeft, Loader2, History } from 'lucide-react';
import { Link } from 'wouter';
import Footer from '@/components/layout/Footer';

interface PoseSession {
  id: string;
  poseType: 'branding' | 'reel' | 'selfie' | 'custom';
  inputContext: {
    useCase?: string;
    mood?: string;
    brandTone?: string;
    cameraSetup?: string;
    location?: string;
    outfit?: string;
    targetAudience?: string;
    contentGoal?: string;
  };
  aiSuggestions: {
    poses?: Array<{
      name: string;
      description: string;
      instructions: string[];
      mood: string;
      difficulty: 'beginner' | 'intermediate' | 'advanced';
      tips: string[];
    }>;
    cameraAngles?: Array<{
      angle: string;
      description: string;
      effect: string;
    }>;
    lightingTips?: string[];
    expressionGuidance?: Array<{
      expression: string;
      description: string;
      when: string;
    }>;
    outfitRecommendations?: string[];
    backgroundSuggestions?: string[];
    brandAlignment?: {
      tone: string;
      messaging: string[];
      visualElements: string[];
    };
  };
  createdAt: string;
}

interface PoseCoachProps {
  user?: any;
}

export default function PoseCoach({ user }: PoseCoachProps) {
  const [selectedPoseType, setSelectedPoseType] = useState<string>("selfie");
  const [inputContext, setInputContext] = useState({
    useCase: "",
    mood: "",
    brandTone: "",
    cameraSetup: "",
    location: "",
    outfit: "",
    targetAudience: "",
    contentGoal: "",
  });
  const [currentSession, setCurrentSession] = useState<PoseSession | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const { toast } = useToast();

  // Generate pose suggestions mutation
  const generatePoseMutation = useMutation({
    mutationFn: async (data: { poseType: string; inputContext: any }) => {
      const response = await fetch("/api/pose-coach", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json"
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to generate pose suggestions");
      }

      return response.json();
    },
    onSuccess: (data) => {
      setCurrentSession(data.data);
      toast({
        title: "Pose Guide Ready!",
        description: "Sandra's pose coaching is here for you.",
      });
    },
    onError: (error: any) => {
      console.error('Pose generation error:', error);
      toast({
        title: "Generation Failed",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    },
  });

  // Fetch pose history
  const { data: poseHistory, isLoading: historyLoading } = useQuery({
    queryKey: ['pose-history'],
    queryFn: async () => {
      const response = await fetch("/api/pose-coach/history?limit=10", {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error("Failed to fetch pose history");
      }

      const result = await response.json();
      return result.data || [];
    },
    enabled: showHistory,
    retry: false,
  });

  const generatePoses = () => {
    if (!selectedPoseType) {
      toast({
        title: "Pose Type Required",
        description: "Please select a pose type first.",
        variant: "destructive",
      });
      return;
    }

    // Filter out empty context values
    const filteredContext = Object.fromEntries(
      Object.entries(inputContext).filter(([_, value]) => value.trim() !== "")
    );

    generatePoseMutation.mutate({
      poseType: selectedPoseType,
      inputContext: filteredContext,
    });
  };

  const copyToClipboard = (text: string | string[]) => {
    const textToCopy = Array.isArray(text) ? text.join('\n') : text;
    navigator.clipboard.writeText(textToCopy);
    toast({
      title: "Copied!",
      description: "Pose guidance copied to clipboard.",
    });
  };

  const loadHistorySession = (session: PoseSession) => {
    setCurrentSession(session);
    setSelectedPoseType(session.poseType);
    setInputContext(session.inputContext);
    setShowHistory(false);
  };

  const poseTypes = [
    { value: "selfie", label: "Selfie & Portrait" },
    { value: "branding", label: "Personal Branding" },
    { value: "reel", label: "Reel & Video Content" },
    { value: "custom", label: "Custom Session" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-6">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/studio">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Studio
                </Button>
              </Link>
              <div>
                <h1 className="font-['Prata'] text-3xl text-black">Pose Coach</h1>
                <p className="text-gray-600 mt-1">Get personalized posing guidance from Sandra</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center gap-2"
            >
              <History className="w-4 h-4" />
              {showHistory ? "Hide History" : "View History"}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="w-5 h-5" />
                  Generate Pose Guide
                </CardTitle>
                <CardDescription>
                  Get AI-powered pose suggestions tailored to your needs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="poseType">Pose Type</Label>
                  <Select value={selectedPoseType} onValueChange={setSelectedPoseType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose pose type" />
                    </SelectTrigger>
                    <SelectContent>
                      {poseTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="useCase">Use Case</Label>
                    <Input
                      id="useCase"
                      placeholder="LinkedIn profile, Instagram post..."
                      value={inputContext.useCase}
                      onChange={(e) => setInputContext(prev => ({ ...prev, useCase: e.target.value }))}
                      disabled={generatePoseMutation.isPending}
                    />
                  </div>
                  <div>
                    <Label htmlFor="mood">Mood</Label>
                    <Input
                      id="mood"
                      placeholder="Professional, casual, confident..."
                      value={inputContext.mood}
                      onChange={(e) => setInputContext(prev => ({ ...prev, mood: e.target.value }))}
                      disabled={generatePoseMutation.isPending}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="brandTone">Brand Tone</Label>
                    <Input
                      id="brandTone"
                      placeholder="Approachable, authoritative..."
                      value={inputContext.brandTone}
                      onChange={(e) => setInputContext(prev => ({ ...prev, brandTone: e.target.value }))}
                      disabled={generatePoseMutation.isPending}
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      placeholder="Office, outdoors, studio..."
                      value={inputContext.location}
                      onChange={(e) => setInputContext(prev => ({ ...prev, location: e.target.value }))}
                      disabled={generatePoseMutation.isPending}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="contentGoal">Content Goal</Label>
                  <Textarea
                    id="contentGoal"
                    placeholder="What do you want to achieve with this content? (e.g., build trust, showcase expertise, increase engagement...)"
                    value={inputContext.contentGoal}
                    onChange={(e) => setInputContext(prev => ({ ...prev, contentGoal: e.target.value }))}
                    rows={3}
                    disabled={generatePoseMutation.isPending}
                  />
                </div>

                <Button 
                  onClick={generatePoses}
                  disabled={generatePoseMutation.isPending || !selectedPoseType}
                  className="w-full bg-black text-white hover:bg-gray-800"
                  size="lg"
                >
                  {generatePoseMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating Poses...
                    </>
                  ) : (
                    <>
                      <Camera className="w-4 h-4 mr-2" />
                      Get Sandra's Pose Guide
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* History Section */}
            {showHistory && (
              <Card>
                <CardHeader>
                  <CardTitle>Recent Sessions</CardTitle>
                </CardHeader>
                <CardContent>
                  {historyLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin" />
                    </div>
                  ) : poseHistory?.length > 0 ? (
                    <div className="space-y-3">
                      {poseHistory.map((session: PoseSession) => (
                        <div
                          key={session.id}
                          className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                          onClick={() => loadHistorySession(session)}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-sm">{session.poseType} - {session.inputContext.useCase || 'General'}</p>
                              <p className="text-xs text-gray-500">
                                {new Date(session.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <Button variant="outline" size="sm">Load</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">No previous sessions found</p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Response Section */}
          <div className="space-y-6">
            {!currentSession ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-12">
                    <Camera className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">Generate a pose guide to see Sandra's coaching</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Poses */}
                {currentSession.aiSuggestions.poses && currentSession.aiSuggestions.poses.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        Pose Suggestions
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(
                            currentSession.aiSuggestions.poses?.map(pose => 
                              `${pose.name}: ${pose.description}\nInstructions: ${pose.instructions.join(', ')}`
                            ) || []
                          )}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {currentSession.aiSuggestions.poses.map((pose, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold">{pose.name}</h4>
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded">{pose.difficulty}</span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{pose.description}</p>
                          <div className="space-y-2">
                            <p className="text-xs font-medium">Instructions:</p>
                            <ul className="text-xs text-gray-600 space-y-1">
                              {pose.instructions.map((instruction, i) => (
                                <li key={i}>• {instruction}</li>
                              ))}
                            </ul>
                          </div>
                          {pose.tips.length > 0 && (
                            <div className="mt-2 pt-2 border-t">
                              <p className="text-xs font-medium">Tips:</p>
                              <ul className="text-xs text-gray-600 space-y-1">
                                {pose.tips.map((tip, i) => (
                                  <li key={i}>• {tip}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {/* Camera Angles */}
                {currentSession.aiSuggestions.cameraAngles && currentSession.aiSuggestions.cameraAngles.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        Camera Angles
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(
                            currentSession.aiSuggestions.cameraAngles?.map(angle => 
                              `${angle.angle}: ${angle.description} - ${angle.effect}`
                            ) || []
                          )}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {currentSession.aiSuggestions.cameraAngles.map((angle, index) => (
                        <div key={index} className="border rounded-lg p-3">
                          <h4 className="font-semibold text-sm">{angle.angle}</h4>
                          <p className="text-sm text-gray-600">{angle.description}</p>
                          <p className="text-xs text-gray-500 mt-1">Effect: {angle.effect}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {/* Lighting Tips */}
                {currentSession.aiSuggestions.lightingTips && currentSession.aiSuggestions.lightingTips.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        Lighting Guidance
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(currentSession.aiSuggestions.lightingTips || [])}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {currentSession.aiSuggestions.lightingTips.map((tip, index) => (
                          <li key={index} className="text-sm text-gray-700">• {tip}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {/* Expression Guidance */}
                {currentSession.aiSuggestions.expressionGuidance && currentSession.aiSuggestions.expressionGuidance.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        Expression Guide
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(
                            currentSession.aiSuggestions.expressionGuidance?.map(expr => 
                              `${expr.expression}: ${expr.description} (${expr.when})`
                            ) || []
                          )}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {currentSession.aiSuggestions.expressionGuidance.map((expr, index) => (
                        <div key={index} className="border rounded-lg p-3">
                          <h4 className="font-semibold text-sm">{expr.expression}</h4>
                          <p className="text-sm text-gray-600">{expr.description}</p>
                          <p className="text-xs text-gray-500 mt-1">When: {expr.when}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {/* Brand Alignment */}
                {currentSession.aiSuggestions.brandAlignment && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        Brand Alignment
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(
                            `Tone: ${currentSession.aiSuggestions.brandAlignment?.tone}\nMessaging: ${currentSession.aiSuggestions.brandAlignment?.messaging.join(', ')}\nVisual Elements: ${currentSession.aiSuggestions.brandAlignment?.visualElements.join(', ')}`
                          )}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-sm">Brand Tone</h4>
                        <p className="text-sm text-gray-600">{currentSession.aiSuggestions.brandAlignment.tone}</p>
                      </div>
                      {currentSession.aiSuggestions.brandAlignment.messaging.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-sm">Key Messages</h4>
                          <ul className="text-sm text-gray-600">
                            {currentSession.aiSuggestions.brandAlignment.messaging.map((msg, i) => (
                              <li key={i}>• {msg}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {currentSession.aiSuggestions.brandAlignment.visualElements.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-sm">Visual Elements</h4>
                          <ul className="text-sm text-gray-600">
                            {currentSession.aiSuggestions.brandAlignment.visualElements.map((element, i) => (
                              <li key={i}>• {element}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Generate New Session Button */}
                <Card>
                  <CardContent className="pt-6">
                    <Button 
                      onClick={() => {
                        setCurrentSession(null);
                        setInputContext({
                          useCase: "",
                          mood: "",
                          brandTone: "",
                          cameraSetup: "",
                          location: "",
                          outfit: "",
                          targetAudience: "",
                          contentGoal: "",
                        });
                      }}
                      variant="outline"
                      className="w-full"
                    >
                      Generate New Pose Guide
                    </Button>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
