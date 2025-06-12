
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AuthReset from "@/components/AuthReset";
import { useLocation, Link } from "wouter";
import { toast } from "@/hooks/use-toast";

export default function Login() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { data: user } = useQuery({ queryKey: ["/api/me"], retry: false });

  // Redirect if already logged in
  if (user) {
    setLocation("/dashboard");
    return null;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    // Redirect to Supabase authentication page
    setLocation(`/supabase-auth?email=${encodeURIComponent(email)}`);
  };

  return (
    <div className="min-h-screen bg-luxury-white">
      <Header />
      <AuthReset />
      
      {/* Emergency Access Banner */}
      <div className="bg-red-600 text-white py-4 px-4 text-center">
        <p className="font-bold text-lg mb-3">🚨 AUTHENTICATION BYPASS AVAILABLE</p>
        <Link 
          href="/temp-admin" 
          className="inline-block px-8 py-3 bg-white text-red-600 font-bold text-lg rounded-lg hover:bg-gray-100 transition-colors"
        >
          → INSTANT PLATFORM ACCESS ←
        </Link>
        <p className="text-sm mt-2 opacity-90">Skip all login issues - direct dashboard access</p>
      </div>
      
      <main className="flex items-center justify-center min-h-[80vh] px-4">
        <Card className="w-full max-w-md border-luxury-accent">
          <CardHeader className="text-center">
            <CardTitle className="font-prata text-3xl text-luxury-headline uppercase tracking-wide">
              Welcome Back
            </CardTitle>
            <p className="font-helvetica text-luxury-text-gray">
              Enter your email to receive a magic login link
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <Input
                  type="email"
                  placeholder="Your email address"
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
                {isLoading ? "Sending..." : "Send Magic Link"}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="font-helvetica text-sm text-luxury-text-gray">
                Don't have an account? The magic link will create one for you.
              </p>
            </div>
            
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2">✓ Skip Authentication Issues</h4>
              <p className="text-sm text-green-800 mb-3">
                Access your platform immediately while email service is configured.
              </p>
              <Link 
                href="/dev-auth" 
                className="inline-block w-full px-4 py-3 bg-green-600 text-white text-center font-medium rounded-lg hover:bg-green-700 transition-colors"
              >
                → Access Platform Instantly
              </Link>
            </div>
            
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-700 mb-2">
                <strong>Note:</strong> Console errors are expected until email service is configured.
              </p>
              <p className="text-xs text-blue-600">
                Production fix: Configure SMTP in Supabase dashboard → Authentication → Email Settings
              </p>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
