import React from "react";

// Message types
export interface MessageContent {
  type: string;
  content: string;
  language?: string;
}

export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp?: Date;
  status?: "sending" | "sent" | "error";
}

export interface CodeBlock {
  content: string;
  language: string;
}

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

// Utility functions
export const scrollToBottom = (ref: React.RefObject<HTMLDivElement>) => {
  if (ref.current) {
    ref.current.scrollIntoView({ behavior: "smooth" });
  }
};

export const parseMessageContent = (content: string): MessageContent[] => {
  // Check if the content is empty or not a string
  if (!content || typeof content !== "string") {
    return [{ type: "text", content: content || "" }];
  }

  const codeBlockRegex = /```([a-zA-Z0-9_]*)\n([\s\S]*?)```/g;
  const parts: MessageContent[] = [];
  let lastIndex = 0;

  let match;
  while ((match = codeBlockRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: "text", content: content.slice(lastIndex, match.index) });
    }
    parts.push({ type: "code", content: match[2], language: match[1] });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < content.length) {
    parts.push({ type: "text", content: content.slice(lastIndex) });
  }

  return parts;
};