import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ImageIcon, Sparkles, Camera, Grid, Calendar, Download, Upload, Star, X, RotateCcw, Shuffle, FileImage, Sliders, ExternalLink } from "lucide-react";
import PhotoEditorNew from "./PhotoEditorNew";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface VisualsCreatorProps {
  user?: any;
}

interface GeneratedImage {
  url: string;
  id: string;
}

export default function VisualsCreator({ user }: VisualsCreatorProps) {
  const [futureSelfPrompt, setFutureSelfPrompt] = useState<string>("");
  const [selectedLifestylePreset, setSelectedLifestylePreset] = useState<string>("");
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [saveToCalendarOpen, setSaveToCalendarOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string>('');
  const [uploadedSelfie, setUploadedSelfie] = useState<File | null>(null);
  const [selfiePreview, setSelfiePreview] = useState<string>("");
  const [newlyGenerated, setNewlyGenerated] = useState<string[]>([]);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch visual gallery
  const { data: gallery = { images: [], remainingGenerations: 0 } } = useQuery<{images: string[], remainingGenerations: number | string}>({
    queryKey: ['/api/visual-gallery'],
    enabled: !!user,
  });

  // Handle selfie upload
  const handleSelfieUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedSelfie(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelfiePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Future self generation mutation with selfie support
  const futureSelfMutation = useMutation({
    mutationFn: async ({ prompt, selfieFile }: { prompt: string, selfieFile?: File }) => {
      const formData = new FormData();
      formData.append('prompt', prompt);
      if (selfieFile) {
        formData.append('selfie', selfieFile);
      }
      
      const response = await fetch('/api/generate-future-self', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate future self image');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      if (data.images && data.images.length > 0) {
        const newImages = data.images.map((url: string) => ({
          url,
          id: Math.random().toString(36).substr(2, 9)
        }));
        setGeneratedImages(prev => [...prev, ...newImages]);
        setNewlyGenerated(data.images);
        queryClient.invalidateQueries({ queryKey: ['/api/visual-gallery'] });
        toast({
          title: "Future Self Generated!",
          description: "Your AI-generated image is ready",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Generation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Lifestyle generation mutation
  const lifestyleMutation = useMutation({
    mutationFn: async (preset: string) => {
      const response = await apiRequest("POST", "/api/generate-lifestyle", { preset });
      return response.json();
    },
    onSuccess: (data) => {
      if (data.images && data.images.length > 0) {
        const newImages = data.images.map((url: string) => ({
          url,
          id: Math.random().toString(36).substr(2, 9)
        }));
        setGeneratedImages(prev => [...prev, ...newImages]);
        setNewlyGenerated(data.images);
        queryClient.invalidateQueries({ queryKey: ['/api/visual-gallery'] });
        toast({
          title: "Lifestyle Images Generated!",
          description: `Generated ${data.images.length} ${selectedLifestylePreset} images`,
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Generation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const generateFutureSelf = () => {
    if (!futureSelfPrompt.trim()) {
      toast({
        title: "Missing Prompt",
        description: "Please describe your future self vision",
        variant: "destructive",
      });
      return;
    }

    futureSelfMutation.mutate({
      prompt: futureSelfPrompt,
      selfieFile: uploadedSelfie || undefined
    });
  };

  const generateLifestyle = () => {
    if (!selectedLifestylePreset) {
      toast({
        title: "Select Category",
        description: "Please choose a lifestyle category",
        variant: "destructive",
      });
      return;
    }

    lifestyleMutation.mutate(selectedLifestylePreset);
  };

  const toggleImageSelection = (imageUrl: string) => {
    setSelectedImages(prev => 
      prev.includes(imageUrl) 
        ? prev.filter(url => url !== imageUrl)
        : [...prev, imageUrl]
    );
  };

  const downloadImage = async (imageUrl: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `selfie-ai-image-${Date.now()}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Download Started",
        description: "Your image is being downloaded",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Unable to download image",
        variant: "destructive",
      });
    }
  };

  const saveToCalendar = async () => {
    if (selectedImages.length === 0) {
      toast({
        title: "No Images Selected",
        description: "Please select images to save to calendar",
        variant: "destructive",
      });
      return;
    }

    try {
      await apiRequest("POST", "/api/save-to-calendar", {
        images: selectedImages,
        day: selectedDay
      });
      
      toast({
        title: "Saved to Calendar",
        description: `${selectedImages.length} images saved for ${selectedDay}`,
      });
      
      setSaveToCalendarOpen(false);
      setSelectedImages([]);
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Unable to save to calendar",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-3">
        <h2 className="font-['Prata'] text-3xl text-black">Visual Content Studio</h2>
        <p className="text-gray-600 font-['Inter'] text-lg max-w-2xl mx-auto">
          Generate professional images for your personal brand with AI-powered visuals
        </p>
        {user && (
          <div className="flex items-center justify-center gap-4">
            <Badge variant="outline" className="text-sm">
              Plan: {user.plan?.toUpperCase() || 'FREE'}
            </Badge>
            <Badge variant="outline" className="text-sm">
              Generations Today: {gallery.remainingGenerations === 'unlimited' ? '∞' : `${user.imageGenerationsToday || 0}/1`}
            </Badge>
          </div>
        )}
      </div>

      <Tabs defaultValue="photo-editor" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="photo-editor" className="flex items-center gap-2">
            <Camera className="w-4 h-4" />
            Professional Photo Editor
          </TabsTrigger>
          <TabsTrigger value="lifestyle" className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4" />
            AI Lifestyle Generator
          </TabsTrigger>
        </TabsList>

        <TabsContent value="photo-editor" className="space-y-8">
          <PhotoEditorNew user={user} />
        </TabsContent>

        <TabsContent value="lifestyle" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                <span className="font-['Prata'] text-xl">AI Lifestyle Generator</span>
              </CardTitle>
              <CardDescription className="font-['Inter']">
                Generate realistic, high-end stock imagery for your brand
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Category Selection */}
              <div>
                <Label htmlFor="lifestyle-category">Select Category</Label>
                <Select value={selectedLifestylePreset} onValueChange={setSelectedLifestylePreset}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Choose category..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="workspace">
                      <div>
                        <div className="font-medium">Workspace</div>
                        <div className="text-sm text-gray-500">Aesthetic desk setups, laptops, coffee</div>
                      </div>
                    </SelectItem>
                    <SelectItem value="flatlay">
                      <div>
                        <div className="font-medium">Flatlay</div>
                        <div className="text-sm text-gray-500">Top-down product arrangements</div>
                      </div>
                    </SelectItem>
                    <SelectItem value="accessories">
                      <div>
                        <div className="font-medium">Accessories</div>
                        <div className="text-sm text-gray-500">Jewelry, bags, luxury items</div>
                      </div>
                    </SelectItem>
                    <SelectItem value="coffee">
                      <div>
                        <div className="font-medium">Coffee & Food</div>
                        <div className="text-sm text-gray-500">Aesthetic food photography</div>
                      </div>
                    </SelectItem>
                    <SelectItem value="interiors">
                      <div>
                        <div className="font-medium">Interiors</div>
                        <div className="text-sm text-gray-500">Minimalist home spaces</div>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={generateLifestyle}
                disabled={!selectedLifestylePreset || lifestyleMutation.isPending}
                className="w-full bg-black text-white hover:bg-gray-800 font-['Inter'] font-medium"
              >
                {lifestyleMutation.isPending ? (
                  <>
                    <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate {selectedLifestylePreset ? selectedLifestylePreset.charAt(0).toUpperCase() + selectedLifestylePreset.slice(1) : 'Lifestyle'} Images
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Generated Images Gallery */}
      {gallery.images && gallery.images.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Grid className="w-5 h-5" />
              <span className="font-['Prata'] text-xl">Your Visual Gallery</span>
            </CardTitle>
            <CardDescription className="font-['Inter']">
              {gallery.images.length} images in your collection
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {gallery.images.map((imageUrl, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-square overflow-hidden rounded-lg border">
                    <img 
                      src={imageUrl} 
                      alt={`Generated image ${index + 1}`}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  
                  {/* Image overlay with actions */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 rounded-lg flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => toggleImageSelection(imageUrl)}
                        className={`${selectedImages.includes(imageUrl) ? 'bg-black text-white' : 'bg-white text-black'}`}
                      >
                        {selectedImages.includes(imageUrl) ? <X className="w-4 h-4" /> : <Star className="w-4 h-4" />}
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => downloadImage(imageUrl)}
                        className="bg-white text-black hover:bg-gray-100"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* New image indicator */}
                  {newlyGenerated.includes(imageUrl) && (
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-green-500 text-white text-xs">NEW</Badge>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Gallery Actions */}
            {selectedImages.length > 0 && (
              <div className="mt-6 flex gap-3">
                <Button 
                  onClick={() => setSaveToCalendarOpen(true)}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  Save to Calendar ({selectedImages.length})
                </Button>
                <Button 
                  onClick={() => setSelectedImages([])}
                  variant="ghost"
                  className="flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Clear Selection
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Save to Calendar Dialog */}
      <Dialog open={saveToCalendarOpen} onOpenChange={setSaveToCalendarOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save to Content Calendar</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="calendar-day">Select Day</Label>
              <Select value={selectedDay} onValueChange={setSelectedDay}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Choose day..." />
                </SelectTrigger>
                <SelectContent>
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                    <SelectItem key={day} value={day}>{day}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-3">
              <Button onClick={saveToCalendar} disabled={!selectedDay}>
                Save {selectedImages.length} Images
              </Button>
              <Button variant="outline" onClick={() => setSaveToCalendarOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}