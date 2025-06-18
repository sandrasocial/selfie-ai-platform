// /constants/routes.ts
// Centralized route constants for SELFIE AI™ v4

export const ROUTES = {
  // Home & Marketing
  HOME: '/',
  ABOUT: '/about',
  TESTIMONIALS: '/testimonials',
  COMMUNITY: '/community',
  RESOURCES: '/resources',
  CONTACT: '/contact',
  WELCOME: '/welcome',
  
  // Blog
  BLOG: {
    HOME: '/blog',
    POST: (slug: string) => `/blog/${slug}`,
  },
  
  // Products (Sales Pages)
  PRODUCTS: {
    HOME: '/products',
    STARTER_KIT: '/products/starter-kit',
    BRANDED: '/products/branded',
    VIP: '/products/vip',
    TOOLS: '/products/tools',
    ALL_ACCESS: '/products/all-access',
  },
  
  // Learning (Course Access)
  LEARN: {
    HOME: '/learn',
    STARTER_KIT: {
      HOME: '/learn/starter-kit',
      MODULE: (module: string | number) => `/learn/starter-kit/${module}`,
    },
    BRANDED: {
      HOME: '/learn/branded',
      MODULE: (module: string | number) => `/learn/branded/${module}`,
    },
    VIP: {
      HOME: '/learn/vip',
      SESSIONS: '/learn/vip/sessions',
      RECORDINGS: '/learn/vip/recordings',
      RESOURCES: '/learn/vip/resources',
    },
  },
  
  // Tools
  TOOLS: {
    HOME: '/tools',
    STUDIO: '/tools/studio',
    SANDRA_AI: '/tools/sandra-ai',
    CALENDAR: '/tools/calendar',
    CAPTION_WRITER: '/tools/caption-writer',
    BRAND_KIT: '/tools/brand-kit',
    ANALYTICS: '/tools/analytics',
  },
  
  // Account & Profile
  DASHBOARD: '/dashboard',
  PROFILE: {
    HOME: '/profile',
    EDIT: '/profile/edit',
    BILLING: '/profile/billing',
    PURCHASES: '/profile/purchases',
    CERTIFICATES: '/profile/certificates',
  },
  
  // Authentication
  AUTH: {
    LOGIN: '/login',
    SIGNUP: '/signup',
    RESET_PASSWORD: '/reset-password',
    VERIFY_EMAIL: '/verify-email',
  },
  
  // Checkout
  CHECKOUT: {
    HOME: '/checkout',
    SUCCESS: '/checkout/success',
    CANCEL: '/checkout/cancel',
  },
  
  // Legal
  LEGAL: {
    PRIVACY: '/privacy',
    TERMS: '/terms',
    REFUND_POLICY: '/refund-policy',
    AFFILIATE_TERMS: '/affiliate-terms',
  },
} as const;

// Helper function to get all routes as a flat array (useful for sitemap generation)
export function getAllRoutes(): string[] {
  const routes: string[] = [];
  
  function extractRoutes(obj: any, parentKey = '') {
    Object.entries(obj).forEach(([key, value]) => {
      if (typeof value === 'string') {
        routes.push(value);
      } else if (typeof value === 'function') {
        // Skip functions (dynamic routes)
      } else if (typeof value === 'object') {
        extractRoutes(value, key);
      }
    });
  }
  
  extractRoutes(ROUTES);
  return [...new Set(routes)]; // Remove duplicates
}

// Product IDs for purchase validation
export const PRODUCT_IDS = {
  STARTER_KIT: 'starter-kit',
  BRANDED: 'branded',
  VIP: 'vip',
  TOOLS: 'tools',
  ALL_ACCESS: 'all-access',
} as const;

// Module counts for courses
export const COURSE_MODULES = {
  STARTER_KIT: 12,
  BRANDED: 8,
} as const;

// Helper to check if a route requires authentication
export function isProtectedRoute(path: string): boolean {
  const protectedPrefixes = [
    '/learn',
    '/tools',
    '/dashboard',
    '/profile',
    '/welcome',
  ];
  
  return protectedPrefixes.some(prefix => path.startsWith(prefix));
}

// Helper to check if a route requires specific purchase
export function getRequiredPurchase(path: string): string[] | null {
  if (path.startsWith('/learn/starter-kit')) {
    return [PRODUCT_IDS.STARTER_KIT, PRODUCT_IDS.ALL_ACCESS];
  }
  
  if (path.startsWith('/learn/branded')) {
    return [PRODUCT_IDS.BRANDED, PRODUCT_IDS.ALL_ACCESS];
  }
  
  if (path.startsWith('/learn/vip')) {
    return [PRODUCT_IDS.VIP, PRODUCT_IDS.ALL_ACCESS];
  }
  
  if (path.startsWith('/tools') && path !== ROUTES.TOOLS.HOME) {
    return [PRODUCT_IDS.TOOLS, PRODUCT_IDS.ALL_ACCESS];
  }
  
  return null;
}

// Navigation menu structure
export const NAV_MENU = {
  main: [
    { label: 'Home', href: ROUTES.HOME },
    { label: 'About', href: ROUTES.ABOUT },
    { label: 'Products', href: ROUTES.PRODUCTS.HOME },
    { label: 'Blog', href: ROUTES.BLOG.HOME },
    { label: 'Testimonials', href: ROUTES.TESTIMONIALS },
    { label: 'Contact', href: ROUTES.CONTACT },
  ],
  
  dashboard: [
    { label: 'Dashboard', href: ROUTES.DASHBOARD, icon: 'home' },
    { label: 'My Courses', href: ROUTES.LEARN.HOME, icon: 'book' },
    { label: 'AI Tools', href: ROUTES.TOOLS.HOME, icon: 'wand' },
    { label: 'Profile', href: ROUTES.PROFILE.HOME, icon: 'user' },
  ],
  
  products: [
    { 
      label: '90-Day Starter Kit', 
      href: ROUTES.PRODUCTS.STARTER_KIT,
      description: 'Everything you need to build your personal brand in 90 days'
    },
    { 
      label: 'Branded By You', 
      href: ROUTES.PRODUCTS.BRANDED,
      description: 'Advanced personal branding course for entrepreneurs'
    },
    { 
      label: 'VIP Coaching', 
      href: ROUTES.PRODUCTS.VIP,
      description: '1-on-1 coaching with Sandra'
    },
    { 
      label: 'AI Tools Suite', 
      href: ROUTES.PRODUCTS.TOOLS,
      description: 'Complete toolkit for content creation'
    },
    { 
      label: 'All Access Pass', 
      href: ROUTES.PRODUCTS.ALL_ACCESS,
      description: 'Get everything - courses, tools, and VIP access'
    },
  ],
  
  footer: {
    product: [
      { label: 'All Products', href: ROUTES.PRODUCTS.HOME },
      { label: 'Starter Kit', href: ROUTES.PRODUCTS.STARTER_KIT },
      { label: 'Branded By You', href: ROUTES.PRODUCTS.BRANDED },
      { label: 'VIP Coaching', href: ROUTES.PRODUCTS.VIP },
    ],
    company: [
      { label: 'About', href: ROUTES.ABOUT },
      { label: 'Blog', href: ROUTES.BLOG.HOME },
      { label: 'Testimonials', href: ROUTES.TESTIMONIALS },
      { label: 'Contact', href: ROUTES.CONTACT },
    ],
    legal: [
      { label: 'Privacy Policy', href: ROUTES.LEGAL.PRIVACY },
      { label: 'Terms of Service', href: ROUTES.LEGAL.TERMS },
      { label: 'Refund Policy', href: ROUTES.LEGAL.REFUND_POLICY },
      { label: 'Affiliate Terms', href: ROUTES.LEGAL.AFFILIATE_TERMS },
    ],
  },
} as const;

// Breadcrumb generation helper
export function generateBreadcrumbs(pathname: string): Array<{ label: string; href: string }> {
  const breadcrumbs = [{ label: 'Home', href: ROUTES.HOME }];
  
  // Products
  if (pathname.startsWith('/products')) {
    breadcrumbs.push({ label: 'Products', href: ROUTES.PRODUCTS.HOME });
    
    if (pathname === ROUTES.PRODUCTS.STARTER_KIT) {
      breadcrumbs.push({ label: '90-Day Starter Kit', href: pathname });
    } else if (pathname === ROUTES.PRODUCTS.BRANDED) {
      breadcrumbs.push({ label: 'Branded By You', href: pathname });
    } else if (pathname === ROUTES.PRODUCTS.VIP) {
      breadcrumbs.push({ label: 'VIP Coaching', href: pathname });
    } else if (pathname === ROUTES.PRODUCTS.TOOLS) {
      breadcrumbs.push({ label: 'AI Tools', href: pathname });
    } else if (pathname === ROUTES.PRODUCTS.ALL_ACCESS) {
      breadcrumbs.push({ label: 'All Access Pass', href: pathname });
    }
  }
  
  // Learning
  else if (pathname.startsWith('/learn')) {
    breadcrumbs.push({ label: 'My Courses', href: ROUTES.LEARN.HOME });
    
    if (pathname.startsWith('/learn/starter-kit')) {
      breadcrumbs.push({ label: 'Starter Kit', href: ROUTES.LEARN.STARTER_KIT.HOME });
      
      const moduleMatch = pathname.match(/\/learn\/starter-kit\/(\d+)/);
      if (moduleMatch) {
        breadcrumbs.push({ label: `Module ${moduleMatch[1]}`, href: pathname });
      }
    } else if (pathname.startsWith('/learn/branded')) {
      breadcrumbs.push({ label: 'Branded By You', href: ROUTES.LEARN.BRANDED.HOME });
      
      const moduleMatch = pathname.match(/\/learn\/branded\/(\d+)/);
      if (moduleMatch) {
        breadcrumbs.push({ label: `Module ${moduleMatch[1]}`, href: pathname });
      }
    } else if (pathname.startsWith('/learn/vip')) {
      breadcrumbs.push({ label: 'VIP Portal', href: ROUTES.LEARN.VIP.HOME });
      
      if (pathname === ROUTES.LEARN.VIP.SESSIONS) {
        breadcrumbs.push({ label: 'Sessions', href: pathname });
      } else if (pathname === ROUTES.LEARN.VIP.RECORDINGS) {
        breadcrumbs.push({ label: 'Recordings', href: pathname });
      } else if (pathname === ROUTES.LEARN.VIP.RESOURCES) {
        breadcrumbs.push({ label: 'Resources', href: pathname });
      }
    }
  }
  
  // Tools
  else if (pathname.startsWith('/tools')) {
    breadcrumbs.push({ label: 'AI Tools', href: ROUTES.TOOLS.HOME });
    
    if (pathname === ROUTES.TOOLS.STUDIO) {
      breadcrumbs.push({ label: 'Selfie Studio', href: pathname });
    } else if (pathname === ROUTES.TOOLS.SANDRA_AI) {
      breadcrumbs.push({ label: 'Sandra AI', href: pathname });
    } else if (pathname === ROUTES.TOOLS.CALENDAR) {
      breadcrumbs.push({ label: 'Content Calendar', href: pathname });
    } else if (pathname === ROUTES.TOOLS.CAPTION_WRITER) {
      breadcrumbs.push({ label: 'Caption Writer', href: pathname });
    } else if (pathname === ROUTES.TOOLS.BRAND_KIT) {
      breadcrumbs.push({ label: 'Brand Kit', href: pathname });
    } else if (pathname === ROUTES.TOOLS.ANALYTICS) {
      breadcrumbs.push({ label: 'Analytics', href: pathname });
    }
  }
  
  // Profile
  else if (pathname.startsWith('/profile')) {
    breadcrumbs.push({ label: 'Profile', href: ROUTES.PROFILE.HOME });
    
    if (pathname === ROUTES.PROFILE.EDIT) {
      breadcrumbs.push({ label: 'Edit', href: pathname });
    } else if (pathname === ROUTES.PROFILE.BILLING) {
      breadcrumbs.push({ label: 'Billing', href: pathname });
    } else if (pathname === ROUTES.PROFILE.PURCHASES) {
      breadcrumbs.push({ label: 'Purchases', href: pathname });
    } else if (pathname === ROUTES.PROFILE.CERTIFICATES) {
      breadcrumbs.push({ label: 'Certificates', href: pathname });
    }
  }
  
  return breadcrumbs;
}