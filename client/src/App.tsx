import React, { useEffect, Suspense, lazy } from 'react';
import { Route, Switch, useLocation } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { useAuthStore } from '@/stores/authStore';
import { applyRedirect } from '@/lib/redirects';
import { ROUTES } from '@/constants/routes';

// Layouts
import MainLayout from '@/components/layout/MainLayout';
import AuthLayout from '@/components/layout/AuthLayout';
import DashboardLayout from '@/components/layout/DashboardLayout';

// Loading component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-luxury-black mx-auto mb-4"></div>
      <p className="text-luxury-text-gray font-helvetica">Loading...</p>
    </div>
  </div>
);

// Lazy load pages for better performance
// Home & Marketing
const HomePage = lazy(() => import('@/pages/HomePage'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));
const TestimonialsPage = lazy(() => import('@/pages/TestimonialsPage'));
const BlogPage = lazy(() => import('@/pages/BlogPage'));
const BlogPostPage = lazy(() => import('@/pages/BlogPostPage'));

// Products (Sales Pages)
const ProductsPage = lazy(() => import('@/pages/products/ProductsPage'));
const StarterKitSalesPage = lazy(() => import('@/pages/products/StarterKitSalesPage'));
const BrandedSalesPage = lazy(() => import('@/pages/products/BrandedSalesPage'));
const VIPSalesPage = lazy(() => import('@/pages/products/VIPSalesPage'));
const ToolsSalesPage = lazy(() => import('@/pages/products/ToolsSalesPage'));
const AllAccessSalesPage = lazy(() => import('@/pages/products/AllAccessSalesPage'));

// Learning (Course Access)
const LearnDashboard = lazy(() => import('@/pages/learn/LearnDashboard'));
const StarterKitHub = lazy(() => import('@/pages/learn/starter-kit/StarterKitHub'));
const StarterKitModule = lazy(() => import('@/pages/learn/starter-kit/StarterKitModule'));
const BrandedHub = lazy(() => import('@/pages/learn/branded/BrandedHub'));
const BrandedModule = lazy(() => import('@/pages/learn/branded/BrandedModule'));
const VIPPortal = lazy(() => import('@/pages/learn/vip/VIPPortal'));
const VIPSessions = lazy(() => import('@/pages/learn/vip/VIPSessions'));
const VIPRecordings = lazy(() => import('@/pages/learn/vip/VIPRecordings'));
const VIPResources = lazy(() => import('@/pages/learn/vip/VIPResources'));

// Tools
const ToolsDashboard = lazy(() => import('@/pages/tools/ToolsDashboard'));
const SelfieStudio = lazy(() => import('@/pages/tools/SelfieStudio'));
const SandraAI = lazy(() => import('@/pages/tools/SandraAI'));
const ContentCalendar = lazy(() => import('@/pages/tools/ContentCalendar'));
const CaptionWriter = lazy(() => import('@/pages/tools/CaptionWriter'));
const BrandKitGenerator = lazy(() => import('@/pages/tools/BrandKitGenerator'));
const AnalyticsDashboard = lazy(() => import('@/pages/tools/AnalyticsDashboard'));

// Account & Profile
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const ProfilePage = lazy(() => import('@/pages/profile/ProfilePage'));
const EditProfile = lazy(() => import('@/pages/profile/EditProfile'));
const BillingPage = lazy(() => import('@/pages/profile/BillingPage'));
const PurchaseHistory = lazy(() => import('@/pages/profile/PurchaseHistory'));
const Certificates = lazy(() => import('@/pages/profile/Certificates'));

// Authentication
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const SignupPage = lazy(() => import('@/pages/auth/SignupPage'));
const ResetPasswordPage = lazy(() => import('@/pages/auth/ResetPasswordPage'));
const VerifyEmailPage = lazy(() => import('@/pages/auth/VerifyEmailPage'));

// Checkout
const CheckoutPage = lazy(() => import('@/pages/checkout/CheckoutPage'));
const CheckoutSuccess = lazy(() => import('@/pages/checkout/CheckoutSuccess'));
const CheckoutCancel = lazy(() => import('@/pages/checkout/CheckoutCancel'));

// Legal
const PrivacyPage = lazy(() => import('@/pages/legal/PrivacyPage'));
const TermsPage = lazy(() => import('@/pages/legal/TermsPage'));
const RefundPolicyPage = lazy(() => import('@/pages/legal/RefundPolicyPage'));
const AffiliateTermsPage = lazy(() => import('@/pages/legal/AffiliateTermsPage'));

// Special Pages
const WelcomePage = lazy(() => import('@/pages/WelcomePage'));
const CommunityPage = lazy(() => import('@/pages/CommunityPage'));
const ResourcesPage = lazy(() => import('@/pages/ResourcesPage'));
const ContactPage = lazy(() => import('@/pages/ContactPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

// Initialize React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 10, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Route protection wrapper
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiresPurchase?: string[]; // Optional: specific product IDs required
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiresPurchase }) => {
  const { isAuthenticated, isLoading, user } = useAuthStore();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Store intended destination for post-login redirect
      sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
      setLocation(ROUTES.AUTH.LOGIN);
    }
  }, [isAuthenticated, isLoading, setLocation]);

  // Check for specific purchase requirements
  useEffect(() => {
    if (isAuthenticated && requiresPurchase && user) {
      const hasPurchase = requiresPurchase.some(productId => 
        user.purchases?.includes(productId)
      );
      
      if (!hasPurchase) {
        setLocation(ROUTES.PRODUCTS.HOME);
      }
    }
  }, [isAuthenticated, requiresPurchase, user, setLocation]);

  if (isLoading) {
    return <PageLoader />;
  }

  return isAuthenticated ? <>{children}</> : null;
};

// Redirect handler component
const RedirectHandler: React.FC = () => {
  const [location, setLocation] = useLocation();
  
  useEffect(() => {
    const redirectTo = applyRedirect(location);
    if (redirectTo && redirectTo !== location) {
      console.log(`Redirecting from ${location} to ${redirectTo}`);
      setLocation(redirectTo);
    }
  }, [location, setLocation]);
  
  return null;
};

// Main App Component
function App() {
  const { initialize } = useAuthStore();

  // Initialize auth on mount
  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <QueryClientProvider client={queryClient}>
      <RedirectHandler />
      
      <Suspense fallback={<PageLoader />}>
        <Switch>
          {/* ===== HOME & MARKETING ===== */}
          <Route path={ROUTES.HOME}>
            <MainLayout>
              <HomePage />
            </MainLayout>
          </Route>
          
          <Route path={ROUTES.ABOUT}>
            <MainLayout>
              <AboutPage />
            </MainLayout>
          </Route>
          
          <Route path={ROUTES.TESTIMONIALS}>
            <MainLayout>
              <TestimonialsPage />
            </MainLayout>
          </Route>
          
          <Route path={ROUTES.BLOG.HOME}>
            <MainLayout>
              <BlogPage />
            </MainLayout>
          </Route>
          
          <Route path={ROUTES.BLOG.POST(':slug')}>
            {(params) => (
              <MainLayout>
                <BlogPostPage slug={params.slug} />
              </MainLayout>
            )}
          </Route>

          {/* ===== PRODUCTS (Sales Pages) ===== */}
          <Route path={ROUTES.PRODUCTS.HOME}>
            <MainLayout>
              <ProductsPage />
            </MainLayout>
          </Route>
          
          <Route path={ROUTES.PRODUCTS.STARTER_KIT}>
            <MainLayout>
              <StarterKitSalesPage />
            </MainLayout>
          </Route>
          
          <Route path={ROUTES.PRODUCTS.BRANDED}>
            <MainLayout>
              <BrandedSalesPage />
            </MainLayout>
          </Route>
          
          <Route path={ROUTES.PRODUCTS.VIP}>
            <MainLayout>
              <VIPSalesPage />
            </MainLayout>
          </Route>
          
          <Route path={ROUTES.PRODUCTS.TOOLS}>
            <MainLayout>
              <ToolsSalesPage />
            </MainLayout>
          </Route>
          
          <Route path={ROUTES.PRODUCTS.ALL_ACCESS}>
            <MainLayout>
              <AllAccessSalesPage />
            </MainLayout>
          </Route>

          {/* ===== LEARNING (Protected) ===== */}
          <Route path={ROUTES.LEARN.HOME}>
            <ProtectedRoute>
              <DashboardLayout>
                <LearnDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          </Route>
          
          <Route path={ROUTES.LEARN.STARTER_KIT.HOME}>
            <ProtectedRoute requiresPurchase={['starter-kit', 'all-access']}>
              <DashboardLayout>
                <StarterKitHub />
              </DashboardLayout>
            </ProtectedRoute>
          </Route>
          
          <Route path={ROUTES.LEARN.STARTER_KIT.MODULE(':module')}>
            {(params) => (
              <ProtectedRoute requiresPurchase={['starter-kit', 'all-access']}>
                <DashboardLayout>
                  <StarterKitModule module={params.module} />
                </DashboardLayout>
              </ProtectedRoute>
            )}
          </Route>
          
          <Route path={ROUTES.LEARN.BRANDED.HOME}>
            <ProtectedRoute requiresPurchase={['branded', 'all-access']}>
              <DashboardLayout>
                <BrandedHub />
              </DashboardLayout>
            </ProtectedRoute>
          </Route>
          
          <Route path={ROUTES.LEARN.BRANDED.MODULE(':module')}>
            {(params) => (
              <ProtectedRoute requiresPurchase={['branded', 'all-access']}>
                <DashboardLayout>
                  <BrandedModule module={params.module} />
                </DashboardLayout>
              </ProtectedRoute>
            )}
          </Route>
          
          <Route path={ROUTES.LEARN.VIP.HOME}>
            <ProtectedRoute requiresPurchase={['vip', 'all-access']}>
              <DashboardLayout>
                <VIPPortal />
              </DashboardLayout>
            </ProtectedRoute>
          </Route>
          
          <Route path={ROUTES.LEARN.VIP.SESSIONS}>
            <ProtectedRoute requiresPurchase={['vip', 'all-access']}>
              <DashboardLayout>
                <VIPSessions />
              </DashboardLayout>
            </ProtectedRoute>
          </Route>
          
          <Route path={ROUTES.LEARN.VIP.RECORDINGS}>
            <ProtectedRoute requiresPurchase={['vip', 'all-access']}>
              <DashboardLayout>
                <VIPRecordings />
              </DashboardLayout>
            </ProtectedRoute>
          </Route>
          
          <Route path={ROUTES.LEARN.VIP.RESOURCES}>
            <ProtectedRoute requiresPurchase={['vip', 'all-access']}>
              <DashboardLayout>
                <VIPResources />
              </DashboardLayout>
            </ProtectedRoute>
          </Route>

          {/* ===== TOOLS (Protected) ===== */}
          <Route path={ROUTES.TOOLS.HOME}>
            <ProtectedRoute>
              <DashboardLayout>
                <ToolsDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          </Route>
          
          <Route path={ROUTES.TOOLS.STUDIO}>
            <ProtectedRoute requiresPurchase={['tools', 'all-access']}>
              <DashboardLayout>
                <SelfieStudio />
              </DashboardLayout>
            </ProtectedRoute>
          </Route>
          
          <Route path={ROUTES.TOOLS.SANDRA_AI}>
            <ProtectedRoute requiresPurchase={['tools', 'all-access']}>
              <DashboardLayout>
                <SandraAI />
              </DashboardLayout>
            </ProtectedRoute>
          </Route>
          
          <Route path={ROUTES.TOOLS.CALENDAR}>
            <ProtectedRoute requiresPurchase={['tools', 'all-access']}>
              <DashboardLayout>
                <ContentCalendar />
              </DashboardLayout>
            </ProtectedRoute>
          </Route>
          
          <Route path={ROUTES.TOOLS.CAPTION_WRITER}>
            <ProtectedRoute requiresPurchase={['tools', 'all-access']}>
              <DashboardLayout>
                <CaptionWriter />
              </DashboardLayout>
            </ProtectedRoute>
          </Route>
          
          <Route path={ROUTES.TOOLS.BRAND_KIT}>
            <ProtectedRoute requiresPurchase={['tools', 'all-access']}>
              <DashboardLayout>
                <BrandKitGenerator />
              </DashboardLayout>
            </ProtectedRoute>
          </Route>
          
          <Route path={ROUTES.TOOLS.ANALYTICS}>
            <ProtectedRoute requiresPurchase={['tools', 'all-access']}>
              <DashboardLayout>
                <AnalyticsDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          </Route>

          {/* ===== ACCOUNT & PROFILE (Protected) ===== */}
          <Route path={ROUTES.DASHBOARD}>
            <ProtectedRoute>
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            </ProtectedRoute>
          </Route>
          
          <Route path={ROUTES.PROFILE.HOME}>
            <ProtectedRoute>
              <DashboardLayout>
                <ProfilePage />
              </DashboardLayout>
            </ProtectedRoute>
          </Route>
          
          <Route path={ROUTES.PROFILE.EDIT}>
            <ProtectedRoute>
              <DashboardLayout>
                <EditProfile />
              </DashboardLayout>
            </ProtectedRoute>
          </Route>
          
          <Route path={ROUTES.PROFILE.BILLING}>
            <ProtectedRoute>
              <DashboardLayout>
                <BillingPage />
              </DashboardLayout>
            </ProtectedRoute>
          </Route>
          
          <Route path={ROUTES.PROFILE.PURCHASES}>
            <ProtectedRoute>
              <DashboardLayout>
                <PurchaseHistory />
              </DashboardLayout>
            </ProtectedRoute>
          </Route>
          
          <Route path={ROUTES.PROFILE.CERTIFICATES}>
            <ProtectedRoute>
              <DashboardLayout>
                <Certificates />
              </DashboardLayout>
            </ProtectedRoute>
          </Route>

          {/* ===== AUTHENTICATION ===== */}
          <Route path={ROUTES.AUTH.LOGIN}>
            <AuthLayout>
              <LoginPage />
            </AuthLayout>
          </Route>
          
          <Route path={ROUTES.AUTH.SIGNUP}>
            <AuthLayout>
              <SignupPage />
            </AuthLayout>
          </Route>
          
          <Route path={ROUTES.AUTH.RESET_PASSWORD}>
            <AuthLayout>
              <ResetPasswordPage />
            </AuthLayout>
          </Route>
          
          <Route path={ROUTES.AUTH.VERIFY_EMAIL}>
            <AuthLayout>
              <VerifyEmailPage />
            </AuthLayout>
          </Route>

          {/* ===== CHECKOUT ===== */}
          <Route path={ROUTES.CHECKOUT.HOME}>
            <CheckoutPage />
          </Route>
          
          <Route path={ROUTES.CHECKOUT.SUCCESS}>
            <CheckoutSuccess />
          </Route>
          
          <Route path={ROUTES.CHECKOUT.CANCEL}>
            <CheckoutCancel />
          </Route>

          {/* ===== LEGAL ===== */}
          <Route path={ROUTES.LEGAL.PRIVACY}>
            <MainLayout>
              <PrivacyPage />
            </MainLayout>
          </Route>
          
          <Route path={ROUTES.LEGAL.TERMS}>
            <MainLayout>
              <TermsPage />
            </MainLayout>
          </Route>
          
          <Route path={ROUTES.LEGAL.REFUND_POLICY}>
            <MainLayout>
              <RefundPolicyPage />
            </MainLayout>
          </Route>
          
          <Route path={ROUTES.LEGAL.AFFILIATE_TERMS}>
            <MainLayout>
              <AffiliateTermsPage />
            </MainLayout>
          </Route>

          {/* ===== SPECIAL PAGES ===== */}
          <Route path={ROUTES.WELCOME}>
            <ProtectedRoute>
              <MainLayout>
                <WelcomePage />
              </MainLayout>
            </ProtectedRoute>
          </Route>
          
          <Route path={ROUTES.COMMUNITY}>
            <MainLayout>
              <CommunityPage />
            </MainLayout>
          </Route>
          
          <Route path={ROUTES.RESOURCES}>
            <MainLayout>
              <ResourcesPage />
            </MainLayout>
          </Route>
          
          <Route path={ROUTES.CONTACT}>
            <MainLayout>
              <ContactPage />
            </MainLayout>
          </Route>

          {/* ===== 404 - Catch All ===== */}
          <Route>
            <MainLayout>
              <NotFoundPage />
            </MainLayout>
          </Route>
        </Switch>
      </Suspense>

      <Toaster />
    </QueryClientProvider>
  );
}

export default App;