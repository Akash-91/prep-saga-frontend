// src/components/PrivateRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import jwt from 'jsonwebtoken';

// Define the interface for the decoded JWT payload
interface DecodedToken {
  role: string;
  // Add other fields from the decoded JWT if needed
}

const decodeJwtRole = (token: string): string | null => {
  try {
    // Decode the JWT token (without verifying signature)
    const decoded = jwt.decode(token) as DecodedToken;
    return decoded?.role || null;  // Return the role or null if not found
  } catch (error) {
    console.error('Error decoding JWT token:', error);
    return null;
  }
};

interface PrivateRouteProps {
  children: React.ReactNode;
  requiredRole: 'user' | 'admin';
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, requiredRole }) => {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Assume we have a way to decode JWT and check the role
  const userRole = decodeJwtRole(token); // Implement JWT decoding function

  if (userRole !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
