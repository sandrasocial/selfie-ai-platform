
import { useQuery } from '@tanstack/react-query';

interface SessionReadyResponse {
  ready: boolean;
  error?: string;
}

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';

interface SessionReadyResponse {
  ready: boolean;
  error?: string;
}

export function useSessionReady() {
  const { data, isLoading, error } = useQuery<SessionReadyResponse>({
    queryKey: ['/api/session/ready'],
    queryFn: async () => {
      // Get current session token
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        return { ready: false, error: 'No session token' };
      }

      const response = await fetch('/api/session/ready', {
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });
      
      if (!response.ok) {
        // If 401, session is not ready but this is expected
        if (response.status === 401) {
          return { ready: false };
        }
        throw new Error(`Session check failed: ${response.status}`);
      }
      
      return response.json();
    },
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 30000, // Consider session ready status fresh for 30 seconds
  });

  return {
    isReady: data?.ready ?? false,
    isLoading,
    error
  };
}
