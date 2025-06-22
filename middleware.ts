import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

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
  { from: /^\/admin-login$/i, to: '/admin/login' },
  
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

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if pathname matches any redirect rules first
  for (const rule of redirectRules) {
    if (rule.from.test(pathname)) {
      const newPath = pathname.replace(rule.from, rule.to);
      const url = request.nextUrl.clone();
      url.pathname = newPath;
      
      // Return 301 permanent redirect for SEO
      return NextResponse.redirect(url, 301);
    }
  }
  
  // Admin routes protection - temporarily disabled for debugging
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    // Temporarily allow access to debug auth issues
    console.log('Admin route accessed:', pathname)
    return NextResponse.next()
    
    /* Commented out for debugging
    const res = NextResponse.next();
    const supabase = createMiddlewareClient({ req: request, res });
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        const url = request.nextUrl.clone();
        url.pathname = '/admin/login';
        return NextResponse.redirect(url);
      }
    } catch (error) {
      // If there's an error with auth, redirect to login
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }
    
    return res;
    */
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