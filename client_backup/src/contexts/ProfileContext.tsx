import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { UserProfile } from '@shared/schema';

interface ProfileContextType {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  hasProfile: boolean;
  updateProfile: (profileData: Partial<UserProfile>) => Promise<UserProfile>;
  refreshProfile: () => Promise<void>;
  suggestions: {
    hashtags: string[];
    toneGuidelines: string[];
    contentTypes: string[];
  } | null;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

interface ProfileProviderProps {
  children: ReactNode;
  userId?: string;
}

export function ProfileProvider({ children, userId }: ProfileProviderProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<ProfileContextType['suggestions']>(null);

  const fetchProfile = async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/user-profiles/${userId}`);
      
      if (response.ok) {
        const profileData = await response.json();
        setProfile(profileData);
        
        // Fetch content suggestions if profile exists
        if (profileData) {
          await fetchSuggestions();
        }
      } else if (response.status === 404) {
        // Profile doesn't exist yet - this is normal for new users
        setProfile(null);
      } else {
        throw new Error('Failed to fetch profile');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSuggestions = async () => {
    if (!userId) return;
    
    try {
      const response = await fetch(`/api/user-profiles/${userId}/suggestions`);
      if (response.ok) {
        const suggestionsData = await response.json();
        setSuggestions(suggestionsData);
      }
    } catch (err) {
      console.error('Error fetching suggestions:', err);
    }
  };

  const updateProfile = async (profileData: Partial<UserProfile>): Promise<UserProfile> => {
    if (!userId) throw new Error('User ID is required');
    
    try {
      setError(null);
      
      const response = await fetch('/api/user-profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, ...profileData }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
      
      const data = await response.json();
      setProfile(data.profile);
      
      // Refresh suggestions after profile update
      await fetchSuggestions();
      
      return data.profile;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    }
  };

  const refreshProfile = async () => {
    await fetchProfile();
  };

  useEffect(() => {
    if (userId) {
      fetchProfile();
    }
  }, [userId]);

  const contextValue: ProfileContextType = {
    profile,
    loading,
    error,
    hasProfile: !!profile,
    updateProfile,
    refreshProfile,
    suggestions
  };

  return (
    <ProfileContext.Provider value={contextValue}>
      {children}
    </ProfileContext.Provider>
  );
}

export const useProfile = (): ProfileContextType => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};

// Utility hook for profile-based personalization
export const usePersonalization = () => {
  const { profile, suggestions } = useProfile();
  
  const getPersonalizedContent = (baseContent: string): string => {
    if (!profile) return baseContent;
    
    // Add brand-specific context to content
    let personalizedContent = baseContent;
    
    if (profile.toneVoice) {
      personalizedContent += ` (Use ${profile.toneVoice.toLowerCase()} tone)`;
    }
    
    if (profile.brandValues) {
      personalizedContent += ` (Align with brand values: ${profile.brandValues})`;
    }
    
    return personalizedContent;
  };

  const getBrandHashtags = (): string[] => {
    return suggestions?.hashtags || [];
  };

  const getToneGuidelines = (): string[] => {
    return suggestions?.toneGuidelines || [];
  };

  const getContentTypes = (): string[] => {
    return suggestions?.contentTypes || [];
  };

  return {
    profile,
    getPersonalizedContent,
    getBrandHashtags,
    getToneGuidelines,
    getContentTypes,
    isPersonalized: !!profile?.isComplete
  };
};