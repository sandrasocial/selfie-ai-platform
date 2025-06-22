import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Tag, Calendar, Filter, Edit3, Trash2, Save, X } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface BrandNote {
  id: string;
  title: string;
  content: string;
  tags: string[];
  category: string;
  created_at: string;
  updated_at: string;
  color?: string;
}

interface AutoTag {
  tag: string;
  confidence: number;
  category: string;
}

export default function BrandNotes() {
  const [isCreating, setIsCreating] = useState(false);
  const [editingNote, setEditingNote] = useState<BrandNote | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [tagFilter, setTagFilter] = useState("all");
  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
    category: "general",
    tags: [] as string[],
    color: "#F8F9FA"
  });
  const [autoSuggestedTags, setAutoSuggestedTags] = useState<AutoTag[]>([]);

  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ["/api/me"],
    retry: false,
  });

  // Fetch brand notes
  const { data: brandNotes = [], isLoading } = useQuery<BrandNote[]>({
    queryKey: ['/api/brand-notes', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const response = await fetch('/api/brand-notes', {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch brand notes');
      return response.json();
    },
    enabled: !!user?.id
  });

  // Auto-tag generation
  const generateAutoTags = async (content: string): Promise<AutoTag[]> => {
    if (!content || content.length < 10) return [];
    
    try {
      const response = await fetch('/api/auto-tag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ content, type: 'brand-note' })
      });
      
      if (!response.ok) throw new Error('Failed to generate auto tags');
      const result = await response.json();
      return result.tags || [];
    } catch (error) {
      console.error('Auto-tag generation failed:', error);
      return [];
    }
  };

  // Create note mutation
  const createNoteMutation = useMutation({
    mutationFn: async (noteData: Omit<BrandNote, 'id' | 'created_at' | 'updated_at'>) => {
      const response = await fetch('/api/brand-notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(noteData)
      });
      if (!response.ok) throw new Error('Failed to create note');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/brand-notes'] });
      setIsCreating(false);
      setNewNote({ title: "", content: "", category: "general", tags: [], color: "#F8F9FA" });
      setAutoSuggestedTags([]);
    }
  });

  // Update note mutation
  const updateNoteMutation = useMutation({
    mutationFn: async (noteData: BrandNote) => {
      const response = await fetch(`/api/brand-notes/${noteData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(noteData)
      });
      if (!response.ok) throw new Error('Failed to update note');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/brand-notes'] });
      setEditingNote(null);
    }
  });

  // Delete note mutation
  const deleteNoteMutation = useMutation({
    mutationFn: async (noteId: string) => {
      const response = await fetch(`/api/brand-notes/${noteId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to delete note');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/brand-notes'] });
    }
  });

  // Auto-tag content when typing
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (newNote.content.length > 10) {
        const suggestedTags = await generateAutoTags(newNote.content);
        setAutoSuggestedTags(suggestedTags);
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [newNote.content]);

  // Filter notes
  const filteredNotes = brandNotes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = categoryFilter === 'all' || note.category === categoryFilter;
    const matchesTag = tagFilter === 'all' || note.tags.includes(tagFilter);
    
    return matchesSearch && matchesCategory && matchesTag;
  });

  // Get available tags and categories
  const availableTags = Array.from(new Set(brandNotes.flatMap(note => note.tags)));
  const availableCategories = Array.from(new Set(brandNotes.map(note => note.category)));

  const handleCreateNote = () => {
    if (!newNote.title.trim() || !newNote.content.trim()) return;
    
    createNoteMutation.mutate({
      title: newNote.title,
      content: newNote.content,
      category: newNote.category,
      tags: newNote.tags,
      color: newNote.color
    });
  };

  const handleUpdateNote = () => {
    if (!editingNote) return;
    updateNoteMutation.mutate(editingNote);
  };

  const addTag = (tag: string, isNewNote = true) => {
    if (isNewNote) {
      if (!newNote.tags.includes(tag)) {
        setNewNote(prev => ({ ...prev, tags: [...prev.tags, tag] }));
      }
    } else if (editingNote && !editingNote.tags.includes(tag)) {
      setEditingNote(prev => prev ? { ...prev, tags: [...prev.tags, tag] } : null);
    }
  };

  const removeTag = (tagToRemove: string, isNewNote = true) => {
    if (isNewNote) {
      setNewNote(prev => ({ ...prev, tags: prev.tags.filter(tag => tag !== tagToRemove) }));
    } else if (editingNote) {
      setEditingNote(prev => prev ? { ...prev, tags: prev.tags.filter(tag => tag !== tagToRemove) } : null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F1F1F1]">
      <Header user={user} />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 
            className="text-4xl md:text-5xl lg:text-6xl font-light mb-6 text-[#171719]"
            className="font-neue"
          >
            Brand Notes
          </h1>
          <p 
            className="text-lg text-[#4C4B4B] mb-8 max-w-2xl mx-auto"
            className="font-neue"
          >
            Capture your brand insights with intelligent auto-tagging. 
            Organize thoughts, strategies, and creative sparks in one centralized space.
          </p>
        </div>
      </section>

      {/* Controls & Notes */}
      <section className="px-4 pb-20">
        <div className="max-w-6xl mx-auto">
          
          {/* Action Bar */}
          <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
            <div className="flex flex-wrap gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#4C4B4B]" />
                <Input
                  placeholder="Search notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64 border-[#171719] focus:border-[#171719]"
                  style={{ fontFamily: 'Neue Einstellung, sans-serif', borderRadius: '0px' }}
                />
              </div>

              {/* Category Filter */}
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger 
                  className="w-48 border-[#171719] focus:border-[#171719]"
                  style={{ fontFamily: 'Neue Einstellung, sans-serif', borderRadius: '0px' }}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent style={{ borderRadius: '0px' }}>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="strategy">Strategy</SelectItem>
                  <SelectItem value="content">Content Ideas</SelectItem>
                  <SelectItem value="inspiration">Inspiration</SelectItem>
                  <SelectItem value="goals">Goals</SelectItem>
                  {availableCategories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Tag Filter */}
              <Select value={tagFilter} onValueChange={setTagFilter}>
                <SelectTrigger 
                  className="w-48 border-[#171719] focus:border-[#171719]"
                  style={{ fontFamily: 'Neue Einstellung, sans-serif', borderRadius: '0px' }}
                >
                  <Tag className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Tags" />
                </SelectTrigger>
                <SelectContent style={{ borderRadius: '0px' }}>
                  <SelectItem value="all">All Tags</SelectItem>
                  {availableTags.map(tag => (
                    <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={() => setIsCreating(true)}
              className="bg-[#171719] text-white hover:bg-[#2a2a2c]"
              style={{ fontFamily: 'Neue Einstellung, sans-serif', borderRadius: '0px' }}
            >
              <Plus className="w-4 h-4 mr-2" />
              New Note
            </Button>
          </div>

          {/* Create Note Form */}
          {isCreating && (
            <div className="bg-white border border-[#171719] p-6 mb-8" style={{ borderRadius: '0px' }}>
              <div className="space-y-4">
                <Input
                  placeholder="Note title..."
                  value={newNote.title}
                  onChange={(e) => setNewNote(prev => ({ ...prev, title: e.target.value }))}
                  className="border-[#B5B5B3] focus:border-[#171719]"
                  style={{ fontFamily: 'Neue Einstellung, sans-serif', borderRadius: '0px' }}
                />
                
                <Textarea
                  placeholder="Write your brand note here..."
                  value={newNote.content}
                  onChange={(e) => setNewNote(prev => ({ ...prev, content: e.target.value }))}
                  rows={6}
                  className="border-[#B5B5B3] focus:border-[#171719] resize-none"
                  style={{ fontFamily: 'Neue Einstellung, sans-serif', borderRadius: '0px' }}
                />

                <div className="flex flex-wrap gap-4">
                  <Select 
                    value={newNote.category} 
                    onValueChange={(value) => setNewNote(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger 
                      className="w-48 border-[#B5B5B3] focus:border-[#171719]"
                      style={{ borderRadius: '0px' }}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent style={{ borderRadius: '0px' }}>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="strategy">Strategy</SelectItem>
                      <SelectItem value="content">Content Ideas</SelectItem>
                      <SelectItem value="inspiration">Inspiration</SelectItem>
                      <SelectItem value="goals">Goals</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Auto-suggested Tags */}
                {autoSuggestedTags.length > 0 && (
                  <div>
                    <p className="text-sm text-[#4C4B4B] mb-2" className="font-neue">
                      Suggested tags:
                    </p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {autoSuggestedTags.map((autoTag, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="cursor-pointer hover:bg-[#171719] hover:text-white"
                          onClick={() => addTag(autoTag.tag)}
                        >
                          {autoTag.tag} ({Math.round(autoTag.confidence * 100)}%)
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Selected Tags */}
                {newNote.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {newNote.tags.map((tag, index) => (
                      <Badge key={index} className="bg-[#171719] text-white">
                        {tag}
                        <X 
                          className="w-3 h-3 ml-1 cursor-pointer" 
                          onClick={() => removeTag(tag)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="flex gap-3">
                  <Button
                    onClick={handleCreateNote}
                    disabled={createNoteMutation.isPending || !newNote.title.trim() || !newNote.content.trim()}
                    className="bg-[#171719] text-white hover:bg-[#2a2a2c]"
                    style={{ borderRadius: '0px' }}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {createNoteMutation.isPending ? 'Saving...' : 'Save Note'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsCreating(false);
                      setNewNote({ title: "", content: "", category: "general", tags: [], color: "#F8F9FA" });
                      setAutoSuggestedTags([]);
                    }}
                    className="border-[#171719] text-[#171719] hover:bg-[#F1F1F1]"
                    style={{ borderRadius: '0px' }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Notes Grid */}
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin w-8 h-8 border-2 border-[#171719] border-t-transparent rounded-full"></div>
            </div>
          ) : filteredNotes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNotes.map((note) => (
                <div 
                  key={note.id} 
                  className="bg-white border border-[#B5B5B3] overflow-hidden hover:border-[#171719] transition-colors group"
                  style={{ backgroundColor: note.color || '#FFFFFF', borderRadius: '0px' }}
                >
                  {editingNote?.id === note.id ? (
                    // Edit Mode
                    <div className="p-6 space-y-4">
                      <Input
                        value={editingNote.title}
                        onChange={(e) => setEditingNote(prev => prev ? { ...prev, title: e.target.value } : null)}
                        className="border-[#B5B5B3] focus:border-[#171719]"
                        style={{ borderRadius: '0px' }}
                      />
                      <Textarea
                        value={editingNote.content}
                        onChange={(e) => setEditingNote(prev => prev ? { ...prev, content: e.target.value } : null)}
                        rows={4}
                        className="border-[#B5B5B3] focus:border-[#171719] resize-none"
                        style={{ borderRadius: '0px' }}
                      />
                      
                      {editingNote.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {editingNote.tags.map((tag, index) => (
                            <Badge key={index} className="bg-[#171719] text-white">
                              {tag}
                              <X 
                                className="w-3 h-3 ml-1 cursor-pointer" 
                                onClick={() => removeTag(tag, false)}
                              />
                            </Badge>
                          ))}
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={handleUpdateNote}
                          disabled={updateNoteMutation.isPending}
                          className="bg-[#171719] text-white hover:bg-[#2a2a2c]"
                          style={{ borderRadius: '0px' }}
                        >
                          <Save className="w-3 h-3 mr-1" />
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingNote(null)}
                          className="border-[#171719] text-[#171719]"
                          style={{ borderRadius: '0px' }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <h3 
                          className="text-lg font-medium text-[#171719] line-clamp-2"
                          className="font-neue"
                        >
                          {note.title}
                        </h3>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setEditingNote(note)}
                            className="p-1 h-8 w-8"
                          >
                            <Edit3 className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteNoteMutation.mutate(note.id)}
                            className="p-1 h-8 w-8 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      
                      <p 
                        className="text-[#4C4B4B] text-sm mb-4 line-clamp-4"
                        className="font-neue"
                      >
                        {note.content}
                      </p>
                      
                      {note.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {note.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center text-xs text-[#4C4B4B]">
                        <span className="capitalize">{note.category}</span>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(note.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p 
                className="text-lg text-[#4C4B4B] mb-4"
                className="font-neue"
              >
                {searchQuery || categoryFilter !== 'all' || tagFilter !== 'all' 
                  ? 'No notes match your current filters' 
                  : 'No brand notes yet'
                }
              </p>
              <p 
                className="text-sm text-[#4C4B4B]"
                className="font-neue"
              >
                Start capturing your brand insights and watch the auto-tagging magic happen
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}