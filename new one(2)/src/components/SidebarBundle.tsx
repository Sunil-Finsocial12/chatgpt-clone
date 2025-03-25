import React, { useState, useEffect } from "react";
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

export const Sidebar: React.FC<SidebarProps> = ({
  isDarkMode,
  isSidebarOpen,
  setIsSidebarOpen,
  isScrolled,
  handleNewChat,
  projects,
  setIsProjectListOpen,
  handleAddProject,
  collapsedProjects,
  handleProjectCollapse,
  handleProjectNameEdit,
  handleProjectNameEditStart,
  handleNewProjectChat,
  handleDeleteProject,
  handleChatSelect,
  handleProjectChatTitleEdit,
  handleProjectChatTitleEditStart,
  handleDeleteProjectChat,
  chats,
  setChatListInitialTab,
  setIsChatListOpen,
  handleStarChat,
  handleDeleteChat,
  isChatDropdownOpen,
  setIsChatDropdownOpen,
  userProfile,
  isAuthenticated,
  setIsLoginModalOpen,
  setIsLogin,
  handleLogout,
  toggleDarkMode,
}) => {
  const handleRecentChatsClick = () => {
    setChatListInitialTab("all");
    setIsChatListOpen(true);
  };

  const handleStarredChatsClick = () => {
    setChatListInitialTab("starred");
    setIsChatListOpen(true);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Toggle button for mobile */}
      <button
        className={`fixed top-5 left-3 z-50 md:hidden transition-all duration-300 ${
          isSidebarOpen ? "opacity-0" : "opacity-100"
        }`}
        onClick={() => setIsSidebarOpen(true)}
        aria-label="Open sidebar"
      >
        <div className="w-8 h-6 flex flex-col justify-between">
          <div className="w-full h-0.5 bg-gray-300 rounded"></div>
          <div className="w-full h-0.5 bg-gray-300 rounded"></div>
          <div className="w-full h-0.5 bg-gray-300 rounded"></div>
        </div>
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 z-50 transition-transform duration-300 ease-in-out transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:w-16 md:hover:w-64 group`}
      >
        {/* Sidebar toggle button for desktop */}
        <button
          className={`absolute top-4 right-4 z-50 md:hidden`}
          onClick={() => setIsSidebarOpen(false)}
          aria-label="Close sidebar"
        >
          <svg
            className="w-6 h-6 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>

        <div className={`h-full flex flex-col ${
          isDarkMode ? "bg-gray-900 border-r border-gray-800" : "bg-blue-50 border-r border-gray-200"
        }`}>
          {/* New Chat Button */}
          <div className="p-2 md:pt-16">
            <button
              onClick={handleNewChat}
              className={`w-full flex items-center justify-start p-3 rounded-md transition-all ${
                isDarkMode 
                  ? "hover:bg-gray-800 text-white" 
                  : "hover:bg-blue-100 text-gray-700"
              }`}
            >
              <Plus size={20} />
              <span className="ml-3 whitespace-nowrap overflow-hidden opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                New Chat
              </span>
            </button>
          </div>

          {/* Project Section */}
          <div className="mt-2 px-2">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setIsProjectListOpen(true)}
                className={`flex items-center p-2 rounded-md transition-all ${
                  isDarkMode 
                    ? "hover:bg-gray-800 text-gray-300" 
                    : "hover:bg-blue-100 text-gray-600"
                }`}
              >
                <span className="whitespace-nowrap overflow-hidden opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                  Projects
                </span>
              </button>
              <button
                onClick={handleAddProject}
                className={`p-1 rounded-full ${
                  isDarkMode 
                    ? "hover:bg-gray-700 text-gray-400" 
                    : "hover:bg-blue-100 text-gray-500"
                } opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity`}
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Project List (abbreviated) */}
          <div className="mt-1 flex-grow overflow-y-auto">
            {projects.map((project) => (
              <div key={project.id} className="px-2 mb-1">
                <div className="flex items-center justify-between py-1">
                  <button
                    onClick={(e) => handleProjectCollapse(project.id, e)}
                    className={`flex items-center w-full overflow-hidden ${
                      isDarkMode 
                        ? "text-gray-300 hover:bg-gray-800" 
                        : "text-gray-600 hover:bg-blue-100"
                    } rounded-md px-2 py-1`}
                  >
                    {collapsedProjects[project.id] ? (
                      <ChevronRight size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    )}
                    {project.isEditing ? (
                      <input
                        type="text"
                        defaultValue={project.name}
                        onClick={(e) => e.stopPropagation()}
                        onBlur={(e) => handleProjectNameEdit(project.id, e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleProjectNameEdit(project.id, (e.target as HTMLInputElement).value);
                          }
                        }}
                        className={`ml-2 px-1 py-0 w-32 outline-none rounded ${
                          isDarkMode 
                            ? "bg-gray-700 text-white" 
                            : "bg-white text-gray-800"
                        }`}
                        autoFocus
                      />
                    ) : (
                      <span className="ml-2 truncate opacity-100 md:opacity-0 md:group-hover:opacity-100">
                        {project.name}
                      </span>
                    )}
                  </button>
                  
                  {!project.isEditing && (
                    <div className="flex space-x-1 opacity-100 md:opacity-0 md:group-hover:opacity-100">
                      <button
                        onClick={() => handleProjectNameEditStart(project.id)}
                        className={`p-1 rounded-full ${
                          isDarkMode 
                            ? "hover:bg-gray-700 text-gray-400" 
                            : "hover:bg-blue-100 text-gray-500"
                        }`}
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => handleNewProjectChat(project.id)}
                        className={`p-1 rounded-full ${
                          isDarkMode 
                            ? "hover:bg-gray-700 text-gray-400" 
                            : "hover:bg-blue-100 text-gray-500"
                        }`}
                      >
                        <Plus size={14} />
                      </button>
                      <button
                        onClick={(e) => handleDeleteProject(project.id, e)}
                        className={`p-1 rounded-full ${
                          isDarkMode 
                            ? "hover:bg-gray-700 text-red-400" 
                            : "hover:bg-blue-100 text-red-500"
                        }`}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </div>
                
                {/* Project Chats */}
                {!collapsedProjects[project.id] && (
                  <div className="pl-7 pr-2">
                    {project.chats.map((chat) => (
                      <div key={chat.id} className="flex items-center justify-between py-1">
                        <button
                          onClick={() => handleChatSelect(chat)}
                          className={`flex-grow truncate text-left overflow-hidden ${
                            isDarkMode 
                              ? "text-gray-300 hover:bg-gray-800" 
                              : "text-gray-600 hover:bg-blue-100"
                          } rounded-md px-2 py-1`}
                        >
                          {chat.isEditing ? (
                            <input
                              type="text"
                              defaultValue={chat.title}
                              onClick={(e) => e.stopPropagation()}
                              onBlur={(e) => handleProjectChatTitleEdit(project.id, chat.id, e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  handleProjectChatTitleEdit(
                                    project.id, 
                                    chat.id, 
                                    (e.target as HTMLInputElement).value
                                  );
                                }
                              }}
                              className={`w-full px-1 py-0 outline-none rounded ${
                                isDarkMode 
                                  ? "bg-gray-700 text-white" 
                                  : "bg-white text-gray-800"
                              }`}
                              autoFocus
                            />
                          ) : (
                            <span className="truncate opacity-100 md:opacity-0 md:group-hover:opacity-100">
                              {chat.title}
                            </span>
                          )}
                        </button>
                        
                        {!chat.isEditing && (
                          <div className="flex space-x-1 ml-1 opacity-100 md:opacity-0 md:group-hover:opacity-100">
                            <button
                              onClick={() => handleProjectChatTitleEditStart(project.id, chat.id)}
                              className={`p-1 rounded-full ${
                                isDarkMode 
                                  ? "hover:bg-gray-700 text-gray-400" 
                                  : "hover:bg-blue-100 text-gray-500"
                              }`}
                            >
                              <Edit size={12} />
                            </button>
                            <button
                              onClick={(e) => handleDeleteProjectChat(project.id, chat.id, e)}
                              className={`p-1 rounded-full ${
                                isDarkMode 
                                  ? "hover:bg-gray-700 text-red-400" 
                                  : "hover:bg-blue-100 text-red-500"
                              }`}
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            {/* Chat History Links */}
            <div className="px-2 mt-3">
              <button
                onClick={handleRecentChatsClick}
                className={`w-full flex items-center justify-start px-3 py-2 rounded-md transition-all ${
                  isDarkMode 
                    ? "hover:bg-gray-800 text-white" 
                    : "hover:bg-blue-100 text-gray-700"
                }`}
              >
                <span className="whitespace-nowrap overflow-hidden opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                  Recent Chats
                </span>
              </button>
              
              <button
                onClick={handleStarredChatsClick}
                className={`w-full flex items-center justify-start px-3 py-2 rounded-md mt-1 transition-all ${
                  isDarkMode 
                    ? "hover:bg-gray-800 text-white" 
                    : "hover:bg-blue-100 text-gray-700"
                }`}
              >
                <Star size={16} className="min-w-[16px]" />
                <span className="ml-3 whitespace-nowrap overflow-hidden opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                  Starred Chats
                </span>
              </button>
            </div>
            
            {/* Recent Chats (abbreviated) */}
            <div className="px-2 mt-2 mb-4">
              {chats.slice(0, 5).map((chat) => (
                <div key={chat.id} className="flex items-center justify-between mb-1">
                  <button
                    onClick={() => handleChatSelect(chat)}
                    className={`flex-grow flex items-center truncate text-left ${
                      isDarkMode 
                        ? "text-gray-300 hover:bg-gray-800" 
                        : "text-gray-600 hover:bg-blue-100"
                    } rounded-md px-2 py-1 transition-all`}
                  >
                    <span className="truncate opacity-100 md:opacity-0 md:group-hover:opacity-100">
                      {chat.title}
                    </span>
                  </button>
                  
                  <div className="flex space-x-1 opacity-100 md:opacity-0 md:group-hover:opacity-100">
                    <button
                      onClick={(e) => handleStarChat(chat.id, e)}
                      className={`p-1 rounded-full ${
                        isDarkMode 
                          ? "hover:bg-gray-700" 
                          : "hover:bg-blue-100"
                      } ${chat.isStarred ? "text-yellow-400" : "text-gray-400"}`}
                    >
                      <Star size={14} fill={chat.isStarred ? "currentColor" : "none"} />
                    </button>
                    <button
                      onClick={(e) => handleDeleteChat(chat.id, e)}
                      className={`p-1 rounded-full ${
                        isDarkMode 
                          ? "hover:bg-gray-700 text-red-400" 
                          : "hover:bg-blue-100 text-red-500"
                      }`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* User Profile Section */}
          <div className="p-2 mt-auto border-t border-gray-700">
            <div className="relative">
              <button
                onClick={() => setIsChatDropdownOpen(!isChatDropdownOpen)}
                className={`w-full flex items-center justify-between p-2 rounded-md ${
                  isDarkMode 
                    ? "hover:bg-gray-800 text-white" 
                    : "hover:bg-blue-100 text-gray-700"
                } transition-all`}
              >
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isAuthenticated 
                      ? "bg-blue-600" 
                      : "bg-gray-600"
                  } text-white`}>
                    {isAuthenticated && userProfile ? (
                      userProfile.picture ? (
                        <img
                          src={userProfile.picture}
                          alt={userProfile.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        userProfile.name?.charAt(0) || "U"
                      )
                    ) : (
                      <User size={16} />
                    )}
                  </div>
                  <span className="ml-3 truncate opacity-100 md:opacity-0 md:group-hover:opacity-100">
                    {isAuthenticated && userProfile
                      ? userProfile.name || "User"
                      : "Log In"}
                  </span>
                </div>
                <ChevronDown
                  size={16}
                  className={`transition-transform ${
                    isChatDropdownOpen ? "transform rotate-180" : ""
                  } opacity-100 md:opacity-0 md:group-hover:opacity-100`}
                />
              </button>
              
              {isChatDropdownOpen && (
                <div
                  className={`absolute bottom-full left-0 right-0 mb-1 p-2 rounded-md shadow-lg ${
                    isDarkMode ? "bg-gray-800" : "bg-white"
                  } border ${
                    isDarkMode ? "border-gray-700" : "border-gray-200"
                  }`}
                >
                  <button
                    onClick={toggleDarkMode}
                    className={`w-full flex items-center px-3 py-2 rounded-md ${
                      isDarkMode
                        ? "hover:bg-gray-700 text-gray-200"
                        : "hover:bg-gray-100 text-gray-800"
                    }`}
                  >
                    {isDarkMode ? (
                      <>
                        <Sun size={16} />
                        <span className="ml-3">Light Mode</span>
                      </>
                    ) : (
                      <>
                        <Moon size={16} />
                        <span className="ml-3">Dark Mode</span>
                      </>
                    )}
                  </button>
                  
                  {isAuthenticated ? (
                    <button
                      onClick={handleLogout}
                      className={`w-full flex items-center px-3 py-2 mt-1 rounded-md ${
                        isDarkMode
                          ? "hover:bg-gray-700 text-gray-200"
                          : "hover:bg-gray-100 text-gray-800"
                      }`}
                    >
                      <LogOut size={16} />
                      <span className="ml-3">Log Out</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setIsLoginModalOpen(true);
                        setIsLogin(true);
                      }}
                      className={`w-full flex items-center px-3 py-2 mt-1 rounded-md ${
                        isDarkMode
                          ? "hover:bg-gray-700 text-gray-200"
                          : "hover:bg-gray-100 text-gray-800"
                      }`}
                    >
                      <LogOut size={16} />
                      <span className="ml-3">Log In</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
