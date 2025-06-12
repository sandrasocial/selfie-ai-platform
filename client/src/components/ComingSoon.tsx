import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Sparkles } from 'lucide-react';

interface ComingSoonProps {
  title: string;
  description?: string;
}

export default function ComingSoon({ 
  title, 
  description = "You're early! The full SELFIE AI™ experience is launching soon. Join the waitlist to be first in line." 
}: ComingSoonProps) {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="max-w-2xl mx-auto text-center">
        {/* Navigation */}
        <div className="absolute top-6 left-6">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Coming Soon Content */}
        <div className="space-y-8">
          <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          
          <div className="space-y-4">
            <h1 className="font-['Prata'] text-4xl lg:text-5xl text-black">
              {title}
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed max-w-lg mx-auto">
              {description}
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-8">
              <h3 className="font-['Prata'] text-2xl mb-4">Get Early Access</h3>
              <p className="text-gray-600 mb-6">
                Be the first to know when this feature launches. Plus, get exclusive early-bird pricing.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input 
                  type="email" 
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
                <Button className="bg-black text-white hover:bg-gray-800 px-8 py-3">
                  Join Waitlist
                </Button>
              </div>
            </div>

            <div className="text-sm text-gray-500">
              In the meantime, check out our available products:
            </div>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/products/starter-kit">
                <Button variant="outline" size="sm">
                  Selfie Starter Kit ($47)
                </Button>
              </Link>
              <Link href="/products/branded-by-selfie">
                <Button variant="outline" size="sm">
                  Branded By Selfie™ ($397)
                </Button>
              </Link>
              <Link href="/products/presets">
                <Button variant="outline" size="sm">
                  Preset Bundles ($5-15)
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-gray-100">
          <div className="font-bold text-lg">SELFIE AI™</div>
          <div className="text-sm text-gray-500 mt-2">
            © 2024 SELFIE AI™. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
}