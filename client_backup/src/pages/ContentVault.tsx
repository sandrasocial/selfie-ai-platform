import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import Header from '@/components/layout/Header';
import StrategyWidget from '@/components/StrategyWidget';

interface Template {
  id: number;
  title: string;
  description: string;
  content: string;
  tags: string[];
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedReach: string;
}

interface VaultEntry {
  id: number;
  templateName: string;
  contentText: string;
  hookText?: string;
  hashtags?: string;
  createdAt: string;
}

interface GeneratedContent {
  dayNumber: number;
  contentText: string;
  hookText: string;
  hashtags: string;
  templateName: string;
}

interface SavedContentItem {
    id: number;
    type: string;
    createdAt: Date;
    title: string;
    content: string;
}

export default function ContentVault() {
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [vaultEntries, setVaultEntries] = useState<VaultEntry[]>([]);
  const [activeTab, setActiveTab] = useState("generate");
  const [exportingPDF, setExportingPDF] = useState(false);
  const { toast } = useToast();
  const [savedContent, setSavedContent] = useState<SavedContentItem[]>([
    {
        id: 1,
        type: "Inspirational",
        createdAt: new Date(),
        title: "Morning Motivation",
        content: "Start your day with a positive mindset. Every day is a new opportunity to achieve your dreams."
    },
    {
        id: 2,
        type: "Educational",
        createdAt: new Date(),
        title: "Tips for Success",
        content: "Learn the key strategies to enhance productivity and achieve your goals efficiently."
    },
    {
        id: 3,
        type: "Promotional",
        createdAt: new Date(),
        title: "Exclusive Offer",
        content: "Don't miss out on our limited-time offer! Get 20% off on all products this week."
    }
  ]);

  useEffect(() => {
    loadVaultEntries();
  }, []);

  const loadVaultEntries = async () => {
    try {
      const response = await fetch('/api/vault', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setVaultEntries(data);
      }
    } catch (error) {
      console.error('Failed to load vault entries:', error);
    }
  };

  const generateContent = async () => {
    if (!selectedDay) {
      toast({
        title: "Select a Day",
        description: "Please select a template day to generate content.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('/api/templates/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          dayNumber: selectedDay,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate content');
      }

      const data = await response.json();
      setGeneratedContent(data);
      setActiveTab("preview");

      toast({
        title: "Content Generated",
        description: `Day ${selectedDay} content is ready for review.`,
      });
    } catch (error) {
      console.error('Content generation error:', error);
      toast({
        title: "Generation Failed",
        description: "Unable to generate content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const saveToCalendar = async (content: GeneratedContent | VaultEntry, dayNumber?: number) => {
    try {
      const response = await fetch('/api/calendar/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          dayNumber: dayNumber || (content as GeneratedContent).dayNumber || 1,
          contentText: content.contentText,
          templateName: content.templateName || 'Generated Content',
          isStrategy: false,
          hookText: content.hookText || '',
          hashtags: content.hashtags || ''
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save to calendar');
      }

      toast({
        title: "Saved to Calendar",
        description: `Content scheduled for Day ${dayNumber || (content as GeneratedContent).dayNumber}.`,
      });
    } catch (error) {
      console.error('Save to calendar error:', error);
      toast({
        title: "Save Failed",
        description: "Unable to save to calendar. Please try again.",
        variant: "destructive",
      });
    }
  };

  const saveToVault = async (content: GeneratedContent) => {
    try {
      const response = await fetch('/api/vault/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          templateName: content.templateName,
          contentText: content.contentText,
          hookText: content.hookText,
          hashtags: content.hashtags
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save to vault');
      }

      await loadVaultEntries();

      toast({
        title: "Saved to Vault",
        description: "Content saved to your personal vault.",
      });
    } catch (error) {
      console.error('Save to vault error:', error);
      toast({
        title: "Save Failed",
        description: "Unable to save to vault. Please try again.",
        variant: "destructive",
      });
    }
  };

  const deleteFromVault = async (vaultId: number) => {
    try {
      const response = await fetch(`/api/vault/${vaultId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to delete from vault');
      }

      await loadVaultEntries();

      toast({
        title: "Deleted from Vault",
        description: "Content removed from your vault.",
      });
    } catch (error) {
      console.error('Delete from vault error:', error);
      toast({
        title: "Delete Failed",
        description: "Unable to delete from vault. Please try again.",
        variant: "destructive",
      });
    }
  };

  const exportVaultAsPDF = async () => {
    setExportingPDF(true);

    toast({
      title: "Generating PDF",
      description: "Creating your content vault PDF",
    });

    try {
      const response = await fetch('/api/export-content-vault', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          contentData: vaultEntries.map(entry => ({
            title: entry.templateName,
            hook: entry.hookText,
            caption: entry.contentText,
            hashtags: entry.hashtags
          }))
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || 'Failed to generate PDF');
      }

      const data = await response.json();

      if (data.success && data.pdfUrl) {
        window.open(data.pdfUrl, '_blank');

        toast({
          title: "PDF Ready",
          description: "Your vault PDF is opening in a new tab",
        });
      } else {
        throw new Error(data.error || 'No PDF URL returned');
      }
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export Failed",
        description: "Unable to export PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setExportingPDF(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Content copied to clipboard.",
    });
  };

  const saveToCalendarMutation = {isPending: false};
  const deleteFromVaultMutation = {isPending: false};

  return (
    <div className="min-h-screen bg-[#F1F1F1] text-[#171719] font-inter">
      <Header />

      {/* Hero Section */}
      <section className="w-full h-[60vh] bg-black text-white flex items-center justify-center text-center px-6">
        <div>
          <h1 className="text-[64px] font-['Cormorant_Garamond'] font-normal leading-tight mb-4">The Vault</h1>
          <p className="italic text-[18px] text-[#F1F1F1] max-w-2xl mx-auto">
            Your best content ideas, curated and saved in style.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 bg-white border border-[#B5B5B3]">
            <TabsTrigger value="generate" className="font-inter text-sm">Generate</TabsTrigger>
            <TabsTrigger value="preview" className="font-inter text-sm">Preview</TabsTrigger>
            <TabsTrigger value="vault" className="font-inter text-sm">My Vault ({vaultEntries.length})</TabsTrigger>
            <TabsTrigger value="strategy" className="font-inter text-sm">Strategy</TabsTrigger>
          </TabsList>

          {/* Generate Content Tab */}
          <TabsContent value="generate" className="space-y-8">
            <Card className="bg-white border border-[#B5B5B3]">
              <CardHeader className="pb-6 px-8 pt-8">
                <CardTitle className="font-['Cormorant_Garamond'] text-2xl font-normal text-[#171719]">Generate New Content</CardTitle>
                <CardDescription className="font-inter text-[#4C4B4B] text-base leading-relaxed">
                  Select a template day to generate personalized content using our AI-powered system.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8 px-8 pb-8">
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="font-inter text-sm font-medium text-[#4C4B4B]">Select Template Day</label>
                    <Select value={selectedDay.toString()} onValueChange={(value) => setSelectedDay(parseInt(value))}>
                      <SelectTrigger className="border-[#B5B5B3] font-inter min-h-[48px] text-base">
                        <SelectValue placeholder="Choose a day..." />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => (
                          <SelectItem key={day} value={day.toString()} className="font-inter py-3">
                            Day {day} Template
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button 
                    onClick={generateContent}
                    disabled={isGenerating}
                    className="w-full bg-[#171719] text-white hover:bg-[#4C4B4B] font-inter min-h-[56px] text-base"
                    size="lg"
                  >
                    {isGenerating ? 'Generating Content...' : 'Generate Content'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preview Tab */}
          <TabsContent value="preview" className="space-y-6">
            {generatedContent ? (
              <Card className="bg-white border border-[#B5B5B3]">
                <CardHeader className="px-8 pt-8">
                  <CardTitle className="flex items-center justify-between">
                    <span className="font-['Cormorant_Garamond'] text-xl">Generated Content - Day {generatedContent.dayNumber}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(generatedContent.contentText)}
                      className="border-[#B5B5B3] text-[#171719] hover:bg-[#F1F1F1] min-h-[44px] px-4"
                    >
                      Copy
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 px-8 pb-8">
                  <div className="bg-[#F1F1F1] p-8">
                    <div className="space-y-6">
                      <div>
                        <label className="font-inter text-sm font-medium text-[#4C4B4B] uppercase tracking-wide">Hook:</label>
                        <p className="font-inter text-sm mt-3 text-[#171719] leading-relaxed">{generatedContent.hookText}</p>
                      </div>
                      <div>
                        <label className="font-inter text-sm font-medium text-[#4C4B4B] uppercase tracking-wide">Content:</label>
                        <p className="font-inter mt-3 text-[#171719] leading-relaxed">{generatedContent.contentText}</p>
                      </div>
                      <div>
                        <label className="font-inter text-sm font-medium text-[#4C4B4B] uppercase tracking-wide">Hashtags:</label>
                        <p className="font-inter text-sm mt-3 text-[#4C4B4B] leading-relaxed">{generatedContent.hashtags}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button 
                      onClick={() => saveToCalendar(generatedContent)}
                      className="flex-1 bg-[#171719] text-white hover:bg-[#4C4B4B] font-inter min-h-[56px] text-base"
                    >
                      Save to Calendar
                    </Button>
                    <Button 
                      onClick={() => saveToVault(generatedContent)}
                      className="flex-1 border border-[#B5B5B3] text-[#171719] hover:bg-[#F1F1F1] font-inter min-h-[56px] text-base"
                      variant="outline"
                    >
                      Save to Vault
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-white border border-[#B5B5B3]">
                <CardContent className="py-12 text-center">
                  <p className="font-inter text-[#4C4B4B]">No content generated yet. Go to Generate tab to create content.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Vault Tab */}
          <TabsContent value="vault" className="space-y-6">
            <Card className="bg-white border border-[#B5B5B3]">
              <CardHeader className="px-8 pt-8">
                <CardTitle className="flex items-center justify-between">
                  <span className="font-['Cormorant_Garamond'] text-xl">My Content Vault</span>
                  {vaultEntries.length > 0 && (
                    <Button 
                      onClick={exportVaultAsPDF} 
                      size="sm" 
                      className="border border-[#B5B5B3] text-[#171719] hover:bg-[#F1F1F1] font-inter min-h-[44px] px-4"
                      variant="outline"
                      disabled={exportingPDF}
                    >
                      {exportingPDF ? 'Generating...' : 'Export PDF'}
                    </Button>
                  )}
                </CardTitle>
                <CardDescription className="font-inter text-[#4C4B4B] text-base">
                  Your saved content items ({vaultEntries.length} items)
                </CardDescription>
              </CardHeader>
              <CardContent>
                {vaultEntries.length === 0 ? (
                  <div className="text-center py-24">
                    <h3 className="font-['Cormorant_Garamond'] text-xl text-[#171719] mb-2">Your Vault Awaits</h3>
                    <p className="font-inter text-[#4C4B4B]">Generate some content to get started!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {vaultEntries.map((entry) => (
                      <div key={entry.id} className="bg-white border border-[#B5B5B3] shadow-sm hover:shadow-md transition-all duration-300">
                        <div className="p-8">
                          <div className="flex items-center gap-2 mb-6">
                            <Badge className="bg-[#F1F1F1] text-[#171719] border-0 font-inter text-xs px-3 py-1">
                              {entry.templateName}
                            </Badge>
                            <span className="font-inter text-xs text-[#4C4B4B]">
                              {new Date(entry.createdAt).toLocaleDateString()}
                            </span>
                          </div>

                          <div className="space-y-4 mb-6">
                            <p className="font-inter text-sm text-[#171719] leading-relaxed line-clamp-3">
                              {entry.contentText}
                            </p>
                            {entry.hookText && (
                              <p className="font-inter text-xs text-[#4C4B4B] italic leading-relaxed">
                                Hook: {entry.hookText}
                              </p>
                            )}
                            {entry.hashtags && (
                              <p className="font-inter text-xs text-[#4C4B4B] leading-relaxed">
                                {entry.hashtags}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="border-t border-[#B5B5B3] p-6 bg-[#F1F1F1]">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => copyToClipboard(entry.contentText)}
                                className="hover:bg-white font-inter text-xs px-3 py-2"
                              >
                                Copy
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => saveToCalendar(entry, 1)}
                                disabled={saveToCalendarMutation.isPending}
                                className="hover:bg-white font-inter text-xs px-3 py-2"
                              >
                                {saveToCalendarMutation.isPending ? 'Saving...' : 'To Calendar'}
                              </Button>
                            </div>

                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => deleteFromVault(entry.id)}
                              disabled={deleteFromVaultMutation.isPending}
                              className="text-red-600 hover:bg-red-50 font-inter text-xs px-3 py-2"
                            >
                              {deleteFromVaultMutation.isPending ? 'Deleting...' : 'Delete'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Strategy Tab */}
          <TabsContent value="strategy" className="space-y-6">
            <Card className="bg-white border border-[#B5B5B3]">
              <CardHeader>
                <CardTitle className="font-['Cormorant_Garamond'] text-xl">Your Posting Strategy</CardTitle>
                <CardDescription className="font-inter text-[#4C4B4B]">
                  AI-generated posting strategy based on your profile
                </CardDescription>
              </CardHeader>
              <CardContent>
                <StrategyWidget />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>
      {/* Content Grid - 3 Column Editorial */}
      <section className="py-20" style={{backgroundColor: '#F1F1F1'}}>
        <div className="container mx-auto px-6 sm:px-8">
          {/* Section Divider with Headline */}
          <div className="text-center mb-16 sm:mb-20">
            <div className="luxury-divider-wide mb-8 sm:mb-10" style={{backgroundColor: '#4c4b4b'}}></div>
            <div className="numbered-headline justify-center mb-8">
              <span className="headline-number">02.</span>
              <h2 className="editorial-h2 text-2xl sm:text-3xl">
                Your Content Archive
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {savedContent.map((item, index) => (
              <Card key={item.id} className={`card-editorial bg-luxury-white transition-all duration-500 hover:scale-102 animate-fadeInUp animate-delay-${(index % 3 + 1) * 100}`} style={{borderBottom: '4px solid transparent'}}>
                <CardHeader className="pb-6 px-6 sm:px-8 pt-8">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <Badge variant="secondary" className="text-xs bg-luxury-accent text-white font-helvetica self-start px-3 py-1">
                      {item.type}
                    </Badge>
                    <span className="editorial-caption text-xs">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <CardTitle className="editorial-h2 text-lg sm:text-xl">{item.title}</CardTitle>
                  <div className="luxury-divider-left mt-4 sm:mt-6" style={{backgroundColor: '#b5b5b3'}}></div>
                </CardHeader>
                <CardContent className="px-6 sm:px-8 pb-8">
                  <p className="editorial-body text-sm mb-6 sm:mb-8 line-clamp-3 leading-relaxed">
                    {item.content}
                  </p>
                  <div className="text-center mb-6">
                    <span className="font-prata italic text-sm opacity-70" style={{color: '#4c4b4b'}}>Saved</span>
                  </div>
                  <div className="flex flex-col gap-3">
                    <Button className="btn-primary text-sm min-h-[48px]">
                      View Content
                    </Button>
                    <div className="flex gap-3">
                      <Button className="btn-secondary flex-1 text-sm min-h-[44px]">
                        Export
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50 min-w-[44px] min-h-[44px]">
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
                <style jsx>{`
                  .card:hover {
                    border-bottom-color: #F5E6DC !important;
                    box-shadow: 0 4px 20px rgba(245, 230, 220, 0.4) !important;
                  }
                `}</style>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}