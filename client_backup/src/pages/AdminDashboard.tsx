
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import AdminHeader from '@/components/AdminHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TrendingUp, DollarSign, Users, FileText, ExternalLink, Crown, Calendar, AlertTriangle, Download, RefreshCw, CalendarIcon, CheckCircle } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

export default function AdminDashboard() {
  const { isAdmin, user, isLoading } = useAdminAuth();
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'quarter'>('month');
  const [customDateRange, setCustomDateRange] = useState({ start: '2025-03-01', end: '2025-05-30' });
  const [showCustomDates, setShowCustomDates] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const queryClient = useQueryClient();

  const { data: dashboardData, refetch } = useQuery({
    queryKey: ['/api/admin/dashboard', timeframe],
    enabled: isAdmin,
  });

  const syncMutation = useMutation({
    mutationFn: async () => {
      console.log('🔄 Frontend: Starting sync request...');
      try {
        const response = await apiRequest('POST', '/api/admin/sync-fiken');
        console.log('✅ Frontend: Sync request successful');
        return response;
      } catch (error) {
        console.error('❌ Frontend: Sync request failed:', error);
        throw error;
      }
    },
    onMutate: () => {
      console.log('🚀 Frontend: Sync button clicked - status set to syncing');
      setSyncStatus('syncing');
    },
    onSuccess: (data) => {
      console.log('🎉 Frontend: Sync completed successfully:', data);
      setSyncStatus('success');
      refetch();
      setTimeout(() => setSyncStatus('idle'), 3000);
    },
    onError: (error) => {
      console.error('💥 Frontend: Sync failed with error:', error);
      setSyncStatus('error');
      setTimeout(() => setSyncStatus('idle'), 3000);
    }
  });

  const downloadMVAReport = () => {
    const vatData = {
      period: `${timeframe} - ${customDateRange.start} to ${customDateRange.end}`,
      totalRevenue: dashboardData?.vat?.totalRevenue || 0,
      vatAmount: dashboardData?.vat?.vatAmount || 0,
      netRevenue: dashboardData?.vat?.netRevenue || 0,
      submissionDate: dashboardData?.vat?.submissionDate,
      productBreakdown: {
        starterkit: dashboardData?.revenue?.starterkit || 0,
        presets: dashboardData?.revenue?.presets || 0,
        SelfietoCEO: dashboardData?.revenue?.SelfietoCEO || 0,
        subscription: dashboardData?.revenue?.subscription || 0
      },
      generatedAt: new Date().toISOString()
    };

    // Create CSV format
    const csvRows = [
      ['Product', 'Amount (NOK)', 'VAT (25%)', 'Net Amount', 'Category'],
      ['Selfie Starter Kit', dashboardData?.revenue?.starterkit || 0, (dashboardData?.revenue?.starterkit || 0) * 0.25, (dashboardData?.revenue?.starterkit || 0) * 0.75, 'starterkit'],
      ['Lightroom Presets', dashboardData?.revenue?.presets || 0, (dashboardData?.revenue?.presets || 0) * 0.25, (dashboardData?.revenue?.presets || 0) * 0.75, 'presets'],
      ['Branded by Selfie', dashboardData?.revenue?.SelfietoCEO || 0, (dashboardData?.revenue?.SelfietoCEO || 0) * 0.25, (dashboardData?.revenue?.SelfietoCEO || 0) * 0.75, 'SelfietoCEO'],
      ['', '', '', '', ''],
      ['TOTAL', vatData.totalRevenue, vatData.vatAmount, vatData.netRevenue, 'ALL'],
      ['', '', '', '', ''],
      ['VAT Submission Date:', vatData.submissionDate, '', '', ''],
      ['Report Generated:', new Date().toLocaleDateString('no-NO'), '', '', '']
    ];

    const csvContent = csvRows.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `MVA-Tax-Report-${timeframe}-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F1F1F1] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-[#171719] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#F1F1F1] flex items-center justify-center">
        <div className="text-center">
          <Crown className="w-16 h-16 mx-auto mb-4 text-[#171719]" />
          <h2 
            className="text-3xl font-normal text-[#171719] mb-2" 
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            Access Denied
          </h2>
          <p 
            className="text-[#4C4B4B] mb-6 font-light" 
            style={{ fontFamily: 'Neue Einstellung, sans-serif' }}
          >
            This area is restricted to authorized personnel only.
          </p>
          <Button 
            onClick={() => window.location.href = '/temp-admin'}
            className="bg-transparent border-2 border-[#171719] text-[#171719] hover:bg-[#171719] hover:text-white uppercase tracking-wide"
            style={{ fontFamily: 'Neue Einstellung, sans-serif' }}
          >
            Admin Login
          </Button>
        </div>
      </div>
    );
  }

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-[#F1F1F1]">
      <AdminHeader />
      
      <div className="bg-[#F1F1F1] min-h-screen">
        {/* Welcome Section */}
        <div className="border-b border-[#B5B5B3] bg-white">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 
                  className="text-5xl font-normal text-[#171719]" 
                  style={{ fontFamily: 'Cormorant Garamond, serif' }}
                >
                  Welcome back, Sandra <Crown className="inline w-8 h-8 ml-2" />
                </h1>
                <p 
                  className="text-[#4C4B4B] mt-2 text-lg font-light" 
                  style={{ fontFamily: 'Neue Einstellung, sans-serif' }}
                >
                  {today}
                </p>
                <p 
                  className="text-[#171719] mt-1 italic font-light" 
                  style={{ fontFamily: 'Neue Einstellung, sans-serif' }}
                >
                  "Today you're building an empire, not just a business."
                </p>
                <div className="flex items-center gap-4 mt-4">
                  <div 
                    className="flex items-center gap-2 text-sm text-[#4C4B4B] font-light" 
                    style={{ fontFamily: 'Neue Einstellung, sans-serif' }}
                  >
                    <CalendarIcon className="w-4 h-4" />
                    <span>Current Range: {customDateRange.start} to {customDateRange.end}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowCustomDates(!showCustomDates)}
                    className="text-xs border-[#B5B5B3] text-[#4C4B4B] hover:border-[#171719] hover:text-[#171719] uppercase tracking-wide"
                    style={{ fontFamily: 'Neue Einstellung, sans-serif' }}
                  >
                    <CalendarIcon className="w-3 h-3 mr-1" />
                    Custom Dates
                  </Button>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex gap-3">
                  <Button
                    variant={timeframe === 'week' ? 'default' : 'outline'}
                    onClick={() => setTimeframe('week')}
                    className={`${timeframe === 'week' ? 'bg-[#171719] text-white' : 'bg-transparent text-[#171719] border-[#B5B5B3]'} hover:bg-[#171719] hover:text-white uppercase tracking-wide`}
                    style={{ fontFamily: 'Neue Einstellung, sans-serif' }}
                  >
                    Week
                  </Button>
                  <Button
                    variant={timeframe === 'month' ? 'default' : 'outline'}
                    onClick={() => setTimeframe('month')}
                    className={`${timeframe === 'month' ? 'bg-[#171719] text-white' : 'bg-transparent text-[#171719] border-[#B5B5B3]'} hover:bg-[#171719] hover:text-white uppercase tracking-wide`}
                    style={{ fontFamily: 'Neue Einstellung, sans-serif' }}
                  >
                    Month
                  </Button>
                  <Button
                    variant={timeframe === 'quarter' ? 'default' : 'outline'}
                    onClick={() => setTimeframe('quarter')}
                    className={`${timeframe === 'quarter' ? 'bg-[#171719] text-white' : 'bg-transparent text-[#171719] border-[#B5B5B3]'} hover:bg-[#171719] hover:text-white uppercase tracking-wide`}
                    style={{ fontFamily: 'Neue Einstellung, sans-serif' }}
                  >
                    Quarter
                  </Button>
                </div>
                <Button
                  onClick={() => syncMutation.mutate()}
                  disabled={syncStatus === 'syncing'}
                  className={`
                    ${syncStatus === 'success' ? 'bg-[#171719] hover:bg-[#4C4B4B] border-[#171719]' : 
                      syncStatus === 'error' ? 'bg-transparent border-[#171719] text-[#171719] hover:bg-[#171719] hover:text-white' : 
                      'bg-transparent border-[#171719] text-[#171719] hover:bg-[#171719] hover:text-white'} 
                    text-white transition-colors duration-200 uppercase tracking-wide border-2
                  `}
                  style={{ fontFamily: 'Neue Einstellung, sans-serif' }}
                >
                  {syncStatus === 'syncing' && <RefreshCw className="w-4 h-4 mr-2 animate-spin" />}
                  {syncStatus === 'success' && <CheckCircle className="w-4 h-4 mr-2" />}
                  {syncStatus === 'error' && <AlertTriangle className="w-4 h-4 mr-2" />}
                  {syncStatus === 'idle' && <RefreshCw className="w-4 h-4 mr-2" />}
                  {syncStatus === 'syncing' ? 'Syncing...' : 
                   syncStatus === 'success' ? 'Synced!' :
                   syncStatus === 'error' ? 'Sync Failed' : 'Sync to Fiken'}
                </Button>
              </div>
            </div>
            
            {showCustomDates && (
              <div className="mt-6 p-4 bg-[#F1F1F1] rounded-lg border border-[#B5B5B3]">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  <div>
                    <Label 
                      htmlFor="start-date" 
                      className="text-[#4C4B4B] text-sm uppercase tracking-wide font-light" 
                      style={{ fontFamily: 'Neue Einstellung, sans-serif' }}
                    >
                      Start Date
                    </Label>
                    <Input
                      id="start-date"
                      type="date"
                      value={customDateRange.start}
                      onChange={(e) => setCustomDateRange(prev => ({ ...prev, start: e.target.value }))}
                      className="border-[#B5B5B3] focus:border-[#171719]"
                    />
                  </div>
                  <div>
                    <Label 
                      htmlFor="end-date" 
                      className="text-[#4C4B4B] text-sm uppercase tracking-wide font-light" 
                      style={{ fontFamily: 'Neue Einstellung, sans-serif' }}
                    >
                      End Date
                    </Label>
                    <Input
                      id="end-date"
                      type="date"
                      value={customDateRange.end}
                      onChange={(e) => setCustomDateRange(prev => ({ ...prev, end: e.target.value }))}
                      className="border-[#B5B5B3] focus:border-[#171719]"
                    />
                  </div>
                  <Button
                    onClick={() => {
                      refetch();
                      setShowCustomDates(false);
                    }}
                    className="bg-[#171719] text-white hover:bg-[#4C4B4B] uppercase tracking-wide"
                    style={{ fontFamily: 'Neue Einstellung, sans-serif' }}
                  >
                    Apply Dates
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Income Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white border-[#B5B5B3]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle 
                  className="text-sm font-light text-[#4C4B4B] uppercase tracking-wide" 
                  style={{ fontFamily: 'Neue Einstellung, sans-serif' }}
                >
                  Total Revenue
                </CardTitle>
                <DollarSign className="w-4 h-4 text-[#4C4B4B]" />
              </CardHeader>
              <CardContent>
                <div 
                  className="text-2xl font-normal text-[#171719]" 
                  style={{ fontFamily: 'Cormorant Garamond, serif' }}
                >
                  ${dashboardData?.revenue?.total || 0}
                </div>
                <p 
                  className="text-xs text-[#4C4B4B] font-light" 
                  style={{ fontFamily: 'Neue Einstellung, sans-serif' }}
                >
                  +{dashboardData?.revenue?.growth || 0}% from last {timeframe}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-[#B5B5B3]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle 
                  className="text-sm font-light text-[#4C4B4B] uppercase tracking-wide" 
                  style={{ fontFamily: 'Neue Einstellung, sans-serif' }}
                >
                  Selfie Starter Kit
                </CardTitle>
                <FileText className="w-4 h-4 text-[#4C4B4B]" />
              </CardHeader>
              <CardContent>
                <div 
                  className="text-2xl font-normal text-[#171719]" 
                  style={{ fontFamily: 'Cormorant Garamond, serif' }}
                >
                  ${dashboardData?.revenue?.starterkit || 0}
                </div>
                <p 
                  className="text-xs text-[#4C4B4B] font-light" 
                  style={{ fontFamily: 'Neue Einstellung, sans-serif' }}
                >
                  Starter kit sales this {timeframe}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-[#B5B5B3]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle 
                  className="text-sm font-light text-[#4C4B4B] uppercase tracking-wide" 
                  style={{ fontFamily: 'Neue Einstellung, sans-serif' }}
                >
                  Lightroom Presets
                </CardTitle>
                <Users className="w-4 h-4 text-[#4C4B4B]" />
              </CardHeader>
              <CardContent>
                <div 
                  className="text-2xl font-normal text-[#171719]" 
                  style={{ fontFamily: 'Cormorant Garamond, serif' }}
                >
                  ${dashboardData?.revenue?.presets || 0}
                </div>
                <p 
                  className="text-xs text-[#4C4B4B] font-light" 
                  style={{ fontFamily: 'Neue Einstellung, sans-serif' }}
                >
                  Preset pack sales this {timeframe}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-[#B5B5B3]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle 
                  className="text-sm font-light text-[#4C4B4B] uppercase tracking-wide" 
                  style={{ fontFamily: 'Neue Einstellung, sans-serif' }}
                >
                  Branded by Selfie
                </CardTitle>
                <Crown className="w-4 h-4 text-[#4C4B4B]" />
              </CardHeader>
              <CardContent>
                <div 
                  className="text-2xl font-normal text-[#171719]" 
                  style={{ fontFamily: 'Cormorant Garamond, serif' }}
                >
                  ${dashboardData?.revenue?.SelfietoCEO || 0}
                </div>
                <p 
                  className="text-xs text-[#4C4B4B] font-light" 
                  style={{ fontFamily: 'Neue Einstellung, sans-serif' }}
                >
                  Premium course sales this {timeframe}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Financial Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card className="lg:col-span-2 bg-white border-[#B5B5B3]">
              <CardHeader>
                <CardTitle 
                  className="text-2xl font-normal text-[#171719]" 
                  style={{ fontFamily: 'Cormorant Garamond, serif' }}
                >
                  Financial Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p 
                      className="text-sm text-[#4C4B4B] uppercase tracking-wide font-light" 
                      style={{ fontFamily: 'Neue Einstellung, sans-serif' }}
                    >
                      Total Revenue
                    </p>
                    <p 
                      className="text-2xl font-normal text-[#171719]" 
                      style={{ fontFamily: 'Cormorant Garamond, serif' }}
                    >
                      ${dashboardData?.financials?.totalRevenue || 0}
                    </p>
                  </div>
                  <div>
                    <p 
                      className="text-sm text-[#4C4B4B] uppercase tracking-wide font-light" 
                      style={{ fontFamily: 'Neue Einstellung, sans-serif' }}
                    >
                      VAT to Pay
                    </p>
                    <p 
                      className="text-2xl font-normal text-[#171719]" 
                      style={{ fontFamily: 'Cormorant Garamond, serif' }}
                    >
                      ${dashboardData?.financials?.vatToPay || 0}
                    </p>
                  </div>
                  <div>
                    <p 
                      className="text-sm text-[#4C4B4B] uppercase tracking-wide font-light" 
                      style={{ fontFamily: 'Neue Einstellung, sans-serif' }}
                    >
                      Tax Reserve
                    </p>
                    <p 
                      className="text-2xl font-normal text-[#171719]" 
                      style={{ fontFamily: 'Cormorant Garamond, serif' }}
                    >
                      ${dashboardData?.financials?.taxReserve || 0}
                    </p>
                  </div>
                  <div>
                    <p 
                      className="text-sm text-[#4C4B4B] uppercase tracking-wide font-light" 
                      style={{ fontFamily: 'Neue Einstellung, sans-serif' }}
                    >
                      Net Profit
                    </p>
                    <p 
                      className="text-2xl font-normal text-[#171719]" 
                      style={{ fontFamily: 'Cormorant Garamond, serif' }}
                    >
                      ${dashboardData?.financials?.netProfit || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-[#B5B5B3]">
              <CardHeader>
                <CardTitle 
                  className="text-xl font-normal text-[#171719] flex items-center" 
                  style={{ fontFamily: 'Cormorant Garamond, serif' }}
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Upcoming Payments
                </CardTitle>
              </CardHeader>
              <CardContent>
                {dashboardData?.upcomingPayments && dashboardData.upcomingPayments.length > 0 ? (
                  <div className="space-y-3">
                    {dashboardData.upcomingPayments.map((payment: any, index: number) => (
                      <div key={index} className="flex justify-between items-center">
                        <div>
                          <p 
                            className="font-light text-[#171719]" 
                            style={{ fontFamily: 'Neue Einstellung, sans-serif' }}
                          >
                            {payment.description}
                          </p>
                          <p 
                            className="text-sm text-[#4C4B4B] font-light" 
                            style={{ fontFamily: 'Neue Einstellung, sans-serif' }}
                          >
                            {payment.dueDate}
                          </p>
                        </div>
                        <Badge variant="outline" className="border-[#B5B5B3] text-[#4C4B4B]">
                          ${payment.amount}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p 
                    className="text-[#4C4B4B] font-light" 
                    style={{ fontFamily: 'Neue Einstellung, sans-serif' }}
                  >
                    No upcoming payments
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Unpaid Invoices */}
          <Card className="mb-8 bg-white border-[#B5B5B3]">
            <CardHeader>
              <CardTitle 
                className="text-xl font-normal text-[#171719] flex items-center" 
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                <AlertTriangle className="w-5 h-5 mr-2 text-[#4C4B4B]" />
                Unpaid Invoices
              </CardTitle>
            </CardHeader>
            <CardContent>
              {dashboardData?.unpaidInvoices && dashboardData.unpaidInvoices.length > 0 ? (
                <div className="space-y-3">
                  {dashboardData.unpaidInvoices.map((invoice: any, index: number) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-[#F1F1F1] rounded-lg border border-[#B5B5B3]">
                      <div>
                        <p 
                          className="font-light text-[#171719]" 
                          style={{ fontFamily: 'Neue Einstellung, sans-serif' }}
                        >
                          {invoice.customerName}
                        </p>
                        <p 
                          className="text-sm text-[#4C4B4B] font-light" 
                          style={{ fontFamily: 'Neue Einstellung, sans-serif' }}
                        >
                          Due: {invoice.dueDate}
                        </p>
                      </div>
                      <Badge className="bg-[#171719] text-white">
                        ${invoice.amount}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p 
                  className="text-[#4C4B4B] font-light" 
                  style={{ fontFamily: 'Neue Einstellung, sans-serif' }}
                >
                  All invoices are paid
                </p>
              )}
            </CardContent>
          </Card>

          {/* Content Performance */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card className="bg-white border-[#B5B5B3]">
              <CardHeader>
                <CardTitle 
                  className="text-xl font-normal text-[#171719]" 
                  style={{ fontFamily: 'Cormorant Garamond, serif' }}
                >
                  Content Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span 
                      className="text-[#4C4B4B] font-light" 
                      style={{ fontFamily: 'Neue Einstellung, sans-serif' }}
                    >
                      Total Posts Generated
                    </span>
                    <span 
                      className="font-normal text-[#171719]" 
                      style={{ fontFamily: 'Cormorant Garamond, serif' }}
                    >
                      {dashboardData?.content?.totalPosts || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span 
                      className="text-[#4C4B4B] font-light" 
                      style={{ fontFamily: 'Neue Einstellung, sans-serif' }}
                    >
                      Average Engagement
                    </span>
                    <span 
                      className="font-normal text-[#171719]" 
                      style={{ fontFamily: 'Cormorant Garamond, serif' }}
                    >
                      {dashboardData?.content?.avgEngagement || 0}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-[#B5B5B3]">
              <CardHeader>
                <CardTitle 
                  className="text-xl font-normal text-[#171719]" 
                  style={{ fontFamily: 'Cormorant Garamond, serif' }}
                >
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { name: 'Stripe', url: 'https://dashboard.stripe.com' },
                    { name: 'Shopify', url: 'https://partners.shopify.com' },
                    { name: 'Zapier', url: 'https://zapier.com/app/dashboard' },
                    { name: 'Supabase', url: 'https://app.supabase.com' },
                  ].map((link) => (
                    <Button
                      key={link.name}
                      variant="outline"
                      className="h-16 flex flex-col items-center justify-center border-[#B5B5B3] hover:border-[#171719] text-[#4C4B4B] hover:text-[#171719] uppercase tracking-wide"
                      onClick={() => window.open(link.url, '_blank')}
                      style={{ fontFamily: 'Neue Einstellung, sans-serif' }}
                    >
                      <ExternalLink className="w-4 h-4 mb-1" />
                      <span className="text-sm">{link.name}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="bg-white border-[#B5B5B3]">
            <CardHeader>
              <CardTitle 
                className="text-xl font-normal text-[#171719]" 
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dashboardData?.activity && dashboardData.activity.length > 0 ? (
                  dashboardData.activity.map((activity: any, index: number) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-[#F1F1F1] rounded-lg">
                      <div className="w-2 h-2 bg-[#171719] rounded-full"></div>
                      <div>
                        <p 
                          className="font-light text-[#171719]" 
                          style={{ fontFamily: 'Neue Einstellung, sans-serif' }}
                        >
                          {activity.action}
                        </p>
                        <p 
                          className="text-sm text-[#4C4B4B] font-light" 
                          style={{ fontFamily: 'Neue Einstellung, sans-serif' }}
                        >
                          {activity.timestamp}
                        </p>
                      </div>
                      <Badge variant="secondary" className="bg-[#B5B5B3] text-white">
                        {activity.type}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <p 
                    className="text-[#4C4B4B] font-light" 
                    style={{ fontFamily: 'Neue Einstellung, sans-serif' }}
                  >
                    No recent activity
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
