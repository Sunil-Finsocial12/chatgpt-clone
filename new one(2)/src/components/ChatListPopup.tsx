import React, { useState, useEffect, useMemo } from 'react';
import { Chat } from '../types';

interface ChatListPopupProps {
  isOpen: boolean;
  onClose: () => void;
  chats: Chat[];
  onChatSelect: (chat: Chat) => void;
  onStarChat: (chatId: string, e: React.MouseEvent) => void;
  onDeleteChat: (chatId: string, e: React.MouseEvent) => void;
  isDarkMode: boolean;
  initialTab?: 'starred' | 'all';
}

export const ChatListPopup: React.FC<ChatListPopupProps> = ({
  isOpen,
  onClose,
  chats,
  onChatSelect,
  onStarChat,
  onDeleteChat,
  isDarkMode,
  initialTab = 'all'
}) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isTabChanging, setIsTabChanging] = useState(false);

  // Reset animation state when popup closes
  useEffect(() => {
    if (!isOpen) {
      setIsAnimating(false);
    } else {
      // Small delay to ensure animation triggers
      const timer = setTimeout(() => {
        setIsAnimating(true);
      }, 10);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleTabChange = (tab: 'starred' | 'all') => {
    if (tab === activeTab) return;
    setIsTabChanging(true);
    setActiveTab(tab);
    // Reset tab change animation after transition
    setTimeout(() => setIsTabChanging(false), 300);
  };

  if (!isOpen) return null;

  const displayChats = activeTab === 'starred' ? chats.filter(chat => chat.isStarred) : chats;

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose} // Add click handler to close popup
      style={{
        opacity: isAnimating ? 1 : 0,
        transition: 'opacity 300ms ease-in-out'
      }}
    >
      <div 
        className={`w-full max-w-3xl h-[65vh] bg-opacity-100 rounded-xl shadow-lg overflow-hidden flex flex-col ${
          isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
        }`}
        onClick={e => e.stopPropagation()} // Prevent closing when clicking inside popup
        style={{
          transform: isAnimating ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(10px)',
          opacity: isAnimating ? 1 : 0,
          transition: 'transform 300ms ease-out, opacity 300ms ease-in-out'
        }}
      >
        {/* Tabs section */}
        <div className="grid grid-cols-2 divide-x divide-gray-700">
          <button
            onClick={() => handleTabChange('starred')}
            className={`py-4 text-base font-medium transition-all duration-300 ${
              activeTab === 'starred'
                ? isDarkMode 
                  ? 'bg-gray-700 text-white' 
                  : 'bg-gray-100 text-gray-900'
                : isDarkMode
                  ? 'text-gray-400 hover:bg-gray-700/50'
                  : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <i className="fas fa-star text-yellow-500 mr-2"></i>
            Starred ({chats.filter(chat => chat.isStarred).length})
          </button>
          <button
            onClick={() => handleTabChange('all')}
            className={`py-4 text-base font-medium transition-all duration-300 ${
              activeTab === 'all'
                ? isDarkMode 
                  ? 'bg-gray-700 text-white' 
                  : 'bg-gray-100 text-gray-900'
                : isDarkMode
                  ? 'text-gray-400 hover:bg-gray-700/50'
                  : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <i className="fas fa-comments mr-2"></i>
            All Chats ({chats.length})
          </button>
        </div>

        {/* Chat list with transition */}
        <div className="flex-1 overflow-y-auto p-6">
          <div 
            className="space-y-3 transition-all duration-300"
            style={{
              opacity: isTabChanging ? 0 : 1,
              transform: isTabChanging ? 'translateY(10px)' : 'translateY(0)'
            }}
          >
            {displayChats.length > 0 ? (
              <div className="space-y-3">
                {displayChats.map(chat => (
                  <div
                    key={chat.id}
                    onClick={() => {
                      onChatSelect(chat);
                      onClose();
                    }}
                    className={`group flex items-center justify-between p-4 rounded-lg cursor-pointer ${
                      isDarkMode 
                        ? 'hover:bg-gray-700/50 text-gray-200' 
                        : 'hover:bg-gray-100 text-gray-800'
                    }`}
                  >
                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                      <i className={`fas fa-comment-alt text-base ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-400'
                      }`}></i>
                      <span className={`truncate text-base ${
                        isDarkMode ? 'text-gray-200' : 'text-gray-800'
                      }`}>{chat.title}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onStarChat(chat.id, e);
                        }}
                        className={`transition-colors p-2 rounded-full ${
                          chat.isStarred 
                            ? 'text-yellow-400' 
                            : isDarkMode
                              ? 'text-gray-300 hover:text-yellow-400'
                              : 'text-gray-400 hover:text-yellow-500'
                        }`}
                      >
                        <i className="fas fa-star text-base"></i>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteChat(chat.id, e);
                        }}
                        className={`transition-colors p-2 rounded-full ${
                          isDarkMode
                            ? 'text-gray-300 hover:text-red-400'
                            : 'text-gray-400 hover:text-red-500'
                        }`}
                      >
                        <i className="fas fa-trash text-base"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={`text-center py-10 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-400'
              }`}>
                {/* <i className={`fas ${activeTab === 'starred' ? 'fa-star' : 'fa-comments'} text-4xl mb-3 opacity-50`}></i> */}
                <p className="text-base">
                  {/* {activeTab === 'starred' ? 'No starred chats' : 'No chats available'} */}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatListPopup;
