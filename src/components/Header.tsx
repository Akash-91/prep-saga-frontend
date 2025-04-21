import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Header.css';
import logo from '../assets/prepSaga.png'; // ✅ Import the logo properly

interface HeaderProps {
  openModal: () => void;
}

const Header: React.FC<HeaderProps> = ({ openModal }) => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-left">
      <img src={logo} alt="Prep Saga Logo" className="logo" />
      <span className="tagline">From Code to Career — Get Ready for Your Dream Job !</span>
      </div>
      <div className="header-right">
        {!isAuthenticated ? (
          <button className="auth-button" onClick={openModal}>
            Login / Register
          </button>
        ) : (
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
