import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { useSessionReady } from "@/hooks/useSessionReady";
import { useHybridAuth } from '@/hooks/useHybridAuth';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const { user: supabaseUser, loading: authLoading, sessionReady } = useSupabaseAuth();
  const { isReady } = useSessionReady();
  
  // 🧪 DEV SESSION FALLBACK — REMOVE BEFORE LAUNCH
  // Use hybrid auth to check for session-based authentication in development
  const { user: hybridUser, isAuthenticated: hybridAuth, isLoading: hybridLoading } = useHybridAuth();

  // Only query backend when session is ready AND we have a user
  const { data: backendUser, isLoading: backendLoading } = useQuery({
    queryKey: ['/api/auth/user'],
    retry: false,
    enabled: isReady && sessionReady && !!supabaseUser?.id, // Critical: Wait for sessionReady AND user
  });

  // 🧪 DEV SESSION FALLBACK — REMOVE BEFORE LAUNCH
  // In development, prioritize session-based auth for userId "1"
  const isDevelopmentAuth = import.meta.env.MODE === 'development' && hybridUser?.id === "1" && hybridUser?.isDev;
  
  const isLoading = isDevelopmentAuth ? hybridLoading : (authLoading || !sessionReady || (!!supabaseUser && backendLoading));
  const isAuthenticated = isDevelopmentAuth ? hybridAuth : (!!supabaseUser && sessionReady);

  useEffect(() => {
    // 🧪 DEV SESSION FALLBACK — REMOVE BEFORE LAUNCH
    // Skip redirect logic in development if session-based auth is active
    if (isDevelopmentAuth && isAuthenticated) {
      return;
    }

    // Only redirect if session is ready and user is not authenticated
    if (sessionReady && !isAuthenticated && !authLoading && !hybridLoading) {
      const currentPath = window.location.pathname;
      localStorage.setItem('redirectAfterLogin', currentPath);

      console.log('🔒 Protected route accessed without authentication:', currentPath);

      toast({
        title: "Authentication Required",
        description: "Please log in to access this feature",
        variant: "destructive",
      });

      setTimeout(() => {
        setLocation('/supabase-auth');
      }, 500);
    }
  }, [sessionReady, isAuthenticated, authLoading, hybridLoading, isDevelopmentAuth, setLocation, toast]);

  // Show loading while session is being checked or auth is loading
  if (!sessionReady || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-red-600" />
          <p className="font-['Inter'] text-gray-600">
            Checking authentication...
          </p>
        </div>
      </div>
    );
  }

  // Show loading while backend verification is happening
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-red-600" />
          <p className="font-['Inter'] text-gray-600">
            Verifying session...
          </p>
        </div>
      </div>
    );
  }

  // If not authenticated, show loading state while redirecting
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-red-600" />
          <p className="font-['Inter'] text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // User is authenticated, render the protected content
  return <>{children}</>;
}