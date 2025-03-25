import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { SessionProvider } from './context/SessionContext';
import { ThemeProvider } from './context/ThemeContext';
import AppRoutes from './routes';

const App = () => {
  return (
    <SessionProvider>
      <ThemeProvider>
        <Router>
          <AppRoutes />
        </Router>
      </ThemeProvider>
    </SessionProvider>
  );
};

export default App;
// wasuppppp
