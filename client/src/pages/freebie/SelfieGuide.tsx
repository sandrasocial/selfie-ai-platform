
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function SelfieGuideLanding() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Store in Supabase and trigger Flodesk via Zapier
      const response = await fetch('/api/freebie/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, guide: 'ultimate-selfie' })
      });

      if (response.ok) {
        setIsSubmitted(true);
      }
    } catch (error) {
      console.error('Signup error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#F1F1F1]">
        <Header />
        <main className="min-h-[80vh] flex items-center justify-center px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h1 
              className="text-5xl lg:text-6xl mb-6 text-[#171719]"
              style={{ fontFamily: 'Cormorant Garamond' }}
            >
              Check your inbox.
            </h1>
            <p 
              className="text-xl text-[#4C4B4B] mb-8"
              style={{ fontFamily: 'Inter', fontWeight: 300 }}
            >
              Your glow-up starts now
            </p>
            <div className="bg-white p-8 border border-[#B5B5B3] max-w-md mx-auto">
              <h3 
                className="text-2xl mb-4 text-[#171719]"
                style={{ fontFamily: 'Cormorant Garamond' }}
              >
                Ready for More?
              </h3>
              <p 
                className="text-[#4C4B4B] mb-6"
                style={{ fontFamily: 'Inter', fontWeight: 300 }}
              >
                Take the complete transformation with our starter kit
              </p>
              <Button 
                className="bg-[#171719] text-white hover:bg-white hover:text-[#171719] border border-[#171719] w-full py-3 font-normal tracking-wide uppercase"
                style={{ borderRadius: 0 }}
                onClick={() => window.location.href = '/products/starter-kit'}
              >
                GET THE STARTER KIT → $67
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F1F1F1]">
      <Header />
      
      {/* Hero Section */}
      <section 
        className="min-h-screen flex items-center justify-center px-6 bg-cover bg-center relative"
        style={{ backgroundImage: 'url(https://i.postimg.cc/XJ5LHY2R/IMG-0407-jpg.jpg)' }}
      >
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative z-10 max-w-4xl mx-auto text-center text-white">
          <h1 
            className="text-6xl lg:text-7xl mb-6"
            style={{ fontFamily: 'Cormorant Garamond' }}
          >
            Your camera roll is about to glow up.
          </h1>
          <p 
            className="text-xl lg:text-2xl mb-12 max-w-2xl mx-auto"
            style={{ fontFamily: 'Inter', fontWeight: 300 }}
          >
            Everything you need to start taking confident, content-ready selfies—today.
          </p>
          
          {/* Email Capture Form */}
          <div className="bg-white p-8 max-w-md mx-auto">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="border-[#B5B5B3] focus:border-[#171719]"
                style={{ borderRadius: 0 }}
              />
              <Input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-[#B5B5B3] focus:border-[#171719]"
                style={{ borderRadius: 0 }}
              />
              <Button 
                type="submit"
                disabled={isLoading}
                className="bg-transparent border-2 border-[#171719] text-[#171719] hover:bg-[#171719] hover:text-white w-full py-3 font-normal tracking-wide uppercase"
                style={{ borderRadius: 0 }}
              >
                {isLoading ? 'SENDING...' : 'GET THE FREE GUIDE →'}
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* What You'll Learn Section */}
      <section className="py-20 px-6 bg-[#F1F1F1]">
        <div className="max-w-6xl mx-auto">
          <h2 
            className="text-5xl text-center mb-16 text-[#171719]"
            style={{ fontFamily: 'Cormorant Garamond' }}
          >
            What You'll Learn
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-white border border-[#B5B5B3] hover:transform hover:scale-105 transition-transform duration-300">
              <h3 
                className="text-2xl mb-4 text-[#171719]"
                style={{ fontFamily: 'Cormorant Garamond' }}
              >
                Lighting like a pro—even on a budget
              </h3>
              <p 
                className="text-[#4C4B4B]"
                style={{ fontFamily: 'Inter', fontWeight: 300 }}
              >
                Master natural and artificial lighting to create stunning selfies anywhere
              </p>
            </div>
            
            <div className="text-center p-8 bg-white border border-[#B5B5B3] hover:transform hover:scale-105 transition-transform duration-300">
              <h3 
                className="text-2xl mb-4 text-[#171719]"
                style={{ fontFamily: 'Cormorant Garamond' }}
              >
                Pose confidently in every frame
              </h3>
              <p 
                className="text-[#4C4B4B]"
                style={{ fontFamily: 'Inter', fontWeight: 300 }}
              >
                Learn the poses that flatter every angle and build unshakeable confidence
              </p>
            </div>
            
            <div className="text-center p-8 bg-white border border-[#B5B5B3] hover:transform hover:scale-105 transition-transform duration-300">
              <h3 
                className="text-2xl mb-4 text-[#171719]"
                style={{ fontFamily: 'Cormorant Garamond' }}
              >
                Mindset shift to feel magnetic on camera
              </h3>
              <p 
                className="text-[#4C4B4B]"
                style={{ fontFamily: 'Inter', fontWeight: 300 }}
              >
                Transform your relationship with the camera and radiate authentic confidence
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20 px-6 bg-[#171719]">
        <div className="max-w-6xl mx-auto text-center">
          <h2 
            className="text-5xl mb-16 text-white"
            style={{ fontFamily: 'Cormorant Garamond' }}
          >
            Used by 20,000+ women building personal brands with confidence
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="aspect-square bg-white/10 border border-white/20"></div>
            <div className="aspect-square bg-white/10 border border-white/20"></div>
            <div className="aspect-square bg-white/10 border border-white/20"></div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
