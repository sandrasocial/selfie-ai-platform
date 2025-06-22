'use client';

import { useState } from 'react';
import { PowerOff } from 'lucide-react';

export function AgentKillSwitch() {
  const [isStopping, setIsStopping] = useState(false);
  const [feedback, setFeedback] = useState('');

  const handleEmergencyStop = async () => {
    if (window.confirm('Are you sure you want to trigger an EMERGENCY STOP? This will cancel all active and pending agent tasks immediately.')) {
      setIsStopping(true);
      setFeedback('');
      try {
        const response = await fetch('/api/agents/emergency-stop', {
          method: 'POST',
        });
        const data = await response.json();

        if (response.ok) {
          setFeedback(`Success! ${data.cancelled_count} tasks have been cancelled.`);
        } else {
          throw new Error(data.error || 'Failed to trigger emergency stop.');
        }
      } catch (error: any) {
        setFeedback(`Error: ${error.message}`);
        console.error('Emergency stop failed:', error);
      } finally {
        setIsStopping(false);
      }
    }
  };

  return (
    <div className="p-4 border border-red-500/50 bg-red-900/20">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bodoni text-lg text-red-400">Emergency Stop</h3>
          <p className="text-sm text-warm-gray mt-1">
            {feedback || 'Immediately cancel all active agent tasks.'}
          </p>
        </div>
        <button
          onClick={handleEmergencyStop}
          disabled={isStopping}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <PowerOff className={`w-5 h-5 ${isStopping ? 'animate-spin' : ''}`} />
          {isStopping ? 'Stopping...' : 'HALT ALL AGENTS'}
        </button>
      </div>
    </div>
  );
} 