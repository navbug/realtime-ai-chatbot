import { useState, useCallback, useEffect } from 'react';
import { Message } from '@/types/chat';
import { Socket } from 'socket.io-client';

interface UseChatStateReturn {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  addUserMessage: (content: string) => void;
  clearError: () => void;
  clearChat: () => void;
}

export const useChatState = (socket: Socket | null): UseChatStateReturn => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentAssistantMessageId, setCurrentAssistantMessageId] = useState<string | null>(null);

  const addUserMessage = useCallback((content: string) => {
    const newMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
    setIsLoading(true);
    setError(null);

    const assistantMessageId = `assistant-${Date.now()}`;
    setCurrentAssistantMessageId(assistantMessageId);
    setMessages(prev => [...prev, {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isStreaming: true,
    }]);
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleChatChunk = (data: { chunk: string }) => {
      setMessages(prev => {
        const updated = [...prev];
        const lastMessage = updated[updated.length - 1];
        
        if (lastMessage && lastMessage.role === 'assistant' && lastMessage.isStreaming) {
          // Create a new object to trigger re-render
          updated[updated.length - 1] = {
            ...lastMessage,
            content: lastMessage.content + data.chunk
          };
        }
        
        return updated;
      });
    };

    const handleChatComplete = () => {
      setIsLoading(false);
      setMessages(prev => {
        const updated = [...prev];
        const lastMessage = updated[updated.length - 1];
        
        if (lastMessage && lastMessage.role === 'assistant') {
          updated[updated.length - 1] = {
            ...lastMessage,
            isStreaming: false
          };
        }
        
        return updated;
      });
      setCurrentAssistantMessageId(null);
    };

    const handleChatError = (data: { error: string }) => {
      setIsLoading(false);
      setError(data.error);
      
      setMessages(prev => {
        const updated = [...prev];
        if (updated[updated.length - 1]?.role === 'assistant' && updated[updated.length - 1]?.isStreaming) {
          updated.pop();
        }
        return updated;
      });
      
      setCurrentAssistantMessageId(null);
    };

    // Remove any existing listeners before adding new ones
    socket.off('chat-chunk');
    socket.off('chat-complete');
    socket.off('chat-error');

    // Add the new listeners
    socket.on('chat-chunk', handleChatChunk);
    socket.on('chat-complete', handleChatComplete);
    socket.on('chat-error', handleChatError);

    return () => {
      socket.off('chat-chunk', handleChatChunk);
      socket.off('chat-complete', handleChatComplete);
      socket.off('chat-error', handleChatError);
    };
  }, [socket]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearChat = useCallback(() => {
    setMessages([]);
    setError(null);
    setIsLoading(false);
    setCurrentAssistantMessageId(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    addUserMessage,
    clearError,
    clearChat,
  };
};