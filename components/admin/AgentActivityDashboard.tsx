'use client';

import { useState, useEffect } from 'react';

interface AuditEvent {
  timestamp: string;
  agent: string;
  action: string;
  message: string;
  files: string[];
  sha: string;
}

interface AuditData {
  events: AuditEvent[];
  summary: {
    total: number;
    byAgent: Record<string, number>;
    timeRange: string;
  };
}

export function AgentActivityDashboard() {
  const [auditData, setAuditData] = useState<AuditData | null>(null);
  const [timeRange, setTimeRange] = useState(7);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    fetchAuditLog();
  }, [timeRange]);
  
  const fetchAuditLog = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/agent-tools/audit-log?days=${timeRange}`);
      if (res.ok) {
        const data = await res.json();
        setAuditData(data);
      } else {
        console.error('Failed to fetch audit log');
      }
    } catch (error) {
      console.error('Error fetching audit log:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const getAgentColor = (agent: string) => {
    const colors: Record<string, string> = {
      maya: 'bg-blue-100 text-blue-800',
      victoria: 'bg-purple-100 text-purple-800',
      rachel: 'bg-pink-100 text-pink-800',
      quinn: 'bg-green-100 text-green-800',
      diana: 'bg-gray-100 text-gray-800',
      ava: 'bg-orange-100 text-orange-800'
    };
    return colors[agent] || 'bg-gray-100 text-gray-800';
  };
  
  return (
    <div className="border border-luxury-black p-6">
      <h2 className="font-bodoni text-2xl mb-6">Agent Activity Monitor</h2>
      
      {/* Time Range Selector */}
      <div className="flex gap-4 mb-6">
        {[1, 7, 30].map(days => (
          <button
            key={days}
            onClick={() => setTimeRange(days)}
            className={`px-4 py-2 transition-colors ${
              timeRange === days 
                ? 'bg-luxury-black text-white' 
                : 'border border-luxury-black hover:bg-gray-50'
            }`}
          >
            {days} {days === 1 ? 'Day' : 'Days'}
          </button>
        ))}
      </div>
      
      {loading && (
        <div className="text-center py-8">
          <div className="text-gray-500">Loading activity data...</div>
        </div>
      )}
      
      {/* Activity Summary */}
      {auditData && !loading && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-4 border border-luxury-black">
              <div className="text-3xl font-bodoni">{auditData.summary.total}</div>
              <div className="text-sm uppercase tracking-wider text-gray-600">Total Changes</div>
            </div>
            
            <div className="text-center p-4 border border-luxury-black">
              <div className="text-3xl font-bodoni">{Object.keys(auditData.summary.byAgent).length}</div>
              <div className="text-sm uppercase tracking-wider text-gray-600">Active Agents</div>
            </div>
            
            <div className="text-center p-4 border border-luxury-black">
              <div className="text-3xl font-bodoni">{auditData.summary.timeRange}</div>
              <div className="text-sm uppercase tracking-wider text-gray-600">Time Range</div>
            </div>
          </div>
          
          {/* Agent Breakdown */}
          <div className="mb-8">
            <h3 className="text-sm uppercase tracking-wider mb-4 font-semibold">Activity by Agent</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(auditData.summary.byAgent).map(([agent, count]) => (
                <div key={agent} className="flex justify-between items-center p-3 border border-gray-200">
                  <span className={`px-2 py-1 text-xs rounded ${getAgentColor(agent)} capitalize`}>
                    {agent}
                  </span>
                  <span className="font-mono font-semibold">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
      
      {/* Recent Activity Feed */}
      <div>
        <h3 className="text-sm uppercase tracking-wider mb-4 font-semibold">Recent Activity</h3>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {auditData?.events.map((event, i) => (
            <div key={i} className="border-b border-gray-200 pb-3">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 text-xs rounded ${getAgentColor(event.agent)} capitalize`}>
                    {event.agent}
                  </span>
                  <span className="text-xs text-gray-500 uppercase tracking-wider">
                    {event.action}
                  </span>
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(event.timestamp).toLocaleString()}
                </span>
              </div>
              <div className="text-sm text-gray-800 mb-1">{event.message}</div>
              {event.files.length > 0 && (
                <div className="text-xs text-gray-500">
                  Files: {event.files.slice(0, 3).join(', ')}
                  {event.files.length > 3 && ` +${event.files.length - 3} more`}
                </div>
              )}
            </div>
          ))}
          
          {auditData?.events.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No activity found in the selected time range
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 