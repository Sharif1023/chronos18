
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Admin email configuration
const ADMIN_EMAIL = "sharifislam02001@gmail.com"; 

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowAllUsers?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowAllUsers = false }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-champagne dark:bg-obsidian font-sans">
        <div className="text-center space-y-4 animate-pulse">
          <p className="tracking-[0.5em] text-gold text-[10px] uppercase font-black">Verifying Credentials</p>
        </div>
      </div>
    );
  }

  // Not logged in at all
  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Logged in, but if it's admin-only and user is NOT admin
  if (!allowAllUsers && user.email !== ADMIN_EMAIL) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
