import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';
import { registerUser } from '../services/authService'; // Import registerUser function

interface AuthContextType {
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string) => Promise<boolean>; // Make sure register is part of the context
  logout: () => void;
  isAuthenticated: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!token);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await axios.post('http://localhost:8082/api/auth/login', {
        email,
        password,
      });
      const { token } = response.data;
      localStorage.setItem('token', token);
      setToken(token);
      setIsAuthenticated(true);
      setError(null); // Clear errors on success
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
      setIsAuthenticated(false);
      return false;
    }
  };

  const register = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await registerUser(email, password); // Call registerUser
      const { token } = response.data; // Optionally handle token for registration if required
      localStorage.setItem('token', token); // Optionally store the token
      setToken(token); // Set the token after successful registration
      setIsAuthenticated(true); // Update isAuthenticated state
      setError(null); // Clear errors
      return true;
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Registration failed';
      setError(message);
      setIsAuthenticated(false); // Ensure isAuthenticated is false on failure
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ token, login, register, logout, isAuthenticated, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
