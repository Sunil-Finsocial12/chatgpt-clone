import React, { useRef, useEffect } from 'react';
import Message from './Message';
import './MessageDisplay.css';

/**
 * Component for displaying chat messages
 * @param {Object} props - Component props
 * @param {Array} props.messages - Array of message objects with role and content
 * @param {boolean} props.isLoading - Whether the AI is currently generating a response
 * @returns {JSX.Element} MessageDisplay component
 */
const MessageDisplay = ({ messages = [], isLoading = false }) => {
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);

  // Scroll to bottom when messages change or when loading state changes
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end'
      });
    }
  }, [messages, isLoading]);

  return (
    <div 
      className="message-display-container" 
      ref={containerRef} 
      data-testid="message-display"
    >
      <div className="messages-wrapper">
        {messages.length === 0 ? (
          <div className="empty-chat">
            <h2>How can I help you today?</h2>
            <p>Start a conversation with the AI assistant</p>
          </div>
        ) : (
          <div className="message-list">
            {messages.map((message, index) => (
              <Message 
                key={index} 
                message={message} 
                data-testid={`message-${index}`}
              />
            ))}
            {isLoading && (
              <div className="message assistant" data-testid="typing-indicator">
                <div className="message-inner">
                  <div className="message-avatar">
                    <div className="avatar-placeholder"></div>
                  </div>
                  <div className="message-content">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} className="scroll-anchor" />
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageDisplay;
