import React from 'react';
import ReasoningDisplay from './ReasoningDisplay';

// For standalone testing
const TestReasoningDisplay = () => {
  const [reasoningSteps, setReasoningSteps] = React.useState([
    { step: 1, content: "Let's analyze this problem step by step" },
    { step: 2, content: "First, we need to understand the requirements" },
    { step: 3, content: "Then, we'll break it down into smaller tasks" },
    { step: 4, content: "Finally, we'll implement each part systematically" }
  ]);

  return (
    <div style={{ 
      height: '100vh', 
      padding: '20px',
      backgroundColor: '#343541',
      color: 'white' 
    }}>
      <h2>Reasoning Display Test</h2>
      <ReasoningDisplay steps={reasoningSteps} />
    </div>
  );
};

// Only mount if this file is loaded directly, not when imported
if (document.getElementById('root')) {
  const rootElement = document.getElementById('root');
  if (rootElement) {
    const reactRoot = ReactDOM.createRoot(rootElement);
    reactRoot.render(<TestReasoningDisplay />);
  }
}

export { ReasoningDisplay };
