import { Chat, FilePreview, Project } from "./types";
import React from "react";

// Create a new chat
export const handleNewChat = (
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>,
  setCurrentChat: React.Dispatch<React.SetStateAction<Chat | null>>,
  setMessages: React.Dispatch<React.SetStateAction<any[]>>,
  setShowGreeting: React.Dispatch<React.SetStateAction<boolean>>,
  setIsChatActive: React.Dispatch<React.SetStateAction<boolean>>,
  setIsNewChatStarted: React.Dispatch<React.SetStateAction<boolean>>,
  setActiveChat: React.Dispatch<React.SetStateAction<string | null>>,
  setHasMessages: React.Dispatch<React.SetStateAction<boolean>>,
  setActiveFilePreview: React.Dispatch<React.SetStateAction<FilePreview | null>>,
  setIsGenerating: React.Dispatch<React.SetStateAction<boolean>>,
  setIsMicActive: React.Dispatch<React.SetStateAction<boolean>>,
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const newChat: Chat = {
    id: Date.now().toString(),
    title: "New Chat",
    messages: [],
    lastModified: new Date(),
  };

  setChats((prevChats) => [newChat, ...prevChats]);
  setCurrentChat(newChat);
  setMessages([]);
  setShowGreeting(false);
  setIsChatActive(true);
  setIsNewChatStarted(true);
  setActiveChat(null);
  setHasMessages(false);
  setActiveFilePreview(null);
  setIsGenerating(false);
  setIsMicActive(false);

  if (window.innerWidth < 768) {
    setIsSidebarOpen(false);
  }
};

// Select an existing chat
export const handleChatSelect = async (
  chat: Chat,
  currentChat: Chat | null,
  setCurrentChat: React.Dispatch<React.SetStateAction<Chat | null>>,
  setShowGreeting: React.Dispatch<React.SetStateAction<boolean>>,
  setIsChatActive: React.Dispatch<React.SetStateAction<boolean>>,
  setIsNewChatStarted: React.Dispatch<React.SetStateAction<boolean>>,
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setHasMessages: React.Dispatch<React.SetStateAction<boolean>>,
  setIsChatListOpen: React.Dispatch<React.SetStateAction<boolean>>,
  loadChatHistory: (username: string, chatId: string) => Promise<void>,
  userProfile: any
) => {
  if (currentChat?.id !== chat.id) {
    setCurrentChat(chat);
    setShowGreeting(false);
    setIsChatActive(true);
    setIsNewChatStarted(false);

    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }

    setHasMessages(chat.messages.length > 0);
    setIsChatListOpen(false);

    // Load chat history
    if (userProfile?.name) {
      await loadChatHistory(userProfile.name, chat.id);
    }
  }
};

// Star/Unstar a chat
export const handleStarChat = (
  chatId: string,
  e: React.MouseEvent,
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>
) => {
  e.stopPropagation();
  setChats((prevChats) =>
    prevChats.map((chat) =>
      chat.id === chatId ? { ...chat, isStarred: !chat.isStarred } : chat
    )
  );
};

// Edit chat title
export const handleChatTitleEdit = (
  chatId: string,
  newTitle: string,
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>,
  setCurrentChat: React.Dispatch<React.SetStateAction<Chat | null>>,
  currentChat: Chat | null
) => {
  const updatedChats = setChats((prevChats) =>
    prevChats.map((chat) => {
      if (chat.id === chatId) {
        const updatedChat = {
          ...chat,
          title: newTitle || "Unnamed Chat",
          isEditing: false,
        };
        if (currentChat?.id === chatId) {
          setCurrentChat(updatedChat);
        }
        return updatedChat;
      }
      return chat;
    })
  );
};

// Start editing chat title
export const handleChatTitleEditStart = (
  chatId: string,
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>
) => {
  setChats((prevChats) =>
    prevChats.map((chat) =>
      chat.id === chatId ? { ...chat, isEditing: true } : chat
    )
  );
};

// Add new project
export const handleAddProject = (
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>
) => {
  const newProject: Project = {
    id: Date.now().toString(),
    name: "New Project",
    chats: [],
    isEditing: false,
  };
  
  setProjects((prev) => [...prev, newProject]);
};

// Edit project name
export const handleProjectNameEdit = (
  projectId: string,
  newName: string,
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>
) => {
  setProjects((prevProjects) =>
    prevProjects.map((project) =>
      project.id === projectId
        ? { ...project, name: newName || "Unnamed Project", isEditing: false }
        : project
    )
  );
};

// Start editing project name
export const handleProjectNameEditStart = (
  projectId: string,
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>
) => {
  setProjects((prevProjects) =>
    prevProjects.map((project) =>
      project.id === projectId ? { ...project, isEditing: true } : project
    )
  );
};

// Create new chat in a project
export const handleNewProjectChat = (
  projectId: string,
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>,
  setCurrentChat: React.Dispatch<React.SetStateAction<Chat | null>>,
  setMessages: React.Dispatch<React.SetStateAction<any[]>>,
  setIsNewChatStarted: React.Dispatch<React.SetStateAction<boolean>>,
  setShowGreeting: React.Dispatch<React.SetStateAction<boolean>>,
  setIsChatActive: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const newChat: Chat = {
    id: Date.now().toString(),
    title: "New Chat",
    messages: [],
    projectId: projectId,
    lastModified: new Date(),
  };

  setProjects((prevProjects) =>
    prevProjects.map((project) => {
      if (project.id === projectId) {
        return {
          ...project,
          chats: [newChat, ...project.chats],
        };
      }
      return project;
    })
  );

  setCurrentChat(newChat);
  setMessages([]);
  setIsNewChatStarted(true);
  setShowGreeting(false);
  setIsChatActive(true);
};

// Toggle project collapse state
export const handleProjectCollapse = (
  projectId: string,
  e: React.MouseEvent,
  setCollapsedProjects: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>
) => {
  e.stopPropagation();
  setCollapsedProjects((prev) => ({
    ...prev,
    [projectId]: !prev[projectId],
  }));
};

// Edit project chat title
export const handleProjectChatTitleEdit = (
  projectId: string,
  chatId: string,
  newTitle: string,
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>,
  setCurrentChat: React.Dispatch<React.SetStateAction<Chat | null>>,
  currentChat: Chat | null
) => {
  setProjects((prevProjects) =>
    prevProjects.map((project) => {
      if (project.id === projectId) {
        return {
          ...project,
          chats: project.chats.map((chat) => {
            if (chat.id === chatId) {
              const updatedChat = {
                ...chat,
                title: newTitle || "Unnamed Chat",
                isEditing: false,
              };
              
              if (currentChat?.id === chatId) {
                setCurrentChat(updatedChat);
              }
              
              return updatedChat;
            }
            return chat;
          }),
        };
      }
      return project;
    })
  );
};

// Start editing project chat title
export const handleProjectChatTitleEditStart = (
  projectId: string,
  chatId: string,
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>
) => {
  setProjects((prevProjects) =>
    prevProjects.map((project) => {
      if (project.id === projectId) {
        return {
          ...project,
          chats: project.chats.map((chat) =>
            chat.id === chatId ? { ...chat, isEditing: true } : chat
          ),
        };
      }
      return project;
    })
  );
};
