import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Link } from "wouter";
import { ArrowLeft, Download, FileText, Sparkles } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

// Simple debounce function
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

export default function ModuleTwo() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    knownFor: "",
    reputation: "",
    strongOpinion: ""
  });
  const [generatedWorkbook, setGeneratedWorkbook] = useState<any>(null);
  const [showWorkbook, setShowWorkbook] = useState(false);

  // Auto-save function with debouncing
  const saveAnswers = async (answers: any) => {
    try {
      await fetch('/api/module2-save-answers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(answers),
      });
      console.log("Answers auto-saved successfully");
    } catch (error) {
      console.error('Auto-save failed:', error);
    }
  };

  // Debounced save function
  const debouncedSave = debounce((answers: any) => saveAnswers(answers), 800);

  // Handle input changes with auto-save
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    setFormData(updated);
    debouncedSave(updated);
  };

  // Load saved answers from localStorage on page load
  useEffect(() => {
    try {
      const savedAnswers = localStorage.getItem('module2-answers');
      if (savedAnswers) {
        const data = JSON.parse(savedAnswers);
        console.log("✅ Loaded saved answers from localStorage:", data);
        setFormData(data);
      } else {
        console.log("🆕 No saved answers found in localStorage");
      }
    } catch (err) {
      console.error("❌ Error loading from localStorage:", err);
    }
  }, []);

  const generateWorkbookMutation = useMutation({
    mutationFn: async (data: any) => {
      console.log("Generating workbook with data:", data);
      try {
        const response = await fetch("/api/module2-workbook", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(data),
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log("Workbook generation result:", result);
        return result;
      } catch (error) {
        console.error("API call failed:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log("Workbook generation successful:", data);
      if (data && typeof data === 'object') {
        setGeneratedWorkbook(data);
        setShowWorkbook(true);
        toast({
          title: "Your Magnetic Message Blueprint is Ready! 🖤",
          description: "Your personalized content strategy has been generated.",
        });
      } else {
        console.error("Invalid workbook data received:", data);
        toast({
          title: "Generation Error",
          description: "Invalid response format received.",
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      console.error("Workbook generation error:", error);
      toast({
        title: "Generation Failed", 
        description: "Please try again or check your responses.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!formData.knownFor.trim() || !formData.reputation.trim() || !formData.strongOpinion.trim()) {
      toast({
        title: "Please Complete All Fields",
        description: "All three questions need responses to generate your blueprint.",
        variant: "destructive",
      });
      return;
    }

    // Generate the Magnetic Message Blueprint using real AI
    try {
      console.log("✅ Generating AI-powered Magnetic Message Blueprint...");
      
      const response = await fetch("/api/module2-workbook", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const magneticBlueprint = await response.json();
      
      console.log("✅ AI-generated Magnetic Message Blueprint received:", magneticBlueprint);
      setGeneratedWorkbook(magneticBlueprint);
      setShowWorkbook(true);
      
      toast({
        title: "Your Magnetic Message Blueprint is Ready! 🖤",
        description: "Your personalized AI-generated content strategy is ready.",
      });
      
    } catch (err) {
      console.error("❌ AI Blueprint generation failed:", err);
      toast({
        title: "Generation Failed",
        description: "Please check your responses and try again.",
        variant: "destructive",
      });
    }
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
              <div className="text-lg font-medium mb-2">Module 2 Banner</div>
              <div className="text-sm">module2-banner.jpg</div>
            </div>
          </div>
          
          <div className="text-center">
            <div className="mb-8">
              <div className="text-sm font-medium text-gray-500 mb-4 tracking-wider uppercase">
                The SELFIE BLUEPRINT
              </div>
              <h1 className="text-5xl md:text-6xl font-serif text-black mb-6 leading-tight">
                MODULE 2
              </h1>
              <h2 className="text-2xl md:text-3xl font-serif text-black mb-8">
                Content That Makes People Feel You
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed max-w-2xl mx-auto">
                Let's be real... posting just to post? That's not the vibe anymore. This module is about making sure your content actually sounds like you — not a copy-paste version of what everyone else is saying.
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
              It's time to ditch "waiting for inspiration" and start building content that builds your brand on repeat. You'll walk away knowing exactly what to say, how to say it, and how to show up as the voice people stop scrolling for.
            </p>
            <p className="text-xl font-medium text-black">
              We're turning your opinions into your power.
            </p>
          </CardContent>
        </Card>

        {/* Why This Matters */}
        <div className="mb-16">
          <h3 className="text-3xl font-serif text-black mb-8">Why This Matters</h3>
          <div className="space-y-6">
            <p className="text-lg text-gray-700 leading-relaxed">
              People might hit that follow button because of your tips...
            </p>
            <p className="text-xl font-medium text-black">
              But they stay because of how you think.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              This is where we flip the script. You'll learn how to stop wondering "What should I post today?" and start showing up with a message that actually matters.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              No more posting fluff. No more blending in. This is how you lead conversations and build real connection.
            </p>
          </div>
        </div>

        {/* Why Opinions Hit Different */}
        <div className="mb-16">
          <h3 className="text-3xl font-serif text-black mb-8">Why Opinions Hit Different</h3>
          <div className="space-y-6">
            <p className="text-lg text-gray-700 leading-relaxed">
              Let's be honest—most people online sound the same.
            </p>
            <p className="text-xl font-medium text-black">
              But your perspective? That's your superpower.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              When you stop hiding behind generic tips and start saying what you really believe? That's when your content gets magnetic.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              In this lesson, you'll learn why your voice and values are more powerful than any viral audio—and how to use them to build trust and stand out like the bold leader you are.
            </p>
          </div>
        </div>

        {/* The Expert Trap */}
        <Card className="mb-16 border-l-4 border-black bg-gray-50">
          <CardContent className="p-8">
            <h4 className="text-2xl font-serif text-black mb-6">The Expert Trap</h4>
            <div className="space-y-4">
              <p className="text-lg text-gray-700">Yeah, tips can grow your page.</p>
              <p className="text-xl font-medium text-black">But truth? Truth builds a movement.</p>
              <p className="text-lg text-gray-700">
                Anyone can be a teacher. Not everyone can be a leader.
              </p>
              <p className="text-lg text-gray-700">
                If you want to go from "just helpful" to undeniable, it's time to stop just educating—and start influencing how people see themselves through your story, your voice, and your mission.
              </p>
              <p className="text-lg font-medium text-black">
                We're not just building content. We're building a message.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Your Opinion = Your Brand */}
        <div className="mb-16">
          <h3 className="text-3xl font-serif text-black mb-8">Your Opinion = Your Brand</h3>
          <div className="space-y-6">
            <p className="text-lg text-gray-700 leading-relaxed">
              Your opinion is your brand. It's what makes people remember you, quote you, and trust you.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Your vibe? That's your personality.
            </p>
            <p className="text-xl font-medium text-black">
              But your point of view? That's what makes you a professional.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Want to be seen as a leader in your space? Then start standing for something. Not to be loud—just to be real.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              It's not about shouting. It's about being so clear on what you believe, people feel it.
            </p>
          </div>
        </div>

        {/* Thought Leader vs Content Expert */}
        <div className="mb-16">
          <h3 className="text-3xl font-serif text-black mb-8">Thought Leader ≠ Content Expert</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-0 bg-gray-50">
              <CardContent className="p-6">
                <h5 className="text-lg font-medium text-gray-600 mb-3">A content expert</h5>
                <p className="text-lg text-gray-700">gives tips.</p>
              </CardContent>
            </Card>
            <Card className="border-0 bg-black text-white">
              <CardContent className="p-6">
                <h5 className="text-lg font-medium text-gray-300 mb-3">A thought leader</h5>
                <p className="text-lg text-white">shifts perspectives.</p>
              </CardContent>
            </Card>
          </div>
          <div className="mt-8 space-y-4">
            <p className="text-lg text-gray-700 leading-relaxed">
              You're not here just to teach people how to do something. You're here to help them see things differently.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              And when you do that? They trust you. They buy from you. They share your content without you even asking.
            </p>
            <p className="text-xl font-medium text-black">
              It's not about knowing more. It's about saying something that lands.
            </p>
          </div>
        </div>

        {/* What Do You Want to Be Known For */}
        <div className="mb-16">
          <h3 className="text-3xl font-serif text-black mb-8">What Do You Want to Be Known For?</h3>
          <div className="space-y-6">
            <p className="text-lg text-gray-700 leading-relaxed">
              Your content isn't just a bunch of random posts. It's your digital legacy.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              So when someone lands on your page... What do you want them to feel? What do you want them to remember?
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              This is where we build your core message. That one bold belief you're not afraid to say again and again. The thing that ties all your content together. The message that makes people think, "She's talking to me."
            </p>
          </div>
        </div>

        {/* Clarity Over Virality */}
        <Card className="mb-16 border-0 bg-black text-white">
          <CardContent className="p-8">
            <h4 className="text-2xl font-serif text-white mb-6">You Don't Need to Be Viral. You Need to Be Clear.</h4>
            <div className="space-y-4">
              <p className="text-lg text-gray-300">Forget chasing the algorithm.</p>
              <p className="text-xl font-medium text-white">Clarity {`>`} virality.</p>
              <p className="text-lg text-gray-300">
                One clear, bold opinion—said consistently—can grow your brand faster than 100 "how-to" reels.
              </p>
              <p className="text-lg text-gray-300">
                Your dream clients don't need more trends. They need to feel seen.
              </p>
              <p className="text-lg font-medium text-white">
                You're not creating for likes. You're creating for loyalty.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* When You Say Nothing */}
        <div className="mb-16">
          <h3 className="text-3xl font-serif text-black mb-8">When You Say Nothing... People Make Up Stories</h3>
          <div className="space-y-6">
            <p className="text-lg text-gray-700 leading-relaxed">
              If you're not speaking up about what you believe... People will assume. And let's be honest—most of the time, they'll get it wrong.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              When your voice is missing, your audience starts wondering:
            </p>
            <ul className="text-lg text-gray-700 space-y-2 ml-6">
              <li>"Is she even serious about this?"</li>
              <li>"Does she actually know what she's doing?"</li>
            </ul>
            <p className="text-xl font-medium text-black">
              Don't let fear—or the algorithm—speak for you. Your voice is your positioning.
            </p>
          </div>
        </div>

        {/* Silence Isn't Safety */}
        <div className="mb-16">
          <h3 className="text-3xl font-serif text-black mb-8">Silence Isn't Safety—It's Confusion</h3>
          <div className="space-y-6">
            <p className="text-lg text-gray-700 leading-relaxed">
              Being quiet online won't protect you. It just keeps you invisible.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              You're not being "low-key." You're being unclear.
            </p>
            <p className="text-xl font-medium text-black">
              And unclear = unbooked.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Your dream clients are watching. They're just not sure what you stand for yet.
            </p>
          </div>
        </div>

        {/* You Don't Need the Right Opinion */}
        <div className="mb-16">
          <h3 className="text-3xl font-serif text-black mb-8">You Don't Need the "Right" Opinion—Just Your Opinion</h3>
          <div className="space-y-6">
            <p className="text-lg text-gray-700 leading-relaxed">
              You don't have to be perfect. You just have to be real.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              You don't need to say it perfectly. You just need to say it.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Your audience doesn't connect with polished. They connect with truth.
            </p>
            <p className="text-xl font-medium text-black">
              Say what you mean. Say it in your own words. That's how you build trust.
            </p>
          </div>
        </div>

        {/* What Do You Want People to Say */}
        <Card className="mb-16 border-0 shadow-none bg-gray-50">
          <CardContent className="p-8">
            <h4 className="text-2xl font-serif text-black mb-6">What Do You Want People to Say About You When You're Not in the Room?</h4>
            <div className="space-y-4">
              <p className="text-lg text-gray-700">This is the real test of your brand 👑</p>
              <p className="text-lg text-gray-700">When you're not around... What do people say about your content? Your vibe? Your mission?</p>
              <p className="text-lg text-gray-700">This isn't about being liked. It's about being known.</p>
              <p className="text-lg font-medium text-black">
                And that only happens when you get clear on what you stand for.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Message Over Aesthetic */}
        <div className="mb-16">
          <h3 className="text-3xl font-serif text-black mb-8">Be Known for Your Message—Not Just Your Aesthetic</h3>
          <div className="space-y-6">
            <p className="text-lg text-gray-700 leading-relaxed">
              Yes, your brand should look good. But if it's only pretty and says nothing? It won't stick. It won't sell.
            </p>
            <p className="text-xl font-medium text-black">
              Pretty doesn't pay. Power does.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Your message is what makes people stay. Your content is your voice. Your story is your strategy.
            </p>
            <p className="text-lg font-medium text-black">
              Let's use it.
            </p>
          </div>
        </div>

        {/* AI-Powered Magnetic Message Form */}
        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="w-6 h-6 text-black" />
              <h4 className="text-2xl font-serif text-black">Your Magnetic Message Blueprint</h4>
            </div>
            <p className="text-lg text-gray-700 mb-8">
              Answer these three questions to generate your personalized content strategy and opinion-based messaging framework.
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-3">
                <Label htmlFor="knownFor" className="text-lg font-medium text-black">
                  What do you want to be known for?
                </Label>
                <p className="text-sm text-gray-600 mb-3">
                  What is the one bold belief or opinion that defines your content?
                </p>
                <Textarea
                  id="knownFor"
                  name="knownFor"
                  placeholder="I want to be known for believing that..."
                  value={formData.knownFor}
                  onChange={handleChange}
                  className="min-h-[120px] text-base rounded-md"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="reputation" className="text-lg font-medium text-black">
                  What do you want people to say about your content when you're not around?
                </Label>
                <p className="text-sm text-gray-600 mb-3">
                  What's your vibe, your message, your unique edge?
                </p>
                <Textarea
                  id="reputation"
                  name="reputation"
                  placeholder="When people talk about my content, I want them to say..."
                  value={formData.reputation}
                  onChange={handleChange}
                  className="min-h-[120px] text-base rounded-md"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="strongOpinion" className="text-lg font-medium text-black">
                  What's a strong opinion you have about your niche or industry?
                </Label>
                <p className="text-sm text-gray-600 mb-3">
                  Say it in your own words—this is your brand point of view.
                </p>
                <Textarea
                  id="strongOpinion"
                  name="strongOpinion"
                  placeholder="Here's what I really believe about my industry..."
                  value={formData.strongOpinion}
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
                  "Generating Your Blueprint..."
                ) : (
                  "Generate My Magnetic Message Blueprint 🖤"
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
                <h4 className="text-2xl font-serif text-black">Your Magnetic Messaging Blueprint</h4>
                <Button 
                  onClick={() => window.open(`/api/module2-workbook/pdf/${generatedWorkbook.id}`, '_blank')}
                  className="bg-black text-white hover:bg-gray-800 gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download Workbook
                </Button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h5 className="text-lg font-medium text-black mb-3">Your Content POV Statement</h5>
                  <p className="text-gray-700 bg-gray-50 p-4 rounded-md">{generatedWorkbook.povStatement}</p>
                </div>
                
                <div>
                  <h5 className="text-lg font-medium text-black mb-3">Your Messaging Pillars</h5>
                  <div className="grid md:grid-cols-3 gap-4">
                    {generatedWorkbook.messagingPillars?.map((pillar, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-md">
                        <p className="font-medium text-black mb-2">Pillar {index + 1}</p>
                        <p className="text-gray-700 text-sm">{pillar}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h5 className="text-lg font-medium text-black mb-3">30-60-90 Day Content Strategy</h5>
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-md">
                      <p className="font-medium text-black mb-2">Month 1: Foundation</p>
                      <p className="text-gray-700 text-sm">{generatedWorkbook.phase30}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <p className="font-medium text-black mb-2">Month 2: Growth</p>
                      <p className="text-gray-700 text-sm">{generatedWorkbook.phase60}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <p className="font-medium text-black mb-2">Month 3: Authority</p>
                      <p className="text-gray-700 text-sm">{generatedWorkbook.phase90}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-16 pt-8 border-t border-gray-200">
          <Link href="/blueprint/module-one">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Module 1: Your Story
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