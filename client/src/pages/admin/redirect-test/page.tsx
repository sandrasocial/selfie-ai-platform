// /pages/admin/RedirectTest.tsx
// Development tool for testing redirect configuration
// Remove this from production builds

import React, { useState, useEffect } from 'react';
import { testAllRedirects, redirectMap, applyRedirect } from '@/lib/redirects';
import { ROUTES } from '@/constants/routes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useLocation } from 'wouter';

interface TestResult {
  index: number;
  from: string;
  to?: string;
  pattern?: string;
  status: 'PASS' | 'FAIL' | 'ERROR';
  error?: string;
}

export default function RedirectTest() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [summary, setSummary] = useState({ passed: 0, failed: 0, total: 0 });
  const [testPath, setTestPath] = useState('');
  const [testResult, setTestResult] = useState<string | null>(null);
  const [, setLocation] = useLocation();

  // Run all tests on mount
  useEffect(() => {
    runAllTests();
  }, []);

  const runAllTests = () => {
    const { passed, failed, results } = testAllRedirects();
    setResults(results);
    setSummary({
      passed,
      failed,
      total: redirectMap.length
    });
  };

  const testSinglePath = () => {
    if (!testPath) return;
    
    const result = applyRedirect(testPath);
    if (result) {
      setTestResult(`✅ "${testPath}" → "${result}"`);
    } else {
      setTestResult(`❌ No redirect found for "${testPath}"`);
    }
  };

  const navigateToPath = (path: string) => {
    setLocation(path);
  };

  // Only show in development
  if (process.env.NODE_ENV === 'production') {
    return <div>This page is only available in development mode.</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <h1 className="font-bodoni text-4xl mb-8">SELFIE AI™ Redirect Testing</h1>

      {/* Summary Card */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Test Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-green-600">{summary.passed}</p>
              <p className="text-sm text-gray-600">Passed</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">{summary.failed}</p>
              <p className="text-sm text-gray-600">Failed</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{summary.total}</p>
              <p className="text-sm text-gray-600">Total Rules</p>
            </div>
          </div>
          <Button 
            onClick={runAllTests} 
            className="w-full mt-4"
            variant="outline"
          >
            Re-run All Tests
          </Button>
        </CardContent>
      </Card>

      {/* Single Path Tester */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Test Single Path</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              value={testPath}
              onChange={(e) => setTestPath(e.target.value)}
              placeholder="Enter a path to test (e.g., /module2)"
              onKeyPress={(e) => e.key === 'Enter' && testSinglePath()}
            />
            <Button onClick={testSinglePath}>Test</Button>
          </div>
          {testResult && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg font-mono text-sm">
              {testResult}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Common Test Cases */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Common Test Cases</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {[
              { path: '/module2', expected: ROUTES.LEARN.STARTER_KIT.MODULE(2) },
              { path: '/selfie-coach', expected: ROUTES.TOOLS.STUDIO },
              { path: '/blueprint', expected: ROUTES.LEARN.BRANDED.HOME },
              { path: '/dev-login', expected: ROUTES.AUTH.LOGIN },
              { path: '/pricing', expected: ROUTES.PRODUCTS.HOME },
              { path: '/my-courses', expected: ROUTES.LEARN.HOME },
            ].map(({ path, expected }) => (
              <div key={path} className="flex items-center justify-between p-3 border rounded">
                <div>
                  <code className="text-sm">{path}</code>
                  <span className="mx-2">→</span>
                  <code className="text-sm text-green-600">{expected}</code>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigateToPath(path)}
                >
                  Try
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Results */}
      <Card>
        <CardHeader>
          <CardTitle>All Redirect Rules</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {results.map((result, index) => (
              <div 
                key={index}
                className={`p-3 rounded border ${
                  result.status === 'PASS' 
                    ? 'border-green-200 bg-green-50' 
                    : 'border-red-200 bg-red-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Badge
                      variant={result.status === 'PASS' ? 'default' : 'destructive'}
                      className="mr-2"
                    >
                      {result.status}
                    </Badge>
                    <code className="text-sm">
                      {result.pattern ? `Pattern: ${result.pattern}` : result.from}
                    </code>
                    {result.to && (
                      <>
                        <span className="mx-2">→</span>
                        <code className="text-sm text-green-600">{result.to}</code>
                      </>
                    )}
                    {result.error && (
                      <p className="text-sm text-red-600 mt-1">{result.error}</p>
                    )}
                  </div>
                  {result.from && !result.pattern && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => navigateToPath(result.from)}
                    >
                      Try
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Route Constants Reference */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Route Constants Reference</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-gray-50 p-4 rounded overflow-x-auto text-xs">
            {JSON.stringify(ROUTES, null, 2)}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}