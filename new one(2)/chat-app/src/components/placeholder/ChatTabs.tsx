import React from 'react';

interface Chat {
  id: string;
  title: string;
  messages: any[];
  isStarred?: boolean;
  isEditing?: boolean;
  projectId?: string;
  lastModified?: Date;
}

interface ChatTabsProps {
  chats: Chat[];
  handleChatSelect: (chat: Chat) => void;
  isDarkMode: boolean;
}

const ChatTabs: React.FC<ChatTabsProps> = ({ chats, handleChatSelect, isDarkMode }) => {
  // Get the three most recent chats
  const recentChats = chats.slice(0, 3);
  
  if (recentChats.length === 0) return null;
  
  return (
    <div className="mt-8">
      <h3 className={`mb-3 text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        Recent Conversations
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {recentChats.map(chat => (
          <div 
            key={chat.id}
            onClick={() => handleChatSelect(chat)}
            className={`p-4 rounded-lg cursor-pointer transition-colors ${
              isDarkMode 
                ? 'bg-gray-800 hover:bg-gray-700 text-gray-200'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
            }`}
          >
            <h4 className="font-medium text-sm truncate">{chat.title}</h4>
            <p className="text-xs mt-1 opacity-70 truncate">
              {chat.messages[0]?.content.substring(0, 60) || "Start a new conversation"}
              {chat.messages[0]?.content.length > 60 ? "..." : ""}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatTabs;
