import React from 'react';
import { processFileUpload } from '../../services/fileStorage/fileUtils';

interface Message {
  id: string
  content: string
  type: "user" | "assistant"
  timestamp: Date
  status: "sending" | "sent" | "error"
  file?: {
    name: string
    type: string
    url: string
  }
}

export const renderMessageStatus = (status: Message["status"]) => {
  switch (status) {
    case "sending":
      return <i className="fas fa-circle-notch fa-spin text-gray-400 ml-2"> </i>
    // case "sent":
    //   return <i className="fas fa-check text-green-500 ml-2"> </i>
    case "error":
      return <i className="fas fa-exclamation-circle text-red-500 ml-2"> </i>
    default:
      return null
  }
}

export const parseMessageContent = (content: string) => {
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g
  const parts = []
  let lastIndex = 0
  let match

  while ((match = codeBlockRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push({
        type: "text",
        content: content.slice(lastIndex, match.index),
      })
    }

    parts.push({
      type: "code",
      language: match[1] || "plaintext",
      content: match[2].trim(),
    })

    lastIndex = match.index + match[0].length
  }

  if (lastIndex < content.length) {
    parts.push({
      type: "text",
      content: content.slice(lastIndex),
    })
  }

  return parts.length > 0 ? parts : [{ type: "text", content }]
}

export const resetTextAreaHeight = () => {
  const textarea = document.querySelector("textarea")
  if (textarea) {
    textarea.style.height = "56px"
  }
}

export const handleTextAreaResize = (
  e: React.ChangeEvent<HTMLTextAreaElement>,
  setInputText: (text: string) => void
) => {
  const textarea = e.target
  const value = textarea.value

  if (!value.trim()) {
    textarea.style.height = "56px"
  } else {
    textarea.style.height = "inherit"
    textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`
  }

  setInputText(value)
}

export const handleFiles = async (
  files: FileList,
  currentChat: any,
  setActiveFilePreview: (preview: any) => void,
  setChats: (updater: (prev: any[]) => any[]) => void,
  setCurrentChat: (chat: any) => void,
  setMessages: (messages: Message[]) => void,
  setIsUploadModalOpen: (isOpen: boolean) => void
) => {
  try {
    for (const file of Array.from(files)) {
      const fileData = await processFileUpload(file);
      
      // Create file preview without showing the full URL
      const filePreview = {
        name: fileData.name,
        type: fileData.type,
        url: fileData.url, // Store URL but don't display it
        status: 'ready'
      };
      
      setActiveFilePreview(filePreview);
    }
  } catch (error) {
    console.error('Error handling files:', error);
  }

  setIsUploadModalOpen(false);
};

export const scrollToBottom = (messagesEndRef: React.RefObject<HTMLDivElement>) => {
  messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
}