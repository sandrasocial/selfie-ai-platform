import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { supabase } from '@/lib/supabaseClient';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SupabaseCallback() {
  const [, setLocation] = useLocation();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');

  useEffect(() => {
    handleAuthCallback();
  }, []);

  const handleAuthCallback = async () => {
    try {
      console.log('🔐 Starting Supabase auth callback...');
      console.log('Current URL:', window.location.href);
      console.log('URL Hash:', window.location.hash);

      // Check for error parameters first
      const urlParams = new URLSearchParams(window.location.search);
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      
      const errorParam = urlParams.get('error') || hashParams.get('error');
      const errorDescription = urlParams.get('error_description') || hashParams.get('error_description');

      if (errorParam) {
        console.error('❌ Auth error in URL:', errorDescription || errorParam);
        setError(errorDescription || 'Authentication failed. Please try again.');
        setStatus('error');
        return;
      }

      // Extract tokens from URL hash fragment first
      const accessToken = hashParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token');
      
      console.log('🔍 URL Fragment Analysis:', {
        hasAccessToken: !!accessToken,
        hasRefreshToken: !!refreshToken,
        accessTokenLength: accessToken?.length || 0,
        refreshTokenLength: refreshToken?.length || 0
      });

      if (accessToken && refreshToken) {
        console.log('🔑 Found tokens in URL hash, establishing session...');
        
        const { data, error: setSessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken
        });

        if (setSessionError) {
          console.error('❌ Failed to set session:', setSessionError);
          setError('Failed to establish session from tokens.');
          setStatus('error');
          return;
        }

        if (data.session?.user) {
          console.log('✅ Session established from URL tokens for:', data.session.user.email);
          console.log('✅ Session ID:', data.session.access_token.substring(0, 20) + '...');
          
          setUserEmail(data.session.user.email || '');
          setStatus('success');

          // Clean URL hash to remove tokens
          window.history.replaceState({}, document.title, window.location.pathname);

          // Clear any stored redirect path
          localStorage.removeItem('redirectAfterLogin');

          // Create backend session before redirecting
          try {
            const sessionResponse = await fetch('/api/auth/supabase-session', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                userId: data.session.user.id,
                email: data.session.user.email,
                accessToken: data.session.access_token
              }),
              credentials: 'include'
            });

            if (sessionResponse.ok) {
              console.log('✅ Backend session created successfully');
            }
          } catch (sessionError) {
            console.log('⚠️ Backend session creation failed, proceeding anyway');
          }

          // Redirect to dashboard
          setTimeout(() => {
            console.log('🔄 Redirecting to dashboard...');
            setLocation('/dashboard');
          }, 1500);
          return;
        }
      }

      // Fallback: Check if session already exists (in case tokens were processed elsewhere)
      console.log('🔄 Checking for existing session...');
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        console.error('❌ Session error:', error);
        setError(error.message || 'Failed to process authentication.');
        setStatus('error');
        return;
      }

      if (session?.user) {
        console.log('✅ Existing session found for:', session.user.email);
        
        setUserEmail(session.user.email || '');
        setStatus('success');

        // Clean URL
        window.history.replaceState({}, document.title, window.location.pathname);
        localStorage.removeItem('redirectAfterLogin');

        setTimeout(() => {
          console.log('🔄 Redirecting to dashboard...');
          setLocation('/dashboard');
        }, 1500);
        return;
      }

      // No valid session or tokens found
      console.error('❌ No valid authentication data found in URL');
      console.error('Expected URL format: /supabase-auth/callback#access_token=...&refresh_token=...');
      setError('Invalid authentication link. Please request a new magic link.');
      setStatus('error');

    } catch (error: any) {
      console.error('❌ Callback processing error:', error);
      setError(error.message || 'Authentication processing failed.');
      setStatus('error');
    }
  };

  const getStatusContent = () => {
    switch (status) {
      case 'loading':
        return {
          title: 'Completing Sign In...',
          description: 'Please wait while we sign you in'
        };
      case 'success':
        return {
          title: 'Welcome to SELFIE AI™',
          description: userEmail ? `Successfully signed in as ${userEmail}` : 'You have been successfully signed in'
        };
      case 'error':
        return {
          title: 'Authentication Error',
          description: 'There was an issue with your authentication'
        };
      default:
        return {
          title: 'Processing...',
          description: 'Processing your authentication...'
        };
    }
  };

  const { title, description } = getStatusContent();

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-8">
      <Card className="w-full max-w-md border-black">
        <CardHeader className="text-center">
          <CardTitle className="font-['Prata'] text-2xl text-black">
            {title}
          </CardTitle>
          <CardDescription className="text-gray-600">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {status === 'success' && (
            <div className="text-center space-y-4">
              <p className="text-sm text-gray-600">
                Redirecting you to the dashboard...
              </p>
              <Button onClick={() => setLocation('/dashboard')} variant="outline">
                Continue to Dashboard
              </Button>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}
              <div className="flex gap-2">
                <Button onClick={() => setLocation('/supabase-auth')} className="flex-1">
                  Get New Link
                </Button>
                <Button onClick={() => setLocation('/')} variant="outline" className="flex-1">
                  Go Home
                </Button>
              </div>
            </div>
          )}

          {status === 'loading' && (
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
              <p className="text-xs text-gray-500">
                Processing your authentication...
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}