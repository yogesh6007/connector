import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const RouteGuard = ({ children, allowedRoles = [] }) => {
  const { user, role, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    // If student tries to access organizer, redirect to student dashboard
    if (role === 'student') {
      return <Navigate to="/student/dashboard" replace />;
    }
    // If organizer tries to access student, redirect to organizer dashboard
    if (role === 'organizer') {
      return <Navigate to="/organizer/dashboard" replace />;
    }
  }

  return children;
};
