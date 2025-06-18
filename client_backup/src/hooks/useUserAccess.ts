import { useQuery } from '@tanstack/react-query';

export interface UserAccessInfo {
  hasActiveSubscription: boolean;
  subscriptionTier: string | null;
  hasActiveTrial: boolean;
  trialType: 'starter' | 'branded' | null;
  trialDaysLeft: number;
  trialEndDate: Date | null;
  
  // Feature access flags - Updated for free users
  canAccessAI: boolean;
  canAccessAIEditor: boolean; // Free users get AI editor access
  canAccessFullStudio: boolean; // Full studio requires starter or above
  canAccessFreeGuide: boolean; // Free users get free guide access
  canAccessWorkbooks: boolean;
  canAccessAdvancedFeatures: boolean;
  canAccessCourses: boolean;
  
  // Tier access flags
  hasStarterAccess: boolean;
  hasBrandedAccess: boolean;
  hasVipAccess: boolean;
  
  // Purchase history
  ownedProducts: string[];
  purchaseDates: {
    starterKit: string | null;
    brandedCourse: string | null;
  };
}

export interface UserWithProfile {
  id: number;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  plan: string;
  brandProfile: any;
  brandProfileComplete: boolean;
  accessLevels: UserAccessInfo;
  hasActiveSubscription: boolean;
}

export function useUserAccess() {
  const { data: user, ...queryResult } = useQuery({
    queryKey: ['/api/me-with-profile'],
    queryFn: async (): Promise<UserWithProfile> => {
      const response = await fetch('/api/me-with-profile', {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch user data');
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2
  });

  return {
    user,
    accessLevels: user?.accessLevels,
    brandProfile: user?.brandProfile,
    isProfileComplete: user?.brandProfileComplete || false,
    hasActiveSubscription: user?.hasActiveSubscription || false,
    
    // Convenience flags
    canAccessAI: user?.accessLevels?.canAccessAI || false,
    canAccessWorkbooks: user?.accessLevels?.canAccessWorkbooks || false,
    canAccessAdvancedFeatures: user?.accessLevels?.canAccessAdvancedFeatures || false,
    canAccessCourses: user?.accessLevels?.canAccessCourses || false,
    
    // Trial information
    hasActiveTrial: user?.accessLevels?.hasActiveTrial || false,
    trialType: user?.accessLevels?.trialType,
    trialDaysLeft: user?.accessLevels?.trialDaysLeft || 0,
    
    // Query state
    ...queryResult
  };
}

export function useOnboardingStatus() {
  return useQuery({
    queryKey: ['/api/onboarding/brand-hub'],
    queryFn: async () => {
      const response = await fetch('/api/onboarding/brand-hub', {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch onboarding status');
      return response.json();
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}