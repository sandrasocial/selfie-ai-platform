
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useLocation } from "wouter";
import { supabase } from "@/lib/supabaseClient";

export default function LogoutButton() {
  const [, setLocation] = useLocation();

  const handleLogout = async () => {
    try {
      console.log('🚪 Starting logout process...');

      // Sign out from Supabase
      const { error } = await supabase.auth.signOut({ scope: 'local' });

      if (error) {
        console.error('❌ Supabase logout error:', error);
        // Continue with cleanup even if Supabase logout fails
      } else {
        console.log('✅ Supabase logout successful');
      }

      // Comprehensive storage cleanup
      const keysToRemove = [
        'authToken',
        'redirectAfterLogin',
        'sb-auth-token'
      ];

      // Add dynamic Supabase storage keys
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      if (supabaseUrl) {
        const projectRef = supabaseUrl.split('//')[1]?.split('.')[0];
        if (projectRef) {
          keysToRemove.push(`sb-${projectRef}-auth-token`);
        }
      }

      // Clear all authentication storage
      keysToRemove.forEach(key => {
        try {
          localStorage.removeItem(key);
          sessionStorage.removeItem(key);
        } catch (storageError) {
          console.warn('⚠️ Error removing storage key:', key, storageError);
        }
      });

      // Clear session storage completely
      try {
        sessionStorage.clear();
        console.log('🧹 Session storage cleared');
      } catch (clearError) {
        console.warn('⚠️ Error clearing session storage:', clearError);
      }

      // Clear window singleton tracking to prevent cached instances
      if (typeof window !== 'undefined') {
        delete window.__supabase_singleton__;
        delete window.__supabase_instance__;
      }

      // Optional: Call backend logout
      try {
        const response = await fetch('/api/auth/signout', {
          method: 'POST',
          credentials: 'include'
        });
        
        if (response.ok) {
          console.log('✅ Backend logout successful');
        } else {
          console.warn('⚠️ Backend logout status:', response.status);
        }
      } catch (backendError) {
        console.error('❌ Backend logout error:', backendError);
        // Continue with redirect
      }

      console.log('🏠 Redirecting to home page...');

      // Force redirect to ensure clean state
      setTimeout(() => {
        window.location.href = '/';
      }, 100);

    } catch (error) {
      console.error('❌ Logout error:', error);
      // Force redirect even if logout fails
      setTimeout(() => {
        window.location.href = '/';
      }, 100);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLogout}
      className="text-luxury-text-gray hover:text-luxury-headline"
    >
      <LogOut className="h-4 w-4 mr-2" />
      Sign Out
    </Button>
  );
}
