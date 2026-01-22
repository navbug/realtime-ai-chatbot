import React from 'react';

export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-center gap-1 px-4 py-3 bg-white border border-gray-200 rounded-2xl rounded-tl-sm w-fit shadow-sm">
      <div className="flex items-center gap-1">
        <div 
          className="w-2 h-2 bg-linear-to-r from-blue-400 to-purple-500 rounded-full animate-bounce" 
          style={{ animationDelay: '0ms', animationDuration: '1s' }} 
        />
        <div 
          className="w-2 h-2 bg-linear-to-r from-blue-400 to-purple-500 rounded-full animate-bounce" 
          style={{ animationDelay: '150ms', animationDuration: '1s' }} 
        />
        <div 
          className="w-2 h-2 bg-linear-to-r from-blue-400 to-purple-500 rounded-full animate-bounce" 
          style={{ animationDelay: '300ms', animationDuration: '1s' }} 
        />
      </div>
      <span className="text-xs text-gray-500 ml-1">AI is thinking...</span>
    </div>
  );
};