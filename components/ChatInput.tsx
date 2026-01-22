import { Loader2, Send } from 'lucide-react';
import React, { useState, KeyboardEvent, useRef, useEffect } from 'react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled: boolean;
  isLoading: boolean;
}

const MAX_CHARACTERS = 2000;

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, disabled, isLoading }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [input]);

  const handleSend = () => {
    if (input.trim() && !disabled) {
      onSendMessage(input.trim());
      setInput('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isOverLimit = input.length > MAX_CHARACTERS;
  const canSend = input.trim().length > 0 && !disabled && !isOverLimit;

  return (
    <div className="border-t border-gray-200 bg-white shadow-lg">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex flex-col gap-2">
          {input.length > 0 && (
            <div className="flex justify-between items-center px-1">
              <span className="text-xs text-gray-500">
                {disabled ? '🔄 AI is typing...' : '💬 Type your message'}
              </span>
              <span
                className={`text-xs font-medium transition-colors ${
                  isOverLimit 
                    ? 'text-red-500' 
                    : input.length > MAX_CHARACTERS * 0.8 
                    ? 'text-yellow-600' 
                    : 'text-gray-500'
                }`}
              >
                {input.length} / {MAX_CHARACTERS}
              </span>
            </div>
          )}

          <div className="flex gap-2 items-end">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={disabled ? 'Waiting for AI response...' : 'Ask me anything... (Shift+Enter for new line)'}
                disabled={disabled}
                className={`w-full resize-none rounded-2xl border ${
                  isOverLimit ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                } px-4 py-3 pr-12 focus:outline-none focus:ring-2 disabled:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-500 transition-all min-h-13 max-h-50 text-sm sm:text-base`}
                rows={1}
              />

              <div className="absolute right-3 bottom-3 text-gray-400 pointer-events-none">
                {disabled ? '⏳' : '✨'}
              </div>
            </div>

            <button
              onClick={handleSend}
              disabled={!canSend}
              className={`w-12 h-12 shrink-0 rounded-full font-semibold transition-all shadow-md flex items-center justify-center ${
                canSend
                  ? 'bg-blue-500 text-white hover:blue-600 active:scale-95 hover:shadow-lg'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
              title={canSend ? 'Send message' : 'Type a message to send'}
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>

          <div className="flex items-center justify-between px-1">
            <p className="text-xs text-gray-500">
              Press <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px] border border-gray-300 font-mono">Enter</kbd> to send
            </p>
            {isOverLimit && (
              <p className="text-xs text-red-500 font-medium animate-pulse">
                ⚠️ Message too long
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};