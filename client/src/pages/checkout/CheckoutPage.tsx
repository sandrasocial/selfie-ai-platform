
import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';

const products = {
  'starter-kit': {
    name: 'The Selfie Starter Kit',
    price: 67,
    description: '30+ content templates, hook formulas, and brand strategy workbook',
    features: ['Instant Access', '30+ Templates', 'Brand Strategy Guide', 'Hook Formulas'],
    image: '/api/placeholder/200/200'
  },
  'branded-by-selfie': {
    name: 'Branded By Selfie™',
    price: 397,
    description: 'Complete 8-week personal branding transformation program',
    features: ['8-Week Program', '45+ Video Lessons', 'Live Q&A Access', 'Bonus Materials'],
    image: '/api/placeholder/200/200'
  },
  'preset-bare': {
    name: 'Bare Bundle Presets',
    price: 5,
    description: '5 clean, minimal Lightroom presets for authentic looks',
    features: ['5 Presets', 'Mobile Compatible', 'Tutorial Included'],
    image: '/api/placeholder/200/200'
  },
  'preset-glow': {
    name: 'Glow Bundle Presets',
    price: 5,
    description: '5 warm, luminous presets for golden hour vibes',
    features: ['5 Presets', 'Mobile Compatible', 'Tutorial Included'],
    image: '/api/placeholder/200/200'
  },
  'preset-skin': {
    name: 'Skin Bundle Presets',
    price: 5,
    description: '5 presets for perfect skin tones and complexion',
    features: ['5 Presets', 'Mobile Compatible', 'Tutorial Included'],
    image: '/api/placeholder/200/200'
  },
  'preset-selfie-glow': {
    name: 'Selfie Glow-Up Bundle',
    price: 5,
    description: '8 ultimate selfie enhancement presets',
    features: ['8 Presets', 'Mobile Compatible', 'Bonus Guide'],
    image: '/api/placeholder/200/200'
  },
  'preset-bundle-all': {
    name: 'Complete Preset Collection',
    price: 15,
    description: 'All 4 preset bundles (23 presets total)',
    features: ['23 Presets', 'All Bundles', 'Mobile Compatible', 'Save $5'],
    image: '/api/placeholder/200/200'
  }
};

export default function CheckoutPage() {
  const [location] = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const productId = location.split('/checkout/')[1];
  const product = products[productId as keyof typeof products];

  useEffect(() => {
    if (!product) {
      setError("Product not found");
      setIsLoading(false);
      return;
    }

    // Create Stripe checkout session for direct redirect
    fetch(`/api/checkout/${productId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        productId: productId,
        productName: product.name,
        amount: product.price * 100 // Convert to cents
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.url) {
          // Redirect to Stripe checkout
          window.location.href = data.url;
        } else if (data.sessionId) {
          // Alternative: use sessionId if URL not provided
          const stripe = window.Stripe ? window.Stripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY) : null;
          if (stripe) {
            stripe.redirectToCheckout({ sessionId: data.sessionId });
          } else {
            setError("Stripe not loaded");
          }
        } else {
          setError("Failed to create checkout session");
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Checkout error:', err);
        setError("Failed to initialize checkout");
        setIsLoading(false);
      });
  }, [productId, product]);

  if (!product) {
    return (
      <div className="min-h-screen bg-[#F1F1F1] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-normal mb-4 text-[#171719]" style={{ fontFamily: 'Cormorant Garamond' }}>Product Not Found</h1>
          <Button 
            onClick={() => window.history.back()}
            className="bg-[#171719] text-white hover:bg-white hover:text-[#171719] border-2 border-[#171719] font-light px-8 py-3"
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F1F1F1] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#171719] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F1F1F1] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-normal mb-4 text-[#171719]" style={{ fontFamily: 'Cormorant Garamond' }}>Payment Error</h1>
          <p className="text-[#4C4B4B] mb-4 font-light">{error}</p>
          <Button 
            onClick={() => window.history.back()}
            className="bg-[#171719] text-white hover:bg-white hover:text-[#171719] border-2 border-[#171719] font-light px-8 py-3"
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F1F1F1] font-light">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          
          {/* Left Side - Trust Badge Placeholder */}
          <div className="flex flex-col items-center justify-center">
            <div className="w-80 h-96 bg-white border border-[#B5B5B3] flex items-center justify-center mb-8">
              <div className="text-center text-[#4C4B4B]">
                <div className="w-16 h-16 bg-[#B5B5B3] rounded-full mx-auto mb-4"></div>
                <p className="font-light">Secure Checkout</p>
                <p className="text-sm">256-bit SSL Encrypted</p>
              </div>
            </div>
            
            <div className="text-center text-[#4C4B4B] space-y-2">
              <p className="font-light">30-day money-back guarantee</p>
              <p className="font-light">Instant access after purchase</p>
              <p className="font-light">Powered by Stripe</p>
            </div>
          </div>

          {/* Right Side - Checkout Form */}
          <div className="bg-white border border-[#B5B5B3] p-12">
            <div className="text-center mb-12">
              <h1 className="text-4xl mb-4 text-[#171719]" style={{ fontFamily: 'Cormorant Garamond' }}>
                Complete Your Order
              </h1>
              <div className="w-16 h-0.5 bg-[#B5B5B3] mx-auto"></div>
            </div>
            
            <div className="text-center mb-12">
              <h2 className="text-2xl mb-4 text-[#171719]" style={{ fontFamily: 'Cormorant Garamond' }}>
                {product.name}
              </h2>
              <p className="text-[#4C4B4B] mb-6 font-light leading-relaxed">
                {product.description}
              </p>
              <div className="text-5xl font-normal text-[#171719] mb-8" style={{ fontFamily: 'Cormorant Garamond' }}>
                ${product.price}
              </div>
            </div>

            <div className="space-y-4 mb-12">
              <h3 className="text-lg text-[#171719] font-light mb-6" style={{ fontFamily: 'Cormorant Garamond' }}>
                What's Included:
              </h3>
              {product.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-2 h-2 bg-[#171719]"></div>
                  <span className="text-[#4C4B4B] font-light">{feature}</span>
                </div>
              ))}
            </div>

            <div className="text-center">
              <div className="w-8 h-8 border-4 border-[#171719] border-t-transparent animate-spin mx-auto mb-4" />
              <p className="text-[#4C4B4B] font-light">Redirecting to secure checkout...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
