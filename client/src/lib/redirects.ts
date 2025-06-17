// /lib/redirects.ts
// Comprehensive redirect system for SELFIE AI™ v4

import { ROUTES } from '@/constants/routes';

export interface RedirectRule {
  from: string | RegExp;
  to: string | ((match: RegExpMatchArray) => string);
  permanent: boolean;
}

export const redirectMap: RedirectRule[] = [
  // ============================================
  // DEVELOPMENT ROUTES (Remove in production)
  // ============================================
  { from: '/dev-login', to: ROUTES.AUTH.LOGIN, permanent: true },
  { from: '/test-login', to: ROUTES.AUTH.LOGIN, permanent: true },
  { from: '/test-email', to: ROUTES.DASHBOARD, permanent: true },
  { from: '/dev-tools', to: ROUTES.TOOLS.HOME, permanent: true },
  { from: '/DevAuth', to: ROUTES.AUTH.LOGIN, permanent: true },

  // ============================================
  // AUTHENTICATION CONSOLIDATION
  // ============================================
  { from: '/signin', to: ROUTES.AUTH.LOGIN, permanent: true },
  { from: '/log-in', to: ROUTES.AUTH.LOGIN, permanent: true },
  { from: '/sign-up', to: ROUTES.AUTH.SIGNUP, permanent: true },
  { from: '/register', to: ROUTES.AUTH.SIGNUP, permanent: true },
  { from: '/forgot-password', to: ROUTES.AUTH.RESET_PASSWORD, permanent: true },

  // ============================================
  // COURSE ROUTES - STARTER KIT
  // ============================================
  // Module number variations
  { from: '/module1', to: ROUTES.LEARN.STARTER_KIT.MODULE(1), permanent: true },
  { from: '/module2', to: ROUTES.LEARN.STARTER_KIT.MODULE(2), permanent: true },
  { from: '/module3', to: ROUTES.LEARN.STARTER_KIT.MODULE(3), permanent: true },
  { from: '/module4', to: ROUTES.LEARN.STARTER_KIT.MODULE(4), permanent: true },
  { from: '/module5', to: ROUTES.LEARN.STARTER_KIT.MODULE(5), permanent: true },
  { from: '/module6', to: ROUTES.LEARN.STARTER_KIT.MODULE(6), permanent: true },
  { from: '/module7', to: ROUTES.LEARN.STARTER_KIT.MODULE(7), permanent: true },
  { from: '/module8', to: ROUTES.LEARN.STARTER_KIT.MODULE(8), permanent: true },
  { from: '/module9', to: ROUTES.LEARN.STARTER_KIT.MODULE(9), permanent: true },
  { from: '/module10', to: ROUTES.LEARN.STARTER_KIT.MODULE(10), permanent: true },
  { from: '/module11', to: ROUTES.LEARN.STARTER_KIT.MODULE(11), permanent: true },
  { from: '/module12', to: ROUTES.LEARN.STARTER_KIT.MODULE(12), permanent: true },
  
  // Module path variations
  { from: '/module/1', to: ROUTES.LEARN.STARTER_KIT.MODULE(1), permanent: true },
  { from: '/module/2', to: ROUTES.LEARN.STARTER_KIT.MODULE(2), permanent: true },
  { from: '/module/3', to: ROUTES.LEARN.STARTER_KIT.MODULE(3), permanent: true },
  { from: '/module/4', to: ROUTES.LEARN.STARTER_KIT.MODULE(4), permanent: true },
  { from: '/module/5', to: ROUTES.LEARN.STARTER_KIT.MODULE(5), permanent: true },
  { from: '/module/6', to: ROUTES.LEARN.STARTER_KIT.MODULE(6), permanent: true },
  { from: '/module/7', to: ROUTES.LEARN.STARTER_KIT.MODULE(7), permanent: true },
  { from: '/module/8', to: ROUTES.LEARN.STARTER_KIT.MODULE(8), permanent: true },
  { from: '/module/9', to: ROUTES.LEARN.STARTER_KIT.MODULE(9), permanent: true },
  { from: '/module/10', to: ROUTES.LEARN.STARTER_KIT.MODULE(10), permanent: true },
  { from: '/module/11', to: ROUTES.LEARN.STARTER_KIT.MODULE(11), permanent: true },
  { from: '/module/12', to: ROUTES.LEARN.STARTER_KIT.MODULE(12), permanent: true },

  // Module hyphen variations
  { from: '/module-one', to: ROUTES.LEARN.STARTER_KIT.MODULE(1), permanent: true },
  { from: '/module-two', to: ROUTES.LEARN.STARTER_KIT.MODULE(2), permanent: true },
  { from: '/module-three', to: ROUTES.LEARN.STARTER_KIT.MODULE(3), permanent: true },
  { from: '/module-four', to: ROUTES.LEARN.STARTER_KIT.MODULE(4), permanent: true },
  { from: '/module-five', to: ROUTES.LEARN.STARTER_KIT.MODULE(5), permanent: true },
  { from: '/module-six', to: ROUTES.LEARN.STARTER_KIT.MODULE(6), permanent: true },
  { from: '/module-seven', to: ROUTES.LEARN.STARTER_KIT.MODULE(7), permanent: true },
  { from: '/module-eight', to: ROUTES.LEARN.STARTER_KIT.MODULE(8), permanent: true },
  { from: '/module-nine', to: ROUTES.LEARN.STARTER_KIT.MODULE(9), permanent: true },
  { from: '/module-ten', to: ROUTES.LEARN.STARTER_KIT.MODULE(10), permanent: true },
  { from: '/module-eleven', to: ROUTES.LEARN.STARTER_KIT.MODULE(11), permanent: true },
  { from: '/module-twelve', to: ROUTES.LEARN.STARTER_KIT.MODULE(12), permanent: true },

  // Course hub variations
  { from: '/starter-kit-course', to: ROUTES.LEARN.STARTER_KIT.HOME, permanent: true },
  { from: '/starter-kit', to: ROUTES.PRODUCTS.STARTER_KIT, permanent: true },
  { from: '/90-day-starter', to: ROUTES.PRODUCTS.STARTER_KIT, permanent: true },
  { from: '/course/starter-kit', to: ROUTES.LEARN.STARTER_KIT.HOME, permanent: true },
  { from: '/courses/starter-kit', to: ROUTES.LEARN.STARTER_KIT.HOME, permanent: true },

  // ============================================
  // COURSE ROUTES - BRANDED BY YOU
  // ============================================
  // Blueprint variations (old naming)
  { from: '/blueprint', to: ROUTES.LEARN.BRANDED.HOME, permanent: true },
  { from: '/blueprint/module-one', to: ROUTES.LEARN.BRANDED.MODULE(1), permanent: true },
  { from: '/blueprint/module-two', to: ROUTES.LEARN.BRANDED.MODULE(2), permanent: true },
  { from: '/blueprint/module-three', to: ROUTES.LEARN.BRANDED.MODULE(3), permanent: true },
  { from: '/blueprint/module-four', to: ROUTES.LEARN.BRANDED.MODULE(4), permanent: true },
  { from: '/blueprint/module-five', to: ROUTES.LEARN.BRANDED.MODULE(5), permanent: true },
  { from: '/blueprint/module-six', to: ROUTES.LEARN.BRANDED.MODULE(6), permanent: true },
  { from: '/blueprint/module-seven', to: ROUTES.LEARN.BRANDED.MODULE(7), permanent: true },
  { from: '/blueprint/module-eight', to: ROUTES.LEARN.BRANDED.MODULE(8), permanent: true },
  
  // Branded course variations
  { from: '/branded-by-you', to: ROUTES.PRODUCTS.BRANDED, permanent: true },
  { from: '/personal-brand-blueprint', to: ROUTES.PRODUCTS.BRANDED, permanent: true },
  { from: '/course/branded', to: ROUTES.LEARN.BRANDED.HOME, permanent: true },
  { from: '/courses/branded', to: ROUTES.LEARN.BRANDED.HOME, permanent: true },

  // ============================================
  // COURSE ROUTES - VIP
  // ============================================
  { from: '/vip-coaching', to: ROUTES.PRODUCTS.VIP, permanent: true },
  { from: '/1-on-1-coaching', to: ROUTES.PRODUCTS.VIP, permanent: true },
  { from: '/vip-program', to: ROUTES.PRODUCTS.VIP, permanent: true },
  { from: '/course/vip', to: ROUTES.LEARN.VIP.HOME, permanent: true },

  // ============================================
  // TOOL ROUTES
  // ============================================
  // Selfie Studio variations
  { from: '/selfie-coach', to: ROUTES.TOOLS.STUDIO, permanent: true },
  { from: '/pose-coach', to: ROUTES.TOOLS.STUDIO, permanent: true },
  { from: '/selfie-studio', to: ROUTES.TOOLS.STUDIO, permanent: true },
  { from: '/photo-coach', to: ROUTES.TOOLS.STUDIO, permanent: true },
  
  // AI Tools variations
  { from: '/ai-tools', to: ROUTES.TOOLS.HOME, permanent: true },
  { from: '/sandra-ai', to: ROUTES.TOOLS.SANDRA_AI, permanent: true },
  { from: '/ai-assistant', to: ROUTES.TOOLS.SANDRA_AI, permanent: true },
  { from: '/chat', to: ROUTES.TOOLS.SANDRA_AI, permanent: true },
  
  // Brand tools
  { from: '/brand-studio', to: ROUTES.TOOLS.BRAND_KIT, permanent: true },
  { from: '/brand-builder', to: ROUTES.TOOLS.BRAND_KIT, permanent: true },
  { from: '/brand-kit-generator', to: ROUTES.TOOLS.BRAND_KIT, permanent: true },
  
  // Calendar variations
  { from: '/content-calendar', to: ROUTES.TOOLS.CALENDAR, permanent: true },
  { from: '/social-calendar', to: ROUTES.TOOLS.CALENDAR, permanent: true },
  { from: '/planning', to: ROUTES.TOOLS.CALENDAR, permanent: true },

  // Caption writer
  { from: '/caption-generator', to: ROUTES.TOOLS.CAPTION_WRITER, permanent: true },
  { from: '/ai-captions', to: ROUTES.TOOLS.CAPTION_WRITER, permanent: true },
  { from: '/write-captions', to: ROUTES.TOOLS.CAPTION_WRITER, permanent: true },

  // ============================================
  // PRODUCT/SALES PAGES
  // ============================================
  { from: '/pricing', to: ROUTES.PRODUCTS.HOME, permanent: true },
  { from: '/packages', to: ROUTES.PRODUCTS.HOME, permanent: true },
  { from: '/offers', to: ROUTES.PRODUCTS.HOME, permanent: true },
  { from: '/shop', to: ROUTES.PRODUCTS.HOME, permanent: true },
  { from: '/store', to: ROUTES.PRODUCTS.HOME, permanent: true },
  { from: '/all-access-pass', to: ROUTES.PRODUCTS.ALL_ACCESS, permanent: true },
  { from: '/bundle', to: ROUTES.PRODUCTS.ALL_ACCESS, permanent: true },

  // ============================================
  // DASHBOARD & PROFILE
  // ============================================
  { from: '/home', to: ROUTES.DASHBOARD, permanent: true },
  { from: '/my-account', to: ROUTES.PROFILE.HOME, permanent: true },
  { from: '/account', to: ROUTES.PROFILE.HOME, permanent: true },
  { from: '/settings', to: ROUTES.PROFILE.HOME, permanent: true },
  { from: '/billing', to: ROUTES.PROFILE.BILLING, permanent: true },
  { from: '/subscription', to: ROUTES.PROFILE.BILLING, permanent: true },
  { from: '/my-courses', to: ROUTES.LEARN.HOME, permanent: true },
  { from: '/my-tools', to: ROUTES.TOOLS.HOME, permanent: true },

  // ============================================
  // GENERAL PAGES
  // ============================================
  { from: '/get-started', to: ROUTES.PRODUCTS.HOME, permanent: true },
  { from: '/start-here', to: ROUTES.PRODUCTS.HOME, permanent: true },
  { from: '/about-sandra', to: ROUTES.ABOUT, permanent: true },
  { from: '/story', to: ROUTES.ABOUT, permanent: true },
  { from: '/success-stories', to: ROUTES.TESTIMONIALS, permanent: true },
  { from: '/reviews', to: ROUTES.TESTIMONIALS, permanent: true },
  { from: '/free-resources', to: ROUTES.RESOURCES, permanent: true },
  { from: '/downloads', to: ROUTES.RESOURCES, permanent: true },

  // ============================================
  // LEGAL PAGES
  // ============================================
  { from: '/privacy-policy', to: ROUTES.LEGAL.PRIVACY, permanent: true },
  { from: '/terms-of-service', to: ROUTES.LEGAL.TERMS, permanent: true },
  { from: '/tos', to: ROUTES.LEGAL.TERMS, permanent: true },
  { from: '/refunds', to: ROUTES.LEGAL.REFUND_POLICY, permanent: true },
  { from: '/affiliate', to: ROUTES.LEGAL.AFFILIATE_TERMS, permanent: true },

  // ============================================
  // CATCH-ALL PATTERNS (using regex)
  // ============================================
  {
    from: /^\/course\/(.+)$/,
    to: (match) => `/learn/${match[1]}`,
    permanent: true
  },
  {
    from: /^\/module-(\d+)$/,
    to: (match) => ROUTES.LEARN.STARTER_KIT.MODULE(match[1]),
    permanent: true
  },
  {
    from: /^\/tool\/(.+)$/,
    to: (match) => `/tools/${match[1]}`,
    permanent: true
  }
];

/**
 * Apply redirect rules to a given path
 */
export function applyRedirect(path: string): string | null {
  for (const rule of redirectMap) {
    if (typeof rule.from === 'string') {
      if (path === rule.from) {
        return typeof rule.to === 'string' ? rule.to : rule.to([] as any);
      }
    } else if (rule.from instanceof RegExp) {
      const match = path.match(rule.from);
      if (match) {
        return typeof rule.to === 'string' ? rule.to : rule.to(match);
      }
    }
  }
  return null;
}

/**
 * Middleware to handle redirects (for Next.js or custom implementation)
 */
export function redirectMiddleware(
  pathname: string,
  redirect: (url: string, permanent?: boolean) => void
): boolean {
  const redirectTo = applyRedirect(pathname);
  if (redirectTo) {
    const rule = redirectMap.find(r => {
      if (typeof r.from === 'string') return r.from === pathname;
      if (r.from instanceof RegExp) return r.from.test(pathname);
      return false;
    });
    redirect(redirectTo, rule?.permanent);
    return true;
  }
  return false;
}

/**
 * Generate a Next.js compatible redirects configuration
 */
export function generateNextRedirects() {
  return redirectMap
    .filter(rule => typeof rule.from === 'string' && typeof rule.to === 'string')
    .map(rule => ({
      source: rule.from as string,
      destination: rule.to as string,
      permanent: rule.permanent,
    }));
}

/**
 * Log redirect for analytics
 */
export async function logRedirect(from: string, to: string) {
  if (typeof window !== 'undefined') {
    // Only log in browser environment
    try {
      // You can send this to your analytics service
      console.log(`Redirect: ${from} → ${to}`);
      
      // Example: Send to Google Analytics
      if (typeof gtag !== 'undefined') {
        gtag('event', 'redirect', {
          event_category: 'navigation',
          event_label: `${from} → ${to}`,
        });
      }
    } catch (error) {
      console.error('Failed to log redirect:', error);
    }
  }
}

/**
 * Test all redirects (development utility)
 */
export function testAllRedirects(): { passed: number; failed: number; results: any[] } {
  const results: any[] = [];
  let passed = 0;
  let failed = 0;

  redirectMap.forEach((rule, index) => {
    try {
      if (typeof rule.from === 'string') {
        const result = applyRedirect(rule.from);
        const expected = typeof rule.to === 'string' ? rule.to : 'function';
        
        if (result) {
          passed++;
          results.push({
            index,
            from: rule.from,
            to: result,
            status: 'PASS'
          });
        } else {
          failed++;
          results.push({
            index,
            from: rule.from,
            expected,
            status: 'FAIL',
            error: 'No redirect applied'
          });
        }
      } else {
        // Test regex patterns with sample URLs
        const testCases = [
          '/course/test',
          '/module-5',
          '/tool/test-tool'
        ];
        
        testCases.forEach(testCase => {
          if (rule.from.test(testCase)) {
            const result = applyRedirect(testCase);
            if (result) {
              passed++;
              results.push({
                index,
                from: testCase,
                to: result,
                pattern: rule.from.toString(),
                status: 'PASS'
              });
            }
          }
        });
      }
    } catch (error) {
      failed++;
      results.push({
        index,
        from: rule.from,
        status: 'ERROR',
        error: error.message
      });
    }
  });

  return { passed, failed, results };
}