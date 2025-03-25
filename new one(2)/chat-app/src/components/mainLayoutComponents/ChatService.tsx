import React from "react";
import { Chat, Message } from "./types";

// Simulated chat history loading
export const loadChatHistory = async (
  username: string,
  chatId: string,
  setIsLoadingHistory: React.Dispatch<React.SetStateAction<boolean>>,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
  setHasMessages: React.Dispatch<React.SetStateAction<boolean>>
) => {
  setIsLoadingHistory(true);
  
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock response
    const messages: Message[] = [
      {
        id: "1",
        role: "user",
        content: "Hello, can you help me with something?",
        timestamp: new Date(Date.now() - 3600000)
      },
      {
        id: "2",
        role: "assistant",
        content: "Of course! I'm here to help. What do you need assistance with?",
        timestamp: new Date(Date.now() - 3590000)
      }
    ];
    
    setMessages(messages);
    setHasMessages(messages.length > 0);
  } catch (error) {
    console.error("Error loading chat history:", error);
    setMessages([]);
    setHasMessages(false);
  } finally {
    setIsLoadingHistory(false);
  }
};

// Simulated chat fetching
export const fetchChats = async (
  username: string,
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>
) => {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock response
    const chats: Chat[] = [
      {
        id: "chat1",
        title: "Coding Help",
        messages: [
          {
            id: "msg1",
            role: "user",
            content: "How do I center a div?",
            timestamp: new Date(Date.now() - 86400000)
          }
        ],
        isStarred: true,
        lastModified: new Date(Date.now() - 86400000)
      },
      {
        id: "chat2",
        title: "Recipe Ideas",
        messages: [
          {
            id: "msg2",
            role: "user",
            content: "Give me a pasta recipe",
            timestamp: new Date(Date.now() - 172800000)
          }
        ],
        lastModified: new Date(Date.now() - 172800000)
      }
    ];
    
    setChats(chats);
  } catch (error) {
    console.error("Error fetching chats:", error);
    setChats([]);
  }
};

// Handle sending a message
export const handleSendMessage = (
  inputText: string,
  activeFilePreview: any | null,
  currentChat: Chat | null,
  isGenerating: boolean,
  userProfile: any,
  isSearchEnabled: boolean,
  setHasMessages: React.Dispatch<React.SetStateAction<boolean>>,
  setCurrentReasoning: React.Dispatch<React.SetStateAction<string>>,
  setShowReasoning: React.Dispatch<React.SetStateAction<boolean>>,
  setIsGenerating: React.Dispatch<React.SetStateAction<boolean>>,
  setShowGreeting: React.Dispatch<React.SetStateAction<boolean>>,
  setIsChatActive: React.Dispatch<React.SetStateAction<boolean>>,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
  setInputText: React.Dispatch<React.SetStateAction<string>>,
  resetTextAreaHeight: () => void,
  isAuthenticated: boolean,
  setIsLoginModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setIsLoginAnimated: React.Dispatch<React.SetStateAction<boolean>>
) => {
  // Check authentication
  if (!isAuthenticated) {
    setIsLoginModalOpen(true);
    setIsLoginAnimated(true);
    return;
  }

  // Validate input
  if (!inputText.trim() || isGenerating) return;

  // Create user message
  const userMessage: Message = {
    id: Date.now().toString(),
    role: "user",
    content: inputText,
    timestamp: new Date(),
  };

  // Add message to UI
  setMessages((prevMessages) => [...prevMessages, userMessage]);
  setHasMessages(true);
  setShowGreeting(false);
  setIsChatActive(true);

  // Reset input
  setInputText("");
  resetTextAreaHeight();

  // Generate AI response
  setIsGenerating(true);

  // For reasoning demonstration
  if (Math.random() > 0.7) {
    setCurrentReasoning("I'm analyzing the query step-by-step...\n\n1. Understanding the question\n2. Retrieving relevant information\n3. Formulating a comprehensive response");
    setShowReasoning(true);
  } else {
    setShowReasoning(false);
  }

  // Simulate API delay
  setTimeout(() => {
    // Create AI response
    let responseText = `Here's my response to "${inputText}"`;
    
    if (activeFilePreview) {
      responseText += `\n\nI see you've shared a file named "${activeFilePreview.name}".`;
    }
    
    if (isSearchEnabled) {
      responseText += "\n\nI've searched for additional information to enhance my response.";
    }

    // Add code example occasionally
    if (inputText.toLowerCase().includes("code") || Math.random() > 0.7) {
      responseText += "\n\nHere's an example in code:\n\n```javascript\nfunction example() {\n  console.log('Hello world');\n  return 42;\n}\n```";
    }

    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: responseText,
      timestamp: new Date(),
    };
    
    setMessages((prevMessages) => [...prevMessages, aiMessage]);
    setIsGenerating(false);
  }, 2000);
};

// Handle language translation (simulated)
export const handleLanguageTranslation = async (
  language: { code: string; name: string; nativeName: string },
  currentChat: Chat,
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>,
  setCurrentChat: React.Dispatch<React.SetStateAction<Chat | null>>,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
  setIsGenerating: React.Dispatch<React.SetStateAction<boolean>>
) => {
  setIsGenerating(true);
  
  try {
    // Simulate translation delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Just add a prefix to show language change
    const translatedMessages = currentChat.messages.map(message => ({
      ...message,
      content: message.role === "assistant" 
        ? `[${language.name} translation] ${message.content}`
        : message.content
    }));
    
    // Update messages in UI
    setMessages(translatedMessages);
    
    // Update current chat
    const updatedChat = {
      ...currentChat,
      messages: translatedMessages
    };
    
    setCurrentChat(updatedChat);
    
    // Update chat in list
    setChats(prevChats => 
      prevChats.map(chat => 
        chat.id === currentChat.id ? updatedChat : chat
      )
    );
  } catch (error) {
    console.error("Error translating messages:", error);
  } finally {
    setIsGenerating(false);
  }
};
