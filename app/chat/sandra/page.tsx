'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Badge } from "@/app/components/ui/badge";
import { MessageCircle, Send, Sparkles, User, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useOnboardingStatus } from '@/hooks/useProfile';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  personalized?: boolean;
  suggestions?: string[];
}

export default function SandraAIChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hey there. I'm Sandra AI, and I'm here to help you show up like you mean it. What's going on with your brand today?",
      isUser: false,
      timestamp: new Date(),
      personalized: false
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { hasProfile, isComplete, profile } = useOnboardingStatus();

  const sendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/sandra-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: inputValue,
          requirePersonalization: false 
        }),
        credentials: 'include'
      });

      const data = await response.json();

      if (data.success) {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: data.response,
          isUser: false,
          timestamp: new Date(),
          personalized: data.personalized,
          suggestions: data.suggestions
        };

        setMessages(prev => [...prev, aiMessage]);
      } else {
        console.error('AI response error:', data.error);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-rose-600 text-white rounded-lg">
              <MessageCircle className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Sandra AI</h1>
              <p className="text-gray-600">Your Personal Branding Strategist</p>
            </div>
            {isComplete && (
              <Badge className="bg-green-100 text-green-800 ml-auto">
                <Sparkles className="h-3 w-3 mr-1" />
                Personalized
              </Badge>
            )}
          </div>
          
          {!isComplete && (
            <Card className="border-2 border-rose-200 bg-rose-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-rose-600" />
                    <span className="text-sm text-rose-700">
                      Complete your brand profile to unlock personalized coaching
                    </span>
                  </div>
                  <Link href="/onboarding/brand-hub">
                    <Button size="sm" className="bg-rose-600 hover:bg-rose-700">
                      Complete Profile
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <Card>
          <CardContent className="p-0">
            {/* Messages */}
            <div className="h-[500px] overflow-y-auto p-6 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-4 ${
                      message.isUser
                        ? 'bg-rose-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {!message.isUser && (
                        <div className="flex-shrink-0">
                          <div className="w-6 h-6 bg-rose-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                            S
                          </div>
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="text-sm">{message.content}</p>
                        {message.personalized && (
                          <Badge className="mt-2 bg-green-100 text-green-800 text-xs">
                            <Sparkles className="h-3 w-3 mr-1" />
                            Personalized
                          </Badge>
                        )}
                        {message.suggestions && message.suggestions.length > 0 && (
                          <div className="mt-3 space-y-1">
                            <p className="text-xs font-medium opacity-75">Quick actions:</p>
                            {message.suggestions.map((suggestion, index) => (
                              <div
                                key={index}
                                className="text-xs opacity-75 cursor-pointer hover:opacity-100"
                                onClick={() => setInputValue(suggestion)}
                              >
                                • {suggestion}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-rose-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        S
                      </div>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="border-t p-4">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={isComplete 
                    ? `Ask Sandra about your ${profile?.industry?.toLowerCase() || 'brand'} strategy...`
                    : "Ask Sandra about your personal brand..."
                  }
                  className="flex-1"
                />
                <Button
                  onClick={sendMessage}
                  disabled={isLoading || !inputValue.trim()}
                  className="bg-rose-600 hover:bg-rose-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
