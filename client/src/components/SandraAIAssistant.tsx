
import { useState, useEffect, useRef } from 'react';
import { X, MessageCircle, Send, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import useSubscription from '@/hooks/useSubscription';

type ToneType = 'real-talk' | 'soft-sister' | 'strategic-mentor';
type UseCaseType = 'plan' | 'bio' | 'checklist';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'sandra';
  timestamp: Date;
}

export default function SandraAIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedTone, setSelectedTone] = useState<ToneType>('strategic-mentor');
  const [showGreeting, setShowGreeting] = useState(true);
  const [hasOpenedBefore, setHasOpenedBefore] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { subscription } = useSubscription();

  const isProOrVIP = subscription?.tier === 'branded' || subscription?.tier === 'vip';

  const toneOptions = {
    'real-talk': 'Real Talk Coach',
    'soft-sister': 'Soft Sister',
    'strategic-mentor': 'Strategic Mentor'
  };

  const useCases = [
    {
      id: 'plan' as UseCaseType,
      title: 'Content Plan',
      description: 'Build strategic content calendar',
      locked: !isProOrVIP
    },
    {
      id: 'bio' as UseCaseType,
      title: 'Bio Optimization',
      description: 'Craft compelling brand bio',
      locked: false
    },
    {
      id: 'checklist' as UseCaseType,
      title: 'Brand Checklist',
      description: 'Audit brand consistency',
      locked: !isProOrVIP
    }
  ];

  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    const hasOpened = localStorage.getItem('sandra-ai-opened');
    if (hasOpened) {
      setHasOpenedBefore(true);
      setShowGreeting(false);
    }
  }, []);

  const handleOpen = () => {
    setIsOpen(true);
    if (!hasOpenedBefore) {
      localStorage.setItem('sandra-ai-opened', 'true');
      setHasOpenedBefore(true);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setShowGreeting(false);
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);
    setShowGreeting(false);

    try {
      const response = await fetch('/api/sandra/prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: inputText,
          tone: selectedTone,
          context: 'assistant'
        }),
        credentials: 'include'
      });

      const data = await response.json();
      
      const sandraMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response || 'I\'m here to help guide your brand journey.',
        sender: 'sandra',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, sandraMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'I\'m experiencing technical difficulties. Please try again.',
        sender: 'sandra',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleUseCaseClick = (useCase: UseCaseType) => {
    if (useCases.find(uc => uc.id === useCase)?.locked) return;
    
    const prompts = {
      plan: "Help me create a strategic content calendar for my brand",
      bio: "Help me optimize my brand bio to attract my ideal audience",
      checklist: "Give me a brand consistency checklist to audit my presence"
    };

    setInputText(prompts[useCase]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Locked State Component for Free Users
  if (!isProOrVIP && isOpen) {
    return (
      <>
        {/* Floating Button */}
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            onClick={handleOpen}
            className="w-14 h-14 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
            style={{
              backgroundColor: '#171719',
              color: '#F1F1F1',
              border: 'none'
            }}
          >
            <span 
              className="text-lg font-normal"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              S.
            </span>
          </Button>
        </div>

        {/* Locked Panel */}
        <div className="fixed inset-0 z-40 bg-black bg-opacity-20" onClick={handleClose} />
        <div 
          className="fixed right-0 top-0 h-full w-full md:w-[480px] z-50 shadow-2xl"
          style={{ backgroundColor: '#F1F1F1' }}
        >
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-[#B5B5B3] flex justify-between items-center">
              <h2 
                className="text-2xl font-normal"
                style={{ 
                  fontFamily: 'Cormorant Garamond, serif',
                  color: '#171719'
                }}
              >
                Sandra AI™
              </h2>
              <Button
                onClick={handleClose}
                variant="ghost"
                size="sm"
                className="p-2"
              >
                <X className="w-5 h-5" style={{ color: '#4C4B4B' }} />
              </Button>
            </div>

            {/* Locked Content */}
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center max-w-sm">
                <div 
                  className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(23, 23, 25, 0.1)' }}
                >
                  <MessageCircle className="w-10 h-10" style={{ color: '#171719' }} />
                </div>
                
                <h3 
                  className="text-3xl font-normal mb-4"
                  style={{ 
                    fontFamily: 'Cormorant Garamond, serif',
                    color: '#171719'
                  }}
                >
                  Sandra AI is reserved for PRO users
                </h3>
                
                <p 
                  className="text-lg mb-8 leading-relaxed"
                  style={{ 
                    fontFamily: 'Neue Einstellung, sans-serif',
                    color: '#4C4B4B'
                  }}
                >
                  Upgrade to unlock strategic brand guidance
                </p>
                
                <Button 
                  className="px-8 py-3 font-medium uppercase tracking-wide transition-all duration-300"
                  style={{ 
                    backgroundColor: 'transparent',
                    color: '#171719',
                    border: '1px solid #171719',
                    borderRadius: '0px',
                    fontFamily: 'Neue Einstellung, sans-serif',
                    letterSpacing: '0.5px'
                  }}
                  onClick={() => window.location.href = '/pricing'}
                >
                  View Plans
                </Button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative group">
          <Button
            onClick={handleOpen}
            className="w-14 h-14 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
            style={{
              backgroundColor: '#171719',
              color: '#F1F1F1',
              border: 'none'
            }}
          >
            <span 
              className="text-lg font-normal"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              S.
            </span>
          </Button>
          
          {/* Hover Label */}
          <div 
            className="absolute bottom-full right-0 mb-2 px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap"
            style={{ 
              backgroundColor: '#171719',
              color: '#F1F1F1',
              fontFamily: 'Neue Einstellung, sans-serif',
              fontSize: '14px'
            }}
          >
            Sandra AI
          </div>
        </div>
      </div>

      {/* Slide-Out Panel */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black bg-opacity-20 md:bg-transparent" onClick={handleClose} />
          <div 
            className="fixed right-0 top-0 h-full w-full md:w-[480px] z-50 shadow-2xl transform transition-transform duration-300"
            style={{ backgroundColor: '#F1F1F1' }}
          >
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="p-6 border-b border-[#B5B5B3] flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <h2 
                    className="text-2xl font-normal"
                    style={{ 
                      fontFamily: 'Cormorant Garamond, serif',
                      color: '#171719'
                    }}
                  >
                    Sandra AI™
                  </h2>
                  
                  {/* Tone Selector */}
                  <div className="relative">
                    <select
                      value={selectedTone}
                      onChange={(e) => setSelectedTone(e.target.value as ToneType)}
                      className="appearance-none px-3 py-1 text-xs uppercase tracking-wide border border-[#B5B5B3] bg-white pr-8"
                      style={{ 
                        fontFamily: 'Neue Einstellung, sans-serif',
                        color: '#4C4B4B',
                        borderRadius: '0px'
                      }}
                    >
                      {Object.entries(toneOptions).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 pointer-events-none" style={{ color: '#4C4B4B' }} />
                  </div>
                </div>
                
                <Button
                  onClick={handleClose}
                  variant="ghost"
                  size="sm"
                  className="p-2"
                >
                  <X className="w-5 h-5" style={{ color: '#4C4B4B' }} />
                </Button>
              </div>

              {/* Content Area */}
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Greeting or Messages */}
                <div className="flex-1 overflow-y-auto p-6">
                  {showGreeting && messages.length === 0 ? (
                    <div className="space-y-6">
                      {/* Greeting */}
                      <div className="text-center mb-8">
                        <h3 
                          className="text-4xl md:text-5xl font-light mb-4"
                          style={{ 
                            fontFamily: 'Cormorant Garamond, serif',
                            color: '#171719'
                          }}
                        >
                          Hi, I'm Sandra —
                        </h3>
                        <p 
                          className="text-lg"
                          style={{ 
                            fontFamily: 'Neue Einstellung, sans-serif',
                            color: '#4C4B4B'
                          }}
                        >
                          Your strategic brand guide for building authentic influence.
                        </p>
                      </div>

                      {/* Use Case Tiles */}
                      <div className="space-y-4">
                        <p 
                          className="text-sm uppercase tracking-wide text-center mb-6"
                          style={{ 
                            fontFamily: 'Neue Einstellung, sans-serif',
                            color: '#4C4B4B'
                          }}
                        >
                          What can I help you with?
                        </p>
                        
                        <div className="grid gap-3">
                          {useCases.map((useCase) => (
                            <Card
                              key={useCase.id}
                              className={`relative cursor-pointer transition-all duration-300 ${
                                useCase.locked ? 'opacity-60' : 'hover:scale-[1.02]'
                              }`}
                              style={{ 
                                backgroundColor: '#FFFFFF',
                                border: '1px solid #B5B5B3',
                                borderRadius: '0px'
                              }}
                              onClick={() => handleUseCaseClick(useCase.id)}
                            >
                              {useCase.locked && (
                                <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10">
                                  <div className="text-center">
                                    <p 
                                      className="text-xs uppercase tracking-wide mb-2"
                                      style={{ 
                                        fontFamily: 'Neue Einstellung, sans-serif',
                                        color: '#4C4B4B'
                                      }}
                                    >
                                      Unlock with PRO
                                    </p>
                                  </div>
                                </div>
                              )}
                              
                              <CardContent className="p-4">
                                <h4 
                                  className="text-lg font-normal mb-1"
                                  style={{ 
                                    fontFamily: 'Cormorant Garamond, serif',
                                    color: '#171719'
                                  }}
                                >
                                  {useCase.title}
                                </h4>
                                <p 
                                  className="text-sm"
                                  style={{ 
                                    fontFamily: 'Neue Einstellung, sans-serif',
                                    color: '#4C4B4B'
                                  }}
                                >
                                  {useCase.description}
                                </p>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>

                      {/* Help Chip */}
                      <div className="text-center mt-6">
                        <Badge 
                          className="px-4 py-2 text-xs uppercase tracking-wide"
                          style={{ 
                            backgroundColor: 'transparent',
                            color: '#4C4B4B',
                            border: '1px solid #B5B5B3',
                            borderRadius: '20px',
                            fontFamily: 'Neue Einstellung, sans-serif'
                          }}
                        >
                          Need help building your content calendar?
                        </Badge>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[85%] p-4 ${
                              message.sender === 'sandra'
                                ? 'bg-white rounded-tr-2xl rounded-tl-2xl rounded-br-2xl'
                                : 'rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl'
                            }`}
                            style={{
                              backgroundColor: message.sender === 'sandra' ? '#FFFFFF' : '#171719',
                              color: message.sender === 'sandra' ? '#171719' : '#F1F1F1',
                              fontFamily: message.sender === 'sandra' 
                                ? 'Cormorant Garamond, serif' 
                                : 'Neue Einstellung, sans-serif',
                              fontStyle: message.sender === 'sandra' ? 'italic' : 'normal'
                            }}
                          >
                            {message.text}
                          </div>
                        </div>
                      ))}
                      
                      {isTyping && (
                        <div className="flex justify-start">
                          <div 
                            className="bg-white p-4 rounded-tr-2xl rounded-tl-2xl rounded-br-2xl flex items-center space-x-1"
                          >
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </div>

                {/* Input Area */}
                <div className="p-6 border-t border-[#B5B5B3]">
                  <div className="flex space-x-3">
                    <input
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your question or idea…"
                      className="flex-1 p-3 border border-[#B5B5B3] bg-white"
                      style={{ 
                        fontFamily: 'Neue Einstellung, sans-serif',
                        fontSize: '16px',
                        borderRadius: '0px',
                        color: '#171719'
                      }}
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!inputText.trim() || isTyping}
                      className="px-4 py-3 transition-all duration-300"
                      style={{ 
                        backgroundColor: '#171719',
                        color: '#F1F1F1',
                        border: 'none',
                        borderRadius: '0px'
                      }}
                    >
                      <Send className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
