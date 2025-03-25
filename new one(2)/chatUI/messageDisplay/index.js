import React from 'react';
import ReactDOM from 'react-dom';
import { ChatDisplay } from './chatDisplay';
import { ReasoningDisplay } from './reasoning';
import './styles.css';

// Combined MessageDisplay component that uses both ChatDisplay and ReasoningDisplay
const MessageDisplay = ({ messages = [], reasoning = [], isLoading = false }) => {
  return (
    <div className="message-display">
      <ChatDisplay messages={messages} isLoading={isLoading} />
      {reasoning.length > 0 && <ReasoningDisplay steps={reasoning} />}
    </div>
  );
};

// Sample data for standalone testing
const sampleData = {
  messages: [
    { role: 'user', content: 'Explain how to calculate the factorial of 5' },
    { role: 'assistant', content: 'The factorial of 5 is 5! = 5 × 4 × 3 × 2 × 1 = 120.' },
  ],
  reasoning: [
    { step: 1, content: "We need to calculate 5!" },
    { step: 2, content: "Multiply 5 × 4 = 20" },
    { step: 3, content: "Multiply 20 × 3 = 60" },
    { step: 4, content: "Multiply 60 × 2 = 120" },
    { step: 5, content: "Multiply 120 × 1 = 120" },
    { step: 6, content: "Therefore, 5! = 120" }
  ]
};

// For standalone testing
const TestMessageDisplay = () => {
  const [messages, setMessages] = React.useState(sampleData.messages);
  const [reasoning, setReasoning] = React.useState(sampleData.reasoning);
  const [isLoading, setIsLoading] = React.useState(false);
  const [showReasoning, setShowReasoning] = React.useState(true);

  const toggleLoading = () => {
    setIsLoading(!isLoading);
  };

  const toggleReasoning = () => {
    setShowReasoning(!showReasoning);
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
        <h2>Message Display Component Test</h2>
        <div>
          <button onClick={toggleLoading} style={{ marginRight: '10px' }}>
            {isLoading ? 'Stop Loading' : 'Show Loading'}
          </button>
          <button onClick={toggleReasoning}>
            {showReasoning ? 'Hide Reasoning' : 'Show Reasoning'}
          </button>
        </div>
      </div>
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <MessageDisplay 
          messages={messages}
          reasoning={showReasoning ? reasoning : []}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

// Only mount if this file is loaded directly, not when imported
if (document.getElementById('root')) {
  ReactDOM.render(
    <React.StrictMode>
      <TestMessageDisplay />
    </React.StrictMode>,
    document.getElementById('root')
  );
}

export { MessageDisplay, ChatDisplay, ReasoningDisplay };
