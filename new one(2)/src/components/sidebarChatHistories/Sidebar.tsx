import React from "react"
import UserAvatar from "../UserAvatar"
import { Link, useNavigate } from "react-router-dom"
import { useTheme } from '../../context/ThemeContext'
import { fetchChatHistory } from "./fetchChatHistory"; // new import

interface SidebarProps {
  isDarkMode: boolean
  isSidebarOpen: boolean
  setIsSidebarOpen: (isOpen: boolean) => void
  isScrolled: boolean
  handleNewChat: () => void
  projects: any[] // Replace with proper Project type
  setIsProjectListOpen: (isOpen: boolean) => void
  handleAddProject: () => void
  collapsedProjects: { [key: string]: boolean }
  handleProjectCollapse: (projectId: string, e: React.MouseEvent) => void
  handleProjectNameEdit: (projectId: string, newName: string) => void
  handleProjectNameEditStart: (projectId: string) => void
  handleNewProjectChat: (projectId: string) => void
  handleDeleteProject: (projectId: string, e: React.MouseEvent) => void
  handleChatSelect: (chat: any) => void // Replace with proper Chat type
  handleProjectChatTitleEdit: (projectId: string, chatId: string, newTitle: string) => void
  handleProjectChatTitleEditStart: (projectId: string, chatId: string) => void
  handleDeleteProjectChat: (projectId: string, chatId: string, e: React.MouseEvent) => void
  chats: any[] // Replace with proper Chat type
  setChatListInitialTab: (tab: "starred" | "all") => void
  setIsChatListOpen: (isOpen: boolean) => void
  handleStarChat: (chatId: string, e: React.MouseEvent) => void
  handleDeleteChat: (chatId: string, e: React.MouseEvent) => void
  isChatDropdownOpen: boolean
  setIsChatDropdownOpen: (isOpen: boolean) => void
  userProfile: { name: string } | null
  isAuthenticated: boolean
  setIsLoginModalOpen: (isOpen: boolean) => void
  setIsLogin: (isLogin: boolean) => void
  handleLogout: () => void
  toggleDarkMode: () => void
}

const dummyChats = []; // removed dummy data since API is now used

const Sidebar: React.FC<SidebarProps> = (props) => {
  const { isSidebarOpen, setIsSidebarOpen, isScrolled, handleNewChat, projects, setIsProjectListOpen, handleAddProject, collapsedProjects, handleProjectCollapse, handleProjectNameEdit, handleProjectNameEditStart, handleNewProjectChat, handleDeleteProject, handleChatSelect, handleProjectChatTitleEdit, handleProjectChatTitleEditStart, handleDeleteProjectChat, chats, setChatListInitialTab, setIsChatListOpen, handleStarChat, handleDeleteChat, isChatDropdownOpen, setIsChatDropdownOpen, userProfile, isAuthenticated, setIsLoginModalOpen, setIsLogin, handleLogout } = props;
  const { isDarkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const [recentChats, setRecentChats] = React.useState<any[]>([]);
  
  // NEW: Fetch recent chat history from API
  React.useEffect(() => {
    const username = userProfile?.name || localStorage.getItem('userName');
    if (username) {
      fetchChatHistory(username).then(chats => {
        setRecentChats(chats);
      });
    }
  }, [userProfile]);

  return (
    <div
      className={`${
        isSidebarOpen ? "w-60 sm:w-72" : "w-16"
      } fixed md:relative h-full transition-all duration-300 ease-in-out ${
        isDarkMode ? "border-r-2 border-blue-950" : "bg-white/90"
      } backdrop-blur-sm flex flex-col shadow-lg overflow-y-auto z-40 
      sm:translate-x-0 ${!isSidebarOpen && 'sm:-translate-x-0'}`}
    >
      {/* Top section - only toggle button */}
      <div
        className={`flex items-center p-4 sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? isDarkMode
              ? " bg-[#001F3F]/80 text-gray-100"
              : "bg-white shadow-lg"
            : isDarkMode
              ? " bg-[#001F3F]/80 text-gray-100"
              : "bg-gray-200/50"
        }`}
      >
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-gray-400 hover:text-gray-600 w-8 flex-shrink-0"
        >
          <i className={`fas ${isSidebarOpen ? "fa-chevron-left" : "fa-chevron-right"}`}></i>
        </button>
      </div>

      {/* Main content with icons-only when collapsed */}
      <nav className="flex-1 px-2">
        <button className="w-full flex items-center p-2 mb-2 rounded-lg" onClick={handleNewChat}>
          <i className="fa-solid fa-plus w-8"> </i>
          <span className={`${!isSidebarOpen ? "hidden" : "block"} ml-2`}>New Chat</span>
        </button>

        {/* Recent Chats Section */}
        <div className="mb-4">
          <div className={`flex items-center px-2 py-2 ${!isSidebarOpen ? "justify-center" : "flex-between"}`}>
   
            {isSidebarOpen && (
              <div className="flex justify-between items-center w-full">
                <span className="text-sm font-medium">Recent Chats</span>
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if(userProfile?.name){
                      localStorage.setItem('userName', userProfile.name);
                    }
                    navigate('/chat-history', { replace: true });
                  }}
                  className={`text-xs px-3 py-1.5 rounded-md ${
                    isDarkMode 
                      ? 'text-blue-400 hover:bg-blue-400/10' 
                      : 'text-blue-500 hover:bg-blue-500/10'
                  } transition-all duration-200 font-medium`}
                >
                  View All
                </button>
              </div>
            )}
          </div>
            <div className="space-y-1">
            {(recentChats.length > 0 ? recentChats : [])
              .filter(chat => 
              !chat.isStarred && 
              chat.title && 
              chat.title.trim() !== "" && 
              !chat.title.startsWith("Chat")
              )
              .slice(0, 6)
              .map((chat) => {
              // Function to fetch detailed chat history
              const fetchDetailedChatHistory = async (chatId: string) => {
                const username = userProfile?.name || localStorage.getItem('userName');
                if (!username) return;
                
                try {
                const response = await fetch('http://saveai.tech/chat/detailed-history', {
                  method: 'POST',
                  headers: {
                  'accept': 'application/json',
                  'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                  username,
                  chat_id: chatId
                  })
                });
                
                const data = await response.json();
                console.log('Detailed chat history:', data);
                return data;
                } catch (error) {
                console.error('Error fetching detailed chat history:', error);
                }
              };

              return (
                <div
                key={`recent_${chat.id}`}
                className={`group flex items-center p-2 rounded-lg cursor-pointer ${
                  isDarkMode ? "hover:bg-gray-700" : "hover:bg-white/50"
                }`}
                onClick={async () => {
                  await fetchDetailedChatHistory(chat.id);
                  handleChatSelect(chat);
                }}
                >
                <i className="fas fa-comment-alt w-8 text-gray-400"></i>
                {isSidebarOpen && (
                  <>
                  <div className="ml-2 flex-1">
                    <div className="truncate font-medium text-sm" title={chat.title}>
                    {chat.title.length > 25 ? `${chat.title.substring(0, 25)}...` : chat.title}
                    </div>
                    <div className="text-xs text-gray-500">
                    {chat.timestamp ? new Date(chat.timestamp).toLocaleDateString() : ''}
                    </div>
                  </div>
                  </>
                )}
                </div>
              );
              })}
            </div>
        </div>
      </nav>

      {/* Auth section at bottom */}
      <div className="mt-auto p-2 border-t border-gray-700/50">
        {isAuthenticated ? (
          <div className="space-y-1">
            <div className="flex items-center p-2 rounded-lg">
              <UserAvatar userName={userProfile?.name || "Guest"} />
              <span className={`${!isSidebarOpen ? "hidden" : "block"} ml-2 truncate max-w-[80%]`}>
                {userProfile?.name}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center p-2 text-red-500 hover:bg-red-500/10 rounded-lg"
            >
              <i className="fa-solid fa-right-from-bracket w-8"></i>
              <span className={`${!isSidebarOpen ? "hidden" : "block"} ml-2`}>Logout</span>
            </button>
          </div>
        ) : (
          <div className="space-y-1">
            <button className="w-full flex items-center p-2" onClick={() => setIsLoginModalOpen(true)}>
              <i className="fa-solid fa-right-to-bracket w-8"></i>
              <span className={`${!isSidebarOpen ? "hidden" : "block"} ml-2`}>Login</span>
            </button>
            <button
              className="w-full flex items-center p-2 text-indigo-500"
              onClick={() => {
                setIsLogin(false)
                setTimeout(() => setIsLoginModalOpen(true), 50)
              }}
            >
              <i className="fa-solid fa-user-plus w-8"></i>
              <span className={`${!isSidebarOpen ? "hidden" : "block"} ml-2`}>Sign Up</span>
            </button>
          </div>
        )}

        <button
          onClick={toggleDarkMode}
          className={`w-full flex items-center p-2 mt-2 rounded-lg ${
            isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
          }`}
        >
          <i className={`fa-solid ${isDarkMode ? "fa-sun" : "fa-moon"} w-8`}></i>
          <span className={`${!isSidebarOpen ? "hidden" : "block"} ml-2`}>
            {isDarkMode ? "Light Mode" : "Dark Mode"}
          </span>
        </button>
      </div>
    </div>
  )
}

export default Sidebar
