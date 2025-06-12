import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function VIPThankYou() {
  return (
    <div className="min-h-screen bg-[#F1F1F1]">
      {/* HERO SECTION */}
      <section className="px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Success Icon */}
          <div className="w-16 h-16 bg-[#171719] flex items-center justify-center mx-auto mb-8">
            <div className="w-8 h-8 bg-white" />
          </div>

          <h1 className="text-4xl lg:text-5xl mb-6 text-[#171719]" style={{ fontFamily: 'Cormorant Garamond', fontWeight: 400 }}>
            Your Application Is In
          </h1>
          <p className="text-xl text-[#4C4B4B] max-w-2xl mx-auto font-light" style={{ fontFamily: 'Neue Einstellung' }}>
            Thank you for applying to Empire Builder VIP. We'll review your application within 48 hours and be in touch.
          </p>
        </div>
      </section>

      {/* NEXT STEPS */}
      <section className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl text-center mb-12 text-[#171719]" style={{ fontFamily: 'Cormorant Garamond', fontWeight: 400 }}>
            What Happens Next
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white border border-[#B5B5B3] p-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-[#171719] flex items-center justify-center mx-auto mb-6">
                  <span className="text-white text-xl font-normal" style={{ fontFamily: 'Cormorant Garamond' }}>01</span>
                </div>
                <h3 className="text-2xl text-[#171719] mb-4" style={{ fontFamily: 'Cormorant Garamond', fontWeight: 400 }}>
                  Review
                </h3>
                <p className="text-[#4C4B4B] font-light" style={{ fontFamily: 'Neue Einstellung' }}>
                  We'll read your answers and make sure it's the right fit.
                </p>
              </div>
            </div>

            <div className="bg-white border border-[#B5B5B3] p-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-[#171719] flex items-center justify-center mx-auto mb-6">
                  <span className="text-white text-xl font-normal" style={{ fontFamily: 'Cormorant Garamond' }}>02</span>
                </div>
                <h3 className="text-2xl text-[#171719] mb-4" style={{ fontFamily: 'Cormorant Garamond', fontWeight: 400 }}>
                  Strategy Call
                </h3>
                <p className="text-[#4C4B4B] font-light" style={{ fontFamily: 'Neue Einstellung' }}>
                  If selected, you'll be invited to a 30-min 1:1 call with Sandra.
                </p>
              </div>
            </div>

            <div className="bg-white border border-[#B5B5B3] p-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-[#171719] flex items-center justify-center mx-auto mb-6">
                  <span className="text-white text-xl font-normal" style={{ fontFamily: 'Cormorant Garamond' }}>03</span>
                </div>
                <h3 className="text-2xl text-[#171719] mb-4" style={{ fontFamily: 'Cormorant Garamond', fontWeight: 400 }}>
                  Welcome
                </h3>
                <p className="text-[#4C4B4B] font-light" style={{ fontFamily: 'Neue Einstellung' }}>
                  If it's a yes on both sides — you'll begin your Empire Builder experience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ENCOURAGEMENT BLOCK */}
      <section className="px-6 py-16 bg-[#171719] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl mb-6 text-white" style={{ fontFamily: 'Cormorant Garamond', fontWeight: 400 }}>
            You're Already Ahead
          </h2>
          <p className="text-xl text-[#B5B5B3] mb-8 font-light" style={{ fontFamily: 'Neue Einstellung' }}>
            Most people never even apply. You did. That says everything.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-2xl font-normal mb-2 text-white" style={{ fontFamily: 'Cormorant Garamond' }}>Vision</div>
              <p className="text-sm text-[#B5B5B3] font-light" style={{ fontFamily: 'Neue Einstellung' }}>You're thinking big picture.</p>
            </div>
            <div>
              <div className="text-2xl font-normal mb-2 text-white" style={{ fontFamily: 'Cormorant Garamond' }}>Courage</div>
              <p className="text-sm text-[#B5B5B3] font-light" style={{ fontFamily: 'Neue Einstellung' }}>You said yes to yourself.</p>
            </div>
            <div>
              <div className="text-2xl font-normal mb-2 text-white" style={{ fontFamily: 'Cormorant Garamond' }}>Action</div>
              <p className="text-sm text-[#B5B5B3] font-light" style={{ fontFamily: 'Neue Einstellung' }}>You moved toward your future.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CONTINUE EXPLORING */}
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl mb-12 text-[#171719]" style={{ fontFamily: 'Cormorant Garamond', fontWeight: 400 }}>
            Want to Keep Growing While You Wait?
          </h3>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Link href="/products/selfie-starter-kit">
              <Button 
                variant="outline" 
                className="bg-white text-[#171719] hover:bg-[#171719] hover:text-white border-2 border-[#171719] font-light text-lg px-8 py-6 w-full uppercase tracking-wide transition-all duration-300"
                style={{ fontFamily: 'Neue Einstellung' }}
              >
                Selfie Starter Kit
              </Button>
            </Link>
            <Link href="/products/branded-by-selfie">
              <Button 
                variant="outline" 
                className="bg-white text-[#171719] hover:bg-[#171719] hover:text-white border-2 border-[#171719] font-light text-lg px-8 py-6 w-full uppercase tracking-wide transition-all duration-300"
                style={{ fontFamily: 'Neue Einstellung' }}
              >
                Branded by Selfie
              </Button>
            </Link>
          </div>
          <Link href="/">
            <Button 
              variant="ghost" 
              className="text-[#4C4B4B] hover:text-[#171719] font-light text-lg underline"
              style={{ fontFamily: 'Neue Einstellung' }}
            >
              Return to Homepage
            </Button>
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="px-6 py-12 border-t border-[#B5B5B3] bg-[#171719] text-white">
        <div className="max-w-6xl mx-auto text-center">
          <p className="font-light" style={{ fontFamily: 'Neue Einstellung' }}>© 2024 SELFIE AI™. All rights reserved.</p>
          <p className="mt-2 text-sm font-light text-[#B5B5B3]" style={{ fontFamily: 'Neue Einstellung' }}>Need help? Contact support@selfieai.com</p>
        </div>
      </footer>
    </div>
  );
}