import React, { createContext, useState, useContext, useEffect } from 'react';

type UserProfile = {
  name: string;
  email: string;
  picture?: string;
};

type SessionContextType = {
  isAuthenticated: boolean;
  userProfile: UserProfile | null;
  login: (userData: UserProfile) => void;
  logout: () => void;
};

const defaultContext: SessionContextType = {
  isAuthenticated: false,
  userProfile: null,
  login: () => {},
  logout: () => {},
};

const SessionContext = createContext<SessionContextType>(defaultContext);

export const useSession = () => useContext(SessionContext);

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    // Load user data from localStorage on initialization
    const storedUser = localStorage.getItem('user');
    const authStatus = localStorage.getItem('isAuthenticated');
    
    if (storedUser && authStatus === 'true') {
      setUserProfile(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = (userData: UserProfile) => {
    setIsAuthenticated(true);
    setUserProfile(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('isAuthenticated', 'true');
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserProfile(null);
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
  };

  return (
    <SessionContext.Provider value={{ isAuthenticated, userProfile, login, logout }}>
      {children}
    </SessionContext.Provider>
  );
};
