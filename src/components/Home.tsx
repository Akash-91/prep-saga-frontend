import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear token
    localStorage.removeItem('token');
    // Redirect to login
    navigate('/login');
  };

  return (
    <div>
      <h2>Welcome to PrepSaga!</h2>
      <p>You are now authenticated.</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Home;
