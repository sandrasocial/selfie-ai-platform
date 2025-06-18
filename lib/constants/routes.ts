// /lib/constants/routes.ts
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