import React from 'react';
import { FaUserAlt, FaRobot } from 'react-icons/fa';
import './Message.css';

const Message = ({ message }) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={`message ${isUser ? 'user' : 'assistant'}`}>
      <div className="message-avatar">
        {isUser ? <FaUserAlt /> : <FaRobot />}
      </div>
      <div className="message-content">
        <p>{message.content}</p>
      </div>
    </div>
  );
};

export default Message;
