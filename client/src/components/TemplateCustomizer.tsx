
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Download, Wand2, Copy, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import { type Template } from "@/data/templates";

interface TemplateCustomizerProps {
  template: Template | null;
  isOpen: boolean;
  onClose: () => void;
}

interface TemplateCustomization {
  id: string;
  templateType: string;
  customData: {
    title?: string;
    backgroundColor?: string;
    textColor?: string;
    fontFamily?: string;
    fontSize?: string;
    layout?: string;
    elements?: Array<{
      type: 'text' | 'image' | 'shape' | 'icon';
      content?: string;
      position?: { x: number; y: number };
      size?: { width: number; height: number };
      style?: Record<string, any>;
    }>;
    dimensions?: {
      width: number;
      height: number;
    };
    brandColors?: string[];
    logoUrl?: string;
    brandElements?: Record<string, any>;
  };
  createdAt: string;
  updatedAt: string;
}

export default function TemplateCustomizer({ template, isOpen, onClose }: TemplateCustomizerProps) {
  const [customizedPrompt, setCustomizedPrompt] = useState("");
  const [userInputs, setUserInputs] = useState({
    businessName: "",
    targetAudience: "",
    personalStory: "",
    callToAction: ""
  });
  const [isPersonalizing, setIsPersonalizing] = useState(false);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch user's saved templates
  const { data: savedTemplates, isLoading: templatesLoading, error: templatesError } = useQuery<{
    success: boolean;
    data: TemplateCustomization[];
  }>({
    queryKey: ["/api/template-customizer"],
    enabled: isOpen,
    retry: 2
  });

  // Save template customization mutation
  const saveTemplateMutation = useMutation({
    mutationFn: async (templateData: {
      templateType: string;
      customData: any;
    }) => {
      const response = await fetch("/api/template-customizer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(templateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save template");
      }

      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Template Saved",
        description: "Your customized template has been saved successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/template-customizer"] });
    },
    onError: (error: any) => {
      toast({
        title: "Save Failed",
        description: error.message || "Failed to save template customization.",
        variant: "destructive",
      });
    },
  });

  // Update template customization mutation
  const updateTemplateMutation = useMutation({
    mutationFn: async ({ id, templateData }: {
      id: string;
      templateData: Partial<{
        templateType: string;
        customData: any;
      }>;
    }) => {
      const response = await fetch(`/api/template-customizer/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(templateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update template");
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Template Updated",
        description: "Your template customization has been updated.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/template-customizer"] });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update template customization.",
        variant: "destructive",
      });
    },
  });

  // Delete template customization mutation
  const deleteTemplateMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/template-customizer/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete template");
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Template Deleted",
        description: "Template customization has been removed.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/template-customizer"] });
    },
    onError: (error: any) => {
      toast({
        title: "Delete Failed",
        description: error.message || "Failed to delete template customization.",
        variant: "destructive",
      });
    },
  });

  const handleAICustomization = async () => {
    if (!userInputs.businessName || !userInputs.targetAudience) {
      toast({
        title: "Missing Information",
        description: "Please fill in your business name and target audience.",
        variant: "destructive",
      });
      return;
    }

    setIsPersonalizing(true);
    try {
      // Simulate AI personalization - this would integrate with Sandra AI
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const personalizedPrompt = `${template?.reelPrompt}\n\nPersonalized for ${userInputs.businessName} targeting ${userInputs.targetAudience}.\n\nYour story: ${userInputs.personalStory}\n\nCall to action: ${userInputs.callToAction}`;
      setCustomizedPrompt(personalizedPrompt);
      
      toast({
        title: "Template Personalized",
        description: "Your template has been customized with AI.",
      });
    } catch (error) {
      toast({
        title: "Personalization Failed",
        description: "Failed to personalize template. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPersonalizing(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(customizedPrompt);
    toast({
      title: "Copied",
      description: "Template content copied to clipboard.",
    });
  };

  const handleSaveTemplate = () => {
    if (!customizedPrompt || !template) {
      toast({
        title: "No Content",
        description: "Please personalize the template first.",
        variant: "destructive",
      });
      return;
    }

    const templateData = {
      templateType: "custom" as const,
      customData: {
        title: `${template.title} - Personalized`,
        backgroundColor: "#F5F5DC",
        textColor: "#2C2C2C",
        fontFamily: "Prata",
        fontSize: "16px",
        layout: "template-based",
        elements: [
          {
            type: "text" as const,
            content: customizedPrompt,
            position: { x: 20, y: 20 },
            size: { width: 500, height: 300 },
            style: {
              fontFamily: "inherit",
              color: "#2C2C2C"
            }
          }
        ],
        dimensions: {
          width: 540,
          height: 340
        },
        brandColors: ["#3C3A35", "#F5F5DC"],
        brandElements: {
          businessName: userInputs.businessName,
          targetAudience: userInputs.targetAudience,
          personalStory: userInputs.personalStory,
          callToAction: userInputs.callToAction,
          originalTemplate: template.title
        }
      }
    };

    saveTemplateMutation.mutate(templateData);
  };

  // Reset form when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setCustomizedPrompt("");
      setUserInputs({
        businessName: "",
        targetAudience: "",
        personalStory: "",
        callToAction: ""
      });
    }
  }, [isOpen]);

  if (!template) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-[#3C3A35] font-['Prata']">
            Customize: {template.title}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Template Preview */}
          <div className="space-y-4">
            <div className="relative">
              <img 
                src={`/api/assets/${template.coverImage}`} 
                alt={template.title}
                className="w-full h-64 object-cover rounded-lg"
              />
              <Badge className="absolute top-3 left-3 bg-[#3C3A35] text-white">
                {template.category}
              </Badge>
            </div>
            
            <div>
              <h3 className="font-semibold text-[#3C3A35] mb-2">Original Prompt:</h3>
              <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700">
                {template.reelPrompt}
              </div>
            </div>

            {/* Saved Templates Section */}
            <div>
              <h3 className="font-semibold text-[#3C3A35] mb-2">Your Saved Templates:</h3>
              {templatesLoading ? (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  <span className="text-sm text-gray-600">Loading templates...</span>
                </div>
              ) : templatesError ? (
                <div className="bg-red-50 p-3 rounded-lg text-sm text-red-600">
                  Failed to load saved templates
                </div>
              ) : savedTemplates?.data?.length ? (
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {savedTemplates.data.slice(0, 3).map((saved) => (
                    <div key={saved.id} className="bg-gray-50 p-2 rounded text-xs">
                      <span className="font-medium">{saved.customData.title}</span>
                      <div className="flex gap-1 mt-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 px-2 text-xs"
                          onClick={() => deleteTemplateMutation.mutate(saved.id)}
                          disabled={deleteTemplateMutation.isPending}
                        >
                          {deleteTemplateMutation.isPending ? "..." : "Delete"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-500 italic">No saved templates yet</div>
              )}
            </div>
          </div>

          {/* Customization Panel */}
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-[#3C3A35] mb-4">Personalize Your Template</h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="businessName">Your Business/Brand Name</Label>
                  <Input
                    id="businessName"
                    value={userInputs.businessName}
                    onChange={(e) => setUserInputs({...userInputs, businessName: e.target.value})}
                    placeholder="e.g., SELFIE AI"
                  />
                </div>

                <div>
                  <Label htmlFor="targetAudience">Target Audience</Label>
                  <Input
                    id="targetAudience"
                    value={userInputs.targetAudience}
                    onChange={(e) => setUserInputs({...userInputs, targetAudience: e.target.value})}
                    placeholder="e.g., women entrepreneurs, busy moms"
                  />
                </div>

                <div>
                  <Label htmlFor="personalStory">Your Personal Story/Why</Label>
                  <Textarea
                    id="personalStory"
                    value={userInputs.personalStory}
                    onChange={(e) => setUserInputs({...userInputs, personalStory: e.target.value})}
                    placeholder="Share what led you to start your journey..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="callToAction">Call to Action</Label>
                  <Input
                    id="callToAction"
                    value={userInputs.callToAction}
                    onChange={(e) => setUserInputs({...userInputs, callToAction: e.target.value})}
                    placeholder="e.g., DM me 'SELFIE' to get started"
                  />
                </div>
              </div>

              <Button 
                onClick={handleAICustomization}
                className="w-full mt-6 bg-[#3C3A35] hover:bg-[#2a2826] text-white"
                disabled={!userInputs.businessName || !userInputs.targetAudience || isPersonalizing}
              >
                {isPersonalizing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Personalizing...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4 mr-2" />
                    AI Personalize Template
                  </>
                )}
              </Button>
            </div>

            {/* Customized Result */}
            {customizedPrompt && (
              <div>
                <h3 className="font-semibold text-[#3C3A35] mb-2">Your Personalized Template:</h3>
                <div className="bg-[#3C3A35]/5 p-4 rounded-lg border border-[#3C3A35]/20">
                  <Textarea
                    value={customizedPrompt}
                    onChange={(e) => setCustomizedPrompt(e.target.value)}
                    rows={8}
                    className="mb-3"
                  />
                  <div className="flex gap-2">
                    <Button 
                      onClick={copyToClipboard}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Text
                    </Button>
                    <Button 
                      onClick={handleSaveTemplate}
                      size="sm"
                      className="flex-1 bg-[#3C3A35] hover:bg-[#2a2826] text-white"
                      disabled={saveTemplateMutation.isPending}
                    >
                      {saveTemplateMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4 mr-2" />
                          Save Template
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
