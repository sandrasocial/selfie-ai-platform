
import React, { useState } from 'react';
import { Link } from "wouter";
import { ArrowLeft, Filter, Calendar, Tag } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";

interface VaultImage {
  id: string;
  file_url: string;
  file_name?: string;
  tags?: string[];
  uploaded_at?: string;
  color_tone?: string;
}

export default function PhotoVault() {
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [tagFilter, setTagFilter] = useState<string>('all');
  const [colorFilter, setColorFilter] = useState<string>('all');

  const { data: user } = useQuery({
    queryKey: ["/api/me"],
    retry: false,
  });

  // Fetch user's vault images
  const { data: vaultImages, isLoading } = useQuery<VaultImage[]>({
    queryKey: ['/api/vault-images', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const response = await fetch(`/api/vault-images?userId=${user.id}`, {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch vault images');
      return response.json();
    },
    enabled: !!user?.id
  });

  // Filter images based on selected filters
  const filteredImages = vaultImages?.filter(image => {
    if (dateFilter !== 'all') {
      const imageDate = new Date(image.uploaded_at || '');
      const now = new Date();
      
      if (dateFilter === 'today') {
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        if (imageDate < today) return false;
      } else if (dateFilter === 'week') {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        if (imageDate < weekAgo) return false;
      } else if (dateFilter === 'month') {
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        if (imageDate < monthAgo) return false;
      }
    }

    if (tagFilter !== 'all' && !image.tags?.includes(tagFilter)) {
      return false;
    }

    if (colorFilter !== 'all' && image.color_tone !== colorFilter) {
      return false;
    }

    return true;
  }) || [];

  // Get unique tags and color tones for filter dropdowns
  const availableTags = Array.from(
    new Set(vaultImages?.flatMap(img => img.tags || []) || [])
  );
  
  const availableColorTones = Array.from(
    new Set(vaultImages?.map(img => img.color_tone).filter(Boolean) || [])
  );

  return (
    <div className="min-h-screen bg-[#F1F1F1]">
      <Header user={user} />
      
      {/* Studio Navigation */}
      <section className="w-full py-4 px-4 border-b border-[#B5B5B3] sticky top-0 bg-white z-40">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/studio" className="inline-flex items-center text-[#4C4B4B] hover:text-[#171719] transition-colors">
            <ArrowLeft size={16} className="mr-2" />
            <span style={{ fontFamily: 'Neue Einstellung, sans-serif', fontSize: '14px' }}>
              Back to Studio
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/studio/notes" 
              className="text-[#4C4B4B] hover:text-[#171719] transition-colors"
              style={{ fontFamily: 'Neue Einstellung, sans-serif', fontSize: '14px' }}
            >
              Brand Notes
            </Link>
            <Link 
              href="/studio/tagger" 
              className="text-[#4C4B4B] hover:text-[#171719] transition-colors"
              style={{ fontFamily: 'Neue Einstellung, sans-serif', fontSize: '14px' }}
            >
              Auto Tagger
            </Link>
            <Link 
              href="/studio/editor" 
              className="text-[#4C4B4B] hover:text-[#171719] transition-colors"
              style={{ fontFamily: 'Neue Einstellung, sans-serif', fontSize: '14px' }}
            >
              Selfie Editor
            </Link>
            <Link 
              href="/studio/photo-vault" 
              className="text-[#171719] font-medium border-b-2 border-[#171719] pb-1"
              style={{ fontFamily: 'Neue Einstellung, sans-serif', fontSize: '14px' }}
            >
              Photo Vault
            </Link>
          </nav>
        </div>
      </section>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 
            className="text-5xl md:text-6xl font-normal mb-8 uppercase tracking-wide text-[#171719]"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            Photo Vault
          </h1>
          <div className="w-24 h-px mx-auto mb-8 bg-[#171719]"></div>
          <p 
            className="text-lg mb-12 max-w-2xl mx-auto text-[#4C4B4B]"
            style={{ fontFamily: 'Neue Einstellung, sans-serif', fontWeight: '300' }}
          >
            Your curated collection of brand visuals
          </p>
        </div>
      </section>

      {/* Filter Controls & Grid */}
      <section className="px-4 pb-20">
        <div className="max-w-7xl mx-auto">
          {/* Filter Controls */}
          <div className="flex flex-wrap justify-center gap-6 mb-16">
            {/* Date Filter */}
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger 
                className="w-48 bg-white border border-[#171719] hover:border-[#171719] focus:border-[#171719] text-[#000]" 
                style={{ fontFamily: 'Neue Einstellung, sans-serif', fontSize: '14px', borderRadius: '0px', color: '#000' }}
              >
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by Date" />
              </SelectTrigger>
              <SelectContent 
                className="bg-white border border-[#171719] text-[#000]"
                style={{ borderRadius: '0px' }}
              >
                <SelectItem value="all" style={{ color: '#000' }}>All Dates</SelectItem>
                <SelectItem value="today" style={{ color: '#000' }}>Today</SelectItem>
                <SelectItem value="week" style={{ color: '#000' }}>This Week</SelectItem>
                <SelectItem value="month" style={{ color: '#000' }}>This Month</SelectItem>
              </SelectContent>
            </Select>

            {/* Tag Filter */}
            <Select value={tagFilter} onValueChange={setTagFilter}>
              <SelectTrigger 
                className="w-48 bg-white border border-[#171719] hover:border-[#171719] focus:border-[#171719] text-[#000]" 
                style={{ fontFamily: 'Neue Einstellung, sans-serif', fontSize: '14px', borderRadius: '0px', color: '#000' }}
              >
                <Tag className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by Tag" />
              </SelectTrigger>
              <SelectContent 
                className="bg-white border border-[#171719] text-[#000]"
                style={{ borderRadius: '0px' }}
              >
                <SelectItem value="all" style={{ color: '#000' }}>All Tags</SelectItem>
                {availableTags.map(tag => (
                  <SelectItem key={tag} value={tag} style={{ color: '#000' }}>{tag}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Color Tone Filter */}
            <Select value={colorFilter} onValueChange={setColorFilter}>
              <SelectTrigger 
                className="w-48 bg-white border border-[#171719] hover:border-[#171719] focus:border-[#171719] text-[#000]" 
                style={{ fontFamily: 'Neue Einstellung, sans-serif', fontSize: '14px', borderRadius: '0px', color: '#000' }}
              >
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Color Tone" />
              </SelectTrigger>
              <SelectContent 
                className="bg-white border border-[#171719] text-[#000]"
                style={{ borderRadius: '0px' }}
              >
                <SelectItem value="all" style={{ color: '#000' }}>All Tones</SelectItem>
                <SelectItem value="pastel" style={{ color: '#000' }}>Pastel</SelectItem>
                <SelectItem value="black-white" style={{ color: '#000' }}>Black & White</SelectItem>
                <SelectItem value="moody" style={{ color: '#000' }}>Moody</SelectItem>
                <SelectItem value="bright" style={{ color: '#000' }}>Bright</SelectItem>
                {availableColorTones.map(tone => (
                  <SelectItem key={tone} value={tone} style={{ color: '#000' }}>{tone}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Image Grid */}
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin w-8 h-8 border-2 border-[#171719] border-t-transparent rounded-full"></div>
            </div>
          ) : filteredImages.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filteredImages.map((image) => (
                <div 
                  key={image.id} 
                  className="aspect-square bg-white border border-[#B5B5B3] overflow-hidden hover:border-[#171719] transition-colors cursor-pointer group"
                >
                  <img 
                    src={image.file_url} 
                    alt={image.file_name || 'Vault image'} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p 
                className="text-lg text-[#4C4B4B] mb-4"
                style={{ fontFamily: 'Neue Einstellung, sans-serif' }}
              >
                {vaultImages && vaultImages.length > 0 
                  ? 'No images match your current filters' 
                  : 'No images in your vault yet'
                }
              </p>
              <p 
                className="text-sm text-[#4C4B4B]"
                style={{ fontFamily: 'Neue Einstellung, sans-serif' }}
              >
                Upload images through the Visual Studio Editor to see them here
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
