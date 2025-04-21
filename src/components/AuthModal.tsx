import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';
import './AuthModal.css'; // Create a CSS file to style this modal

const AuthModal = ({ closeModal }: { closeModal: () => void }) => {
  const [showLogin, setShowLogin] = useState(true); // Toggle between login and register form

  const toggleForm = () => {
    setShowLogin(!showLogin);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>{showLogin ? 'Login' : 'Register'}</h2>
          <button onClick={closeModal} className="close-btn">X</button>
        </div>
        <div className="modal-body">
          {showLogin ? (
            <Login onLoginSuccess={closeModal} /> // Passing the closeModal as the onLoginSuccess callback
          ) : (
            <Register />
          )}
        </div>
        <div className="modal-footer">
          <p>
            {showLogin ? "Don't have an account?" : 'Already have an account?'}
            <span onClick={toggleForm} className="toggle-link">
              {showLogin ? 'Register' : 'Login'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
