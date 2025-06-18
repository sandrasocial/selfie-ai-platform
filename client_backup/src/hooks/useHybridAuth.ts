import { useState, useEffect } from 'react';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { useToast } from '@/hooks/use-toast';

export function useHybridAuth() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const { toast } = useToast();
  
  // Supabase auth
  const supabaseAuth = useSupabaseAuth();
  
  // Check for existing Replit auth user via API
  const [replitUser, setReplitUser] = useState<any>(null);
  const [replitLoading, setReplitLoading] = useState(true);

  useEffect(() => {
    checkReplitAuth();
  }, []);

  const checkReplitAuth = async () => {
    try {
      const response = await fetch('/api/me');
      if (response.ok) {
        const userData = await response.json();
        
        // 🧪 DEV SESSION FALLBACK — REMOVE BEFORE LAUNCH
        // In development, enhance session-based auth with dev user data
        if (import.meta.env.MODE === 'development' && userData.id === 1) {
          const devUser = {
            ...userData,
            id: "1",
            email: "test@sandra.dev",
            isDev: true,
            name: "Dev User",
            plan: "VIP"
          };
          setReplitUser(devUser);
        } else {
          setReplitUser(userData);
        }
      }
    } catch (error) {
      // User not authenticated with Replit
    } finally {
      setReplitLoading(false);
    }
  };

  // Determine which auth system to use
  useEffect(() => {
    const loading = supabaseAuth.loading || replitLoading;
    setIsLoading(loading);

    if (!loading) {
      // Prefer Replit auth if available, fallback to Supabase
      if (replitUser) {
        setCurrentUser(replitUser);
      } else if (supabaseAuth.user) {
        setCurrentUser(supabaseAuth.user);
      } else {
        setCurrentUser(null);
      }
    }
  }, [supabaseAuth.user, supabaseAuth.loading, replitUser, replitLoading]);

  const logout = async () => {
    try {
      // Clear both auth systems
      if (replitUser) {
        // Logout from Replit system
        await fetch('/api/logout', { method: 'POST' });
        setReplitUser(null);
      }
      
      if (supabaseAuth.user) {
        // Logout from Supabase
        await supabaseAuth.signOut();
      }

      // Clear all local data
      localStorage.clear();
      sessionStorage.clear();
      
      // Clear cookies
      document.cookie.split(";").forEach(cookie => {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=" + window.location.hostname;
      });

      // Reset current user
      setCurrentUser(null);

      toast({
        title: "Logged Out",
        description: "You have been successfully logged out",
      });

      // Force page reload to ensure clean state
      window.location.href = '/';
    } catch (error: any) {
      console.error('Logout error:', error);
      toast({
        title: "Logout Error",
        description: "There was an issue logging out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    user: currentUser,
    isAuthenticated: !!currentUser,
    isLoading,
    logout,
    // Expose individual auth systems for specific needs
    supabaseAuth,
    replitUser,
    refreshAuth: () => {
      checkReplitAuth();
      // Supabase auth will refresh automatically via its useEffect
    }
  };
}