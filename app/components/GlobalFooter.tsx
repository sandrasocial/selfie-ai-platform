import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function GlobalFooter() {
  return (
    <footer className="bg-[#171719] text-white relative overflow-hidden">
      {/* Top Border Detail */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      {/* Background Editorial Element */}
      <div className="absolute bottom-[-50%] right-[-10%] font-lingerie text-[600px] leading-none text-white/5 rotate-[-15deg] pointer-events-none select-none z-0 hidden md:block">
        S
      </div>
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 py-20 md:py-24">
        {/* Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-16 mb-16">
          {/* Brand Column */}
          <div className="footer-brand max-w-xs">
            <Image
              src="https://i.postimg.cc/L88db1fc/White-transperent-logo.png"
              alt="SELFIE AI™"
              width={160}
              height={32}
              className="mb-6 opacity-90"
            />
            <p className="text-[15px] leading-relaxed text-white/60 mb-8">
              Your selfie is your brand. Let's make it work for you. Built for women ready to show up.
            </p>
            <div className="flex gap-4">
              <a href="https://instagram.com/sandra.social" className="w-10 h-10 border border-white/20 flex items-center justify-center transition hover:bg-white hover:border-white group" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white group-hover:text-[#171719] transition"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z"/></svg>
              </a>
              <a href="https://tiktok.com/@sandra.social" className="w-10 h-10 border border-white/20 flex items-center justify-center transition hover:bg-white hover:border-white group" aria-label="TikTok" target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white group-hover:text-[#171719] transition"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/></svg>
              </a>
              <a href="mailto:hello@sselfie.ai" className="w-10 h-10 border border-white/20 flex items-center justify-center transition hover:bg-white hover:border-white group" aria-label="Email" target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white group-hover:text-[#171719] transition"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
              </a>
            </div>
          </div>
          {/* Explore Column */}
          <div className="footer-nav flex flex-col gap-2">
            <h3 className="text-[11px] uppercase tracking-[0.2em] text-white/40 mb-2">Explore</h3>
            <Link href="/about" className="footer-link text-white/80 hover:text-white transition relative">About Sandra</Link>
            <Link href="/tools" className="footer-link text-white/80 hover:text-white transition relative">AI Tools</Link>
            <Link href="/stories" className="footer-link text-white/80 hover:text-white transition relative">Success Stories</Link>
            <Link href="/start-here" className="footer-link text-white/80 hover:text-white transition relative">Free Guide</Link>
          </div>
          {/* Programs Column */}
          <div className="footer-nav flex flex-col gap-2">
            <h3 className="text-[11px] uppercase tracking-[0.2em] text-white/40 mb-2">Programs</h3>
            <Link href="/starter-kit" className="footer-link text-white/80 hover:text-white transition relative">Selfie Starter Kit</Link>
            <Link href="/branded" className="footer-link text-white/80 hover:text-white transition relative">Branded By Selfie</Link>
            <Link href="/apply" className="footer-link text-white/80 hover:text-white transition relative">VIP Application</Link>
            <Link href="/faq" className="footer-link text-white/80 hover:text-white transition relative">FAQ</Link>
          </div>
          {/* Support Column */}
          <div className="footer-nav flex flex-col gap-2">
            <h3 className="text-[11px] uppercase tracking-[0.2em] text-white/40 mb-2">Support</h3>
            <Link href="/contact" className="footer-link text-white/80 hover:text-white transition relative">Contact</Link>
            <Link href="/login" className="footer-link text-white/80 hover:text-white transition relative">Member Login</Link>
            <Link href="/affiliates" className="footer-link text-white/80 hover:text-white transition relative">Affiliates</Link>
            <Link href="/media" className="footer-link text-white/80 hover:text-white transition relative">Press Kit</Link>
          </div>
        </div>
        {/* Footer Bottom */}
        <div className="footer-bottom pt-10 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40 tracking-wide">© 2025 SELFIE AI™ by Sandra Sigurjonsdottir. All rights reserved.</p>
          <div className="flex gap-8">
            <Link href="/privacy" className="text-xs text-white/40 hover:text-white/80 transition">Privacy Policy</Link>
            <Link href="/terms" className="text-xs text-white/40 hover:text-white/80 transition">Terms of Service</Link>
            <Link href="/cookies" className="text-xs text-white/40 hover:text-white/80 transition">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
} 