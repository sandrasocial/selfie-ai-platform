// /components/ui/radio.tsx
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

export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /** Visual size variant */
  size?: 'sm' | 'default' | 'lg';
  
  /** Label text */
  label?: string;
  
  /** Label position */
  labelPosition?: 'left' | 'right';
  
  /** Helper text below radio */
  helperText?: string;
  
  /** Error state */
  error?: boolean;
  
  /** Additional label className */
  labelClassName?: string;
  
  /** Additional container className */
  containerClassName?: string;
  
  /** Additional radio className */
  className?: string;
}

export interface RadioGroupProps {
  /** Group name (required for radio groups) */
  name: string;
  
  /** Current value */
  value?: string;
  
  /** Change handler */
  onChange?: (value: string) => void;
  
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
  
  /** Children (Radio components) */
  children: React.ReactNode;
}

// ============================================
// STYLE CONFIGURATIONS
// ============================================

const radioSizes = {
  sm: {
    outer: 'w-4 h-4',
    inner: 'w-1.5 h-1.5',
    label: 'text-sm',
    gap: 'gap-2'
  },
  default: {
    outer: 'w-5 h-5',
    inner: 'w-2 h-2',
    label: 'text-base',
    gap: 'gap-3'
  },
  lg: {
    outer: 'w-6 h-6',
    inner: 'w-2.5 h-2.5',
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
// RADIO CONTEXT
// ============================================

interface RadioGroupContextValue {
  name: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: boolean;
}

const RadioGroupContext = React.createContext<RadioGroupContextValue | null>(null);

const useRadioGroup = () => {
  const context = React.useContext(RadioGroupContext);
  return context;
};

// ============================================
// RADIO COMPONENT
// ============================================

const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      size = 'default',
      label,
      labelPosition = 'right',
      helperText,
      error = false,
      labelClassName,
      containerClassName,
      className,
      checked,
      disabled,
      id,
      name,
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    // Get group context if within RadioGroup
    const groupContext = useRadioGroup();
    
    // Use group values if available
    const radioName = name || groupContext?.name || '';
    const isChecked = checked !== undefined 
      ? checked 
      : groupContext?.value === value;
    const isError = error || groupContext?.error;
    
    // Generate ID if not provided (for label association)
    const radioId = id || React.useId();

    // Size configuration
    const sizeConfig = radioSizes[size];

    // Handle change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e);
      if (groupContext?.onChange && value) {
        groupContext.onChange(value);
      }
    };

    // Base radio element
    const radioElement = (
      <div className="relative">
        <input
          ref={ref}
          id={radioId}
          type="radio"
          name={radioName}
          value={value}
          checked={isChecked}
          disabled={disabled}
          onChange={handleChange}
          className="sr-only peer"
          {...props}
        />
        
        {/* Custom Radio */}
        <div className={cn(
          // Base styles
          'relative',
          'rounded-full',
          'border-2',
          'transition-all duration-200',
          'flex items-center justify-center',
          
          // Size
          sizeConfig.outer,
          
          // States
          disabled
            ? 'border-[#B5B5B3]/30 bg-[#F1F1F1]/50 cursor-not-allowed'
            : isError
            ? 'border-red-500'
            : isChecked
            ? 'border-[#171719]'
            : 'border-[#B5B5B3] hover:border-[#171719]',
          
          // Focus (when label is clicked or keyboard nav)
          'peer-focus:ring-2 peer-focus:ring-[#171719]/20',
          
          // Custom className
          className
        )}>
          {/* Inner Circle */}
          {isChecked && (
            <div className={cn(
              'rounded-full',
              'bg-[#171719]',
              'transition-all duration-200',
              sizeConfig.inner,
              disabled && 'bg-[#B5B5B3]'
            )} />
          )}
        </div>
      </div>
    );

    // If no label, return just the radio
    if (!label && !helperText) {
      return radioElement;
    }

    // With label/helper text
    return (
      <div className={cn('relative', containerClassName)}>
        <label
          htmlFor={radioId}
          className={cn(
            'flex items-start',
            sizeConfig.gap,
            disabled ? 'cursor-not-allowed' : 'cursor-pointer',
            labelPosition === 'left' && 'flex-row-reverse'
          )}
        >
          {radioElement}
          
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
      </div>
    );
  }
);

Radio.displayName = 'Radio';

// ============================================
// RADIO GROUP COMPONENT
// ============================================

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  (
    {
      name,
      value,
      onChange,
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
      <RadioGroupContext.Provider value={{ name, value, onChange, error: !!error }}>
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

          {/* Radio Buttons */}
          <div 
            role="radiogroup"
            aria-labelledby={label ? `${name}-label` : undefined}
            className={cn(
              'flex',
              orientation === 'vertical' ? 'flex-col' : 'flex-row flex-wrap',
              groupGaps[gap]
            )}
          >
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
      </RadioGroupContext.Provider>
    );
  }
);

RadioGroup.displayName = 'RadioGroup';

export { Radio, RadioGroup };

// ============================================
// USAGE EXAMPLES
// ============================================

/**
 * Basic Radio Group
 * @example
 * ```tsx
 * <RadioGroup
 *   name="plan"
 *   value={selectedPlan}
 *   onChange={setSelectedPlan}
 *   label="Choose your plan"
 * >
 *   <Radio value="starter" label="Selfie Starter Kit - $67" />
 *   <Radio value="branded" label="Branded by Selfie™ - $397" />
 *   <Radio value="vip" label="VIP Access - Premium" />
 * </RadioGroup>
 * ```
 */

/**
 * With Helper Text
 * @example
 * ```tsx
 * <RadioGroup
 *   name="frequency"
 *   value={frequency}
 *   onChange={setFrequency}
 *   label="Billing frequency"
 * >
 *   <Radio 
 *     value="monthly" 
 *     label="Monthly"
 *     helperText="$39/month, cancel anytime"
 *   />
 *   <Radio 
 *     value="yearly" 
 *     label="Yearly"
 *     helperText="$390/year, save 17%"
 *   />
 * </RadioGroup>
 * ```
 */

/**
 * Horizontal Layout
 * @example
 * ```tsx
 * <RadioGroup
 *   name="size"
 *   value={size}
 *   onChange={setSize}
 *   orientation="horizontal"
 *   gap="lg"
 * >
 *   <Radio value="sm" label="Small" />
 *   <Radio value="md" label="Medium" />
 *   <Radio value="lg" label="Large" />
 * </RadioGroup>
 * ```
 */

/**
 * Error State
 * @example
 * ```tsx
 * <RadioGroup
 *   name="payment"
 *   value={paymentMethod}
 *   onChange={setPaymentMethod}
 *   label="Payment method"
 *   error="Please select a payment method"
 * >
 *   <Radio value="card" label="Credit/Debit Card" />
 *   <Radio value="paypal" label="PayPal" />
 * </RadioGroup>
 * ```
 */

/**
 * Different Sizes
 * @example
 * ```tsx
 * <div className="space-y-8">
 *   <RadioGroup name="size-sm" label="Small size">
 *     <Radio size="sm" value="1" label="Option 1" />
 *     <Radio size="sm" value="2" label="Option 2" />
 *   </RadioGroup>
 *   
 *   <RadioGroup name="size-default" label="Default size">
 *     <Radio size="default" value="1" label="Option 1" />
 *     <Radio size="default" value="2" label="Option 2" />
 *   </RadioGroup>
 *   
 *   <RadioGroup name="size-lg" label="Large size">
 *     <Radio size="lg" value="1" label="Option 1" />
 *     <Radio size="lg" value="2" label="Option 2" />
 *   </RadioGroup>
 * </div>
 * ```
 */

/**
 * Standalone Radio (outside group)
 * @example
 * ```tsx
 * <Radio
 *   name="terms"
 *   value="agree"
 *   label="I agree to receive marketing emails"
 *   checked={marketingConsent}
 *   onChange={(e) => setMarketingConsent(e.target.checked)}
 * />
 * ```
 */