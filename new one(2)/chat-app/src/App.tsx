import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { SessionProvider } from './context/SessionContext';
import MainLayout from './components/mainLayoutComponents/MainLayout';

function App() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(
    localStorage.getItem('darkMode') === 'true'
  );

  useEffect(() => {
    localStorage.setItem('darkMode', isDarkMode.toString());
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <SessionProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />} />
        </Routes>
      </Router>
    </SessionProvider>
  );
}

export default App;
