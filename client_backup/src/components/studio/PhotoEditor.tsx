import React, { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Upload, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export interface EnhancementSettings {
  enhanceImage: boolean;
  filterStyle: string;
  brightnessAdjust: number;
  contrastAdjust: number;
}

const presetCollections = {
  "Light & Dreamy": [
    { value: "scandi-light-1", label: "Scandinavian Light #1", description: "Bright, airy, dreamy vibes" },
    { value: "scandi-light-2", label: "Scandinavian Light #2", description: "Soft glow with gentle contrast" },
    { value: "scandi-light-3", label: "Scandinavian Light #3", description: "Luminous and ethereal" },
    { value: "scandi-light-5", label: "Scandinavian Light #5", description: "Delicate dreamy finish" }
  ],
  "Dark & Moody": [
    { value: "scandi-dark-1", label: "Scandinavian Dark #1", description: "Rich contrast, dramatic mood" },
    { value: "scandi-dark-2", label: "Scandinavian Dark #2", description: "Deep shadows, blue tones" },
    { value: "scandi-dark-4", label: "Scandinavian Dark #4", description: "Moody cinematic look" },
    { value: "scandi-dark-5", label: "Scandinavian Dark #5", description: "Elegant dark tones" }
  ],
  "Deep Urban": [
    { value: "nordic-urban-1", label: "Nordic Urban #1", description: "Urban gritty, desaturated" },
    { value: "nordic-urban-2", label: "Nordic Urban #2", description: "City vibes, cool tones" },
    { value: "nordic-urban-4", label: "Nordic Urban #4", description: "Street photography style" },
    { value: "nordic-urban-5", label: "Nordic Urban #5", description: "Modern urban aesthetic" }
  ],
  "Selfie Glow Up": [
    { value: "glow-up-1", label: "Selfie Glow Up #1", description: "Perfect selfie enhancement" },
    { value: "glow-up-2", label: "Selfie Glow Up #2", description: "Skin smoothing glow" },
    { value: "glow-up-3", label: "Selfie Glow Up #3", description: "Radiant portrait finish" },
    { value: "glow-up-4", label: "Selfie Glow Up #4", description: "Ultimate selfie perfection" }
  ]
};

interface PhotoEditorProps {
  onImageSelect?: (file: File) => void;
}

export default function PhotoEditor({ onImageSelect }: PhotoEditorProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [settings, setSettings] = useState<EnhancementSettings>({
    enhanceImage: true,
    filterStyle: "natural",
    brightnessAdjust: 0,
    contrastAdjust: 0,
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
      };
      reader.readAsDataURL(file);
      onImageSelect?.(file);
    }
  }, [onImageSelect]);

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

  const resetSettings = () => {
    setSettings({
      enhanceImage: true,
      filterStyle: "natural",
      brightnessAdjust: 0,
      contrastAdjust: 0,
    });
  };

  const downloadImage = async () => {
    if (!selectedImage || !imagePreview) return;
    
    setIsProcessing(true);
    try {
      // Create canvas and apply filters
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Apply filter
        if (ctx) {
          ctx.filter = getImageStyle().filter;
          ctx.drawImage(img, 0, 0);
          
          // Download the processed image
          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `edited-selfie-${Date.now()}.jpg`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
              
              toast({
                title: "Download Complete!",
                description: "Your edited photo has been saved to your device.",
              });
            }
          }, 'image/jpeg', 0.9);
        }
      };
      
      img.src = imagePreview;
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "There was an error processing your image.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Photo Editor - Professional Lightroom Presets
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {!selectedImage ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium mb-2">Upload your selfie to get started</p>
              <p className="text-gray-600 mb-4">Transform your photos with professional presets</p>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="image-upload"
              />
              <Button asChild>
                <label htmlFor="image-upload" className="cursor-pointer">
                  Choose Photo
                </label>
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Image Preview */}
              <div className="aspect-square max-w-md mx-auto rounded-lg overflow-hidden bg-gray-100">
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={getImageStyle()}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              {/* Preset Collections */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Professional Presets</h3>
                {Object.entries(presetCollections).map(([collection, presets]) => (
                  <div key={collection} className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700">{collection}</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {presets.map((preset) => (
                        <Button
                          key={preset.value}
                          variant={settings.filterStyle === preset.value ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSettings({ ...settings, filterStyle: preset.value })}
                          className="text-xs h-auto py-2"
                        >
                          <div>
                            <div className="font-medium">{preset.label}</div>
                            <div className="text-xs opacity-70">{preset.description}</div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Manual Adjustments */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Fine-tune Adjustments</h3>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Brightness: {settings.brightnessAdjust}%
                    </label>
                    <Slider
                      value={[settings.brightnessAdjust]}
                      onValueChange={(value) => setSettings({ ...settings, brightnessAdjust: value[0] })}
                      min={-50}
                      max={50}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Contrast: {settings.contrastAdjust}%
                    </label>
                    <Slider
                      value={[settings.contrastAdjust]}
                      onValueChange={(value) => setSettings({ ...settings, contrastAdjust: value[0] })}
                      min={-50}
                      max={50}
                      step={1}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button onClick={resetSettings} variant="outline" className="flex-1">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
                <Button onClick={downloadImage} disabled={isProcessing} className="flex-1">
                  <Download className="w-4 h-4 mr-2" />
                  {isProcessing ? "Processing..." : "Download"}
                </Button>
              </div>

              {/* Upload New Photo */}
              <div className="pt-4 border-t">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="new-image-upload"
                />
                <Button asChild variant="outline" className="w-full">
                  <label htmlFor="new-image-upload" className="cursor-pointer">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload New Photo
                  </label>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}