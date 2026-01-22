export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

export type ConnectionStatus = 'connected' | 'disconnected' | 'connecting' | 'error';

export interface ServerToClientEvents {
  'chat-chunk': (data: { chunk: string }) => void;
  'chat-complete': () => void;
  'chat-error': (data: { error: string }) => void;
  'connection-status': (data: { status: ConnectionStatus }) => void;
}

export interface ClientToServerEvents {
  'send-message': (data: { message: string; history: Message[] }) => void;
}

// Chat state
export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  connectionStatus: ConnectionStatus;
  error: string | null;
}