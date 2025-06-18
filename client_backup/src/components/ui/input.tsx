// /components/ui/input.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';
import { 
  colors, 
  typography, 
  spacing, 
  animation, 
  elevation 
} from '@/lib/constants/design-system';
import { AlertCircle, Check, Eye, EyeOff } from 'lucide-react';

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  /** Input type variant */
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
  
  /** Visual size variant */
  size?: 'sm' | 'default' | 'lg';
  
  /** Error state and message */
  error?: boolean | string;
  
  /** Success state */
  success?: boolean;
  
  /** Helper text below input */
  helperText?: string;
  
  /** Icon on the left side */
  leftIcon?: React.ReactNode;
  
  /** Icon on the right side */
  rightIcon?: React.ReactNode;
  
  /** Show/hide password toggle (auto for password type) */
  showPasswordToggle?: boolean;
  
  /** Full width input */
  fullWidth?: boolean;
  
  /** Loading state */
  loading?: boolean;
  
  /** Label for floating label variant */
  label?: string;
  
  /** Use floating label style */
  floatingLabel?: boolean;
  
  /** Additional container className */
  containerClassName?: string;
  
  /** Additional CSS classes */
  className?: string;
}

// ============================================
// STYLE CONFIGURATIONS
// ============================================

const inputSizes = {
  sm: {
    input: cn(
      'h-10 px-3',
      'text-sm',
      'min-h-[40px]' // Slightly smaller but still touch-friendly
    ),
    icon: 'w-4 h-4',
    iconPadding: {
      left: 'pl-9',
      right: 'pr-9'
    }
  },
  default: {
    input: cn(
      'h-12 px-4',
      'text-base',
      'min-h-[48px]' // Touch target compliance
    ),
    icon: 'w-5 h-5',
    iconPadding: {
      left: 'pl-11',
      right: 'pr-11'
    }
  },
  lg: {
    input: cn(
      'h-14 px-5',
      'text-lg',
      'min-h-[56px]' // Larger touch target
    ),
    icon: 'w-6 h-6',
    iconPadding: {
      left: 'pl-14',
      right: 'pr-14'
    }
  }
};

const inputStates = {
  default: cn(
    'border-[#B5B5B3]/30',
    'focus:border-[#171719]',
    'hover:border-[#B5B5B3]/50'
  ),
  error: cn(
    'border-red-500',
    'focus:border-red-500',
    'hover:border-red-500'
  ),
  success: cn(
    'border-green-500',
    'focus:border-green-500',
    'hover:border-green-500'
  ),
  disabled: cn(
    'border-[#B5B5B3]/20',
    'bg-[#F1F1F1]/50',
    'cursor-not-allowed'
  )
};

// ============================================
// INPUT COMPONENT
// ============================================

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type = 'text',
      size = 'default',
      error = false,
      success = false,
      helperText,
      leftIcon,
      rightIcon,
      showPasswordToggle,
      fullWidth = false,
      loading = false,
      label,
      floatingLabel = false,
      containerClassName,
      className,
      disabled,
      id,
      placeholder,
      value,
      onChange,
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    // State for password visibility
    const [showPassword, setShowPassword] = React.useState(false);
    const [isFocused, setIsFocused] = React.useState(false);
    const [hasValue, setHasValue] = React.useState(!!value);

    // Generate ID if not provided (for label association)
    const inputId = id || React.useId();

    // Determine if password toggle should be shown
    const shouldShowPasswordToggle = type === 'password' && (showPasswordToggle !== false);

    // Update hasValue when value changes
    React.useEffect(() => {
      setHasValue(!!value || (props.defaultValue !== undefined && props.defaultValue !== ''));
    }, [value, props.defaultValue]);

    // Handle focus
    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    // Handle blur
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    // Handle change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(!!e.target.value);
      onChange?.(e);
    };

    // Determine input type
    const inputType = type === 'password' && showPassword ? 'text' : type;

    // Size configuration
    const sizeConfig = inputSizes[size];

    // Error message
    const errorMessage = typeof error === 'string' ? error : '';

    // State classes
    const stateClass = disabled
      ? inputStates.disabled
      : error
      ? inputStates.error
      : success
      ? inputStates.success
      : inputStates.default;

    // Icon padding
    const iconPadding = cn(
      leftIcon && sizeConfig.iconPadding.left,
      (rightIcon || shouldShowPasswordToggle) && sizeConfig.iconPadding.right
    );

    // Floating label classes
    const floatingLabelClass = cn(
      'absolute left-4 transition-all duration-200 pointer-events-none',
      'font-["Neue_Einstellung",sans-serif]',
      (isFocused || hasValue || placeholder) ? [
        'top-0 -translate-y-1/2 bg-white px-1',
        'text-xs',
        error ? 'text-red-500' : success ? 'text-green-500' : 'text-[#4C4B4B]'
      ] : [
        'top-1/2 -translate-y-1/2',
        size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-lg' : 'text-base',
        'text-[#B5B5B3]'
      ]
    );

    return (
      <div className={cn('relative', fullWidth && 'w-full', containerClassName)}>
        {/* Floating Label */}
        {floatingLabel && label && (
          <label
            htmlFor={inputId}
            className={floatingLabelClass}
          >
            {label}
          </label>
        )}

        {/* Regular Label */}
        {!floatingLabel && label && (
          <label
            htmlFor={inputId}
            className={cn(
              'block mb-2',
              'font-["Neue_Einstellung",sans-serif]',
              'text-sm font-medium',
              error ? 'text-red-500' : 'text-[#171719]'
            )}
          >
            {label}
          </label>
        )}

        {/* Input Container */}
        <div className="relative">
          {/* Left Icon */}
          {leftIcon && (
            <div className={cn(
              'absolute left-3 top-1/2 -translate-y-1/2',
              'text-[#4C4B4B]',
              disabled && 'opacity-50'
            )}>
              <div className={sizeConfig.icon}>
                {leftIcon}
              </div>
            </div>
          )}

          {/* Input Element */}
          <input
            ref={ref}
            id={inputId}
            type={inputType}
            disabled={disabled || loading}
            placeholder={floatingLabel ? undefined : placeholder}
            value={value}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={cn(
              // Base styles
              'w-full',
              'font-["Neue_Einstellung",sans-serif]',
              'bg-white',
              'border',
              'outline-none',
              'transition-all duration-200',
              
              // Size styles
              sizeConfig.input,
              
              // Icon padding
              iconPadding,
              
              // State styles
              stateClass,
              
              // Focus styles
              'focus:outline-none focus:ring-2 focus:ring-[#171719]/10',
              
              // Placeholder styles
              'placeholder:text-[#B5B5B3]',
              
              // Disabled styles
              disabled && 'text-[#4C4B4B]/50',
              
              // Loading styles
              loading && 'pr-10',
              
              // Custom className
              className
            )}
            {...props}
          />

          {/* Loading Spinner */}
          {loading && (
            <div className={cn(
              'absolute right-3 top-1/2 -translate-y-1/2',
              'animate-spin'
            )}>
              <div className={cn(
                'border-2 border-[#B5B5B3] border-t-[#171719] rounded-full',
                sizeConfig.icon
              )} />
            </div>
          )}

          {/* Right Icon / Status Icons */}
          {!loading && (
            <>
              {/* Error Icon */}
              {error && !rightIcon && !shouldShowPasswordToggle && (
                <div className={cn(
                  'absolute right-3 top-1/2 -translate-y-1/2',
                  'text-red-500'
                )}>
                  <AlertCircle className={sizeConfig.icon} />
                </div>
              )}

              {/* Success Icon */}
              {success && !error && !rightIcon && !shouldShowPasswordToggle && (
                <div className={cn(
                  'absolute right-3 top-1/2 -translate-y-1/2',
                  'text-green-500'
                )}>
                  <Check className={sizeConfig.icon} />
                </div>
              )}

              {/* Custom Right Icon */}
              {rightIcon && !shouldShowPasswordToggle && (
                <div className={cn(
                  'absolute right-3 top-1/2 -translate-y-1/2',
                  'text-[#4C4B4B]',
                  disabled && 'opacity-50'
                )}>
                  <div className={sizeConfig.icon}>
                    {rightIcon}
                  </div>
                </div>
              )}

              {/* Password Toggle */}
              {shouldShowPasswordToggle && (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={cn(
                    'absolute right-3 top-1/2 -translate-y-1/2',
                    'text-[#4C4B4B] hover:text-[#171719]',
                    'transition-colors duration-200',
                    'focus:outline-none',
                    disabled && 'opacity-50 cursor-not-allowed'
                  )}
                  tabIndex={-1}
                  disabled={disabled}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className={sizeConfig.icon} />
                  ) : (
                    <Eye className={sizeConfig.icon} />
                  )}
                </button>
              )}
            </>
          )}
        </div>

        {/* Helper Text / Error Message */}
        {(helperText || errorMessage) && (
          <p className={cn(
            'mt-1.5',
            'font-["Neue_Einstellung",sans-serif]',
            'text-sm',
            error ? 'text-red-500' : 'text-[#4C4B4B]'
          )}>
            {errorMessage || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };

// ============================================
// USAGE EXAMPLES
// ============================================

/**
 * Basic Input
 * @example
 * ```tsx
 * <Input
 *   type="text"
 *   placeholder="Enter your name"
 * />
 * ```
 */

/**
 * With Label and Helper Text
 * @example
 * ```tsx
 * <Input
 *   label="Email Address"
 *   type="email"
 *   placeholder="queen@example.com"
 *   helperText="We'll never share your email"
 * />
 * ```
 */

/**
 * Floating Label
 * @example
 * ```tsx
 * <Input
 *   label="Full Name"
 *   floatingLabel
 *   type="text"
 * />
 * ```
 */

/**
 * Password with Toggle
 * @example
 * ```tsx
 * <Input
 *   label="Password"
 *   type="password"
 *   placeholder="Enter password"
 *   helperText="Must be at least 8 characters"
 * />
 * ```
 */

/**
 * With Icons
 * @example
 * ```tsx
 * import { Mail, Phone } from 'lucide-react';
 * 
 * <Input
 *   type="email"
 *   placeholder="Email"
 *   leftIcon={<Mail />}
 * />
 * 
 * <Input
 *   type="tel"
 *   placeholder="Phone"
 *   leftIcon={<Phone />}
 * />
 * ```
 */

/**
 * Error State
 * @example
 * ```tsx
 * <Input
 *   label="Username"
 *   type="text"
 *   error="Username is already taken"
 *   value={username}
 *   onChange={(e) => setUsername(e.target.value)}
 * />
 * ```
 */

/**
 * Success State
 * @example
 * ```tsx
 * <Input
 *   label="Coupon Code"
 *   type="text"
 *   success
 *   value="SELFIE20"
 *   helperText="Discount applied!"
 * />
 * ```
 */

/**
 * Loading State
 * @example
 * ```tsx
 * <Input
 *   label="Checking availability..."
 *   type="text"
 *   loading
 *   value={username}
 * />
 * ```
 */

/**
 * Different Sizes
 * @example
 * ```tsx
 * <div className="space-y-4">
 *   <Input size="sm" placeholder="Small input" />
 *   <Input size="default" placeholder="Default input" />
 *   <Input size="lg" placeholder="Large input" />
 * </div>
 * ```
 */

/**
 * Form Example
 * @example
 * ```tsx
 * <form onSubmit={handleSubmit} className="space-y-6">
 *   <Input
 *     label="Email"
 *     type="email"
 *     required
 *     error={errors.email}
 *     value={email}
 *     onChange={(e) => setEmail(e.target.value)}
 *   />
 *   
 *   <Input
 *     label="Password"
 *     type="password"
 *     required
 *     error={errors.password}
 *     value={password}
 *     onChange={(e) => setPassword(e.target.value)}
 *   />
 *   
 *   <Button type="submit" fullWidth>
 *     Sign In
 *   </Button>
 * </form>
 * ```
 */