// /components/ui/button.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
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

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style variant */
  variant?: 'primary' | 'secondary' | 'ghost' | 'luxury';
  
  /** Size variant affecting padding and text size */
  size?: 'sm' | 'default' | 'lg';
  
  /** Loading state - shows spinner and disables interaction */
  loading?: boolean;
  
  /** Custom loading text (defaults to "Loading...") */
  loadingText?: string;
  
  /** Icon to display on the left side */
  leftIcon?: React.ReactNode;
  
  /** Icon to display on the right side */
  rightIcon?: React.ReactNode;
  
  /** Render as a full-width button */
  fullWidth?: boolean;
  
  /** Additional CSS classes */
  className?: string;
  
  /** Button content */
  children: React.ReactNode;
}

// ============================================
// STYLE CONFIGURATIONS
// ============================================

const buttonVariants = {
  // Primary - Main CTA actions
  primary: cn(
    `bg-[${colors.brand.black}]`,
    `text-[${colors.brand.white}]`,
    `hover:bg-[${colors.brand.black}]/90`,
    'focus:ring-2 focus:ring-[#171719]/20 focus:ring-offset-2',
    'disabled:opacity-50'
  ),
  
  // Secondary - Secondary actions
  secondary: cn(
    'bg-transparent',
    'border border-[#171719]',
    'text-[#171719]',
    'hover:bg-[#171719] hover:text-[#F1F1F1]',
    'focus:ring-2 focus:ring-[#171719]/20 focus:ring-offset-2',
    'disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-[#171719]'
  ),
  
  // Ghost - Subtle actions
  ghost: cn(
    'bg-transparent',
    'text-[#171719]',
    'hover:bg-[#F1F1F1]',
    'focus:ring-2 focus:ring-[#171719]/10',
    'disabled:opacity-50 disabled:hover:bg-transparent'
  ),
  
  // Luxury - Premium/VIP actions
  luxury: cn(
    'bg-transparent',
    'border border-white/30',
    'text-white',
    'hover:bg-white hover:text-[#171719] hover:border-white',
    'focus:ring-2 focus:ring-white/20',
    'disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-white'
  ),
};

const buttonSizes = {
  sm: cn(
    'px-6 py-2',
    'text-[10px] md:text-[11px]',
    'min-h-[36px] md:min-h-[40px]' // Slightly smaller on mobile, but still touchable
  ),
  default: cn(
    'px-8 py-3',
    'text-[11px] md:text-xs',
    'min-h-[44px] md:min-h-[48px]' // Mobile touch target compliance
  ),
  lg: cn(
    'px-12 py-4',
    'text-xs md:text-sm',
    'min-h-[52px] md:min-h-[56px]' // Larger touch target
  ),
};

// ============================================
// BUTTON COMPONENT
// ============================================

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'default',
      loading = false,
      loadingText = 'Loading...',
      leftIcon,
      rightIcon,
      fullWidth = false,
      className,
      disabled,
      children,
      onClick,
      ...props
    },
    ref
  ) => {
    // Prevent clicks while loading
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (loading) {
        e.preventDefault();
        return;
      }
      onClick?.(e);
    };

    // Loading spinner component
    const LoadingSpinner = () => (
      <Loader2 
        className={cn(
          'animate-spin',
          size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'
        )}
      />
    );

    return (
      <button
        ref={ref}
        type="button"
        disabled={disabled || loading}
        onClick={handleClick}
        className={cn(
          // Base styles
          'relative inline-flex items-center justify-center',
          'font-["Neue_Einstellung",sans-serif] font-normal',
          'uppercase tracking-[0.3em]',
          'transition-all duration-300 ease-out',
          'focus:outline-none focus-visible:outline-none',
          'active:scale-[0.98]',
          
          // Cursor states
          'cursor-pointer',
          'disabled:cursor-not-allowed',
          
          // Width
          fullWidth && 'w-full',
          
          // Apply variant styles
          buttonVariants[variant],
          
          // Apply size styles
          buttonSizes[size],
          
          // Custom className (allow overrides)
          className
        )}
        {...props}
      >
        {/* Left Icon */}
        {leftIcon && !loading && (
          <span 
            className={cn(
              'inline-flex shrink-0',
              size === 'sm' ? 'mr-2' : size === 'lg' ? 'mr-4' : 'mr-3'
            )}
          >
            {leftIcon}
          </span>
        )}

        {/* Loading State */}
        {loading && (
          <span className={cn(
            'inline-flex shrink-0',
            size === 'sm' ? 'mr-2' : size === 'lg' ? 'mr-4' : 'mr-3'
          )}>
            <LoadingSpinner />
          </span>
        )}

        {/* Button Text */}
        <span className="truncate">
          {loading ? loadingText : children}
        </span>

        {/* Right Icon */}
        {rightIcon && !loading && (
          <span 
            className={cn(
              'inline-flex shrink-0',
              size === 'sm' ? 'ml-2' : size === 'lg' ? 'ml-4' : 'ml-3'
            )}
          >
            {rightIcon}
          </span>
        )}

        {/* Focus ring enhancement for accessibility */}
        <span 
          className="absolute inset-0 rounded-none"
          aria-hidden="true"
        />
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };

// ============================================
// USAGE EXAMPLES
// ============================================

/**
 * Primary Button - Main CTAs
 * @example
 * ```tsx
 * <Button variant="primary" size="default">
 *   Get Started
 * </Button>
 * 
 * <Button variant="primary" size="lg" fullWidth>
 *   Start Your Journey
 * </Button>
 * ```
 */

/**
 * Secondary Button - Secondary actions
 * @example
 * ```tsx
 * <Button variant="secondary">
 *   Learn More
 * </Button>
 * 
 * <Button variant="secondary" size="sm">
 *   View Details
 * </Button>
 * ```
 */

/**
 * Ghost Button - Subtle actions
 * @example
 * ```tsx
 * <Button variant="ghost">
 *   Cancel
 * </Button>
 * 
 * <Button variant="ghost" size="sm">
 *   Skip
 * </Button>
 * ```
 */

/**
 * Luxury Button - Premium/VIP actions (use on dark backgrounds)
 * @example
 * ```tsx
 * <Button variant="luxury">
 *   Unlock VIP Access
 * </Button>
 * 
 * <Button variant="luxury" size="lg" fullWidth>
 *   Join Elite Membership
 * </Button>
 * ```
 */

/**
 * With Icons
 * @example
 * ```tsx
 * import { ArrowRight, Download } from 'lucide-react';
 * 
 * <Button rightIcon={<ArrowRight className="w-4 h-4" />}>
 *   Continue
 * </Button>
 * 
 * <Button 
 *   variant="secondary"
 *   leftIcon={<Download className="w-4 h-4" />}
 * >
 *   Download Guide
 * </Button>
 * ```
 */

/**
 * Loading States
 * @example
 * ```tsx
 * <Button loading loadingText="Processing...">
 *   Submit
 * </Button>
 * 
 * <Button 
 *   variant="secondary"
 *   loading
 *   loadingText="Saving..."
 *   fullWidth
 * >
 *   Save Changes
 * </Button>
 * ```
 */

/**
 * Disabled State
 * @example
 * ```tsx
 * <Button disabled>
 *   Unavailable
 * </Button>
 * 
 * <Button variant="secondary" disabled>
 *   Coming Soon
 * </Button>
 * ```
 */

/**
 * Complex Example - Form Submit Button
 * @example
 * ```tsx
 * const [isSubmitting, setIsSubmitting] = useState(false);
 * 
 * <Button
 *   type="submit"
 *   size="lg"
 *   fullWidth
 *   loading={isSubmitting}
 *   loadingText="Creating your account..."
 *   rightIcon={<ArrowRight className="w-5 h-5" />}
 *   className="mt-8"
 * >
 *   Create Account
 * </Button>
 * ```
 */

/**
 * Button Group Example
 * @example
 * ```tsx
 * <div className="flex gap-4">
 *   <Button variant="secondary">
 *     Cancel
 *   </Button>
 *   <Button>
 *     Save Changes
 *   </Button>
 * </div>
 * ```
 */