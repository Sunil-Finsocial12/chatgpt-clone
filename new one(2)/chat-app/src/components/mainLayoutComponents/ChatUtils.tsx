import React from "react";
import { Chat, FilePreview, Message } from "./types";

export const scrollToBottom = (ref: React.RefObject<HTMLDivElement>) => {
  if (ref.current) {
    ref.current.scrollIntoView({ behavior: "smooth" });
  }
};

export interface MessageContent {
  type: string;
  content: string;
  language?: string;
}

export const parseMessageContent = (content: string): MessageContent[] => {
  if (!content || typeof content !== "string") {
    return [{ type: "text", content: content || "" }];
  }

  const codeBlockRegex = /```([a-zA-Z0-9_]*)\n([\s\S]*?)```/g;
  let match;
  let lastIndex = 0;
  const parts: MessageContent[] = [];

  while ((match = codeBlockRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push({
        type: "text",
        content: content.slice(lastIndex, match.index),
      });
    }

    parts.push({
      type: "code",
      language: match[1] || "plaintext",
      content: match[2].trim(),
    });

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < content.length) {
    parts.push({
      type: "text",
      content: content.slice(lastIndex),
    });
  }

  return parts.length > 0 ? parts : [{ type: "text", content }];
};

export const renderMessageStatus = (status?: "sending" | "sent" | "error") => {
  switch (status) {
    case "sending":
      return (
        <div className="flex items-center text-gray-500 text-sm mt-1">
          <div className="animate-pulse">Sending...</div>
        </div>
      );
    case "error":
      return (
        <div className="flex items-center text-red-500 text-sm mt-1">
          Error sending message
        </div>
      );
    default:
      return null;
  }
};

export const handleTextAreaResize = (
  e: React.ChangeEvent<HTMLTextAreaElement>,
  setInputText: (text: string) => void
) => {
  const textarea = e.target;
  const value = textarea.value;

  if (!value.trim()) {
    textarea.style.height = "56px";
  } else {
    textarea.style.height = "inherit";
    textarea.style.height = `${textarea.scrollHeight}px`;
  }

  setInputText(value);
};

export const handleFiles = async (
  files: FileList,
  currentChat: Chat | null,
  setActiveFilePreview: (preview: FilePreview | null) => void,
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>,
  setCurrentChat: React.Dispatch<React.SetStateAction<Chat | null>>,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
  setIsUploadModalOpen: React.Dispatch<React.SetStateAction<boolean>>
) => {
  // Check if there are files
  if (files && files.length > 0) {
    const file = files[0];  // Just handle the first file for simplicity
    
    // Create file preview object
    const filePreview: FilePreview = {
      name: file.name,
      type: file.type,
      size: file.size,
    };

    // If it's a text file, try to read its content
    if (file.type.startsWith('text/') || 
        file.name.endsWith('.json') || 
        file.name.endsWith('.md') || 
        file.name.endsWith('.csv')) {
      try {
        const text = await file.text();
        filePreview.content = text;
      } catch (error) {
        console.error('Error reading file content:', error);
      }
    }

    setActiveFilePreview(filePreview);
  }
};
