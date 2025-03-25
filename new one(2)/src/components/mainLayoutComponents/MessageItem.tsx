import React from 'react';
import ImagePreview from '../ImagePreview';
import { Message } from './types';
import { renderMessageStatus, parseMessageContent } from './ChatUtils';

interface MessageItemProps {
  message: Message;
  isDarkMode: boolean;
  handleCodeBlockClick: (content: string, language: string) => void;
  showReasoning?: boolean;
  reasoning?: string;
}

const MessageItem: React.FC<MessageItemProps> = ({
  message,
  isDarkMode,
  handleCodeBlockClick,
  showReasoning,
  reasoning
}) => {
  return (
    <div className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] rounded-[20px] p-4 message-bubble cursor-pointer hover:opacity-95 transition-all duration-300 ${
          message.type === "user"
            ? isDarkMode
              ? "bg-gray-800 text-white shadow-3xl shadow-blue-950 rounded-br-md border-l-2 border-b-2 border-blue-950"
              : "bg-indigo-500 text-white shadow-md hover:shadow-lg rounded-br-md"
            : isDarkMode
            ? "text-gray-100"
            : "text-gray-800"
        }`}
      >
        {/* Message header */}
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center">
            <i className={`fas ${message.type === "user" ? "fa-user" : ""} mr-2`}> </i>
            <span className="text-sm opacity-75">
              {new Date(message.timestamp).toLocaleTimeString()}
            </span>
          </div>
          
          {message.status === "sending" && message.type === "user" ? (
            <div className="text-gray-400 ml-2 animate-pulse">
              <i className="fas fa-circle-notch fa-spin"></i>
            </div>
          ) : (
            renderMessageStatus(message.status)
          )}
        </div>

        {/* File attachments */}
        {message.file && (
          <div className="mb-2">
            {message.file.type.startsWith("image/") ? (
              <ImagePreview
                imageUrl={message.file.url}
                isDarkMode={isDarkMode}
                fileName={message.file.name}
              />
            ) : message.file.type === "application/pdf" ? (
              <div className="flex items-center space-x-2 bg-black/20 rounded-lg p-3">
                <i className="fas fa-file-pdf text-2xl text-red-400"> </i>
                <div className="flex-1 min-w-0">
                  <div className="truncate"> {message.file.name} </div>
                  <div className="text-sm opacity-75"> PDF Document</div>
                </div>
                <a
                  href={message.file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <i className="fas fa-external-link-alt"> </i>
                </a>
              </div>
            ) : (
              <div className="flex items-center space-x-2 bg-black/20 rounded-lg p-3">
                <i className="fas fa-file text-2xl text-blue-400"> </i>
                <div className="flex-1 min-w-0">
                  <div className="truncate"> {message.file.name} </div>
                  <div className="text-sm opacity-75"> Document </div>
                </div>
                <a
                  href={message.file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <i className="fas fa-download"> </i>
                </a>
              </div>
            )}
          </div>
        )}

        {/* Message content */}
        <div className="space-y-4 ">
          {parseMessageContent(message.content).map((part: any, index: number) =>
            part.type === "code" ? (
              <div
                key={index}
                onClick={() => handleCodeBlockClick(part.content, part.language || "plaintext")}
                className={`cursor-pointer group rounded-lg overflow-hidden ${
                  isDarkMode ? "bg-gray-800" : "bg-gray-50"
                }`}
              >
                <div
                  className={`flex items-center justify-between px-4 py-2 ${
                    isDarkMode ? "bg-gray-700" : "bg-gray-100"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <i className="fas fa-code"></i>
                    <span
                      className={`text-sm font-medium ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {part.language || "plaintext"}
                    </span>
                  </div>
                  <div
                    className={`opacity-0 group-hover:opacity-100 transition-opacity ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    <i className="fas fa-expand-alt"></i>
                  </div>
                </div>
                <div className="p-4 max-h-60 overflow-hidden relative">
                  <pre className="overflow-x-auto">
                    <code
                      className={`language-${part.language} ${
                        isDarkMode ? "text-gray-300" : "text-gray-800"
                      }`}
                    >
                      {part.content}
                    </code>
                  </pre>
                  <div
                    className={`absolute bottom-0 inset-x-0 h-8 ${
                      isDarkMode
                        ? "bg-gradient-to-t from-gray-800"
                        : "bg-gradient-to-t from-gray-50"
                    }`}
                  ></div>
                </div>
              </div>
            ) : (
              <div key={index} >
                <p
  className="text-base leading-relaxed whitespace-pre-wrap"
  dangerouslySetInnerHTML={{
    __html: part.content
      .replace(
        /###(.*?)###/g,
        "<span style='font-size:24px; font-weight:900'>$1</span>"
      ) // Increases size & bolds ### text
      .replace(
        /\*\*\*(.*?)\*\*\*/g,
        "<strong style='font-size:22px; font-weight:800'>$1</strong>"
      )
      .replace(
        /\*\*(.*?)\*\*/g,
        "<span style='font-weight:600; font-size:18px;'>$1</span>"
      ),
  }}
></p>

              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
