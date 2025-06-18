import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Loader2 } from "lucide-react";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";

export function SupabaseAuthForm() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signInWithEmail } = useSupabaseAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    await signInWithEmail(email);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <Card className="w-full max-w-md border-2 border-black">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-black rounded-none flex items-center justify-center">
            <span className="text-white font-['Prata'] text-xl">S</span>
          </div>
          <CardTitle className="font-['Prata'] text-2xl text-black">
            Welcome to SELFIE AI™
          </CardTitle>
          <CardDescription className="font-['Inter'] text-gray-600">
            AI-powered personal branding for women entrepreneurs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="font-['Inter'] text-sm font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="font-['Inter'] border-2 border-gray-200 focus:border-black rounded-none"
                disabled={isLoading}
              />
            </div>
            <Button
              type="submit"
              disabled={isLoading || !email.trim()}
              className="w-full bg-black text-white hover:bg-gray-800 font-['Inter'] font-medium py-3 rounded-none"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending Magic Link...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4 mr-2" />
                  Send Magic Link
                </>
              )}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="font-['Inter'] text-xs text-gray-500">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}