import { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Crown, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function TempAdminLogin() {
  const [email, setEmail] = useState('');
  const [adminToken, setAdminToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/temp-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, adminToken }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Admin Access Granted",
          description: "Welcome to Sandra's HQ",
        });
        setLocation('/admin-dashboard');
      } else {
        toast({
          title: "Access Denied",
          description: data.message || "Invalid credentials",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Card className="border-gray-200 shadow-lg">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Crown className="w-12 h-12 text-black" />
            </div>
            <CardTitle className="text-2xl font-bold text-black font-['Prata']">
              Admin Access
            </CardTitle>
            <p className="text-gray-600 text-sm">
              Temporary login for Sandra's HQ
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="sandrajonna@gmail.com"
                  className="mt-1 border-gray-300 focus:border-black focus:ring-black"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="adminToken" className="text-sm font-medium text-gray-700">
                  Admin Token
                </Label>
                <Input
                  id="adminToken"
                  type="password"
                  value={adminToken}
                  onChange={(e) => setAdminToken(e.target.value)}
                  placeholder="Enter admin token"
                  className="mt-1 border-gray-300 focus:border-black focus:ring-black"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-black text-white hover:bg-gray-800 font-bold uppercase tracking-wide"
              >
                <Lock className="w-4 h-4 mr-2" />
                {isLoading ? 'Authenticating...' : 'Access Dashboard'}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                This is a temporary bypass for testing purposes.
                <br />
                Will be disabled after full authentication setup.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}