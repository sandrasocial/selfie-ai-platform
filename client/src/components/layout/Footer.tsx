import React from 'react';
import { Link } from 'wouter';

export default function Footer() {
  return (
    <footer className="bg-[#171719] text-[#F1F1F1] py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-2xl tracking-wide" style={{ fontFamily: 'var(--font-heading)', fontWeight: 400, color: '#F1F1F1' }}>
              SELFIE AI™
            </h3>
            <p className="leading-relaxed" style={{ fontFamily: 'var(--font-body)', fontWeight: 300, color: '#F1F1F1' }}>
              Transform your selfies into strategic brand assets with our AI-powered platform.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg mb-4" style={{ fontFamily: 'var(--font-heading)', fontWeight: 400, color: '#F1F1F1' }}>
              Quick Links
            </h4>
            <div className="space-y-2">
              <Link href="/studio" className="block hover:text-[#B5B5B3] transition-colors" style={{ fontFamily: 'var(--font-body)', fontWeight: 300, color: '#F1F1F1' }}>
                Studio
              </Link>
              <Link href="/pricing" className="block hover:text-[#B5B5B3] transition-colors" style={{ fontFamily: 'var(--font-body)', fontWeight: 300, color: '#F1F1F1' }}>
                Pricing
              </Link>
              <Link href="/templates" className="block hover:text-[#B5B5B3] transition-colors" style={{ fontFamily: 'var(--font-body)', fontWeight: 300, color: '#F1F1F1' }}>
                Templates
              </Link>
              <Link href="/dashboard" className="block hover:text-[#B5B5B3] transition-colors" style={{ fontFamily: 'var(--font-body)', fontWeight: 300, color: '#F1F1F1' }}>
                Dashboard
              </Link>
            </div>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="text-lg mb-4" style={{ fontFamily: 'var(--font-heading)', fontWeight: 400, color: '#F1F1F1' }}>
              Support
            </h4>
            <div className="space-y-2">
              <Link href="/help" className="block hover:text-[#B5B5B3] transition-colors" style={{ fontFamily: 'var(--font-body)', fontWeight: 300, color: '#F1F1F1' }}>
                Help Center
              </Link>
              <Link href="/contact" className="block hover:text-[#B5B5B3] transition-colors" style={{ fontFamily: 'var(--font-body)', fontWeight: 300, color: '#F1F1F1' }}>
                Contact Us
              </Link>
              <Link href="/privacy" className="block hover:text-[#B5B5B3] transition-colors" style={{ fontFamily: 'var(--font-body)', fontWeight: 300, color: '#F1F1F1' }}>
                Privacy Policy
              </Link>
              <Link href="/terms" className="block hover:text-[#B5B5B3] transition-colors" style={{ fontFamily: 'var(--font-body)', fontWeight: 300, color: '#F1F1F1' }}>
                Terms of Service
              </Link>
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="text-lg mb-4" style={{ fontFamily: 'var(--font-heading)', fontWeight: 400, color: '#F1F1F1' }}>
              Stay Updated
            </h4>
            <p className="text-sm" style={{ fontFamily: 'var(--font-body)', fontWeight: 300, color: '#F1F1F1' }}>
              Get the latest tips and updates delivered to your inbox.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50"
                style={{ borderRadius: '0' }}
              />
              <button className="px-6 py-2 bg-white text-black hover:bg-gray-100 transition-colors" style={{ borderRadius: '0', fontFamily: 'var(--font-heading)', fontWeight: 400, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 pt-8 text-center">
          <p style={{ fontFamily: 'var(--font-body)', fontWeight: 300, color: '#F1F1F1' }}>
            © 2024 SELFIE AI™. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}