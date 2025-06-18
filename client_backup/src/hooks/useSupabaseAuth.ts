import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '@/lib/supabaseClient';
import type { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signOut: async () => {}
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useSupabaseAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionReady, setSessionReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    // Get initial session with retry mechanism for URL-based sessions
    const getInitialSession = async (retryCount = 0) => {
      try {
        console.log('🔄 Getting initial Supabase session...', retryCount > 0 ? `(retry ${retryCount})` : '');
        
        // Check if we're in a callback URL with potential auth fragments
        const hasAuthParams = window.location.hash.includes('access_token') || 
                             window.location.search.includes('access_token');
        
        if (hasAuthParams && retryCount === 0) {
          console.log('🔑 Auth parameters detected in URL, waiting for processing...');
          // Give time for URL processing if this is a callback
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!isMounted) return;
        
        if (error) {
          console.error('❌ Error getting session:', error);
          setLoading(false);
          setSessionReady(true);
          return;
        }

        console.log('🔄 Initial session check:', session ? 'Session found' : 'No session');
        
        // If no session but we have auth params, retry once
        if (!session && hasAuthParams && retryCount < 2) {
          console.log('🔄 No session found but auth params present, retrying...');
          setTimeout(() => getInitialSession(retryCount + 1), 500);
          return;
        }
        
        setSession(session);
        setUser(session?.user || null);
        setLoading(false);
        setSessionReady(true);
        
        if (session?.user) {
          console.log('✅ Session restored for user:', session.user.email);
        } else {
          console.log('ℹ️ No active session found');
        }
      } catch (error) {
        console.error('❌ Failed to get initial session:', error);
        if (isMounted) {
          setLoading(false);
          setSessionReady(true);
        }
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return;
        
        console.log('🔄 Auth state changed:', event, session?.user?.email || 'no user');
        
        // Always update state regardless of event type
        setSession(session);
        setUser(session?.user || null);
        
        // Set loading to false once we receive any auth event
        if (event === 'INITIAL_SESSION') {
          console.log('🔄 Initial session event:', session ? 'Session exists' : 'No session');
          setLoading(false);
          setSessionReady(true);
        } else if (event === 'SIGNED_IN' && session?.user) {
          console.log('✅ User signed in:', session.user.email);
          setLoading(false);
          setSessionReady(true);
        } else if (event === 'SIGNED_OUT') {
          console.log('👋 User signed out');
          setSession(null);
          setUser(null);
          setLoading(false);
          setSessionReady(true);
        }
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      console.log('🚪 Starting complete logout process...');
      
      // 1. Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Supabase signout error:', error);
      }
      
      // 2. Clear backend session
      try {
        await fetch('/api/auth/logout', { 
          method: 'POST',
          credentials: 'include' 
        });
      } catch (backendError) {
        console.log('Backend logout completed');
      }
      
      // 3. Clear all local storage and session storage
      localStorage.clear();
      sessionStorage.clear();
      
      // 4. Clear any cookies by setting them to expire
      document.cookie.split(";").forEach(function(c) { 
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
      });
      
      // 5. Clear React state
      setSession(null);
      setUser(null);
      setLoading(false);
      setSessionReady(true);
      
      console.log('✅ Complete logout successful');
      
      // 6. Force reload to ensure clean state
      setTimeout(() => {
        window.location.href = '/login';
      }, 100);
      
    } catch (error) {
      console.error('Logout process error:', error);
      // Force clean state even if errors occur
      setSession(null);
      setUser(null);
      window.location.href = '/login';
    }
  };

  return {
    user,
    session,
    loading,
    sessionReady,
    signOut
  };
};

export { AuthContext };