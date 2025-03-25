import React, { useState, useEffect } from "react"
import ImagePreview from "../ImagePreview"
import AIReasoningDisplay from "../AIReasoningDisplay"
import AIThoughtProcess from "../AIThoughtProcess"
import TypingAnimation from "../TypingAnimation"
import { Message } from "./types"
import { motion } from "framer-motion"

interface MessageListProps {
  messages: Message[]
  isDarkMode: boolean
  isGenerating: boolean
  showReasoning: boolean
  currentReasoning: string
  parseMessageContent: (content: string) => { type: string; content: string; language?: string }[]
  handleCodeBlockClick: (content: string, language: string) => void
  renderMessageStatus: (status: Message["status"]) => React.ReactNode
  messagesEndRef: React.RefObject<HTMLDivElement>
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
  // Track which messages have completed typing animation
  const [completedMessages, setCompletedMessages] = useState<{[key: string]: boolean}>({});
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  // After initial render, mark existing messages as complete
  useEffect(() => {
    if (isFirstLoad && messages.length > 0) {
      const completed: {[key: string]: boolean} = {};
      messages.forEach(msg => {
        completed[msg.id] = true;
      });
      setCompletedMessages(completed);
      setIsFirstLoad(false);
    }
  }, [messages, isFirstLoad]);

  const messageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="flex-1 space-y-4 py-4 px-4 mb-40">
      {/* Messages */}
      {messages.map((message, index) => {
        const isAnimatingTyping = message.type === "assistant" && !completedMessages[message.id];
        
        return (
          <motion.div
            key={`${message.id}_${index}`}
            className={`flex flex-col ${
              message.type === "user" ? "justify-end" : "justify-start"
            }`}
            initial="hidden"
            animate="visible"
            variants={messageVariants}
            transition={{ 
              duration: 0.3, 
              delay: isFirstLoad ? 0 : 0.2,
              ease: "easeOut" 
            }}
          >
            {/* Reasoning Box - Only show for AI messages */}
            {message.type !== "user" && showReasoning && currentReasoning && message.isReasoningMessage && (
  <div className="flex justify-start">
    <div className="max-w-[80%]">
      <div className="p-4 rounded-lg">
        <AIReasoningDisplay reasoning={currentReasoning} isDarkMode={isDarkMode} />
      </div>
    </div>
  </div>
)}

            <div className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-[20px] p-6 message-bubble ${
                  message.type === "user"
                    ? isDarkMode
                      ? "bg-gray-800 text-white shadow-3xl shadow-blue-950 rounded-br-md border-l-2 border-b-2 border-blue-950"
                      : "bg-indigo-500 text-white shadow-md hover:shadow-lg rounded-br-md"
                    : isDarkMode
                    ? "text-gray-100 border-b-2 border-r-2 border-blue-950"
                    : "text-gray-800 "
                }`}
              >
                {/* Message header */}
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center">
                    <i className={`fas ${message.type === "user" ? "" : " "} mr-2`}> </i>
                    {/* <span className="text-sm opacity-75">{new Date(message.timestamp).toLocaleTimeString()}</span> */}
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

                {/* Message content with typing animation for AI messages */}
                <div className="space-y-4">
                  {message.type === "assistant" && !completedMessages[message.id] ? (
                    // AI message with typing effect
                    <div>
                      <TypingAnimation 
                        text={message.content}
                        speed={1}
                        isDarkMode={isDarkMode}
                        onComplete={() => {
                          setCompletedMessages(prev => ({...prev, [message.id]: true}));
                        }}

                        className="text-base leading-relaxed"
                      />
                    </div>
                  ) : (
                    // Regular content rendering (for user messages or completed AI messages)
                    parseMessageContent(message.content).map((part, partIndex) =>
                      part.type === "code" ? (
                        <motion.div
                          key={partIndex}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: 0.2 }}
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
                        </motion.div>
                      ) : (
                        <div key={partIndex}>
                          <p
                            className="text-base leading-relaxed whitespace-pre-wrap"
                            dangerouslySetInnerHTML={{
                              __html: part.content
                              .replace(
                                /###\s?(.*?)\n?/g,
                                "<span style='font-size:24px; font-weight:900'>$1</span>"
                              ) // Bold & Large for `###` text
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
                    )
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}

      {/* Show thinking indicator when generating but no reasoning yet */}
      {isGenerating && !showReasoning && (
        <motion.div 
          className="flex justify-start items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div
            className={`max-w-[80%] rounded-[20px] p-4 ${
              isDarkMode
                ? "bg-gray-800 text-gray-100 shadow-3xl shadow-blue-950 rounded-bl-md border-r-2 border-b-2 border-blue-950"
                : "bg-white text-gray-800 border border-gray-100 shadow-md hover:shadow-lg rounded-bl-md"
            }`}
          >
            <AIThoughtProcess isGenerating={isGenerating} reasoning={""} isDarkMode={isDarkMode} />
          </div>
        </motion.div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
