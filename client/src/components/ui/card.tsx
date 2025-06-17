// /components/ui/card.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';
import { 
  colors, 
  typography, 
  spacing, 
  animation, 
  elevation 
} from '@/lib/constants/design-system';

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Visual style variant */
  variant?: 'default' | 'luxury' | 'soft' | 'glass' | 'bordered';
  
  /** Hover effect intensity */
  hover?: 'none' | 'subtle' | 'lift' | 'glow';
  
  /** Padding size */
  padding?: 'none' | 'sm' | 'default' | 'lg';
  
  /** Loading state - shows skeleton */
  loading?: boolean;
  
  /** Make card clickable with hover states */
  clickable?: boolean;
  
  /** Additional CSS classes */
  className?: string;
  
  /** Card content */
  children: React.ReactNode;
}

export interface CardImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  /** Aspect ratio for the image container */
  aspectRatio?: '1/1' | '4/3' | '16/9' | '21/9' | '3/4' | '9/16';
  
  /** Object fit behavior */
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  
  /** Add gradient overlay */
  overlay?: 'none' | 'subtle' | 'medium' | 'heavy' | 'bottom' | 'top';
  
  /** Loading state */
  loading?: boolean;
  
  /** Additional CSS classes */
  className?: string;
}

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Section label (appears above title) */
  label?: string;
  
  /** Main title */
  title?: string;
  
  /** Subtitle or description */
  subtitle?: string;
  
  /** Action element (button, link, etc) */
  action?: React.ReactNode;
  
  /** Separator line below header */
  separator?: boolean;
  
  /** Additional CSS classes */
  className?: string;
  
  /** Content (alternative to title/subtitle) */
  children?: React.ReactNode;
}

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Padding size (inherits from Card if not specified) */
  padding?: 'none' | 'sm' | 'default' | 'lg';
  
  /** Additional CSS classes */
  className?: string;
  
  /** Content */
  children: React.ReactNode;
}

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Separator line above footer */
  separator?: boolean;
  
  /** Alignment of footer content */
  align?: 'left' | 'center' | 'right' | 'between';
  
  /** Additional CSS classes */
  className?: string;
  
  /** Footer content */
  children: React.ReactNode;
}

// ============================================
// STYLE CONFIGURATIONS
// ============================================

const cardVariants = {
  // Default - Standard card
  default: cn(
    'bg-white',
    'border border-[#B5B5B3]/20',
    'text-[#171719]'
  ),
  
  // Luxury - Dark premium card
  luxury: cn(
    'bg-[#171719]',
    'text-[#F1F1F1]',
    'border border-[#171719]'
  ),
  
  // Soft - Light gray background
  soft: cn(
    'bg-[#F1F1F1]',
    'text-[#171719]',
    'border border-transparent'
  ),
  
  // Glass - Translucent effect
  glass: cn(
    'bg-white/5',
    'backdrop-blur-md',
    'border border-white/10',
    'text-white'
  ),
  
  // Bordered - Strong border emphasis
  bordered: cn(
    'bg-white',
    'border-2 border-[#171719]',
    'text-[#171719]'
  ),
};

const hoverEffects = {
  none: '',
  subtle: cn(
    'transition-all duration-300',
    'hover:border-[#171719]/30'
  ),
  lift: cn(
    'transition-all duration-500',
    'hover:shadow-xl',
    'hover:-translate-y-1'
  ),
  glow: cn(
    'transition-all duration-500',
    'hover:shadow-[0_0_30px_rgba(23,23,25,0.1)]'
  ),
};

const paddingSizes = {
  none: '',
  sm: 'p-4 md:p-6',
  default: 'p-6 md:p-8',
  lg: 'p-8 md:p-12',
};

const aspectRatios = {
  '1/1': 'aspect-square',
  '4/3': 'aspect-[4/3]',
  '16/9': 'aspect-[16/9]',
  '21/9': 'aspect-[21/9]',
  '3/4': 'aspect-[3/4]',
  '9/16': 'aspect-[9/16]',
};

const imageOverlays = {
  none: '',
  subtle: 'after:absolute after:inset-0 after:bg-gradient-to-t after:from-black/10 after:to-transparent',
  medium: 'after:absolute after:inset-0 after:bg-gradient-to-t after:from-black/40 after:to-transparent',
  heavy: 'after:absolute after:inset-0 after:bg-gradient-to-t after:from-black/60 after:to-transparent',
  bottom: 'after:absolute after:inset-0 after:bg-gradient-to-t after:from-black/80 after:via-black/20 after:to-transparent',
  top: 'after:absolute after:inset-0 after:bg-gradient-to-b after:from-black/80 after:via-black/20 after:to-transparent',
};

// ============================================
// SKELETON LOADER
// ============================================

const Skeleton = ({ className }: { className?: string }) => (
  <div
    className={cn(
      'animate-pulse bg-[#B5B5B3]/20',
      className
    )}
  />
);

// ============================================
// CARD COMPONENTS
// ============================================

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'default',
      hover = 'subtle',
      padding = 'default',
      loading = false,
      clickable = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    if (loading) {
      return (
        <div
          ref={ref}
          className={cn(
            'relative overflow-hidden',
            cardVariants[variant],
            paddingSizes[padding],
            className
          )}
          {...props}
        >
          <div className="space-y-4">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <div className="pt-4">
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(
          // Base styles
          'relative overflow-hidden',
          
          // Variant styles
          cardVariants[variant],
          
          // Hover effects
          hoverEffects[hover],
          
          // Clickable state
          clickable && [
            'cursor-pointer',
            'active:scale-[0.99]',
            'transition-transform duration-200'
          ],
          
          // Custom className
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

// ============================================
// CARD IMAGE
// ============================================

const CardImage = React.forwardRef<HTMLImageElement, CardImageProps>(
  (
    {
      aspectRatio = '16/9',
      objectFit = 'cover',
      overlay = 'none',
      loading = false,
      className,
      alt = '',
      ...props
    },
    ref
  ) => {
    if (loading) {
      return (
        <div className={cn(
          'relative w-full',
          aspectRatios[aspectRatio],
          className
        )}>
          <Skeleton className="absolute inset-0" />
        </div>
      );
    }

    return (
      <div className={cn(
        'relative w-full overflow-hidden',
        aspectRatios[aspectRatio],
        overlay !== 'none' && 'after:pointer-events-none',
        imageOverlays[overlay],
        className
      )}>
        <img
          ref={ref}
          alt={alt}
          className={cn(
            'absolute inset-0 w-full h-full',
            objectFit === 'cover' && 'object-cover',
            objectFit === 'contain' && 'object-contain',
            objectFit === 'fill' && 'object-fill',
            objectFit === 'none' && 'object-none',
            objectFit === 'scale-down' && 'object-scale-down'
          )}
          {...props}
        />
      </div>
    );
  }
);

CardImage.displayName = 'CardImage';

// ============================================
// CARD HEADER
// ============================================

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  (
    {
      label,
      title,
      subtitle,
      action,
      separator = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    // Allow custom content or structured content
    const content = children || (
      <>
        {label && (
          <p className={cn(
            'font-["Neue_Einstellung",sans-serif]',
            'text-[10px] md:text-[11px]',
            'uppercase tracking-[0.3em]',
            'text-[#B5B5B3] mb-2'
          )}>
            {label}
          </p>
        )}
        
        {title && (
          <h3 className={cn(
            'font-["Bodoni_Moda",serif]',
            'text-[24px] sm:text-[28px] md:text-[32px]',
            'font-normal leading-tight',
            'text-inherit'
          )}>
            {title}
          </h3>
        )}
        
        {subtitle && (
          <p className={cn(
            'font-["Neue_Einstellung",sans-serif]',
            'text-sm md:text-base',
            'text-inherit opacity-70',
            'mt-2'
          )}>
            {subtitle}
          </p>
        )}
      </>
    );

    return (
      <div
        ref={ref}
        className={cn(
          'px-6 md:px-8 py-6 md:py-8',
          separator && 'border-b border-[#B5B5B3]/20',
          className
        )}
        {...props}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            {content}
          </div>
          {action && (
            <div className="flex-shrink-0">
              {action}
            </div>
          )}
        </div>
      </div>
    );
  }
);

CardHeader.displayName = 'CardHeader';

// ============================================
// CARD CONTENT
// ============================================

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  (
    {
      padding,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          padding !== undefined ? paddingSizes[padding] : 'px-6 md:px-8 py-6 md:py-8',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardContent.displayName = 'CardContent';

// ============================================
// CARD FOOTER
// ============================================

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  (
    {
      separator = false,
      align = 'left',
      className,
      children,
      ...props
    },
    ref
  ) => {
    const alignmentClasses = {
      left: 'justify-start',
      center: 'justify-center',
      right: 'justify-end',
      between: 'justify-between',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'px-6 md:px-8 py-6 md:py-8',
          'flex items-center gap-4',
          alignmentClasses[align],
          separator && 'border-t border-[#B5B5B3]/20',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardFooter.displayName = 'CardFooter';

// Export all components
export { CardImage, CardHeader, CardContent, CardFooter };

// ============================================
// USAGE EXAMPLES
// ============================================

/**
 * Basic Card
 * @example
 * ```tsx
 * <Card>
 *   <CardHeader
 *     label="Module 01"
 *     title="Brand Foundation"
 *     subtitle="Discover your unique brand voice"
 *   />
 *   <CardContent>
 *     <p>Start your transformation journey...</p>
 *   </CardContent>
 * </Card>
 * ```
 */

/**
 * Offer Ladder Card (Dashboard)
 * @example
 * ```tsx
 * <Card 
 *   variant="luxury" 
 *   hover="lift"
 *   clickable
 *   className="h-80"
 * >
 *   <CardImage
 *     src="/path/to/image.jpg"
 *     alt="Branded by Selfie"
 *     aspectRatio="16/9"
 *     overlay="bottom"
 *   />
 *   <CardContent className="absolute bottom-0 left-0 right-0 z-10">
 *     <h3 className="text-2xl font-serif text-white mb-2">
 *       Branded by Selfie™
 *     </h3>
 *     <p className="text-white/80 mb-4">
 *       Your complete brand transformation
 *     </p>
 *     <Button variant="luxury">
 *       Start Journey
 *     </Button>
 *   </CardContent>
 * </Card>
 * ```
 */

/**
 * Course Module Card
 * @example
 * ```tsx
 * <Card variant="soft" hover="subtle">
 *   <CardHeader
 *     label="Week 1-3"
 *     title="Foundation"
 *     action={
 *       <Badge variant="success">Completed</Badge>
 *     }
 *   />
 *   <CardContent>
 *     <ul className="space-y-2">
 *       <li>✓ Brand Discovery</li>
 *       <li>✓ Voice & Tone</li>
 *       <li>✓ Visual Identity</li>
 *     </ul>
 *   </CardContent>
 *   <CardFooter separator align="between">
 *     <span className="text-sm text-[#B5B5B3]">
 *       3 lessons • 45 min
 *     </span>
 *     <Button size="sm">Continue</Button>
 *   </CardFooter>
 * </Card>
 * ```
 */

/**
 * Pricing Card
 * @example
 * ```tsx
 * <Card variant="bordered" hover="glow" className="text-center">
 *   <CardHeader>
 *     <div className="py-8">
 *       <p className="text-sm uppercase tracking-widest text-[#B5B5B3] mb-4">
 *         Most Popular
 *       </p>
 *       <h3 className="text-4xl font-serif mb-2">
 *         Branded by Selfie™
 *       </h3>
 *       <p className="text-5xl font-serif">
 *         $397
 *       </p>
 *     </div>
 *   </CardHeader>
 *   <CardContent>
 *     <ul className="space-y-3 text-left mb-8">
 *       <li className="flex gap-2">
 *         <Check className="w-5 h-5 text-[#171719]" />
 *         <span>Complete brand system</span>
 *       </li>
 *       <li className="flex gap-2">
 *         <Check className="w-5 h-5 text-[#171719]" />
 *         <span>AI-powered tools</span>
 *       </li>
 *     </ul>
 *     <Button fullWidth size="lg">
 *       Get Instant Access
 *     </Button>
 *   </CardContent>
 * </Card>
 * ```
 */

/**
 * Feature Card with Glass Effect
 * @example
 * ```tsx
 * <div className="bg-[#171719] p-12">
 *   <Card variant="glass" hover="subtle">
 *     <CardContent className="text-center py-12">
 *       <Camera className="w-12 h-12 text-white mx-auto mb-4" />
 *       <h3 className="text-2xl font-serif text-white mb-2">
 *         AI Selfie Coach
 *       </h3>
 *       <p className="text-white/70">
 *         Get real-time feedback on your photos
 *       </p>
 *     </CardContent>
 *   </Card>
 * </div>
 * ```
 */

/**
 * Loading State
 * @example
 * ```tsx
 * <Card loading>
 *   {/* Content is replaced with skeleton */}
 * </Card>
 * ```
 */

/**
 * Complex Dashboard Card
 * @example
 * ```tsx
 * <Card 
 *   variant="default"
 *   hover="lift"
 *   clickable
 *   onClick={() => router.push('/course')}
 * >
 *   <div className="relative h-48">
 *     <CardImage
 *       src="/course-hero.jpg"
 *       alt="Course"
 *       aspectRatio="21/9"
 *       overlay="heavy"
 *       className="h-full"
 *     />
 *     <div className="absolute top-4 left-4">
 *       <Badge variant="luxury">New</Badge>
 *     </div>
 *     <div className="absolute bottom-4 left-4 right-4">
 *       <h3 className="text-2xl font-serif text-white">
 *         30-Day Visibility Sprint
 *       </h3>
 *     </div>
 *   </div>
 *   <CardContent>
 *     <p className="text-[#4C4B4B] mb-4">
 *       Transform your online presence in just 30 days with daily prompts and guidance.
 *     </p>
 *     <div className="flex items-center justify-between">
 *       <span className="text-sm text-[#B5B5B3]">
 *         30 lessons
 *       </span>
 *       <ArrowRight className="w-5 h-5 text-[#171719]" />
 *     </div>
 *   </CardContent>
 * </Card>
 * ```
 */