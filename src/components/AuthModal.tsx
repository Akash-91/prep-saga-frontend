import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';
import './AuthModal.css';

interface AuthModalProps {
  closeModal: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ closeModal }) => {
  const [showLogin, setShowLogin] = useState(true);

  const toggleForm = () => setShowLogin(prev => !prev);

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>{showLogin ? 'Login' : 'Register'}</h2>
          <button onClick={closeModal} className="close-btn">×</button>
        </div>
        <div className="modal-body">
          {showLogin ? (
            <Login onLoginSuccess={closeModal} />
          ) : (
            <Register />
          )}
        </div>
        <div className="modal-footer">
          <p>
            {showLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
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
