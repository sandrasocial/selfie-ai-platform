import React, { useEffect } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { clearAuthState } from "./lib/supabaseClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import ScrollToTop from "@/components/layout/ScrollToTop";
import Home from "@/pages/Home";
import Studio from "@/pages/Studio";
import VisualsStudio from "@/pages/studio/VisualsStudio";
import VisualStrategy from "@/pages/studio/VisualStrategy";
import FeedDesigner from "@/pages/studio/FeedDesigner";
import PhotoVault from "@/pages/studio/PhotoVault";
import DailyBoost from "@/pages/studio/DailyBoost";
import BrandNotes from "@/pages/studio/BrandNotes";
import AutoTagger from "@/pages/studio/AutoTagger";
import Pricing from "@/pages/Pricing";
import CoachingApplication from "@/pages/CoachingApplication";
import ViralSelfieBlueprint from "@/pages/ViralSelfieBlueprint";
import ModuleOne from "@/pages/ModuleOne";
import ModuleTwo from "@/pages/ModuleTwo";
import MyWorkbooks from "@/pages/MyWorkbooks";
import ContentVault from "@/pages/ContentVault";
import MonthlyDrops from "@/pages/MonthlyDrops";
import Courses from "@/pages/Courses";
import Templates from "@/pages/Templates";
import SandraAI from "@/pages/SandraAI";
import Planner from "@/pages/WeeklyPlanner"; // Alias for /planner route
import Checkout from "@/pages/Checkout";
import OfferUpsell from "@/pages/OfferUpsell";
import OfferDownsell from "@/pages/OfferDownsell";
import Dashboard from "@/pages/Dashboard";
import Calendar from "@/pages/Calendar";
import AuthCallback from "@/pages/AuthCallback";
import SupabaseAuth from "@/pages/SupabaseAuth";
import SupabaseCallback from "@/pages/SupabaseCallback";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminDrops from "@/pages/AdminDrops";
import TempAdminLogin from "@/pages/TempAdminLogin";
import TestLogin from "@/pages/TestLogin";
import DevLogin from "@/pages/DevLogin";
import DevAuth from "@/pages/DevAuth";
import DashboardDev from "@/pages/DashboardDev";
import SelfieStarterKit from "@/pages/products/SelfieStarterKit";
import BrandedBySelfieProduct from "@/pages/products/BrandedBySelfie";
import PresetBundles from "@/pages/products/PresetBundles";
import CheckoutPage from "@/pages/checkout/CheckoutPage";
import ThankYouPage from "@/pages/thank-you/ThankYouPage";
import StarterKitCourse from "@/pages/courses/StarterKitCourse";
import BrandedBySelfie from "@/pages/courses/BrandedBySelfie";
import VIPCourse from "@/pages/courses/VIPCourse";
import AestheticCollections from "@/pages/AestheticCollections";
import NotFound from "@/pages/not-found";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import Contact from "@/pages/Contact";
import Support from "@/pages/Support";
import MyAccount from "@/pages/MyAccount";
import SummerCollabs from "@/pages/SummerCollabs";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { lazy, Suspense } from "react";
import EmpireBuilderVIP from "@/pages/products/EmpireBuilderVIP";
import DevRouteAudit from "@/components/DevRouteAudit";
import RouteRedirects from "@/components/RouteRedirects";
import SandraAIAssistant from '@/components/SandraAIAssistant';
import AuthTest from '@/pages/AuthTest';
import Login from "@/pages/Login";
import ViewWorkbook from "@/pages/ViewWorkbook";
import PresetsKitAccess from "@/pages/PresetsKitAccess";
import DebugSession from "@/pages/DebugSession";
import BrandOnboarding from "@/pages/BrandOnboarding";
import { AIIntegrationDashboard } from "@/components/AIIntegrationDashboard";
import MyBrandProfile from "@/components/MyBrandProfile";
import { ProfileProvider } from "@/contexts/ProfileContext";
import BrandHubOnboarding from "@/components/BrandHubOnboarding";
import ErrorBoundary from "@/components/ErrorBoundary";

function Router() {
  const SelfieGuide = lazy(() => import('@/pages/freebie/SelfieGuide'));
  const VIPThankYou = lazy(() => import('./pages/thank-you/VIPThankYou'));

  useEffect(() => {
    // Clear any stale auth state on fresh page load
    const isCallback = window.location.pathname.includes('/supabase-auth/callback') || 
                      window.location.pathname.includes('/supabase-callback');
    
    if (!isCallback && window.performance?.navigation?.type === 1) {
      // Only clear on fresh page loads, not on redirects or back/forward
      console.log('🔄 Fresh page load detected, clearing auth state...');
      clearAuthState();
    }
  }, []);

  return (
    <>
      <ScrollToTop />
      <RouteRedirects />
      <Switch>
        <Route path="/" component={Home} />

        {/* Protected Platform Routes - Require Authentication */}
        <Route path="/dashboard" component={() => <ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/dashboard/presets-kit-access" component={() => <ProtectedRoute><PresetsKitAccess /></ProtectedRoute>} />
        <Route path="/dashboard-dev" component={() => <ProtectedRoute><DashboardDev /></ProtectedRoute>} />
        <Route path="/onboarding" component={() => <ProtectedRoute><BrandOnboarding /></ProtectedRoute>} />
        <Route path="/onboarding/brand-hub" component={() => <ProtectedRoute><BrandHubOnboarding /></ProtectedRoute>} />
        <Route path="/studio" component={() => <ProtectedRoute><Studio /></ProtectedRoute>} />
        <Route path="/studio/editor" component={() => <ProtectedRoute><VisualsStudio /></ProtectedRoute>} />
        <Route path="/studio/visual-strategy" component={() => <ProtectedRoute><VisualStrategy /></ProtectedRoute>} />
        <Route path="/studio/feed-designer" component={() => <ProtectedRoute><FeedDesigner /></ProtectedRoute>} />
        <Route path="/studio/photo-vault" component={() => <ProtectedRoute><PhotoVault /></ProtectedRoute>} />
        <Route path="/studio/boost" component={() => <ProtectedRoute><DailyBoost /></ProtectedRoute>} />
        <Route path="/studio/notes" component={() => <ProtectedRoute><BrandNotes /></ProtectedRoute>} />
        <Route path="/studio/tagger" component={() => <ProtectedRoute><AutoTagger /></ProtectedRoute>} />
        <Route path="/sandra-ai" component={() => <ProtectedRoute><SandraAI /></ProtectedRoute>} />
        <Route path="/ai-hub" component={() => <ProtectedRoute><AIIntegrationDashboard /></ProtectedRoute>} />
        <Route path="/profile" component={() => <ProtectedRoute><MyBrandProfile /></ProtectedRoute>} />
        <Route path="/my-profile" component={() => <ProtectedRoute><MyBrandProfile /></ProtectedRoute>} />
        <Route path="/planner" component={() => <ProtectedRoute><Planner /></ProtectedRoute>} />
        <Route path="/drops" component={() => <ProtectedRoute><MonthlyDrops /></ProtectedRoute>} />
        <Route path="/courses" component={() => <ProtectedRoute><Courses /></ProtectedRoute>} />
        <Route path="/account" component={() => <ProtectedRoute><MyAccount /></ProtectedRoute>} />
        <Route path="/calendar" component={() => <ProtectedRoute><Calendar /></ProtectedRoute>} />
        <Route path="/templates" component={() => <ProtectedRoute><Templates /></ProtectedRoute>} />
        <Route path="/content-vault" component={() => <ProtectedRoute><ContentVault /></ProtectedRoute>} />

        <Route path="/my-workbooks" component={() => <ProtectedRoute><MyWorkbooks /></ProtectedRoute>} />
        <Route path="/view-workbook" component={() => <ProtectedRoute><ViewWorkbook /></ProtectedRoute>} />

        {/* Course Routes - Payment Protected */}
        <Route path="/course/viral-selfie-blueprint" component={() => <ProtectedRoute><ViralSelfieBlueprint /></ProtectedRoute>} />
        <Route path="/courses/starter-kit" component={() => <ProtectedRoute><StarterKitCourse /></ProtectedRoute>} />
        <Route path="/courses/branded-by-selfie" component={() => <ProtectedRoute><BrandedBySelfie /></ProtectedRoute>} />
        <Route path="/courses/branded" component={() => <ProtectedRoute><BrandedBySelfie /></ProtectedRoute>} />
        <Route path="/courses/vip" component={() => <ProtectedRoute><VIPCourse /></ProtectedRoute>} />
        
        {/* AI Collections */}
        <Route path="/collections" component={() => <ProtectedRoute><AestheticCollections /></ProtectedRoute>} />
        <Route path="/aesthetic-collections" component={() => <ProtectedRoute><AestheticCollections /></ProtectedRoute>} />

        {/* Checkout & Thank You Routes - Payment Flow */}
        <Route path="/checkout" component={CheckoutPage} />
        <Route path="/checkout/:productId" component={CheckoutPage} />
        <Route path="/thank-you" component={ThankYouPage} />
        <Route path="/thank-you/:type" component={ThankYouPage} />
        <Route path="/thank-you/vip" component={() => <Suspense fallback={<div>Loading...</div>}><VIPThankYou /></Suspense>} />

        {/* Product Pages - Subscription Gated */}
        <Route path="/products/empire-builder-vip" component={EmpireBuilderVIP} />
        <Route path="/products/preset-bundles" component={PresetBundles} />

        {/* Account & Subscription Management */}
        <Route path="/my-account" component={() => <ProtectedRoute><MyAccount /></ProtectedRoute>} />

        {/* Module Routes - Course Content */}
        <Route path="/module/1" component={() => <ProtectedRoute><ModuleOne /></ProtectedRoute>} />
        <Route path="/module/2" component={() => <ProtectedRoute><ModuleTwo /></ProtectedRoute>} />

        {/* Upsell Flow Routes */}
        <Route path="/offer-upsell" component={OfferUpsell} />
        <Route path="/offer-downsell" component={OfferDownsell} />

        {/* VIP Application */}
        <Route path="/vip-application" component={CoachingApplication} />

        {/* Summer Collaborations */}
        <Route path="/summer-collabs" component={SummerCollabs} />

        {/* Freebie Routes */}
        <Route path="/freebie/selfie-guide" component={() => <Suspense fallback={<div>Loading...</div>}><SelfieGuide /></Suspense>} />

        {/* Admin Routes */}
        <Route path="/admin" component={() => <ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/drops" component={() => <ProtectedRoute><AdminDrops /></ProtectedRoute>} />

        {/* Auth Routes */}
        <Route path="/auth-callback" component={AuthCallback} />
        <Route path="/supabase-auth" component={SupabaseAuth} />
        <Route path="/supabase-auth/callback" component={SupabaseCallback} />
        <Route path="/supabase-callback" component={SupabaseCallback} />
        <Route path="/auth-test" component={AuthTest} />

        {/* Dev Routes */}
        <Route path="/dev-login" component={DevLogin} />
        <Route path="/dev-auth" component={DevAuth} />
        <Route path="/temp-admin" component={() => {
          // Set temporary session and redirect to dashboard
          fetch('/api/temp-admin-access', { method: 'GET' })
            .then(() => {
              window.location.href = '/dashboard';
            })
            .catch(() => {
              window.location.href = '/dashboard';
            });
          return <div className="p-8 text-center">
            <h2 className="text-xl font-bold mb-4">Accessing Platform...</h2>
            <p>Establishing temporary session and redirecting to dashboard</p>
          </div>;
        }} />
        <Route path="/temp-admin-login" component={TempAdminLogin} />
        <Route path="/test-login" component={TestLogin} />
        <Route path="/debug-session" component={DebugSession} />

        {/* Public Routes */}
        <Route path="/pricing" component={Pricing} />
        <Route path="/contact" component={Contact} />
        <Route path="/support" component={Support} />
        <Route path="/login" component={Login} />
        <Route path="/products/starter-kit" component={SelfieStarterKit} />
        <Route path="/products/branded-by-selfie" component={BrandedBySelfieProduct} />
        <Route path="/terms" component={Terms} />
        <Route path="/privacy" component={Privacy} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <React.StrictMode>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <ProfileProvider>
            <TooltipProvider>
              <Toaster />
              <Router />
              <DevRouteAudit />
            </TooltipProvider>
          </ProfileProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </React.StrictMode>
  );
}

export default App;