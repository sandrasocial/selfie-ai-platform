import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { useLocation } from 'wouter';

export default function AuthReset() {
  const { signOut } = useAuth();
  const [, setLocation] = useLocation();

  const handleCompleteReset = async () => {
    try {
      console.log('🔄 Starting complete authentication reset...');
      
      // Use the comprehensive signOut from useSupabaseAuth
      await signOut();
      
      console.log('✅ Complete authentication reset successful');
    } catch (error) {
      console.error('Reset error:', error);
      // Force redirect even if signOut fails
      window.location.href = '/login';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 bg-red-600 text-white p-3 rounded-lg shadow-lg">
      <div className="text-sm font-medium mb-2">Authentication Reset</div>
      <Button
        onClick={handleCompleteReset}
        variant="outline"
        size="sm"
        className="bg-white text-red-600 hover:bg-gray-100 text-xs"
      >
        Complete Logout & Reset
      </Button>
    </div>
  );
}