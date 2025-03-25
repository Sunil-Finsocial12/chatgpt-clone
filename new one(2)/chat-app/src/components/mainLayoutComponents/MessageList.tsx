import React from 'react';
import { Message } from './types';
import { MessageContent } from './ChatUtils';

interface MessageListProps {
  messages: Message[];
  isDarkMode: boolean;
  isGenerating: boolean;
  showReasoning: boolean;
  currentReasoning: string;
  parseMessageContent: (content: string) => MessageContent[];
  handleCodeBlockClick: (content: string, language: string) => void;
  renderMessageStatus: (status?: "sending" | "sent" | "error") => React.ReactNode;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  isDarkMode,
  isGenerating,
  showReasoning,
  currentReasoning,
  parseMessageContent,
  handleCodeBlockClick,
  renderMessageStatus,
  messagesEndRef,
}) => {
  // Function to render different content types
  const renderContent = (content: MessageContent) => {
    if (content.type === "code") {
      return (
        <div className="my-2">
          <div className="flex justify-between items-center bg-gray-800 text-gray-200 px-3 py-1 rounded-t-md">
            <span className="text-xs">{content.language || "code"}</span>
            <button
              onClick={() => handleCodeBlockClick(content.content, content.language || "plaintext")}
              className="text-xs text-gray-400 hover:text-gray-200"
            >
              Expand
            </button>
          </div>
          <pre
            className="bg-gray-800 rounded-b-md p-3 overflow-x-auto cursor-pointer"
            onClick={() => handleCodeBlockClick(content.content, content.language || "plaintext")}
          >
            <code className="text-sm text-gray-200">{content.content}</code>
          </pre>
        </div>
      );
    } else {
      // Replace newlines with <br /> for text content
      const formattedContent = content.content
        .split("\n")
        .map((line, i) => (
          <React.Fragment key={i}>
            {line}
            {i < content.content.split("\n").length - 1 && <br />}
          </React.Fragment>
        ));

      return <div className="whitespace-pre-wrap">{formattedContent}</div>;
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-4">
      {messages.map((message, index) => {
        const parsedContent = parseMessageContent(message.content);
        
        return (
          <div
            key={message.id || index}
            className={`flex flex-col ${
              message.role === "user" ? "items-end" : "items-start"
            }`}
          >
            <div
              className={`max-w-[85%] md:max-w-[75%] rounded-2xl px-4 py-3 ${
                message.role === "user"
                  ? isDarkMode
                    ? "bg-blue-700 text-white"
                    : "bg-blue-100 text-gray-800"
                  : isDarkMode
                  ? "bg-gray-800 text-gray-100"
                  : "bg-white text-gray-800 border border-gray-200"
              }`}
            >
              {parsedContent.map((content, i) => (
                <div key={i}>{renderContent(content)}</div>
              ))}
              {renderMessageStatus(message.status)}
            </div>
          </div>
        );
      })}
      
      {isGenerating && (
        <div className={`flex flex-col items-start`}>
          <div
            className={`max-w-[85%] md:max-w-[75%] rounded-2xl px-4 py-3 ${
              isDarkMode
                ? "bg-gray-800 text-gray-100"
                : "bg-white text-gray-800 border border-gray-200"
            }`}
          >
            <div className="flex space-x-2 items-center">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
            </div>
          </div>
        </div>
      )}
      
      {showReasoning && currentReasoning && (
        <div className="mt-4 p-4 rounded-md bg-yellow-100 text-gray-800">
          <h3 className="font-semibold mb-2">AI's Reasoning Process:</h3>
          <div className="text-sm whitespace-pre-wrap">{currentReasoning}</div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
