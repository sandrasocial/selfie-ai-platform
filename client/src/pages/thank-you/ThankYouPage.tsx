import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';

interface CourseAccess {
  title: string;
  description: string;
  courseUrl: string;
}

interface Download {
  name: string;
  url: string;
}

interface Upsell {
  title: string;
  description: string;
  productName: string;
  productUrl: string;
  price: number;
}

interface Product {
  name: string;
  welcomeTitle: string;
  description: string;
  courseAccess?: CourseAccess;
  downloads?: Download[];
  upsell?: Upsell;
}

const products: Record<string, Product> = {
  'starter-kit': {
    name: 'Selfie Starter Kit',
    welcomeTitle: 'You\'re In!',
    description: 'You\'ve successfully purchased the Selfie Starter Kit',
    courseAccess: {
      title: 'Access Your Course',
      description: 'Start your transformation with expert video lessons and downloadable resources',
      courseUrl: '/course/starter-kit'
    },
    upsell: {
      title: 'Ready to Take Your Brand to the Next Level?',
      description: 'Transform your entire personal brand with our complete program',
      productName: 'Branded By Selfie™',
      productUrl: '/products/branded-by-selfie',
      price: 397
    }
  },
  'branded-by-selfie': {
    name: 'Branded by Selfie™',
    welcomeTitle: 'You\'re In!',
    description: 'You\'ve successfully purchased Branded by Selfie™',
    courseAccess: {
      title: 'Enter Your Premium Course',
      description: 'Access all lessons across Confidence, Clarity, and Content modules',
      courseUrl: '/course/branded-by-selfie'
    }
  },
  'branded': {
    name: 'Branded by Selfie™',
    welcomeTitle: 'You\'re In!',
    description: 'You\'ve successfully purchased Branded by Selfie™',
    courseAccess: {
      title: 'Enter Your Premium Course',
      description: 'Access all lessons across Confidence, Clarity, and Content modules',
      courseUrl: '/course/branded-by-selfie'
    }
  },
  'preset-bare': {
    name: 'Bare Bundle Presets',
    welcomeTitle: 'You\'re In!',
    description: 'You\'ve successfully purchased the Bare Bundle Presets',
    downloads: [
      { name: 'Bare Bundle Presets (.dng)', url: '/downloads/bare-bundle.zip' },
      { name: 'Installation Tutorial', url: '/downloads/preset-tutorial.pdf' }
    ],
    upsell: {
      title: 'Want Content to Match Your New Aesthetic?',
      description: 'Get the templates and strategies to create scroll-stopping content',
      productName: 'The Selfie Starter Kit',
      productUrl: '/products/starter-kit',
      price: 47
    }
  },
  'preset-glow': {
    name: 'Glow Bundle Presets',
    welcomeTitle: 'You\'re In!',
    description: 'You\'ve successfully purchased the Glow Bundle Presets',
    downloads: [
      { name: 'Glow Bundle Presets (.dng)', url: '/downloads/glow-bundle.zip' },
      { name: 'Installation Tutorial', url: '/downloads/preset-tutorial.pdf' }
    ],
    upsell: {
      title: 'Want Content to Match Your New Aesthetic?',
      description: 'Get the templates and strategies to create scroll-stopping content',
      productName: 'The Selfie Starter Kit',
      productUrl: '/products/starter-kit',
      price: 47
    }
  },
  'preset-skin': {
    name: 'Skin Bundle Presets',
    welcomeTitle: 'You\'re In!',
    description: 'You\'ve successfully purchased the Skin Bundle Presets',
    downloads: [
      { name: 'Skin Bundle Presets (.dng)', url: '/downloads/skin-bundle.zip' },
      { name: 'Installation Tutorial', url: '/downloads/preset-tutorial.pdf' }
    ],
    upsell: {
      title: 'Want Content to Match Your New Aesthetic?',
      description: 'Get the templates and strategies to create scroll-stopping content',
      productName: 'The Selfie Starter Kit',
      productUrl: '/products/starter-kit',
      price: 47
    }
  },
  'preset-selfie-glow': {
    name: 'Selfie Glow-Up Bundle',
    welcomeTitle: 'You\'re In!',
    description: 'You\'ve successfully purchased the Selfie Glow-Up Bundle',
    downloads: [
      { name: 'Selfie Glow-Up Presets (.dng)', url: '/downloads/selfie-glow-bundle.zip' },
      { name: 'Bonus Editing Guide', url: '/downloads/editing-guide.pdf' },
      { name: 'Installation Tutorial', url: '/downloads/preset-tutorial.pdf' }
    ],
    upsell: {
      title: 'Want Content to Match Your New Aesthetic?',
      description: 'Get the templates and strategies to create scroll-stopping content',
      productName: 'The Selfie Starter Kit',
      productUrl: '/products/starter-kit',
      price: 47
    }
  },
  'preset-bundle-all': {
    name: 'Complete Preset Collection',
    welcomeTitle: 'You\'re In!',
    description: 'You\'ve successfully purchased the Complete Preset Collection',
    downloads: [
      { name: 'Complete Preset Collection (.dng)', url: '/downloads/complete-collection.zip' },
      { name: 'All Bonus Guides', url: '/downloads/all-guides.zip' },
      { name: 'Installation Tutorial', url: '/downloads/preset-tutorial.pdf' }
    ],
    upsell: {
      title: 'Ready to Start Your AI Journey?',
      description: 'Join thousands using AI-powered content creation',
      productName: 'Free SELFIE AI Account',
      productUrl: '/signup',
      price: 0
    }
  }
};

export default function ThankYouPage() {
  const [location] = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  const productId = location.split('/thank-you/')[1];
  const product: Product | undefined = products[productId];

  useEffect(() => {
    // Simulate loading time for downloads preparation
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (!product) {
    return (
      <div className="min-h-screen bg-[#F1F1F1] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-normal mb-4 text-[#171719]" style={{ fontFamily: 'Cormorant Garamond' }}>Thank You!</h1>
          <p className="text-[#4C4B4B] font-light" style={{ fontFamily: 'Neue Einstellung' }}>Your purchase has been confirmed.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F1F1F1] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#171719] border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-lg text-[#171719] font-light" style={{ fontFamily: 'Neue Einstellung' }}>Preparing your access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F1F1F1]">
      {/* Success Header */}
      <section className="px-6 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="w-16 h-16 bg-[#171719] flex items-center justify-center mx-auto mb-6">
            <div className="w-8 h-8 bg-white" />
          </div>
          <h1 className="text-4xl lg:text-5xl mb-4 text-[#171719]" style={{ fontFamily: 'Cormorant Garamond', fontWeight: 400 }}>
            {product.welcomeTitle}
          </h1>
          <p className="text-xl text-[#4C4B4B] font-light" style={{ fontFamily: 'Neue Einstellung' }}>
            {product.description}
          </p>
        </div>
      </section>

      {/* Course Access - Priority Section */}
      {product.courseAccess && (
        <section className="px-6 py-16 bg-[#171719] text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl mb-6 text-white" style={{ fontFamily: 'Cormorant Garamond', fontWeight: 400 }}>
              {product.courseAccess.title}
            </h2>
            <p className="text-xl text-[#B5B5B3] mb-8 font-light" style={{ fontFamily: 'Neue Einstellung' }}>
              {product.courseAccess.description}
            </p>
            <Button 
              asChild 
              className="bg-white text-[#171719] hover:bg-[#171719] hover:text-white border-2 border-white font-light text-lg px-12 py-6 uppercase tracking-wide transition-all duration-300"
              style={{ fontFamily: 'Neue Einstellung' }}
            >
              <a href={product.courseAccess.courseUrl}>
                Start Your Course Now
              </a>
            </Button>
          </div>
        </section>
      )}

      {/* Downloads */}
      {product.downloads && product.downloads.length > 0 && (
        <section className="px-6 py-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl text-center mb-12 text-[#171719]" style={{ fontFamily: 'Cormorant Garamond', fontWeight: 400 }}>
              Your Downloads Are Ready
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {product.downloads.map((download, index) => (
                <div key={index} className="bg-white border border-[#B5B5B3] p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#171719] flex items-center justify-center">
                      <div className="w-6 h-6 bg-white" />
                    </div>
                    <div>
                      <h3 className="font-normal text-[#171719]" style={{ fontFamily: 'Neue Einstellung' }}>{download.name}</h3>
                      <p className="text-[#4C4B4B] text-sm font-light" style={{ fontFamily: 'Neue Einstellung' }}>Ready for download</p>
                    </div>
                  </div>
                  <Button 
                    asChild
                    className="bg-[#171719] text-white hover:bg-white hover:text-[#171719] border-2 border-[#171719] font-light uppercase tracking-wide transition-all duration-300"
                    style={{ fontFamily: 'Neue Einstellung' }}
                  >
                    <a href={download.url} download>
                      Download
                    </a>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Upsell */}
      {product.upsell && (
        <section className="px-6 py-16 bg-[#171719] text-white">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl mb-6 text-white" style={{ fontFamily: 'Cormorant Garamond', fontWeight: 400 }}>
              {product.upsell.title}
            </h2>
            <p className="text-xl text-[#B5B5B3] mb-8 font-light" style={{ fontFamily: 'Neue Einstellung' }}>
              {product.upsell.description}
            </p>
            <div className="mb-8">
              <div className="text-2xl font-normal mb-2 text-white" style={{ fontFamily: 'Cormorant Garamond' }}>{product.upsell.productName}</div>
              {product.upsell.price > 0 && (
                <div className="text-4xl font-normal text-white" style={{ fontFamily: 'Cormorant Garamond' }}>${product.upsell.price}</div>
              )}
            </div>
            <Button 
              asChild 
              className="bg-white text-[#171719] hover:bg-[#171719] hover:text-white border-2 border-white font-light text-lg px-12 py-6 uppercase tracking-wide transition-all duration-300"
              style={{ fontFamily: 'Neue Einstellung' }}
            >
              <a href={product.upsell.productUrl}>
                {product.upsell.price === 0 ? 'Get Started Free' : 'Learn More'}
              </a>
            </Button>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="px-6 py-12 border-t border-[#B5B5B3] bg-[#171719] text-white">
        <div className="max-w-6xl mx-auto text-center">
          <p className="font-light" style={{ fontFamily: 'Neue Einstellung' }}>© 2024 SELFIE AI™. All rights reserved.</p>
          <p className="mt-2 text-sm font-light text-[#B5B5B3]" style={{ fontFamily: 'Neue Einstellung' }}>Need help? Contact support@selfieai.com</p>
        </div>
      </footer>
    </div>
  );
}