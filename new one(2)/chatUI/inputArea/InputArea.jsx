import React, { useState, useEffect, useRef } from 'react';
import { FaPaperPlane, FaMicrophone } from 'react-icons/fa';
import './InputArea.css';

/**
 * Component for text input and message submission
 * @param {Object} props - Component props
 * @param {Function} props.onSendMessage - Function to call when message is sent
 * @param {boolean} props.isLoading - Whether the system is currently processing a request
 * @param {string} props.language - Current UI language code
 * @returns {JSX.Element} InputArea component
 */
const InputArea = ({ onSendMessage, isLoading = false, language = 'en-US' }) => {
  const [input, setInput] = useState('');
  const [placeholder, setPlaceholder] = useState('Send a message...');
  const textareaRef = useRef(null);

  // Update placeholder based on language
  useEffect(() => {
    switch (language) {
      case 'es-ES':
        setPlaceholder('Envía un mensaje...');
        break;
      case 'fr-FR':
        setPlaceholder('Envoyez un message...');
        break;
      case 'de-DE':
        setPlaceholder('Senden Sie eine Nachricht...');
        break;
      case 'zh-CN':
        setPlaceholder('向AI助手发送消息...');
        break;
      case 'hi-IN':
        setPlaceholder('संदेश भेजें...');
        break;
      default:
        setPlaceholder('Send a message...');
    }
  }, [language]);

  // Auto-resize textarea on content change
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [input]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim()) {
        onSendMessage(input);
        setInput('');
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <form className="input-area" onSubmit={handleSubmit} aria-label="Message input form" data-testid="input-area">
      <textarea
        ref={textareaRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="message-input"
        disabled={isLoading}
        rows={1}
        lang={language}
        aria-label="Message input"
      />
      <button type="button" className="mic-button" onClick={() => console.log('Mic clicked')} disabled={isLoading} aria-label="Voice input" data-testid="mic-button">
        <FaMicrophone />
      </button>
      <button type="submit" className="send-button" disabled={!input.trim() || isLoading} aria-label="Send message" data-testid="send-button">
        <FaPaperPlane />
      </button>
    </form>
  );
};

export default InputArea;
