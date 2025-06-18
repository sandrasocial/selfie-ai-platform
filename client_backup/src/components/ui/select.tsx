// /components/ui/select.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';
import { 
  colors, 
  typography, 
  spacing, 
  animation, 
  elevation 
} from '@/lib/constants/design-system';
import { ChevronDown, Check, X, Search } from 'lucide-react';

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  group?: string;
}

export interface SelectProps {
  /** Options to display */
  options: SelectOption[];
  
  /** Current value (single select) */
  value?: string;
  
  /** Current values (multi select) */
  values?: string[];
  
  /** Change handler (single select) */
  onChange?: (value: string) => void;
  
  /** Change handler (multi select) */
  onMultiChange?: (values: string[]) => void;
  
  /** Placeholder text */
  placeholder?: string;
  
  /** Enable multi-select */
  multiple?: boolean;
  
  /** Enable search within select */
  searchable?: boolean;
  
  /** Visual size variant */
  size?: 'sm' | 'default' | 'lg';
  
  /** Error state */
  error?: boolean | string;
  
  /** Success state */
  success?: boolean;
  
  /** Helper text */
  helperText?: string;
  
  /** Label */
  label?: string;
  
  /** Disabled state */
  disabled?: boolean;
  
  /** Loading state */
  loading?: boolean;
  
  /** Full width */
  fullWidth?: boolean;
  
  /** Max height for dropdown */
  maxHeight?: number;
  
  /** Additional CSS classes */
  className?: string;
  
  /** Container className */
  containerClassName?: string;
}

// ============================================
// STYLE CONFIGURATIONS
// ============================================

const selectSizes = {
  sm: {
    trigger: cn(
      'h-10 px-3',
      'text-sm',
      'min-h-[40px]'
    ),
    icon: 'w-4 h-4',
    tag: 'px-2 py-0.5 text-xs',
    option: 'px-3 py-2 text-sm'
  },
  default: {
    trigger: cn(
      'h-12 px-4',
      'text-base',
      'min-h-[48px]'
    ),
    icon: 'w-5 h-5',
    tag: 'px-2.5 py-1 text-sm',
    option: 'px-4 py-3 text-base'
  },
  lg: {
    trigger: cn(
      'h-14 px-5',
      'text-lg',
      'min-h-[56px]'
    ),
    icon: 'w-6 h-6',
    tag: 'px-3 py-1.5 text-base',
    option: 'px-5 py-4 text-lg'
  }
};

// ============================================
// SELECT COMPONENT
// ============================================

const Select = React.forwardRef<HTMLDivElement, SelectProps>(
  (
    {
      options,
      value,
      values = [],
      onChange,
      onMultiChange,
      placeholder = 'Select...',
      multiple = false,
      searchable = false,
      size = 'default',
      error = false,
      success = false,
      helperText,
      label,
      disabled = false,
      loading = false,
      fullWidth = false,
      maxHeight = 300,
      className,
      containerClassName,
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [highlightedIndex, setHighlightedIndex] = React.useState(-1);
    
    const triggerRef = React.useRef<HTMLButtonElement>(null);
    const dropdownRef = React.useRef<HTMLDivElement>(null);
    const searchInputRef = React.useRef<HTMLInputElement>(null);

    // Size configuration
    const sizeConfig = selectSizes[size];

    // Filter options based on search
    const filteredOptions = React.useMemo(() => {
      if (!searchQuery) return options;
      
      return options.filter(option =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        option.value.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }, [options, searchQuery]);

    // Group options if groups are present
    const groupedOptions = React.useMemo(() => {
      const groups: Record<string, SelectOption[]> = {};
      const ungrouped: SelectOption[] = [];

      filteredOptions.forEach(option => {
        if (option.group) {
          if (!groups[option.group]) {
            groups[option.group] = [];
          }
          groups[option.group].push(option);
        } else {
          ungrouped.push(option);
        }
      });

      return { groups, ungrouped };
    }, [filteredOptions]);

    // Get display text
    const getDisplayText = () => {
      if (multiple) {
        if (values.length === 0) return placeholder;
        if (values.length === 1) {
          const option = options.find(o => o.value === values[0]);
          return option?.label || values[0];
        }
        return `${values.length} selected`;
      } else {
        const option = options.find(o => o.value === value);
        return option?.label || placeholder;
      }
    };

    // Handle option click
    const handleOptionClick = (optionValue: string) => {
      if (multiple) {
        const newValues = values.includes(optionValue)
          ? values.filter(v => v !== optionValue)
          : [...values, optionValue];
        onMultiChange?.(newValues);
      } else {
        onChange?.(optionValue);
        setIsOpen(false);
      }
      setSearchQuery('');
    };

    // Handle remove tag
    const handleRemoveTag = (e: React.MouseEvent, valueToRemove: string) => {
      e.stopPropagation();
      if (multiple) {
        const newValues = values.filter(v => v !== valueToRemove);
        onMultiChange?.(newValues);
      }
    };

    // Handle keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (!isOpen) {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
          e.preventDefault();
          setIsOpen(true);
        }
        return;
      }

      switch (e.key) {
        case 'Escape':
          setIsOpen(false);
          triggerRef.current?.focus();
          break;
          
        case 'ArrowDown':
          e.preventDefault();
          setHighlightedIndex(prev => 
            prev < filteredOptions.length - 1 ? prev + 1 : prev
          );
          break;
          
        case 'ArrowUp':
          e.preventDefault();
          setHighlightedIndex(prev => prev > 0 ? prev - 1 : prev);
          break;
          
        case 'Enter':
          e.preventDefault();
          if (highlightedIndex >= 0) {
            handleOptionClick(filteredOptions[highlightedIndex].value);
          }
          break;
      }
    };

    // Handle click outside
    React.useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(e.target as Node) &&
          !triggerRef.current?.contains(e.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
      }
    }, [isOpen]);

    // Focus search input when opened
    React.useEffect(() => {
      if (isOpen && searchable) {
        searchInputRef.current?.focus();
      }
    }, [isOpen, searchable]);

    // State classes
    const stateClass = disabled
      ? 'border-[#B5B5B3]/20 bg-[#F1F1F1]/50 cursor-not-allowed'
      : error
      ? 'border-red-500 focus:border-red-500 hover:border-red-500'
      : success
      ? 'border-green-500 focus:border-green-500 hover:border-green-500'
      : 'border-[#B5B5B3]/30 focus:border-[#171719] hover:border-[#B5B5B3]/50';

    return (
      <div ref={ref} className={cn('relative', fullWidth && 'w-full', containerClassName)}>
        {/* Label */}
        {label && (
          <label className={cn(
            'block mb-2',
            'font-["Neue_Einstellung",sans-serif]',
            'text-sm font-medium',
            error ? 'text-red-500' : 'text-[#171719]'
          )}>
            {label}
          </label>
        )}

        {/* Trigger Button */}
        <button
          ref={triggerRef}
          type="button"
          disabled={disabled || loading}
          onClick={() => setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          className={cn(
            // Base styles
            'w-full',
            'font-["Neue_Einstellung",sans-serif]',
            'bg-white',
            'border',
            'outline-none',
            'transition-all duration-200',
            'flex items-center justify-between gap-2',
            
            // Size styles
            sizeConfig.trigger,
            
            // State styles
            stateClass,
            
            // Focus styles
            'focus:outline-none focus:ring-2 focus:ring-[#171719]/10',
            
            // Custom className
            className
          )}
        >
          {/* Display Value / Multi-select Tags */}
          <div className="flex-1 text-left">
            {multiple && values.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {values.slice(0, 2).map(val => {
                  const option = options.find(o => o.value === val);
                  return (
                    <span
                      key={val}
                      className={cn(
                        'inline-flex items-center gap-1',
                        'bg-[#F1F1F1] text-[#171719]',
                        'rounded-sm',
                        sizeConfig.tag
                      )}
                    >
                      {option?.label || val}
                      <X
                        className="w-3 h-3 cursor-pointer hover:text-[#4C4B4B]"
                        onClick={(e) => handleRemoveTag(e, val)}
                      />
                    </span>
                  );
                })}
                {values.length > 2 && (
                  <span className={cn('text-[#4C4B4B]', sizeConfig.tag)}>
                    +{values.length - 2} more
                  </span>
                )}
              </div>
            ) : (
              <span className={value || (multiple && values.length > 0) ? '' : 'text-[#B5B5B3]'}>
                {getDisplayText()}
              </span>
            )}
          </div>

          {/* Chevron Icon */}
          <ChevronDown className={cn(
            sizeConfig.icon,
            'text-[#4C4B4B]',
            'transition-transform duration-200',
            isOpen && 'rotate-180'
          )} />
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div
            ref={dropdownRef}
            className={cn(
              'absolute z-50 w-full mt-1',
              'bg-white',
              'border border-[#B5B5B3]/20',
              'shadow-xl',
              'overflow-hidden',
              'animate-fadeInDown'
            )}
            style={{ maxHeight: `${maxHeight}px` }}
          >
            {/* Search Input */}
            {searchable && (
              <div className="p-3 border-b border-[#B5B5B3]/20">
                <div className="relative">
                  <Search className={cn(
                    'absolute left-3 top-1/2 -translate-y-1/2',
                    'text-[#4C4B4B]',
                    'w-4 h-4'
                  )} />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className={cn(
                      'w-full pl-9 pr-3 py-2',
                      'font-["Neue_Einstellung",sans-serif]',
                      'text-sm',
                      'border border-[#B5B5B3]/30',
                      'outline-none',
                      'focus:border-[#171719]',
                      'placeholder:text-[#B5B5B3]'
                    )}
                  />
                </div>
              </div>
            )}

            {/* Options List */}
            <div className="overflow-y-auto" style={{ maxHeight: searchable ? maxHeight - 60 : maxHeight }}>
              {/* Ungrouped Options */}
              {groupedOptions.ungrouped.map((option, index) => {
                const isSelected = multiple 
                  ? values.includes(option.value)
                  : value === option.value;
                const isHighlighted = highlightedIndex === index;

                return (
                  <button
                    key={option.value}
                    type="button"
                    disabled={option.disabled}
                    onClick={() => handleOptionClick(option.value)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    className={cn(
                      'w-full text-left',
                      'font-["Neue_Einstellung",sans-serif]',
                      'transition-colors duration-150',
                      'flex items-center justify-between',
                      sizeConfig.option,
                      
                      // States
                      option.disabled
                        ? 'text-[#B5B5B3] cursor-not-allowed'
                        : isSelected
                        ? 'bg-[#171719] text-white'
                        : isHighlighted
                        ? 'bg-[#F1F1F1]'
                        : 'hover:bg-[#F1F1F1]'
                    )}
                  >
                    <span>{option.label}</span>
                    {isSelected && (
                      <Check className={cn(sizeConfig.icon, 'text-white')} />
                    )}
                  </button>
                );
              })}

              {/* Grouped Options */}
              {Object.entries(groupedOptions.groups).map(([groupName, groupOptions]) => (
                <div key={groupName}>
                  <div className={cn(
                    'px-4 py-2',
                    'font-["Neue_Einstellung",sans-serif]',
                    'text-xs uppercase tracking-wider',
                    'text-[#4C4B4B]',
                    'bg-[#F1F1F1]'
                  )}>
                    {groupName}
                  </div>
                  {groupOptions.map((option) => {
                    const isSelected = multiple 
                      ? values.includes(option.value)
                      : value === option.value;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        disabled={option.disabled}
                        onClick={() => handleOptionClick(option.value)}
                        className={cn(
                          'w-full text-left',
                          'font-["Neue_Einstellung",sans-serif]',
                          'transition-colors duration-150',
                          'flex items-center justify-between',
                          sizeConfig.option,
                          
                          // States
                          option.disabled
                            ? 'text-[#B5B5B3] cursor-not-allowed'
                            : isSelected
                            ? 'bg-[#171719] text-white'
                            : 'hover:bg-[#F1F1F1]'
                        )}
                      >
                        <span>{option.label}</span>
                        {isSelected && (
                          <Check className={cn(sizeConfig.icon, 'text-white')} />
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}

              {/* No Results */}
              {filteredOptions.length === 0 && (
                <div className={cn(
                  'text-center py-8',
                  'font-["Neue_Einstellung",sans-serif]',
                  'text-[#B5B5B3]'
                )}>
                  No options found
                </div>
              )}
            </div>
          </div>
        )}

        {/* Helper Text / Error Message */}
        {(helperText || (typeof error === 'string' && error)) && (
          <p className={cn(
            'mt-1.5',
            'font-["Neue_Einstellung",sans-serif]',
            'text-sm',
            error ? 'text-red-500' : 'text-[#4C4B4B]'
          )}>
            {typeof error === 'string' ? error : helperText}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export { Select };

// ============================================
// USAGE EXAMPLES
// ============================================

/**
 * Basic Select
 * @example
 * ```tsx
 * const options = [
 *   { value: 'starter', label: 'Selfie Starter Kit' },
 *   { value: 'branded', label: 'Branded by Selfie™' },
 *   { value: 'vip', label: 'VIP Access' }
 * ];
 * 
 * <Select
 *   options={options}
 *   value={selected}
 *   onChange={setSelected}
 *   placeholder="Choose a course"
 * />
 * ```
 */

/**
 * Multi-Select
 * @example
 * ```tsx
 * <Select
 *   label="Select Tools"
 *   options={toolOptions}
 *   values={selectedTools}
 *   onMultiChange={setSelectedTools}
 *   multiple
 *   searchable
 * />
 * ```
 */

/**
 * Grouped Options
 * @example
 * ```tsx
 * const groupedOptions = [
 *   { value: 'studio', label: 'AI Studio', group: 'Tools' },
 *   { value: 'chat', label: 'Sandra AI Chat', group: 'Tools' },
 *   { value: 'starter', label: 'Starter Kit', group: 'Courses' },
 *   { value: 'branded', label: 'Branded by Selfie', group: 'Courses' }
 * ];
 * 
 * <Select
 *   options={groupedOptions}
 *   searchable
 * />
 * ```
 */

/**
 * With Error State
 * @example
 * ```tsx
 * <Select
 *   label="Country"
 *   options={countries}
 *   error="Please select your country"
 *   required
 * />
 * ```
 */