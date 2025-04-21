// src/services/authService.ts

const API_BASE_URL = 'http://localhost:8082/api/auth';

export const loginUser = async (email: string, password: string) => {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  return response.json(); // Expected: { token: 'JWT_TOKEN_HERE' }
};

export const registerUser = async (email: string, password: string) => {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password, role: 'user' }), // Default role set to 'user'
  });

  if (!response.ok) {
    throw new Error('Registration failed');
  }

  return response.json(); // Optional: return success message
};

export const storeToken = (token: string) => {
  localStorage.setItem('authToken', token);
};

export const getToken = (): string | null => {
  return localStorage.getItem('authToken');
};

export const logout = () => {
  localStorage.removeItem('authToken');
};
