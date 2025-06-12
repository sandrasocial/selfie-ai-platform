import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabaseClient';
import { useQuery } from '@tanstack/react-query';

interface SessionData {
  user: any;
  session: any;
  backendUser: any;
  isAdmin: boolean;
  timestamp: string;
}

export default function DebugSession() {
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch backend user data
  const { data: backendUserData } = useQuery({
    queryKey: ['/api/me'],
    retry: false,
  });

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      setLoading(true);
      
      // Get Supabase session
      const { data: sessionResponse, error: sessionError } = await supabase.auth.getSession();
      const { data: userResponse, error: userError } = await supabase.auth.getUser();

      // Check if user is admin (ssa@ssasocial.com)
      const userEmail = sessionResponse?.session?.user?.email || userResponse?.user?.email;
      const isAdmin = userEmail === 'ssa@ssasocial.com';

      const debugData: SessionData = {
        user: userResponse?.user || null,
        session: sessionResponse?.session || null,
        backendUser: backendUserData || null,
        isAdmin,
        timestamp: new Date().toISOString()
      };

      setSessionData(debugData);

      console.log('🔍 Debug Session Data:', {
        supabaseUser: debugData.user,
        supabaseSession: debugData.session,
        backendUser: debugData.backendUser,
        isAdmin: debugData.isAdmin,
        sessionError,
        userError
      });

    } catch (error) {
      console.error('❌ Debug session error:', error);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      await checkSession();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const refreshSession = async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      console.log('Refresh result:', { data, error });
      await checkSession();
    } catch (error) {
      console.error('Refresh error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F1F1F1] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#171719] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#4C4B4B]">Loading session data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F1F1F1] p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="font-['Cormorant_Garamond'] text-4xl font-normal text-[#171719] mb-2">
            Session Debug Console
          </h1>
          <p className="text-[#4C4B4B] font-light">
            Debug information for Supabase authentication state
          </p>
        </div>

        {/* Session Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Session Overview</span>
              <div className="flex gap-2">
                <Button onClick={checkSession} size="sm" variant="outline">
                  Refresh
                </Button>
                {sessionData?.session && (
                  <Button onClick={signOut} size="sm" variant="destructive">
                    Sign Out
                  </Button>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <Badge variant={sessionData?.session ? "default" : "destructive"}>
                  {sessionData?.session ? "Session Active" : "No Session"}
                </Badge>
                <p className="text-xs text-[#4C4B4B] mt-1">Supabase Session</p>
              </div>
              
              <div className="text-center">
                <Badge variant={sessionData?.user ? "default" : "destructive"}>
                  {sessionData?.user ? "User Found" : "No User"}
                </Badge>
                <p className="text-xs text-[#4C4B4B] mt-1">Supabase User</p>
              </div>
              
              <div className="text-center">
                <Badge variant={sessionData?.backendUser ? "default" : "destructive"}>
                  {sessionData?.backendUser ? "Backend OK" : "No Backend"}
                </Badge>
                <p className="text-xs text-[#4C4B4B] mt-1">Backend Session</p>
              </div>
              
              <div className="text-center">
                <Badge variant={sessionData?.isAdmin ? "default" : "secondary"}>
                  {sessionData?.isAdmin ? "Admin Access" : "Regular User"}
                </Badge>
                <p className="text-xs text-[#4C4B4B] mt-1">Admin Status</p>
              </div>
            </div>

            {sessionData?.timestamp && (
              <p className="text-xs text-[#B5B5B3] text-center">
                Last checked: {new Date(sessionData.timestamp).toLocaleString()}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Supabase User Data */}
        <Card>
          <CardHeader>
            <CardTitle>Supabase User Data</CardTitle>
          </CardHeader>
          <CardContent>
            {sessionData?.user ? (
              <div className="space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <strong>User ID:</strong>
                    <code className="block bg-gray-100 p-2 mt-1 rounded text-sm break-all">
                      {sessionData.user.id}
                    </code>
                  </div>
                  <div>
                    <strong>Email:</strong>
                    <code className="block bg-gray-100 p-2 mt-1 rounded text-sm">
                      {sessionData.user.email || 'Not available'}
                    </code>
                  </div>
                  <div>
                    <strong>Email Confirmed:</strong>
                    <Badge variant={sessionData.user.email_confirmed_at ? "default" : "destructive"}>
                      {sessionData.user.email_confirmed_at ? "Yes" : "No"}
                    </Badge>
                  </div>
                  <div>
                    <strong>Created:</strong>
                    <span className="text-sm">
                      {sessionData.user.created_at ? new Date(sessionData.user.created_at).toLocaleString() : 'Not available'}
                    </span>
                  </div>
                </div>
                
                <details className="mt-4">
                  <summary className="cursor-pointer text-sm font-medium">Full User Object</summary>
                  <pre className="bg-gray-100 p-4 mt-2 rounded text-xs overflow-auto max-h-64">
                    {JSON.stringify(sessionData.user, null, 2)}
                  </pre>
                </details>
              </div>
            ) : (
              <p className="text-[#4C4B4B]">No Supabase user data available</p>
            )}
          </CardContent>
        </Card>

        {/* Supabase Session Data */}
        <Card>
          <CardHeader>
            <CardTitle>Supabase Session Data</CardTitle>
          </CardHeader>
          <CardContent>
            {sessionData?.session ? (
              <div className="space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <strong>Access Token (first 20 chars):</strong>
                    <code className="block bg-gray-100 p-2 mt-1 rounded text-sm">
                      {sessionData.session.access_token?.substring(0, 20)}...
                    </code>
                  </div>
                  <div>
                    <strong>Token Type:</strong>
                    <code className="block bg-gray-100 p-2 mt-1 rounded text-sm">
                      {sessionData.session.token_type || 'Not available'}
                    </code>
                  </div>
                  <div>
                    <strong>Expires At:</strong>
                    <span className="text-sm">
                      {sessionData.session.expires_at ? new Date(sessionData.session.expires_at * 1000).toLocaleString() : 'Not available'}
                    </span>
                  </div>
                  <div>
                    <strong>Refresh Token (first 20 chars):</strong>
                    <code className="block bg-gray-100 p-2 mt-1 rounded text-sm">
                      {sessionData.session.refresh_token?.substring(0, 20)}...
                    </code>
                  </div>
                </div>
                
                <details className="mt-4">
                  <summary className="cursor-pointer text-sm font-medium">Full Session Object</summary>
                  <pre className="bg-gray-100 p-4 mt-2 rounded text-xs overflow-auto max-h-64">
                    {JSON.stringify(sessionData.session, null, 2)}
                  </pre>
                </details>
              </div>
            ) : (
              <p className="text-[#4C4B4B]">No Supabase session data available</p>
            )}
          </CardContent>
        </Card>

        {/* Backend User Data */}
        <Card>
          <CardHeader>
            <CardTitle>Backend User Data</CardTitle>
          </CardHeader>
          <CardContent>
            {sessionData?.backendUser ? (
              <div className="space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <strong>Backend User ID:</strong>
                    <code className="block bg-gray-100 p-2 mt-1 rounded text-sm">
                      {sessionData.backendUser.id || 'Not available'}
                    </code>
                  </div>
                  <div>
                    <strong>Email:</strong>
                    <code className="block bg-gray-100 p-2 mt-1 rounded text-sm">
                      {sessionData.backendUser.email || 'Not available'}
                    </code>
                  </div>
                </div>
                
                <details className="mt-4">
                  <summary className="cursor-pointer text-sm font-medium">Full Backend User Object</summary>
                  <pre className="bg-gray-100 p-4 mt-2 rounded text-xs overflow-auto max-h-64">
                    {JSON.stringify(sessionData.backendUser, null, 2)}
                  </pre>
                </details>
              </div>
            ) : (
              <p className="text-[#4C4B4B]">No backend user data available</p>
            )}
          </CardContent>
        </Card>

        {/* Admin Status */}
        {sessionData?.isAdmin && (
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-green-800">Admin Access Confirmed</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-700">
                You are authenticated as <strong>ssa@ssasocial.com</strong> with full admin privileges.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-4 flex-wrap">
            <Button onClick={() => window.location.href = '/supabase-auth'}>
              Magic Link Login
            </Button>
            <Button onClick={() => window.location.href = '/dashboard'} variant="outline">
              Go to Dashboard
            </Button>
            <Button onClick={() => window.location.href = '/courses/branded-by-selfie'} variant="outline">
              Access Course
            </Button>
            <Button onClick={refreshSession} variant="outline">
              Refresh Session
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}