import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, RefreshCw, Download, Copy } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { VIBE_THEMES, type VibeTheme, type AIGeneratedAesthetic } from "../../../shared/vibeThemes";

interface BrandAestheticBuilderProps {
  onComplete?: () => void;
}

export const BrandAestheticBuilder = ({ onComplete }: BrandAestheticBuilderProps) => {
  const [selectedVibe, setSelectedVibe] = useState<string | null>(null);
  const [generatedAesthetic, setGeneratedAesthetic] = useState<AIGeneratedAesthetic | null>(null);
  const queryClient = useQueryClient();

  // Fetch vibe themes
  const { data: vibeThemes = VIBE_THEMES, isLoading: loadingThemes } = useQuery({
    queryKey: ["/api/vibe-themes"],
    enabled: true
  });

  // Generate visual strategy mutation
  const generateStrategy = useMutation({
    mutationFn: (vibeId: string) => apiRequest(`/api/ai/visual-strategy`, {
      method: "POST",
      body: JSON.stringify({ vibeId })
    }),
    onSuccess: (data) => {
      setGeneratedAesthetic(data);
    }
  });

  // Regenerate palette mutation
  const regeneratePalette = useMutation({
    mutationFn: ({ vibeId, currentPalette }: { vibeId: string; currentPalette: string[] }) => 
      apiRequest(`/api/ai/regenerate-palette`, {
        method: "POST",
        body: JSON.stringify({ vibeId, currentPalette })
      }),
    onSuccess: (data) => {
      if (generatedAesthetic) {
        setGeneratedAesthetic({
          ...generatedAesthetic,
          palette: data.palette
        });
      }
    }
  });

  const handleVibeSelect = (vibeId: string) => {
    setSelectedVibe(vibeId);
    generateStrategy.mutate(vibeId);
  };

  const handleRegeneratePalette = () => {
    if (selectedVibe && generatedAesthetic) {
      regeneratePalette.mutate({
        vibeId: selectedVibe,
        currentPalette: generatedAesthetic.palette
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="max-w-6xl mx-auto px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="font-['Cormorant_Garamond'] text-4xl font-normal text-[#171719] mb-6">
          Design Like a CEO™
        </h1>
        <p className="text-xl text-[#4C4B4B] font-light max-w-2xl mx-auto">
          Your visual strategy starts here. Choose your vibe and let AI create your complete brand aesthetic.
        </p>
      </div>

      {/* Vibe Selection Grid */}
      {!generatedAesthetic && (
        <div className="mb-12">
          <h2 className="font-['Cormorant_Garamond'] text-2xl text-[#171719] mb-8 text-center">
            Choose Your Brand Vibe
          </h2>
          
          {loadingThemes ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-[#4C4B4B]" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {vibeThemes.map((vibe: VibeTheme) => (
                <Card 
                  key={vibe.id}
                  className={`cursor-pointer transition-all duration-300 hover:shadow-lg border-2 ${
                    selectedVibe === vibe.id ? 'border-[#171719] shadow-lg' : 'border-gray-200'
                  }`}
                  onClick={() => handleVibeSelect(vibe.id)}
                >
                  <div className="p-6">
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {vibe.imageUrls.slice(0, 6).map((url, index) => (
                        <div key={index} className="aspect-square overflow-hidden">
                          <img 
                            src={url} 
                            alt={`${vibe.name} aesthetic ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                    
                    <h3 className="font-['Cormorant_Garamond'] text-xl text-[#171719] mb-2">
                      {vibe.name}
                    </h3>
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      {vibe.presetPalette.slice(0, 4).map((color, index) => (
                        <div 
                          key={index}
                          className="w-6 h-6 border border-gray-200"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    
                    <p className="text-sm text-[#4C4B4B] font-light">
                      Fonts: {vibe.presetFonts.join(", ")}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Loading State */}
      {generateStrategy.isPending && (
        <div className="text-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-[#171719] mx-auto mb-4" />
          <p className="text-xl text-[#4C4B4B] font-light">
            AI is creating your personalized brand aesthetic...
          </p>
        </div>
      )}

      {/* Generated Aesthetic Display */}
      {generatedAesthetic && (
        <div className="space-y-12">
          {/* Image Grid */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-['Cormorant_Garamond'] text-2xl text-[#171719]">
                Your Brand Gallery
              </h2>
              <Button
                variant="outline"
                onClick={() => {
                  setGeneratedAesthetic(null);
                  setSelectedVibe(null);
                }}
                className="border-[#171719] text-[#171719] hover:bg-[#171719] hover:text-white"
              >
                Choose Different Vibe
              </Button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {generatedAesthetic.images.map((url, index) => (
                <div key={index} className="aspect-square overflow-hidden">
                  <img 
                    src={url} 
                    alt={`Brand aesthetic ${index + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Color Palette */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-['Cormorant_Garamond'] text-2xl text-[#171719]">
                Your Color Palette
              </h2>
              <Button
                variant="outline"
                onClick={handleRegeneratePalette}
                disabled={regeneratePalette.isPending}
                className="border-[#171719] text-[#171719] hover:bg-[#171719] hover:text-white"
              >
                {regeneratePalette.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                Regenerate Colors
              </Button>
            </div>
            
            <div className="grid grid-cols-5 gap-4">
              {generatedAesthetic.palette.map((color, index) => (
                <div key={index} className="text-center">
                  <div 
                    className="w-full h-20 border border-gray-200 cursor-pointer hover:scale-105 transition-transform"
                    style={{ backgroundColor: color }}
                    onClick={() => copyToClipboard(color)}
                  />
                  <p className="mt-2 text-sm text-[#4C4B4B] font-mono">
                    {color}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(color)}
                    className="text-xs text-[#4C4B4B] hover:text-[#171719]"
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Copy
                  </Button>
                </div>
              ))}
            </div>
          </section>

          {/* Typography */}
          <section>
            <h2 className="font-['Cormorant_Garamond'] text-2xl text-[#171719] mb-6">
              Your Brand Fonts
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {generatedAesthetic.fonts.map((font, index) => (
                <Card key={index} className="p-6">
                  <h3 
                    className="text-2xl mb-4 text-[#171719]"
                    style={{ fontFamily: font }}
                  >
                    {font}
                  </h3>
                  <p 
                    className="text-[#4C4B4B] font-light mb-4"
                    style={{ fontFamily: font }}
                  >
                    The quick brown fox jumps over the lazy dog. This is how your brand voice will look in {font}.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(font)}
                    className="border-[#171719] text-[#171719] hover:bg-[#171719] hover:text-white"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Font Name
                  </Button>
                </Card>
              ))}
            </div>
          </section>

          {/* Brand Keywords */}
          <section>
            <h2 className="font-['Cormorant_Garamond'] text-2xl text-[#171719] mb-6">
              Your Brand Keywords
            </h2>
            
            <div className="flex flex-wrap gap-3 mb-6">
              {generatedAesthetic.keywords.map((keyword, index) => (
                <Badge 
                  key={index}
                  variant="outline"
                  className="text-lg px-4 py-2 border-[#171719] text-[#171719] hover:bg-[#171719] hover:text-white cursor-pointer"
                  onClick={() => copyToClipboard(keyword)}
                >
                  {keyword}
                </Badge>
              ))}
            </div>
          </section>

          {/* Visual Strategy */}
          <section>
            <h2 className="font-['Cormorant_Garamond'] text-2xl text-[#171719] mb-6">
              Your Visual Strategy
            </h2>
            
            <Card className="p-8 bg-[#F1F1F1]">
              <p className="text-lg text-[#4C4B4B] font-light leading-relaxed">
                {generatedAesthetic.strategy}
              </p>
              
              <Button
                variant="outline"
                onClick={() => copyToClipboard(generatedAesthetic.strategy)}
                className="mt-6 border-[#171719] text-[#171719] hover:bg-[#171719] hover:text-white"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy Strategy
              </Button>
            </Card>
          </section>

          {/* Action Buttons */}
          <section className="text-center pt-8">
            <div className="space-x-4">
              <Button
                size="lg"
                className="bg-[#171719] text-white hover:bg-[#2A2A2A] border-0 px-8 py-4"
                onClick={() => {
                  // TODO: Implement PDF export
                  console.log("Export as PDF");
                }}
              >
                <Download className="h-5 w-5 mr-2" />
                Export Brand Board PDF
              </Button>
              
              {onComplete && (
                <Button
                  size="lg"
                  variant="outline"
                  onClick={onComplete}
                  className="border-[#171719] text-[#171719] hover:bg-[#171719] hover:text-white px-8 py-4"
                >
                  Continue to Next Module
                </Button>
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  );
};