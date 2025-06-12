
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLocation } from 'wouter';

export default function TestLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();

  const handleTestLogin = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/test-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });

      if (response.ok) {
        console.log('Test login successful');
        setLocation('/dashboard');
      } else {
        console.error('Test login failed');
      }
    } catch (error) {
      console.error('Test login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="font-['Prata'] text-2xl text-[#3C3A35]">
            Test Login
          </CardTitle>
          <p className="text-gray-600">
            Temporary bypass for testing session persistence
          </p>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={handleTestLogin}
            disabled={isLoading}
            className="w-full bg-black text-white hover:bg-gray-800"
          >
            {isLoading ? 'Logging in...' : 'Login as Test User'}
          </Button>
          
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-sm text-yellow-800">
              This will log you in as "Test User" and create a session that persists across browser refreshes.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
