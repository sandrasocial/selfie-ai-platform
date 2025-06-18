import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Sparkles, Palette, Sun, Contrast } from "lucide-react";

interface ImageEnhancementProps {
  imageUrl: string;
  onEnhancementChange: (settings: EnhancementSettings) => void;
  onApplyEnhancements: () => void;
  isProcessing?: boolean;
}

export interface EnhancementSettings {
  enhanceImage: boolean;
  filterStyle: string;
  brightnessAdjust: number;
  contrastAdjust: number;
}

const filterOptions = [
  { value: "natural", label: "Natural", description: "Clean, authentic look" },
  
  // Light & Dreamy Collection
  { value: "scandi-light-1", label: "Scandinavian Light #1", description: "Bright, airy, dreamy vibes" },
  { value: "scandi-light-2", label: "Scandinavian Light #2", description: "Soft glow with gentle contrast" },
  { value: "scandi-light-3", label: "Scandinavian Light #3", description: "Luminous and ethereal" },
  { value: "scandi-light-5", label: "Scandinavian Light #5", description: "Delicate dreamy finish" },

  // Dark & Moody Collection  
  { value: "scandi-dark-1", label: "Scandinavian Dark #1", description: "Rich contrast, dramatic mood" },
  { value: "scandi-dark-2", label: "Scandinavian Dark #2", description: "Deep shadows, blue tones" },
  { value: "scandi-dark-4", label: "Scandinavian Dark #4", description: "Moody cinematic look" },
  { value: "scandi-dark-5", label: "Scandinavian Dark #5", description: "Elegant dark tones" },

  // Deep Urban Collection
  { value: "nordic-urban-1", label: "Nordic Urban #1", description: "Urban gritty, desaturated" },
  { value: "nordic-urban-2", label: "Nordic Urban #2", description: "City vibes, cool tones" },
  { value: "nordic-urban-4", label: "Nordic Urban #4", description: "Street photography style" },
  { value: "nordic-urban-5", label: "Nordic Urban #5", description: "Modern urban aesthetic" },

  // Selfie Glow Up Collection
  { value: "glow-up-1", label: "Selfie Glow Up #1", description: "Perfect selfie enhancement" },
  { value: "glow-up-2", label: "Selfie Glow Up #2", description: "Skin smoothing glow" },
  { value: "glow-up-3", label: "Selfie Glow Up #3", description: "Radiant portrait finish" },
  { value: "glow-up-4", label: "Selfie Glow Up #4", description: "Ultimate selfie perfection" }
];

export default function ImageEnhancement({ 
  imageUrl, 
  onEnhancementChange, 
  onApplyEnhancements,
  isProcessing = false 
}: ImageEnhancementProps) {
  const [settings, setSettings] = useState<EnhancementSettings>({
    enhanceImage: true,
    filterStyle: "natural",
    brightnessAdjust: 0,
    contrastAdjust: 0,
  });

  const updateSettings = (newSettings: Partial<EnhancementSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    onEnhancementChange(updated);
  };

  const getImageStyle = () => {
    let filter = "";
    
    // Light & Dreamy Collection
    if (settings.filterStyle === "scandi-light-1") {
      filter += "brightness(1.37) contrast(0.86) saturate(1.08) hue-rotate(-7deg) ";
    } else if (settings.filterStyle === "scandi-light-2") {
      filter += "brightness(1.13) contrast(1.05) saturate(1.03) hue-rotate(2deg) ";
    } else if (settings.filterStyle === "scandi-light-3") {
      filter += "brightness(1.51) contrast(1.18) saturate(0.99) hue-rotate(2deg) ";
    } else if (settings.filterStyle === "scandi-light-5") {
      filter += "brightness(1.15) contrast(1.06) saturate(0.86) hue-rotate(3deg) ";
    }
    // Dark & Moody Collection
    else if (settings.filterStyle === "scandi-dark-1") {
      filter += "brightness(1.13) contrast(1.15) saturate(0.91) hue-rotate(11deg) ";
    } else if (settings.filterStyle === "scandi-dark-2") {
      filter += "brightness(1.20) contrast(1.23) saturate(0.86) hue-rotate(17deg) ";
    } else if (settings.filterStyle === "scandi-dark-4") {
      filter += "brightness(1.15) contrast(1.17) saturate(0.78) hue-rotate(5deg) ";
    } else if (settings.filterStyle === "scandi-dark-5") {
      filter += "brightness(0.48) contrast(0.72) saturate(1.03) hue-rotate(3deg) ";
    }
    // Deep Urban Collection
    else if (settings.filterStyle === "nordic-urban-1") {
      filter += "brightness(0.19) contrast(0.67) saturate(1.04) hue-rotate(4deg) ";
    } else if (settings.filterStyle === "nordic-urban-2") {
      filter += "brightness(0.19) contrast(0.67) saturate(1.04) hue-rotate(4deg) ";
    } else if (settings.filterStyle === "nordic-urban-4") {
      filter += "brightness(1.10) contrast(1.12) saturate(0.85) hue-rotate(4deg) ";
    } else if (settings.filterStyle === "nordic-urban-5") {
      filter += "contrast(1.06) saturate(1.0) ";
    }
    // Selfie Glow Up Collection
    else if (settings.filterStyle === "glow-up-1") {
      filter += "brightness(0.74) contrast(1.09) saturate(0.90) hue-rotate(3deg) ";
    } else if (settings.filterStyle === "glow-up-2") {
      filter += "brightness(0.10) contrast(0.92) saturate(1.01) hue-rotate(-9deg) ";
    } else if (settings.filterStyle === "glow-up-3") {
      filter += "brightness(1.06) contrast(1.07) saturate(0.91) hue-rotate(2deg) ";
    } else if (settings.filterStyle === "glow-up-4") {
      filter += "brightness(0.85) contrast(1.06) saturate(1.08) hue-rotate(-10deg) ";
    }
    
    // Brightness and contrast adjustments
    const brightness = 1 + (settings.brightnessAdjust / 100);
    const contrast = 1 + (settings.contrastAdjust / 100);
    filter += `brightness(${brightness}) contrast(${contrast})`;
    
    return { filter };
  };

  return (
    <div className="space-y-6">
      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[#3C3A35]" />
            Enhanced Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative rounded-lg overflow-hidden bg-gray-100">
            <img
              src={imageUrl}
              alt="Enhanced preview"
              className="w-full max-h-96 object-contain transition-all duration-300"
              style={settings.enhanceImage ? getImageStyle() : {}}
            />
            {!settings.enhanceImage && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <span className="text-white font-medium">Enhancement Off</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Enhancement Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-[#3C3A35]" />
            Enhancement Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Enable Enhancement Toggle */}
          <div className="flex items-center space-x-3">
            <Switch
              id="enhance-toggle"
              checked={settings.enhanceImage}
              onCheckedChange={(checked) => updateSettings({ enhanceImage: checked })}
            />
            <Label htmlFor="enhance-toggle" className="font-medium">
              Enable AI Enhancement
            </Label>
          </div>

          {settings.enhanceImage && (
            <>
              {/* Filter Style */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Filter Style</Label>
                <Select 
                  value={settings.filterStyle} 
                  onValueChange={(value) => updateSettings({ filterStyle: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {filterOptions.map((filter) => (
                      <SelectItem key={filter.value} value={filter.value}>
                        <div>
                          <div className="font-medium">{filter.label}</div>
                          <div className="text-sm text-gray-500">{filter.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Brightness */}
              <div className="space-y-3">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Sun className="h-4 w-4" />
                  Brightness: {settings.brightnessAdjust > 0 ? '+' : ''}{settings.brightnessAdjust}
                </Label>
                <Slider
                  value={[settings.brightnessAdjust]}
                  onValueChange={([value]) => updateSettings({ brightnessAdjust: value })}
                  min={-50}
                  max={50}
                  step={5}
                  className="w-full"
                />
              </div>

              {/* Contrast */}
              <div className="space-y-3">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Contrast className="h-4 w-4" />
                  Contrast: {settings.contrastAdjust > 0 ? '+' : ''}{settings.contrastAdjust}
                </Label>
                <Slider
                  value={[settings.contrastAdjust]}
                  onValueChange={([value]) => updateSettings({ contrastAdjust: value })}
                  min={-50}
                  max={50}
                  step={5}
                  className="w-full"
                />
              </div>
            </>
          )}

          {/* Apply Button */}
          <Button 
            onClick={onApplyEnhancements}
            disabled={isProcessing}
            className="w-full bg-[#3C3A35] hover:bg-[#2C2A25] text-white"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                Processing...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Apply Enhancement & Generate Content
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}