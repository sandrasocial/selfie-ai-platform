
import React, { useState } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { ChevronUp, ChevronDown } from 'lucide-react';

// List of all routes from App.tsx (cleaned up)
const allRoutes = [
  { path: '/', label: 'Home' },
  { path: '/dashboard', label: 'Dashboard (Protected)' },
  { path: '/studio', label: 'Studio (Protected)' },
  { path: '/studio/editor', label: 'Studio Editor (Protected)' },
  { path: '/studio/feed-designer', label: 'Feed Designer (Protected)' },
  { path: '/studio/photo-vault', label: 'Photo Vault (Protected)' },
  { path: '/studio/boost', label: 'Daily Boost (Protected)' },
  { path: '/studio/notes', label: 'Brand Notes (Protected)' },
  { path: '/studio/tagger', label: 'Auto Tagger (Protected)' },
  { path: '/sandra-ai', label: 'Sandra AI (Protected)' },
  { path: '/planner', label: 'Planner (Protected)' },
  { path: '/drops', label: 'Monthly Drops (Protected)' },
  { path: '/courses', label: 'Courses (Protected)' },
  { path: '/account', label: 'My Account (Protected)' },
  { path: '/calendar', label: 'Calendar (Protected)' },
  { path: '/templates', label: 'Templates (Protected)' },
  { path: '/content-vault', label: 'Content Vault (Protected)' },
  { path: '/my-workbooks', label: 'My Workbooks (Protected)' },
  { path: '/pricing', label: 'Pricing' },
  { path: '/checkout', label: 'Checkout' },
  { path: '/offer-upsell', label: 'Offer Upsell' },
  { path: '/offer-downsell', label: 'Offer Downsell' },
  { path: '/apply', label: 'Coaching Application' },
  { path: '/privacy', label: 'Privacy' },
  { path: '/terms', label: 'Terms' },
  { path: '/courses/starter-kit', label: 'Starter Kit Course (Protected)' },
  { path: '/courses/branded', label: 'Branded by Selfie Course (Protected)' },
  { path: '/courses/vip', label: 'VIP Course (Protected)' },
  { path: '/course/viral-selfie-blueprint', label: 'Viral Selfie Blueprint (Protected)' },
  { path: '/module/1', label: 'Module 1 (Protected)' },
  { path: '/module/2', label: 'Module 2 (Protected)' },
  { path: '/module3', label: 'Module 3 (Protected)' },
  { path: '/module4', label: 'Module 4 (Protected)' },
  { path: '/module5', label: 'Module 5 (Protected)' },
  { path: '/auth/callback', label: 'Auth Callback' },
  { path: '/supabase-auth', label: 'Supabase Auth' },
  { path: '/supabase-auth/callback', label: 'Supabase Auth Callback' },
  { path: '/summer-collabs', label: 'Summer Collaborations' },
  { path: '/admin-login', label: 'Admin Login' },
  { path: '/test-login', label: 'Test Login' },
  { path: '/admin-dashboard', label: 'Admin Dashboard' },
  { path: '/dev-login', label: 'Dev Login' },
  { path: '/products/selfie-starter-kit', label: 'Selfie Starter Kit Product' },
  { path: '/products/branded-by-selfie', label: 'Branded by Selfie Product' },
  { path: '/products/presets', label: 'Preset Bundles Product' },
  { path: '/checkout/:productId', label: 'Checkout with Product ID' },
  { path: '/thank-you/:productId', label: 'Thank You with Product ID' },
  { path: '/freebie/selfie-guide', label: 'Selfie Guide Freebie' },
  { path: '/products/vip', label: 'VIP Product' },
  { path: '/thank-you/vip', label: 'VIP Thank You' },
];

export default function DevRouteAudit() {
  const [isCollapsed, setIsCollapsed] = useState(true);
  
  // Check if user has dev/admin access
  const { data: user } = useQuery({ 
    queryKey: ["/api/me"], 
    retry: false 
  });

  // Only show for specific dev users or in development environment
  const isDev = import.meta.env.DEV;
  const isDevUser = user?.email === 'test@sandra.dev' || user?.role === 'dev';
  const shouldShow = isDev || isDevUser;

  if (!shouldShow) {
    return null;
  }

  return (
    <div style={{ 
      position: 'fixed', 
      bottom: 0, 
      left: 0, 
      right: 0, 
      backgroundColor: '#f8f9fa', 
      border: '1px solid #dee2e6',
      borderBottom: 'none',
      zIndex: 9999,
      boxShadow: '0 -2px 10px rgba(0,0,0,0.1)'
    }}>
      {/* Header with toggle */}
      <div 
        style={{ 
          padding: '8px 16px', 
          backgroundColor: '#e9ecef',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '12px',
          fontWeight: 'bold',
          borderBottom: isCollapsed ? 'none' : '1px solid #dee2e6'
        }}
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <span>DEV ROUTE AUDIT ({allRoutes.length} total routes) - {user?.email || 'Dev Mode'}</span>
        {isCollapsed ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </div>

      {/* Collapsible content */}
      {!isCollapsed && (
        <div style={{ 
          padding: '12px',
          fontSize: '11px',
          maxHeight: '300px',
          overflowY: 'auto',
          backgroundColor: '#f8f9fa'
        }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
            gap: '8px' 
          }}>
            {allRoutes.map((route, index) => (
              <div key={index} style={{ 
                marginBottom: '4px',
                padding: '4px 8px',
                backgroundColor: '#fff',
                border: '1px solid #e9ecef',
                borderRadius: '4px'
              }}>
                <Link href={route.path} style={{ 
                  textDecoration: 'underline', 
                  color: '#0066cc',
                  fontWeight: '500'
                }}>
                  {route.path}
                </Link>
                <span style={{ 
                  marginLeft: '8px', 
                  color: '#6c757d',
                  fontSize: '10px'
                }}>
                  ({route.label})
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
