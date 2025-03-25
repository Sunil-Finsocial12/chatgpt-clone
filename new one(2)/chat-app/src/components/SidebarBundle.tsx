import React from "react";
import { ChevronDown, ChevronRight, Plus, Star, Edit, Trash2, 
         User, Settings, LogOut, Sun, Moon } from "lucide-react";

// Types
export interface Chat {
  id: string;
  title: string;
  messages: any[];
  isStarred?: boolean;
  isEditing?: boolean;
  projectId?: string;
  lastModified?: Date;
}

export interface Project {
  id: string;
  name: string;
  chats: Chat[];
  isEditing?: boolean;
}

interface SidebarProps {
  isDarkMode: boolean;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  isScrolled: boolean;
  handleNewChat: () => void;
  projects: Project[];
  setIsProjectListOpen: (isOpen: boolean) => void;
  handleAddProject: () => void;
  collapsedProjects: { [key: string]: boolean };
  handleProjectCollapse: (projectId: string, e: React.MouseEvent) => void;
  handleProjectNameEdit: (projectId: string, newName: string) => void;
  handleProjectNameEditStart: (projectId: string) => void;
  handleNewProjectChat: (projectId: string) => void;
  handleDeleteProject: (projectId: string, e: React.MouseEvent) => void;
  handleChatSelect: (chat: Chat) => void;
  handleProjectChatTitleEdit: (projectId: string, chatId: string, newTitle: string) => void;
  handleProjectChatTitleEditStart: (projectId: string, chatId: string) => void;
  handleDeleteProjectChat: (projectId: string, chatId: string, e: React.MouseEvent) => void;
  chats: Chat[];
  setChatListInitialTab: (tab: "starred" | "all") => void;
  setIsChatListOpen: (isOpen: boolean) => void;
  handleStarChat: (chatId: string, e: React.MouseEvent) => void;
  handleDeleteChat: (chatId: string, e: React.MouseEvent) => void;
  isChatDropdownOpen: boolean;
  setIsChatDropdownOpen: (isOpen: boolean) => void;
  userProfile: any;
  isAuthenticated: boolean;
  setIsLoginModalOpen: (isOpen: boolean) => void;
  setIsLogin: (isLogin: boolean) => void;
  handleLogout: () => void;
  toggleDarkMode: () => void;
}

// ... rest of your existing SidebarBundle.tsx code
// I'll keep it as is since it was already implemented fully above
