import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import SocialCallback from './pages/SocialCallback';
import MusicShell from '../music_front_v3/src/MusicShell';
import { PlayerProvider } from '../music_front_v3/src/context/PlayerContext';
import PlayerBar from '../music_front_v3/src/components/PlayerBar';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Public Route Component (redirect if already logged in)
const PublicRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return !isAuthenticated ? children : <Navigate to="/" replace />;
};

import VideoPage from './pages/VideoPage';
import ImagePage from './pages/ImagePage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <PlayerProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/image" element={<ImagePage />} />
            <Route path="/video" element={<VideoPage />} />
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />

            {/* Music App (public) */}
            <Route path="/music/*" element={<MusicShell />} />

            {/* Social Login Callback */}
            <Route path="/social-callback" element={<SocialCallback />} />

            {/* Protected Routes (예시) */}
            {/* <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            /> */}

            {/* 404 Not Found */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <PlayerBar />
        </PlayerProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
