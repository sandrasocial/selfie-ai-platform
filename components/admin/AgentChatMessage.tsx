'use client';

import { Copy, User } from 'lucide-react';

type Agent = {
  name: string;
  role: string;
  avatar: string;
  color: string;
  personality: string;
};

type Message = {
  id: string;
  type: 'user' | 'agent';
  content: string;
  timestamp: Date;
  agent?: string;
  isCode?: boolean;
  isCopy?: boolean;
};

interface AgentChatMessageProps {
  message: Message;
  agent: Agent;
  onCopy: (text: string) => void;
}

export function AgentChatMessage({ message, agent, onCopy }: AgentChatMessageProps) {
  const isUser = message.type === 'user';
  const isCode = message.isCode || message.content.includes('```');
  const isCopyable = message.isCopy || isCode;

  const formatContent = (content: string) => {
    if (isCode) {
      // Simple code formatting - in real implementation, you'd use a proper syntax highlighter
      return content.replace(/```(\w+)?\n?/g, '').replace(/```/g, '');
    }
    return content;
  };

  const handleCopy = () => {
    onCopy(formatContent(message.content));
  };

  return (
    <div className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
        isUser 
          ? 'bg-luxury-black text-white' 
          : agent.color
      }`}>
        {isUser ? <User className="w-4 h-4" /> : agent.avatar}
      </div>

      {/* Message Content */}
      <div className={`flex-1 max-w-[80%] ${isUser ? 'text-right' : ''}`}>
        <div className={`inline-block p-4 rounded-lg ${
          isUser 
            ? 'bg-luxury-black text-white' 
            : 'bg-white border border-warm-gray/20'
        }`}>
          {/* Code Block */}
          {isCode ? (
            <div className="relative">
              <pre className="text-sm overflow-x-auto bg-gray-50 p-3 rounded border">
                <code>{formatContent(message.content)}</code>
              </pre>
              {isCopyable && (
                <button
                  onClick={handleCopy}
                  className="absolute top-2 right-2 p-1 bg-white border border-gray-200 rounded hover:bg-gray-50 transition-colors"
                  title="Copy to clipboard"
                >
                  <Copy className="w-3 h-3 text-gray-600" />
                </button>
              )}
            </div>
          ) : (
            /* Regular Message */
            <div className="relative">
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              {isCopyable && (
                <button
                  onClick={handleCopy}
                  className="absolute top-0 right-0 p-1 opacity-0 hover:opacity-100 transition-opacity"
                  title="Copy to clipboard"
                >
                  <Copy className="w-3 h-3 text-gray-400" />
                </button>
              )}
            </div>
          )}
        </div>
        
        {/* Timestamp */}
        <div className={`text-xs text-warm-gray mt-1 ${isUser ? 'text-right' : ''}`}>
          {message.timestamp.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </div>
      </div>
    </div>
  );
} 