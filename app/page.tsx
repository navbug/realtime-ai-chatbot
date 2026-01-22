'use client';

import React, { useState } from 'react';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useChatState } from '@/hooks/useChatState';
import { ConnectionStatus } from '@/components/ConnectionStatus';
import { ChatContainer } from '@/components/ChatContainer';
import { ChatInput } from '@/components/ChatInput';
import { AlertCircle, Trash2, X } from 'lucide-react';

export default function Home() {
  const { socket, connectionStatus, sendMessage } = useWebSocket();
  const { messages, isLoading, error, addUserMessage, clearError, clearChat } = useChatState(socket);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleSendMessage = (message: string) => {
    addUserMessage(message);
    sendMessage(message, messages);
  };

  const handleClearChat = () => {
    clearChat();
    setShowClearConfirm(false);
  };

  const isInputDisabled = isLoading || connectionStatus !== 'connected';

  return (
    <div className="flex flex-col h-screen bg-blue-50">
      <header className="bg-white px-4 py-2 shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center text-white text-xl shadow-md">
              🤖
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold bg-blue-600 bg-clip-text text-transparent">
                AI Chat Assistant
              </h1>
              <p className="text-xs text-gray-600 hidden sm:block">Powered by Google Gemini</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {messages.length > 0 && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-full">
                <span className="text-xs font-medium text-blue-700">
                  {messages.length} {messages.length === 1 ? 'message' : 'messages'}
                </span>
              </div>
            )}

            {messages.length > 0 && (
              <div className="relative">
                <button
                  onClick={() => setShowClearConfirm(!showClearConfirm)}
                  className="px-3 sm:px-4 py-2 text-xs sm:text-sm bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors font-medium flex items-center gap-1.5 shadow-sm"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Clear</span>
                </button>

                {showClearConfirm && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 p-3 z-10 animate-fadeIn">
                    <p className="text-sm text-gray-700 mb-3">Clear all messages ?</p>
                    <div className="flex gap-2">
                      <button
                        onClick={handleClearChat}
                        className="flex-1 px-3 py-1.5 bg-red-500 text-white rounded text-xs font-medium hover:bg-red-600 transition-colors"
                      >
                        Yes
                      </button>
                      <button
                        onClick={() => setShowClearConfirm(false)}
                        className="flex-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded text-xs font-medium hover:bg-gray-200 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        <ConnectionStatus status={connectionStatus} />
      </header>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-3 sm:p-4 animate-slideDown">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="text-sm font-semibold text-red-800 block">Error</span>
                <span className="text-xs text-red-700 wrap-break-words">{error}</span>
              </div>
            </div>
            <button
              onClick={clearError}
              className="text-red-600 hover:text-red-800 font-semibold ml-4 shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      <ChatContainer messages={messages} isLoading={isLoading} />

      <ChatInput
        onSendMessage={handleSendMessage}
        disabled={isInputDisabled}
        isLoading={isLoading}
      />
    </div>
  );
}