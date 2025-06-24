'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';

interface AutomationStats {
  totalEmails: number;
  emailsToday: number;
  deliveryRate: number;
  openRate: number;
  clickRate: number;
  activeSequences: number;
  failedEmails: number;
}

interface RecentEmail {
  id: string;
  type: string;
  recipient: string;
  status: 'sent' | 'failed' | 'pending';
  timestamp: string;
  template: string;
}

export default function AutomationDashboard() {
  const [stats, setStats] = useState<AutomationStats>({
    totalEmails: 0,
    emailsToday: 0,
    deliveryRate: 0,
    openRate: 0,
    clickRate: 0,
    activeSequences: 0,
    failedEmails: 0
  });

  const [recentEmails, setRecentEmails] = useState<RecentEmail[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAutomationStats();
    fetchRecentEmails();
  }, []);

  const fetchAutomationStats = async () => {
    try {
      // In a real implementation, this would fetch from your analytics API
      // For now, showing mock data with realistic numbers
      const mockStats: AutomationStats = {
        totalEmails: 2847,
        emailsToday: 23,
        deliveryRate: 98.5,
        openRate: 42.3,
        clickRate: 8.7,
        activeSequences: 12,
        failedEmails: 3
      };
      setStats(mockStats);
    } catch (error) {
      console.error('Failed to fetch automation stats:', error);
    }
  };

  const fetchRecentEmails = async () => {
    try {
      // Mock recent emails data
      const mockEmails: RecentEmail[] = [
        {
          id: '1',
          type: 'Welcome',
          recipient: 'sarah@example.com',
          status: 'sent',
          timestamp: '2 minutes ago',
          template: 'welcome'
        },
        {
          id: '2',
          type: 'Purchase Confirmation',
          recipient: 'emma@example.com',
          status: 'sent',
          timestamp: '15 minutes ago',
          template: 'purchase-confirmation'
        },
        {
          id: '3',
          type: 'Milestone Celebration',
          recipient: 'lisa@example.com',
          status: 'sent',
          timestamp: '1 hour ago',
          template: 'milestone-celebration'
        },
        {
          id: '4',
          type: 'VIP Application',
          recipient: 'maria@example.com',
          status: 'failed',
          timestamp: '2 hours ago',
          template: 'vip-application'
        },
        {
          id: '5',
          type: 'Course Completion',
          recipient: 'anna@example.com',
          status: 'sent',
          timestamp: '3 hours ago',
          template: 'course-completion'
        }
      ];
      setRecentEmails(mockEmails);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch recent emails:', error);
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'text-green-600';
      case 'failed': return 'text-red-600';
      case 'pending': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent': return '✅';
      case 'failed': return '❌';
      case 'pending': return '⏳';
      default: return '📧';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading automation data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-6">
        <h1 className="text-3xl font-light text-gray-900">Email Automation</h1>
        <p className="text-gray-600 mt-2">Monitor and manage your luxury email sequences</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Emails</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-light text-gray-900">{stats.totalEmails.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-light text-gray-900">{stats.emailsToday}</div>
            <p className="text-xs text-gray-500 mt-1">Emails sent</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Delivery Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-light text-gray-900">{stats.deliveryRate}%</div>
            <p className="text-xs text-gray-500 mt-1">Successfully delivered</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Open Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-light text-gray-900">{stats.openRate}%</div>
            <p className="text-xs text-gray-500 mt-1">Average open rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Click Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-light text-gray-900">{stats.clickRate}%</div>
            <p className="text-xs text-gray-500 mt-1">Email engagement</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Active Sequences</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-light text-gray-900">{stats.activeSequences}</div>
            <p className="text-xs text-gray-500 mt-1">Running automations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Failed Emails</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-light text-red-600">{stats.failedEmails}</div>
            <p className="text-xs text-gray-500 mt-1">Requires attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Emails */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium text-gray-900">Recent Email Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentEmails.map((email) => (
              <div key={email.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                <div className="flex items-center space-x-4">
                  <span className="text-lg">{getStatusIcon(email.status)}</span>
                  <div>
                    <div className="font-medium text-gray-900">{email.type}</div>
                    <div className="text-sm text-gray-500">{email.recipient}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-medium ${getStatusColor(email.status)}`}>
                    {email.status.charAt(0).toUpperCase() + email.status.slice(1)}
                  </div>
                  <div className="text-xs text-gray-500">{email.timestamp}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium text-gray-900">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 border border-gray-200 rounded-lg text-left hover:bg-gray-50 transition-colors">
              <div className="font-medium text-gray-900">Test Email Template</div>
              <div className="text-sm text-gray-500 mt-1">Send a test email to verify templates</div>
            </button>
            
            <button className="p-4 border border-gray-200 rounded-lg text-left hover:bg-gray-50 transition-colors">
              <div className="font-medium text-gray-900">View Make.com Scenarios</div>
              <div className="text-sm text-gray-500 mt-1">Manage automation sequences</div>
            </button>
            
            <button className="p-4 border border-gray-200 rounded-lg text-left hover:bg-gray-50 transition-colors">
              <div className="font-medium text-gray-900">Email Analytics</div>
              <div className="text-sm text-gray-500 mt-1">Detailed performance reports</div>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
