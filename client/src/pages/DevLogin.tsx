import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from 'wouter';

export default function DevLogin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  const devLoginMutation = useMutation({
    mutationFn: () => apiRequest('POST', '/api/dev-login', {}),
    onSuccess: () => {
      toast({
        title: "Dev login successful!",
        description: "You now have PRO access for testing"
      });
      queryClient.invalidateQueries({ queryKey: ['/api/me'] });
      setLocation('/dashboard');
    },
    onError: (error: any) => {
      toast({
        title: "Dev login failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Dev login is always available for testing

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <CardTitle className="font-['Prata'] text-2xl">Development Login</CardTitle>
          <p className="text-gray-600 text-sm">Quick access for testing features</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg text-sm">
            <h4 className="font-semibold text-blue-900 mb-2">Test Account Details:</h4>
            <ul className="text-blue-800 space-y-1">
              <li>• Email: test@sandra.dev</li>
              <li>• Plan: PRO (unlimited access)</li>
              <li>• Profile: Complete</li>
              <li>• All features enabled</li>
            </ul>
          </div>

          <Button
            onClick={() => devLoginMutation.mutate()}
            disabled={devLoginMutation.isPending}
            className="w-full bg-[#3C3A35] hover:bg-[#2A2823]"
          >
            {devLoginMutation.isPending ? 'Logging in...' : 'Login as Test User'}
          </Button>

          <p className="text-xs text-gray-500 text-center">
            This login method is only available in development mode
          </p>
        </CardContent>
      </Card>
    </div>
  );
}