'use client';

import { useState, useEffect } from 'react';

interface UserProfile {
  id: string;
  user_id: string;
  brand_mission?: string | null;
  ideal_audience?: string | null;
  brand_values?: string | null;
  key_phrases?: string | null;
  hashtags?: string | null;
  visual_aesthetic?: string | null;
  content_focus?: string[] | null;
  tone_voice?: string | null;
  industry?: string | null;
  experience_level?: string | null;
  main_goals?: string | null;
  transformation_story?: string | null;
  brand_voice?: string | null;
  aesthetic_tone?: string | null;
  offer?: string | null;
  visibility_goals?: string | null;
  is_complete: boolean;
  created_at: string;
  updated_at: string;
}

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/user-profiles', {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }
      
      const data = await response.json();
      setProfile(data.profile);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData: Partial<UserProfile>) => {
    try {
      const response = await fetch('/api/user-profiles', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
      
      const data = await response.json();
      setProfile(data.profile);
      return data.profile;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    profile,
    loading,
    error,
    hasProfile: !!profile,
    isProfileComplete: profile?.is_complete || false,
    updateProfile,
    refreshProfile: fetchProfile
  };
}

export function useOnboardingStatus() {
  const [status, setStatus] = useState<{
    hasProfile: boolean;
    isComplete: boolean;
    completionPercentage: number;
    profile: UserProfile | null;
  }>({
    hasProfile: false,
    isComplete: false,
    completionPercentage: 0,
    profile: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkStatus() {
      try {
        const response = await fetch('/api/onboarding/brand-hub', {
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          setStatus({
            hasProfile: data.hasProfile,
            isComplete: data.isComplete,
            completionPercentage: data.completionPercentage,
            profile: data.profile
          });
        }
      } catch (error) {
        console.error('Error fetching onboarding status:', error);
      } finally {
        setLoading(false);
      }
    }

    checkStatus();
  }, []);

  return { ...status, loading };
}
