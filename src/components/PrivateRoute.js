import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import '../styles/App.css';

const PrivateRoute = ({ children }) => {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading your notes...</p>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/" replace />;
  return children;
};

export default PrivateRoute;
