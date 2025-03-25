import React, { useState } from "react";

interface Chat {
  id: number;
  title: string;
  isStarred: boolean;
}

interface ChatTabsProps {
  chats: Chat[];
  handleChatSelect: (chat: Chat) => void;
  isDarkMode: boolean;
}

const ChatTabs: React.FC<ChatTabsProps> = ({ chats, handleChatSelect, isDarkMode }) => {
  const [selectedTab, setSelectedTab] = useState("starred");
  const [isDialogVisible, setIsDialogVisible] = useState(false);

  const toggleDialog = (tab: string) => {
    if (selectedTab === tab && isDialogVisible) {
      setIsDialogVisible(false);
    } else {
      setSelectedTab(tab);
      setIsDialogVisible(true);
    }
  };

  return (
    // <div className={`mt-10 flex flex-col items-center ${isDarkMode ? 'dark' : ''}`}>
    //   {/* Tabs for switching between Starred and Recent Chats */}
    //   <div className="flex space-x-4 mb-4">
    //     <button
    //       className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
    //         selectedTab === "starred" 
    //           ? "bg-blue-500 text-white dark:bg-blue-700 dark:text-gray-100" 
    //           : isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-700"
    //       }`}
    //       onClick={() => toggleDialog("starred")}
    //     >
    //       Starred Chats
    //     </button>
    //     <button
    //       className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
    //         selectedTab === "recent" 
    //           ? "bg-blue-500 text-white dark:bg-blue-700 dark:text-gray-100" 
    //           : isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-700"
    //       }`}
    //       onClick={() => toggleDialog("recent")}
    //     >
    //       Recent Chats
    //     </button>
    //   </div>

    //   {/* Chat List Section */}
    //   {isDialogVisible && (
    //     <div className="w-full max-w-md dark:bg-gray-900 p-4 rounded-lg shadow-md ">
    //       {selectedTab === "starred" ? (
    //         chats.filter((chat) => chat.isStarred).length > 0 ? (
    //           <ul className="space-y-2">
    //             {chats
    //               .filter((chat) => chat.isStarred)
    //               .slice(0, 3)
    //               .map((chat) => (
    //                 <li
    //                   key={`starred_${chat.id}`}
    //                   className="p-2 rounded-lg  flex justify-between items-center cursor-pointer  dark:hover:bg-gray-800"
    //                   onClick={() => handleChatSelect(chat)}
    //                 >
    //                   <span className="truncate  dark:text-gray-200">{chat.title}</span>
    //                   <i className="fas fa-star text-yellow-500"></i>
    //                 </li>
    //               ))}
    //           </ul>
    //         ) : (
    //           <p className="text-center text-gray-500 dark:text-gray-400">No starred chats yet</p>
    //         )
    //       ) : chats.length > 0 ? (
    //         <ul className="space-y-2">
    //           {chats.slice(0, 3).map((chat) => (
    //             <li
    //               key={`recent_${chat.id}`}
    //               className="p-2 rounded-lg  flex justify-between items-center cursor-pointer  dark:hover:bg-gray-800"
    //               onClick={() => handleChatSelect(chat)}
    //             >
    //               <span className="truncate  dark:text-gray-200">{chat.title}</span>
    //               <i className="fas fa-history text-gray-400 dark:text-gray-500"></i>
    //             </li>
    //           ))}
    //         </ul>
    //       ) : (
    //         <p className="text-center text-gray-500 dark:text-gray-400">No recent chats available</p>
    //       )}
    //     </div>
    //   )}
    // </div>
    <></>
  );
};

export default ChatTabs;
