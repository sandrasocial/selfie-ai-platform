import { useState, useRef } from "react";
import { Upload, CloudUpload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useContentGeneration } from "@/hooks/useContentGeneration";
import ImageEnhancement, { type EnhancementSettings } from "./ImageEnhancement";
import { imageProcessor } from "@/lib/imageEnhancement";
import type { ContentGeneration } from "@/types";

interface SelfieUploadProps {
  user?: any;
  onContentGenerated: (content: ContentGeneration) => void;
}

export default function SelfieUpload({ user, onContentGenerated }: SelfieUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedMood, setSelectedMood] = useState<string>("");
  const [dragOver, setDragOver] = useState(false);
  const [showEnhancement, setShowEnhancement] = useState(false);
  const [enhancementSettings, setEnhancementSettings] = useState<EnhancementSettings>({
    enhanceImage: true,
    filterStyle: "natural",
    brightnessAdjust: 0,
    contrastAdjust: 0,
  });
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const { generateContent, isLoading } = useContentGeneration({
    onSuccess: (content) => {
      onContentGenerated(content);
      toast({ title: "Content generated successfully!" });
    },
    onError: (error: any) => {
      if (error.upgradeRequired) {
        toast({
          title: "Upgrade Required",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Generation failed",
          description: error.message || "Failed to generate content",
          variant: "destructive",
        });
      }
    },
  });

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "File size must be under 10MB",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setShowEnhancement(true);
  };

  const handleEnhancementChange = (settings: EnhancementSettings) => {
    setEnhancementSettings(settings);
  };

  const handleApplyEnhancements = async () => {
    if (!selectedFile || !selectedMood) {
      toast({
        title: "Missing Information",
        description: "Please select a mood before generating content.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessingImage(true);
    
    try {
      // Process the image with enhancements
      let finalFile = selectedFile;
      
      if (enhancementSettings.enhanceImage) {
        // Apply AI enhancement first
        finalFile = await imageProcessor.applyAIEnhancements(selectedFile);
        
        // Apply user-selected filters
        finalFile = await imageProcessor.enhanceImage(finalFile, enhancementSettings);
      }

      // Generate content with enhanced image
      generateContent({ 
        image: finalFile, 
        mood: selectedMood,
        ...enhancementSettings
      });
      
    } catch (error) {
      toast({
        title: "Enhancement Failed",
        description: "Could not process image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessingImage(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleGenerate = () => {
    if (!selectedFile || !selectedMood) {
      toast({
        title: "Missing information",
        description: "Please upload a selfie and select a mood",
        variant: "destructive",
      });
      return;
    }

    generateContent({ image: selectedFile, mood: selectedMood });
  };

  const canGenerate = selectedFile && selectedMood && !isLoading;

  return (
    <Card className="shadow-lg border border-gray-100">
      <CardContent className="p-8">
        <h2 className="font-prata text-2xl mb-6 text-center">Create Your Content Kit</h2>
        
        {/* Step 1: Upload Selfie */}
        <div className="mb-8">
          <label className="block text-sm font-medium mb-3">Step 1: Upload Your Selfie</label>
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
              dragOver 
                ? "border-brand-brown bg-gray-50" 
                : "border-gray-200 hover:border-brand-brown"
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
          >
            {!previewUrl ? (
              <div>
                <CloudUpload className="mx-auto text-3xl text-brand-gray mb-4" size={48} />
                <p className="text-brand-gray mb-2">Drop your selfie here or click to browse</p>
                <p className="text-sm text-gray-400">PNG, JPG up to 10MB</p>
              </div>
            ) : (
              <div>
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="w-32 h-32 object-cover rounded-lg mx-auto mb-4"
                />
                <p className="text-sm text-brand-success">Perfect! Ready to generate content</p>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileInputChange}
          />
        </div>

        {/* Step 2: Select Mood */}
        <div className="mb-8">
          <label className="block text-sm font-medium mb-3">Step 2: Choose Your Mood</label>
          <Select value={selectedMood} onValueChange={setSelectedMood}>
            <SelectTrigger className="w-full p-4 h-auto">
              <SelectValue placeholder="Select your vibe..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="confident">Confident - Bold and powerful</SelectItem>
              <SelectItem value="soft">Soft - Gentle and graceful</SelectItem>
              <SelectItem value="radiant">Radiant - Bright and energetic</SelectItem>
              <SelectItem value="emotional">Emotional - Deep and authentic</SelectItem>
              <SelectItem value="boss">Boss Mode - Leader and achiever</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Step 3: Image Enhancement */}
        {showEnhancement && previewUrl && (
          <div className="mb-8">
            <label className="block text-sm font-medium mb-3">Step 3: Enhance Your Selfie</label>
            <ImageEnhancement
              imageUrl={previewUrl}
              onEnhancementChange={handleEnhancementChange}
              onApplyEnhancements={handleApplyEnhancements}
              isProcessing={isProcessingImage || isLoading}
            />
          </div>
        )}

        {/* Generate Button - Only show if enhancement step is not active */}
        {!showEnhancement && (
          <Button
            className="w-full bg-brand-brown hover:bg-brand-brown/90 py-4 px-6 text-lg"
            onClick={handleGenerate}
            disabled={!canGenerate}
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                Creating your content...
              </div>
            ) : (
              "Generate My Content Kit"
            )}
          </Button>
        )}

        {/* Usage indicator for free users */}
        {user && user.plan === "free" && (
          <div className="mt-4 text-center">
            <p className="text-sm text-brand-gray">
              {user.uploadsThisMonth} of 1 free generation used this month
            </p>
            {user.uploadsThisMonth >= 1 && (
              <p className="text-sm text-brand-brown mt-2">
                Upgrade to Pro for unlimited uploads + downloads + vault access
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
