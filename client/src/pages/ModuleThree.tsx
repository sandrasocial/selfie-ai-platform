
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Link } from "wouter";
import { ArrowLeft, Download, Sparkles } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

function debounce(func: Function, wait: number) {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export default function ModuleThree() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    contentPillars: "",
    audienceProblems: "",
    uniquePerspective: ""
  });
  const [generatedWorkbook, setGeneratedWorkbook] = useState<any>(null);
  const [showWorkbook, setShowWorkbook] = useState(false);

  const saveAnswers = async (answers: any) => {
    try {
      await fetch('/api/module3-save-answers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(answers),
      });
    } catch (error) {
      console.error('Auto-save failed:', error);
    }
  };

  const debouncedSave = debounce((answers: any) => saveAnswers(answers), 800);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    setFormData(updated);
    debouncedSave(updated);
  };

  useEffect(() => {
    try {
      const savedAnswers = localStorage.getItem('module3-answers');
      if (savedAnswers) {
        const data = JSON.parse(savedAnswers);
        setFormData(data);
      }
    } catch (err) {
      console.error("Error loading from localStorage:", err);
    }
  }, []);

  const generateWorkbookMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/module3-workbook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    },
    onSuccess: (data) => {
      if (data && typeof data === 'object') {
        setGeneratedWorkbook(data);
        setShowWorkbook(true);
        toast({
          title: "Your Content Strategy is Ready! 🖤",
          description: "Your personalized content framework has been generated.",
        });
      } else {
        toast({
          title: "Generation Error",
          description: "Invalid response format received.",
          variant: "destructive",
        });
      }
    },
    onError: () => {
      toast({
        title: "Generation Failed",
        description: "Please try again or check your responses.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!formData.contentPillars.trim() || !formData.audienceProblems.trim() || !formData.uniquePerspective.trim()) {
      toast({
        title: "Please Complete All Fields",
        description: "All three questions need responses to generate your strategy.",
        variant: "destructive",
      });
      return;
    }

    generateWorkbookMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <div className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm z-50 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/blueprint" className="flex items-center gap-2 text-black hover:text-gray-600 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Blueprint</span>
          </Link>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="w-4 h-4" />
              Download PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Hero Section with Banner Image */}
      <div className="pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Banner Image Placeholder */}
          <div className="w-full h-64 md:h-80 bg-gray-100 rounded-lg shadow-lg mb-12 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <div className="text-lg font-medium mb-2">Module 3 Banner</div>
              <div className="text-sm">module3-banner.jpg</div>
            </div>
          </div>
          
          <div className="text-center">
            <div className="mb-8">
              <div className="text-sm font-medium text-gray-500 mb-4 tracking-wider uppercase">
                The SELFIE BLUEPRINT
              </div>
              <h1 className="text-5xl md:text-6xl font-serif text-black mb-6 leading-tight">
                MODULE 3
              </h1>
              <h2 className="text-2xl md:text-3xl font-serif text-black mb-8">
                Your Content Strategy That Actually Works
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed max-w-2xl mx-auto">
                Stop posting random content and start building a strategy that positions you as the go-to expert in your space. This is where we turn your voice into your competitive advantage.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-6 pb-24">
        
        {/* Introduction */}
        <Card className="mb-12 border-0 shadow-none bg-gray-50">
          <CardContent className="p-8">
            <p className="text-lg text-gray-800 leading-relaxed mb-6">
              You've got your story. You've got your message. Now it's time to turn that into content that actually moves the needle.
            </p>
            <p className="text-xl font-medium text-black">
              This is where strategy meets storytelling.
            </p>
          </CardContent>
        </Card>

        {/* Why Most Content Strategies Fail */}
        <div className="mb-16">
          <h3 className="text-3xl font-serif text-black mb-8">Why Most Content Strategies Fail</h3>
          <div className="space-y-6">
            <p className="text-lg text-gray-700 leading-relaxed">
              Most people think content strategy is about posting consistently.
            </p>
            <p className="text-xl font-medium text-black">
              But consistency without clarity is just noise.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              You can post every day, but if your content doesn't have a clear purpose, a clear message, and a clear outcome... you're just adding to the noise.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              This module is different. We're building a content strategy that actually positions you as an expert, builds trust, and converts your audience into customers.
            </p>
          </div>
        </div>

        {/* Content That Converts */}
        <div className="mb-16">
          <h3 className="text-3xl font-serif text-black mb-8">Content That Converts Starts with Purpose</h3>
          <div className="space-y-6">
            <p className="text-lg text-gray-700 leading-relaxed">
              Every piece of content you create should do one of three things:
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border-0 bg-gray-50">
                <CardContent className="p-6">
                  <h5 className="text-lg font-medium text-black mb-3">Build Trust</h5>
                  <p className="text-gray-700">Show your expertise and help your audience see you as the solution.</p>
                </CardContent>
              </Card>
              <Card className="border-0 bg-gray-50">
                <CardContent className="p-6">
                  <h5 className="text-lg font-medium text-black mb-3">Create Connection</h5>
                  <p className="text-gray-700">Share your perspective and values so people feel aligned with you.</p>
                </CardContent>
              </Card>
              <Card className="border-0 bg-black text-white">
                <CardContent className="p-6">
                  <h5 className="text-lg font-medium text-white mb-3">Drive Action</h5>
                  <p className="text-gray-300">Move people closer to working with you or buying from you.</p>
                </CardContent>
              </Card>
            </div>
            <p className="text-lg text-gray-700 leading-relaxed">
              If your content doesn't do at least one of these things, it's not strategic. It's just filler.
            </p>
          </div>
        </div>

        {/* The Three Pillar Framework */}
        <div className="mb-16">
          <h3 className="text-3xl font-serif text-black mb-8">The Three-Pillar Content Framework</h3>
          <div className="space-y-6">
            <p className="text-lg text-gray-700 leading-relaxed">
              Every successful personal brand has three core content pillars that everything else is built around:
            </p>
            <div className="space-y-8">
              <div className="border-l-4 border-black pl-6">
                <h4 className="text-xl font-medium text-black mb-3">Pillar 1: Your Expertise</h4>
                <p className="text-lg text-gray-700">This is where you teach, share insights, and show that you know what you're talking about. Your expertise pillar builds credibility.</p>
              </div>
              <div className="border-l-4 border-gray-300 pl-6">
                <h4 className="text-xl font-medium text-black mb-3">Pillar 2: Your Personality</h4>
                <p className="text-lg text-gray-700">This is where you share your opinions, your values, and your unique perspective. Your personality pillar builds connection.</p>
              </div>
              <div className="border-l-4 border-gray-300 pl-6">
                <h4 className="text-xl font-medium text-black mb-3">Pillar 3: Your Process</h4>
                <p className="text-lg text-gray-700">This is where you share how you work, your methodology, and what it's like to work with you. Your process pillar builds desire.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stop Creating Content for Everyone */}
        <Card className="mb-16 border-0 bg-black text-white">
          <CardContent className="p-8">
            <h4 className="text-2xl font-serif text-white mb-6">Stop Creating Content for "Everyone"</h4>
            <div className="space-y-4">
              <p className="text-lg text-gray-300">When you try to speak to everyone, you speak to no one.</p>
              <p className="text-xl font-medium text-white">Your content should repel as much as it attracts.</p>
              <p className="text-lg text-gray-300">
                The people who don't align with your message aren't your people anyway. Stop trying to please them.
              </p>
              <p className="text-lg text-gray-300">
                Your ideal clients are waiting for someone who thinks like them, speaks like them, and understands them.
              </p>
              <p className="text-lg font-medium text-white">
                Be that person. Unapologetically.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Your Audience's Real Problem */}
        <div className="mb-16">
          <h3 className="text-3xl font-serif text-black mb-8">Your Audience's Real Problem Isn't What You Think</h3>
          <div className="space-y-6">
            <p className="text-lg text-gray-700 leading-relaxed">
              Most content creators focus on surface-level problems. "How to get more followers." "How to make more money."
            </p>
            <p className="text-xl font-medium text-black">
              But the real problems run deeper.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Your audience doesn't just want more followers. They want to feel confident about their message.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              They don't just want more money. They want to feel worthy of charging premium prices.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              When you address the emotional problem underneath the practical problem, that's when your content becomes magnetic.
            </p>
          </div>
        </div>

        {/* The Content that Gets Saved */}
        <div className="mb-16">
          <h3 className="text-3xl font-serif text-black mb-8">The Content That Gets Saved, Shared, and Sold</h3>
          <div className="space-y-6">
            <p className="text-lg text-gray-700 leading-relaxed">
              There's a difference between content that gets liked and content that gets results.
            </p>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h5 className="text-lg font-medium text-gray-600 mb-3">Content that gets liked:</h5>
                <ul className="space-y-2 text-gray-700">
                  <li>• Generic tips</li>
                  <li>• Motivational quotes</li>
                  <li>• Trending topics</li>
                  <li>• Safe opinions</li>
                </ul>
              </div>
              <div>
                <h5 className="text-lg font-medium text-black mb-3">Content that gets results:</h5>
                <ul className="space-y-2 text-gray-700">
                  <li>• Specific insights</li>
                  <li>• Personal stories</li>
                  <li>• Contrarian perspectives</li>
                  <li>• Bold statements</li>
                </ul>
              </div>
            </div>
            <p className="text-xl font-medium text-black">
              Stop chasing likes. Start creating content that changes minds.
            </p>
          </div>
        </div>

        {/* Your Unique Perspective */}
        <div className="mb-16">
          <h3 className="text-3xl font-serif text-black mb-8">Your Unique Perspective is Your Competitive Advantage</h3>
          <div className="space-y-6">
            <p className="text-lg text-gray-700 leading-relaxed">
              Anyone can share tips. Anyone can give advice. But only you can share your unique perspective.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Your perspective is shaped by your experiences, your values, your background, and your vision for the future.
            </p>
            <p className="text-xl font-medium text-black">
              That perspective is what makes you irreplaceable.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              When you lead with your perspective, you don't compete on features or benefits. You compete on vision.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              And vision always wins.
            </p>
          </div>
        </div>

        {/* Content Strategy Framework */}
        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="w-6 h-6 text-black" />
              <h4 className="text-2xl font-serif text-black">Your Strategic Content Framework</h4>
            </div>
            <p className="text-lg text-gray-700 mb-8">
              Answer these three questions to generate your personalized content strategy and messaging framework.
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-3">
                <Label htmlFor="contentPillars" className="text-lg font-medium text-black">
                  What are the three main topics you want to be known for?
                </Label>
                <p className="text-sm text-gray-600 mb-3">
                  These will become your content pillars - the foundation of everything you create.
                </p>
                <Textarea
                  id="contentPillars"
                  name="contentPillars"
                  placeholder="My three main content pillars are..."
                  value={formData.contentPillars}
                  onChange={handleChange}
                  className="min-h-[120px] text-base rounded-md"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="audienceProblems" className="text-lg font-medium text-black">
                  What's the deeper emotional problem your audience is struggling with?
                </Label>
                <p className="text-sm text-gray-600 mb-3">
                  Go beyond the surface-level issues to the real feelings underneath.
                </p>
                <Textarea
                  id="audienceProblems"
                  name="audienceProblems"
                  placeholder="The real problem my audience faces is..."
                  value={formData.audienceProblems}
                  onChange={handleChange}
                  className="min-h-[120px] text-base rounded-md"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="uniquePerspective" className="text-lg font-medium text-black">
                  What's your unique perspective on your industry that others aren't talking about?
                </Label>
                <p className="text-sm text-gray-600 mb-3">
                  This is your contrarian take, your fresh angle, your competitive advantage.
                </p>
                <Textarea
                  id="uniquePerspective"
                  name="uniquePerspective"
                  placeholder="My unique perspective is..."
                  value={formData.uniquePerspective}
                  onChange={handleChange}
                  className="min-h-[120px] text-base rounded-md"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-black text-white hover:bg-gray-800 py-4 text-lg rounded-md"
                disabled={generateWorkbookMutation.isPending}
              >
                {generateWorkbookMutation.isPending ? (
                  "Generating Your Strategy..."
                ) : (
                  "Generate My Content Strategy 🖤"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Generated Workbook Preview */}
        {showWorkbook && generatedWorkbook && (
          <Card className="border-2 border-black mt-12">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-2xl font-serif text-black">Your Strategic Content Framework</h4>
                <Button 
                  onClick={() => window.open(`/api/module3-workbook/pdf/${generatedWorkbook.id}`, '_blank')}
                  className="bg-black text-white hover:bg-gray-800 gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download Strategy
                </Button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h5 className="text-lg font-medium text-black mb-3">Your Content Pillars</h5>
                  <div className="grid md:grid-cols-3 gap-4">
                    {generatedWorkbook.contentPillars?.map((pillar, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-md">
                        <p className="font-medium text-black mb-2">Pillar {index + 1}</p>
                        <p className="text-gray-700 text-sm">{pillar}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h5 className="text-lg font-medium text-black mb-3">Content Strategy Overview</h5>
                  <p className="text-gray-700 bg-gray-50 p-4 rounded-md">{generatedWorkbook.strategyOverview}</p>
                </div>

                <div>
                  <h5 className="text-lg font-medium text-black mb-3">30-Day Content Calendar</h5>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="text-gray-700 text-sm">{generatedWorkbook.contentCalendar}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-16 pt-8 border-t border-gray-200">
          <Link href="/blueprint/module-two">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Module 2: Message
            </Button>
          </Link>
          <Link href="/blueprint">
            <Button className="bg-black text-white hover:bg-gray-800">
              Back to Blueprint
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
