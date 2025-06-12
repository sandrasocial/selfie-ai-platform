
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowLeft } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { Link } from 'wouter';
import Header from '@/components/layout/Header';
import { supabase } from '@/lib/supabaseClient';

export default function SupabaseAuth() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { toast } = useToast();

  // Get email from URL parameters if provided
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const emailParam = urlParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, []);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    try {
      console.log('🔗 Sending magic link via Supabase native auth for:', email);

      // Use production domain for emailRedirectTo to match Supabase whitelist
      const redirectUrl = 'https://sselfie.ai/supabase-auth/callback';
      console.log('🔄 Production Supabase signInWithOtp config:', {
        email,
        redirectUrl,
        supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
        hasAnonKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY
      });

      const { data, error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: redirectUrl
        }
      });

      if (error) {
        console.error('❌ SUPABASE MAGIC LINK 500 ERROR - COMPLETE DIAGNOSIS:');
        console.error('================================================');
        console.error('Error object:', JSON.stringify(error, null, 2));
        console.error('Error message:', error.message);
        console.error('Error status:', error.status);
        console.error('Error name:', error.name || 'Unknown Error');
        console.error('Error code:', error.code || 'No code');
        console.error('Error details:', (error as any).details || 'No details');
        console.error('Full error response:', (error as any).response || 'No response');
        console.error('Supabase project URL:', import.meta.env.VITE_SUPABASE_URL);
        console.error('Request payload sent to Supabase:', {
          email: email.trim(),
          emailRedirectTo: redirectUrl,
          timestamp: new Date().toISOString()
        });
        console.error('================================================');
        console.error('Full error JSON:', JSON.stringify(error, null, 2));
        
        // Additional diagnostic information
        console.error('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
        console.error('Has Anon Key:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);
        console.error('Redirect URL:', redirectUrl);
        console.error('Email:', email);
        console.error('Timestamp:', new Date().toISOString());
        
        // Log the exact fetch details if available
        if ((error as any).cause) {
          console.error('Error cause:', (error as any).cause);
        }
        if (error.stack) {
          console.error('Error stack:', error.stack);
        }
        
        // Check for specific error types with enhanced messaging
        if (error.message?.includes('Email rate limit exceeded')) {
          throw new Error('Rate limit exceeded. Wait before trying again.');
        } else if (error.message?.includes('Invalid email')) {
          throw new Error('Invalid email address format.');
        } else if (error.message?.includes('Email not confirmed')) {
          throw new Error('Email confirmation required first.');
        } else if (error.status === 500) {
          throw new Error(`Supabase 500 Error: ${error.message || 'Email service configuration issue'}`);
        } else if (error.message?.includes('SMTP')) {
          throw new Error('Email delivery configuration error in Supabase dashboard.');
        } else if (error.message?.includes('rate limit')) {
          throw new Error('Too many requests. Please wait and try again.');
        } else {
          throw new Error(error.message || 'Failed to send magic link');
        }
      }

      console.log('✅ Magic link sent via Supabase native auth');
      setEmailSent(true);
      toast({
        title: "Check your inbox",
        description: "Your login link is on the way (valid for 60 seconds)",
      });
    } catch (error: any) {
      console.error('❌ Magic link error:', error);
      
      let errorMessage = error.message;
      
      // Show red toast for all errors, with specific messaging for rate limits
      toast({
        title: "Sign In Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmergencyLogin = async () => {
    try {
      setIsLoading(true);
      console.log('🚨 Emergency login bypass initiated');
      
      const response = await fetch('/api/auth/emergency-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email || 'sandra@sselfie.ai' }),
        credentials: 'include'
      });
      
      const data = await response.json();
      
      if (data.success) {
        console.log('✅ Emergency login successful');
        toast({
          title: "Emergency Access Granted",
          description: "You have been logged in for testing purposes",
        });
        window.location.href = '/dashboard';
      } else {
        throw new Error(data.error || 'Emergency login failed');
      }
    } catch (error: any) {
      console.error('❌ Emergency login error:', error);
      toast({
        title: "Emergency Login Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center p-8 pt-16">
          <Card className="w-full max-w-md border-black">
            <CardHeader className="text-center space-y-6">
              <div className="mx-auto w-20 h-20 bg-black flex items-center justify-center">
                <span className="text-white font-['Prata'] text-2xl font-bold">S</span>
              </div>
              <div>
                <CardTitle className="font-['Prata'] text-2xl text-black mb-3">
                  Check your inbox
                </CardTitle>
                <CardDescription className="font-['Neue Einstellung'] text-gray-600 text-base">
                  Your login link is on the way to <strong>{email}</strong>. This link is valid for 60 seconds.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Button 
                  onClick={() => setEmailSent(false)}
                  className="w-full bg-black text-white uppercase tracking-wide py-3 rounded-none font-['Neue Einstellung']"
                >
                  Send Another Link
                </Button>
                <Link href="/">
                  <Button 
                    variant="outline" 
                    className="w-full border-black text-black hover:bg-black hover:text-white py-3 rounded-none font-['Neue Einstellung']"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                  </Button>
                </Link>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center font-['Neue Einstellung']">
                  Didn't mean to log in? Just ignore this email — no action needed.
                </p>
                <p className="text-xs text-gray-400 text-center mt-2 font-['Neue Einstellung']">
                  By continuing, you agree to our Terms & Policies
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="flex items-center justify-center p-8 pt-16">
        <Card className="w-full max-w-md border-black">
          <CardHeader className="text-center space-y-6">
            <div className="mx-auto w-20 h-20 bg-black flex items-center justify-center">
              <span className="text-white font-['Prata'] text-2xl font-bold">S</span>
            </div>
            <div>
              <h1 className="font-prata text-4xl md:text-5xl text-black mb-6 uppercase tracking-wide">
                Your Glow-Up Starts Here
              </h1>
              <div className="h-px w-20 bg-black mx-auto mb-6"></div>
              <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto font-['Neue Einstellung']">
                Continue building your brand with SELFIE AI™
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignIn} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="font-['Neue Einstellung'] font-medium">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="queen@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="py-3 border-gray-300 focus:border-black font-['Neue Einstellung']"
                />
              </div>
              <Button 
                type="submit" 
                disabled={isLoading || !email.trim()}
                className="w-full bg-black text-white uppercase tracking-wide py-3 rounded-none font-['Neue Einstellung']"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending Magic Link...
                  </>
                ) : (
                  "Send Magic Link"
                )}
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-200 space-y-4">
              {/* Emergency Access Button */}
              <Button 
                onClick={handleEmergencyLogin}
                disabled={isLoading}
                className="w-full bg-red-600 text-white uppercase tracking-wide py-3 rounded-none font-['Neue Einstellung'] hover:bg-red-700"
              >
                {isLoading ? "Processing..." : "🚨 EMERGENCY PLATFORM ACCESS"}
              </Button>
              
              <div className="flex gap-3">
                <Link href="/" className="flex-1">
                  <Button 
                    variant="outline" 
                    className="w-full border-gray-300 text-gray-600 hover:bg-gray-50 rounded-none font-['Neue Einstellung']"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                  </Button>
                </Link>
              </div>
              <p className="text-xs text-gray-400 text-center font-['Neue Einstellung']">
                By continuing, you agree to our Terms & Policies
              </p>
              <p className="text-sm text-gray-600 text-center font-['Neue Einstellung']">
                Join the women building brands that heal, help, and get paid.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
