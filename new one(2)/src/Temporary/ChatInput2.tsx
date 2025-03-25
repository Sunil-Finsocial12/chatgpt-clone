import React from 'react';

interface ChatInput2Props {
  isDarkMode: boolean;
  onSubmit?: (message: string) => void;
}

const ChatInput2: React.FC<ChatInput2Props> = ({ isDarkMode = true, onSubmit }) => {
  const [message, setMessage] = React.useState('');

  const handleTextAreaResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    const value = textarea.value;

    if (!value.trim()) {
      textarea.style.height = '56px';
    } else {
      textarea.style.height = 'inherit';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }

    setMessage(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && onSubmit) {
      onSubmit(message);
      setMessage('');
      const textarea = document.querySelector('textarea');
      if (textarea) {
        textarea.style.height = '56px';
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto px-4">
      <div className={`chat-input-container relative ${isDarkMode ? "moving-border" : ""}`}>
        <textarea
          value={message}
          onChange={handleTextAreaResize}
          placeholder="Type your message..."
          className={`w-full resize-none focus:outline-none rounded-3xl transition-colors duration-200 p-8 text-md ${
            isDarkMode
              ? 'bg-gray-800 text-white placeholder-gray-400'
              : 'bg-white text-gray-800 placeholder-gray-500'
          }`}
          style={{
            minHeight: '500px',
            maxHeight: '500px'
          }}
        />
      </div>
    </form>
  );
};

export default ChatInput2;