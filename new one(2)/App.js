import React, { useState, useEffect } from 'react';
import { Sidebar } from './sidebar';
import { ChatInterface } from './chatUI';
import './App.css';

/**
 * Main App component that coordinates between Sidebar and ChatInterface
 * and manages shared state
 */
function App() {
  // State for sidebar visibility
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // State for settings that are shared between components
  const [settings, setSettings] = useState({
    language: 'en-US',
    model: 'gpt-3.5-turbo'
  });
  
  // Save settings to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('chatAppSettings', JSON.stringify(settings));
    } catch (error) {
      console.error('Could not save settings to localStorage', error);
    }
  }, [settings]);
  
  // Load settings from localStorage on initial render
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('chatAppSettings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error('Could not load settings from localStorage', error);
    }
  }, []);

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Handle settings changes from Sidebar component
  const handleSettingsChange = (setting, value) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
    console.log(`App: Setting changed: ${setting} = ${value}`);
  };

  return (
    <div className="app" data-testid="app-container">
      <Sidebar 
        isOpen={isSidebarOpen} 
        toggleSidebar={toggleSidebar} 
        onSettingsChange={handleSettingsChange}
        language={settings.language}
        model={settings.model}
      />
      <ChatInterface 
        sidebarOpen={isSidebarOpen} 
        language={settings.language}
        model={settings.model}
      />
    </div>
  );
}

export default App;
