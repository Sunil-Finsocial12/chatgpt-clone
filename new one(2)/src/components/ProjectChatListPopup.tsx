import React, { useState, useEffect } from 'react';
import { Chat, Project } from '../types';

interface ProjectChatListPopupProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
  chats: Chat[];
  onChatSelect: (chat: Chat) => void;
  onDeleteChat: (chatId: string, e: React.MouseEvent) => void;
  isDarkMode: boolean;
}

const ProjectChatListPopup: React.FC<ProjectChatListPopupProps> = ({
  isOpen,
  onClose,
  project,
  chats,
  onChatSelect,
  onDeleteChat,
  isDarkMode,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setIsAnimating(false);
    } else {
      const timer = setTimeout(() => setIsAnimating(true), 10);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen || !project) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
      style={{
        opacity: isAnimating ? 1 : 0,
        transition: 'opacity 300ms ease-in-out'
      }}
    >
      <div 
        className={`w-full max-w-2xl h-[65vh] bg-opacity-100 rounded-xl shadow-lg overflow-hidden flex flex-col ${
          isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
        }`}
        onClick={e => e.stopPropagation()}
        style={{
          transform: isAnimating ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(10px)',
          opacity: isAnimating ? 1 : 0,
          transition: 'transform 300ms ease-out, opacity 300ms ease-in-out'
        }}
      >
        {/* Header */}
        <div className={`p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <i className="fa-regular fa-folder-open text-blue-400 text-xl"></i>
              <h2 className={`text-lg font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                {project.name}
              </h2>
            </div>
            <button
              onClick={() => onClose()}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>

        {/* Chat list */}
        <div className="flex-1 overflow-y-auto p-4">
          {chats && chats.length > 0 ? (
            <div className="space-y-2">
              {chats.map(chat => (
                <div
                  key={chat.id}
                  onClick={() => {
                    onChatSelect(chat);
                    onClose();
                  }}
                  className={`group flex items-center justify-between p-3 rounded-lg cursor-pointer ${
                    isDarkMode 
                      ? 'hover:bg-gray-700/50 text-gray-200' 
                      : 'hover:bg-gray-100 text-gray-800'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <i className="fas fa-comment-alt text-gray-400"></i>
                    <span className="truncate">{chat.title}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteChat(chat.id, e);
                    }}
                    className={`p-2 rounded-full opacity-0 group-hover:opacity-100 transition-colors ${
                      isDarkMode
                        ? 'hover:bg-gray-600 text-gray-400 hover:text-red-400'
                        : 'hover:bg-gray-200 text-gray-500 hover:text-red-500'
                    }`}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className={`text-center py-10 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <i className="fas fa-comments text-4xl mb-3 opacity-50"></i>
              <p>No chats in this project yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectChatListPopup;
