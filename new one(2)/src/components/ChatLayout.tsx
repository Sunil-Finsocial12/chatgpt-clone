import React, { ReactNode } from 'react';

interface ChatLayoutProps {
  children: ReactNode;
  isSliderOpen: boolean;
}

const ChatLayout: React.FC<ChatLayoutProps> = ({ children, isSliderOpen }) => {
  return (
    <div className="relative h-screen overflow-hidden">
      <div
        className={`transition-all duration-300 ease-in-out
          ${isSliderOpen ? 
            'lg:pr-[35%] md:pr-[45%] pr-0' : 
            'w-full'
          }
        `}
      >
        <div className="h-screen overflow-y-auto px-2 sm:px-4 md:px-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ChatLayout;
