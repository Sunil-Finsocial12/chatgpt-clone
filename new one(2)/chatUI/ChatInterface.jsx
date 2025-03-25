import React, { useState, useEffect } from 'react';
import './ChatInterface.css';
import { MessageDisplay } from './messageDisplay';
import { InputArea } from './inputArea';

/**
 * Main Chat Interface component that combines MessageDisplay and InputArea
 * @param {Object} props - Component props
 * @param {boolean} props.sidebarOpen - Whether the sidebar is open
 * @param {string} props.language - UI language code
 * @param {string} props.model - AI model to use
 * @returns {JSX.Element} ChatInterface component
 */
const ChatInterface = ({ sidebarOpen, language = 'en-US', model = 'gpt-3.5-turbo' }) => {
  const [messages, setMessages] = useState([]);
  const [reasoning, setReasoning] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(language);
  const [currentModel, setCurrentModel] = useState(model);
  const [showReasoning, setShowReasoning] = useState(true);

  // Update when props change
  useEffect(() => {
    setCurrentLanguage(language);
    setCurrentModel(model);
  }, [language, model]);

  const handleSendMessage = async (messageText) => {
    const userMessage = { role: 'user', content: messageText };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setIsLoading(true);

    try {
      // Simulate AI response with a delay
      setTimeout(() => {
        // For demonstration purposes, show reasoning if the message contains "reason", "explain", or "why"
        const shouldShowReasoning = /reason|explain|why|how|calculate/i.test(messageText);
        
        const aiResponse = { 
          role: 'assistant', 
          content: `This is an AI response using ${currentModel} model in ${currentLanguage} to: "${messageText}"` 
        };
        
        setMessages(prevMessages => [...prevMessages, aiResponse]);
        
        if (shouldShowReasoning) {
          setReasoning([
            { step: 1, content: "Analyzing the question..." },
            { step: 2, content: `Processing using ${currentModel}` },
            { step: 3, content: "Generating response based on available data" },
            { step: 4, content: "Formatting output for better readability" }
          ]);
        } else {
          setReasoning([]);
        }
        
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error generating response:', error);
      const errorMessage = { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error processing your request.' 
      };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
      setReasoning([]);
      setIsLoading(false);
    }
  };

  return (
    <div 
      className={`chat-container ${!sidebarOpen ? 'full-width' : ''}`}
      data-testid="chat-interface"
      data-language={currentLanguage}
      data-model={currentModel}
    >
      <div className="chat-content">
        <MessageDisplay 
          messages={messages}
          reasoning={showReasoning ? reasoning : []}
          isLoading={isLoading}
        />
      </div>
      <div className="chat-input-container">
        <InputArea 
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          language={currentLanguage}
        />
      </div>
    </div>
  );
};

export default ChatInterface;
