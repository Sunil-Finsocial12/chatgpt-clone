

import { useState } from "react"
import BarCodePopup from "../components/BarCodePopup"
import UserAvatar from "../components/UserAvatar"
import {
  
  
  ChevronDown,
  
  Plus,
  Star,
  MessageSquare,
  
} from "lucide-react"

export default function Sidebar() {
    const toggleDarkMode = () => {
        setIsDarkMode(prev => !prev);
      };
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userProfile, setUserProfile] = useState<{ name: string } | null>(
        () => JSON.parse(localStorage.getItem('sessionData') || 'null')
      );
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isProjectsOpen, setIsProjectsOpen] = useState(true);
  const [isStarredOpen, setIsStarredOpen] = useState(true);
  const [isAllChatsOpen, setIsAllChatsOpen] = useState(true);
  
  const handleLogout = () => {
    // Remove stored user session data
    localStorage.removeItem("sessionData");
    localStorage.removeItem("user");
    localStorage.removeItem("isAuthenticated");
  
    // Update state to reflect logout
    setUserProfile({ name: "" });
    setIsAuthenticated(false);
  
    // Redirect or refresh to reflect logout
    window.location.reload();
  };
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  return (
    <div className="flex h-screen bg-black bg-gradient-to-b from-[#001F3F] to-black via-black text-gray-100">
      {/* Sidebar */}
      <div 
            className={
    `${isOpen ? 'w-60' : 'w-16'
      } fixed md:relative h-full transition-all duration-300 ease-in-out ${isDarkMode ? 'border-r-2 border-blue-950' : 'bg-white/90'
      } backdrop-blur-sm flex flex-col shadow-lg overflow-y-auto z-40`
  }
          >

            {/* Top section - only toggle button */ }
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
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-400 hover:text-gray-600 w-8 flex-shrink-0"
        >
          <i className={`fas ${isOpen ? "fa-chevron-left" : "fa-chevron-right"}`}></i>
        </button>
      </div>

      <button 
                className="w-full flex items-center px-4 py-2 mb-2 rounded-lg"
 // onClick = { handleNewChat }
    >
    <i className="fa-solid fa-plus w-8" > </i>
      < span className = {`${!isOpen ? 'hidden' : 'block'} ml-2`}>
        New Chat
          </span>
          </button>

      {/* Search section */ }
  <div className="px-4 py-2 " >
    {
      isOpen?(
                  <div className = "relative" >
          <input
                      type="search"
        placeholder = "Search conversations..."
                      className = {`w-full pl-9 pr-4 py-2 ${isDarkMode
          ? 'bg-gray-700 text-gray-200 placeholder-gray-400'
          : 'bg-gray-100 text-gray-800'
          } outline-none rounded-lg focus:ring-2 focus:ring-blue-400 ring-offset-0`}
    />
    <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" > </i>
      </div>
                ) : (
    <button
                    onClick= {() => setIsOpen(true)}
  className = {`w-full p-2 rounded-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'
    }`}
                  >
    <i className="fa-solid fa-magnifying-glass" title = "Search" > </i>
      </button>
                )}
  </div>
      {/* Projects Section */}
      <div className="mt-4 px-4">
        <button
          onClick={() => setIsProjectsOpen(!isProjectsOpen)}
          className="flex items-center justify-between w-full hover:bg-gray-700/30 p-2 rounded-lg"
        >
          <div className="flex items-center space-x-2">
            <Plus size={20} />
            {isOpen && <span>Projects</span>}
          </div>
          {isOpen && <ChevronDown className={`transform transition-transform ${isProjectsOpen ? 'rotate-180' : ''}`} size={16} />}
        </button>
        {isOpen && isProjectsOpen && (
          <div className="ml-2 mt-2 space-y-1">
            <button className="flex items-center space-x-2 w-full p-2 hover:bg-gray-700/30 rounded-lg">
              <Plus size={16} />
              <span>New Project</span>
            </button>
          </div>
        )}
      </div>

      {/* Starred Chats Section */}
      <div className="mt-4 px-4">
        <button
          onClick={() => setIsStarredOpen(!isStarredOpen)}
          className="flex items-center justify-between w-full hover:bg-gray-700/30 p-2 rounded-lg"
        >
          <div className="flex items-center space-x-2">
            <Star size={20} />
            {isOpen && <span>Starred Chats</span>}
          </div>
          {isOpen && <ChevronDown className={`transform transition-transform ${isStarredOpen ? 'rotate-180' : ''}`} size={16} />}
        </button>
      </div>

      {/* All Chats Section */}
      <div className="mt-4 px-4">
        <button
          onClick={() => setIsAllChatsOpen(!isAllChatsOpen)}
          className="flex items-center justify-between w-full hover:bg-gray-700/30 p-2 rounded-lg"
        >
          <div className="flex items-center space-x-2">
            <MessageSquare size={20} />
            {isOpen && <span>All Chats</span>}
          </div>
          {isOpen && <ChevronDown className={`transform transition-transform ${isAllChatsOpen ? 'rotate-180' : ''}`} size={16} />}
        </button>
      </div>

     { /* Auth section at bottom */} 
<div className="mt-auto p-2 border-t border-gray-700/50" >
<div className="flex items-center p-2">
    <div className="w-full flex items-center justify-between">
      <BarCodePopup 
        websiteUrl="https://your-website-url.com" 
        
        text={
          <div className="flex items-center">
            <i className="fas fa-qrcode mr-2" title="scan the code"></i>
            {isOpen && "Scan QR Code"}
          </div>
        } 
        isDarkMode={isDarkMode}
      />
    </div>
    </div>
{
isAuthenticated?(
          <div className = "space-y-1" >
  <div className="flex items-center p-2 rounded-lg">
<UserAvatar userName={userProfile?.name || "Guest"} />

< span className = {`${!isOpen ? 'hidden' : 'block'} ml-2`}>
  { userProfile?.name }
  </span>
  </div>
  < button
onClick = { handleLogout }
className = "w-full flex items-center p-2 text-red-500 hover:bg-red-500/10 rounded-lg"
>
<i className="fa-solid fa-right-from-bracket w-8" > </i>
< span className = {`${!isOpen ? 'hidden' : 'block'} ml-2`}>
  Logout
  </span>
  </button>
  </div>
        ) : (
<div className= "space-y-1" >
<button className="w-full flex items-center p-2" onClick = {() => setIsLoginModalOpen(true)}>
<i className="fa-solid fa-right-to-bracket w-8" > </i>
  < span className = {`${!isOpen ? 'hidden' : 'block'} ml-2`}>
    Login
    </span>
    </button>
    < button
className = "w-full flex items-center p-2 text-indigo-500"
onClick = {() => {
setIsLogin(false);

setTimeout(() => setIsLoginModalOpen(true), 50);
}}
            >
<i className="fa-solid fa-user-plus w-8" > </i>
< span className = {`${!isOpen ? 'hidden' : 'block'} ml-2`}>
  Sign Up
    </span>
    </button>
    </div>
        )}

<button 
          onClick={ toggleDarkMode }
className = "w-full flex items-center p-2 mt-2 rounded-lg hover:bg-gray-700/20"
>
<i className={ `fa-solid ${isDarkMode ? 'fa-sun' : 'fa-moon'} w-8` }> </i>
< span className = {`${!isOpen ? 'hidden' : 'block'} ml-2`}>
  { isDarkMode? 'Light Mode': 'Dark Mode' }
  </span>
  </button>
  </div>
  </div>

  < div className = "flex-1 flex flex-col relative pt-16 pl-16" >
    

      
            </div>
       

      
    </div>
  )
}

