import React, { useEffect, useRef } from "react";
import { Message } from "@/types/chat";
import { ChatMessage } from "./ChatMessage";
import { TypingIndicator } from "./TypingIndicator";

interface ChatContainerProps {
  messages: Message[];
  isLoading: boolean;
}

export const ChatContainer: React.FC<ChatContainerProps> = ({
  messages,
  isLoading,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div ref={containerRef} className="flex-1 overflow-y-auto bg-gray-50">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center px-4 py-8">
          <div className="max-w-md space-y-6 animate-fadeIn">

            <div className="relative">
              <div className="absolute inset-0 bg-blue-400 rounded-full blur-2xl opacity-20 animate-pulse"></div>
              <div className="relative text-7xl sm:text-8xl mb-4">💬</div>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-bold bg-blue-600 bg-clip-text text-transparent mb-2">
                Welcome to AI Chat
              </h2>
              <p className="text-gray-600 text-sm sm:text-base">
                Start a conversation with Gemini AI
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="py-4 sm:py-6 group">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}

          {isLoading && messages[messages.length - 1]?.content === "" && (
            <div className="flex justify-start px-2 sm:px-4 animate-fadeIn">
              <div className="flex gap-3 items-center">
                <div className="w-8 h-8 shrink-0 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-lg sm:text-xl bg-purple-500 text-white shadow-md">
                  🤖
                </div>
                <TypingIndicator />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
};
