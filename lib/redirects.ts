// /lib/redirects.ts
// Comprehensive redirect system for SELFIE AI™ v4

import { ROUTES } from './constants/routes';

export interface RedirectRule {
  from: string | RegExp;
  to: string | ((match: RegExpMatchArray) => string);
  permanent: boolean;
  description: string;
}

/**
 * Redirect rules for old routes to new structure
 * These ensure SEO preservation and user experience
 */
export const REDIRECT_RULES: RedirectRule[] = [
  // Old module routes to new learn structure
  {
    from: /^\/module-one$/i,
    to: ROUTES.LEARN.STARTER_KIT.MODULE(1),
    permanent: true,
    description: 'Module One to Starter Kit Module 1'
  },
  {
    from: /^\/module-two$/i,
    to: ROUTES.LEARN.STARTER_KIT.MODULE(2),
    permanent: true,
    description: 'Module Two to Starter Kit Module 2'
  },
  {
    from: /^\/module-three$/i,
    to: ROUTES.LEARN.STARTER_KIT.MODULE(3),
    permanent: true,
    description: 'Module Three to Starter Kit Module 3'
  },
  {
    from: /^\/module\/(\d+)$/i,
    to: (match) => ROUTES.LEARN.STARTER_KIT.MODULE(match[1]),
    permanent: true,
    description: 'Module routes to Starter Kit modules'
  },
  {
    from: /^\/blueprint\/module-one$/i,
    to: ROUTES.LEARN.STARTER_KIT.MODULE(1),
    permanent: true,
    description: 'Blueprint module-one to Starter Kit Module 1'
  },
  
  // Old course routes
  {
    from: /^\/starter-kit-course$/i,
    to: ROUTES.LEARN.STARTER_KIT.HOME,
    permanent: true,
    description: 'Starter Kit Course to Starter Kit Hub'
  },
  {
    from: /^\/branded-course$/i,
    to: ROUTES.LEARN.BRANDED.HOME,
    permanent: true,
    description: 'Branded Course to Branded Hub'
  },
  {
    from: /^\/vip-course$/i,
    to: ROUTES.LEARN.VIP.HOME,
    permanent: true,
    description: 'VIP Course to VIP Portal'
  },
  
  // Old auth routes
  {
    from: /^\/dev-login$/i,
    to: ROUTES.AUTH.LOGIN,
    permanent: true,
    description: 'Dev login to standard login'
  },
  {
    from: /^\/dev-auth$/i,
    to: ROUTES.AUTH.LOGIN,
    permanent: true,
    description: 'Dev auth to standard login'
  },
  {
    from: /^\/test-login$/i,
    to: ROUTES.AUTH.LOGIN,
    permanent: true,
    description: 'Test login to standard login'
  },
  {
    from: /^\/admin-login$/i,
    to: ROUTES.AUTH.LOGIN,
    permanent: true,
    description: 'Admin login to standard login'
  },
  
  // Old dashboard routes
  {
    from: /^\/admin-dashboard$/i,
    to: ROUTES.DASHBOARD,
    permanent: true,
    description: 'Admin dashboard to main dashboard'
  },
  {
    from: /^\/dashboard-dev$/i,
    to: ROUTES.DASHBOARD,
    permanent: true,
    description: 'Dev dashboard to main dashboard'
  },
  
  // Old studio routes
  {
    from: /^\/studio$/i,
    to: ROUTES.TOOLS.STUDIO,
    permanent: true,
    description: 'Studio to Tools Studio'
  },
  {
    from: /^\/sandra-ai$/i,
    to: ROUTES.TOOLS.SANDRA_AI,
    permanent: true,
    description: 'Sandra AI to Tools Sandra AI'
  },
  
  // Old product routes
  {
    from: /^\/starter-kit$/i,
    to: ROUTES.PRODUCTS.STARTER_KIT,
    permanent: true,
    description: 'Starter Kit to Products Starter Kit'
  },
  {
    from: /^\/branded-by-selfie$/i,
    to: ROUTES.PRODUCTS.BRANDED,
    permanent: true,
    description: 'Branded by Selfie to Products Branded'
  },
  {
    from: /^\/vip-brand-builder$/i,
    to: ROUTES.PRODUCTS.VIP,
    permanent: true,
    description: 'VIP Brand Builder to Products VIP'
  },
  
  // Old freebie routes
  {
    from: /^\/selfie-guide$/i,
    to: '/freebie/selfie-guide',
    permanent: true,
    description: 'Selfie Guide to Freebie Selfie Guide'
  },
  
  // Old checkout routes
  {
    from: /^\/checkout-page$/i,
    to: ROUTES.CHECKOUT.HOME,
    permanent: true,
    description: 'Checkout Page to Checkout Home'
  },
  
  // Old thank you routes
  {
    from: /^\/thank-you-page$/i,
    to: ROUTES.CHECKOUT.SUCCESS,
    permanent: true,
    description: 'Thank You Page to Checkout Success'
  },
  {
    from: /^\/vip-thank-you$/i,
    to: ROUTES.CHECKOUT.SUCCESS,
    permanent: true,
    description: 'VIP Thank You to Checkout Success'
  }
];

/**
 * Apply redirects based on current pathname
 * Returns the target URL if a redirect is needed, null otherwise
 */
export function applyRedirect(pathname: string): string | null {
  for (const rule of REDIRECT_RULES) {
    if (typeof rule.from === 'string') {
      if (pathname.toLowerCase() === rule.from.toLowerCase()) {
        return typeof rule.to === 'string' ? rule.to : rule.to(['' as any]);
      }
    } else {
      const match = pathname.match(rule.from);
      if (match) {
        return typeof rule.to === 'string' ? rule.to : rule.to(match);
      }
    }
  }
  return null;
}

/**
 * Get all redirect rules for debugging or documentation
 */
export function getAllRedirects(): RedirectRule[] {
  return REDIRECT_RULES;
}

/**
 * Check if a path should be redirected
 */
export function shouldRedirect(pathname: string): boolean {
  return applyRedirect(pathname) !== null;
}

/**
 * Get redirect target for a given path
 */
export function getRedirectTarget(pathname: string): string | null {
  return applyRedirect(pathname);
} 