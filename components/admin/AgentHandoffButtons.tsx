'use client';

import { ArrowRight, Crown } from 'lucide-react';

type Agent = {
  name: string;
  role: string;
  avatar: string;
  color: string;
  personality: string;
};

interface AgentHandoffButtonsProps {
  currentAgent: string;
  agents: Record<string, Agent>;
  onSendToAgent: (agentId: string) => void;
  onSendToDiana: () => void;
}

export function AgentHandoffButtons({ 
  currentAgent, 
  agents, 
  onSendToAgent, 
  onSendToDiana 
}: AgentHandoffButtonsProps) {
  const otherAgents = Object.entries(agents).filter(([id]) => id !== currentAgent);

  return (
    <div className="space-y-3">
      {/* Send to Diana for Review */}
      <div className="flex items-center justify-between p-3 bg-purple-50 border border-purple-200 rounded-lg">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center">
            <Crown className="w-4 h-4" />
          </div>
          <div>
            <p className="text-sm font-medium text-purple-900">Send to Diana for Review</p>
            <p className="text-xs text-purple-600">Get strategic oversight and approval</p>
          </div>
        </div>
        <button
          onClick={onSendToDiana}
          className="px-4 py-2 bg-purple-600 text-white text-sm rounded-md hover:bg-purple-700 transition-colors flex items-center gap-2"
        >
          <ArrowRight className="w-4 h-4" />
          Send
        </button>
      </div>

      {/* Handoff to Other Agents */}
      <div>
        <h3 className="text-sm font-medium text-luxury-black mb-2">Handoff to:</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {otherAgents.map(([agentId, agent]) => (
            <button
              key={agentId}
              onClick={() => onSendToAgent(agentId)}
              className="flex items-center gap-2 p-3 bg-white border border-warm-gray/20 rounded-lg hover:border-luxury-black transition-colors text-left"
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${agent.color}`}>
                {agent.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-luxury-black truncate">{agent.name}</p>
                <p className="text-xs text-warm-gray truncate">{agent.role}</p>
              </div>
              <ArrowRight className="w-3 h-3 text-warm-gray flex-shrink-0" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
} 