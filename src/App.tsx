import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import Header from './components/Header';
import AuthModal from './components/AuthModal';
import { useAuth } from './context/AuthContext';
import Hero from './components/Hero';
import UserDashboard from './components/UserDashboard';
import TopicDetail from './pages/TopicDetail';
import AdminDashboard from './components/AdminDashboard';
import OAuth2Callback from './components/OAuth2Callback';  // adjust path if necessary


const App: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const navigate = useNavigate();

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

useEffect(() => {
  if (isAuthenticated && user?.role) {
    setWelcomeMessage('Welcome to Prep Saga');
    setTimeout(() => setWelcomeMessage(''), 3000);
  }
}, [isAuthenticated, user]);


  return (
    <div className="app">
      <Header openModal={openModal} />
      {showModal && <AuthModal closeModal={closeModal} />}

      <Routes>
        {/* Public Hero */}
        <Route path="/" element={<Hero onLoginClick={openModal} />} />

        {/* Protected Routes based on roles */}
        <Route
          path="/userDashboard"
          element={
            isAuthenticated ? (
              user?.role === 'USER' ? (
                <UserDashboard />
              ) : (
                <Navigate to="/adminDashboard" />
              )
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/adminDashboard"
          element={
            isAuthenticated ? (
              user?.role === 'ADMIN' ? (
                <AdminDashboard />
              ) : (
                <Navigate to="/userDashboard" />
              )
            ) : (
              <Navigate to="/" />
            )
          }
        />


        <Route
          path="/topics/:title"
          element={isAuthenticated ? <TopicDetail /> : <Navigate to="/" />}
        />


        <Route
          path="/oauth2/callback"
          element={<OAuth2Callback />}
          // This route handles the response from the OAuth2 provider
        />

      </Routes>
    </div>
  );
};

export default App;
