import React from 'react';
import ChatDisplay from './ChatDisplay';
import Message from './Message';

// Sample messages for standalone testing
const sampleMessages = [
  { role: 'user', content: 'Hello! How are you?' },
  { role: 'assistant', content: 'I am doing well, thank you for asking! How can I help you today?' },
  { role: 'user', content: 'Tell me about the weather.' },
  { role: 'assistant', content: 'I don\'t have access to real-time weather data. To get accurate weather information, I recommend checking a weather service or app that provides current forecasts based on your location.' }
];

// For standalone testing
const TestChatDisplay = () => {
  const [messages, setMessages] = React.useState(sampleMessages);
  const [isLoading, setIsLoading] = React.useState(false);

  const toggleLoading = () => {
    setIsLoading(!isLoading);
  };

  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      backgroundColor: '#343541',
      color: 'white'
    }}>
      <div style={{ padding: '10px', textAlign: 'center', backgroundColor: '#444654' }}>
        <h2>Chat Display Component Test</h2>
        <button onClick={toggleLoading}>
          {isLoading ? 'Stop Loading' : 'Show Loading'}
        </button>
      </div>
      <ChatDisplay 
        messages={messages}
        isLoading={isLoading}
      />
    </div>
  );
};

// Only mount if this file is loaded directly, not when imported
if (document.getElementById('root')) {
  const rootElement = document.getElementById('root');
  if (rootElement) {
    const reactRoot = ReactDOM.createRoot(rootElement);
    reactRoot.render(<TestChatDisplay />);
  }
}

export { ChatDisplay, Message };
