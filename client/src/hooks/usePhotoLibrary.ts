import { useState, useEffect } from 'react';
import { SupabaseService } from '@/lib/supabaseService';
import { useToast } from '@/hooks/use-toast';

export function usePhotoLibrary(userId: string) {
  const [photos, setPhotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (userId) {
      loadPhotos();
    }
  }, [userId]);

  const loadPhotos = async () => {
    try {
      const data = await SupabaseService.getUserPhotos(userId);
      setPhotos(data || []);
    } catch (error: any) {
      console.error('Error loading photos:', error);
      toast({
        title: "Load Failed",
        description: "Unable to load your photo library",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const savePhoto = async (photoData: {
    uploadcare_uuid: string;
    file_url: string;
    file_name?: string;
    file_size?: number;
    tags?: string[];
  }) => {
    try {
      const savedPhoto = await SupabaseService.savePhotoToLibrary({
        user_id: userId,
        ...photoData
      });

      setPhotos(prev => [savedPhoto, ...prev]);

      toast({
        title: "Photo Saved",
        description: "Photo added to your library",
      });

      return savedPhoto;
    } catch (error: any) {
      console.error('Error saving photo:', error);
      toast({
        title: "Save Failed",
        description: "Unable to save photo to library",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deletePhoto = async (photoId: string) => {
    try {
      await SupabaseService.deletePhoto(userId, photoId);
      setPhotos(prev => prev.filter(p => p.id !== photoId));

      toast({
        title: "Photo Deleted",
        description: "Photo removed from library",
      });
    } catch (error: any) {
      console.error('Error deleting photo:', error);
      toast({
        title: "Delete Failed",
        description: "Unable to delete photo",
        variant: "destructive",
      });
    }
  };

  const updatePhotoTags = async (photoId: string, tags: string[]) => {
    try {
      const updatedPhoto = await SupabaseService.updatePhotoTags(userId, photoId, tags);
      
      setPhotos(prev => prev.map(p => 
        p.id === photoId ? updatedPhoto : p
      ));

      toast({
        title: "Tags Updated",
        description: "Photo tags have been updated",
      });

      return updatedPhoto;
    } catch (error: any) {
      console.error('Error updating tags:', error);
      toast({
        title: "Update Failed",
        description: "Unable to update photo tags",
        variant: "destructive",
      });
    }
  };

  const getPhotosByTags = (tags: string[]) => {
    return photos.filter(photo => 
      photo.tags && tags.some(tag => photo.tags.includes(tag))
    );
  };

  const handleUploadcareSuccess = async (fileInfo: any) => {
    try {
      const photoData = {
        uploadcare_uuid: fileInfo.uuid,
        file_url: fileInfo.cdnUrl,
        file_name: fileInfo.name,
        file_size: fileInfo.size,
        tags: []
      };

      return await savePhoto(photoData);
    } catch (error) {
      console.error('Error handling Uploadcare upload:', error);
      throw error;
    }
  };

  return {
    photos,
    loading,
    savePhoto,
    deletePhoto,
    updatePhotoTags,
    getPhotosByTags,
    handleUploadcareSuccess,
    refreshPhotos: loadPhotos
  };
}