import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key';

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn('⚠️ Supabase environment variables not configured. Authentication features will be disabled.');
}

console.log('🔧 Creating Supabase client instance');

// Create the Supabase client with optimal configuration for magic link authentication
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    storage: window?.localStorage,
    storageKey: 'supabase.auth.token',
    debug: false
  }
});

// Helper function to check if user is admin
export const isUserAdmin = (email?: string | null) => {
  return email === 'ssa@ssasocial.com';
};

// Helper function to get current user session
export const getCurrentSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Session error:', error);
      return null;
    }
    return session;
  } catch (error) {
    console.error('Failed to get session:', error);
    return null;
  }
};

// Helper function to get current user
export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
      console.error('User error:', error);
      return null;
    }
    return user;
  } catch (error) {
    console.error('Failed to get user:', error);
    return null;
  }
};

// Function to clear auth state
export const clearAuthState = async () => {
  try {
    console.log('🧹 Clearing auth state...');
    await supabase.auth.signOut();
    
    // Clear any cached session data
    localStorage.removeItem('supabase.auth.token');
    sessionStorage.clear();
    
    console.log('✅ Auth state cleared');
  } catch (error) {
    console.error('Error clearing auth state:', error);
  }
};