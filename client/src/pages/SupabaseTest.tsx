import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Save, Upload, Trash2, RefreshCw } from "lucide-react";
import { Link } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { useWorkbookAnswers } from '@/hooks/useWorkbookAnswers';
import { usePhotoLibrary } from '@/hooks/usePhotoLibrary';
import { useSubscription } from '@/hooks/useSubscription';
import { useHybridAuth } from '@/hooks/useHybridAuth';
import { LogoutButton } from '@/components/LogoutButton';

export default function SupabaseTest() {
  const { user, isAuthenticated, isLoading } = useHybridAuth();
  const [moduleId, setModuleId] = useState('module-1');
  const [questionId, setQuestionId] = useState('question-1');
  const [answerText, setAnswerText] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [photoName, setPhotoName] = useState('');
  const [testResults, setTestResults] = useState<string[]>([]);
  
  const { toast } = useToast();
  
  // Redirect to auth if not authenticated
  if (!isLoading && !isAuthenticated) {
    window.location.href = '/supabase-auth';
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="font-['Inter'] text-gray-600">Loading...</p>
      </div>
    );
  }

  // Use Supabase hooks
  const workbook = useWorkbookAnswers(user?.id || '', moduleId);
  const photoLibrary = usePhotoLibrary(user?.id || '');
  const subscription = useSubscription(user?.id || '');

  const addTestResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`]);
  };

  const testWorkbookAnswer = async () => {
    try {
      await workbook.saveAnswer(questionId, answerText);
      addTestResult(`✅ Workbook answer saved for ${moduleId}/${questionId}`);
    } catch (error) {
      addTestResult(`❌ Workbook answer failed: ${error}`);
    }
  };

  const testPhotoSave = async () => {
    if (!photoUrl) {
      toast({
        title: "Missing URL",
        description: "Please enter a photo URL to test",
        variant: "destructive",
      });
      return;
    }

    try {
      await photoLibrary.savePhoto({
        uploadcare_uuid: `test-uuid-${Date.now()}`,
        file_url: photoUrl,
        file_name: photoName || 'test-photo.jpg',
        file_size: 1024,
        tags: ['test', 'uploaded']
      });
      addTestResult(`✅ Photo saved to library`);
    } catch (error) {
      addTestResult(`❌ Photo save failed: ${error}`);
    }
  };

  const testSubscriptionUpdate = async () => {
    try {
      await subscription.updateSubscription({
        plan: 'PRO',
        status: 'active',
        stripe_customer_id: 'cus_test_123',
        stripe_subscription_id: 'sub_test_123'
      });
      addTestResult(`✅ Subscription updated to PRO`);
    } catch (error) {
      addTestResult(`❌ Subscription update failed: ${error}`);
    }
  };

  const clearTestResults = () => {
    setTestResults([]);
  };

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
            <h1 className="font-['Prata'] text-3xl text-black">Supabase Integration Test</h1>
          </div>
          <div className="flex items-center gap-4">
            <p className="font-['Inter'] text-sm text-gray-600">
              {user?.firstName || user?.name || user?.email}
            </p>
            <LogoutButton />
          </div>
        </div>

        <Tabs defaultValue="workbook" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="workbook">Workbook Answers</TabsTrigger>
            <TabsTrigger value="photos">Photo Library</TabsTrigger>
            <TabsTrigger value="subscription">Subscription</TabsTrigger>
            <TabsTrigger value="results">Test Results</TabsTrigger>
          </TabsList>

          {/* Workbook Answers Test */}
          <TabsContent value="workbook">
            <Card>
              <CardHeader>
                <CardTitle>Test Workbook Answers</CardTitle>
                <CardDescription>
                  Test saving and retrieving AI module answers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Module ID</Label>
                    <Input 
                      value={moduleId}
                      onChange={(e) => setModuleId(e.target.value)}
                      placeholder="module-1"
                    />
                  </div>
                  <div>
                    <Label>Question ID</Label>
                    <Input 
                      value={questionId}
                      onChange={(e) => setQuestionId(e.target.value)}
                      placeholder="question-1"
                    />
                  </div>
                </div>
                
                <div>
                  <Label>Answer Text</Label>
                  <Textarea 
                    value={answerText}
                    onChange={(e) => setAnswerText(e.target.value)}
                    placeholder="Enter your test answer here..."
                    rows={3}
                  />
                </div>

                <div className="flex gap-3">
                  <Button onClick={testWorkbookAnswer} disabled={!answerText}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Answer
                  </Button>
                  <Button variant="outline" onClick={workbook.refreshAnswers}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh Answers
                  </Button>
                </div>

                {/* Display existing answers */}
                <div className="mt-6">
                  <h4 className="font-['Prata'] text-lg mb-3">Existing Answers ({workbook.answers.length})</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {workbook.answers.map((answer, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded">
                        <div className="flex justify-between items-start mb-1">
                          <Badge variant="outline">{answer.module_id}/{answer.question_id}</Badge>
                          <span className="text-xs text-gray-500">
                            {new Date(answer.created_at).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm">{answer.answer}</p>
                      </div>
                    ))}
                  </div>
                  {workbook.loading && <p className="text-center text-gray-500">Loading answers...</p>}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Photo Library Test */}
          <TabsContent value="photos">
            <Card>
              <CardHeader>
                <CardTitle>Test Photo Library</CardTitle>
                <CardDescription>
                  Test saving and managing photos with Uploadcare integration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Photo URL</Label>
                  <Input 
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    placeholder="https://example.com/photo.jpg"
                  />
                </div>
                
                <div>
                  <Label>Photo Name (Optional)</Label>
                  <Input 
                    value={photoName}
                    onChange={(e) => setPhotoName(e.target.value)}
                    placeholder="my-photo.jpg"
                  />
                </div>

                <div className="flex gap-3">
                  <Button onClick={testPhotoSave} disabled={!photoUrl}>
                    <Upload className="w-4 h-4 mr-2" />
                    Save Photo
                  </Button>
                  <Button variant="outline" onClick={photoLibrary.refreshPhotos}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh Library
                  </Button>
                </div>

                {/* Display existing photos */}
                <div className="mt-6">
                  <h4 className="font-['Prata'] text-lg mb-3">Photo Library ({photoLibrary.photos.length})</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-64 overflow-y-auto">
                    {photoLibrary.photos.map((photo, index) => (
                      <div key={index} className="relative border rounded-lg p-2">
                        <img 
                          src={photo.file_url} 
                          alt={photo.file_name}
                          className="w-full h-24 object-cover rounded"
                          onError={(e) => {
                            e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMiAxNkM4LjY4NjI5IDE2IDYgMTMuMzEzNyA2IDEwQzYgNi42ODYyOSA4LjY4NjI5IDQgMTIgNEMxNS4zMTM3IDQgMTggNi42ODYyOSAxOCAxMEMxOCAxMy4zMTM3IDE1LjMxMzcgMTYgMTIgMTZaIiBmaWxsPSIjOTg5OEE5Ii8+Cjx0ZXh0IHg9IjUwJSIgeT0iNzAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTAiIGZpbGw9IjY2NjY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Tm8gSW1hZ2U8L3RleHQ+Cjwvc3ZnPgo=';
                          }}
                        />
                        <p className="text-xs mt-1 truncate">{photo.file_name}</p>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="absolute top-1 right-1 h-6 w-6 p-0"
                          onClick={() => photoLibrary.deletePhoto(photo.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  {photoLibrary.loading && <p className="text-center text-gray-500">Loading photos...</p>}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Subscription Test */}
          <TabsContent value="subscription">
            <Card>
              <CardHeader>
                <CardTitle>Test Subscription Management</CardTitle>
                <CardDescription>
                  Test Stripe webhook integration and subscription status
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-gray-50 rounded">
                  <h4 className="font-medium mb-2">Current Status:</h4>
                  {subscription.loading ? (
                    <p className="text-gray-500">Loading subscription...</p>
                  ) : subscription.subscription ? (
                    <div className="space-y-1">
                      <p><strong>Plan:</strong> {subscription.getCurrentPlan()}</p>
                      <p><strong>Status:</strong> {subscription.subscription.status}</p>
                      <p><strong>Customer ID:</strong> {subscription.subscription.stripe_customer_id || 'N/A'}</p>
                    </div>
                  ) : (
                    <p className="text-gray-500">No subscription found (Free plan)</p>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button onClick={testSubscriptionUpdate}>
                    <Save className="w-4 h-4 mr-2" />
                    Test PRO Upgrade
                  </Button>
                  <Button variant="outline" onClick={subscription.refreshSubscription}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh Status
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Test Results */}
          <TabsContent value="results">
            <Card>
              <CardHeader>
                <CardTitle>Test Results</CardTitle>
                <CardDescription>
                  View all test operations and their results
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-medium">Test Log ({testResults.length})</h4>
                  <Button variant="outline" size="sm" onClick={clearTestResults}>
                    Clear Results
                  </Button>
                </div>
                
                <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm max-h-64 overflow-y-auto">
                  {testResults.length === 0 ? (
                    <p className="text-gray-500">No test results yet. Try running some tests!</p>
                  ) : (
                    testResults.map((result, index) => (
                      <div key={index} className="mb-1">{result}</div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}