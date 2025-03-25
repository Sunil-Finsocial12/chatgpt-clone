"use client"

import React, { useState, useRef, useEffect, type DragEvent } from "react"
import * as echarts from "echarts"
import { Sparkles, Cpu } from "lucide-react"
import { useSession } from "../context/SessionContext"
import { useTheme } from '../context/ThemeContext'

// Import new component-based structure
import Greeting from "./mainLayoutComponents/Greeting"
// Update the Sidebar import path
import { Sidebar } from './sidebarChatHistories';
import MessageList from "./mainLayoutComponents/MessageList"
import ChatInput from "./mainLayoutComponents/ChatInput"
import { parseMessageContent, renderMessageStatus, handleTextAreaResize, handleFiles } from "./mainLayoutComponents/ChatUtils"
import { 
  loadChatHistory, 
  handleLanguageTranslation,
  fetchChats,
  handleSendMessage as sendMessage
} from "./mainLayoutComponents/ChatService"
import { 
  handleNewChat, 
  handleChatSelect, 
  handleStarChat,
  handleAddProject,
  handleProjectNameEdit,
  handleProjectNameEditStart,
  handleNewProjectChat,
  handleProjectCollapse,
  handleProjectChatTitleEdit, 
  handleProjectChatTitleEditStart
} from "./mainLayoutComponents/MessageHandlers"
import { 
  type Message, 
  type Chat, 
  type Project, 
  type FilePreview, 
  type CodeBlock,
  type UserProfile
} from "./mainLayoutComponents/types"

// Import supporting components
import SlidingAuthForm from "./SlidingAuthForm"
import VoiceInput from "./VoiceInput"
import InfoPanel from "./InfoPanel"
import CodeSlider from "./CodeSlider"
import ChatListPopup from "./ChatListPopup"
import ActionCapsules from "./ActionCapsules"
import DeleteConfirmationPopup from "./DeleteConfirmationPopup"
import ProjectListPopup from "./ProjectListPopup"
import ChatTabs from "./ChatTabs"

interface MainLayoutProps {}  // Remove isDarkMode and toggleDarkMode from props

const MainLayout: React.FC<MainLayoutProps> = () => {  // Remove props destructuring
  const { isDarkMode, toggleDarkMode } = useTheme();  // Get theme from context

  // Get session context with the setter functions
  const { isAuthenticated, userProfile, setAuthenticated, setUserProfile, logout } = useSession();
  
  // Only log session info when it changes
  useEffect(() => {
    console.log("Session context in MainLayout:", { 
      isAuthenticated, 
      userName: userProfile?.name 
    });
  }, [isAuthenticated, userProfile?.name]);

  // States
  const [response, setResponse] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isChatDropdownOpen, setIsChatDropdownOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isMicActive, setIsMicActive] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState("chat");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showGreeting, setShowGreeting] = useState(true);
  const [isChatActive, setIsChatActive] = useState(true);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);

  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [starredChats, setStarredChats] = useState<Chat[]>([]);
  const [selectedModel, setSelectedModel] = useState("HindAI");
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [showIntroduction, setShowIntroduction] = useState(false);
  const [userName, setUserName] = useState("");

  const [isInfoPanelOpen, setIsInfoPanelOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [selectedCode, setSelectedCode] = useState<{ content: string; language: string } | null>(null);
  const [isCodeSliderOpen, setIsCodeSliderOpen] = useState(false);
  const [selectedCodeBlock, setSelectedCodeBlock] = useState<CodeBlock | null>(null);
  const [activeFilePreview, setActiveFilePreview] = useState<FilePreview | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isCleanView, setIsCleanView] = useState(false);
  const [hasMessages, setHasMessages] = useState(false);
  const [activeUploadTab, setActiveUploadTab] = useState("computer");
  const [isChatListOpen, setIsChatListOpen] = useState(false);
  const [chatListInitialTab, setChatListInitialTab] = useState<"starred" | "all">("all");
  const [isShowingStarredChats, setIsShowingStarredChats] = useState(true);
  const [showAllStarredChats, setShowAllStarredChats] = useState(false);
  const [isNewChatStarted, setIsNewChatStarted] = useState(false);
  const [hasGreetingPlayed, setHasGreetingPlayed] = useState(false);
  const [isShowingProjects, setIsShowingProjects] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isProjectListOpen, setIsProjectListOpen] = useState(false);
  const [isSearchEnabled, setIsSearchEnabled] = useState(false);
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(() => {
    const storedLang = localStorage.getItem("selectedLanguage");
    return storedLang ? JSON.parse(storedLang) : { code: "eng_Latn", name: "English", nativeName: "English" };
  });

  // Update localStorage when the language changes
  useEffect(() => {
    localStorage.setItem("selectedLanguage", JSON.stringify(selectedLanguage));
  }, [selectedLanguage]);


  // Add new states
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isProjectChatListOpen, setIsProjectChatListOpen] = useState(false);
  // Add new state for collapsed projects
  const [collapsedProjects, setCollapsedProjects] = useState<{ [key: string]: boolean }>({});
  // Add new states for delete confirmation
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    itemId: string;
    itemType: "chat" | "project";
    projectId?: string;
  }>({
    isOpen: false,
    itemId: "",
    itemType: "chat",
  });

  const [dots, setDots] = useState("");
  const [currentReasoning, setCurrentReasoning] = useState("");
  const [showReasoning, setShowReasoning] = useState(false);
  const [isLoginAnimated, setIsLoginAnimated] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDots((prevDots) => {
        if (prevDots.length < 3) {
          return prevDots + ".";
        } else {
          return "";
        }
      });
    }, 500);

    return () => clearInterval(intervalId);
  }, []);

  const models = [
    { id: "HindAI", name: "HindAI", icon: <Cpu size={18} /> },
    { id: "coming soon...", name: "coming soon...", icon: <Sparkles size={18} />, isDisabled: true },
  ];

  const [showScrollButton, setShowScrollButton] = useState(false);

  // Add this effect to handle scroll button visibility
  useEffect(() => {
    const handleScroll = (e: any) => {
      const element = e.target;
      const isScrolledUp = element.scrollHeight - element.scrollTop > element.clientHeight + 100;
      setShowScrollButton(isScrolledUp);
    };

    const messageContainer = document.querySelector(".message-container");
    if (messageContainer) {
      messageContainer.addEventListener("scroll", handleScroll);
      return () => messageContainer.removeEventListener("scroll", handleScroll);
    }
  }, []);

  // Effect for chat fetching
  useEffect(() => {
    if (userProfile?.name) {
      fetchChats(userProfile.name, setChats);
    }
  }, [userProfile]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (chartRef.current && activeTab === "analysis") {
      const chart = echarts.init(chartRef.current);
      const option = {
        animation: false,
        title: {
          text: "Message Analysis",
          textStyle: { color: "#e5e7eb" },
        },
        tooltip: {
          trigger: "axis",
        },
        xAxis: {
          type: "category",
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          axisLabel: { color: "#e5e7eb" },
        },
        yAxis: {
          type: "value",
          axisLabel: { color: "#e5e7eb" },
        },
        series: [
          {
            data: [120, 200, 150, 80, 70, 110, 130],
            type: "line",
            smooth: true,
            color: "#818cf8",
          },
        ],
      };
      chart.setOption(option);
    }
  }, [activeTab]);

  useEffect(() => {
    if (!isSidebarOpen && !isHovered) {
      setIsSearchActive(false);
    }
  }, [isSidebarOpen, isHovered]);

  // Effect for window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Effect for scroll detection
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Event handlers 
  const handleDeleteChat = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteConfirmation({
      isOpen: true,
      itemId: chatId,
      itemType: "chat",
    });
  };

  const handleDeleteProject = (projectId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteConfirmation({
      isOpen: true,
      itemId: projectId,
      itemType: "project",
    });
  };

  const handleDeleteProjectChat = (projectId: string, chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteConfirmation({
      isOpen: true,
      itemId: chatId,
      projectId: projectId,
      itemType: "chat",
    });
  };

  const handleConfirmDelete = () => {
    const { itemId, itemType, projectId } = deleteConfirmation;

    if (itemType === "project") {
      // Handle project deletion
      if (currentChat?.projectId === itemId) {
        setCurrentChat(null);
        setMessages([]);
        setShowGreeting(true);
        setIsChatActive(false);
      }
      setProjects((prev) => prev.filter((project) => project.id !== itemId));
    } else {
      // Handle chat deletion
      if (projectId) {
        // Delete project chat
        setProjects((prev) =>
          prev.map((project) => {
            if (project.id === projectId) {
              return {
                ...project,
                chats: project.chats.filter((chat) => chat.id !== itemId),
              };
            }
            return project;
          })
        );
      } else {
        // Delete regular chat
        setChats((prev) => prev.filter((chat) => chat.id !== itemId));
      }

      if (currentChat?.id === itemId) {
        setCurrentChat(null);
        setMessages([]);
        setShowGreeting(true);
        setIsChatActive(false);
      }
    }

    setDeleteConfirmation((prev) => ({ ...prev, isOpen: false }));
  };

  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowGreeting(true);
    setIsChatActive(false);
    setMessages([]);
    setActiveChat(null);
    setIsNewChatStarted(false);

    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const handleSearchToggle = () => {
    setIsSearchEnabled((prev) => !prev);
  };

  const resetTextAreaHeightWrapper = () => {
    const textarea = document.querySelector("textarea");
    if (textarea) {
      textarea.style.height = "56px";
    }
  };

  const handleTextAreaResizeWrapper = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleTextAreaResize(e, setInputText);
  };

  const handleSendMessageWrapper = () => {
    sendMessage(
      inputText,
      activeFilePreview,
      currentChat,
      isGenerating,
      userProfile,
      isSearchEnabled,
      setHasMessages,
      setCurrentReasoning,
      setShowReasoning,
      setIsGenerating,
      setShowGreeting,
      setIsChatActive,
      setMessages,
      setInputText,
      resetTextAreaHeightWrapper,
      isAuthenticated,        // Pass authentication status
      setIsLoginModalOpen,    // Pass login modal setter
      setIsLoginAnimated     // Pass login animation setter
    );
  };

  const handleNewChatWrapper = () => {
    handleNewChat(
      setChats,
      setCurrentChat,
      setMessages,
      setShowGreeting,
      setIsChatActive,
      setIsNewChatStarted,
      setActiveChat,
      setHasMessages,
      setActiveFilePreview,
      setIsGenerating,
      setIsMicActive,
      setIsSidebarOpen
    );
  };

  const handleChatSelectWrapper = async (chat: Chat) => {
    await handleChatSelect(
      chat,
      currentChat,
      setCurrentChat,
      setShowGreeting,
      setIsChatActive,
      setIsNewChatStarted,
      setIsSidebarOpen,
      setHasMessages,
      setIsChatListOpen,
      async (username, chatId) => {
        await loadChatHistory(
          username,
          chatId,
          setIsLoadingHistory,
          setMessages,
          setHasMessages
        );
      },
      userProfile
    );
  };

  const handleStarChatWrapper = (chatId: string, e: React.MouseEvent) => {
    handleStarChat(chatId, e, setChats);
  };



  const handleAddProjectWrapper = () => {
    handleAddProject(setProjects);
  };

  const handleProjectNameEditWrapper = (projectId: string, newName: string) => {
    handleProjectNameEdit(projectId, newName, setProjects);
  };

  const handleProjectNameEditStartWrapper = (projectId: string) => {
    handleProjectNameEditStart(projectId, setProjects);
  };

  const handleNewProjectChatWrapper = (projectId: string) => {
    handleNewProjectChat(
      projectId,
      setProjects,
      setCurrentChat,
      setMessages,
      setIsNewChatStarted,
      setShowGreeting,
      setIsChatActive
    );
  };

  const handleProjectChatTitleEditWrapper = (projectId: string, chatId: string, newTitle: string) => {
    handleProjectChatTitleEdit(projectId, chatId, newTitle, setProjects, setCurrentChat, currentChat);
  };

  const handleProjectChatTitleEditStartWrapper = (projectId: string, chatId: string) => {
    handleProjectChatTitleEditStart(projectId, chatId, setProjects);
  };

  const handleProjectCollapseWrapper = (projectId: string, e: React.MouseEvent) => {
    handleProjectCollapse(projectId, e, setCollapsedProjects);
  };

  const handleLanguageChangeWrapper = async (language: { code: string; name: string; nativeName: string }) => {
    setSelectedLanguage(language);
    
    if (currentChat && currentChat.messages.length > 0) {
      await handleLanguageTranslation(
        language,
        currentChat,
        setChats,
        setCurrentChat,
        setMessages,
        setIsGenerating
      );
    }
  };

  const handleLogout = () => {
    // Use the logout function from context instead
    logout();
    
    // Additional UI updates
    setShowGreeting(true);
    setIsChatActive(false);
    setMessages([]);
    setActiveChat(null);
    setIsNewChatStarted(false);
  };

  const handleCodeBlockClick = (content: string, language: string) => {
    setSelectedCodeBlock({
      content: content.trim(),
      language: language || "plaintext",
    });
    setIsCodeSliderOpen(true);
  };

  // Add effect to detect and handle code blocks in messages
useEffect(() => {
  // Check the latest message for code blocks
  if (messages.length > 0) {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage.type === "assistant") {
      // Parse message content for code blocks
      const codeBlocks = parseMessageContent(lastMessage.content)
        .filter(part => part.type === "code");
      
      // If code blocks found, automatically open the first one
      if (codeBlocks.length > 0) {
        const firstCodeBlock = codeBlocks[0];
        handleCodeBlockClick(firstCodeBlock.content, firstCodeBlock.language);
      }
    }
  }
}, [messages]); // Trigger when messages update

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    handleFiles(
      files,
      currentChat,
      setActiveFilePreview,
      setChats,
      setCurrentChat,
      setMessages,
      setIsUploadModalOpen
    );
  };


  const handleVoiceTranscript = (text: string) => {
    setInputText(text);
  };
  
  const handleVoiceStateChange = (isActive: boolean) => {
    setIsMicActive(isActive);
  };
  
  const handleVoiceSubmit = () => {
    if (inputText.trim()) {
      setTimeout(() => handleSendMessageWrapper(), 500); // Ensure async execution
    }
  };

  const handleActionCapsuleClick = (action: string, suggestion?: string) => {
    let promptText = "";

    if (suggestion) {
      // If a suggestion was clicked, use it directly
      switch (action) {
        case "explain":
          promptText = `${suggestion}: `;
          break;
        case "summarize":
          promptText = `${suggestion} for: `;
          break;
        case "translate":
          promptText = `${suggestion}: `;
          break;
        case "improve":
          promptText = `${suggestion}: `;
          break;
        case "code":
          promptText = `${suggestion}: `;
          break;
      }
    } else {
      // Default prompts when capsule is clicked
      switch (action) {
        case "explain":
          promptText = "Please explain this in detail: ";
          break;
        case "summarize":
          promptText = "Please provide a summary of: ";
          break;
        case "translate":
          promptText = "Please translate this to English: ";
          break;
        case "improve":
          promptText = "Please improve the writing of this text: ";
          break;
        case "code":
          promptText = "Please generate code for: ";
          break;
      }
    }
    setInputText(promptText);
  };

  const handleFilesWrapper = async (files: File[]) => {
    await handleFiles(
      files,
      currentChat,
      setActiveFilePreview,
      setChats,
      setCurrentChat,
      setMessages,
      setIsUploadModalOpen
    );
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? "dark bg-gray-900" : "bg-gray-50"}`}>
      <div
        className={`flex h-screen overflow-hidden ${
          isDarkMode
            ? "bg-black bg-gradient-to-b from-[#001F3F] to-black via-black text-gray-100"
            : "bg-gradient-to-br from-white via-gray-100 to-blue-50 text-gray-800"
        }`}
      >
        {/* Fixed brand text container */}
        <div
          className={`fixed top-0 left-16 h-16 flex items-center justify-between px-4 w-full z-50 transition-all duration-300 ${
            isSidebarOpen ? "translate-x-56" : "translate-x-0"
          }`}
        >
          {/* Logo */}
          <img
            src="/logo (1).png"
            alt="Hind AI Logo"
            onClick={handleHomeClick}
            className="h-25 w-25 mt-3 cursor-pointer hover:opacity-80 transition-opacity"
          />
        </div>

        {/* Replace with Sidebar component */}
        <Sidebar
          isDarkMode={isDarkMode}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          isScrolled={isScrolled}
          handleNewChat={handleNewChatWrapper}
          projects={projects}
          setIsProjectListOpen={setIsProjectListOpen}
          handleAddProject={handleAddProjectWrapper}
          collapsedProjects={collapsedProjects}
          handleProjectCollapse={handleProjectCollapseWrapper}
          handleProjectNameEdit={handleProjectNameEditWrapper}
          handleProjectNameEditStart={handleProjectNameEditStartWrapper}
          handleNewProjectChat={handleNewProjectChatWrapper}
          handleDeleteProject={handleDeleteProject}
          handleChatSelect={handleChatSelectWrapper}
          handleProjectChatTitleEdit={handleProjectChatTitleEditWrapper}
          handleProjectChatTitleEditStart={handleProjectChatTitleEditStartWrapper}
          handleDeleteProjectChat={handleDeleteProjectChat}
          chats={chats}
          setChatListInitialTab={setChatListInitialTab}
          setIsChatListOpen={setIsChatListOpen}
          handleStarChat={handleStarChatWrapper}
          handleDeleteChat={handleDeleteChat}
          isChatDropdownOpen={isChatDropdownOpen}
          setIsChatDropdownOpen={setIsChatDropdownOpen}
          userProfile={userProfile}
          isAuthenticated={isAuthenticated}
          setIsLoginModalOpen={setIsLoginModalOpen}
          setIsLogin={setIsLogin}
          handleLogout={handleLogout}
          toggleDarkMode={toggleDarkMode}
        />

        <div className="flex-1 flex flex-col relative pt-16 pl-16">
          <div
            className={`flex-1 overflow-y-auto transition-all duration-300 ${isCodeSliderOpen ? "lg:pr-[50%]" : ""}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {/* Main chat section that shifts left when slider opens */}
            <div
              className={`
                w-full transition-all duration-300 
                ${isCodeSliderOpen ? "lg:max-w-full lg:pr-60" : "max-w-3xl mx-auto"}
                relative flex flex-col h-full pb-[170px]
              `}
            >
              {/* Chat content */}
              <div
                className={`w-full ${!isCodeSliderOpen ? "max-w-3xl mx-auto" : ""} ${
                  hasMessages || isNewChatStarted ? "flex-1" : ""
                }`}
              >
                {showGreeting && !hasMessages && !isNewChatStarted ? (
                  <div className="flex justify-center items-center min-h-[200px]">
                    <Greeting userProfile={userProfile} />
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col justify-end message-container">
                    <MessageList 
                      messages={messages}
                      isDarkMode={isDarkMode}
                      isGenerating={isGenerating}
                      showReasoning={showReasoning}
                      currentReasoning={currentReasoning}
                      parseMessageContent={parseMessageContent}
                      handleCodeBlockClick={handleCodeBlockClick}
                      renderMessageStatus={renderMessageStatus}
                      messagesEndRef={messagesEndRef}
                    />
                  </div>
                )}

                {/* Chat input section */}
                <div
                  className={`
                    ${hasMessages || isNewChatStarted ? "fixed bottom-6 lg:left-16 transition-all duration-300" : "sticky bottom-6"} 
                    w-full px-4
                    ${isCodeSliderOpen ? "lg:left-30 lg:w-[36%] lg:translate-x-0" : "mx-auto"}
                  `}
                >
                  <div
                    className={`
                      max-w-4xl
                      ${showGreeting ? "mx-auto" : isCodeSliderOpen ? "lg:ml-0" : "mx-auto"}
                    `}
                  >
                    <ChatInput 
                      inputText={inputText}
                      setInputText={setInputText}
                      handleTextAreaResize={handleTextAreaResizeWrapper}
                      handleSendMessage={handleSendMessageWrapper}
                      isDarkMode={isDarkMode}
                      isSearchEnabled={isSearchEnabled}
                      handleSearchToggle={handleSearchToggle}
                      activeFilePreview={activeFilePreview}
                      setActiveFilePreview={setActiveFilePreview}
                      setIsUploadModalOpen={setIsUploadModalOpen}
                      selectedLanguage={selectedLanguage}
                      handleLanguageChange={handleLanguageChangeWrapper}
                      setIsMicActive={setIsMicActive}
                      isMicActive={isMicActive}
                      models={models}
                      selectedModel={selectedModel}
                      setSelectedModel={setSelectedModel}
                      isAuthenticated={isAuthenticated}
                      setIsLoginModalOpen={setIsLoginModalOpen}
                      setIsLoginAnimated={setIsLoginAnimated}
                      handleFiles={handleFilesWrapper}  // Pass the wrapper function
                    />
                    
                    {!hasMessages && !isNewChatStarted && (
                      <ActionCapsules isDarkMode={isDarkMode} onActionClick={handleActionCapsuleClick} />
                    )}
                    
                    {!hasMessages && !isNewChatStarted && (
                      <ChatTabs chats={chats} handleChatSelect={handleChatSelectWrapper} isDarkMode={isDarkMode} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Popups and Modals */}
      <ChatListPopup
        isOpen={isChatListOpen}
        onClose={() => setIsChatListOpen(false)}
        chats={chats}
        onChatSelect={handleChatSelectWrapper}
        onStarChat={handleStarChatWrapper}
        onDeleteChat={handleDeleteChat}
        isDarkMode={isDarkMode}
        initialTab={chatListInitialTab}
      />
      
      <VoiceInput
        isActive={isMicActive}
        onTranscript={handleVoiceTranscript}
        onSubmit={handleVoiceSubmit}
        onStateChange={handleVoiceStateChange}
        isDarkMode={isDarkMode}
      />
      
      <InfoPanel
        isOpen={isInfoPanelOpen}
        onClose={() => {
          setIsInfoPanelOpen(false);
          setSelectedCode(null);
        }}
        isDarkMode={isDarkMode}
        code={selectedCode || undefined}
      />
      
      <CodeSlider
        isOpen={isCodeSliderOpen}
        onClose={() => {
          setIsCodeSliderOpen(false);
          setSelectedCodeBlock(null);
        }}
        code={selectedCodeBlock?.content || ""}
        language={selectedCodeBlock?.language || "plaintext"}
        isDarkMode={isDarkMode}
        onEdit={(newCode) => {
          if (selectedCodeBlock) {
            setSelectedCodeBlock({
              ...selectedCodeBlock,
              content: newCode
            });
          }
        }}
        onSendMessage={(message) => {
          setInputText(message);
          setTimeout(handleSendMessageWrapper, 100);
        }}
      />
      
      <SlidingAuthForm
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        isLogin={isLogin}
        setIsLogin={setIsLogin}
        isDarkMode={isDarkMode}
      />
      
      <DeleteConfirmationPopup
        isOpen={deleteConfirmation.isOpen}
        onClose={() => setDeleteConfirmation((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={handleConfirmDelete}
        isDarkMode={isDarkMode}
        itemType={deleteConfirmation.itemType}
      />
      
      <ProjectListPopup
        isOpen={isProjectListOpen}
        onClose={() => setIsProjectListOpen(false)}
        projects={projects}
        onProjectSelect={() => setIsProjectListOpen(false)}
        onChatSelect={(chat) => {
          handleChatSelectWrapper(chat);
          setIsProjectListOpen(false);
        }}
        onDeleteProject={handleDeleteProject}
        onDeleteProjectChat={handleDeleteProjectChat}
        onEditProject={handleProjectNameEditWrapper}
        onEditProjectStart={handleProjectNameEditStartWrapper}
        onNewProjectChat={(projectId) => {
          handleNewProjectChatWrapper(projectId);
          setIsProjectListOpen(false);
        }}
        isDarkMode={isDarkMode}
      />

      <div id="dropdown-root" className="fixed inset-0 pointer-events-none z-[9999]" />
    </div>
  );
};

export default MainLayout;

