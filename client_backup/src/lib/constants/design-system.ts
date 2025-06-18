// /lib/constants/design-system.ts
// SELFIE AI™ Design System - Single Source of Truth
// Last updated: 2024

// ============================================
// 1. COLOR PALETTE
// ============================================
export const colors = {
  // Core Brand Colors
  brand: {
    black: '#171719',      // Luxury Black - primary brand color
    white: '#F1F1F1',      // Soft White - primary background
    gray: '#B5B5B3',       // Warm Gray - subtle elements
    graphite: '#4C4B4B',   // Deep Graphite - text, overlays
  },
  
  // UI Colors
  ui: {
    background: '#F1F1F1',
    surface: '#FFFFFF',
    border: '#B5B5B3',
    borderLight: 'rgba(181, 181, 179, 0.2)',
    borderDark: 'rgba(23, 23, 25, 0.2)',
  },
  
  // Text Colors
  text: {
    primary: '#171719',
    secondary: '#4C4B4B',
    muted: '#B5B5B3',
    inverse: '#F1F1F1',
    inverseSecondary: 'rgba(241, 241, 241, 0.8)',
  },
  
  // State Colors (minimal, luxury approach)
  state: {
    success: '#171719',
    error: '#171719',
    warning: '#4C4B4B',
    info: '#4C4B4B',
  },
  
  // Overlay Colors
  overlay: {
    light: 'rgba(241, 241, 241, 0.95)',
    medium: 'rgba(23, 23, 25, 0.5)',
    dark: 'rgba(23, 23, 25, 0.8)',
    heavy: 'rgba(23, 23, 25, 0.95)',
  }
} as const;

// ============================================
// 2. TYPOGRAPHY SCALE
// ============================================
export const typography = {
  // Font Families
  fonts: {
    serif: 'Bodoni Moda, Playfair Display, serif',
    display: 'Lingerie Typeface, Playfair Display, serif',
    sans: 'Neue Einstellung, Inter, sans-serif',
  },
  
  // Responsive Font Sizes
  size: {
    // Hero/Display
    hero: {
      mobile: 'text-[48px]',
      tablet: 'text-[72px]',
      desktop: 'text-[96px]',
      large: 'text-[128px]',
      className: 'text-[48px] sm:text-[72px] md:text-[96px] lg:text-[128px]'
    },
    
    // Headings
    h1: {
      mobile: 'text-[36px]',
      tablet: 'text-[48px]',
      desktop: 'text-[64px]',
      className: 'text-[36px] sm:text-[48px] md:text-[64px]'
    },
    h2: {
      mobile: 'text-[28px]',
      tablet: 'text-[36px]',
      desktop: 'text-[48px]',
      className: 'text-[28px] sm:text-[36px] md:text-[48px]'
    },
    h3: {
      mobile: 'text-[24px]',
      tablet: 'text-[28px]',
      desktop: 'text-[36px]',
      className: 'text-[24px] sm:text-[28px] md:text-[36px]'
    },
    h4: {
      mobile: 'text-[20px]',
      tablet: 'text-[24px]',
      desktop: 'text-[28px]',
      className: 'text-[20px] sm:text-[24px] md:text-[28px]'
    },
    
    // Body Text
    body: {
      large: 'text-lg md:text-xl lg:text-[22px]',
      default: 'text-base md:text-lg',
      small: 'text-sm md:text-base',
    },
    
    // UI Text
    button: 'text-[11px] md:text-xs',
    caption: 'text-xs md:text-sm',
    label: 'text-[10px] md:text-[11px]',
  },
  
  // Font Weights
  weight: {
    light: 'font-light',      // 300
    normal: 'font-normal',    // 400
    medium: 'font-medium',    // 500
    semibold: 'font-semibold', // 600
    bold: 'font-bold',        // 700
  },
  
  // Letter Spacing
  tracking: {
    tightest: 'tracking-[-0.02em]',
    tight: 'tracking-[-0.01em]',
    normal: 'tracking-[0]',
    wide: 'tracking-[0.02em]',
    wider: 'tracking-[0.15em]',
    widest: 'tracking-[0.3em]',
    luxury: 'tracking-[0.35em]', // For uppercase labels
  },
  
  // Line Heights
  leading: {
    none: 'leading-none',        // 1
    tight: 'leading-[0.9]',      // 0.9 - for headlines
    snug: 'leading-[1.2]',       // 1.2
    normal: 'leading-[1.5]',     // 1.5
    relaxed: 'leading-[1.75]',   // 1.75
    loose: 'leading-[2]',        // 2
  }
} as const;

// ============================================
// 3. SPACING SYSTEM (8px base)
// ============================================
export const spacing = {
  // Base unit: 8px
  px: '1px',
  0: '0',
  0.5: '0.125rem',  // 2px
  1: '0.25rem',     // 4px
  2: '0.5rem',      // 8px - base unit
  3: '0.75rem',     // 12px
  4: '1rem',        // 16px
  5: '1.25rem',     // 20px
  6: '1.5rem',      // 24px
  7: '1.75rem',     // 28px
  8: '2rem',        // 32px
  10: '2.5rem',     // 40px
  12: '3rem',       // 48px
  14: '3.5rem',     // 56px
  16: '4rem',       // 64px
  20: '5rem',       // 80px
  24: '6rem',       // 96px
  28: '7rem',       // 112px
  32: '8rem',       // 128px
  36: '9rem',       // 144px
  40: '10rem',      // 160px
  48: '12rem',      // 192px
  56: '14rem',      // 224px
  64: '16rem',      // 256px
  
  // Common Patterns
  section: {
    mobile: 'py-12 px-4',
    tablet: 'py-16 px-6',
    desktop: 'py-20 px-8',
    large: 'py-24 px-16',
    className: 'py-12 px-4 sm:py-16 sm:px-6 md:py-20 md:px-8 lg:py-24 lg:px-16'
  },
  
  container: {
    padding: 'px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24',
    maxWidth: 'max-w-[1400px] mx-auto',
  },
  
  touchTarget: {
    min: 'min-h-[44px] min-w-[44px]', // Mobile touch target
  }
} as const;

// ============================================
// 4. ANIMATION CONSTANTS
// ============================================
export const animation = {
  // Durations
  duration: {
    instant: '0ms',
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
    slower: '700ms',
    slowest: '1000ms',
  },
  
  // Easings (Bezier curves)
  easing: {
    linear: 'linear',
    ease: 'ease',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    luxury: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)', // Custom luxury easing
  },
  
  // Common Transitions
  transition: {
    all: 'transition-all duration-300 ease-out',
    colors: 'transition-colors duration-300 ease-out',
    transform: 'transition-transform duration-500 ease-out',
    opacity: 'transition-opacity duration-500 ease-out',
    shadow: 'transition-shadow duration-300 ease-out',
  },
  
  // Hover Scale
  scale: {
    subtle: 'hover:scale-[1.01]',
    normal: 'hover:scale-[1.02]',
    medium: 'hover:scale-[1.05]',
    large: 'hover:scale-[1.1]',
  },
  
  // Custom Animations
  keyframes: {
    fadeIn: 'animate-fadeIn',
    fadeInUp: 'animate-fadeInUp',
    shimmer: 'animate-shimmer',
    spin: 'animate-spin',
    pulse: 'animate-pulse',
  }
} as const;

// ============================================
// 5. BREAKPOINTS
// ============================================
export const breakpoints = {
  // Raw values
  values: {
    xs: '475px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  
  // Media queries
  media: {
    xs: '@media (min-width: 475px)',
    sm: '@media (min-width: 640px)',
    md: '@media (min-width: 768px)',
    lg: '@media (min-width: 1024px)',
    xl: '@media (min-width: 1280px)',
    '2xl': '@media (min-width: 1536px)',
  },
  
  // Tailwind prefixes
  prefix: {
    xs: 'xs:',
    sm: 'sm:',
    md: 'md:',
    lg: 'lg:',
    xl: 'xl:',
    '2xl': '2xl:',
  }
} as const;

// ============================================
// 6. ELEVATION (Minimal per brand guidelines)
// ============================================
export const elevation = {
  // SELFIE AI™ uses minimal shadows - mostly for hover states
  none: '',
  subtle: 'shadow-sm', // Very subtle for cards
  normal: 'shadow', // Rarely used
  medium: 'shadow-md', // Hover states only
  large: 'shadow-lg', // Special emphasis
  xl: 'shadow-xl', // Hero hover states
  
  // Custom elevation using borders instead of shadows
  border: {
    subtle: 'border border-[#B5B5B3]/20',
    normal: 'border border-[#B5B5B3]',
    strong: 'border-2 border-[#171719]',
    luxury: 'border border-[#171719]',
  },
  
  // Glow effects (used sparingly)
  glow: {
    white: 'shadow-[0_0_30px_rgba(241,241,241,0.3)]',
    black: 'shadow-[0_0_30px_rgba(23,23,25,0.3)]',
  }
} as const;

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Get responsive class string
export const responsive = (
  mobile: string,
  tablet?: string,
  desktop?: string,
  large?: string
) => {
  let classes = mobile;
  if (tablet) classes += ` sm:${tablet}`;
  if (desktop) classes += ` md:${desktop}`;
  if (large) classes += ` lg:${large}`;
  return classes;
};

// Combine design tokens for components
export const getButtonClasses = (variant: 'primary' | 'secondary' | 'ghost' | 'luxury') => {
  const base = `${typography.fonts.sans} ${typography.size.button} ${typography.tracking.luxury} uppercase ${animation.transition.all}`;
  
  const variants = {
    primary: `${colors.brand.black} ${colors.text.inverse} hover:opacity-90`,
    secondary: `bg-transparent border ${elevation.border.luxury} ${colors.text.primary} hover:bg-[${colors.brand.black}] hover:text-[${colors.brand.white}]`,
    ghost: `bg-transparent ${colors.text.primary} hover:bg-[${colors.ui.background}]`,
    luxury: `bg-transparent border ${elevation.border.subtle} ${colors.text.inverse} hover:bg-white hover:text-[${colors.brand.black}]`
  };
  
  return `${base} ${variants[variant]}`;
};

// Export type definitions
export type Colors = typeof colors;
export type Typography = typeof typography;
export type Spacing = typeof spacing;
export type Animation = typeof animation;
export type Breakpoints = typeof breakpoints;
export type Elevation = typeof elevation;

// Default export for easy importing
export default {
  colors,
  typography,
  spacing,
  animation,
  breakpoints,
  elevation,
  responsive,
  getButtonClasses,
};