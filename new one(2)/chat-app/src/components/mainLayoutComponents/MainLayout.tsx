import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "../../context/SessionContext";

interface MainLayoutProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({ isDarkMode, toggleDarkMode }) => {
  const navigate = useNavigate();
  const { isAuthenticated, userProfile, logout } = useSession();
  const [inputText, setInputText] = useState("");

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    alert(`Message sent: ${inputText}`);
    setInputText("");
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? "dark bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-800"}`}>
      <div className="flex flex-col h-screen">
        <header className="bg-blue-600 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold">Chat Application</h1>
            <div className="flex items-center gap-4">
              <button
                onClick={toggleDarkMode}
                className="px-3 py-1 rounded bg-blue-700 hover:bg-blue-800"
              >
                {isDarkMode ? "Light Mode" : "Dark Mode"}
              </button>
              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <span>Hello, {userProfile?.name || "User"}</span>
                  <button
                    onClick={logout}
                    className="px-3 py-1 rounded bg-red-600 hover:bg-red-700"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button className="px-3 py-1 rounded bg-green-600 hover:bg-green-700">
                  Login
                </button>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4">
          <div className="container mx-auto max-w-4xl">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-4">
              <h2 className="text-lg font-semibold mb-3">Welcome to the Chat App</h2>
              <p>This is a basic implementation of the chat interface.</p>
            </div>
            
            <div className="mt-6">
              <div className="space-y-4">
                {/* Example message exchange */}
                <div className="flex justify-end">
                  <div className="bg-blue-600 text-white rounded-lg px-4 py-2 max-w-md">
                    Hello, how can I help you today?
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="bg-gray-200 dark:bg-gray-700 rounded-lg px-4 py-2 max-w-md">
                    I'm just testing this chat interface.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        <footer className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="container mx-auto max-w-4xl">
            <div className="flex items-center">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-l-md bg-white dark:bg-gray-800"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-md disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default MainLayout;
