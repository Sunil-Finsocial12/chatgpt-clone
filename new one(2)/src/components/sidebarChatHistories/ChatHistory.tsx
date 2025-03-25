import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSession } from '../../context/SessionContext';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Link2, Plus } from 'lucide-react'; // added plus icon import
import { downloadChat } from "./downloadChat"; // new import
import { fetchChatHistory } from "./fetchChatHistory"; // new import

interface ChatHistoryProps {
  isDarkMode: boolean;
  chats: any[]; // Replace with proper Chat type
  handleStarChat: (chatId: string, e: React.MouseEvent) => void;
  handleDeleteChat: (chatId: string, e: React.MouseEvent) => void;
  handleChatSelect: (chat: any) => void;
}

// Add more dummy data with varied timestamps
const dummyChatHistory = [

];

export const ChatHistory: React.FC<ChatHistoryProps> = ({
  isDarkMode,
  chats,
  handleStarChat,
  handleDeleteChat,
  handleChatSelect,
}) => {
  const { session } = useSession();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'starred' | 'recent'>('all');
  const [fetchedChats, setFetchedChats] = useState<any[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  // NEW: loading state for chat history
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // New API fetching effect
  useEffect(() => {
    const username = session?.userName || localStorage.getItem('userName');
    if (username) {
      setIsLoading(true);
      fetchChatHistory(username)
        .then(mappedChats => {
          setFetchedChats(mappedChats);
          setIsLoading(false);
        })
        .catch(error => {
          console.error("Error fetching chat history:", error);
          setIsLoading(false);
        });
    }
  }, [session]);

  // Use fetchedChats if available otherwise fall back to dummyChatHistory
  const activeChats = fetchedChats.length > 0 ? fetchedChats : dummyChatHistory;

  // Enhanced filtering logic with new condition
  const filteredChats = activeChats.filter(chat => {
    // Only include chats with a non-empty first message that does not start with 'Chat'
    if (!chat.title || chat.title.trim() === "" || chat.title.startsWith("Chat")) {
      return false;
    }
    const matchesSearch = chat.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          chat.category.toLowerCase().includes(searchTerm.toLowerCase());
    switch(filter) {
      case 'starred':
        return matchesSearch && chat.isStarred;
      case 'recent':
        return matchesSearch && (
          chat.timestamp.includes('mins') ||
          chat.timestamp.includes('hour')
        );
      default:
        return matchesSearch;
    }
  });

  const handleDownloadChat = async (chat: any) => {
    try {
      const username = session?.userName || localStorage.getItem('userName');
      const response = await fetch('http://saveai.tech/chat/detailed-history', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, chat_id: chat.id })
      });
      const data = await response.json();
      const fileData = JSON.stringify(data, null, 2);
      const blob = new Blob([fileData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${chat.title || 'chat'}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading chat details:", error);
    }
  };

  // New function to handle creating a new chat
  const handleNewChatClicked = () => {
    const newChat = {
      id: `new-chat-${Date.now()}`,
      title: "New Chat",
      timestamp: new Date().toLocaleString(),
      isStarred: false,
      category: ""
    };
    handleChatSelect(newChat);
  };

  return (
    <div className={`min-h-screen p-6 ${isDarkMode ? 'bg-black text-blue-100' : 'bg-blue-50 text-blue-900'}`}> 
      <h1 className="text-xl font-bold mb-4">Chat History</h1>
     
      {/* Updated search input and button to follow homepage theme */}
      <div className="flex mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Search chats..."
          className={`flex-1 p-2 rounded-l-lg focus:outline-none ${
            isDarkMode
              ? 'bg-black border border-gray-700 text-blue-100 placeholder-blue-400'
              : 'bg-blue-50 border border-blue-200 text-blue-900'
          }`}
        />
        <button
          onClick={() => {}}
          className={`p-2 rounded-r-lg transition-colors duration-300 border-l-0 ${
            isDarkMode
              ? 'bg-black border border-gray-700 text-blue-100 hover:bg-gray-800'
              : 'bg-blue-50 border border-blue-200 text-blue-900 hover:bg-blue-200 hover:text-blue-900'
          }`}
        >
          Search
        </button>
      </div>
      {/* Wrap chat list in a fixed-height container to maintain background */}
      <div className="overflow-hidden min-h-[300px]">
        {isLoading ? (
          <p className="text-center">Loading chat history...</p>
        ) : filteredChats.length === 0 ? (
          <p>No chat history available.</p>
        ) : (
          <TransitionGroup component="div" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {/* New Chat box updated with new handler */}
            <CSSTransition key="new-chat" timeout={300} classNames="fade">
              <div
                onClick={handleNewChatClicked}
                className="p-6 rounded-2xl shadow-lg transition-transform duration-300 ease-in-out transform hover:scale-105 hover:shadow-2xl hover:shadow-green-500/50 cursor-pointer border border-transparent hover:border-gradient-to-r hover:from-green-400 hover:to-green-500 bg-black hover:bg-gray-800 hover:text-blue-100"
              >
                <div className="flex flex-col items-center justify-center h-full">
                  <Plus className="w-6 h-6 mb-2" />
                  <span className="font-bold text-lg">New Chat</span>
                </div>
              </div>
            </CSSTransition>
            {filteredChats.map((chat: any) => (
              <CSSTransition key={chat.id} timeout={300} classNames="fade">
                <div
                  onClick={() => { 
                  setCurrentChatId(chat.id); 
                  handleChatSelect(chat);
                  
                  // Fetch detailed chat history
                  const username = session?.userName || localStorage.getItem('userName');
                  if (username) {
                    fetch('http://saveai.tech/chat/detailed-history', {
                    method: 'POST',
                    headers: {
                      'accept': 'application/json',
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                      username,
                      chat_id: chat.id
                    })
                    })
                    .then(response => response.json())
                    .then(data => {
                    console.log("Chat detailed history:", data);
                    })
                    .catch(error => {
                    console.error("Error fetching chat details:", error);
                    });
                  }
                  }}
                  className={`p-6 rounded-2xl shadow-lg transition-transform duration-300 ease-in-out transform 
                  hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/50 
                  ${isDarkMode
                    ? (currentChatId === chat.id ? "bg-blue-900" : "bg-black") + " hover:bg-gray-800 hover:text-blue-100"
                    : "bg-blue-100 hover:bg-blue-200 hover:text-blue-900"} 
                  cursor-pointer border border-solid ${isDarkMode ? 'border-gray-700' : 'border-gray-300'} hover:border-gradient-to-r hover:from-blue-400 hover:to-purple-400`}
                >
                  <div className="flex items-center justify-between mb-4">
                  <div className="font-bold text-lg">{chat.title}</div>
                  <Link2 className="w-6 h-6 text-gray-500" />
                  </div>
                  <div className="text-sm text-gray-500">
                  {chat.timestamp ? 
                    (chat.timestamp.includes('/') || chat.timestamp.includes('-')) ? 
                    chat.timestamp.split(',')[0].trim() : 
                    chat.timestamp 
                    : ''}
                  </div>
                  {/* Updated Download button */}
                  <button
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    downloadChat(chat, session?.userName);
                  }}
                  className="mt-2 inline-block px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                  >
                  Download
                  </button>
                </div>
              </CSSTransition>
            ))}
          </TransitionGroup>
        )}
      </div>
    </div>
  );
};

export default ChatHistory;
