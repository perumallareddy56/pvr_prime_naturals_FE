import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setCurrentUser(user);
    }
    setLoading(false);

    const handleAuthExpired = () => {
      setCurrentUser(null);
    };
    window.addEventListener('auth-expired', handleAuthExpired);
    return () => window.removeEventListener('auth-expired', handleAuthExpired);
  }, []);

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data));
      setCurrentUser(response.data);
    }
    return response.data;
  };

  const register = async (name, email, password) => {
    return await api.post('/auth/register', { name, email, password });
  };

  const logout = () => {
    localStorage.removeItem('user');
    setCurrentUser(null);
  };

  const isAdmin = () => {
    return currentUser?.roles?.includes('ROLE_ADMIN');
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, register, logout, isAdmin, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
