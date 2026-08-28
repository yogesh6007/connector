import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => authService.getCurrentUser());
  const [role, setRole] = useState(() => currentUser?.role || 'student');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser?.role) {
      setRole(currentUser.role);
    }
  }, [currentUser]);

  const login = async (email, password, selectedRole) => {
    setLoading(true);
    try {
      const res = await authService.login(email, password, selectedRole);
      if (res.success) {
        setCurrentUser(res.user);
        setRole(res.user.role);
      }
      return res;
    } finally {
      setLoading(false);
    }
  };

  const registerStudent = async (formData) => {
    setLoading(true);
    try {
      const res = await authService.registerStudent(formData);
      if (res.success) {
        setCurrentUser(res.user);
        setRole('student');
      }
      return res;
    } finally {
      setLoading(false);
    }
  };

  const registerOrganizer = async (formData) => {
    setLoading(true);
    try {
      const res = await authService.registerOrganizer(formData);
      if (res.success) {
        setCurrentUser(res.user);
        setRole('organizer');
      }
      return res;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    const defaultStudent = authService.getCurrentUser();
    setCurrentUser(defaultStudent);
    setRole(defaultStudent.role || 'student');
  };

  const switchRole = (targetRole) => {
    const switchedUser = authService.switchRole(targetRole);
    setCurrentUser(switchedUser);
    setRole(targetRole);
    return switchedUser;
  };

  const updateProfile = (updatedFields) => {
    const updated = { ...currentUser, ...updatedFields };
    setCurrentUser(updated);
    localStorage.setItem('connector_auth_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role,
        isStudent: role === 'student',
        isOrganizer: role === 'organizer',
        login,
        registerStudent,
        registerOrganizer,
        logout,
        switchRole,
        updateProfile,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
