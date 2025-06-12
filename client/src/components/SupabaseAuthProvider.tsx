import React, { createContext, useContext } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

interface AuthContextType {
  user: any;
  isAuthenticated: boolean;
  isLoading: boolean;
  signOut?: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
});

export function SupabaseAuthProvider({ children }: { children: React.ReactNode }) {
  // Use existing Replit auth system as primary
  const replitAuth = useAuth();
  
  // Supabase auth as secondary/future system
  const supabaseAuth = useSupabaseAuth();

  // Determine which auth system to use
  const authSystem = replitAuth.isAuthenticated ? replitAuth : supabaseAuth;

  const contextValue: AuthContextType = {
    user: authSystem.user,
    isAuthenticated: authSystem.isAuthenticated,
    isLoading: authSystem.isLoading || replitAuth.isLoading,
    signOut: supabaseAuth.signOut,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export const useHybridAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useHybridAuth must be used within SupabaseAuthProvider');
  }
  return context;
};