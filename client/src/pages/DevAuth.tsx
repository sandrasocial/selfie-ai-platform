import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from 'wouter';
import { toast } from "@/hooks/use-toast";
import Header from '@/components/layout/Header';

export default function DevAuth() {
  const [email, setEmail] = useState('sandra@sselfie.ai');
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();

  const handleDevLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    try {
      console.log('🔧 Dev authentication bypass for:', email);
      
      // Try the development endpoint first
      const response = await fetch('/api/dev-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (response.ok) {
        toast({
          title: "Development access granted",
          description: "Redirecting to dashboard..."
        });
        
        // Small delay to show success message
        setTimeout(() => {
          setLocation('/dashboard');
        }, 1000);
      } else {
        // Fallback: Direct redirect for immediate access
        console.log('Using direct access fallback');
        toast({
          title: "Accessing platform",
          description: "Redirecting to dashboard..."
        });
        
        setTimeout(() => {
          setLocation('/dashboard');
        }, 500);
      }
    } catch (error) {
      console.error('Dev login error:', error);
      // Still allow access - this is development mode
      toast({
        title: "Accessing platform",
        description: "Redirecting to dashboard..."
      });
      
      setTimeout(() => {
        setLocation('/dashboard');
      }, 500);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-luxury-white">
      <Header />
      
      <main className="flex items-center justify-center min-h-[80vh] px-4">
        <Card className="w-full max-w-md border-luxury-accent">
          <CardHeader className="text-center">
            <CardTitle className="font-prata text-2xl text-luxury-headline">
              Development Access
            </CardTitle>
            <CardDescription className="font-helvetica text-luxury-text-gray">
              Temporary access while configuring email service
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> This bypasses Supabase email authentication for development purposes.
                Configure SMTP settings in Supabase dashboard for production use.
              </p>
            </div>
            
            <form onSubmit={handleDevLogin} className="space-y-6">
              <div>
                <Input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full"
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="btn-primary w-full"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Access Dashboard"}
              </Button>
            </form>
            
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Email Configuration Required</h4>
              <p className="text-sm text-blue-800 mb-2">
                To enable magic link authentication, configure SMTP in your Supabase dashboard:
              </p>
              <ol className="text-xs text-blue-700 space-y-1">
                <li>1. Go to Authentication → Settings → Email Settings</li>
                <li>2. Configure SMTP provider (Resend, SendGrid, or Gmail)</li>
                <li>3. Add redirect URLs for your domain</li>
                <li>4. Test email delivery</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}