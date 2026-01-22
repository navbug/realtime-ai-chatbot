import React from 'react';
import { ConnectionStatus as Status } from '@/types/chat';
import { Ban, Check, Loader2, XCircle } from 'lucide-react';

interface ConnectionStatusProps {
  status: Status;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ status }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'connected':
        return 'bg-green-500';
      case 'connecting':
        return 'bg-yellow-500 animate-pulse';
      case 'disconnected':
        return 'bg-gray-400';
      case 'error':
        return 'bg-red-500 animate-pulse';
      default:
        return 'bg-gray-400';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'connected':
        return 'Connected';
      case 'connecting':
        return 'Connecting...';
      case 'disconnected':
        return 'Disconnected';
      case 'error':
        return 'Connection Error';
      default:
        return 'Unknown';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'connected':
        return (
          <Check className="w-3 h-3 text-green-600" />
        );
      case 'connecting':
        return (
          <Loader2 className="w-3 h-3 text-yellow-600 animate-spin" />
        );
      case 'disconnected':
        return (
          <Ban className="w-3 h-3 text-gray-600" />
        );
      case 'error':
        return (
          <XCircle className="w-3 h-3 text-red-600" />
        );
      default:
        return null;
    }
  };

  const getBgColor = () => {
    switch (status) {
      case 'connected':
        return 'bg-green-50 border-green-200';
      case 'connecting':
        return 'bg-yellow-50 border-yellow-200';
      case 'disconnected':
        return 'bg-gray-50 border-gray-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getTextColor = () => {
    switch (status) {
      case 'connected':
        return 'text-green-700';
      case 'connecting':
        return 'text-yellow-700';
      case 'disconnected':
        return 'text-gray-700';
      case 'error':
        return 'text-red-700';
      default:
        return 'text-gray-700';
    }
  };

  return (
    <div className={`flex items-center justify-center gap-2 px-3 py-2 border-b ${getBgColor()} transition-colors`}>
      <div className={`w-2 h-2 rounded-full ${getStatusColor()}`} />
      {getStatusIcon()}
      <span className={`text-xs font-medium ${getTextColor()}`}>
        {getStatusText()}
      </span>
    </div>
  );
};