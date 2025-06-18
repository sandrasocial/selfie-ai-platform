// /components/ui/checkbox.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';
import { 
  colors, 
  typography, 
  spacing, 
  animation, 
  elevation 
} from '@/lib/constants/design-system';
import { Check } from 'lucide-react';

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /** Visual size variant */
  size?: 'sm' | 'default' | 'lg';
  
  /** Label text */
  label?: string;
  
  /** Label position */
  labelPosition?: 'left' | 'right';
  
  /** Helper text below checkbox */
  helperText?: string;
  
  /** Error state */
  error?: boolean | string;
  
  /** Indeterminate state */
  indeterminate?: boolean;
  
  /** Additional label className */
  labelClassName?: string;
  
  /** Additional container className */
  containerClassName?: string;
  
  /** Additional checkbox className */
  className?: string;
}

export interface CheckboxGroupProps {
  /** Group label */
  label?: string;
  
  /** Helper text for group */
  helperText?: string;
  
  /** Error state for group */
  error?: boolean | string;
  
  /** Orientation */
  orientation?: 'horizontal' | 'vertical';
  
  /** Gap between items */
  gap?: 'sm' | 'default' | 'lg';
  
  /** Additional className */
  className?: string;
  
  /** Children (Checkbox components) */
  children: React.ReactNode;
}

// ============================================
// STYLE CONFIGURATIONS
// ============================================

const checkboxSizes = {
  sm: {
    box: 'w-4 h-4',
    icon: 'w-2.5 h-2.5',
    label: 'text-sm',
    gap: 'gap-2'
  },
  default: {
    box: 'w-5 h-5',
    icon: 'w-3 h-3',
    label: 'text-base',
    gap: 'gap-3'
  },
  lg: {
    box: 'w-6 h-6',
    icon: 'w-4 h-4',
    label: 'text-lg',
    gap: 'gap-4'
  }
};

const groupGaps = {
  sm: 'gap-2',
  default: 'gap-4',
  lg: 'gap-6'
};

// ============================================
// CHECKBOX COMPONENT
// ============================================

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      size = 'default',
      label,
      labelPosition = 'right',
      helperText,
      error = false,
      indeterminate = false,
      labelClassName,
      containerClassName,
      className,
      checked,
      disabled,
      id,
      onChange,
      ...props
    },
    ref
  ) => {
    const checkboxRef = React.useRef<HTMLInputElement>(null);
    const mergedRef = ref || checkboxRef;
    
    // Generate ID if not provided (for label association)
    const checkboxId = id || React.useId();

    // Size configuration
    const sizeConfig = checkboxSizes[size];

    // Set indeterminate state
    React.useEffect(() => {
      if (mergedRef && 'current' in mergedRef && mergedRef.current) {
        mergedRef.current.indeterminate = indeterminate;
      }
    }, [indeterminate, mergedRef]);

    // Error message
    const errorMessage = typeof error === 'string' ? error : '';

    // Base checkbox element
    const checkboxElement = (
      <div className="relative">
        <input
          ref={mergedRef}
          id={checkboxId}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={onChange}
          className="sr-only"
          {...props}
        />
        
        {/* Custom Checkbox */}
        <div className={cn(
          // Base styles
          'relative',
          'border-2',
          'transition-all duration-200',
          'flex items-center justify-center',
          
          // Size
          sizeConfig.box,
          
          // States
          disabled
            ? 'border-[#B5B5B3]/30 bg-[#F1F1F1]/50 cursor-not-allowed'
            : error
            ? 'border-red-500'
            : checked || indeterminate
            ? 'border-[#171719] bg-[#171719]'
            : 'border-[#B5B5B3] bg-white hover:border-[#171719]',
          
          // Focus (when label is clicked or keyboard nav)
          'peer-focus:ring-2 peer-focus:ring-[#171719]/20',
          
          // Custom className
          className
        )}>
          {/* Check Icon */}
          {(checked || indeterminate) && (
            <div className="text-white">
              {indeterminate ? (
                <div className={cn(
                  'bg-white',
                  'h-0.5',
                  size === 'sm' ? 'w-2' : size === 'lg' ? 'w-3' : 'w-2.5'
                )} />
              ) : (
                <Check className={cn(sizeConfig.icon, 'stroke-[3]')} />
              )}
            </div>
          )}
        </div>
      </div>
    );

    // If no label, return just the checkbox
    if (!label && !helperText) {
      return checkboxElement;
    }

    // With label/helper text
    return (
      <div className={cn('relative', containerClassName)}>
        <label
          htmlFor={checkboxId}
          className={cn(
            'flex items-start',
            sizeConfig.gap,
            disabled ? 'cursor-not-allowed' : 'cursor-pointer',
            labelPosition === 'left' && 'flex-row-reverse'
          )}
        >
          {checkboxElement}
          
          <div className="flex-1">
            {label && (
              <span className={cn(
                'font-["Neue_Einstellung",sans-serif]',
                sizeConfig.label,
                disabled ? 'text-[#B5B5B3]' : 'text-[#171719]',
                labelClassName
              )}>
                {label}
              </span>
            )}
            
            {helperText && (
              <p className={cn(
                'mt-1',
                'font-["Neue_Einstellung",sans-serif]',
                'text-sm',
                'text-[#4C4B4B]'
              )}>
                {helperText}
              </p>
            )}
          </div>
        </label>
        
        {/* Error Message */}
        {errorMessage && (
          <p className={cn(
            'mt-1.5',
            labelPosition === 'left' ? 'mr-7' : 'ml-7',
            'font-["Neue_Einstellung",sans-serif]',
            'text-sm',
            'text-red-500'
          )}>
            {errorMessage}
          </p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

// ============================================
// CHECKBOX GROUP COMPONENT
// ============================================

const CheckboxGroup = React.forwardRef<HTMLDivElement, CheckboxGroupProps>(
  (
    {
      label,
      helperText,
      error = false,
      orientation = 'vertical',
      gap = 'default',
      className,
      children,
    },
    ref
  ) => {
    const errorMessage = typeof error === 'string' ? error : '';

    return (
      <div ref={ref} className={cn('space-y-2', className)}>
        {/* Group Label */}
        {label && (
          <label className={cn(
            'block',
            'font-["Neue_Einstellung",sans-serif]',
            'text-sm font-medium',
            error ? 'text-red-500' : 'text-[#171719]'
          )}>
            {label}
          </label>
        )}
        
        {/* Helper Text */}
        {helperText && (
          <p className={cn(
            'font-["Neue_Einstellung",sans-serif]',
            'text-sm',
            'text-[#4C4B4B]'
          )}>
            {helperText}
          </p>
        )}

        {/* Checkboxes */}
        <div className={cn(
          'flex',
          orientation === 'vertical' ? 'flex-col' : 'flex-row flex-wrap',
          groupGaps[gap]
        )}>
          {children}
        </div>

        {/* Error Message */}
        {errorMessage && (
          <p className={cn(
            'font-["Neue_Einstellung",sans-serif]',
            'text-sm',
            'text-red-500'
          )}>
            {errorMessage}
          </p>
        )}
      </div>
    );
  }
);

CheckboxGroup.displayName = 'CheckboxGroup';

export { Checkbox, CheckboxGroup };

// ============================================
// USAGE EXAMPLES
// ============================================

/**
 * Basic Checkbox
 * @example
 * ```tsx
 * <Checkbox
 *   label="I agree to the terms and conditions"
 *   checked={agreed}
 *   onChange={(e) => setAgreed(e.target.checked)}
 * />
 * ```
 */

/**
 * With Helper Text
 * @example
 * ```tsx
 * <Checkbox
 *   label="Subscribe to newsletter"
 *   helperText="Get weekly tips on building your personal brand"
 *   checked={subscribed}
 *   onChange={(e) => setSubscribed(e.target.checked)}
 * />
 * ```
 */

/**
 * Different Sizes
 * @example
 * ```tsx
 * <div className="space-y-4">
 *   <Checkbox size="sm" label="Small checkbox" />
 *   <Checkbox size="default" label="Default checkbox" />
 *   <Checkbox size="lg" label="Large checkbox" />
 * </div>
 * ```
 */

/**
 * Indeterminate State
 * @example
 * ```tsx
 * <Checkbox
 *   label="Select all"
 *   checked={allSelected}
 *   indeterminate={someSelected && !allSelected}
 *   onChange={handleSelectAll}
 * />
 * ```
 */

/**
 * Error State
 * @example
 * ```tsx
 * <Checkbox
 *   label="Accept privacy policy"
 *   error="You must accept the privacy policy"
 *   checked={accepted}
 *   onChange={(e) => setAccepted(e.target.checked)}
 * />
 * ```
 */

/**
 * Checkbox Group
 * @example
 * ```tsx
 * <CheckboxGroup
 *   label="Select your interests"
 *   helperText="Choose all that apply"
 * >
 *   <Checkbox
 *     label="Personal Branding"
 *     checked={interests.branding}
 *     onChange={(e) => setInterests({
 *       ...interests,
 *       branding: e.target.checked
 *     })}
 *   />
 *   <Checkbox
 *     label="Content Creation"
 *     checked={interests.content}
 *     onChange={(e) => setInterests({
 *       ...interests,
 *       content: e.target.checked
 *     })}
 *   />
 *   <Checkbox
 *     label="Business Growth"
 *     checked={interests.business}
 *     onChange={(e) => setInterests({
 *       ...interests,
 *       business: e.target.checked
 *     })}
 *   />
 * </CheckboxGroup>
 * ```
 */

/**
 * Horizontal Group
 * @example
 * ```tsx
 * <CheckboxGroup
 *   label="Notification preferences"
 *   orientation="horizontal"
 *   gap="lg"
 * >
 *   <Checkbox label="Email" />
 *   <Checkbox label="SMS" />
 *   <Checkbox label="Push" />
 * </CheckboxGroup>
 * ```
 */