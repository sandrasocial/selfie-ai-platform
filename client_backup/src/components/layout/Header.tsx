import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';

export default function Header() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOnHero, setIsOnHero] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  

  // Check if user is authenticated
  const { data: user } = useQuery({ queryKey: ['/api/me'], retry: false });
  const isAuthenticated = !!user;

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 80);
      setIsOnHero(scrollPosition < window.innerHeight * 0.8);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Core navigation for authenticated users
  const coreNavLinks = [
    { href: '/', label: 'HOME' },
    { href: '/dashboard', label: 'DASHBOARD' },
    { href: '/studio', label: 'STUDIO' },
    { href: '/my-account', label: 'MY ACCOUNT' },
    { href: '/courses', label: 'COURSES' }
  ];

  // Public navigation for non-authenticated users
  const publicNavLinks = [
    { href: '/', label: 'HOME' },
    { href: '/pricing', label: 'PRICING' },
    { href: '/login', label: 'LOGIN' }
  ];

  const navLinks = isAuthenticated ? coreNavLinks : publicNavLinks;

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
        isScrolled 
          ? 'bg-black/95 backdrop-blur-lg border-b border-white/10 shadow-lg' 
          : 'bg-transparent backdrop-blur-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Brand Section */}
            <Link href="/studio" className="flex items-center gap-2 transition-all duration-300">
              <div className="flex items-center space-x-3">
                {/* SS Monogram */}
                <img 
                  src="https://i.postimg.cc/L88db1fc/White-transperent-logo.png" 
                  alt="SS Logo" 
                  className="h-10"
                  onError={(e) => console.error('Monogram logo failed to load:', e.target.src)}
                />
                {/* SANDRA Text Logo */}
                <h1 className="text-white text-4xl md:text-4xl sm:text-2xl tracking-widest uppercase" style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: '100', fontStyle: 'normal' }}>
                  SANDRA.
                </h1>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-12">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="nav-link relative transition-all duration-300 hover:scale-105 uppercase tracking-wide text-sm"
                  style={{ 
                    color: '#F1F1F1',
                    fontFamily: 'Neue Einstellung, sans-serif',
                    letterSpacing: '0.1em'
                  }}
                >
                  {link.label}
                  {location === link.href && (
                    <div className="absolute -bottom-1 left-0 w-full h-px bg-white transition-all duration-300"></div>
                  )}
                </Link>
              ))}
              
              {/* Logout button for authenticated users */}
              {isAuthenticated && (
                <form action="/api/logout" method="POST" className="inline">
                  <Button 
                    type="submit"
                    className="bg-white/10 text-white hover:bg-white/20 font-medium px-6 py-2 text-sm uppercase tracking-wide transition-all duration-300 border border-white/30"
                  >
                    LOGOUT
                  </Button>
                </form>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className={`md:hidden p-2 transition-colors duration-300 ${
                isScrolled ? 'text-white hover:bg-white/10' : 'text-white hover:bg-white/10'
              }`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-black/98 backdrop-blur-xl border-t border-white/10 md:hidden">
            <div className="px-6 py-8 space-y-6">
              {navLinks.map((link, index) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block nav-link text-lg transition-all duration-300 hover:translate-x-2 uppercase tracking-wide ${
                    location === link.href ? 'opacity-100 border-l-2 border-white pl-4' : 'opacity-90'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{ 
                    color: '#F1F1F1',
                    fontFamily: 'Neue Einstellung, sans-serif',
                    letterSpacing: '0.1em',
                    animationDelay: `${index * 0.1}s`,
                    animation: 'fadeInUp 0.6s ease forwards'
                  }}
                >
                  {link.label}
                </Link>
              ))}
              
              <div className="border-t border-white/20 my-6"></div>
              
              {isAuthenticated && (
                <form action="/api/logout" method="POST" className="inline">
                  <Button 
                    type="submit"
                    className="block nav-link text-lg transition-all duration-300 hover:translate-x-2 uppercase tracking-wide bg-transparent border-none p-0 text-white"
                    onClick={() => setIsMobileMenuOpen(false)}
                    style={{ 
                      color: '#F1F1F1',
                      fontFamily: 'Neue Einstellung, sans-serif',
                      letterSpacing: '0.1em',
                      animationDelay: `${navLinks.length * 0.1}s`,
                      animation: 'fadeInUp 0.6s ease forwards'
                    }}
                  >
                    LOGOUT
                  </Button>
                </form>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}