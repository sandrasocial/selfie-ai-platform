import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Save, Download, Grid3X3, Instagram } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import type { ContentGeneration } from "@/types";

interface ContentPreviewProps {
  content: ContentGeneration;
  user?: any;
}

export default function ContentPreview({ content, user }: ContentPreviewProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const downloadMutation = useMutation({
    mutationFn: () => fetch(`/api/download/${content.id}`, { credentials: "include" }),
    onSuccess: async (response) => {
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "selfie-ai-content-kit.pdf";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast({ title: "PDF downloaded successfully!" });
      } else {
        const error = await response.json();
        throw new Error(error.message);
      }
    },
    onError: (error: any) => {
      toast({
        title: "Download failed",
        description: error.message || "Failed to download PDF",
        variant: "destructive",
      });
    },
  });

  const handleSaveToVault = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save content to your vault",
        variant: "destructive",
      });
      return;
    }

    toast({ title: "Content saved to your vault!" });
    queryClient.invalidateQueries({ queryKey: ["/api/vault"] });
  };

  const handleDownloadPDF = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to download PDFs",
        variant: "destructive",
      });
      return;
    }

    if (user.plan !== "pro") {
      toast({
        title: "Upgrade required",
        description: "PDF downloads require Pro plan",
        variant: "destructive",
      });
      return;
    }

    downloadMutation.mutate();
  };

  const formatIcon = () => {
    switch (content.recommendedFormat) {
      case "Instagram Carousel":
        return <Grid3X3 className="text-white" size={20} />;
      default:
        return <Instagram className="text-white" size={20} />;
    }
  };

  return (
    <Card className="shadow-lg border border-gray-100">
      <CardContent className="p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-prata text-2xl">Your Content Kit</h2>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={handleSaveToVault}
              className="border-brand-brown text-brand-brown hover:bg-brand-brown hover:text-white"
            >
              <Save className="mr-2" size={16} />
              Save to Vault
            </Button>
            <Button
              onClick={handleDownloadPDF}
              className="bg-brand-brown hover:bg-brand-brown/90"
              disabled={downloadMutation.isPending}
            >
              <Download className="mr-2" size={16} />
              {downloadMutation.isPending ? "Generating..." : "Download PDF"}
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left: Preview Image */}
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-medium mb-4">Your Selfie</h3>
              <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                <img 
                  src={content.imageUrl} 
                  alt="Your selfie" 
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            </div>

            {/* Recommended Format */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-medium mb-3">Recommended Format</h3>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-brand-brown rounded-lg flex items-center justify-center">
                  {formatIcon()}
                </div>
                <div>
                  <p className="font-medium">{content.recommendedFormat}</p>
                  <p className="text-sm text-brand-gray">
                    {content.recommendedFormat === "Instagram Carousel" 
                      ? "Best for storytelling with multiple slides"
                      : "Perfect for single impactful posts"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Generated Content */}
          <div className="space-y-6">
            {/* Instagram Captions */}
            <div>
              <h3 className="font-medium mb-4">Instagram Captions</h3>
              <div className="space-y-3">
                {(content.captions as string[]).map((caption, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm leading-relaxed">{caption}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Personal Affirmations */}
            <div>
              <h3 className="font-medium mb-4">Personal Affirmations</h3>
              <div className="space-y-2">
                {(content.affirmations as string[]).map((affirmation, index) => (
                  <div key={index} className="bg-brand-brown bg-opacity-5 rounded-lg p-3">
                    <p className="text-sm font-medium">{affirmation}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Pose Tips */}
            <div>
              <h3 className="font-medium mb-4">Selfie Pose Tips</h3>
              <div className="space-y-2">
                {(content.poseTips as string[]).map((tip, index) => (
                  <div key={index} className="bg-blue-50 rounded-lg p-3">
                    <p className="text-sm">{tip}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Lighting Advice */}
            <div>
              <h3 className="font-medium mb-4">Lighting & Setup</h3>
              <div className="bg-yellow-50 rounded-lg p-4">
                <p className="text-sm leading-relaxed">{content.lightingAdvice}</p>
              </div>
            </div>

            {/* Story Caption */}
            <div>
              <h3 className="font-medium mb-4">Full Story Caption</h3>
              <div className="bg-purple-50 rounded-lg p-4">
                <p className="text-sm leading-relaxed whitespace-pre-line">{content.storyCaption}</p>
              </div>
            </div>

            {/* Hashtags */}
            <div>
              <h3 className="font-medium mb-4">Relevant Hashtags</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-brand-brown">{content.hashtags}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
