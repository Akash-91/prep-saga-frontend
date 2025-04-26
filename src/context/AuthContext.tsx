import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

interface User {
  role: string;
  email: string;
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  login: (email?: string, password?: string, googleToken?: string) => Promise<User | null>;
  register: (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!token);
  const [error, setError] = useState<string | null>(null);

  // Decode JWT payload (after stripping 'Bearer ')
  function decodeJWT(token: string): any {
    const pureToken = token.replace('Bearer ', '');
    const base64Url = pureToken.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
        .join('')
    );
    return JSON.parse(jsonPayload);
  }

  const login = async (
    email?: string,
    password?: string,
    googleToken?: string
  ): Promise<User | null> => {
    if (email && password) {
      // Email/password login
      try {
        const response = await axios.post('http://localhost:8082/api/auth/login', { email, password });
        const { token: bearerToken, role, email: userEmail } = response.data;

        localStorage.setItem('token', bearerToken);
        setToken(bearerToken);
        setIsAuthenticated(true);
        setError(null);

        const decoded = decodeJWT(bearerToken);
        const userData: User = {
          role: decoded.role || role,
          email: decoded.sub || userEmail,
        };
        setUser(userData);
        return userData;
      } catch (err: any) {
        setError(err.response?.data?.message || 'Login failed');
        setIsAuthenticated(false);
        setUser(null);
        return null;
      }
    } else if (googleToken) {
      // Google OAuth login
      try {
        const response = await axios.post('http://localhost:8082/api/auth/google-login', { token: googleToken });
        const { token: bearerToken, role, email: userEmail } = response.data;

        localStorage.setItem('token', bearerToken);
        setToken(bearerToken);
        setIsAuthenticated(true);
        setError(null);

        const decoded = decodeJWT(bearerToken);
        const userData: User = {
          role: decoded.role || role,
          email: decoded.sub || userEmail,
        };
        setUser(userData);
        return userData;
      } catch (err: any) {
        setError(err.response?.data?.message || 'Google login failed');
        setIsAuthenticated(false);
        setUser(null);
        return null;
      }
    } else {
      // Handle case where neither email/password nor googleToken is provided
      setError('No login method provided');
      return null;
    }
  };

  const register = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      await axios.post('http://localhost:8082/api/auth/register', {
        firstName,
        lastName,
        email,
        password,
      });
      setError(null);
      return true;
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Registration failed');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, register, logout, isAuthenticated, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
