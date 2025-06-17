// /components/ui/form-field.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';
import { 
  colors, 
  typography, 
  spacing, 
  animation, 
  elevation 
} from '@/lib/constants/design-system';
import { AlertCircle, Info, Check } from 'lucide-react';

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface FormFieldProps {
  /** Field label */
  label?: string;
  
  /** Field name (for form handling) */
  name?: string;
  
  /** Required field indicator */
  required?: boolean;
  
  /** Helper text below field */
  helperText?: string;
  
  /** Error message */
  error?: string;
  
  /** Success message */
  success?: string;
  
  /** Info/tooltip content */
  info?: string;
  
  /** Hide label visually (still accessible) */
  hideLabel?: boolean;
  
  /** Additional label className */
  labelClassName?: string;
  
  /** Additional container className */
  className?: string;
  
  /** Field content (input, select, etc.) */
  children: React.ReactNode;
}

export interface FormSectionProps {
  /** Section title */
  title?: string;
  
  /** Section description */
  description?: string;
  
  /** Separator line */
  separator?: boolean;
  
  /** Additional className */
  className?: string;
  
  /** Section content */
  children: React.ReactNode;
}

export interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  /** Loading state */
  loading?: boolean;
  
  /** Error message */
  error?: string;
  
  /** Success message */
  success?: string;
  
  /** Form layout */
  layout?: 'vertical' | 'horizontal';
  
  /** Gap between fields */
  gap?: 'sm' | 'default' | 'lg';
  
  /** Additional className */
  className?: string;
  
  /** Form content */
  children: React.ReactNode;
}

// ============================================
// STYLE CONFIGURATIONS
// ============================================

const formGaps = {
  sm: 'space-y-4',
  default: 'space-y-6',
  lg: 'space-y-8'
};

// ============================================
// FORM FIELD COMPONENT
// ============================================

const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  (
    {
      label,
      name,
      required = false,
      helperText,
      error,
      success,
      info,
      hideLabel = false,
      labelClassName,
      className,
      children,
    },
    ref
  ) => {
    const fieldId = React.useId();

    return (
      <div ref={ref} className={cn('space-y-2', className)}>
        {/* Label */}
        {label && (
          <div className="flex items-center justify-between">
            <label
              htmlFor={fieldId}
              className={cn(
                'font-["Neue_Einstellung",sans-serif]',
                'text-sm font-medium',
                'text-[#171719]',
                error && 'text-red-500',
                hideLabel && 'sr-only',
                labelClassName
              )}
            >
              {label}
              {required && (
                <span className="ml-1 text-red-500" aria-label="required">
                  *
                </span>
              )}
            </label>
            
            {/* Info Icon */}
            {info && !hideLabel && (
              <div className="group relative">
                <button
                  type="button"
                  className={cn(
                    'p-1',
                    'text-[#B5B5B3] hover:text-[#4C4B4B]',
                    'transition-colors duration-200'
                  )}
                  aria-label="More information"
                >
                  <Info className="w-4 h-4" />
                </button>
                
                {/* Tooltip */}
                <div className={cn(
                  'absolute right-0 top-full mt-2 z-10',
                  'w-64 p-3',
                  'bg-[#171719] text-white',
                  'text-sm',
                  'opacity-0 invisible',
                  'group-hover:opacity-100 group-hover:visible',
                  'transition-all duration-200',
                  'pointer-events-none'
                )}>
                  {info}
                  <div className={cn(
                    'absolute bottom-full right-2',
                    'w-0 h-0',
                    'border-l-[6px] border-l-transparent',
                    'border-r-[6px] border-r-transparent',
                    'border-b-[6px] border-b-[#171719]'
                  )} />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Field Content */}
        <div id={fieldId}>
          {children}
        </div>

        {/* Messages */}
        {(helperText || error || success) && (
          <div className="space-y-1">
            {/* Error Message */}
            {error && (
              <p className={cn(
                'flex items-center gap-2',
                'font-["Neue_Einstellung",sans-serif]',
                'text-sm',
                'text-red-500'
              )}>
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </p>
            )}

            {/* Success Message */}
            {success && !error && (
              <p className={cn(
                'flex items-center gap-2',
                'font-["Neue_Einstellung",sans-serif]',
                'text-sm',
                'text-green-600'
              )}>
                <Check className="w-4 h-4 flex-shrink-0" />
                <span>{success}</span>
              </p>
            )}

            {/* Helper Text */}
            {helperText && !error && !success && (
              <p className={cn(
                'font-["Neue_Einstellung",sans-serif]',
                'text-sm',
                'text-[#4C4B4B]'
              )}>
                {helperText}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);

FormField.displayName = 'FormField';

// ============================================
// FORM SECTION COMPONENT
// ============================================

const FormSection = React.forwardRef<HTMLDivElement, FormSectionProps>(
  (
    {
      title,
      description,
      separator = true,
      className,
      children,
    },
    ref
  ) => {
    return (
      <div ref={ref} className={cn('space-y-6', className)}>
        {/* Section Header */}
        {(title || description) && (
          <div className={cn(
            'space-y-2',
            separator && 'pb-6 border-b border-[#B5B5B3]/20'
          )}>
            {title && (
              <h3 className={cn(
                'font-["Bodoni_Moda",serif]',
                'text-2xl font-normal',
                'text-[#171719]'
              )}>
                {title}
              </h3>
            )}
            {description && (
              <p className={cn(
                'font-["Neue_Einstellung",sans-serif]',
                'text-base',
                'text-[#4C4B4B]'
              )}>
                {description}
              </p>
            )}
          </div>
        )}

        {/* Section Content */}
        <div className="space-y-6">
          {children}
        </div>
      </div>
    );
  }
);

FormSection.displayName = 'FormSection';

// ============================================
// FORM COMPONENT
// ============================================

const Form = React.forwardRef<HTMLFormElement, FormProps>(
  (
    {
      loading = false,
      error,
      success,
      layout = 'vertical',
      gap = 'default',
      className,
      children,
      onSubmit,
      ...props
    },
    ref
  ) => {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      if (loading) {
        e.preventDefault();
        return;
      }
      onSubmit?.(e);
    };

    return (
      <form
        ref={ref}
        onSubmit={handleSubmit}
        className={cn(
          formGaps[gap],
          className
        )}
        {...props}
      >
        {/* Form Messages */}
        {(error || success) && (
          <div className="space-y-2">
            {/* Error Message */}
            {error && (
              <div className={cn(
                'p-4',
                'bg-red-50 border border-red-200',
                'flex items-start gap-3'
              )}>
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className={cn(
                    'font-["Neue_Einstellung",sans-serif]',
                    'text-sm font-medium',
                    'text-red-800'
                  )}>
                    {error}
                  </p>
                </div>
              </div>
            )}

            {/* Success Message */}
            {success && !error && (
              <div className={cn(
                'p-4',
                'bg-green-50 border border-green-200',
                'flex items-start gap-3'
              )}>
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className={cn(
                    'font-["Neue_Einstellung",sans-serif]',
                    'text-sm font-medium',
                    'text-green-800'
                  )}>
                    {success}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Form Content */}
        <fieldset disabled={loading} className={cn(loading && 'opacity-60')}>
          {children}
        </fieldset>
      </form>
    );
  }
);

Form.displayName = 'Form';

export { Form, FormField, FormSection };

// ============================================
// USAGE EXAMPLES
// ============================================

/**
 * Basic Form Field
 * @example
 * ```tsx
 * <FormField
 *   label="Email Address"
 *   required
 *   error={errors.email}
 * >
 *   <Input
 *     type="email"
 *     placeholder="queen@example.com"
 *     value={email}
 *     onChange={(e) => setEmail(e.target.value)}
 *   />
 * </FormField>
 * ```
 */

/**
 * With Helper Text and Info
 * @example
 * ```tsx
 * <FormField
 *   label="Password"
 *   required
 *   helperText="Must be at least 8 characters"
 *   info="Password must contain uppercase, lowercase, and numbers"
 *   error={errors.password}
 * >
 *   <Input
 *     type="password"
 *     value={password}
 *     onChange={(e) => setPassword(e.target.value)}
 *   />
 * </FormField>
 * ```
 */

/**
 * Select Field
 * @example
 * ```tsx
 * <FormField
 *   label="Country"
 *   required
 *   error={errors.country}
 * >
 *   <Select
 *     options={countries}
 *     value={country}
 *     onChange={setCountry}
 *     placeholder="Select your country"
 *   />
 * </FormField>
 * ```
 */

/**
 * Complete Form Example
 * @example
 * ```tsx
 * <Form
 *   onSubmit={handleSubmit}
 *   loading={isSubmitting}
 *   error={formError}
 *   success={successMessage}
 * >
 *   <FormSection
 *     title="Account Information"
 *     description="Create your SELFIE AI™ account"
 *   >
 *     <FormField label="Full Name" required>
 *       <Input
 *         value={formData.name}
 *         onChange={(e) => setFormData({
 *           ...formData,
 *           name: e.target.value
 *         })}
 *       />
 *     </FormField>
 *     
 *     <FormField label="Email" required>
 *       <Input
 *         type="email"
 *         value={formData.email}
 *         onChange={(e) => setFormData({
 *           ...formData,
 *           email: e.target.value
 *         })}
 *       />
 *     </FormField>
 *   </FormSection>
 *   
 *   <FormSection
 *     title="Preferences"
 *     description="Customize your experience"
 *   >
 *     <FormField label="Notification Settings">
 *       <CheckboxGroup>
 *         <Checkbox
 *           label="Email notifications"
 *           checked={formData.emailNotifications}
 *           onChange={(e) => setFormData({
 *             ...formData,
 *             emailNotifications: e.target.checked
 *           })}
 *         />
 *         <Checkbox
 *           label="Marketing updates"
 *           checked={formData.marketingUpdates}
 *           onChange={(e) => setFormData({
 *             ...formData,
 *             marketingUpdates: e.target.checked
 *           })}
 *         />
 *       </CheckboxGroup>
 *     </FormField>
 *   </FormSection>
 *   
 *   <div className="pt-6">
 *     <Button type="submit" fullWidth size="lg">
 *       Create Account
 *     </Button>
 *   </div>
 * </Form>
 * ```
 */