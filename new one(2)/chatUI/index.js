import React from 'react';
import ReactDOM from 'react-dom';
import ChatInterface from './ChatInterface';
import { MessageDisplay } from './messageDisplay';
import { InputArea } from './inputArea';
import './styles.css';

// For standalone testing
const TestChatInterface = () => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const [settings, setSettings] = React.useState({
    language: 'en-US',
    model: 'gpt-3.5-turbo'
  });

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ 
        width: '260px', 
        backgroundColor: '#202123', 
        display: isSidebarOpen ? 'block' : 'none' 
      }}></div>
      <div style={{ flex: 1 }}>
        <ChatInterface 
          sidebarOpen={isSidebarOpen}
          language={settings.language}
          model={settings.model}
        />
      </div>
      <div style={{ position: 'fixed', top: '10px', left: '10px', zIndex: 1000 }}>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          Toggle Sidebar
        </button>
        <select 
          value={settings.language} 
          onChange={(e) => setSettings({...settings, language: e.target.value})}
          style={{ margin: '0 10px' }}
        >
          <option value="en-US">English</option>
          <option value="es-ES">Spanish</option>
          <option value="fr-FR">French</option>
        </select>
        <select 
          value={settings.model} 
          onChange={(e) => setSettings({...settings, model: e.target.value})}
        >
          <option value="gpt-3.5-turbo">GPT-3.5</option>
          <option value="gpt-4">GPT-4</option>
        </select>
      </div>
    </div>
  );
};

// Only mount if this file is loaded directly, not when imported
if (document.getElementById('root')) {
  ReactDOM.render(
    <React.StrictMode>
      <TestChatInterface />
    </React.StrictMode>,
    document.getElementById('root')
  );
}

// Export all chat UI components
export { ChatInterface, MessageDisplay, InputArea };
