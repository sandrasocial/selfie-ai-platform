import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Upload, Sparkles, Camera, Calendar, Grid, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface FutureSelfAIProps {
  user?: any;
}

interface GeneratedImage {
  url: string;
  type: 'future_self' | 'lifestyle';
  category?: string;
  id: string;
}

export default function FutureSelfAI({ user }: FutureSelfAIProps) {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [futureSelfPrompt, setFutureSelfPrompt] = useState<string>("");
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState<string>("");
  const [saveToCalendarOpen, setSaveToCalendarOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const [selectedDay, setSelectedDay] = useState<string>('');
  const [calendarCaption, setCalendarCaption] = useState<string>('');
  const [calendarHook, setCalendarHook] = useState<string>('');
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Lifestyle categories for B-roll generation with hardcoded tested prompts
  const lifestyleCategories = [
    { key: 'coffee-desk', label: 'Coffee Desk ☕', prompt: 'Flatlay with coffee cup, marble table, gold accessories, feminine touch' },
    { key: 'accessories', label: 'Accessories Flatlay 💍', prompt: 'Black and white Vogue style editorial photo, woman with sunglasses' },
    { key: 'vogue', label: 'Black & White Vogue Touch 🖤', prompt: 'Neutral cozy home interior, candle, books, soft natural lighting' },
    { key: 'interior', label: 'Interior Soft Shadows 🪞', prompt: 'Laptop workspace on marble desk with latte and glasses' },
    { key: 'workspace', label: 'Workspace Setup 💻', prompt: 'Minimalist fashion shot of black ankle boots on textured rug' }
  ];

  // Handle image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Generate Future Self images
  const generateFutureSelfMutation = useMutation({
    mutationFn: async ({ prompt, selfieFile }: { prompt: string, selfieFile?: File }) => {
      setIsGenerating(true);
      setCurrentStep("Visualizing your future self...");
      
      // Step 1: Generate 2 Future Self images with selfie conditioning
      const formData = new FormData();
      formData.append('prompt', prompt);
      if (selfieFile) {
        formData.append('selfieImage', selfieFile);
      }
      
      const futureSelfResponse = await apiRequest('POST', '/api/generate-future-self', formData) as any;
      
      setCurrentStep("Creating lifestyle B-roll collection...");
      
      // Step 2: Generate 5 lifestyle images sequentially to avoid API limits
      const lifestyleResults = [];
      for (let i = 0; i < lifestyleCategories.length; i++) {
        const category = lifestyleCategories[i];
        setCurrentStep(`Creating ${category.label.toLowerCase()} (${i + 1}/5)...`);
        
        try {
          const response = await apiRequest('POST', '/api/generate-lifestyle', { preset: category.key }) as any;
          
          if (response.images && response.images.length > 0) {
            lifestyleResults.push({
              url: response.images[0], // Take first image from each preset
              category: category.key,
              label: category.label
            });
          }
        } catch (error) {
          console.error(`Failed to generate ${category.label}:`, error);
          // Continue with other categories even if one fails
        }
        
        // Small delay between requests to be API-friendly
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      setCurrentStep("Finalizing your visual collection...");
      
      return {
        futureSelf: futureSelfResponse.images || [],
        lifestyle: lifestyleResults
      };
    },
    onSuccess: (data: any) => {
      // Combine all images with proper typing
      const allImages: GeneratedImage[] = [
        ...data.futureSelf.map((url: string, index: number) => ({
          url,
          type: 'future_self' as const,
          id: `future-${Date.now()}-${index}`
        })),
        ...data.lifestyle.map((item: any, index: number) => ({
          url: item.url,
          type: 'lifestyle' as const,
          category: item.category,
          id: `lifestyle-${Date.now()}-${index}`
        }))
      ];
      
      if (allImages.length === 0) {
        toast({
          title: "No images generated",
          description: "Please try again or adjust your prompt",
          variant: "destructive"
        });
        setIsGenerating(false);
        setCurrentStep("");
        return;
      }
      
      setGeneratedImages(allImages);
      queryClient.invalidateQueries({ queryKey: ['/api/visual-gallery'] });
      setIsGenerating(false);
      setCurrentStep("");
      
      toast({ 
        title: "Future Self Complete! ✨", 
        description: `Generated ${allImages.length} images for your visual collection`
      });
    },
    onError: (error: any) => {
      setIsGenerating(false);
      setCurrentStep("");
      toast({
        title: "Generation failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Save to calendar mutation
  const saveToCalendarMutation = useMutation({
    mutationFn: async (data: any) => {
      const formData = new FormData();
      Object.keys(data).forEach(key => {
        if (data[key] !== null && data[key] !== undefined) {
          formData.append(key, data[key]);
        }
      });
      return apiRequest('POST', '/api/calendar', formData);
    },
    onSuccess: () => {
      toast({ title: "Image saved to calendar!" });
      queryClient.invalidateQueries({ queryKey: ['/api/calendar'] });
      setSaveToCalendarOpen(false);
      setSelectedImage(null);
      setSelectedDay('');
      setCalendarCaption('');
      setCalendarHook('');
    },
    onError: (error: any) => {
      toast({
        title: "Failed to save to calendar",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const handleGenerateFutureSelf = () => {
    if (!uploadedImage) {
      toast({
        title: "Selfie required",
        description: "Please upload a selfie to generate your Future Self",
        variant: "destructive"
      });
      return;
    }

    if (!futureSelfPrompt.trim()) {
      toast({
        title: "Vision required",
        description: "Please describe your Future Self vision",
        variant: "destructive"
      });
      return;
    }

    if (!user || (user.plan !== 'pro' && user.imageGenerationsToday >= 1)) {
      toast({
        title: "Generation limit reached",
        description: user.plan !== 'pro' ? "Upgrade to PRO for unlimited generations" : "Daily limit reached",
        variant: "destructive"
      });
      return;
    }

    generateFutureSelfMutation.mutate({
      prompt: futureSelfPrompt,
      selfieFile: uploadedImage
    });
  };

  const openSaveToCalendar = (image: GeneratedImage) => {
    if (!user || user.plan !== 'pro') {
      toast({
        title: "PRO membership required",
        description: "Upgrade to save images to your calendar",
        variant: "destructive"
      });
      return;
    }
    setSelectedImage(image);
    setSaveToCalendarOpen(true);
  };

  const handleSaveToCalendar = () => {
    if (!selectedDay || !selectedImage) {
      toast({
        title: "Selection required",
        description: "Please select a day",
        variant: "destructive"
      });
      return;
    }

    const dataToSave = {
      dayOfWeek: selectedDay,
      imageUrl: selectedImage.url,
      caption: calendarCaption || '',
      hook: calendarHook || '',
      notes: `Future Self AI - ${selectedImage.type === 'future_self' ? 'Future Self' : selectedImage.category || 'Lifestyle'}`
    };

    saveToCalendarMutation.mutate(dataToSave);
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-3">
        <h2 className="font-['Prata'] text-3xl text-black">Future Self AI</h2>
        <p className="text-gray-600 font-['Inter'] text-lg max-w-2xl mx-auto">
          Upload your selfie and describe your vision. AI will generate your Future Self plus lifestyle B-roll images.
        </p>
        {user && (
          <div className="flex items-center justify-center gap-4">
            <Badge variant="outline" className="text-sm">
              Plan: {user.plan?.toUpperCase() || 'FREE'}
            </Badge>
            <Badge variant="outline" className="text-sm">
              Generations Today: {user.plan === 'pro' ? '∞' : `${user.imageGenerationsToday || 0}/1`}
            </Badge>
          </div>
        )}
      </div>

      {/* Upload & Generation Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5" />
            <span className="font-['Prata'] text-xl">Create Your Future Self</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Selfie Upload */}
          <div>
            <Label htmlFor="selfie-upload">Upload Your Selfie</Label>
            <div className="mt-2">
              {imagePreview ? (
                <div className="relative w-full max-w-xs mx-auto">
                  <img
                    src={imagePreview}
                    alt="Uploaded selfie"
                    className="w-full h-48 object-cover rounded-xl border border-gray-200"
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setUploadedImage(null);
                      setImagePreview("");
                    }}
                    className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                  >
                    Change
                  </Button>
                </div>
              ) : (
                <div className="w-full max-w-xs mx-auto">
                  <label
                    htmlFor="selfie-upload"
                    className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100"
                  >
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">Click to upload selfie</p>
                    <p className="text-xs text-gray-400">PNG, JPG up to 10MB</p>
                  </label>
                  <input
                    id="selfie-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Future Self Vision */}
          <div>
            <Label htmlFor="future-vision">Describe Your Future Self</Label>
            <Textarea
              id="future-vision"
              placeholder="Example: A confident CEO in Paris wearing a neutral power suit, glowing skin, and statement jewelry"
              value={futureSelfPrompt}
              onChange={(e) => setFutureSelfPrompt(e.target.value)}
              className="mt-2"
              rows={3}
            />
            <p className="text-sm text-gray-500 mt-1">
              Be specific about style, setting, mood, and details for best results
            </p>
          </div>

          {/* Generate Button */}
          <Button 
            onClick={handleGenerateFutureSelf}
            disabled={isGenerating || !uploadedImage || !futureSelfPrompt.trim()}
            className="w-full"
            size="lg"
          >
            {isGenerating ? (
              <>
                <div className="flex space-x-1 mr-2">
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                {currentStep || "Generating..."}
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate My Future Self (7 Images)
              </>
            )}
          </Button>

          {isGenerating && (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-black rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-gray-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
                <div>
                  <p className="text-sm font-medium text-black">{currentStep} ✨</p>
                  <p className="text-xs text-gray-600">This may take 30-60 seconds...</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Generated Images Display */}
      {generatedImages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Grid className="w-5 h-5" />
              <span className="font-['Prata'] text-xl">Your Future Self Collection</span>
              <Badge variant="outline" className="text-sm">
                {generatedImages.length} Images
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Future Self Images */}
            <div className="mb-8">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Camera className="w-5 h-5" />
                Future Self Portraits ({generatedImages.filter(img => img.type === 'future_self').length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {generatedImages
                  .filter(img => img.type === 'future_self')
                  .map((image, index) => (
                    <div key={image.id} className="relative group">
                      <div className="border border-gray-200 rounded-xl overflow-hidden">
                        <img
                          src={image.url}
                          alt={`Future Self ${index + 1}`}
                          className="w-full h-64 object-cover"
                        />
                        <div className="absolute top-2 left-2 bg-purple-500 text-white rounded-full px-3 py-1 text-xs font-medium">
                          Future Self
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="sm"
                            onClick={() => openSaveToCalendar(image)}
                            className="w-full bg-white text-black hover:bg-gray-100"
                          >
                            <Calendar className="w-4 h-4 mr-2" />
                            Save to Calendar
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Lifestyle Images */}
            <div>
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Grid className="w-5 h-5" />
                Lifestyle B-Roll ({generatedImages.filter(img => img.type === 'lifestyle').length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {generatedImages
                  .filter(img => img.type === 'lifestyle')
                  .map((image, index) => {
                    const category = lifestyleCategories.find(cat => cat.key === image.category);
                    return (
                      <div key={image.id} className="relative group">
                        <div className="border border-gray-200 rounded-xl overflow-hidden">
                          <img
                            src={image.url}
                            alt={`Lifestyle ${index + 1}`}
                            className="w-full h-48 object-cover"
                          />
                          <div className="absolute top-2 left-2 bg-blue-500 text-white rounded-full px-2 py-1 text-xs font-medium">
                            {category?.label.split(' ')[0] || 'Lifestyle'}
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              size="sm"
                              onClick={() => openSaveToCalendar(image)}
                              className="w-full bg-white text-black hover:bg-gray-100 text-xs"
                            >
                              <Calendar className="w-3 h-3 mr-1" />
                              Save
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Save to Calendar Dialog */}
      <Dialog open={saveToCalendarOpen} onOpenChange={setSaveToCalendarOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Save to Weekly Calendar</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {selectedImage && (
              <div>
                <Label>Image Preview</Label>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <img
                    src={selectedImage.url}
                    alt="Selected image"
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-2 bg-gray-50">
                    <p className="text-sm text-gray-600">
                      {selectedImage.type === 'future_self' ? 'Future Self Portrait' : 
                       lifestyleCategories.find(cat => cat.key === selectedImage.category)?.label || 'Lifestyle Image'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="day">Select Day</Label>
              <Select value={selectedDay} onValueChange={setSelectedDay}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a day..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Monday">Monday</SelectItem>
                  <SelectItem value="Tuesday">Tuesday</SelectItem>
                  <SelectItem value="Wednesday">Wednesday</SelectItem>
                  <SelectItem value="Thursday">Thursday</SelectItem>
                  <SelectItem value="Friday">Friday</SelectItem>
                  <SelectItem value="Saturday">Saturday</SelectItem>
                  <SelectItem value="Sunday">Sunday</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="caption">Caption (Optional)</Label>
              <Textarea
                id="caption"
                placeholder="Add a caption for this image..."
                value={calendarCaption}
                onChange={(e) => setCalendarCaption(e.target.value)}
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="hook">Hook (Optional)</Label>
              <Textarea
                id="hook"
                placeholder="Add a hook for this image..."
                value={calendarHook}
                onChange={(e) => setCalendarHook(e.target.value)}
                rows={2}
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleSaveToCalendar}
                disabled={saveToCalendarMutation.isPending || !selectedDay}
                className="flex-1"
              >
                {saveToCalendarMutation.isPending ? 'Saving...' : 'Save to Calendar'}
              </Button>
              <Button
                variant="outline"
                onClick={() => setSaveToCalendarOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}