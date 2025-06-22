'use client';

import { useState, useEffect, useRef } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  Upload,
  Camera, 
  Edit3,
  Download,
  Trash2,
  Star,
  Filter,
  Grid,
  List,
  Search,
  Tag,
  Calendar,
  Eye,
  Share2,
  Sparkles,
  Palette,
  Zap,
  Heart,
  BookOpen
} from 'lucide-react';
import Image from 'next/image';

interface PhotoEntry {
  id: string;
  filename: string;
  url: string;
  thumbnail_url?: string;
  tags: string[];
  category: string;
  mood: string;
  lighting: string;
  style: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  rating?: number;
  is_favorite: boolean;
}

interface PhotoStats {
  total: number;
  categories: Record<string, number>;
  moods: Record<string, number>;
  recent: number;
}

export default function PhotoVault() {
  const [photos, setPhotos] = useState<PhotoEntry[]>([]);
  const [stats, setStats] = useState<PhotoStats>({ total: 0, categories: {}, moods: {}, recent: 0 });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState('vault');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMood, setSelectedMood] = useState('all');
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoEntry | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const supabase = createClientComponentClient();

  const categories = [
    'Selfie', 'Portrait', 'Lifestyle', 'Product', 'Behind-the-Scenes', 
    'Flat Lay', 'Mirror Shot', 'Outfit', 'Workspace', 'Travel', 'Food', 'Other'
  ];

  const moods = [
    'Professional', 'Casual', 'Glamorous', 'Cozy', 'Confident', 'Playful', 
    'Elegant', 'Edgy', 'Soft', 'Bold', 'Minimalist', 'Vibrant'
  ];

  const lightingOptions = [
    'Natural', 'Golden Hour', 'Studio', 'Ring Light', 'Window Light', 
    'Overhead', 'Side Light', 'Backlit', 'Soft Box', 'Harsh', 'Moody'
  ];

  const styleOptions = [
    'Clean', 'Vintage', 'Modern', 'Boho', 'Minimalist', 'Dramatic', 
    'Bright', 'Dark & Moody', 'Film', 'High Contrast', 'Pastel', 'Monochrome'
  ];

  useEffect(() => {
    loadPhotos();
    loadStats();
  }, []);

  const loadPhotos = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to access your photo vault.",
          variant: "destructive"
        });
        return;
      }

      const { data, error } = await supabase
        .from('photo_vault')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPhotos(data || []);
    } catch (error) {
      console.error('Error loading photos:', error);
      toast({
        title: "Failed to Load Photos",
        description: "There was an error loading your photo vault.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('photo_vault')
        .select('category, mood, created_at')
        .eq('user_id', user.id);

      if (error) throw error;

      const categories: Record<string, number> = {};
      const moods: Record<string, number> = {};
      let recent = 0;

      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      data?.forEach(photo => {
        categories[photo.category] = (categories[photo.category] || 0) + 1;
        moods[photo.mood] = (moods[photo.mood] || 0) + 1;
        
        if (new Date(photo.created_at) > oneWeekAgo) {
          recent++;
        }
      });

      setStats({
        total: data?.length || 0,
        categories,
        moods,
        recent
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      for (const file of Array.from(files)) {
        // Upload file to Supabase Storage
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('photo-vault')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('photo-vault')
          .getPublicUrl(fileName);

        // Save photo metadata to database
        const { error: dbError } = await supabase
          .from('photo_vault')
          .insert({
            user_id: user.id,
            filename: file.name,
            url: publicUrl,
            tags: [],
            category: 'Other',
            mood: 'Casual',
            lighting: 'Natural',
            style: 'Clean',
            is_favorite: false
          });

        if (dbError) throw dbError;
      }

      toast({
        title: "Photos Uploaded",
        description: `Successfully uploaded ${files.length} photo(s) to your vault.`
      });

      // Reload photos and stats
      await loadPhotos();
      await loadStats();
      
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your photos.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const updatePhoto = async (id: string, updates: Partial<PhotoEntry>) => {
    try {
      const { error } = await supabase
        .from('photo_vault')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      setPhotos(prev => prev.map(photo => 
        photo.id === id ? { ...photo, ...updates } : photo
      ));

      toast({
        title: "Photo Updated",
        description: "Your photo has been updated successfully."
      });
    } catch (error) {
      console.error('Update error:', error);
      toast({
        title: "Update Failed",
        description: "There was an error updating your photo.",
        variant: "destructive"
      });
    }
  };

  const deletePhoto = async (id: string) => {
    try {
      const { error } = await supabase
        .from('photo_vault')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setPhotos(prev => prev.filter(photo => photo.id !== id));
      await loadStats();

      toast({
        title: "Photo Deleted",
        description: "Photo removed from your vault."
      });
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "Delete Failed",
        description: "There was an error deleting your photo.",
        variant: "destructive"
      });
    }
  };

  const filteredPhotos = photos.filter(photo => {
    const matchesSearch = photo.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         photo.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (photo.notes?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    
    const matchesCategory = selectedCategory === 'all' || photo.category === selectedCategory;
    const matchesMood = selectedMood === 'all' || photo.mood === selectedMood;
    
    return matchesSearch && matchesCategory && matchesMood;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-100 flex items-center justify-center">
        <div className="animate-pulse text-rose-600">Loading your photo vault...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-100">
      {/* Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Camera className="h-8 w-8 text-rose-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Photo Vault</h1>
                <p className="text-sm text-gray-600">Your personal photo collection</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600"
              >
                <Upload className="h-4 w-4 mr-2" />
                {uploading ? 'Uploading...' : 'Upload Photos'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileUpload}
        className="hidden"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="vault">Photo Vault</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="presets">Style Presets</TabsTrigger>
          </TabsList>

          <TabsContent value="vault" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Photos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-rose-600">{stats.total}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">This Week</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{stats.recent}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">{Object.keys(stats.categories).length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Favorites</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-pink-600">{photos.filter(p => p.is_favorite).length}</div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filter & Search
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search photos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={selectedMood} onValueChange={setSelectedMood}>
                    <SelectTrigger>
                      <SelectValue placeholder="Mood" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Moods</SelectItem>
                      {moods.map(mood => (
                        <SelectItem key={mood} value={mood}>{mood}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex gap-2">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Photos Grid/List */}
            {filteredPhotos.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No photos found</h3>
                  <p className="text-gray-600 mb-4">
                    {photos.length === 0 
                      ? "Upload your first photo to get started" 
                      : "Try adjusting your filters or search terms."
                    }
                  </p>
                  {photos.length === 0 && (
                    <Button onClick={() => fileInputRef.current?.click()}>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Photos
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className={
                viewMode === 'grid' 
                  ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
                  : "space-y-4"
              }>
                {filteredPhotos.map((photo) => (
                  <Card key={photo.id} className="group overflow-hidden hover:shadow-lg transition-all duration-200">
                    {viewMode === 'grid' ? (
                      <>
                        <div className="aspect-square relative overflow-hidden">
                          <Image
                            src={photo.thumbnail_url || photo.url}
                            alt={photo.filename}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <div className="flex gap-2">
                              <Button size="sm" variant="secondary" onClick={() => setSelectedPhoto(photo)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="secondary"
                                onClick={() => updatePhoto(photo.id, { is_favorite: !photo.is_favorite })}
                              >
                                <Heart className={`h-4 w-4 ${photo.is_favorite ? 'fill-red-500 text-red-500' : ''}`} />
                              </Button>
                            </div>
                          </div>
                        </div>
                        <CardContent className="p-3">
                          <p className="font-medium text-sm truncate">{photo.filename}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">{photo.category}</Badge>
                            <Badge variant="outline" className="text-xs">{photo.mood}</Badge>
                          </div>
                        </CardContent>
                      </>
                    ) : (
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 relative rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={photo.thumbnail_url || photo.url}
                              alt={photo.filename}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium truncate">{photo.filename}</h3>
                            <div className="flex flex-wrap gap-1 mt-1">
                              <Badge variant="outline" className="text-xs">{photo.category}</Badge>
                              <Badge variant="outline" className="text-xs">{photo.mood}</Badge>
                              <Badge variant="outline" className="text-xs">{photo.lighting}</Badge>
                              <Badge variant="outline" className="text-xs">{photo.style}</Badge>
                            </div>
                            {photo.notes && (
                              <p className="text-sm text-gray-600 mt-1 truncate">{photo.notes}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline" onClick={() => setSelectedPhoto(photo)}>
                              <Edit3 className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => updatePhoto(photo.id, { is_favorite: !photo.is_favorite })}
                            >
                              <Heart className={`h-4 w-4 ${photo.is_favorite ? 'fill-red-500 text-red-500' : ''}`} />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => deletePhoto(photo.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Category Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Object.entries(stats.categories).map(([category, count]) => (
                      <div key={category} className="flex items-center justify-between">
                        <span className="text-sm">{category}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-rose-500 h-2 rounded-full" 
                              style={{ width: `${(count / stats.total) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium w-8 text-right">{count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Mood Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Object.entries(stats.moods).map(([mood, count]) => (
                      <div key={mood} className="flex items-center justify-between">
                        <span className="text-sm">{mood}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-purple-500 h-2 rounded-full" 
                              style={{ width: `${(count / stats.total) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium w-8 text-right">{count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="presets" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Style Presets
                </CardTitle>
                <CardDescription>
                  Coming soon: AI-powered style presets based on your photo collection
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Sparkles className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Style Presets Coming Soon</h3>
                  <p className="text-gray-600">
                    We're analyzing your photo collection to create personalized style recommendations.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Photo Detail Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Edit Photo</CardTitle>
                <Button variant="outline" onClick={() => setSelectedPhoto(null)}>
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="aspect-square relative rounded-lg overflow-hidden">
                    <Image
                      src={selectedPhoto.url}
                      alt={selectedPhoto.filename}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Category</label>
                    <Select 
                      value={selectedPhoto.category} 
                      onValueChange={(value) => updatePhoto(selectedPhoto.id, { category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Mood</label>
                    <Select 
                      value={selectedPhoto.mood} 
                      onValueChange={(value) => updatePhoto(selectedPhoto.id, { mood: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {moods.map(mood => (
                          <SelectItem key={mood} value={mood}>{mood}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Lighting</label>
                    <Select 
                      value={selectedPhoto.lighting} 
                      onValueChange={(value) => updatePhoto(selectedPhoto.id, { lighting: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {lightingOptions.map(lighting => (
                          <SelectItem key={lighting} value={lighting}>{lighting}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Style</label>
                    <Select 
                      value={selectedPhoto.style} 
                      onValueChange={(value) => updatePhoto(selectedPhoto.id, { style: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {styleOptions.map(style => (
                          <SelectItem key={style} value={style}>{style}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Notes</label>
                    <Textarea
                      value={selectedPhoto.notes || ''}
                      onChange={(e) => updatePhoto(selectedPhoto.id, { notes: e.target.value })}
                      placeholder="Add notes about this photo..."
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => updatePhoto(selectedPhoto.id, { is_favorite: !selectedPhoto.is_favorite })}
                      className="flex-1"
                    >
                      <Heart className={`h-4 w-4 mr-2 ${selectedPhoto.is_favorite ? 'fill-red-500 text-red-500' : ''}`} />
                      {selectedPhoto.is_favorite ? 'Remove from Favorites' : 'Add to Favorites'}
                    </Button>
                    <Button variant="destructive" onClick={() => {
                      deletePhoto(selectedPhoto.id);
                      setSelectedPhoto(null);
                    }}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
