import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, User, CheckCircle, XCircle, RefreshCw } from "lucide-react";
import { Link } from 'wouter';
import { useHybridAuth } from '@/hooks/useHybridAuth';
import { LogoutButton } from '@/components/LogoutButton';

export default function LogoutTest() {
  const { user, isAuthenticated, isLoading, logout, supabaseAuth, replitUser } = useHybridAuth();
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isTestingLogout, setIsTestingLogout] = useState(false);

  const addTestResult = (result: string, success: boolean = true) => {
    const timestamp = new Date().toLocaleTimeString();
    const icon = success ? '✅' : '❌';
    setTestResults(prev => [...prev, `${timestamp} ${icon} ${result}`]);
  };

  const testAuthState = () => {
    addTestResult(`Auth state check - Authenticated: ${isAuthenticated}`);
    addTestResult(`Current user: ${user ? (user.email || user.name || 'User found') : 'No user'}`);
    addTestResult(`Supabase user: ${supabaseAuth.user ? 'Found' : 'None'}`);
    addTestResult(`Replit user: ${replitUser ? 'Found' : 'None'}`);
    addTestResult(`Loading state: ${isLoading}`);
  };

  const testStorageState = () => {
    const localStorageKeys = Object.keys(localStorage);
    const sessionStorageKeys = Object.keys(sessionStorage);
    
    addTestResult(`LocalStorage keys: ${localStorageKeys.length > 0 ? localStorageKeys.join(', ') : 'Empty'}`);
    addTestResult(`SessionStorage keys: ${sessionStorageKeys.length > 0 ? sessionStorageKeys.join(', ') : 'Empty'}`);
    addTestResult(`Cookies: ${document.cookie || 'Empty'}`);
  };

  const testLogoutFlow = async () => {
    setIsTestingLogout(true);
    addTestResult('Starting logout test...');
    
    try {
      await logout();
      addTestResult('Logout function completed successfully');
    } catch (error: any) {
      addTestResult(`Logout function failed: ${error.message}`, false);
    } finally {
      setIsTestingLogout(false);
    }
  };

  const clearTestResults = () => {
    setTestResults([]);
  };

  // Redirect to auth if not authenticated
  if (!isLoading && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="font-['Prata'] text-center">Not Authenticated</CardTitle>
            <CardDescription className="text-center">
              You need to be logged in to test the logout flow
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/supabase-auth">
              <Button className="w-full">Go to Login</Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="w-full">Back to Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="font-['Inter'] text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <h1 className="font-['Prata'] text-3xl text-black">Logout Flow Test</h1>
          </div>
          <div className="flex items-center gap-4">
            <p className="font-['Inter'] text-sm text-gray-600">
              Testing user: {user?.firstName || user?.name || user?.email}
            </p>
            <Badge variant={isAuthenticated ? "default" : "destructive"}>
              {isAuthenticated ? "Authenticated" : "Not Authenticated"}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Current Auth State */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Current Authentication State
              </CardTitle>
              <CardDescription>
                Current status of the authentication system
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Authenticated:</span>
                  <Badge variant={isAuthenticated ? "default" : "destructive"}>
                    {isAuthenticated ? "Yes" : "No"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Loading:</span>
                  <Badge variant={isLoading ? "secondary" : "outline"}>
                    {isLoading ? "Yes" : "No"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">User ID:</span>
                  <span className="text-sm text-gray-600">{user?.id || 'None'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Email:</span>
                  <span className="text-sm text-gray-600">{user?.email || 'None'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Supabase User:</span>
                  <Badge variant={supabaseAuth.user ? "default" : "outline"}>
                    {supabaseAuth.user ? "Active" : "None"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Replit User:</span>
                  <Badge variant={replitUser ? "default" : "outline"}>
                    {replitUser ? "Active" : "None"}
                  </Badge>
                </div>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button onClick={testAuthState} size="sm" variant="outline">
                  Test Auth State
                </Button>
                <Button onClick={testStorageState} size="sm" variant="outline">
                  Check Storage
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Logout Testing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5" />
                Logout Testing
              </CardTitle>
              <CardDescription>
                Test the logout functionality and state cleanup
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  Click the buttons below to test different logout scenarios
                </p>
              </div>
              
              <div className="space-y-2">
                <LogoutButton className="w-full" />
                <Button 
                  onClick={testLogoutFlow} 
                  disabled={isTestingLogout}
                  variant="outline" 
                  className="w-full"
                >
                  {isTestingLogout ? "Testing..." : "Test Logout Flow"}
                </Button>
              </div>
              
              <div className="text-xs text-gray-500 space-y-1">
                <p>• LogoutButton: Uses the standard logout component</p>
                <p>• Test Logout Flow: Tests the logout function directly</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Test Results */}
        <Card className="mt-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Test Results</CardTitle>
                <CardDescription>
                  Real-time results from logout and authentication tests
                </CardDescription>
              </div>
              <Button onClick={clearTestResults} size="sm" variant="outline">
                Clear Results
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-lg max-h-64 overflow-y-auto">
              {testResults.length === 0 ? (
                <p className="text-gray-500 text-sm">No test results yet. Run some tests above.</p>
              ) : (
                <div className="space-y-1">
                  {testResults.map((result, index) => (
                    <div key={index} className="text-sm font-mono">
                      {result}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}