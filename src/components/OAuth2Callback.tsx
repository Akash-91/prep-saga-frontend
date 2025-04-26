import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const OAuth2Callback: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token'); // Make sure the backend sends the token as a query param

    if (token) {
      localStorage.setItem('token', token);
      login(token) // Pass token directly to the login function
        .then((loggedInUser) => {
          // After login is successful, navigate to the user dashboard
          if (loggedInUser) {
            if (loggedInUser.role === 'ADMIN') {
              navigate('/adminDashboard');
            } else {
              navigate('/userDashboard');
            }
          }
        })
        .catch((err) => {
          console.error('Error logging in via OAuth2:', err);
          navigate('/'); // Redirect to home if an error occurs
        });
    } else {
      navigate('/'); // Redirect to home if no token is present
    }
  }, [login, navigate]);

  return <div>Loading...</div>; // Show a loading screen while processing OAuth2 callback
};

export default OAuth2Callback;
