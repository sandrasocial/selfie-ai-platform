import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Redirect rules for old routes to new structure
const redirectRules = [
  // Old module routes to new learn structure
  { from: /^\/module-one$/i, to: '/learn/starter-kit/1' },
  { from: /^\/module-two$/i, to: '/learn/starter-kit/2' },
  { from: /^\/module-three$/i, to: '/learn/starter-kit/3' },
  { from: /^\/module\/(\d+)$/i, to: '/learn/starter-kit/$1' },
  { from: /^\/blueprint\/module-one$/i, to: '/learn/starter-kit/1' },
  
  // Old course routes
  { from: /^\/starter-kit-course$/i, to: '/learn/starter-kit' },
  { from: /^\/branded-course$/i, to: '/learn/branded' },
  { from: /^\/vip-course$/i, to: '/learn/vip' },
  
  // Old auth routes
  { from: /^\/dev-login$/i, to: '/login' },
  { from: /^\/dev-auth$/i, to: '/login' },
  { from: /^\/test-login$/i, to: '/login' },
  { from: /^\/admin-login$/i, to: '/login' },
  
  // Old dashboard routes
  { from: /^\/admin-dashboard$/i, to: '/dashboard' },
  { from: /^\/dashboard-dev$/i, to: '/dashboard' },
  
  // Old studio routes
  { from: /^\/studio$/i, to: '/tools/studio' },
  { from: /^\/sandra-ai$/i, to: '/tools/sandra-ai' },
  
  // Old product routes
  { from: /^\/starter-kit$/i, to: '/products/starter-kit' },
  { from: /^\/branded-by-selfie$/i, to: '/products/branded' },
  { from: /^\/vip-brand-builder$/i, to: '/products/vip' },
  
  // Old freebie routes
  { from: /^\/selfie-guide$/i, to: '/freebie/selfie-guide' },
  
  // Old checkout routes
  { from: /^\/checkout-page$/i, to: '/checkout' },
  
  // Old thank you routes
  { from: /^\/thank-you-page$/i, to: '/checkout/success' },
  { from: /^\/vip-thank-you$/i, to: '/checkout/success' }
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if pathname matches any redirect rules
  for (const rule of redirectRules) {
    if (rule.from.test(pathname)) {
      const newPath = pathname.replace(rule.from, rule.to);
      const url = request.nextUrl.clone();
      url.pathname = newPath;
      
      // Return 301 permanent redirect for SEO
      return NextResponse.redirect(url, 301);
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}; 