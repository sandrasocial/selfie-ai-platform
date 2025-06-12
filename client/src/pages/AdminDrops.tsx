
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Upload, Info, FileText, Link as LinkIcon } from "lucide-react";
import { useLocation } from "wouter";
import { toast } from "@/hooks/use-toast";

type TierOption = 'free' | 'pro' | 'vip';
type DropType = 'Template' | 'Audio' | 'Course' | 'AI Script';

export default function AdminDrops() {
  const [, setLocation] = useLocation();
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'Template' as DropType,
    tierRequired: 'free' as TierOption,
    releaseDate: '',
    fileUrl: '',
    notionUrl: '',
    isFeatured: false
  });

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // Check admin access (simplified for demo)
  const isAdmin = true; // In real implementation, check user role

  if (!isAdmin) {
    setLocation('/');
    toast({
      title: "Access Denied",
      description: "You don't have access to this page.",
      variant: "destructive"
    });
    return null;
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setUploadedFile(file);
      handleInputChange('fileUrl', file.name);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFile(file);
      handleInputChange('fileUrl', file.name);
    }
  };

  const handleUpload = async () => {
    if (!formData.title || !formData.description || (!uploadedFile && !formData.notionUrl)) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);

    try {
      // Simulate upload process
      await new Promise(resolve => setTimeout(resolve, 2000));

      const dropData = {
        ...formData,
        file: uploadedFile
      };

      const response = await fetch('/api/drops/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dropData),
        credentials: 'include'
      });

      if (response.ok) {
        toast({
          title: "Drop Uploaded Successfully",
          description: `"${formData.title}" has been added to the monthly drops.`,
        });
        
        // Reset form
        setFormData({
          title: '',
          description: '',
          type: 'Template',
          tierRequired: 'free',
          releaseDate: '',
          fileUrl: '',
          notionUrl: '',
          isFeatured: false
        });
        setUploadedFile(null);
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your drop. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const getTierBadgeStyle = (tier: TierOption, isSelected: boolean) => {
    if (isSelected) {
      return {
        backgroundColor: '#171719',
        color: '#F1F1F1',
        border: '1px solid #171719'
      };
    }
    return {
      backgroundColor: 'transparent',
      color: '#171719',
      border: '1px solid #171719'
    };
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Editorial Hero Section */}
      <section 
        className="relative py-24 px-6 overflow-hidden"
        style={{
          backgroundImage: 'url(https://i.postimg.cc/W4tbWRNr/45.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div 
          className="absolute inset-0"
          style={{ backgroundColor: 'rgba(241, 241, 241, 0.85)' }}
        />
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h1 
            className="text-6xl font-normal mb-4"
            style={{ 
              fontFamily: 'Cormorant Garamond, serif',
              color: '#171719'
            }}
          >
            Upload Your Next Drop
          </h1>
          
          <p 
            className="text-lg italic"
            style={{ 
              fontFamily: 'Neue Einstellung, sans-serif',
              color: '#4C4B4B'
            }}
          >
            Curate content. Elevate brands.
          </p>
        </div>
      </section>

      {/* Main Upload Form */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-12">
            
            {/* Form Sections */}
            <div className="lg:col-span-2 space-y-12">
              
              {/* Step 1 - Details */}
              <div>
                <div className="mb-8">
                  <h2 
                    className="text-sm uppercase tracking-widest mb-2"
                    style={{ 
                      fontFamily: 'Neue Einstellung, sans-serif',
                      color: '#4C4B4B',
                      letterSpacing: '0.3em'
                    }}
                  >
                    Step 1 — Details
                  </h2>
                  <div 
                    className="w-24 h-px"
                    style={{ backgroundColor: '#B5B5B3' }}
                  />
                </div>

                <div className="space-y-6">
                  <div>
                    <label 
                      className="block text-sm font-medium mb-2"
                      style={{ 
                        fontFamily: 'Neue Einstellung, sans-serif',
                        color: '#171719'
                      }}
                    >
                      Drop Name
                    </label>
                    <Input
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Visual Confidence Templates"
                      className="border-0 border-b border-gray-300 rounded-none bg-transparent px-0 py-3 focus:border-black"
                      style={{ fontFamily: 'Neue Einstellung, sans-serif' }}
                    />
                  </div>

                  <div>
                    <label 
                      className="block text-sm font-medium mb-2"
                      style={{ 
                        fontFamily: 'Neue Einstellung, sans-serif',
                        color: '#171719'
                      }}
                    >
                      Description
                    </label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Instagram story templates designed to boost your camera confidence..."
                      rows={4}
                      className="border border-gray-300 rounded-none resize-none"
                      style={{ fontFamily: 'Neue Einstellung, sans-serif' }}
                    />
                  </div>

                  <div>
                    <label 
                      className="block text-sm font-medium mb-2"
                      style={{ 
                        fontFamily: 'Neue Einstellung, sans-serif',
                        color: '#171719'
                      }}
                    >
                      Type
                    </label>
                    <div className="flex gap-2">
                      {(['Template', 'Audio', 'Course', 'AI Script'] as DropType[]).map((type) => (
                        <Button
                          key={type}
                          variant="outline"
                          onClick={() => handleInputChange('type', type)}
                          className={`px-4 py-2 text-xs uppercase border transition-all duration-200 ${
                            formData.type === type 
                              ? 'bg-[#171719] text-white border-[#171719]' 
                              : 'bg-transparent text-[#171719] border-[#171719] hover:bg-[#171719] hover:text-white'
                          }`}
                          style={{ 
                            fontFamily: 'Neue Einstellung, sans-serif',
                            borderRadius: '0px',
                            letterSpacing: '0.3em'
                          }}
                        >
                          {type}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Vertical Divider */}
              <div 
                className="w-px h-16 mx-auto"
                style={{ backgroundColor: '#B5B5B3' }}
              />

              {/* Step 2 - Upload Assets */}
              <div>
                <div className="mb-8">
                  <h2 
                    className="text-sm uppercase tracking-widest mb-2"
                    style={{ 
                      fontFamily: 'Neue Einstellung, sans-serif',
                      color: '#4C4B4B',
                      letterSpacing: '0.3em'
                    }}
                  >
                    Step 2 — Upload Assets
                  </h2>
                  <div 
                    className="w-24 h-px"
                    style={{ backgroundColor: '#B5B5B3' }}
                  />
                </div>

                <div className="space-y-6">
                  {/* Drag & Drop Zone */}
                  <div
                    className={`border-2 border-dashed p-12 text-center transition-all duration-300 cursor-pointer ${
                      dragActive ? 'border-black bg-gray-50' : 'border-gray-300'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p 
                      className="text-lg mb-2"
                      style={{ 
                        fontFamily: 'Neue Einstellung, sans-serif',
                        color: '#4C4B4B'
                      }}
                    >
                      Drop a PDF, ZIP or add your Notion link below…
                    </p>
                    {uploadedFile && (
                      <p 
                        className="text-sm text-green-600"
                        style={{ fontFamily: 'Neue Einstellung, sans-serif' }}
                      >
                        File selected: {uploadedFile.name}
                      </p>
                    )}
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileSelect}
                    accept=".pdf,.zip,.doc,.docx"
                    className="hidden"
                  />

                  {/* Notion URL Input */}
                  <div>
                    <Input
                      value={formData.notionUrl}
                      onChange={(e) => handleInputChange('notionUrl', e.target.value)}
                      placeholder="https://notion.so/your-drop-url"
                      className="border-0 border-b border-gray-300 rounded-none bg-transparent px-0 py-3 focus:border-black"
                      style={{ fontFamily: 'Neue Einstellung, sans-serif' }}
                    />
                  </div>
                </div>
              </div>

              {/* Vertical Divider */}
              <div 
                className="w-px h-16 mx-auto"
                style={{ backgroundColor: '#B5B5B3' }}
              />

              {/* Step 3 - Publish Date & Access */}
              <div>
                <div className="mb-8">
                  <h2 
                    className="text-sm uppercase tracking-widest mb-2"
                    style={{ 
                      fontFamily: 'Neue Einstellung, sans-serif',
                      color: '#4C4B4B',
                      letterSpacing: '0.3em'
                    }}
                  >
                    Step 3 — Publish Date & Access
                  </h2>
                  <div 
                    className="w-24 h-px"
                    style={{ backgroundColor: '#B5B5B3' }}
                  />
                </div>

                <div className="space-y-6">
                  {/* Tier Badge Selector */}
                  <div>
                    <label 
                      className="block text-sm font-medium mb-4"
                      style={{ 
                        fontFamily: 'Neue Einstellung, sans-serif',
                        color: '#171719'
                      }}
                    >
                      Access Tier
                    </label>
                    <div className="flex gap-2">
                      {(['free', 'pro', 'vip'] as TierOption[]).map((tier) => (
                        <Button
                          key={tier}
                          variant="outline"
                          onClick={() => handleInputChange('tierRequired', tier)}
                          className="px-6 py-3 text-xs uppercase border transition-all duration-200"
                          style={{ 
                            ...getTierBadgeStyle(tier, formData.tierRequired === tier),
                            fontFamily: 'Neue Einstellung, sans-serif',
                            borderRadius: '0px',
                            letterSpacing: '0.3em'
                          }}
                        >
                          {tier.toUpperCase()}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Release Date */}
                  <div>
                    <label 
                      className="block text-sm font-medium mb-2"
                      style={{ 
                        fontFamily: 'Neue Einstellung, sans-serif',
                        color: '#171719'
                      }}
                    >
                      Release Date
                    </label>
                    <Input
                      type="date"
                      value={formData.releaseDate}
                      onChange={(e) => handleInputChange('releaseDate', e.target.value)}
                      className="border-0 border-b border-gray-300 rounded-none bg-transparent px-0 py-3 focus:border-black"
                      style={{ fontFamily: 'Neue Einstellung, sans-serif' }}
                    />
                  </div>

                  {/* Featured Toggle */}
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={formData.isFeatured}
                      onChange={(e) => handleInputChange('isFeatured', e.target.checked)}
                      className="w-4 h-4"
                    />
                    <label 
                      htmlFor="featured"
                      className="text-sm"
                      style={{ 
                        fontFamily: 'Neue Einstellung, sans-serif',
                        color: '#171719'
                      }}
                    >
                      Feature this drop
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Preview Card */}
            {(formData.title || formData.tierRequired) && (
              <div className="lg:col-span-1">
                <div className="sticky top-8">
                  <Card 
                    className="border border-black"
                    style={{ 
                      backgroundColor: 'white',
                      borderRadius: '0px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <Badge 
                            className="uppercase text-xs"
                            style={{
                              ...getTierBadgeStyle(formData.tierRequired, true),
                              fontFamily: 'Neue Einstellung, sans-serif',
                              borderRadius: '0px',
                              letterSpacing: '0.3em'
                            }}
                          >
                            {formData.tierRequired.toUpperCase()}
                          </Badge>
                          {formData.isFeatured && (
                            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                              Featured
                            </Badge>
                          )}
                        </div>

                        <h3 
                          className="text-xl font-normal"
                          style={{ 
                            fontFamily: 'Cormorant Garamond, serif',
                            color: '#171719'
                          }}
                        >
                          {formData.title || 'Drop Preview'}
                        </h3>

                        {formData.description && (
                          <p 
                            className="text-sm text-gray-600"
                            style={{ fontFamily: 'Neue Einstellung, sans-serif' }}
                          >
                            {formData.description}
                          </p>
                        )}

                        {formData.releaseDate && (
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Calendar className="w-4 h-4" />
                            <span style={{ fontFamily: 'Neue Einstellung, sans-serif' }}>
                              {new Date(formData.releaseDate).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Sticky Upload Bar */}
      <div 
        className="fixed bottom-0 left-0 right-0 p-6 z-50"
        style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}
      >
        <div className="max-w-6xl mx-auto flex justify-end">
          <Button
            onClick={handleUpload}
            disabled={isUploading}
            className="px-12 py-4 text-sm font-medium uppercase tracking-wide border transition-all duration-300 hover:bg-[#171719] hover:text-white disabled:opacity-50"
            style={{ 
              backgroundColor: 'transparent',
              color: '#171719',
              border: '1px solid #171719',
              borderRadius: '0px',
              fontFamily: 'Neue Einstellung, sans-serif',
              letterSpacing: '0.5px'
            }}
          >
            {isUploading ? (
              <>
                <Upload className="w-4 h-4 mr-2 animate-spin" />
                Uploading Drop...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload Drop
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
