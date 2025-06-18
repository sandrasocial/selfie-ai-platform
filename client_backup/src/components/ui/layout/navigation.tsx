// /components/layout/navigation.tsx
import * as React from 'react';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { cn } from '@/lib/utils';
import { 
  colors, 
  typography, 
  spacing, 
  animation, 
  elevation 
} from '@/lib/constants/design-system';
import { Button } from '@/components/ui/button';
import { 
  Menu, 
  X, 
  ChevronDown, 
  Search, 
  User, 
  LogOut,
  Crown,
  Sparkles,
  Lock,
  ArrowRight,
  Home,
  Camera,
  BookOpen,
  MessageCircle,
  Calendar,
  FileText
} from 'lucide-react';

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface NavigationProps {
  /** Current user data */
  user?: {
    id: string;
    email: string;
    name?: string;
    avatar?: string;
    purchases?: string[];
    vipStatus?: boolean;
  } | null;
  
  /** Show search in navigation */
  showSearch?: boolean;
  
  /** Additional CSS classes */
  className?: string;
  
  /** Logo click handler (default: navigate to home) */
  onLogoClick?: () => void;
  
  /** Search handler */
  onSearch?: (query: string) => void;
}

interface NavItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  children?: NavItem[];
  requiresAuth?: boolean;
  requiresPurchase?: string;
  requiresVip?: boolean;
  badge?: string;
  mobileOnly?: boolean;
  desktopOnly?: boolean;
}

interface DropdownProps {
  items: NavItem[];
  isOpen: boolean;
  onClose: () => void;
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: NavItem[];
  user: NavigationProps['user'];
  currentPath: string;
}

interface UserMenuProps {
  user: NonNullable<NavigationProps['user']>;
  isOpen: boolean;
  onClose: () => void;
}

// ============================================
// NAVIGATION ROUTES
// ============================================

const NAVIGATION_ROUTES: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: <Home className="w-4 h-4" />,
    requiresAuth: true,
  },
  {
    label: 'Tools',
    icon: <Sparkles className="w-4 h-4" />,
    children: [
      {
        label: 'AI Studio',
        href: '/studio',
        icon: <Camera className="w-4 h-4" />,
        requiresAuth: true,
      },
      {
        label: 'Sandra AI Chat',
        href: '/sandra-ai',
        icon: <MessageCircle className="w-4 h-4" />,
        requiresAuth: true,
      },
      {
        label: 'Content Calendar',
        href: '/calendar',
        icon: <Calendar className="w-4 h-4" />,
        requiresAuth: true,
      },
      {
        label: 'Workbooks',
        href: '/workbooks',
        icon: <FileText className="w-4 h-4" />,
        requiresAuth: true,
      },
    ],
  },
  {
    label: 'Courses',
    icon: <BookOpen className="w-4 h-4" />,
    children: [
      {
        label: 'Selfie Starter Kit',
        href: '/courses/starter-kit',
        requiresPurchase: 'starter-kit',
        badge: 'New',
      },
      {
        label: 'Branded by Selfie™',
        href: '/courses/branded',
        requiresPurchase: 'branded-by-selfie',
      },
      {
        label: 'VIP Masterclass',
        href: '/courses/vip',
        requiresVip: true,
        icon: <Crown className="w-4 h-4" />,
      },
    ],
  },
  {
    label: 'Pricing',
    href: '/pricing',
  },
];

// ============================================
// UTILITY FUNCTIONS
// ============================================

const hasAccess = (
  item: NavItem, 
  user: NavigationProps['user']
): boolean => {
  if (!item.requiresAuth && !item.requiresPurchase && !item.requiresVip) {
    return true;
  }
  
  if (!user) return false;
  
  if (item.requiresAuth && !user.id) return false;
  
  if (item.requiresPurchase && !user.purchases?.includes(item.requiresPurchase)) {
    return false;
  }
  
  if (item.requiresVip && !user.vipStatus) return false;
  
  return true;
};

const isActiveRoute = (href: string, currentPath: string): boolean => {
  if (href === '/') return currentPath === '/';
  return currentPath.startsWith(href);
};

// ============================================
// DROPDOWN COMPONENT
// ============================================

const Dropdown: React.FC<DropdownProps> = ({ items, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40"
        onClick={onClose}
      />
      
      {/* Dropdown Menu */}
      <div className={cn(
        'absolute top-full left-0 mt-2 z-50',
        'min-w-[240px]',
        'bg-white',
        'border border-[#B5B5B3]/20',
        'shadow-xl',
        'animate-fadeInDown'
      )}>
        {items.map((item, index) => (
          <Link
            key={index}
            href={item.href || '#'}
            onClick={onClose}
          >
            <a className={cn(
              'flex items-center gap-3 px-6 py-4',
              'font-["Neue_Einstellung",sans-serif] text-sm',
              'text-[#171719] hover:bg-[#F1F1F1]',
              'transition-colors duration-200',
              'border-b border-[#B5B5B3]/10 last:border-0'
            )}>
              {item.icon && (
                <span className="text-[#4C4B4B]">
                  {item.icon}
                </span>
              )}
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className={cn(
                  'px-2 py-0.5',
                  'text-[10px] uppercase tracking-wider',
                  'bg-[#171719] text-white'
                )}>
                  {item.badge}
                </span>
              )}
              {!hasAccess(item, null) && (
                <Lock className="w-3 h-3 text-[#B5B5B3]" />
              )}
            </a>
          </Link>
        ))}
      </div>
    </>
  );
};

// ============================================
// USER MENU COMPONENT
// ============================================

const UserMenu: React.FC<UserMenuProps> = ({ user, isOpen, onClose }) => {
  if (!isOpen) return null;

  const menuItems = [
    {
      label: user.name || user.email,
      subtitle: user.vipStatus ? 'VIP Member' : 'Member',
      icon: <User className="w-4 h-4" />,
      href: '/profile',
    },
    {
      label: 'Logout',
      icon: <LogOut className="w-4 h-4" />,
      href: '/api/logout',
      danger: true,
    },
  ];

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40"
        onClick={onClose}
      />
      
      {/* User Menu */}
      <div className={cn(
        'absolute top-full right-0 mt-2 z-50',
        'min-w-[280px]',
        'bg-white',
        'border border-[#B5B5B3]/20',
        'shadow-xl',
        'animate-fadeInDown'
      )}>
        {/* User Info */}
        <div className="px-6 py-4 border-b border-[#B5B5B3]/10">
          <div className="flex items-center gap-4">
            <div className={cn(
              'w-12 h-12 rounded-full overflow-hidden',
              'bg-[#F1F1F1] border border-[#B5B5B3]/20',
              'flex items-center justify-center'
            )}>
              {user.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={user.name || user.email}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-6 h-6 text-[#4C4B4B]" />
              )}
            </div>
            <div className="flex-1">
              <p className={cn(
                'font-["Neue_Einstellung",sans-serif]',
                'text-sm font-medium text-[#171719]'
              )}>
                {user.name || 'Queen'}
              </p>
              <p className={cn(
                'font-["Neue_Einstellung",sans-serif]',
                'text-xs text-[#B5B5B3]'
              )}>
                {user.vipStatus ? (
                  <span className="flex items-center gap-1">
                    <Crown className="w-3 h-3" />
                    VIP Member
                  </span>
                ) : (
                  'Member'
                )}
              </p>
            </div>
          </div>
        </div>
        
        {/* Menu Items */}
        {menuItems.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            onClick={onClose}
          >
            <a className={cn(
              'flex items-center gap-3 px-6 py-4',
              'font-["Neue_Einstellung",sans-serif] text-sm',
              item.danger 
                ? 'text-red-600 hover:bg-red-50' 
                : 'text-[#171719] hover:bg-[#F1F1F1]',
              'transition-colors duration-200'
            )}>
              <span className={item.danger ? 'text-red-600' : 'text-[#4C4B4B]'}>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </a>
          </Link>
        ))}
      </div>
    </>
  );
};

// ============================================
// MOBILE MENU COMPONENT
// ============================================

const MobileMenu: React.FC<MobileMenuProps> = ({ 
  isOpen, 
  onClose, 
  navItems, 
  user, 
  currentPath 
}) => {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (label: string) => {
    setExpandedItems(prev =>
      prev.includes(label)
        ? prev.filter(l => l !== label)
        : [...prev, label]
    );
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={cn(
          'fixed inset-0 bg-black/50 z-40 lg:hidden',
          'transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />
      
      {/* Slide-out Menu */}
      <div className={cn(
        'fixed top-0 right-0 bottom-0 w-[80vw] max-w-sm z-50 lg:hidden',
        'bg-white',
        'transform transition-transform duration-300 ease-out',
        isOpen ? 'translate-x-0' : 'translate-x-full'
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#B5B5B3]/20">
          <h2 className={cn(
            'font-["Bodoni_Moda",serif]',
            'text-xl text-[#171719]'
          )}>
            Menu
          </h2>
          <button
            onClick={onClose}
            className={cn(
              'p-2 -mr-2',
              'text-[#4C4B4B] hover:text-[#171719]',
              'transition-colors duration-200'
            )}
            aria-label="Close menu"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        {/* User Info (if logged in) */}
        {user && (
          <div className="px-6 py-4 bg-[#F1F1F1] border-b border-[#B5B5B3]/20">
            <div className="flex items-center gap-3">
              <div className={cn(
                'w-10 h-10 rounded-full overflow-hidden',
                'bg-white border border-[#B5B5B3]/20',
                'flex items-center justify-center'
              )}>
                {user.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.name || user.email}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-5 h-5 text-[#4C4B4B]" />
                )}
              </div>
              <div className="flex-1">
                <p className={cn(
                  'font-["Neue_Einstellung",sans-serif]',
                  'text-sm font-medium text-[#171719]'
                )}>
                  {user.name || 'Queen'}
                </p>
                <p className={cn(
                  'font-["Neue_Einstellung",sans-serif]',
                  'text-xs text-[#4C4B4B]'
                )}>
                  {user.email}
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto py-6">
          {navItems.map((item, index) => {
            const isActive = item.href && isActiveRoute(item.href, currentPath);
            const isExpanded = expandedItems.includes(item.label);
            const accessible = hasAccess(item, user);
            
            return (
              <div key={index}>
                {/* Main Item */}
                {item.href ? (
                  <Link href={item.href} onClick={onClose}>
                    <a className={cn(
                      'flex items-center gap-3 px-6 py-3',
                      'font-["Neue_Einstellung",sans-serif] text-sm',
                      'transition-all duration-200',
                      isActive
                        ? 'bg-[#171719] text-white'
                        : accessible
                          ? 'text-[#171719] hover:bg-[#F1F1F1]'
                          : 'text-[#B5B5B3] cursor-not-allowed'
                    )}>
                      {item.icon && (
                        <span className={isActive ? 'text-white' : 'text-[#4C4B4B]'}>
                          {item.icon}
                        </span>
                      )}
                      <span className="flex-1">{item.label}</span>
                      {item.badge && (
                        <span className={cn(
                          'px-2 py-0.5',
                          'text-[10px] uppercase tracking-wider',
                          isActive ? 'bg-white text-[#171719]' : 'bg-[#171719] text-white'
                        )}>
                          {item.badge}
                        </span>
                      )}
                      {!accessible && <Lock className="w-3 h-3" />}
                    </a>
                  </Link>
                ) : (
                  <button
                    onClick={() => toggleExpanded(item.label)}
                    className={cn(
                      'w-full flex items-center gap-3 px-6 py-3',
                      'font-["Neue_Einstellung",sans-serif] text-sm',
                      'text-[#171719] hover:bg-[#F1F1F1]',
                      'transition-all duration-200'
                    )}
                  >
                    {item.icon && (
                      <span className="text-[#4C4B4B]">
                        {item.icon}
                      </span>
                    )}
                    <span className="flex-1 text-left">{item.label}</span>
                    <ChevronDown className={cn(
                      'w-4 h-4 text-[#4C4B4B]',
                      'transition-transform duration-200',
                      isExpanded && 'rotate-180'
                    )} />
                  </button>
                )}
                
                {/* Sub Items */}
                {item.children && isExpanded && (
                  <div className="bg-[#F1F1F1]/50">
                    {item.children.map((child, childIndex) => {
                      const childAccessible = hasAccess(child, user);
                      const childActive = child.href && isActiveRoute(child.href, currentPath);
                      
                      return (
                        <Link
                          key={childIndex}
                          href={child.href || '#'}
                          onClick={childAccessible ? onClose : undefined}
                        >
                          <a className={cn(
                            'flex items-center gap-3 px-12 py-3',
                            'font-["Neue_Einstellung",sans-serif] text-sm',
                            'transition-all duration-200',
                            childActive
                              ? 'bg-[#171719] text-white'
                              : childAccessible
                                ? 'text-[#171719] hover:bg-[#F1F1F1]'
                                : 'text-[#B5B5B3] cursor-not-allowed'
                          )}>
                            {child.icon && (
                              <span className={childActive ? 'text-white' : 'text-[#4C4B4B]'}>
                                {child.icon}
                              </span>
                            )}
                            <span className="flex-1">{child.label}</span>
                            {child.badge && (
                              <span className={cn(
                                'px-2 py-0.5',
                                'text-[10px] uppercase tracking-wider',
                                childActive ? 'bg-white text-[#171719]' : 'bg-[#171719] text-white'
                              )}>
                                {child.badge}
                              </span>
                            )}
                            {!childAccessible && <Lock className="w-3 h-3" />}
                          </a>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
        
        {/* Footer Actions */}
        <div className="p-6 border-t border-[#B5B5B3]/20">
          {user ? (
            <Button 
              variant="secondary" 
              fullWidth
              onClick={() => {
                window.location.href = '/api/logout';
              }}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          ) : (
            <div className="space-y-3">
              <Link href="/login">
                <Button variant="secondary" fullWidth onClick={onClose}>
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="primary" fullWidth onClick={onClose}>
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

// ============================================
// MAIN NAVIGATION COMPONENT
// ============================================

const Navigation = React.forwardRef<HTMLElement, NavigationProps>(
  (
    {
      user,
      showSearch = false,
      className,
      onLogoClick,
      onSearch,
    },
    ref
  ) => {
    const [location] = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    // Handle scroll for nav shadow
    useEffect(() => {
      const handleScroll = () => {
        setIsScrolled(window.scrollY > 10);
      };
      
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close dropdowns on route change
    useEffect(() => {
      setActiveDropdown(null);
      setUserMenuOpen(false);
      setMobileMenuOpen(false);
    }, [location]);

    // Filter nav items based on user access
    const visibleNavItems = NAVIGATION_ROUTES.filter(item =>
      !item.mobileOnly
    );

    return (
      <>
        <nav
          ref={ref}
          className={cn(
            'fixed top-0 left-0 right-0 z-30',
            'bg-white',
            'transition-all duration-300',
            isScrolled && 'shadow-lg',
            className
          )}
        >
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-16">
            <div className="flex items-center justify-between h-16 md:h-20">
              {/* Logo */}
              <Link href="/">
                <a 
                  onClick={onLogoClick}
                  className="relative group"
                >
                  <img 
                    src="https://i.postimg.cc/L88db1fc/White-transperent-logo.png" 
                    alt="SELFIE AI™" 
                    className={cn(
                      'h-8 md:h-10 w-auto',
                      'opacity-90 hover:opacity-100',
                      'transition-opacity duration-300',
                      'invert' // Logo is white, so invert for dark nav
                    )}
                  />
                  <div className={cn(
                    'absolute -bottom-1 left-0 w-full h-px',
                    'bg-[#171719] scale-x-0 group-hover:scale-x-100',
                    'transition-transform duration-500 origin-left'
                  )} />
                </a>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center gap-8">
                {/* Main Nav Items */}
                <div className="flex items-center gap-6">
                  {visibleNavItems.map((item, index) => {
                    const isActive = item.href && isActiveRoute(item.href, location);
                    const hasDropdown = item.children && item.children.length > 0;
                    const dropdownOpen = activeDropdown === item.label;
                    
                    return (
                      <div key={index} className="relative">
                        {item.href ? (
                          <Link href={item.href}>
                            <a className={cn(
                              'flex items-center gap-2 py-2',
                              'font-["Neue_Einstellung",sans-serif]',
                              'text-[11px] uppercase tracking-[0.2em]',
                              'transition-all duration-300',
                              isActive
                                ? 'text-[#171719]'
                                : 'text-[#4C4B4B] hover:text-[#171719]'
                            )}>
                              {item.icon && (
                                <span className={isActive ? 'text-[#171719]' : 'text-[#4C4B4B]'}>
                                  {item.icon}
                                </span>
                              )}
                              <span>{item.label}</span>
                              {item.badge && (
                                <span className={cn(
                                  'ml-2 px-2 py-0.5',
                                  'text-[9px] uppercase tracking-wider',
                                  'bg-[#171719] text-white'
                                )}>
                                  {item.badge}
                                </span>
                              )}
                            </a>
                          </Link>
                        ) : (
                          <button
                            onClick={() => setActiveDropdown(dropdownOpen ? null : item.label)}
                            className={cn(
                              'flex items-center gap-2 py-2',
                              'font-["Neue_Einstellung",sans-serif]',
                              'text-[11px] uppercase tracking-[0.2em]',
                              'text-[#4C4B4B] hover:text-[#171719]',
                              'transition-all duration-300'
                            )}
                          >
                            {item.icon && <span>{item.icon}</span>}
                            <span>{item.label}</span>
                            <ChevronDown className={cn(
                              'w-3 h-3 ml-1',
                              'transition-transform duration-200',
                              dropdownOpen && 'rotate-180'
                            )} />
                          </button>
                        )}
                        
                        {/* Dropdown */}
                        {hasDropdown && (
                          <Dropdown
                            items={item.children || []}
                            isOpen={dropdownOpen}
                            onClose={() => setActiveDropdown(null)}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Search (if enabled) */}
                {showSearch && (
                  <div className="relative">
                    <button className={cn(
                      'p-2',
                      'text-[#4C4B4B] hover:text-[#171719]',
                      'transition-colors duration-200'
                    )}>
                      <Search className="w-5 h-5" />
                    </button>
                  </div>
                )}

                {/* User Menu / Auth Buttons */}
                {user ? (
                  <div className="relative ml-4">
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className={cn(
                        'flex items-center gap-2 p-2',
                        'text-[#4C4B4B] hover:text-[#171719]',
                        'transition-colors duration-200'
                      )}
                    >
                      <div className={cn(
                        'w-8 h-8 rounded-full overflow-hidden',
                        'bg-[#F1F1F1] border border-[#B5B5B3]/20',
                        'flex items-center justify-center'
                      )}>
                        {user.avatar ? (
                          <img 
                            src={user.avatar} 
                            alt={user.name || user.email}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-4 h-4 text-[#4C4B4B]" />
                        )}
                      </div>
                      <ChevronDown className={cn(
                        'w-3 h-3',
                        'transition-transform duration-200',
                        userMenuOpen && 'rotate-180'
                      )} />
                    </button>
                    
                    <UserMenu
                      user={user}
                      isOpen={userMenuOpen}
                      onClose={() => setUserMenuOpen(false)}
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-3 ml-4">
                    <Link href="/login">
                      <Button variant="ghost" size="sm">
                        Login
                      </Button>
                    </Link>
                    <Link href="/dashboard">
                      <Button size="sm">
                        Get Started
                      </Button>
                    </Link>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className={cn(
                  'lg:hidden p-2',
                  'text-[#4C4B4B] hover:text-[#171719]',
                  'transition-colors duration-200'
                )}
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile Menu */}
        <MobileMenu
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          navItems={NAVIGATION_ROUTES}
          user={user}
          currentPath={location}
        />

        {/* Spacer for fixed nav */}
        <div className="h-16 md:h-20" />
      </>
    );
  }
);

Navigation.displayName = 'Navigation';

export { Navigation };

// ============================================
// USAGE EXAMPLES
// ============================================

/**
 * Basic Navigation (Guest)
 * @example
 * ```tsx
 * <Navigation />
 * ```
 */

/**
 * Authenticated Navigation
 * @example
 * ```tsx
 * <Navigation 
 *   user={{
 *     id: '123',
 *     email: 'queen@example.com',
 *     name: 'Sandra',
 *     purchases: ['starter-kit', 'branded-by-selfie'],
 *     vipStatus: true
 *   }}
 * />
 * ```
 */

/**
 * With Search
 * @example
 * ```tsx
 * <Navigation 
 *   user={currentUser}
 *   showSearch
 *   onSearch={(query) => console.log('Search:', query)}
 * />
 * ```
 */

/**
 * Custom Logo Handler
 * @example
 * ```tsx
 * <Navigation 
 *   user={currentUser}
 *   onLogoClick={() => {
 *     // Custom analytics or navigation
 *     router.push('/');
 *   }}
 * />
 * ```
 */