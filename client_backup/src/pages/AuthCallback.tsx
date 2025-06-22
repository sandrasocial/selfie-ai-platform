import React, { useEffect } from 'react';
import { useLocation } from 'wouter';
import { supabase } from '@/lib/supabaseClient';
import { Loader2 } from 'lucide-react';

export default function AuthCallback() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Auth callback error:', error);
          setLocation('/');
          return;
        }

        if (data?.session) {
          // Successfully authenticated, redirect to dashboard
          setLocation('/dashboard');
        } else {
          // No session, redirect to home
          setLocation('/');
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        setLocation('/');
      }
    };

    handleAuthCallback();
  }, [setLocation]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F1F1F1]">
      <div className="text-center space-y-6">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#171719]" />
        <h2 
          className="text-2xl font-normal text-[#171719]" 
          className="font-cormorant"
        >
          Signing you in...
        </h2>
        <p 
          className="text-[#4C4B4B] font-light leading-relaxed" 
          className="font-neue"
        >
          Please wait while we complete your authentication.
        </p>
      </div>
    </div>
  );
}