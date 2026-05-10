import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Navigate } from 'react-router-dom';

const AuthContext = createContext();

const AUTH_KEY = 'authToken';

function getStoredAuth() {
  try {
    return localStorage.getItem(AUTH_KEY) === 'true';
  } catch {
    return false;
  }
}

export function AuthProvider({ children }) {
  const [isLogged, setIsLogged] = useState(getStoredAuth);

  const login = useCallback(() => {
    localStorage.setItem(AUTH_KEY, 'true');
    setIsLogged(true);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_KEY);
    setIsLogged(false);
  }, []);

  return (
    <AuthContext.Provider value={{ isLogged, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export function RequireAuth({ children }) {
  const { isLogged } = useAuth();
  return isLogged ? children : <Navigate to="/" />;
}
