import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface User {
  _id: string;
  name: string;
  lastname: string;
  username: string;
  email?: string;
}

interface SessionContextType {
  isAuthenticated: boolean;
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  login: (accessToken: string, refreshToken: string, user: User) => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export { SessionContext };

interface SessionProviderProps {
  children: ReactNode;
}

export const SessionProvider: React.FC<SessionProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const stored = localStorage.getItem('isAuthenticated');
    return stored ? true : false;
  });
  
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  const [accessToken, setAccessToken] = useState<string | null>(() => {
    const stored = localStorage.getItem('accessToken');
    return stored;
  });

  const [refreshToken, setRefreshToken] = useState<string | null>(() => {
    const stored = localStorage.getItem('refreshToken');
    return stored;
  });

  // Guardar en localStorage cuando cambien los estados
  useEffect(() => {
    localStorage.setItem('isAuthenticated', JSON.stringify(isAuthenticated));
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('accessToken', JSON.stringify(accessToken));
  }, [accessToken]);

  useEffect(() => {
    localStorage.setItem('refreshToken', JSON.stringify(refreshToken));
  }, [refreshToken]);

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  const login = (accessToken: string, refreshToken: string, user: User) => {
    setIsAuthenticated(true);
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    setUser(user);
  };

  const value: SessionContextType = {
    isAuthenticated,
    user,
    accessToken,
    refreshToken,
    logout,
    updateUser,
    login,
  };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = (): SessionContextType => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession debe ser usado dentro de un SessionProvider');
  }
  return context;
};