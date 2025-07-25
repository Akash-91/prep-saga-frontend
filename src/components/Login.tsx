import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Login.css';

interface LoginProps {
  onLoginSuccess: () => void; // Function to close modal after successful login
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const loggedInUser = await login(email, password); // Login with email/password

      if (loggedInUser) {
        console.log('User role:', loggedInUser.role);

        // Navigate to the correct dashboard based on user role
        if (loggedInUser.role === 'ADMIN') {
          navigate('/adminDashboard');
        } else {
          navigate('/userDashboard');
        }

        // Close the login modal after successful login
        onLoginSuccess();
      } else {
        alert('Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Redirect to backend OAuth2 login endpoint (this starts the Google OAuth flow)
    window.location.href = `${process.env.REACT_APP_BACKEND_URL}/oauth2/authorization/google`;
  };

  return (
    <div className="auth-form">
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      {/* Divider */}
      <div style={{ textAlign: "center", margin: "20px 0" }}>
        <span>OR</span>
      </div>

      {/* Google Login Button */}
      <button onClick={handleGoogleLogin} className="google-login-btn">
        <img src="/assets/google-icon.png" alt="Google Icon" style={{ width: "20px", marginRight: "10px" }} />
        Login with Google
      </button>
    </div>
  );
};

export default Login;
