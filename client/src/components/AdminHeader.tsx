import React from 'react';
import { Link, useLocation } from "wouter";
import { Menu, X, ChevronDown } from "lucide-react";
import { useState } from "react";
import LogoutButton from './LogoutButton';

interface AdminHeaderProps {
  user?: any;
}

export default function AdminHeader({ user }: AdminHeaderProps) {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location === path;

  const navItems = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/studio", label: "AI Studio" },
    { href: "/templates", label: "Templates" },
    { href: "/calendar", label: "Calendar" },
    { href: "/courses/branded-by-selfie", label: "Course" },
    { href: "/my-workbooks", label: "Workbooks" },
  ];

  return (
    <header className="w-full border-b border-gray-100 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/dashboard">
            <div className="flex items-center">
              <img 
                src="/selfie-logo.png" 
                alt="SELFIE AI" 
                className="h-8 w-auto"
              />
              <span className="ml-2 font-['Prata'] text-xl text-[#3C3A35]">
                SELFIE AI
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <span className={`text-sm font-medium transition-colors ${
                  isActive(item.href) 
                    ? 'text-[#3C3A35] border-b-2 border-[#3C3A35] pb-1' 
                    : 'text-gray-600 hover:text-[#3C3A35]'
                }`}>
                  {item.label}
                </span>
              </Link>
            ))}
          </nav>

          {/* User Profile & Logout */}
          <div className="hidden md:flex items-center space-x-4">
            {user && (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-700">
                  {user.email || user.name || 'User'}
                </span>
                <LogoutButton />
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-600 hover:text-[#3C3A35] focus:outline-none"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <span 
                    className={`block px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive(item.href) 
                        ? 'bg-[#3C3A35] text-white' 
                        : 'text-gray-600 hover:text-[#3C3A35] hover:bg-gray-50'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </span>
                </Link>
              ))}

              {user && (
                <div className="px-4 py-2 border-t border-gray-100">
                  <p className="text-sm text-gray-700 mb-2">
                    {user.email || user.name || 'User'}
                  </p>
                  <LogoutButton />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}