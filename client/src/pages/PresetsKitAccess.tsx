import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Link } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { useSessionReady } from '@/hooks/useSessionReady';
import { 
  Download, 
  Play, 
  ChevronDown, 
  ChevronRight,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Lock
} from 'lucide-react';

export default function PresetsKitAccess() {
  const { user: supabaseUser, sessionReady } = useSupabaseAuth();
  const { isReady } = useSessionReady();
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(false);

  const { data: user } = useQuery({
    queryKey: ['/api/me'],
    queryFn: async () => {
      const response = await fetch('/api/me', {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch user');
      return response.json();
    },
    enabled: isReady && sessionReady && !!supabaseUser?.id,
    retry: false
  });

  // 🧪 DEV OVERRIDE — REMOVE BEFORE LAUNCH
  // In development, grant full access to userId "1"
  const isDeveloper = import.meta.env.MODE === 'development' && user?.id === 1;
  
  // Check if user has purchased Starter Kit
  const hasStarterKitAccess = isDeveloper || user?.purchases?.includes('starter-kit') || false;

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (!hasStarterKitAccess) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-6 py-20">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <Lock className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h1 className="text-3xl font-bold mb-4">Access Restricted</h1>
              <p className="text-lg text-gray-600 mb-8">
                This page is only available to Selfie Starter Kit students.
              </p>
              <Link href="/products/starter-kit">
                <Button className="px-8 py-3">
                  Get the Starter Kit
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          
          {/* Hero Section */}
          <div className="text-center mb-16">
            <Badge className="mb-4 px-4 py-2">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Starter Kit Student
            </Badge>
            <h1 className="text-5xl font-bold mb-6">
              Your Signature Presets Are Here
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Tap into your full glow-up edit flow — one click away.
            </p>
          </div>

          {/* Download Section */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center">
                <Download className="w-6 h-6 mr-3" />
                Your Preset Bundle
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-lg p-8 mb-4">
                    <Sparkles className="w-12 h-12 mx-auto text-yellow-600 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Light Preset</h3>
                    <p className="text-sm text-gray-600 mb-4">Perfect for bright, airy shots</p>
                  </div>
                  <Button className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Download Light Preset
                  </Button>
                </div>

                <div className="text-center">
                  <div className="bg-gradient-to-br from-gray-100 to-slate-200 rounded-lg p-8 mb-4">
                    <Sparkles className="w-12 h-12 mx-auto text-gray-600 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Urban Preset</h3>
                    <p className="text-sm text-gray-600 mb-4">Edgy city vibes and contrast</p>
                  </div>
                  <Button className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Download Urban Preset
                  </Button>
                </div>

                <div className="text-center">
                  <div className="bg-gradient-to-br from-purple-100 to-indigo-200 rounded-lg p-8 mb-4">
                    <Sparkles className="w-12 h-12 mx-auto text-purple-600 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Dark Preset</h3>
                    <p className="text-sm text-gray-600 mb-4">Moody and dramatic effects</p>
                  </div>
                  <Button className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Download Dark Preset
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Video Section */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center">
                <Play className="w-6 h-6 mr-3" />
                Editing Masterclass
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-black rounded-lg aspect-video flex items-center justify-center mb-4">
                <div className="text-center text-white">
                  <Play className="w-16 h-16 mx-auto mb-4" />
                  <p className="text-lg">Video: editing-masterclass.mp4</p>
                  <p className="text-sm opacity-75">Click to play your exclusive tutorial</p>
                </div>
              </div>
              <p className="text-gray-600">
                Watch Sandra walk you through each preset and learn the exact editing workflow 
                used by top content creators.
              </p>
            </CardContent>
          </Card>

          {/* Instructions Section */}
          <Card className="mb-12">
            <Collapsible open={isInstructionsOpen} onOpenChange={setIsInstructionsOpen}>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
                  <CardTitle className="text-2xl flex items-center justify-between">
                    <span>How to Import Presets</span>
                    {isInstructionsOpen ? (
                      <ChevronDown className="w-6 h-6" />
                    ) : (
                      <ChevronRight className="w-6 h-6" />
                    )}
                  </CardTitle>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-l-4 border-blue-500 pl-4">
                      <h4 className="font-semibold mb-2">Step 1: Download Your Presets</h4>
                      <p className="text-gray-600">
                        Click the download buttons above to save all three preset files to your device.
                      </p>
                    </div>
                    <div className="border-l-4 border-blue-500 pl-4">
                      <h4 className="font-semibold mb-2">Step 2: Open Your Editing App</h4>
                      <p className="text-gray-600">
                        Launch your preferred photo editing app (Lightroom, VSCO, or similar).
                      </p>
                    </div>
                    <div className="border-l-4 border-blue-500 pl-4">
                      <h4 className="font-semibold mb-2">Step 3: Import Presets</h4>
                      <p className="text-gray-600">
                        Navigate to the presets/filters section and import your downloaded files.
                      </p>
                    </div>
                    <div className="border-l-4 border-blue-500 pl-4">
                      <h4 className="font-semibold mb-2">Step 4: Start Editing</h4>
                      <p className="text-gray-600">
                        Apply your new presets to photos and adjust intensity as needed for your unique style.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>

          {/* AI Tool CTA */}
          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
            <CardContent className="p-8 text-center">
              <Sparkles className="w-12 h-12 mx-auto text-purple-600 mb-4" />
              <h3 className="text-2xl font-bold mb-4">Want a Personal Editing Routine?</h3>
              <p className="text-lg text-gray-600 mb-6">
                Let Sandra AI create a custom editing workflow based on your vibe, 
                camera roll, and content goals.
              </p>
              <Link href="/sandra-ai">
                <Button size="lg" className="px-8 py-3">
                  Get My Personal Editing Routine
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

        </div>
      </div>

      <Footer />
    </div>
  );
}