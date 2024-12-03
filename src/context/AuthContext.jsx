import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: localStorage.getItem('token') || null,
    user: JSON.parse(localStorage.getItem('user')) || null,
  });

  useEffect(() => {
    if (auth.token) {
      const decodedToken = jwtDecode(auth.token);
      const expirationTime = decodedToken.exp * 1000;

      if (expirationTime < Date.now()) {
        // Token expired, handle re-authentication or refresh
        handleRefreshToken();
      }
    }
  }, [auth.token]);

  // Handle refresh token
  const handleRefreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        // No refresh token, log the user out
        logout();
        return;
      }

      const response = await axios.post('https://speechee-backend-production.up.railway.app/api/v1/account/api/token/refresh/', { refresh: refreshToken });
      const newToken = response.data.access;
      const newUser = jwtDecode(newToken);
      
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(newUser));
      setAuth({ token: newToken, user: newUser });
    } catch (error) {
      console.error('Failed to refresh token:', error);
      logout();
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuth({ token: null, user: null });
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

