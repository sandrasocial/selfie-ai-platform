
import React, { useState, useRef } from 'react';
import { Link } from "wouter";
import { ArrowLeft, Upload, Calendar, Grid3X3, Filter, X } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

interface FeedImage {
  id: string;
  file_url: string;
  file_name?: string;
  tags?: string[];
  uploaded_at?: string;
  order_index?: number;
}

export default function FeedDesigner() {
  const [viewMode, setViewMode] = useState<'grid' | 'calendar'>('grid');
  const [uploadedImages, setUploadedImages] = useState<FeedImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: user } = useQuery({
    queryKey: ["/api/me"],
    retry: false,
  });

  // Fetch user's uploaded images for feed designer
  const { data: feedImages, isLoading } = useQuery<FeedImage[]>({
    queryKey: ['/api/feed-images', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const response = await fetch(`/api/feed-images?userId=${user.id}`, {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch feed images');
      return response.json();
    },
    enabled: !!user?.id
  });

  // Upload image mutation
  const uploadImageMutation = useMutation({
    mutationFn: async (file: File) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const formData = new FormData();
      formData.append('image', file);
      formData.append('userId', user.id);
      
      const response = await fetch('/api/upload-feed-image', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });
      
      if (!response.ok) throw new Error('Failed to upload image');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/feed-images', user?.id] });
      toast({
        title: "Image uploaded successfully",
        description: "Your image has been added to the feed designer.",
      });
    },
    onError: (error) => {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    uploadImageMutation.mutate(file, {
      onSettled: () => setIsUploading(false)
    });
  };

  // Handle drag and drop reordering
  const handleDragEnd = (result: any) => {
    if (!result.destination || !feedImages) return;

    const items = Array.from(feedImages);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update order indexes
    const updatedItems = items.map((item, index) => ({
      ...item,
      order_index: index
    }));

    // Update state immediately for smooth UX
    queryClient.setQueryData(['/api/feed-images', user?.id], updatedItems);

    // Save new order to backend
    fetch('/api/update-feed-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        userId: user?.id, 
        imageOrder: updatedItems.map(item => ({ id: item.id, order_index: item.order_index }))
      }),
      credentials: 'include'
    }).catch(error => {
      console.error('Failed to save new order:', error);
      // Revert on error
      queryClient.invalidateQueries({ queryKey: ['/api/feed-images', user?.id] });
    });
  };

  // Filter images based on selected filter
  const filteredImages = feedImages?.filter(image => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'recent') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(image.uploaded_at || '') > weekAgo;
    }
    return image.tags?.includes(selectedFilter);
  }) || [];

  // Get unique tags for filter dropdown
  const availableTags = Array.from(
    new Set(feedImages?.flatMap(img => img.tags || []) || [])
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
              href="/studio/feed-designer" 
              className="text-[#171719] font-medium border-b-2 border-[#171719] pb-1"
              style={{ fontFamily: 'Neue Einstellung, sans-serif', fontSize: '14px' }}
            >
              Feed Designer
            </Link>
          </nav>
        </div>
      </section>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 
            className="text-5xl md:text-6xl font-normal mb-8 uppercase tracking-wide text-[#171719]"
            className="font-cormorant"
          >
            Feed Designer
          </h1>
          <div className="w-24 h-px mx-auto mb-8 bg-[#171719]"></div>
          <p 
            className="text-lg mb-12 max-w-2xl mx-auto text-[#4C4B4B]"
            style={{ fontFamily: 'Neue Einstellung, sans-serif', fontWeight: '300' }}
          >
            Plan your Instagram grid with drag-and-drop functionality
          </p>
        </div>
      </section>

      {/* Controls Section */}
      <section className="px-4 pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            {/* Upload Button */}
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button 
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="bg-transparent text-[#171719] border border-[#171719] hover:bg-[#171719] hover:text-white transition-all duration-200 uppercase tracking-wide px-6 py-3"
                style={{ fontFamily: 'Neue Einstellung, sans-serif', fontSize: '14px', borderRadius: '0px' }}
              >
                {isUploading ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2"></div>
                    UPLOADING...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    UPLOAD IMAGE
                  </>
                )}
              </Button>
            </div>

            {/* Filter Controls */}
            <div className="flex items-center gap-4">
              <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                <SelectTrigger 
                  className="w-40 bg-white border border-[#171719] text-[#171719]"
                  style={{ fontFamily: 'Neue Einstellung, sans-serif', fontSize: '14px', borderRadius: '0px' }}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent 
                  className="bg-white border border-[#171719]"
                  style={{ borderRadius: '0px' }}
                >
                  <SelectItem value="all">All Images</SelectItem>
                  <SelectItem value="recent">Recent (7 days)</SelectItem>
                  {availableTags.map(tag => (
                    <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* View Mode Controls */}
          <div className="flex justify-center gap-4 mb-8">
            <Button 
              onClick={() => setViewMode('grid')}
              className={`${
                viewMode === 'grid' 
                  ? 'bg-[#171719] text-white' 
                  : 'bg-transparent text-[#171719]'
              } border border-[#171719] hover:bg-[#171719] hover:text-white transition-all duration-200 uppercase tracking-wide px-8 py-3`}
              style={{ fontFamily: 'Neue Einstellung, sans-serif', fontSize: '14px', borderRadius: '0px' }}
            >
              <Grid3X3 className="w-4 h-4 mr-2" />
              Grid View
            </Button>
            <Button 
              onClick={() => setViewMode('calendar')}
              className={`${
                viewMode === 'calendar' 
                  ? 'bg-[#171719] text-white' 
                  : 'bg-transparent text-[#171719]'
              } border border-[#171719] hover:bg-[#171719] hover:text-white transition-all duration-200 uppercase tracking-wide px-8 py-3`}
              style={{ fontFamily: 'Neue Einstellung, sans-serif', fontSize: '14px', borderRadius: '0px' }}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Calendar View
            </Button>
          </div>
        </div>
      </section>

      {/* Grid Planner */}
      <section className="px-4 pb-20">
        <div className="max-w-4xl mx-auto">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin w-8 h-8 border-2 border-[#171719] border-t-transparent rounded-full"></div>
            </div>
          ) : viewMode === 'grid' ? (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="feed-grid" direction="horizontal">
                {(provided) => (
                  <div 
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="grid grid-cols-3 gap-4 max-w-lg mx-auto mb-16"
                  >
                    {/* Display uploaded images */}
                    {filteredImages.slice(0, 9).map((image, index) => (
                      <Draggable key={image.id} draggableId={image.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`aspect-square bg-white border border-[#B5B5B3] overflow-hidden cursor-pointer hover:border-[#171719] transition-colors ${
                              snapshot.isDragging ? 'shadow-lg' : ''
                            }`}
                          >
                            <img 
                              src={image.file_url} 
                              alt={image.file_name || 'Feed image'} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    
                    {/* Empty slots for remaining positions */}
                    {Array.from({ length: Math.max(0, 9 - filteredImages.length) }, (_, i) => (
                      <div 
                        key={`empty-${i}`} 
                        className="aspect-square bg-white border border-dashed border-[#B5B5B3] flex items-center justify-center cursor-pointer hover:border-[#171719] transition-colors group"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <span 
                          className="text-xs uppercase tracking-wide text-[#4C4B4B] group-hover:text-[#171719] transition-colors text-center"
                          className="font-neue"
                        >
                          Add Content
                        </span>
                      </div>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          ) : (
            /* Calendar View */
            <div className="bg-white border border-[#B5B5B3] p-6">
              <h3 
                className="text-xl font-normal mb-6 text-center text-[#171719]"
                className="font-cormorant"
              >
                Calendar View
              </h3>
              <div className="grid grid-cols-7 gap-4">
                {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
                  <div 
                    key={day}
                    className="text-center text-sm font-medium text-[#4C4B4B] p-2"
                    className="font-neue"
                  >
                    {day}
                  </div>
                ))}
                {filteredImages.slice(0, 21).map((image, index) => (
                  <div key={image.id} className="aspect-square">
                    <img 
                      src={image.file_url} 
                      alt={image.file_name || 'Feed image'} 
                      className="w-full h-full object-cover border border-[#B5B5B3]"
                    />
                  </div>
                ))}
                {Array.from({ length: Math.max(0, 21 - filteredImages.length) }, (_, i) => (
                  <div 
                    key={`cal-empty-${i}`}
                    className="aspect-square border border-dashed border-[#B5B5B3] flex items-center justify-center cursor-pointer hover:border-[#171719] transition-colors group"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <span 
                      className="text-xs text-[#4C4B4B] group-hover:text-[#171719] transition-colors"
                      className="font-neue"
                    >
                      +
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {filteredImages.length === 0 && !isLoading && (
            <div className="text-center py-20">
              <p 
                className="text-lg text-[#4C4B4B] mb-4"
                className="font-neue"
              >
                No images uploaded yet
              </p>
              <Button 
                onClick={() => fileInputRef.current?.click()}
                className="bg-transparent text-[#171719] border border-[#171719] hover:bg-[#171719] hover:text-white transition-all duration-200 uppercase tracking-wide px-8 py-3"
                style={{ fontFamily: 'Neue Einstellung, sans-serif', fontSize: '14px', borderRadius: '0px' }}
              >
                <Upload className="w-4 h-4 mr-2" />
                UPLOAD YOUR FIRST IMAGE
              </Button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
