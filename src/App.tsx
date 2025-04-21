import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import Header from './components/Header';
import AuthModal from './components/AuthModal';
import { useAuth } from './context/AuthContext';
import Hero from './components/Hero';
import Dashboard from './components/Dashboard';


const App: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const { isAuthenticated } = useAuth();
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const navigate = useNavigate();

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  useEffect(() => {
    if (isAuthenticated) {
      setWelcomeMessage('Welcome to Prep Saga');
      setTimeout(() => setWelcomeMessage(''), 3000);
    }
  }, [isAuthenticated]);

  return (
    <div className="app">
      <Header openModal={openModal} />

      {showModal && <AuthModal closeModal={closeModal} />}

      <Routes>
        <Route
          path="/userDashboard"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />}
        />
       <Route path="/" element={<Hero onLoginClick={openModal} />} />
      </Routes>
    </div>
  );
};

export default App;
