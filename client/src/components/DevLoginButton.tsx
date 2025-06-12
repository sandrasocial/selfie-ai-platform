import React from 'react';
import { useMutation } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from 'wouter';
import { Shield, Zap } from 'lucide-react';

export default function DevLoginButton() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const devLoginMutation = useMutation({
    mutationFn: () => apiRequest('POST', '/api/dev-login', {}),
    onSuccess: () => {
      toast({
        title: "Developer access granted",
        description: "Redirecting to dashboard with full access",
      });
      setTimeout(() => setLocation('/dashboard'), 1000);
    },
    onError: (error: any) => {
      toast({
        title: "Access failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Only show in development
  if (import.meta.env.MODE !== 'development') {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <Button
        onClick={() => devLoginMutation.mutate()}
        disabled={devLoginMutation.isPending}
        variant="outline"
        size="sm"
        className="bg-white/90 backdrop-blur-sm border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 shadow-sm"
      >
        <Shield className="w-3 h-3 mr-1.5" />
        {devLoginMutation.isPending ? (
          <>
            <Zap className="w-3 h-3 mr-1 animate-pulse" />
            Authenticating...
          </>
        ) : (
          'Dev Access'
        )}
      </Button>
    </div>
  );
}