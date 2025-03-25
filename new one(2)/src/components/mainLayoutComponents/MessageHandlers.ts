import { Chat, Message, Project } from './types';

export const handleNewChat = (
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>,
  setCurrentChat: React.Dispatch<React.SetStateAction<Chat | null>>,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
  setShowGreeting: React.Dispatch<React.SetStateAction<boolean>>,
  setIsChatActive: React.Dispatch<React.SetStateAction<boolean>>,
  setIsNewChatStarted: React.Dispatch<React.SetStateAction<boolean>>,
  setActiveChat: React.Dispatch<React.SetStateAction<string | null>>,
  setHasMessages: React.Dispatch<React.SetStateAction<boolean>>,
  setActiveFilePreview: React.Dispatch<React.SetStateAction<any>>,
  setIsGenerating: React.Dispatch<React.SetStateAction<boolean>>,
  setIsMicActive: React.Dispatch<React.SetStateAction<boolean>>,
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const newChat: Chat = {
    id: `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    title: "New Chat",
    createdAt: new Date(),
    messages: [],
    isEditing: false,
  };

  // Add the new chat to the chats array
  setChats((prev) => [newChat, ...prev]);

  // Reset all chat-related states
  setCurrentChat(newChat);
  setMessages([]);
  setShowGreeting(false);
  setIsChatActive(true);
  setIsNewChatStarted(true);
  setActiveChat(newChat.id);
  setHasMessages(false);

  // Clear any active states
  setActiveFilePreview(null);
  setIsGenerating(false);
  setIsMicActive(false);

  if (window.innerWidth < 768) {
    setIsSidebarOpen(false);
  }
};

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
  userProfile: { name: string } | null
) => {
  if (currentChat?.id === chat.id) return;

  setCurrentChat(chat);
  setShowGreeting(false);
  setIsChatActive(true);
  setIsNewChatStarted(true);

  if (userProfile?.name) {
    await loadChatHistory(userProfile.name, chat.id);
  }

  if (window.innerWidth < 768) {
    setIsSidebarOpen(false);
  }

  setHasMessages(true);
  setIsChatListOpen(false);
};

export const handleStarChat = (
  chatId: string,
  e: React.MouseEvent,
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>
) => {
  e.stopPropagation();
  setChats((prev) =>
    prev.map((chat) => {
      if (chat.id === chatId) {
        return { ...chat, isStarred: !chat.isStarred };
      }
      return chat;
    })
  );
};

export const handleChatTitleEdit = (
  chatId: string, 
  newTitle: string,
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>,
  setCurrentChat: React.Dispatch<React.SetStateAction<Chat | null>>,
  currentChat: Chat | null
) => {
  setChats((prev) =>
    prev.map((chat) => {
      if (chat.id === chatId) {
        const updatedChat = { ...chat, title: newTitle, isEditing: false };
        if (currentChat?.id === chatId) {
          setCurrentChat(updatedChat);
        }
        return updatedChat;
      }
      return chat;
    })
  );
};

export const handleChatTitleEditStart = (
  chatId: string,
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>
) => {
  setChats((prev) =>
    prev.map((chat) => ({
      ...chat,
      isEditing: chat.id === chatId,
    }))
  );
};

// Project related handlers
export const handleAddProject = (
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>
) => {
  const newProject: Project = {
    id: `proj_${Date.now()}`,
    name: `New Project`,
    createdAt: new Date(),
    chats: [],
    isEditing: true, // Start in editing mode
  };
  setProjects((prev) => [newProject, ...prev]);
};

export const handleProjectNameEdit = (
  projectId: string, 
  newName: string,
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>
) => {
  setProjects((prev) =>
    prev.map((project) => {
      if (project.id === projectId) {
        return {
          ...project,
          name: newName,
          isEditing: false,
        };
      }
      return project;
    })
  );
};

export const handleProjectNameEditStart = (
  projectId: string,
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>
) => {
  setProjects((prev) =>
    prev.map((project) => {
      if (project.id === projectId) {
        return { ...project, isEditing: true };
      }
      return { ...project, isEditing: false };
    })
  );
};

export const handleNewProjectChat = (
  projectId: string,
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>,
  setCurrentChat: React.Dispatch<React.SetStateAction<Chat | null>>,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
  setIsNewChatStarted: React.Dispatch<React.SetStateAction<boolean>>,
  setShowGreeting: React.Dispatch<React.SetStateAction<boolean>>,
  setIsChatActive: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const newChat: Chat = {
    id: Date.now().toString(),
    title: "New Chat", // This will be updated with first message
    createdAt: new Date(),
    messages: [],
    projectId: projectId,
    isEditing: false, 
  };

  setProjects((prev) =>
    prev.map((project) => {
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

export const handleProjectChatTitleEdit = (
  projectId: string, 
  chatId: string, 
  newTitle: string,
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>,
  setCurrentChat: React.Dispatch<React.SetStateAction<Chat | null>>,
  currentChat: Chat | null
) => {
  setProjects((prev) =>
    prev.map((project) => {
      if (project.id === projectId) {
        return {
          ...project,
          chats: project.chats.map((chat) => {
            if (chat.id === chatId) {
              const updatedChat = { ...chat, title: newTitle, isEditing: false };
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

export const handleProjectChatTitleEditStart = (
  projectId: string, 
  chatId: string,
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>
) => {
  setProjects((prev) =>
    prev.map((project) => {
      if (project.id === projectId) {
        return {
          ...project,
          chats: project.chats.map((chat) => ({
            ...chat,
            isEditing: chat.id === chatId,
          })),
        };
      }
      return project;
    })
  );
};

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
