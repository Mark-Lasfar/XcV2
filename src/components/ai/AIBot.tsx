import React, { useState, useRef, useEffect } from 'react';
import { aiService } from '../../services/aiService';
import { useAuth } from '../../hooks/useAuth';
import { MessageCircle, X, Send, Mic, Volume2, Minimize2 } from 'lucide-react';

interface AIBotProps {
  nickname: string;
  isEnabled: boolean;
  avatar?: string;
}

const AIBot: React.FC<AIBotProps> = ({ nickname, isEnabled, avatar }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated, user } = useAuth();

  // ✅ رسالة ترحيب حسب اللغة
  const getWelcomeMessage = () => {
    const name = nickname || 'this person';
    return `Hi! I'm the AI assistant for ${name}. Ask me anything about them!`;
  };

  useEffect(() => {
    if (isEnabled && messages.length === 0) {
      setMessages([
        {
          role: 'bot',
          content: getWelcomeMessage(),
        },
      ]);
    }
  }, [isEnabled, nickname]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await aiService.askQuestion(nickname, userMessage);
      
      // ✅ التعامل مع الرد بشكل صحيح
      let answer = 'Sorry, I could not process your question.';
      if (response) {
        if (typeof response === 'string') {
          answer = response;
        } else if (response.answer) {
          answer = response.answer;
        } else if (response.data?.answer) {
          answer = response.data.answer;
        } else if (response.data) {
          answer = response.data;
        }
      }
      
      setMessages((prev) => [
        ...prev,
        { role: 'bot', content: answer },
      ]);
    } catch (error: any) {
      console.error('AI Error:', error);
      let errorMessage = 'Network error. Please try again later.';
      
      if (error.response?.status === 403) {
        errorMessage = 'AI Bot is not enabled for this profile.';
      } else if (error.response?.status === 404) {
        errorMessage = 'Profile not found.';
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      
      setMessages((prev) => [
        ...prev,
        { role: 'bot', content: errorMessage },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isEnabled) return null;

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-lg hover:scale-110 transition-all duration-300 flex items-center justify-center group"
        aria-label="Toggle AI Chat"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white" />
        )}
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
        {/* Tooltip */}
        <span className="absolute bottom-full mb-2 px-2 py-1 text-xs bg-gray-800 text-white rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none">
          {isOpen ? 'Close chat' : 'Open AI chat'}
        </span>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 h-[500px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-slide-up">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 text-white flex justify-between items-center shrink-0">
            <div className="flex items-center gap-2">
              <img
                src={avatar || '/assets/img/default-avatar-ai.png'}
                className="w-8 h-8 rounded-full object-cover border-2 border-white"
                alt="AI Avatar"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/assets/img/default-avatar-ai.png';
                }}
              />
              <div>
                <h3 className="font-semibold text-sm">AI Assistant</h3>
                <p className="text-xs opacity-80">Powered by MGZon AI</p>
              </div>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/20 rounded-full transition"
                aria-label="Minimize"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/20 rounded-full transition"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-900/50">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                Start a conversation...
              </div>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                      msg.role === 'user'
                        ? 'bg-blue-500 text-white rounded-tr-none'
                        : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-tl-none shadow-sm'
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-start animate-fade-in">
                <div className="bg-white dark:bg-gray-700 p-3 rounded-2xl rounded-tl-none shadow-sm">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" />
                    <span className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce delay-100" />
                    <span className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t dark:border-gray-700 bg-white dark:bg-gray-800 shrink-0">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything..."
                className="flex-1 px-4 py-2 border rounded-full dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-sm"
                disabled={isLoading}
                maxLength={500}
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <div className="text-xs text-gray-400 text-center mt-1">
              {isAuthenticated ? '💬 You are the profile owner' : '💬 Ask about this profile'}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIBot;