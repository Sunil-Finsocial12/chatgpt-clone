import React from 'react';
import ReactDOM from 'react-dom';
import InputArea from './InputArea';
import './styles.css';

// For standalone testing
const TestInputArea = () => {
  const [message, setMessage] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [language, setLanguage] = React.useState('en-US');

  const handleSendMessage = (text) => {
    setMessage(text);
    setIsLoading(true);
    console.log(`Message sent: ${text}`);
    
    // Simulate response delay
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      backgroundColor: '#343541',
      color: 'white',
      justifyContent: 'flex-end'
    }}>
      <div style={{ 
        padding: '10px', 
        backgroundColor: '#444654',
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h2>Input Area Component Test</h2>
        <div>
          <label style={{ marginRight: '10px', color: '#ccc' }}>Language:</label>
          <select 
            value={language} 
            onChange={(e) => setLanguage(e.target.value)}
            style={{ padding: '5px', backgroundColor: '#202123', color: 'white', border: '1px solid #444654' }}
          >
            <option value="en-US">English (US)</option>
            <option value="es-ES">Spanish</option>
            <option value="fr-FR">French</option>
            <option value="de-DE">German</option>
            <option value="zh-CN">Chinese (Simplified)</option>
            <option value="hi-IN">Hindi</option>
          </select>
        </div>
      </div>
      
      {message && (
        <div style={{ padding: '20px', backgroundColor: '#444654', margin: '0 20px 20px', borderRadius: '5px' }}>
          <strong>Last message:</strong> {message}
        </div>
      )}
      
      <InputArea 
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        language={language}
      />
    </div>
  );
};

// Only mount if this file is loaded directly, not when imported
if (document.getElementById('root')) {
  ReactDOM.render(
    <React.StrictMode>
      <TestInputArea />
    </React.StrictMode>,
    document.getElementById('root')
  );
}

export { InputArea };
