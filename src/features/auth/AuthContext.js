import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../../utils/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Initialize user from localStorage if present
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);

  // On login, call backend and save user/token to localStorage
  const login = async (email, password) => {
    setLoading(true);
    const response = await api.post('/auth/login', { email, password });
    if (response.data && response.data.success && response.data.data) {
      let { user: userObj, token } = response.data.data;
      // Normalize role to lowercase for frontend routing
      userObj = { ...userObj, role: userObj.role.toLowerCase() };
      setUser(userObj);
      localStorage.setItem('user', JSON.stringify(userObj));
      localStorage.setItem('token', token);
      setLoading(false);
      return userObj.role;
    } else {
      setLoading(false);
      throw new Error(response.data?.error || 'Login failed');
    }
  };

  // On logout, remove user and token from localStorage
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  // Sync user state with localStorage if changed elsewhere
  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
    setLoading(false);
    const syncUser = () => {
      const stored = localStorage.getItem('user');
      if (!stored && user) setUser(null);
      if (stored && !user) setUser(JSON.parse(stored));
    };
    window.addEventListener('storage', syncUser);
    return () => window.removeEventListener('storage', syncUser);
    // eslint-disable-next-line
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
} 