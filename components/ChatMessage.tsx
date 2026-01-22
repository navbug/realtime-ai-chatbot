import React, { useState } from "react";
import { Message } from "@/types/chat";
import ReactMarkdown from "react-markdown";
import { Check, Copy } from "lucide-react";

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"} m-6 px-2 sm:px-4 animate-fadeIn`}
    >
      <div
        className={`flex gap-3 max-w-[85%] sm:max-w-[75%] ${isUser ? "flex-row-reverse" : "flex-row"}`}
      >
        {/* Avatar */}
        <div
          className={`w-8 h-8 shrink-0 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-lg sm:text-xl shadow-md ${
            isUser ? "bg-blue-500 text-white" : "bg-purple-500 text-white"
          }`}
        >
          {isUser ? "👤" : "🤖"}
        </div>

        <div className="flex flex-col gap-1 min-w-0">
          <div
            className={`rounded-2xl px-4 py-3 shadow-sm ${
              isUser
                ? "bg-blue-500 text-white rounded-tr-sm"
                : "bg-white border border-gray-200 text-gray-900 rounded-tl-sm"
            }`}
          >
            {isUser ? (
              <p className="p-2 whitespace-pre-wrap wrap-break-words text-sm sm:text-base leading-relaxed">
                {message.content}
              </p>
            ) : (
              <div className="m-2 prose prose-sm sm:prose max-w-none prose-p:my-2 prose-pre:my-2 prose-ul:my-2 prose-ol:my-2 prose-headings:mb-2 prose-headings:mt-3">
                <ReactMarkdown>{message.content || " "}</ReactMarkdown>
              </div>
            )}
            {message.isStreaming && (
              <span className="inline-block w-1 h-4 ml-1 bg-current animate-pulse" />
            )}
          </div>

          <div
            className={`flex items-center gap-2 px-1 text-xs text-gray-500 ${isUser ? "justify-end" : "justify-start"}`}
          >
            <span className="font-medium">{formatTime(message.timestamp)}</span>

            {!isUser && !message.isStreaming && message.content && (
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 hover:text-gray-700 transition-colors opacity-0 group-hover:opacity-100"
                title="Copy to clipboard"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
