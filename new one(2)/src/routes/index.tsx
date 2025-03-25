import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useSession } from '../context/SessionContext';
import MainLayout from '../components/MainLayout';
// Use default import for ChatHistory
import ChatHistory from '../components/sidebarChatHistories/ChatHistory';
import { useTheme } from '../context/ThemeContext';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session } = useSession();
  const navigate = useNavigate();

  if (session === undefined) return <div>Loading...</div>;

  if (session === null) {
    navigate('/', { replace: true });
    return null;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  const { isDarkMode } = useTheme();
  const { session } = useSession();
  const navigate = useNavigate();

  return (
    <Routes>
      <Route path="/" element={<MainLayout />} />
      <Route
        path="/chat-history"
        element={
          <ProtectedRoute>
            <ChatHistory
              isDarkMode={isDarkMode}
              chats={session?.chats || []}
              handleStarChat={(chatId, e) => {
                e.stopPropagation();
                // Your star chat logic
              }}
              handleDeleteChat={(chatId, e) => {
                e.stopPropagation();
                // Your delete chat logic
              }}
              handleChatSelect={(chat) => {
                navigate('/');
                // Your chat select logic
              }}
            />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
