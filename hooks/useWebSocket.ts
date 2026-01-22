import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { ConnectionStatus, Message } from '@/types/chat';

interface UseWebSocketReturn {
  socket: Socket | null;
  connectionStatus: ConnectionStatus;
  sendMessage: (message: string, history: Message[]) => void;
}

export const useWebSocket = (): UseWebSocketReturn => {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connecting');
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socketInstance = io({
      path: '/api/socket',
      addTrailingSlash: false,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 3,
      timeout: 6000,
    });

    socketRef.current = socketInstance;

    socketInstance.on('connect', () => {
      console.log('WebSocket connected');
      setConnectionStatus('connected');
    });

    socketInstance.on('disconnect', () => {
      console.log('WebSocket disconnected');
      setConnectionStatus('disconnected');
    });

    socketInstance.on('connect_error', (error) => {
      console.error('Connection error:', error);
      setConnectionStatus('error');
    });

    socketInstance.io.on('reconnect', (attempt) => {
      setConnectionStatus('connected');
    });

    socketInstance.io.on('reconnect_attempt', () => {
      setConnectionStatus('connecting');
    });

    socketInstance.io.on('reconnect_error', (error) => {
      console.error('Reconnection error:', error);
      setConnectionStatus('error');
    });

    socketInstance.io.on('reconnect_failed', () => {
      console.error('Reconnection failed');
      setConnectionStatus('error');
    });

    // Cleanup on unmount
    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const sendMessage = (message: string, history: Message[]) => {
    if (socketRef.current && connectionStatus === 'connected') {
      socketRef.current.emit('send-message', { message, history });
    } else {
      console.error('Cannot send message: Socket not connected');
    }
  };

  return {
    socket: socketRef.current,
    connectionStatus,
    sendMessage,
  };
};